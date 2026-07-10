/**
 * Per-officer authentication for the inventory management suite.
 *
 * Unlike the legacy shared-passcode `lib/officer-session.ts`, each officer
 * has their own email + passcode and a role-scoped session. Uses only
 * `node:crypto` (scrypt for passcode hashing, HMAC-SHA256 + timing-safe
 * compare for session tokens); no new deps.
 */
import { randomBytes, createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { sql, isInventoryConfigured } from "@/lib/inventory/db";
import type { Officer, Role } from "@/lib/inventory/types";

export const OFFICER_COOKIE = "birsa_inventory";

const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours
const SCRYPT_KEYLEN = 64;

export function isInventoryAuthConfigured(): boolean {
  return !!process.env.OFFICER_SESSION_SECRET;
}

type OfficerRow = {
  id: string;
  email: string;
  name: string;
  role: Role;
  passcode_hash: string | null;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
};

/** Maps a snake_case DB row to the app-facing Officer type, excluding passcode_hash. */
function mapOfficer(row: OfficerRow): Officer {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    isActive: row.is_active,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
  };
}

/** Hashes a passcode with scrypt, returning "<saltHex>:<hashHex>". */
export function hashPasscode(passcode: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(passcode, salt, SCRYPT_KEYLEN);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

/** Verifies a passcode against a stored "<saltHex>:<hashHex>" hash. Never throws. */
export function verifyPasscodeHash(passcode: string, stored: string): boolean {
  try {
    const [saltHex, hashHex] = stored.split(":");
    if (!saltHex || !hashHex) {
      return false;
    }
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const actual = scryptSync(passcode, salt, expected.length);
    return safeCompare(actual, expected);
  } catch {
    return false;
  }
}

function safeCompare(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    // timingSafeEqual requires equal-length buffers; comparing against a
    // same-length dummy keeps this branch roughly constant-time too.
    timingSafeEqual(a, a);
    return false;
  }
  return timingSafeEqual(a, b);
}

function base64urlEncode(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function base64urlDecode(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(body: string): string {
  const secret = process.env.OFFICER_SESSION_SECRET;
  if (!secret) {
    return "";
  }
  return createHmac("sha256", secret).update(body).digest("hex");
}

/** Creates a signed session token `{sub, role, iat, exp}` valid for 12 hours. Returns "" if no secret configured. */
export function createSessionToken(officer: { id: string; role: Role }): string {
  const secret = process.env.OFFICER_SESSION_SECRET;
  if (!secret) {
    return "";
  }
  const nowSeconds = Math.floor(Date.now() / 1000);
  const payload = {
    sub: officer.id,
    role: officer.role,
    iat: nowSeconds,
    exp: nowSeconds + SESSION_TTL_SECONDS,
  };
  const body = base64urlEncode(JSON.stringify(payload));
  const sig = sign(body);
  return `${body}.${sig}`;
}

/** Verifies a session token and returns its `{sub, role}` claims, or null. Never throws. */
export function verifySessionToken(token: string | undefined): { sub: string; role: Role } | null {
  if (!token) {
    return null;
  }
  try {
    const [body, sig] = token.split(".");
    if (!body || !sig) {
      return null;
    }
    const expectedSig = sign(body);
    if (!expectedSig) {
      return null;
    }
    const sigBuf = Buffer.from(sig, "hex");
    const expectedBuf = Buffer.from(expectedSig, "hex");
    if (!safeCompare(sigBuf, expectedBuf)) {
      return null;
    }
    const payload = JSON.parse(base64urlDecode(body)) as {
      sub?: unknown;
      role?: unknown;
      exp?: unknown;
    };
    if (typeof payload.sub !== "string" || typeof payload.role !== "string" || typeof payload.exp !== "number") {
      return null;
    }
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (payload.exp <= nowSeconds) {
      return null;
    }
    return { sub: payload.sub, role: payload.role as Role };
  } catch {
    return null;
  }
}

/** Verifies email + passcode, updates last_login_at on success, and returns the Officer (or null). Never throws. */
export async function authenticateOfficer(email: string, passcode: string): Promise<Officer | null> {
  if (!isInventoryConfigured()) {
    return null;
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const result = await sql<OfficerRow>`
      select * from officers where email = ${normalizedEmail} limit 1
    `;
    const row = result.rows[0];
    if (!row || !row.is_active || !row.passcode_hash) {
      return null;
    }
    if (!verifyPasscodeHash(passcode, row.passcode_hash)) {
      return null;
    }

    const updated = await sql<OfficerRow>`
      update officers set last_login_at = now() where id = ${row.id}
      returning *
    `;
    const updatedRow = updated.rows[0] ?? row;
    return mapOfficer(updatedRow);
  } catch {
    return null;
  }
}

/** Reads the officer session cookie, verifies it, and loads the active officer row (or null). Never throws. */
export async function getSessionOfficer(): Promise<Officer | null> {
  if (!isInventoryConfigured()) {
    return null;
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(OFFICER_COOKIE)?.value;
    const claims = verifySessionToken(token);
    if (!claims) {
      return null;
    }

    const result = await sql<OfficerRow>`
      select * from officers where id = ${claims.sub} limit 1
    `;
    const row = result.rows[0];
    if (!row || !row.is_active) {
      return null;
    }
    return mapOfficer(row);
  } catch {
    return null;
  }
}

/** Loads the current session officer and checks their role against `allowed`. */
export async function requireRole(
  allowed: Role[]
): Promise<{ ok: true; officer: Officer } | { ok: false; status: 401 | 403 }> {
  const officer = await getSessionOfficer();
  if (!officer) {
    return { ok: false, status: 401 };
  }
  if (!allowed.includes(officer.role)) {
    return { ok: false, status: 403 };
  }
  return { ok: true, officer };
}
