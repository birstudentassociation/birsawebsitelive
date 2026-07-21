import { NextResponse } from "next/server";
import { inventoryLoanRequestSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { createLoanRequest } from "@/lib/inventory/loans";
import { getItemByKey } from "@/lib/inventory/items";
import { renderOfficerNewRequest } from "@/lib/email/templates";

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}

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

  // Honeypot filled: silently accept and discard, never reveal detection.
  if (typeof body === "object" && body !== null && (body as { nickname?: unknown }).nickname) {
    return NextResponse.json({ ok: true, reference: "" }, { status: 200 });
  }

  const result = inventoryLoanRequestSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { itemKey, studentName, studentId, studentEmail, phone, startDate, endDate, reason } =
    result.data;

  const created = await createLoanRequest({
    itemKey,
    startDate,
    endDate,
    reason: reason || null,
    borrower: {
      tuStudentId: studentId,
      name: studentName,
      email: studentEmail,
      phone: phone || null,
    },
  });

  if (!created.ok) {
    if (created.reason === "not-configured") {
      return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 200 });
    }
    if (created.reason === "invalid") {
      return NextResponse.json({ ok: false, reason: "validation" }, { status: 400 });
    }
    if (created.reason === "unavailable") {
      return NextResponse.json({ ok: false, reason: "unavailable" }, { status: 409 });
    }
    if (created.reason === "blocklisted") {
      return NextResponse.json({ ok: false, reason: "blocklisted" }, { status: 409 });
    }
    if (created.reason === "limit-exceeded") {
      return NextResponse.json({ ok: false, reason: "limit-exceeded" }, { status: 409 });
    }
    return NextResponse.json({ ok: false, reason: "error" }, { status: 500 });
  }

  // Best-effort officer notification email; never blocks the response.
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      const inbox = process.env.BIRSA_INBOX ?? "birsa@tu.ac.th";
      const from = process.env.CONTACT_FROM ?? "BIRSA Portal <onboarding@resend.dev>";
      const item = await getItemByKey(itemKey);
      const itemNameEn = item?.name.en ?? itemKey;
      const itemNameTh = item?.name.th ?? item?.name.en ?? itemKey;

      const email = renderOfficerNewRequest({
        itemNameEn,
        itemNameTh,
        reference: created.reference,
        studentName,
        studentId,
        studentEmail,
        startDate,
        endDate,
        reason,
      });

      await resend.emails.send({
        from,
        to: inbox,
        replyTo: studentEmail,
        subject: email.subject,
        html: email.html,
        text: email.text,
      });
    } catch {
      // Notification email is optional; the request itself already succeeded.
    }
  }

  return NextResponse.json({ ok: true, reference: created.reference }, { status: 200 });
}
