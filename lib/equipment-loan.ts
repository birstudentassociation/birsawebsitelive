/**
 * Data-access layer for the Equipment Loan Service.
 *
 * Every exported function is guarded against a missing `POSTGRES_URL`: when
 * the loan backend isn't configured, reads return empty/neutral values and
 * writes return an explicit `{ ok: false, reason: "not-configured" }` rather
 * than throwing. This keeps the site buildable and the public pages
 * renderable with zero environment configuration.
 */
import { sql } from "@vercel/postgres";
import { equipmentItems, getEquipmentItem } from "@/content/services/equipment";

export type LoanStatus = "pending" | "approved" | "rejected" | "returned" | "cancelled";

export type LoanRequestRow = {
  id: string;
  reference: string;
  itemKey: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  pickupDate: string;
  returnDate: string;
  reason: string | null;
  status: LoanStatus;
  decidedBy: string | null;
  decidedAt: string | null;
  createdAt: string;
};

/**
 * Statuses that count against an item's available quantity. Kept as literals
 * rather than an array because @vercel/postgres template values must be
 * primitives (no array binding for `= any(...)`).
 */

type LoanRow = {
  id: string;
  reference: string;
  item_key: string;
  student_name: string;
  student_id: string;
  student_email: string;
  pickup_date: string;
  return_date: string;
  reason: string | null;
  status: LoanStatus;
  decided_by: string | null;
  decided_at: string | null;
  created_at: string;
};

function mapRow(row: LoanRow): LoanRequestRow {
  return {
    id: row.id,
    reference: row.reference,
    itemKey: row.item_key,
    studentName: row.student_name,
    studentId: row.student_id,
    studentEmail: row.student_email,
    pickupDate: row.pickup_date,
    returnDate: row.return_date,
    reason: row.reason,
    status: row.status,
    decidedBy: row.decided_by,
    decidedAt: row.decided_at,
    createdAt: row.created_at,
  };
}

export function isLoanBackendConfigured(): boolean {
  return !!process.env.POSTGRES_URL;
}

/** Builds a short human-friendly reference, e.g. "FAK-7Q2X" for "first-aid-kit". */
function generateReference(itemKey: string): string {
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

export async function getItemAvailability(itemKey: string): Promise<{
  total: number;
  available: number;
  activeCount: number;
  configured: boolean;
}> {
  const item = getEquipmentItem(itemKey);
  const total = item?.quantity ?? 0;

  if (!isLoanBackendConfigured()) {
    return { total, available: total, activeCount: 0, configured: false };
  }

  try {
    const result = await sql<{ count: string }>`
      select count(*)::text as count
      from equipment_loans
      where item_key = ${itemKey}
        and status in ('pending', 'approved')
    `;
    const activeCount = Number(result.rows[0]?.count ?? 0);
    const available = Math.max(0, total - activeCount);
    return { total, available, activeCount, configured: true };
  } catch {
    return { total, available: total, activeCount: 0, configured: true };
  }
}

export async function createLoanRequest(input: {
  itemKey: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  pickupDate: string;
  returnDate: string;
  reason?: string;
}): Promise<{ ok: true; reference: string } | { ok: false; reason: "unavailable" | "not-configured" | "error" }> {
  if (!isLoanBackendConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const availability = await getItemAvailability(input.itemKey);
    if (availability.available <= 0) {
      return { ok: false, reason: "unavailable" };
    }

    // Retry a small number of times in the rare event of a reference collision
    // (the column has a unique constraint).
    let lastError: unknown;
    for (let attempt = 0; attempt < 5; attempt++) {
      const reference = generateReference(input.itemKey);
      try {
        await sql`
          insert into equipment_loans
            (reference, item_key, student_name, student_id, student_email, pickup_date, return_date, reason, status)
          values
            (${reference}, ${input.itemKey}, ${input.studentName}, ${input.studentId}, ${input.studentEmail},
             ${input.pickupDate}, ${input.returnDate}, ${input.reason ?? null}, 'pending')
        `;
        return { ok: true, reference };
      } catch (err) {
        lastError = err;
        continue;
      }
    }
    throw lastError;
  } catch {
    return { ok: false, reason: "error" };
  }
}

export async function listLoanRequests(opts?: { status?: LoanStatus }): Promise<LoanRequestRow[]> {
  if (!isLoanBackendConfigured()) {
    return [];
  }

  try {
    const result = opts?.status
      ? await sql<LoanRow>`
          select * from equipment_loans
          where status = ${opts.status}
          order by created_at desc
        `
      : await sql<LoanRow>`
          select * from equipment_loans
          order by created_at desc
        `;
    return result.rows.map(mapRow);
  } catch {
    return [];
  }
}

export async function getLoanRequest(id: string): Promise<LoanRequestRow | null> {
  if (!isLoanBackendConfigured()) {
    return null;
  }

  try {
    const result = await sql<LoanRow>`
      select * from equipment_loans where id = ${id} limit 1
    `;
    const row = result.rows[0];
    return row ? mapRow(row) : null;
  } catch {
    return null;
  }
}

export async function decideLoanRequest(
  id: string,
  decision: "approved" | "rejected",
  decidedBy?: string
): Promise<{ ok: true; row: LoanRequestRow } | { ok: false; reason: "not-found" | "not-configured" | "already-decided" | "error" }> {
  if (!isLoanBackendConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const existing = await getLoanRequest(id);
    if (!existing) {
      return { ok: false, reason: "not-found" };
    }
    if (existing.status !== "pending") {
      return { ok: false, reason: "already-decided" };
    }

    const result = await sql<LoanRow>`
      update equipment_loans
      set status = ${decision}, decided_by = ${decidedBy ?? null}, decided_at = now()
      where id = ${id} and status = 'pending'
      returning *
    `;
    const row = result.rows[0];
    if (!row) {
      return { ok: false, reason: "already-decided" };
    }
    return { ok: true, row: mapRow(row) };
  } catch {
    return { ok: false, reason: "error" };
  }
}

// Re-exported for convenience so callers of this module don't also need to
// import the catalogue directly.
export { equipmentItems, getEquipmentItem };
