import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { getConditionsSnapshot } from "@/lib/conditions/snapshot";

export const revalidate = 300;

export const maxDuration = 60;

export async function GET(request: Request) {
  if (!checkRateLimit(getClientIp(request), "conditions", 120)) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }

  let snapshot;
  try {
    snapshot = await getConditionsSnapshot();
  } catch {
    return NextResponse.json(
      { ok: false, reason: "error" },
      { status: 500, headers: { "cache-control": "no-store" } }
    );
  }

  const hasData = snapshot.readings.some((reading) => reading.value !== null);
  return NextResponse.json(
    { ok: true, ...snapshot },
    {
      headers: {
        "cache-control": hasData
          ? "public, s-maxage=300, stale-while-revalidate=900"
          : "public, s-maxage=15",
        "access-control-allow-origin": "*",
      },
    }
  );
}
