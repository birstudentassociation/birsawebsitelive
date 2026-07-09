import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { OFFICER_COOKIE, createSessionToken, verifyPasscode } from "@/lib/officer-session";

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

  const passcode =
    typeof body === "object" && body !== null && typeof (body as { passcode?: unknown }).passcode === "string"
      ? (body as { passcode: string }).passcode
      : "";

  if (!verifyPasscode(passcode)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const token = createSessionToken();
  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.cookies.set(OFFICER_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
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
