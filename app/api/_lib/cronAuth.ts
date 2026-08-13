/**
 * Shared bearer-token check for the two automation endpoints that trust
 * `CRON_SECRET` (`app/api/cron/daily`, `app/api/emergency/revalidate`).
 * Underscore-prefixed directory so Next.js does not treat this as a route.
 *
 * The comparison is constant-time. A plain `!==` on the header short-circuits
 * at the first wrong byte, which leaks the secret's prefix to anyone who can
 * time the responses — the same reason `lib/inventory/auth.ts` compares
 * session tokens and passcodes with `timingSafeEqual` rather than `===`.
 */
import { timingSafeEqual } from "node:crypto";

/**
 * True if `request` carries `Authorization: Bearer <CRON_SECRET>`. Returns
 * false when the secret is unset, so a misconfigured deployment fails closed.
 */
export function hasValidCronSecret(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return false;
  }

  const provided = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;

  const providedBuffer = Buffer.from(provided, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  if (providedBuffer.length !== expectedBuffer.length) {
    // timingSafeEqual requires equal-length buffers; comparing the expected
    // value against itself keeps this branch's cost in the same ballpark.
    timingSafeEqual(expectedBuffer, expectedBuffer);
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
}
