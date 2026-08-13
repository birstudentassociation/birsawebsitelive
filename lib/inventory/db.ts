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
export { sql } from "@vercel/postgres";

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
