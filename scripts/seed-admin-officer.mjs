/**
 * Seeds (or updates) a single `admin` officer row, for bootstrapping access
 * to the inventory management suite after migrations have run.
 *
 * Run once after migrations, e.g.:
 *
 *   ADMIN_EMAIL=you@example.com ADMIN_NAME="Your Name" ADMIN_PASSCODE=your-passcode \
 *     node scripts/seed-admin-officer.mjs
 */
import { createPool } from "@vercel/postgres";
import { randomBytes, scryptSync } from "node:crypto";

const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error(
    "seed-admin-officer: no POSTGRES_URL_NON_POOLING or POSTGRES_URL set in the environment. " +
      "Run `vercel env pull` first, or set the variable directly."
  );
  process.exit(1);
}

const { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSCODE } = process.env;

if (!ADMIN_EMAIL || !ADMIN_NAME || !ADMIN_PASSCODE) {
  console.error(
    "seed-admin-officer: ADMIN_EMAIL, ADMIN_NAME, and ADMIN_PASSCODE must all be set in the environment.\n" +
      "Example: ADMIN_EMAIL=you@example.com ADMIN_NAME=\"Your Name\" ADMIN_PASSCODE=your-passcode node scripts/seed-admin-officer.mjs"
  );
  process.exit(1);
}

// must match lib/inventory/auth.ts hashPasscode
function hashPasscode(passcode) {
  const salt = randomBytes(16);
  const hash = scryptSync(passcode, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

const pool = createPool({ connectionString });

async function main() {
  const client = await pool.connect();

  try {
    const email = ADMIN_EMAIL.toLowerCase();
    const passcodeHash = hashPasscode(ADMIN_PASSCODE);

    await client.query(
      `insert into officers (email, name, role, passcode_hash)
       values ($1, $2, 'admin', $3)
       on conflict (email) do update
         set name = excluded.name,
             passcode_hash = excluded.passcode_hash,
             role = 'admin',
             is_active = true`,
      [email, ADMIN_NAME, passcodeHash]
    );

    console.log(`seed-admin-officer: upserted admin officer ${email}`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("seed-admin-officer: failed", err);
  process.exit(1);
});
