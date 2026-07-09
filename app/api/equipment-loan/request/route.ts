import { NextResponse } from "next/server";
import { loanRequestSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { createLoanRequest } from "@/lib/equipment-loan";
import { getEquipmentItem } from "@/content/services/equipment";

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Honeypot filled — silently accept and discard, never reveal detection.
  if (typeof body === "object" && body !== null && (body as { nickname?: unknown }).nickname) {
    return NextResponse.json({ ok: true, reference: "" }, { status: 200 });
  }

  const result = loanRequestSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { itemKey, studentName, studentId, studentEmail, pickupDate, returnDate, reason } = result.data;

  const item = getEquipmentItem(itemKey);
  if (!item) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: { itemKey: ["Unknown item"] } },
      { status: 400 }
    );
  }

  const pickup = new Date(`${pickupDate}T00:00:00Z`);
  const ret = new Date(`${returnDate}T00:00:00Z`);
  const loanDays = Math.round((ret.getTime() - pickup.getTime()) / MS_PER_DAY);
  if (Number.isNaN(loanDays) || loanDays < 0 || loanDays > item.maxLoanDays) {
    return NextResponse.json(
      {
        ok: false,
        reason: "validation",
        errors: { returnDate: [`Loan period cannot exceed ${item.maxLoanDays} day(s)`] },
      },
      { status: 400 }
    );
  }

  const created = await createLoanRequest({
    itemKey,
    studentName,
    studentId,
    studentEmail,
    pickupDate,
    returnDate,
    reason: reason || undefined,
  });

  if (!created.ok) {
    if (created.reason === "not-configured") {
      return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 200 });
    }
    if (created.reason === "unavailable") {
      return NextResponse.json({ ok: false, reason: "unavailable" }, { status: 409 });
    }
    return NextResponse.json({ ok: false, reason: "error" }, { status: 500 });
  }

  // Best-effort officer notification email — never blocks the response.
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      const inbox = process.env.BIRSA_INBOX ?? "birsa@tu.ac.th";
      const from = process.env.CONTACT_FROM ?? "BIRSA Portal <onboarding@resend.dev>";

      await resend.emails.send({
        from,
        to: inbox,
        replyTo: studentEmail,
        subject: `[Equipment loan] New request ${created.reference}`,
        text: [
          `Item: ${item.name.en}`,
          `Reference: ${created.reference}`,
          `Student: ${studentName} (${studentId}) <${studentEmail}>`,
          `Pickup: ${pickupDate}`,
          `Return: ${returnDate}`,
          reason ? `Reason: ${reason}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      });
    } catch {
      // Notification email is optional; the request itself already succeeded.
    }
  }

  return NextResponse.json({ ok: true, reference: created.reference }, { status: 200 });
}
