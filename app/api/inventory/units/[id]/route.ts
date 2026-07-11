import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { requireRole, canManageCustodian } from "@/lib/inventory/auth";
import { getUnit, updateUnit } from "@/lib/inventory/units";
import { getItem } from "@/lib/inventory/items";
import { recordAudit } from "@/lib/inventory/audit";

const updateUnitSchema = z
  .object({
    label: z.string().min(1),
    condition: z.enum(["good", "worn", "damaged", "lost"]),
    state: z.enum(["available", "reserved", "on_loan", "maintenance", "retired"]),
    locationId: z.string().min(1).nullable(),
    notes: z.string().nullable(),
    photoUrl: z.string().nullable(),
  })
  .partial();

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }

  const auth = await requireRole(["admin", "inventory_manager"]);
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

  const parsed = updateUnitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const unit = await getUnit(id);
  if (!unit) {
    return NextResponse.json({ ok: false, reason: "not-found" }, { status: 404 });
  }
  const ownerItem = await getItem(unit.itemId);
  if (!ownerItem || !canManageCustodian(auth.officer, ownerItem.custodianId)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const result = await updateUnit(id, parsed.data);
  if (!result.ok) {
    const status = result.reason === "not-configured" ? 200 : result.reason === "not-found" ? 404 : 500;
    return NextResponse.json({ ok: false, reason: result.reason }, { status });
  }

  await recordAudit({
    officerId: auth.officer.id,
    action: "unit.update",
    entityType: "unit",
    entityId: result.unit.id,
    detail: parsed.data,
  });

  return NextResponse.json({ ok: true, unit: result.unit }, { status: 200 });
}
