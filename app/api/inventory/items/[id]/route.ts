import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { requireRole } from "@/lib/inventory/auth";
import { updateItem } from "@/lib/inventory/items";
import { recordAudit } from "@/lib/inventory/audit";

const bilingualSchema = z.object({ en: z.string(), th: z.string() });

const updateItemSchema = z.object({
  categoryId: z.string().nullable().optional(),
  name: bilingualSchema.optional(),
  description: bilingualSchema.optional(),
  defaultLocationId: z.string().nullable().optional(),
  maxLoanDays: z.number().optional(),
  qtyOnHand: z.number().nullable().optional(),
  reorderThreshold: z.number().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  isRetired: z.boolean().optional(),
});

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

  const parsed = updateItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const result = await updateItem(id, parsed.data);
  if (!result.ok) {
    const status = result.reason === "not-configured" ? 200 : result.reason === "not-found" ? 404 : 400;
    return NextResponse.json({ ok: false, reason: result.reason }, { status });
  }

  await recordAudit({
    officerId: auth.officer.id,
    action: "item.update",
    entityType: "item",
    entityId: result.item.id,
    detail: parsed.data,
  });

  return NextResponse.json({ ok: true, item: result.item }, { status: 200 });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }

  const auth = await requireRole(["admin", "inventory_manager"]);
  if (!auth.ok) {
    return NextResponse.json({ ok: false }, { status: auth.status });
  }

  const { id } = await params;

  const result = await updateItem(id, { isRetired: true });
  if (!result.ok) {
    const status = result.reason === "not-configured" ? 200 : result.reason === "not-found" ? 404 : 400;
    return NextResponse.json({ ok: false, reason: result.reason }, { status });
  }

  await recordAudit({
    officerId: auth.officer.id,
    action: "item.retire",
    entityType: "item",
    entityId: result.item.id,
  });

  return NextResponse.json({ ok: true, item: result.item }, { status: 200 });
}
