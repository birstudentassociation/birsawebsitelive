/**
 * Shared DB entrypoint for lib/inventory/*.
 *
 * Every inventory data-access module should import `sql` from here (rather
 * than directly from `@vercel/postgres`) and gate reads/writes behind
 * `isInventoryConfigured()`, mirroring `isLoanBackendConfigured()` in
 * lib/equipment-loan.ts. This keeps the site buildable and renderable with
 * zero environment configuration, and gives us one place to swap the
 * underlying client later if needed.
 */
import { sql, types } from "@vercel/postgres";

const PG_DATE_OID = 1082;

types.setTypeParser(PG_DATE_OID, (value: string) => value);

export { sql };

/**
 * The pooled client handed out by `sql.connect()`, for the multi-statement
 * transactions in this suite (see `withTransaction` in lib/inventory/loans.ts).
 * Re-exported here so those modules still have a single import site for the
 * database, as described above.
 */
export type { VercelPoolClient } from "@vercel/postgres";

export function isInventoryConfigured(): boolean {
  return !!process.env.POSTGRES_URL;
}

const TABLE_ABSENT_RECHECK_MS = 60 * 1000;

const presentTables = new Set<string>();
const absentCheckedAt = new Map<string, number>();

/**
 * Whether `table` exists in the public schema. A feature whose migration has
 * not been applied yet asks this before offering a form that would only fail
 * on submit. A table that exists is remembered for the life of the instance,
 * since migrations only ever add one; a missing table is asked about again
 * after a minute, so a migration takes effect without a redeploy. Never
 * throws: no database, or any error, reads as absent.
 */
export async function tableExists(table: string): Promise<boolean> {
  if (!isInventoryConfigured()) return false;
  if (presentTables.has(table)) return true;
  const checkedAt = absentCheckedAt.get(table);
  if (checkedAt !== undefined && Date.now() - checkedAt < TABLE_ABSENT_RECHECK_MS) return false;
  try {
    const { rows } = await sql<{ present: boolean }>`
      select to_regclass(${`public.${table}`}) is not null as present
    `;
    if (rows[0]?.present) {
      presentTables.add(table);
      absentCheckedAt.delete(table);
      return true;
    }
  } catch {
    // Treated as absent, and asked again after the same interval.
  }
  absentCheckedAt.set(table, Date.now());
  return false;
}
