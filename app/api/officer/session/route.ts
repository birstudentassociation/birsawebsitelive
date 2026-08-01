import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import {
  OFFICER_COOKIE,
  authenticateOfficer,
  createSessionToken,
  isInventoryAuthConfigured,
} from "@/lib/inventory/auth";
import { recordAudit } from "@/lib/inventory/audit";

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip, "officer-login")) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const record = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};

  // Honeypot: a real user never fills this hidden field.
  if (record.nickname) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!isInventoryAuthConfigured()) {
    return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 200 });
  }

  const email = typeof record.email === "string" ? record.email : "";
  const passcode = typeof record.passcode === "string" ? record.passcode : "";

  if (!email || !passcode) {
    return NextResponse.json({ ok: false, reason: "validation" }, { status: 400 });
  }

  const officer = await authenticateOfficer(email, passcode);
  if (!officer) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const token = createSessionToken({ id: officer.id, role: officer.role });
  const response = NextResponse.json(
    { ok: true, officer: { id: officer.id, name: officer.name, role: officer.role } },
    { status: 200 }
  );
  response.cookies.set(OFFICER_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });

  await recordAudit({
    officerId: officer.id,
    action: "officer.login",
    entityType: "officer",
    entityId: officer.id,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.cookies.set(OFFICER_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
