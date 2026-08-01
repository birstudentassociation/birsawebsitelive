import { NextResponse } from "next/server";
import { rightsRequestSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { renderRightsRequest } from "@/lib/email/templates";
import { formatDate } from "@/lib/i18n";
import { rightById, rightsDeadlineIso } from "@/lib/privacy/rightsRequest";

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip, "rights-request")) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Honeypot filled: silently accept and discard, never reveal detection.
  // Checked BEFORE schema validation so bots never see a validation error
  // pointing at the trap field.
  if (typeof body === "object" && body !== null && (body as { nickname?: unknown }).nickname) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const result = rightsRequestSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { right, name, email, details } = result.data;
  const rightInfo = rightById(right);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 200 });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const inbox = process.env.BIRSA_INBOX ?? "birsa@tu.ac.th";
    const from = process.env.CONTACT_FROM ?? "BIRSA Portal <onboarding@resend.dev>";

    const deadlineIso = rightsDeadlineIso();
    const rendered = renderRightsRequest({
      name,
      email,
      rightNameEn: rightInfo?.name.en ?? right,
      rightNameTh: rightInfo?.name.th ?? right,
      section: rightInfo?.section ?? "",
      details,
      deadlineEn: formatDate("en", deadlineIso),
      deadlineTh: formatDate("th", deadlineIso),
    });

    await resend.emails.send({
      from,
      to: inbox,
      replyTo: email,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    // Never log request details; a generic failure is all we record.
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
