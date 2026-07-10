import { NextResponse } from "next/server";
import { isCronConfigured, runDailyJob } from "@/lib/inventory/notifications";

/**
 * Vercel Cron entrypoint (see root vercel.json, scheduled daily). Vercel
 * Cron issues a GET request with an `Authorization: Bearer <CRON_SECRET>`
 * header; no additional rate limiting is needed since this path is only
 * ever invoked by the scheduler.
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
  if (!result.ok) {
    return NextResponse.json({ ok: false, reason: result.reason }, { status: 200 });
  }

  return NextResponse.json({ ok: true, ...result.summary }, { status: 200 });
}
