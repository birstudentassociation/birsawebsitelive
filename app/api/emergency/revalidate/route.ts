import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
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

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }

  revalidateTag(EMERGENCY_TAG);

  return NextResponse.json(
    { ok: true, revalidated: EMERGENCY_TAG, now: new Date().toISOString() },
    { status: 200 }
  );
}
