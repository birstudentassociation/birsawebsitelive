/**
 * Data-access layer for the loan lifecycle (requests, decisions, checkout,
 * checkin, cancellation) in the inventory management suite.
 *
 * Guarded against a missing `POSTGRES_URL`, matching the convention in
 * lib/equipment-loan.ts: reads return empty/neutral values and writes return
 * an explicit `{ ok: false, reason: "not-configured" }` rather than
 * throwing, so the site stays buildable and renderable with zero
 * environment configuration.
 */
import { sql, isInventoryConfigured } from "@/lib/inventory/db";
import type { Loan, LoanStatus, TrackingMode, UnitCondition } from "@/lib/inventory/types";
import { upsertBorrower, countActiveLoans } from "@/lib/inventory/borrowers";

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
  };
}

function isUniqueViolation(err: unknown): boolean {
  return !!err && typeof err === "object" && (err as { code?: string }).code === "23505";
}

function isExclusionViolation(err: unknown): boolean {
  return !!err && typeof err === "object" && (err as { code?: string }).code === "23P01";
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
    const itemResult = await sql<{ id: string; tracking_mode: TrackingMode; qty_on_hand: number | null }>`
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
            and l.status in ('pending', 'approved', 'checked_out', 'overdue')
            and daterange(l.start_date, l.end_date, '[]') && daterange(${startDate}::date, ${endDate}::date, '[]')
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
  | { ok: false; reason: "not-configured" | "invalid" | "unavailable" | "blocklisted" | "limit-exceeded" | "error" }
> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const itemResult = await sql<{ id: string; max_loan_days: number }>`
      select id, max_loan_days from items
      where key = ${input.itemKey} and is_retired = false
      limit 1
    `;
    const item = itemResult.rows[0];
    if (!item) {
      return { ok: false, reason: "invalid" };
    }

    const start = new Date(input.startDate);
    const end = new Date(input.endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return { ok: false, reason: "invalid" };
    }

    const today = new Date().toISOString().slice(0, 10);
    if (input.startDate < today || input.endDate < input.startDate) {
      return { ok: false, reason: "invalid" };
    }

    const durationDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (durationDays > item.max_loan_days) {
      return { ok: false, reason: "invalid" };
    }

    const borrower = await upsertBorrower(input.borrower);
    if (!borrower) {
      return { ok: false, reason: "error" };
    }
    if (borrower.blocklisted) {
      return { ok: false, reason: "blocklisted" };
    }

    const activeCount = await countActiveLoans(borrower.id);
    const limit = borrower.maxConcurrentLoans ?? DEFAULT_MAX_CONCURRENT_LOANS;
    if (activeCount >= limit) {
      return { ok: false, reason: "limit-exceeded" };
    }

    const availability = await getItemAvailabilityForRange(input.itemKey, input.startDate, input.endDate);
    if (availability.available <= 0) {
      return { ok: false, reason: "unavailable" };
    }

    // Retry a small number of times in the rare event of a reference
    // collision (the column has a unique constraint).
    let lastError: unknown;
    for (let attempt = 0; attempt < 5; attempt++) {
      const reference = generateReference(input.itemKey);
      try {
        await sql`
          insert into loans (reference, item_id, borrower_id, quantity, start_date, end_date, reason, status)
          values (
            ${reference}, ${item.id}, ${borrower.id}, ${input.quantity ?? 1},
            ${input.startDate}, ${input.endDate}, ${input.reason ?? null}, 'pending'
          )
        `;
        return { ok: true, reference };
      } catch (err) {
        if (isUniqueViolation(err)) {
          lastError = err;
          continue;
        }
        throw err;
      }
    }
    throw lastError;
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
    const result = await sql.query<LoanRow>(`select * from loans ${where} order by created_at desc`, values);
    return result.rows.map(mapRow);
  } catch {
    return [];
  }
}

export async function getLoan(id: string): Promise<Loan | null> {
  if (!isInventoryConfigured()) {
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
export async function getLoanByReferenceAndEmail(reference: string, email: string): Promise<Loan | null> {
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
  | { ok: false; reason: "not-configured" | "not-found" | "already-decided" | "unit-required" | "unavailable" | "error" }
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
      const result = await sql<LoanRow>`
        update loans
        set status = 'rejected', decided_by = ${input.officerId}, decided_at = now()
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

    let result;
    try {
      result = await sql<LoanRow>`
        update loans
        set unit_id = ${input.unitId}, status = 'approved', decided_by = ${input.officerId}, decided_at = now()
        where id = ${input.id} and status = 'pending'
        returning *
      `;
    } catch (err) {
      if (isExclusionViolation(err)) {
        return { ok: false, reason: "unavailable" };
      }
      throw err;
    }
    const row = result.rows[0];
    if (!row) {
      return { ok: false, reason: "already-decided" };
    }

    await sql`
      update units set state = 'reserved', updated_at = now() where id = ${input.unitId}
    `;

    return { ok: true, loan: mapRow(row) };
  } catch {
    return { ok: false, reason: "error" };
  }
}

export async function checkoutLoan(input: {
  id: string;
  officerId: string;
  conditionOut?: UnitCondition | null;
}): Promise<{ ok: true; loan: Loan } | { ok: false; reason: "not-configured" | "not-found" | "invalid-state" | "error" }> {
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

    const result = await sql<LoanRow>`
      update loans
      set status = 'checked_out', checked_out_by = ${input.officerId}, checked_out_at = now(),
          condition_out = ${input.conditionOut ?? null}
      where id = ${input.id} and status = 'approved'
      returning *
    `;
    const row = result.rows[0];
    if (!row) {
      return { ok: false, reason: "invalid-state" };
    }

    if (row.unit_id) {
      await sql`
        update units set state = 'on_loan', updated_at = now() where id = ${row.unit_id}
      `;
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
}): Promise<{ ok: true; loan: Loan } | { ok: false; reason: "not-configured" | "not-found" | "invalid-state" | "error" }> {
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

    const result = await sql<LoanRow>`
      update loans
      set status = 'returned', checked_in_by = ${input.officerId}, checked_in_at = now(),
          condition_in = ${input.conditionIn ?? null}
      where id = ${input.id} and status in ('checked_out', 'overdue')
      returning *
    `;
    const row = result.rows[0];
    if (!row) {
      return { ok: false, reason: "invalid-state" };
    }

    if (row.unit_id) {
      if (input.conditionIn) {
        await sql`
          update units
          set state = 'available', condition = ${input.conditionIn}, updated_at = now()
          where id = ${row.unit_id}
        `;
      } else {
        await sql`
          update units set state = 'available', updated_at = now() where id = ${row.unit_id}
        `;
      }
    }

    return { ok: true, loan: mapRow(row) };
  } catch {
    return { ok: false, reason: "error" };
  }
}

export async function cancelLoan(input: {
  id: string;
  byOfficerId?: string | null;
}): Promise<{ ok: true; loan: Loan } | { ok: false; reason: "not-configured" | "not-found" | "invalid-state" | "error" }> {
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

    const result = await sql<LoanRow>`
      update loans
      set status = 'cancelled'
      where id = ${input.id} and status in ('pending', 'approved')
      returning *
    `;
    const row = result.rows[0];
    if (!row) {
      return { ok: false, reason: "invalid-state" };
    }

    if (row.unit_id) {
      await sql`
        update units set state = 'available', updated_at = now() where id = ${row.unit_id}
      `;
    }

    return { ok: true, loan: mapRow(row) };
  } catch {
    return { ok: false, reason: "error" };
  }
}
