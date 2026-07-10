import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { requireRole } from "@/lib/inventory/auth";
import { listBorrowers } from "@/lib/inventory/borrowers";

export async function GET(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }

  const auth = await requireRole(["admin", "loan_officer"]);
  if (!auth.ok) {
    return NextResponse.json({ ok: false }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;

  const borrowers = await listBorrowers({ search });
  return NextResponse.json({ ok: true, borrowers }, { status: 200 });
}
