import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { requireRole } from "@/lib/inventory/auth";
import { listCustodians, createCustodian } from "@/lib/inventory/custodians";
import { recordAudit } from "@/lib/inventory/audit";

const bilingualSchema = z.object({ en: z.string(), th: z.string() });

const createCustodianSchema = z.object({
  slug: z.string().min(1),
  kind: z.enum(["birsa", "club"]),
  name: bilingualSchema,
  contactName: bilingualSchema.optional(),
  contactEmail: z.string().nullable().optional(),
  contactInstagram: z.string().nullable().optional(),
  contactOther: z.string().nullable().optional(),
  borrowNote: bilingualSchema.optional(),
  sortOrder: z.number().optional(),
});

export async function GET() {
  const auth = await requireRole(["admin", "inventory_manager", "loan_officer", "read_only"]);
  if (!auth.ok) {
    return NextResponse.json({ ok: false }, { status: auth.status });
  }

  const custodians = await listCustodians({ includeInactive: true });
  return NextResponse.json({ ok: true, custodians }, { status: 200 });
}

export async function POST(request: Request) {
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = createCustodianSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const result = await createCustodian(parsed.data);
  if (!result.ok) {
    const status =
      result.reason === "not-configured" ? 200 : result.reason === "duplicate" ? 409 : 400;
    return NextResponse.json({ ok: false, reason: result.reason }, { status });
  }

  await recordAudit({
    officerId: auth.officer.id,
    action: "custodian.create",
    entityType: "custodian",
    entityId: result.custodian.id,
    detail: result.custodian,
  });

  return NextResponse.json({ ok: true, custodian: result.custodian }, { status: 200 });
}
