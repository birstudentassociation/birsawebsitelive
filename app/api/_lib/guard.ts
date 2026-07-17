/**
 * Shared helpers for form API routes: client IP extraction and a best-effort
 * in-memory rate limiter. Underscore-prefixed directory so Next.js does not
 * treat this as a route.
 *
 * In-memory state is fine here: a serverless cold start just resets the
 * counters, which only makes the limiter slightly more permissive, never
 * less safe.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();

/** Extracts the client IP from `x-forwarded-for` (first value) or falls back to "unknown". */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  return "unknown";
}

/**
 * Returns `true` if the request from `ip` is within the rate limit, and
 * records the attempt. Returns `false` when the limit has been exceeded.
 */
export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    buckets.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (bucket.count >= MAX_REQUESTS) {
    return false;
  }

  bucket.count += 1;
  return true;
}
