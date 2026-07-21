import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { requireRole } from "@/lib/inventory/auth";
import { updateCustodian } from "@/lib/inventory/custodians";
import { recordAudit } from "@/lib/inventory/audit";

const bilingualSchema = z.object({ en: z.string(), th: z.string() });

const updateCustodianSchema = z.object({
  name: bilingualSchema.optional(),
  contactName: bilingualSchema.optional(),
  contactEmail: z.string().nullable().optional(),
  contactInstagram: z.string().nullable().optional(),
  contactOther: z.string().nullable().optional(),
  borrowNote: bilingualSchema.optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }

  const auth = await requireRole(["admin"]);
  if (!auth.ok) {
    return NextResponse.json({ ok: false }, { status: auth.status });
  }
  if (auth.officer.custodianId !== null) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = updateCustodianSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const result = await updateCustodian(id, parsed.data);
  if (!result.ok) {
    const status =
      result.reason === "not-configured" ? 200 : result.reason === "not-found" ? 404 : 400;
    return NextResponse.json({ ok: false, reason: result.reason }, { status });
  }

  await recordAudit({
    officerId: auth.officer.id,
    action: "custodian.update",
    entityType: "custodian",
    entityId: result.custodian.id,
    detail: parsed.data,
  });

  return NextResponse.json({ ok: true, custodian: result.custodian }, { status: 200 });
}
