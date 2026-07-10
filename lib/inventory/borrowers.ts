/**
 * Data-access layer for inventory borrowers (students who request loans).
 *
 * Guarded against a missing `POSTGRES_URL`, matching the convention in
 * lib/equipment-loan.ts: reads return empty/neutral values and writes return
 * an explicit `{ ok: false, reason: "not-configured" }` rather than
 * throwing, so the site stays buildable and renderable with zero
 * environment configuration.
 */
import { sql, isInventoryConfigured } from "@/lib/inventory/db";
import type { Borrower } from "@/lib/inventory/types";

type BorrowerRow = {
  id: string;
  tu_student_id: string;
  name: string;
  email: string;
  phone: string | null;
  blocklisted: boolean;
  blocklist_reason: string | null;
  max_concurrent_loans: number | null;
  created_at: string;
  updated_at: string;
};

function mapRow(row: BorrowerRow): Borrower {
  return {
    id: row.id,
    tuStudentId: row.tu_student_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    blocklisted: row.blocklisted,
    blocklistReason: row.blocklist_reason,
    maxConcurrentLoans: row.max_concurrent_loans,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Inserts a borrower, or refreshes name/email/phone on an existing tu_student_id. Returns null when unconfigured or on error. */
export async function upsertBorrower(input: {
  tuStudentId: string;
  name: string;
  email: string;
  phone?: string | null;
}): Promise<Borrower | null> {
  if (!isInventoryConfigured()) {
    return null;
  }

  try {
    const result = await sql<BorrowerRow>`
      insert into borrowers (tu_student_id, name, email, phone)
      values (${input.tuStudentId}, ${input.name}, ${input.email}, ${input.phone ?? null})
      on conflict (tu_student_id) do update
        set name = excluded.name,
            email = excluded.email,
            phone = coalesce(excluded.phone, borrowers.phone),
            updated_at = now()
      returning *
    `;
    const row = result.rows[0];
    return row ? mapRow(row) : null;
  } catch {
    return null;
  }
}

export async function getBorrower(id: string): Promise<Borrower | null> {
  if (!isInventoryConfigured()) {
    return null;
  }

  try {
    const result = await sql<BorrowerRow>`
      select * from borrowers where id = ${id} limit 1
    `;
    const row = result.rows[0];
    return row ? mapRow(row) : null;
  } catch {
    return null;
  }
}

export async function getBorrowerByStudentId(tuStudentId: string): Promise<Borrower | null> {
  if (!isInventoryConfigured()) {
    return null;
  }

  try {
    const result = await sql<BorrowerRow>`
      select * from borrowers where tu_student_id = ${tuStudentId} limit 1
    `;
    const row = result.rows[0];
    return row ? mapRow(row) : null;
  } catch {
    return null;
  }
}

export async function listBorrowers(opts?: { search?: string }): Promise<Borrower[]> {
  if (!isInventoryConfigured()) {
    return [];
  }

  try {
    const result = opts?.search
      ? await sql<BorrowerRow>`
          select * from borrowers
          where tu_student_id ilike ${"%" + opts.search + "%"}
             or name ilike ${"%" + opts.search + "%"}
             or email ilike ${"%" + opts.search + "%"}
          order by name
        `
      : await sql<BorrowerRow>`
          select * from borrowers order by name
        `;
    return result.rows.map(mapRow);
  } catch {
    return [];
  }
}

/** Column map for `updateBorrower`'s dynamic, parameterized SET clause. */
const UPDATE_COLUMNS: Record<string, string> = {
  blocklisted: "blocklisted",
  blocklistReason: "blocklist_reason",
  maxConcurrentLoans: "max_concurrent_loans",
  name: "name",
  email: "email",
  phone: "phone",
};

export async function updateBorrower(
  id: string,
  patch: Partial<{
    blocklisted: boolean;
    blocklistReason: string | null;
    maxConcurrentLoans: number | null;
    name: string;
    email: string;
    phone: string | null;
  }>
): Promise<{ ok: true; borrower: Borrower } | { ok: false; reason: "not-configured" | "not-found" | "error" }> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const values: unknown[] = [];
    const setClauses: string[] = [];
    for (const [key, column] of Object.entries(UPDATE_COLUMNS)) {
      if (key in patch) {
        values.push((patch as Record<string, unknown>)[key]);
        setClauses.push(`${column} = $${values.length}`);
      }
    }

    if (setClauses.length === 0) {
      const existing = await getBorrower(id);
      return existing ? { ok: true, borrower: existing } : { ok: false, reason: "not-found" };
    }

    setClauses.push("updated_at = now()");
    values.push(id);

    const result = await sql.query<BorrowerRow>(
      `update borrowers set ${setClauses.join(", ")} where id = $${values.length} returning *`,
      values
    );
    const row = result.rows[0];
    if (!row) {
      return { ok: false, reason: "not-found" };
    }
    return { ok: true, borrower: mapRow(row) };
  } catch {
    return { ok: false, reason: "error" };
  }
}

/** Counts a borrower's active loans (pending/approved/checked_out/overdue). Returns 0 when unconfigured or on error. */
export async function countActiveLoans(borrowerId: string): Promise<number> {
  if (!isInventoryConfigured()) {
    return 0;
  }

  try {
    const result = await sql<{ count: string }>`
      select count(*)::text as count
      from loans
      where borrower_id = ${borrowerId}
        and status in ('pending', 'approved', 'checked_out', 'overdue')
    `;
    return Number(result.rows[0]?.count ?? 0);
  } catch {
    return 0;
  }
}
