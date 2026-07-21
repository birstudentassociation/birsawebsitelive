import { NextResponse } from "next/server";
import { startClubSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { renderStartClub } from "@/lib/email/templates";

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip, "start-club")) {
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

  const result = startClubSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, email, clubName, description, members } = result.data;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 200 });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const inbox = process.env.BIRSA_INBOX ?? "birsa@tu.ac.th";
    const from = process.env.CONTACT_FROM ?? "BIRSA Portal <onboarding@resend.dev>";

    const rendered = renderStartClub({
      name,
      email,
      clubName,
      description,
      members,
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
    // Never log message bodies; a generic failure is all we record.
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
