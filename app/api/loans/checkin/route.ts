import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { requireRole, isGlobalOfficer } from "@/lib/inventory/auth";
import { checkinLoan } from "@/lib/inventory/loans";
import { recordAudit } from "@/lib/inventory/audit";

const checkinSchema = z.object({
  id: z.string().min(1),
  conditionIn: z.enum(["good", "worn", "damaged", "lost"]).optional(),
});

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip, "officer-api", 120)) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }

  const auth = await requireRole(["admin", "loan_officer"]);
  if (!auth.ok) {
    if (auth.status === 401) {
      return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ ok: false, reason: "forbidden" }, { status: 403 });
  }
  const { officer } = auth;
  if (!isGlobalOfficer(officer)) {
    return NextResponse.json({ ok: false, reason: "forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const result = checkinSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { id, conditionIn } = result.data;

  const checkedIn = await checkinLoan({ id, officerId: officer.id, conditionIn });

  if (!checkedIn.ok) {
    if (checkedIn.reason === "not-configured") {
      return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 200 });
    }
    if (checkedIn.reason === "invalid-state") {
      return NextResponse.json({ ok: false, reason: "invalid-state" }, { status: 400 });
    }
    if (checkedIn.reason === "not-found") {
      return NextResponse.json({ ok: false, reason: "not-found" }, { status: 404 });
    }
    return NextResponse.json({ ok: false, reason: "error" }, { status: 500 });
  }

  await recordAudit({
    officerId: officer.id,
    action: "loan.checkin",
    entityType: "loan",
    entityId: checkedIn.loan.id,
    detail: { conditionIn: conditionIn ?? null },
  });

  return NextResponse.json({ ok: true, loan: checkedIn.loan }, { status: 200 });
}
