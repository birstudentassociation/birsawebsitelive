import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { requireRole, canManageCustodian } from "@/lib/inventory/auth";
import { openMaintenance } from "@/lib/inventory/maintenance";
import { getUnit } from "@/lib/inventory/units";
import { getItem } from "@/lib/inventory/items";
import { recordAudit } from "@/lib/inventory/audit";

const openMaintenanceSchema = z.object({
  unitId: z.string().min(1),
  issue: z.string().min(1),
  conditionBefore: z.enum(["good", "worn", "damaged", "lost"]).optional(),
});

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip, "officer-api", 120)) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }

  const auth = await requireRole(["admin", "inventory_manager"]);
  if (!auth.ok) {
    return NextResponse.json({ ok: false }, { status: auth.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = openMaintenanceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const unit = await getUnit(parsed.data.unitId);
  if (!unit) {
    return NextResponse.json({ ok: false, reason: "not-found" }, { status: 404 });
  }
  const ownerItem = await getItem(unit.itemId);
  if (!ownerItem || !canManageCustodian(auth.officer, ownerItem.custodianId)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const result = await openMaintenance({ ...parsed.data, officerId: auth.officer.id });
  if (!result.ok) {
    const status =
      result.reason === "not-configured" ? 200 : result.reason === "not-found" ? 404 : 500;
    return NextResponse.json({ ok: false, reason: result.reason }, { status });
  }

  await recordAudit({
    officerId: auth.officer.id,
    action: "maintenance.open",
    entityType: "maintenance",
    entityId: result.entry.id,
    detail: { unitId: result.entry.unitId, issue: result.entry.issue },
  });

  return NextResponse.json({ ok: true, entry: result.entry }, { status: 200 });
}
