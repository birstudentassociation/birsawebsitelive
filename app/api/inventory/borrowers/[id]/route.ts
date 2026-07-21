import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { requireRole } from "@/lib/inventory/auth";
import { getBorrower, updateBorrower } from "@/lib/inventory/borrowers";
import { recordAudit } from "@/lib/inventory/audit";

const updateBorrowerSchema = z
  .object({
    blocklisted: z.boolean(),
    blocklistReason: z.string().nullable(),
    maxConcurrentLoans: z.number().int().nullable(),
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().nullable(),
  })
  .partial();

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }

  const auth = await requireRole(["admin", "loan_officer"]);
  if (!auth.ok) {
    return NextResponse.json({ ok: false }, { status: auth.status });
  }

  const { id } = await params;
  const borrower = await getBorrower(id);
  if (!borrower) {
    return NextResponse.json({ ok: false, reason: "not-found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, borrower }, { status: 200 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }

  const auth = await requireRole(["admin", "loan_officer"]);
  if (!auth.ok) {
    return NextResponse.json({ ok: false }, { status: auth.status });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = updateBorrowerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const result = await updateBorrower(id, parsed.data);
  if (!result.ok) {
    const status =
      result.reason === "not-configured" ? 200 : result.reason === "not-found" ? 404 : 500;
    return NextResponse.json({ ok: false, reason: result.reason }, { status });
  }

  await recordAudit({
    officerId: auth.officer.id,
    action: "borrower.update",
    entityType: "borrower",
    entityId: result.borrower.id,
    detail: parsed.data,
  });

  return NextResponse.json({ ok: true, borrower: result.borrower }, { status: 200 });
}
