/**
 * Passcode-based session helpers for the officer equipment-loan dashboard.
 * There are no student/officer accounts — officers share one passcode, and a
 * successful check-in is remembered via a signed, deterministic session
 * token stored in an httpOnly cookie.
 *
 * Uses only `node:crypto` (HMAC-SHA256 + timing-safe compare); no new deps.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export const OFFICER_COOKIE = "birsa_officer";

const SESSION_PAYLOAD = "officer";

export function isOfficerAuthConfigured(): boolean {
  return !!process.env.OFFICER_PASSCODE && !!process.env.OFFICER_SESSION_SECRET;
}

/** Timing-safe compare of `input` against the configured OFFICER_PASSCODE. */
export function verifyPasscode(input: string): boolean {
  const expected = process.env.OFFICER_PASSCODE;
  if (!expected || !input) {
    return false;
  }
  return safeCompare(input, expected);
}

/**
 * Deterministic HMAC-SHA256 of a fixed payload, keyed by OFFICER_SESSION_SECRET.
 * Since the payload is fixed, the token is the same every time the secret is
 * unchanged, so it can be verified without server-side session storage.
 */
export function createSessionToken(): string {
  const secret = process.env.OFFICER_SESSION_SECRET;
  if (!secret) {
    return "";
  }
  return createHmac("sha256", secret).update(SESSION_PAYLOAD).digest("hex");
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !isOfficerAuthConfigured()) {
    return false;
  }
  const expected = createSessionToken();
  if (!expected) {
    return false;
  }
  return safeCompare(token, expected);
}

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // timingSafeEqual requires equal-length buffers; comparing against a
    // same-length dummy keeps this branch roughly constant-time too.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}
