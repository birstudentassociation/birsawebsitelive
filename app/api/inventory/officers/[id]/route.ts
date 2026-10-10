import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { isUuid, notFoundResponse } from "@/app/api/_lib/inventoryInput";
import { requireRole } from "@/lib/inventory/auth";
import { listOfficers, updateOfficer } from "@/lib/inventory/officers";
import { getCustodian } from "@/lib/inventory/custodians";
import { recordAudit } from "@/lib/inventory/audit";

const updateOfficerSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  role: z.enum(["admin", "inventory_manager", "loan_officer", "read_only"]).optional(),
  isActive: z.boolean().optional(),
  passcode: z.string().min(6).max(200).optional(),
  custodianId: z.string().nullable().optional(),
});

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip, "officer-api", 120)) {
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
  if (!isUuid(id)) {
    return notFoundResponse();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = updateOfficerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const stepsDown =
    id === auth.officer.id &&
    (parsed.data.isActive === false ||
      (parsed.data.role !== undefined && parsed.data.role !== "admin"));
  if (stepsDown) {
    const officers = await listOfficers();
    const activeAdmins = officers.filter(
      (o) => o.role === "admin" && o.isActive && o.custodianId === null
    );
    if (activeAdmins.length <= 1) {
      return NextResponse.json({ ok: false, reason: "last-admin" }, { status: 409 });
    }
  }

  if (parsed.data.custodianId) {
    const custodian = await getCustodian(parsed.data.custodianId);
    if (!custodian) {
      return NextResponse.json({ ok: false, reason: "validation" }, { status: 400 });
    }
  }

  const result = await updateOfficer(id, parsed.data);
  if (!result.ok) {
    const status =
      result.reason === "not-configured" ? 200 : result.reason === "not-found" ? 404 : 400;
    return NextResponse.json({ ok: false, reason: result.reason }, { status });
  }

  await recordAudit({
    officerId: auth.officer.id,
    action: "officer.update",
    entityType: "officer",
    entityId: result.officer.id,
    detail: { ...parsed.data, passcode: parsed.data.passcode ? "[redacted]" : undefined },
  });

  return NextResponse.json({ ok: true, officer: result.officer }, { status: 200 });
}
