import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { requireRole } from "@/lib/inventory/auth";
import { listOfficers, createOfficer } from "@/lib/inventory/officers";
import { getCustodian } from "@/lib/inventory/custodians";
import { recordAudit } from "@/lib/inventory/audit";

const createOfficerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(120),
  role: z.enum(["admin", "inventory_manager", "loan_officer", "read_only"]),
  passcode: z.string().min(6).max(200),
  custodianId: z.string().nullable().optional(),
});

export async function GET() {
  const auth = await requireRole(["admin"]);
  if (!auth.ok) {
    return NextResponse.json({ ok: false }, { status: auth.status });
  }
  if (auth.officer.custodianId !== null) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const officers = await listOfficers();
  return NextResponse.json({ ok: true, officers }, { status: 200 });
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

  const parsed = createOfficerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  if (parsed.data.custodianId) {
    const custodian = await getCustodian(parsed.data.custodianId);
    if (!custodian) {
      return NextResponse.json({ ok: false, reason: "validation" }, { status: 400 });
    }
  }

  const result = await createOfficer(parsed.data);
  if (!result.ok) {
    const status =
      result.reason === "not-configured" ? 200 : result.reason === "duplicate" ? 409 : 400;
    return NextResponse.json({ ok: false, reason: result.reason }, { status });
  }

  await recordAudit({
    officerId: auth.officer.id,
    action: "officer.create",
    entityType: "officer",
    entityId: result.officer.id,
    detail: { email: result.officer.email, role: result.officer.role },
  });

  return NextResponse.json({ ok: true, officer: result.officer }, { status: 200 });
}
