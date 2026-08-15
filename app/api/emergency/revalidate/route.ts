import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { hasValidCronSecret } from "@/app/api/_lib/cronAuth";
import { EMERGENCY_TAG } from "@/lib/emergency";

/**
 * On-demand purge for the emergency banner cache. The background revalidation
 * window in `lib/emergency.ts` is deliberately an hour (it doubles as the ISR
 * window for the whole site), so this route is what makes a toggle in Edge
 * Config go live immediately instead of waiting for the next hourly refresh.
 * Call it by hand (or wire it into whatever flips the Edge Config value) right
 * after changing `active`/`scenario` there.
 *
 * Authenticated the same way as the cron entrypoint (`app/api/cron/daily/route.ts`):
 * a bearer token matching `CRON_SECRET`, since that secret is already the
 * project's convention for "trusted automation, not a public endpoint" and
 * reusing it avoids provisioning a second one just for this.
 */
export async function POST(request: Request) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 200 });
  }

  if (!hasValidCronSecret(request)) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }

  // Next.js 16 made the cacheLife profile a required second argument. The
  // usual recommendation is `"max"`, which marks the tag stale and serves
  // stale-while-revalidate — but that would hand the *next* visitor the old
  // banner while the new one is fetched in the background, and this endpoint
  // exists precisely so a flood or campus-closure notice goes live at once.
  // `{ expire: 0 }` expires the entry immediately, which is what the
  // single-argument call used to do. `updateTag` would also expire
  // immediately but is Server Action-only, and this is a route handler.
  revalidateTag(EMERGENCY_TAG, { expire: 0 });

  return NextResponse.json(
    { ok: true, revalidated: EMERGENCY_TAG, now: new Date().toISOString() },
    { status: 200 }
  );
}
