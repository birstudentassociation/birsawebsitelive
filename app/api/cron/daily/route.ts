import { NextResponse } from "next/server";
import { isCronConfigured, runDailyJob } from "@/lib/inventory/notifications";
import { purgeExpiredPersonalData } from "@/lib/privacy/retention";

/**
 * Vercel Cron entrypoint (see root vercel.json, scheduled daily). Vercel
 * Cron issues a GET request with an `Authorization: Bearer <CRON_SECRET>`
 * header; no additional rate limiting is needed since this path is only
 * ever invoked by the scheduler.
 *
 * Also runs the PDPA s.37(3) retention purge (lib/privacy/retention.ts) on
 * this same daily schedule, rather than adding a second Vercel Cron entry:
 * one deletion pass a day is more than enough for a two-year retention
 * period, and one cron job is one less thing to configure and forget.
 */
export async function GET(request: Request) {
  if (!isCronConfigured()) {
    return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 200 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }

  const result = await runDailyJob();
  const purgeResult = await purgeExpiredPersonalData();

  if (!result.ok) {
    return NextResponse.json({ ok: false, reason: result.reason }, { status: 200 });
  }

  return NextResponse.json(
    {
      ok: true,
      ...result.summary,
      retentionPurge: purgeResult.ok ? purgeResult.counts : { skipped: purgeResult.reason },
    },
    { status: 200 }
  );
}
