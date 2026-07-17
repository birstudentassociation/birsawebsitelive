import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { requireRole } from "@/lib/inventory/auth";
import { cancelLoan, getLoanByReferenceAndEmail } from "@/lib/inventory/loans";
import { recordAudit } from "@/lib/inventory/audit";

const publicCancelSchema = z.object({
  reference: z.string().min(1).max(40),
  email: z.string().email(),
  nickname: z.string().max(0).optional().or(z.literal("")),
});

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

  const bodyId =
    typeof body === "object" && body !== null && typeof (body as { id?: unknown }).id === "string"
      ? (body as { id: string }).id
      : "";

  const auth = await requireRole(["admin", "loan_officer"]);
  if (auth.ok && bodyId) {
    const cancelled = await cancelLoan({ id: bodyId, byOfficerId: auth.officer.id });

    if (!cancelled.ok) {
      if (cancelled.reason === "not-configured") {
        return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 200 });
      }
      if (cancelled.reason === "invalid-state") {
        return NextResponse.json({ ok: false, reason: "invalid-state" }, { status: 400 });
      }
      if (cancelled.reason === "not-found") {
        return NextResponse.json({ ok: false, reason: "not-found" }, { status: 404 });
      }
      return NextResponse.json({ ok: false, reason: "error" }, { status: 500 });
    }

    await recordAudit({
      officerId: auth.officer.id,
      action: "loan.cancel",
      entityType: "loan",
      entityId: cancelled.loan.id,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // Honeypot filled: silently accept and discard, never reveal detection.
  if (typeof body === "object" && body !== null && (body as { nickname?: unknown }).nickname) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const result = publicCancelSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { reference, email } = result.data;

  const loan = await getLoanByReferenceAndEmail(reference, email);
  if (!loan || loan.status !== "pending") {
    return NextResponse.json({ ok: false, reason: "not-found" }, { status: 200 });
  }

  const cancelled = await cancelLoan({ id: loan.id });
  if (!cancelled.ok) {
    if (cancelled.reason === "not-configured") {
      return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 200 });
    }
    return NextResponse.json({ ok: false, reason: "not-found" }, { status: 200 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
