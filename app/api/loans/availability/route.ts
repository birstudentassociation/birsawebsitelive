import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { getItemAvailabilityForRange } from "@/lib/inventory/loans";

export async function GET(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip, "loan-availability", 60)) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const itemKey = searchParams.get("itemKey");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!itemKey || !start || !end) {
    return NextResponse.json({ ok: false, reason: "validation" }, { status: 400 });
  }

  const availability = await getItemAvailabilityForRange(itemKey, start, end);

  return NextResponse.json(
    {
      ok: true,
      total: availability.total,
      available: availability.available,
      configured: availability.configured,
    },
    { status: 200 }
  );
}
