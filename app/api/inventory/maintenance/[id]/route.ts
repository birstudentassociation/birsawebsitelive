import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { requireRole, canManageCustodian } from "@/lib/inventory/auth";
import { closeMaintenance, getMaintenanceEntry } from "@/lib/inventory/maintenance";
import { getUnit } from "@/lib/inventory/units";
import { getItem } from "@/lib/inventory/items";
import { recordAudit } from "@/lib/inventory/audit";

const closeMaintenanceSchema = z.object({
  actionTaken: z.string().optional(),
  conditionAfter: z.enum(["good", "worn", "damaged", "lost"]).optional(),
});

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip, "officer-api", 120)) {
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

  const parsed = closeMaintenanceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const entry = await getMaintenanceEntry(id);
  if (!entry) {
    return NextResponse.json({ ok: false, reason: "not-found" }, { status: 404 });
  }
  const unit = await getUnit(entry.unitId);
  const ownerItem = unit ? await getItem(unit.itemId) : null;
  if (!ownerItem || !canManageCustodian(auth.officer, ownerItem.custodianId)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const result = await closeMaintenance(id, { ...parsed.data, officerId: auth.officer.id });
  if (!result.ok) {
    const status =
      result.reason === "not-configured"
        ? 200
        : result.reason === "not-found"
          ? 404
          : result.reason === "already-closed"
            ? 400
            : 500;
    return NextResponse.json({ ok: false, reason: result.reason }, { status });
  }

  await recordAudit({
    officerId: auth.officer.id,
    action: "maintenance.close",
    entityType: "maintenance",
    entityId: result.entry.id,
    detail: { unitId: result.entry.unitId, actionTaken: result.entry.actionTaken },
  });

  return NextResponse.json({ ok: true, entry: result.entry }, { status: 200 });
}
