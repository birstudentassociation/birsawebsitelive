/**
 * Data-access layer for officer accounts.
 *
 * Guarded against a missing `POSTGRES_URL` the same way as
 * lib/equipment-loan.ts: reads return empty/neutral values and writes return
 * an explicit `{ ok: false, reason: "not-configured" }` rather than
 * throwing, so the site stays buildable and renderable with zero
 * environment configuration.
 *
 * NOTE: the app-facing `Officer` type never includes `passcode_hash`; every
 * function here maps rows through `mapRow`, which drops it.
 */
import { sql, isInventoryConfigured } from "@/lib/inventory/db";
import { hashPasscode } from "@/lib/inventory/auth";
import type { Officer, Role } from "@/lib/inventory/types";

type OfficerRow = {
  id: string;
  email: string;
  name: string;
  role: Role;
  passcode_hash: string | null;
  custodian_id: string | null;
  is_active: boolean;
  portfolio: string | null;
  term_end: string | null;
  created_at: string;
  last_login_at: string | null;
};

/** Maps a snake_case DB row to the app-facing Officer type, excluding passcode_hash. */
function mapRow(row: OfficerRow): Officer {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    custodianId: row.custodian_id,
    isActive: row.is_active,
    portfolio: row.portfolio ?? null,
    termEnd: row.term_end ?? null,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
  };
}

function isUniqueViolation(err: unknown): boolean {
  return !!err && typeof err === "object" && (err as { code?: string }).code === "23505";
}

/** Lists all officers, ordered by name. Returns [] when unconfigured or on error. */
export async function listOfficers(): Promise<Officer[]> {
  if (!isInventoryConfigured()) {
    return [];
  }

  try {
    const result = await sql<OfficerRow>`
      select * from officers order by name
    `;
    return result.rows.map(mapRow);
  } catch {
    return [];
  }
}

export async function getOfficer(id: string): Promise<Officer | null> {
  if (!isInventoryConfigured()) {
    return null;
  }

  try {
    const result = await sql<OfficerRow>`
      select * from officers where id = ${id} limit 1
    `;
    const row = result.rows[0];
    return row ? mapRow(row) : null;
  } catch {
    return null;
  }
}

export async function createOfficer(input: {
  email: string;
  name: string;
  role: Role;
  passcode: string;
  custodianId?: string | null;
}): Promise<
  { ok: true; officer: Officer } | { ok: false; reason: "not-configured" | "duplicate" | "error" }
> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const email = input.email.toLowerCase();
    const passcodeHash = hashPasscode(input.passcode);
    const result = await sql<OfficerRow>`
      insert into officers (email, name, role, passcode_hash, custodian_id)
      values (${email}, ${input.name}, ${input.role}, ${passcodeHash}, ${input.custodianId ?? null})
      returning *
    `;
    const row = result.rows[0];
    if (!row) {
      return { ok: false, reason: "error" };
    }
    return { ok: true, officer: mapRow(row) };
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { ok: false, reason: "duplicate" };
    }
    return { ok: false, reason: "error" };
  }
}

export async function updateOfficer(
  id: string,
  patch: Partial<{
    name: string;
    role: Role;
    isActive: boolean;
    portfolio: string | null;
    termEnd: string | null;
    passcode: string;
    custodianId: string | null;
  }>
): Promise<
  { ok: true; officer: Officer } | { ok: false; reason: "not-configured" | "not-found" | "error" }
> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const existing = await getOfficer(id);
    if (!existing) {
      return { ok: false, reason: "not-found" };
    }

    const setClauses: string[] = [];
    const params: unknown[] = [];

    const push = (column: string, value: unknown) => {
      params.push(value);
      setClauses.push(`${column} = $${params.length}`);
    };

    if (patch.name !== undefined) push("name", patch.name);
    if (patch.role !== undefined) push("role", patch.role);
    if (patch.isActive !== undefined) push("is_active", patch.isActive);
    if (patch.portfolio !== undefined) push("portfolio", patch.portfolio);
    if (patch.termEnd !== undefined) push("term_end", patch.termEnd);
    if (patch.passcode !== undefined) push("passcode_hash", hashPasscode(patch.passcode));
    if ("custodianId" in patch) push("custodian_id", patch.custodianId ?? null);

    if (setClauses.length === 0) {
      return { ok: true, officer: existing };
    }

    params.push(id);
    const text = `update officers set ${setClauses.join(", ")} where id = $${params.length} returning *`;

    const result = await sql.query<OfficerRow>(text, params);
    const row = result.rows[0];
    if (!row) {
      return { ok: false, reason: "not-found" };
    }
    return { ok: true, officer: mapRow(row) };
  } catch {
    return { ok: false, reason: "error" };
  }
}
