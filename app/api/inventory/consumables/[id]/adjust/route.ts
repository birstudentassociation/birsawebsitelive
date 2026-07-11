import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { requireRole, canManageCustodian } from "@/lib/inventory/auth";
import { adjustStock } from "@/lib/inventory/consumables";
import { getItem } from "@/lib/inventory/items";
import { recordAudit } from "@/lib/inventory/audit";

const adjustStockSchema = z.object({
  delta: z.number(),
  reason: z.string().optional(),
});

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const parsed = adjustStockSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const item = await getItem(id);
  if (!item) {
    return NextResponse.json({ ok: false, reason: "not-found" }, { status: 404 });
  }
  if (!canManageCustodian(auth.officer, item.custodianId)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const result = await adjustStock({
    itemId: id,
    delta: parsed.data.delta,
    reason: parsed.data.reason,
    officerId: auth.officer.id,
  });
  if (!result.ok) {
    const status =
      result.reason === "not-configured"
        ? 200
        : result.reason === "not-found"
          ? 404
          : result.reason === "not-consumable"
            ? 400
            : result.reason === "insufficient"
              ? 409
              : 500;
    return NextResponse.json({ ok: false, reason: result.reason }, { status });
  }

  await recordAudit({
    officerId: auth.officer.id,
    action: "consumable.adjust",
    entityType: "item",
    entityId: id,
    detail: { delta: parsed.data.delta, reason: parsed.data.reason, resultingQty: result.resultingQty },
  });

  return NextResponse.json({ ok: true, resultingQty: result.resultingQty }, { status: 200 });
}
