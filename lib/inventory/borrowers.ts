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

type Queryable = {
  query: <R>(text: string, values?: unknown[]) => Promise<{ rows: R[] }>;
};

function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function upsertBorrowerWith(
  run: Queryable,
  input: { tuStudentId: string; name: string; email: string; phone?: string | null }
): Promise<{ ok: true; borrower: Borrower } | { ok: false; reason: "email-mismatch" | "error" }> {
  await run.query(
    `insert into borrowers (tu_student_id, name, email, phone)
     values ($1, $2, $3, $4)
     on conflict (tu_student_id) do nothing`,
    [input.tuStudentId, input.name, input.email, input.phone ?? null]
  );

  const result = await run.query<BorrowerRow>(
    `select * from borrowers where tu_student_id = $1 for update`,
    [input.tuStudentId]
  );
  const row = result.rows[0];
  if (!row) {
    return { ok: false, reason: "error" };
  }

  if (normaliseEmail(row.email) !== normaliseEmail(input.email)) {
    return { ok: false, reason: "email-mismatch" };
  }

  if (input.phone && input.phone !== row.phone) {
    const updated = await run.query<BorrowerRow>(
      `update borrowers set phone = $1, updated_at = now() where id = $2 returning *`,
      [input.phone, row.id]
    );
    const updatedRow = updated.rows[0];
    return updatedRow ? { ok: true, borrower: mapRow(updatedRow) } : { ok: false, reason: "error" };
  }

  return { ok: true, borrower: mapRow(row) };
}

/**
 * Finds or creates the borrower for a public loan request. An existing
 * borrower's name and email are never overwritten from this path: a request
 * that names a known student ID with a different email is refused with
 * `email-mismatch`, so nobody can take over another student's loans by
 * submitting their ID. Only the phone number is refreshed, and only when the
 * email matches. Pass a transaction `client` to run inside it, in which case
 * errors propagate so the caller can roll back.
 */
export async function upsertBorrower(
  input: {
    tuStudentId: string;
    name: string;
    email: string;
    phone?: string | null;
  },
  client?: Queryable
): Promise<
  | { ok: true; borrower: Borrower }
  | { ok: false; reason: "not-configured" | "email-mismatch" | "error" }
> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  if (client) {
    return upsertBorrowerWith(client, input);
  }

  try {
    return await upsertBorrowerWith(sql, input);
  } catch {
    return { ok: false, reason: "error" };
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
): Promise<
  { ok: true; borrower: Borrower } | { ok: false; reason: "not-configured" | "not-found" | "error" }
> {
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

/**
 * Counts a borrower's active loans (pending/approved/checked_out/overdue).
 * Returns 0 when unconfigured. Without a `client` it also returns 0 on error,
 * which suits display. With a `client` (the loan request path) errors
 * propagate, so a limit check can never pass because the count failed.
 */
export async function countActiveLoans(borrowerId: string, client?: Queryable): Promise<number> {
  if (!isInventoryConfigured()) {
    return 0;
  }

  const text = `select count(*)::text as count
      from loans
      where borrower_id = $1
        and status in ('pending', 'approved', 'checked_out', 'overdue')`;

  if (client) {
    const result = await client.query<{ count: string }>(text, [borrowerId]);
    return Number(result.rows[0]?.count ?? 0);
  }

  try {
    const result = await sql.query<{ count: string }>(text, [borrowerId]);
    return Number(result.rows[0]?.count ?? 0);
  } catch {
    return 0;
  }
}
