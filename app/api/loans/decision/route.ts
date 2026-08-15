import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { requireRole, isGlobalOfficer } from "@/lib/inventory/auth";
import { decideLoan } from "@/lib/inventory/loans";
import { getItem } from "@/lib/inventory/items";
import { getBorrower } from "@/lib/inventory/borrowers";
import { recordAudit } from "@/lib/inventory/audit";
import { renderLoanApproved, renderLoanRejected } from "@/lib/email/templates";

const decisionSchema = z.object({
  id: z.string().min(1),
  decision: z.enum(["approved", "rejected"]),
  unitId: z.string().min(1).optional(),
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

  const result = decisionSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { id, decision, unitId } = result.data;

  const decided = await decideLoan({ id, decision, officerId: officer.id, unitId });

  if (!decided.ok) {
    if (decided.reason === "not-configured") {
      return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 200 });
    }
    if (decided.reason === "unit-required") {
      return NextResponse.json({ ok: false, reason: "unit-required" }, { status: 400 });
    }
    if (decided.reason === "unavailable") {
      return NextResponse.json({ ok: false, reason: "unavailable" }, { status: 409 });
    }
    if (decided.reason === "not-found") {
      return NextResponse.json({ ok: false, reason: "not-found" }, { status: 404 });
    }
    if (decided.reason === "already-decided") {
      return NextResponse.json({ ok: false, reason: "already-decided" }, { status: 400 });
    }
    return NextResponse.json({ ok: false, reason: "error" }, { status: 500 });
  }

  await recordAudit({
    officerId: officer.id,
    action: "loan.decision",
    entityType: "loan",
    entityId: decided.loan.id,
    detail: { decision, unitId: unitId ?? null },
  });

  // Best-effort student outcome email; never blocks the response.
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      const from = process.env.CONTACT_FROM ?? "BIRSA Portal <onboarding@resend.dev>";
      const item = await getItem(decided.loan.itemId);
      const itemNameEn = item?.name.en ?? "the item";
      const itemNameTh = item?.name.th ?? item?.name.en ?? "the item";
      const borrower = await getBorrower(decided.loan.borrowerId);

      if (borrower) {
        const email =
          decided.loan.status === "approved"
            ? renderLoanApproved({
                borrowerName: borrower.name,
                itemNameEn,
                itemNameTh,
                reference: decided.loan.reference,
                startDate: decided.loan.startDate,
                endDate: decided.loan.endDate,
              })
            : renderLoanRejected({
                borrowerName: borrower.name,
                itemNameEn,
                itemNameTh,
                reference: decided.loan.reference,
              });

        await resend.emails.send({
          from,
          to: borrower.email,
          subject: email.subject,
          html: email.html,
          text: email.text,
        });
      }
    } catch {
      // Notification email is optional; the decision itself already succeeded.
    }
  }

  return NextResponse.json({ ok: true, loan: decided.loan }, { status: 200 });
}
