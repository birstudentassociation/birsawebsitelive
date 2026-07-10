import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { requireRole } from "@/lib/inventory/auth";
import { listItems, createItem } from "@/lib/inventory/items";
import { recordAudit } from "@/lib/inventory/audit";

const bilingualSchema = z.object({ en: z.string(), th: z.string() });

const createItemSchema = z.object({
  key: z.string().min(1),
  categoryId: z.string().optional(),
  name: bilingualSchema,
  description: bilingualSchema.optional(),
  trackingMode: z.enum(["asset", "consumable"]),
  defaultLocationId: z.string().optional(),
  maxLoanDays: z.number(),
  qtyOnHand: z.number().nullable().optional(),
  reorderThreshold: z.number().nullable().optional(),
});

export async function GET(request: Request) {
  const auth = await requireRole(["admin", "inventory_manager", "loan_officer", "read_only"]);
  if (!auth.ok) {
    return NextResponse.json({ ok: false }, { status: auth.status });
  }

  const url = new URL(request.url);
  const search = url.searchParams.get("search") ?? undefined;
  const categoryId = url.searchParams.get("categoryId") ?? undefined;
  const includeRetired = url.searchParams.get("includeRetired") === "true";

  const items = await listItems({ search, categoryId, includeRetired });
  return NextResponse.json({ ok: true, items }, { status: 200 });
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

  const parsed = createItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const result = await createItem({ ...parsed.data, createdBy: auth.officer.id });
  if (!result.ok) {
    const status =
      result.reason === "not-configured" ? 200 : result.reason === "duplicate" ? 409 : result.reason === "invalid" ? 400 : 400;
    return NextResponse.json({ ok: false, reason: result.reason }, { status });
  }

  await recordAudit({
    officerId: auth.officer.id,
    action: "item.create",
    entityType: "item",
    entityId: result.item.id,
    detail: result.item,
  });

  return NextResponse.json({ ok: true, item: result.item }, { status: 200 });
}
