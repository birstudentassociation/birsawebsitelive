import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { requireRole, canManageCustodian } from "@/lib/inventory/auth";
import { listUnits, createUnit } from "@/lib/inventory/units";
import { getItem } from "@/lib/inventory/items";
import { recordAudit } from "@/lib/inventory/audit";
import type { UnitState } from "@/lib/inventory/types";

const createUnitSchema = z.object({
  itemId: z.string().min(1),
  label: z.string().min(1),
  condition: z.enum(["good", "worn", "damaged", "lost"]).optional(),
  state: z.enum(["available", "reserved", "on_loan", "maintenance", "retired"]).optional(),
  locationId: z.string().min(1).optional(),
  notes: z.string().optional(),
});

export async function GET(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }

  const auth = await requireRole(["admin", "inventory_manager", "loan_officer", "read_only"]);
  if (!auth.ok) {
    return NextResponse.json({ ok: false }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("itemId") ?? undefined;
  const state = (searchParams.get("state") as UnitState | null) ?? undefined;
  const locationId = searchParams.get("locationId") ?? undefined;

  const units = await listUnits({ itemId, state, locationId });
  return NextResponse.json({ ok: true, units }, { status: 200 });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
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

  const parsed = createUnitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const ownerItem = await getItem(parsed.data.itemId);
  if (!ownerItem) {
    return NextResponse.json({ ok: false, reason: "not-found" }, { status: 404 });
  }
  if (!canManageCustodian(auth.officer, ownerItem.custodianId)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const result = await createUnit(parsed.data);
  if (!result.ok) {
    const status =
      result.reason === "not-configured" ? 200 : result.reason === "duplicate" ? 409 : 500;
    return NextResponse.json({ ok: false, reason: result.reason }, { status });
  }

  await recordAudit({
    officerId: auth.officer.id,
    action: "unit.create",
    entityType: "unit",
    entityId: result.unit.id,
    detail: { itemId: result.unit.itemId, label: result.unit.label },
  });

  return NextResponse.json({ ok: true, unit: result.unit }, { status: 200 });
}
