import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { requireRole } from "@/lib/inventory/auth";
import { listItems, createItem } from "@/lib/inventory/items";
import { getCustodian, getCustodianBySlug } from "@/lib/inventory/custodians";
import { recordAudit } from "@/lib/inventory/audit";

const bilingualSchema = z.object({ en: z.string(), th: z.string() });

const createItemSchema = z.object({
  key: z.string().min(1),
  categoryId: z.string().optional(),
  custodianId: z.string().optional(),
  name: bilingualSchema,
  description: bilingualSchema.optional(),
  trackingMode: z.enum(["asset", "consumable"]),
  defaultLocationId: z.string().optional(),
  maxLoanDays: z.number(),
  onlineLoanable: z.boolean().optional(),
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

  // Scope comes from the session, never from the caller: a club-scoped
  // officer sees only their own custodian's items. The officer console page
  // passes the same filter when it calls listItems directly, but relying on
  // that alone would leave every other club's catalogue readable by anyone
  // who calls this route by hand.
  const custodianId = auth.officer.custodianId ?? undefined;

  const items = await listItems({ search, categoryId, includeRetired, custodianId });
  return NextResponse.json({ ok: true, items }, { status: 200 });
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

  const parsed = createItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  let custodianId: string | null;
  if (auth.officer.custodianId !== null) {
    // Scoped club custodian: ignore any client-supplied custodianId, force own club.
    custodianId = auth.officer.custodianId;
  } else if (parsed.data.custodianId) {
    const custodian = await getCustodian(parsed.data.custodianId);
    if (!custodian) {
      return NextResponse.json({ ok: false, reason: "validation" }, { status: 400 });
    }
    custodianId = custodian.id;
  } else {
    const birsa = await getCustodianBySlug("birsa");
    custodianId = birsa?.id ?? null;
  }

  const result = await createItem({
    ...parsed.data,
    custodianId,
    onlineLoanable: parsed.data.onlineLoanable ?? false,
    createdBy: auth.officer.id,
  });
  if (!result.ok) {
    const status =
      result.reason === "not-configured"
        ? 200
        : result.reason === "duplicate"
          ? 409
          : result.reason === "invalid"
            ? 400
            : 400;
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
