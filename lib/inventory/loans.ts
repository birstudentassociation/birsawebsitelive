/**
 * Data-access layer for the loan lifecycle (requests, decisions, checkout,
 * checkin, cancellation) in the inventory management suite.
 *
 * Guarded against a missing `POSTGRES_URL`, matching the convention in
 * lib/equipment-loan.ts: reads return empty/neutral values and writes return
 * an explicit `{ ok: false, reason: "not-configured" }` rather than
 * throwing, so the site stays buildable and renderable with zero
 * environment configuration.
 *
 * Every function here that closes a loan (rejection in decideLoan, return in
 * checkinLoan, cancellation in cancelLoan) sets `closed_at`, which starts
 * the two-year retention clock in lib/privacy/retention.ts. There is no
 * `no_show` transition function yet, but `no_show` is a terminal status
 * (db/migrations/005_loans.sql) that retention.ts already treats as closed;
 * if a no-show transition is ever added here, it must set `closed_at` too.
 */
import { sql, isInventoryConfigured } from "@/lib/inventory/db";
import type { VercelPoolClient } from "@/lib/inventory/db";
import { todayInBangkok } from "@/lib/bangkok-today";
import type {
  Loan,
  LoanStatus,
  TrackingMode,
  UnitCondition,
  UnitState,
} from "@/lib/inventory/types";
import { upsertBorrower, countActiveLoans } from "@/lib/inventory/borrowers";
import { isRealCalendarDate } from "@/lib/validation";

/** Used when a borrower's max_concurrent_loans is null. */
const DEFAULT_MAX_CONCURRENT_LOANS = 3;

type LoanRow = {
  id: string;
  reference: string;
  item_id: string;
  unit_id: string | null;
  borrower_id: string;
  quantity: number;
  start_date: string;
  end_date: string;
  reason: string | null;
  status: LoanStatus;
  decided_by: string | null;
  decided_at: string | null;
  checked_out_by: string | null;
  checked_out_at: string | null;
  checked_in_by: string | null;
  checked_in_at: string | null;
  condition_out: UnitCondition | null;
  condition_in: UnitCondition | null;
  created_at: string;
  closed_at: string | null;
};

function mapRow(row: LoanRow): Loan {
  return {
    id: row.id,
    reference: row.reference,
    itemId: row.item_id,
    unitId: row.unit_id,
    borrowerId: row.borrower_id,
    quantity: row.quantity,
    startDate: row.start_date,
    endDate: row.end_date,
    reason: row.reason,
    status: row.status,
    decidedBy: row.decided_by,
    decidedAt: row.decided_at,
    checkedOutBy: row.checked_out_by,
    checkedOutAt: row.checked_out_at,
    checkedInBy: row.checked_in_by,
    checkedInAt: row.checked_in_at,
    conditionOut: row.condition_out,
    conditionIn: row.condition_in,
    createdAt: row.created_at,
    closedAt: row.closed_at,
  };
}

function isExclusionViolation(err: unknown): boolean {
  return !!err && typeof err === "object" && (err as { code?: string }).code === "23P01";
}

/**
 * Runs `body` inside a single database transaction, following the pattern in
 * lib/privacy/retention.ts.
 *
 * Every loan transition below updates the loan row and then the state of the
 * unit attached to it. Those two writes have to land together: if the process
 * is killed between them (a serverless timeout or a dropped connection, both
 * ordinary on Vercel), the loan and its unit disagree — a returned loan whose
 * unit is still `on_loan` never becomes available again, and a unit stuck at
 * `reserved` is quietly withdrawn from circulation with nothing in the UI to
 * explain why. Rolling back is the only way to keep those two rows honest.
 *
 * Errors propagate to the caller after the rollback, so each function's
 * existing `catch` still maps them to `{ ok: false, ... }`.
 */
async function withTransaction<T>(body: (client: VercelPoolClient) => Promise<T>): Promise<T> {
  const client = await sql.connect();
  try {
    await client.query("begin");
    const result = await body(client);
    await client.query("commit");
    return result;
  } catch (err) {
    try {
      await client.query("rollback");
    } catch {
      // The connection is already unusable; the original error is the one
      // worth reporting.
    }
    throw err;
  } finally {
    client.release();
  }
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export function deriveUnitState(
  current: UnitState,
  activeStatuses: LoanStatus[],
  conditionIn?: UnitCondition | null
): UnitState {
  if (current === "retired") {
    return current;
  }
  if (conditionIn === "lost") {
    return "retired";
  }
  if (current === "maintenance") {
    return current;
  }
  if (conditionIn === "damaged") {
    return "maintenance";
  }
  if (activeStatuses.some((status) => status === "checked_out" || status === "overdue")) {
    return "on_loan";
  }
  if (activeStatuses.includes("approved")) {
    return "reserved";
  }
  return "available";
}

async function syncUnitState(
  client: VercelPoolClient,
  unitId: string,
  conditionIn?: UnitCondition | null
): Promise<void> {
  const unitResult = await client.query<{ state: UnitState }>(
    `select state from units where id = $1 for update`,
    [unitId]
  );
  const unit = unitResult.rows[0];
  if (!unit) {
    return;
  }

  const loansResult = await client.query<{ status: LoanStatus }>(
    `select status from loans
     where unit_id = $1 and status in ('approved', 'checked_out', 'overdue')`,
    [unitId]
  );
  const next = deriveUnitState(
    unit.state,
    loansResult.rows.map((row) => row.status),
    conditionIn
  );

  await client.query(
    `update units set state = $1, condition = coalesce($2, condition), updated_at = now()
     where id = $3`,
    [next, conditionIn ?? null, unitId]
  );
}

/** Builds a short human-friendly reference, e.g. "FAK-7Q2X" for "first-aid-kit". */
export function generateReference(itemKey: string): string {
  const initials = itemKey
    .split("-")
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 3);
  const prefix = initials || "EQP";

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"; // base32 (RFC 4648, no padding)
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}-${suffix}`;
}

/**
 * Availability for a date range. Asset items count units with no overlapping
 * active loan; consumable items fall back to items.qty_on_hand (no
 * unit-level tracking). Neutral zeroed result (configured:false) when the
 * inventory backend isn't configured, so the public wizard degrades.
 */
export async function getItemAvailabilityForRange(
  itemKey: string,
  startDate: string,
  endDate: string
): Promise<{ total: number; available: number; configured: boolean }> {
  if (!isInventoryConfigured()) {
    return { total: 0, available: 0, configured: false };
  }

  try {
    const itemResult = await sql<{
      id: string;
      tracking_mode: TrackingMode;
      qty_on_hand: number | null;
    }>`
      select id, tracking_mode, qty_on_hand from items
      where key = ${itemKey} and is_retired = false
      limit 1
    `;
    const item = itemResult.rows[0];
    if (!item) {
      return { total: 0, available: 0, configured: true };
    }

    if (item.tracking_mode === "consumable") {
      const qty = item.qty_on_hand ?? 0;
      return { total: qty, available: qty, configured: true };
    }

    const totalResult = await sql<{ count: string }>`
      select count(*)::text as count
      from units
      where item_id = ${item.id} and state <> 'retired'
    `;
    const total = Number(totalResult.rows[0]?.count ?? 0);

    const availableResult = await sql<{ count: string }>`
      select count(*)::text as count
      from units u
      where u.item_id = ${item.id}
        and u.state not in ('maintenance', 'retired')
        and not exists (
          select 1 from loans l
          where l.unit_id = u.id
            and (
              (
                l.status in ('pending', 'approved')
                and daterange(l.start_date, l.end_date, '[]') && daterange(${startDate}::date, ${endDate}::date, '[]')
              )
              or (
                l.status in ('checked_out', 'overdue')
                and daterange(
                  l.start_date,
                  case when l.end_date < ${todayInBangkok()}::date then null else l.end_date end,
                  '[]'
                ) && daterange(${startDate}::date, ${endDate}::date, '[]')
              )
            )
        )
    `;
    const available = Number(availableResult.rows[0]?.count ?? 0);

    return { total, available, configured: true };
  } catch {
    return { total: 0, available: 0, configured: true };
  }
}

export async function createLoanRequest(input: {
  itemKey: string;
  startDate: string;
  endDate: string;
  reason?: string | null;
  quantity?: number;
  borrower: { tuStudentId: string; name: string; email: string; phone?: string | null };
}): Promise<
  | { ok: true; reference: string }
  | {
      ok: false;
      reason:
        | "not-configured"
        | "invalid"
        | "unavailable"
        | "blocklisted"
        | "limit-exceeded"
        | "email-mismatch"
        | "error";
    }
> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const itemResult = await sql<{ id: string; max_loan_days: number }>`
      select id, max_loan_days from items
      where key = ${input.itemKey}
        and is_retired = false
        and online_loanable = true
        and tracking_mode = 'asset'
      limit 1
    `;
    const item = itemResult.rows[0];
    if (!item) {
      return { ok: false, reason: "invalid" };
    }

    if (!isRealCalendarDate(input.startDate) || !isRealCalendarDate(input.endDate)) {
      return { ok: false, reason: "invalid" };
    }
    const start = new Date(input.startDate);
    const end = new Date(input.endDate);

    // Bangkok's calendar day, not the server's UTC one: otherwise a pickup
    // date that is already in the past in Thailand slips through for the
    // seven hours a day the two disagree.
    const today = todayInBangkok();
    if (input.startDate < today || input.endDate < input.startDate) {
      return { ok: false, reason: "invalid" };
    }

    const durationDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (durationDays > item.max_loan_days) {
      return { ok: false, reason: "invalid" };
    }

    // The borrower row stays locked from the upsert until commit, so two
    // simultaneous requests from one student queue up here and the second
    // sees the first's loan when it counts.
    return await withTransaction(async (client) => {
      const upserted = await upsertBorrower(input.borrower, client);
      if (!upserted.ok) {
        return { ok: false as const, reason: upserted.reason };
      }
      const borrower = upserted.borrower;
      if (borrower.blocklisted) {
        return { ok: false as const, reason: "blocklisted" as const };
      }

      const activeCount = await countActiveLoans(borrower.id, client);
      const limit = borrower.maxConcurrentLoans ?? DEFAULT_MAX_CONCURRENT_LOANS;
      if (activeCount >= limit) {
        return { ok: false as const, reason: "limit-exceeded" as const };
      }

      const availability = await getItemAvailabilityForRange(
        input.itemKey,
        input.startDate,
        input.endDate
      );
      if (availability.available <= 0) {
        return { ok: false as const, reason: "unavailable" as const };
      }

      // Retry a small number of times in the rare event of a reference
      // collision (the column has a unique constraint).
      for (let attempt = 0; attempt < 5; attempt++) {
        const reference = generateReference(input.itemKey);
        const inserted = await client.query(
          `insert into loans (reference, item_id, borrower_id, quantity, start_date, end_date, reason, status)
           values ($1, $2, $3, $4, $5, $6, $7, 'pending')
           on conflict (reference) do nothing
           returning id`,
          [
            reference,
            item.id,
            borrower.id,
            input.quantity ?? 1,
            input.startDate,
            input.endDate,
            input.reason ?? null,
          ]
        );
        if (inserted.rows.length > 0) {
          return { ok: true as const, reference };
        }
      }
      throw new Error("Could not generate a unique loan reference");
    });
  } catch {
    return { ok: false, reason: "error" };
  }
}

export async function listLoans(opts?: {
  status?: LoanStatus;
  borrowerId?: string;
  itemId?: string;
}): Promise<Loan[]> {
  if (!isInventoryConfigured()) {
    return [];
  }

  try {
    const values: unknown[] = [];
    const conditions: string[] = [];
    if (opts?.status) {
      values.push(opts.status);
      conditions.push(`status = $${values.length}`);
    }
    if (opts?.borrowerId) {
      values.push(opts.borrowerId);
      conditions.push(`borrower_id = $${values.length}`);
    }
    if (opts?.itemId) {
      values.push(opts.itemId);
      conditions.push(`item_id = $${values.length}`);
    }

    const where = conditions.length > 0 ? `where ${conditions.join(" and ")}` : "";
    const result = await sql.query<LoanRow>(
      `select * from loans ${where} order by created_at desc`,
      values
    );
    return result.rows.map(mapRow);
  } catch {
    return [];
  }
}

export async function getLoan(id: string): Promise<Loan | null> {
  if (!isInventoryConfigured() || !isUuid(id)) {
    return null;
  }

  try {
    const result = await sql<LoanRow>`
      select * from loans where id = ${id} limit 1
    `;
    const row = result.rows[0];
    return row ? mapRow(row) : null;
  } catch {
    return null;
  }
}

/** Case-insensitive email match with an exact reference, for student self-service lookup. */
export async function getLoanByReferenceAndEmail(
  reference: string,
  email: string
): Promise<Loan | null> {
  if (!isInventoryConfigured()) {
    return null;
  }

  try {
    const result = await sql<LoanRow>`
      select l.*
      from loans l
      join borrowers b on b.id = l.borrower_id
      where l.reference = ${reference} and lower(b.email) = lower(${email})
      limit 1
    `;
    const row = result.rows[0];
    return row ? mapRow(row) : null;
  } catch {
    return null;
  }
}

export async function decideLoan(input: {
  id: string;
  decision: "approved" | "rejected";
  officerId: string;
  unitId?: string;
}): Promise<
  | { ok: true; loan: Loan }
  | {
      ok: false;
      reason:
        | "not-configured"
        | "not-found"
        | "already-decided"
        | "unit-required"
        | "unit-not-found"
        | "unit-invalid"
        | "unavailable"
        | "error";
    }
> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const existing = await getLoan(input.id);
    if (!existing) {
      return { ok: false, reason: "not-found" };
    }
    if (existing.status !== "pending") {
      return { ok: false, reason: "already-decided" };
    }

    if (input.decision === "rejected") {
      // closed_at starts the two-year retention clock (lib/privacy/retention.ts);
      // a rejected loan is closed the moment it's rejected.
      const result = await sql<LoanRow>`
        update loans
        set status = 'rejected', decided_by = ${input.officerId}, decided_at = now(), closed_at = now()
        where id = ${input.id} and status = 'pending'
        returning *
      `;
      const row = result.rows[0];
      if (!row) {
        return { ok: false, reason: "already-decided" };
      }
      return { ok: true, loan: mapRow(row) };
    }

    // approved
    if (!input.unitId) {
      return { ok: false, reason: "unit-required" };
    }
    if (!isUuid(input.unitId)) {
      return { ok: false, reason: "unit-not-found" };
    }

    const unitId = input.unitId;
    const today = todayInBangkok();
    let outcome:
      | { kind: "approved"; row: LoanRow }
      | { kind: "already-decided" | "unit-not-found" | "unit-invalid" | "unavailable" };
    try {
      outcome = await withTransaction(async (client) => {
        const unitResult = await client.query<{ item_id: string; state: UnitState }>(
          `select item_id, state from units where id = $1 for update`,
          [unitId]
        );
        const unit = unitResult.rows[0];
        if (!unit) {
          return { kind: "unit-not-found" as const };
        }
        if (unit.item_id !== existing.itemId) {
          return { kind: "unit-invalid" as const };
        }
        if (unit.state === "maintenance" || unit.state === "retired") {
          return { kind: "unavailable" as const };
        }

        const stuck = await client.query(
          `select 1 from loans
           where unit_id = $1 and id <> $2
             and status in ('checked_out', 'overdue')
             and end_date < $3::date
           limit 1`,
          [unitId, input.id, today]
        );
        if (stuck.rows.length > 0) {
          return { kind: "unavailable" as const };
        }

        const result = await client.query<LoanRow>(
          `update loans
           set unit_id = $1, status = 'approved', decided_by = $2, decided_at = now()
           where id = $3 and status = 'pending'
           returning *`,
          [unitId, input.officerId, input.id]
        );
        const updated = result.rows[0];
        if (!updated) {
          return { kind: "already-decided" as const };
        }

        await syncUnitState(client, unitId);

        return { kind: "approved" as const, row: updated };
      });
    } catch (err) {
      if (isExclusionViolation(err)) {
        return { ok: false, reason: "unavailable" };
      }
      throw err;
    }

    if (outcome.kind !== "approved") {
      return { ok: false, reason: outcome.kind };
    }

    return { ok: true, loan: mapRow(outcome.row) };
  } catch {
    return { ok: false, reason: "error" };
  }
}

export async function checkoutLoan(input: {
  id: string;
  officerId: string;
  conditionOut?: UnitCondition | null;
}): Promise<
  | { ok: true; loan: Loan }
  | { ok: false; reason: "not-configured" | "not-found" | "invalid-state" | "error" }
> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const existing = await getLoan(input.id);
    if (!existing) {
      return { ok: false, reason: "not-found" };
    }
    if (existing.status !== "approved") {
      return { ok: false, reason: "invalid-state" };
    }

    const row = await withTransaction(async (client) => {
      const result = await client.query<LoanRow>(
        `update loans
         set status = 'checked_out', checked_out_by = $1, checked_out_at = now(),
             condition_out = $2
         where id = $3 and status = 'approved'
         returning *`,
        [input.officerId, input.conditionOut ?? null, input.id]
      );
      const updated = result.rows[0];
      if (!updated) {
        return undefined;
      }

      if (updated.unit_id) {
        await syncUnitState(client, updated.unit_id);
      }

      return updated;
    });

    if (!row) {
      return { ok: false, reason: "invalid-state" };
    }

    return { ok: true, loan: mapRow(row) };
  } catch {
    return { ok: false, reason: "error" };
  }
}

export async function checkinLoan(input: {
  id: string;
  officerId: string;
  conditionIn?: UnitCondition | null;
}): Promise<
  | { ok: true; loan: Loan }
  | { ok: false; reason: "not-configured" | "not-found" | "invalid-state" | "error" }
> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const existing = await getLoan(input.id);
    if (!existing) {
      return { ok: false, reason: "not-found" };
    }
    if (existing.status !== "checked_out" && existing.status !== "overdue") {
      return { ok: false, reason: "invalid-state" };
    }

    // closed_at starts the two-year retention clock (lib/privacy/retention.ts);
    // a returned loan is closed the moment it's checked back in.
    const row = await withTransaction(async (client) => {
      const result = await client.query<LoanRow>(
        `update loans
         set status = 'returned', checked_in_by = $1, checked_in_at = now(),
             condition_in = $2, closed_at = now()
         where id = $3 and status in ('checked_out', 'overdue')
         returning *`,
        [input.officerId, input.conditionIn ?? null, input.id]
      );
      const updated = result.rows[0];
      if (!updated) {
        return undefined;
      }

      if (updated.unit_id) {
        await syncUnitState(client, updated.unit_id, input.conditionIn);
      }

      return updated;
    });

    if (!row) {
      return { ok: false, reason: "invalid-state" };
    }

    return { ok: true, loan: mapRow(row) };
  } catch {
    return { ok: false, reason: "error" };
  }
}

export async function cancelLoan(input: {
  id: string;
  byOfficerId?: string | null;
}): Promise<
  | { ok: true; loan: Loan }
  | { ok: false; reason: "not-configured" | "not-found" | "invalid-state" | "error" }
> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const existing = await getLoan(input.id);
    if (!existing) {
      return { ok: false, reason: "not-found" };
    }
    if (existing.status !== "pending" && existing.status !== "approved") {
      return { ok: false, reason: "invalid-state" };
    }

    // closed_at starts the two-year retention clock (lib/privacy/retention.ts);
    // a cancelled loan is closed the moment it's cancelled.
    const row = await withTransaction(async (client) => {
      const result = await client.query<LoanRow>(
        `update loans
         set status = 'cancelled', closed_at = now()
         where id = $1 and status in ('pending', 'approved')
         returning *`,
        [input.id]
      );
      const updated = result.rows[0];
      if (!updated) {
        return undefined;
      }

      if (updated.unit_id) {
        await syncUnitState(client, updated.unit_id);
      }

      return updated;
    });

    if (!row) {
      return { ok: false, reason: "invalid-state" };
    }

    return { ok: true, loan: mapRow(row) };
  } catch {
    return { ok: false, reason: "error" };
  }
}
