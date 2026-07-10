import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { requireRole } from "@/lib/inventory/auth";
import { checkoutLoan } from "@/lib/inventory/loans";
import { recordAudit } from "@/lib/inventory/audit";

const checkoutSchema = z.object({
  id: z.string().min(1),
  conditionOut: z.enum(["good", "worn", "damaged", "lost"]).optional(),
});

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const result = checkoutSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { id, conditionOut } = result.data;

  const checkedOut = await checkoutLoan({ id, officerId: officer.id, conditionOut });

  if (!checkedOut.ok) {
    if (checkedOut.reason === "not-configured") {
      return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 200 });
    }
    if (checkedOut.reason === "invalid-state") {
      return NextResponse.json({ ok: false, reason: "invalid-state" }, { status: 400 });
    }
    if (checkedOut.reason === "not-found") {
      return NextResponse.json({ ok: false, reason: "not-found" }, { status: 404 });
    }
    return NextResponse.json({ ok: false, reason: "error" }, { status: 500 });
  }

  await recordAudit({
    officerId: officer.id,
    action: "loan.checkout",
    entityType: "loan",
    entityId: checkedOut.loan.id,
    detail: { conditionOut: conditionOut ?? null },
  });

  return NextResponse.json({ ok: true, loan: checkedOut.loan }, { status: 200 });
}
