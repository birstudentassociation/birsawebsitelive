/**
 * Lightweight, framework-free migration runner for db/migrations/*.sql.
 *
 * Usage: pull env first (e.g. `vercel env pull`), or run in an environment
 * where POSTGRES_URL is already set, then:
 *
 *   node scripts/migrate.mjs
 *
 * Each migration file is applied at most once, tracked in the
 * `schema_migrations` table, inside its own transaction.
 */
import { createPool } from "@vercel/postgres";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error(
    "migrate: no POSTGRES_URL_NON_POOLING or POSTGRES_URL set in the environment. " +
      "Run `vercel env pull` first, or set the variable directly."
  );
  process.exit(1);
}

const pool = createPool({ connectionString });

async function main() {
  const client = await pool.connect();

  try {
    await client.query(`
      create table if not exists schema_migrations (
        version text primary key,
        applied_at timestamptz not null default now()
      )
    `);

    const migrationsDir = path.join(process.cwd(), "db", "migrations");
    const files = readdirSync(migrationsDir)
      .filter((name) => name.endsWith(".sql"))
      .sort();

    const { rows: appliedRows } = await client.query("select version from schema_migrations");
    const applied = new Set(appliedRows.map((row) => row.version));

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`skip:  ${file} (already applied)`);
        continue;
      }

      const filePath = path.join(migrationsDir, file);
      const sqlText = readFileSync(filePath, "utf8");

      try {
        await client.query("BEGIN");
        await client.query(sqlText);
        await client.query("insert into schema_migrations (version) values ($1)", [file]);
        await client.query("COMMIT");
        console.log(`apply: ${file}`);
      } catch (err) {
        await client.query("ROLLBACK");
        console.error(`error applying ${file}:`, err);
        process.exit(1);
      }
    }

    console.log("migrations up to date");
  } finally {
    client.release();
    await pool.end();
  }
}

main();
