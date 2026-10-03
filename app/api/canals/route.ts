import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { getCanalSnapshot } from "@/lib/conditions/sources/canals";

export const revalidate = 600;

export async function GET(request: Request) {
  if (!checkRateLimit(getClientIp(request), "canals", 120)) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }
  const snapshot = await getCanalSnapshot();
  if (!snapshot) {
    return NextResponse.json(
      { ok: false, reason: "unavailable" },
      { status: 502, headers: { "cache-control": "no-store" } }
    );
  }
  return NextResponse.json(
    { ok: true, ...snapshot },
    {
      headers: {
        "cache-control": "public, s-maxage=600, stale-while-revalidate=1800",
        "access-control-allow-origin": "*",
      },
    }
  );
}
