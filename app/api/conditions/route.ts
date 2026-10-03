import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { getConditionsSnapshot } from "@/lib/conditions/snapshot";

export const revalidate = 300;

export async function GET(request: Request) {
  if (!checkRateLimit(getClientIp(request), "conditions", 120)) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }
  const snapshot = await getConditionsSnapshot();
  return NextResponse.json(
    { ok: true, ...snapshot },
    {
      headers: {
        "cache-control": "public, s-maxage=300, stale-while-revalidate=900",
        "access-control-allow-origin": "*",
      },
    }
  );
}
