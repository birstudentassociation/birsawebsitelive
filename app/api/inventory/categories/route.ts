import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { requireRole } from "@/lib/inventory/auth";
import { listCategories, createCategory } from "@/lib/inventory/categories";
import { recordAudit } from "@/lib/inventory/audit";

const bilingualSchema = z.object({ en: z.string(), th: z.string() });

const createCategorySchema = z.object({
  slug: z.string().min(1),
  name: bilingualSchema,
  sortOrder: z.number().optional(),
});

export async function GET() {
  const auth = await requireRole(["admin", "inventory_manager", "loan_officer", "read_only"]);
  if (!auth.ok) {
    return NextResponse.json({ ok: false }, { status: auth.status });
  }

  const categories = await listCategories();
  return NextResponse.json({ ok: true, categories }, { status: 200 });
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

  const parsed = createCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const result = await createCategory(parsed.data);
  if (!result.ok) {
    const status =
      result.reason === "not-configured" ? 200 : result.reason === "duplicate" ? 409 : 400;
    return NextResponse.json({ ok: false, reason: result.reason }, { status });
  }

  await recordAudit({
    officerId: auth.officer.id,
    action: "category.create",
    entityType: "category",
    entityId: result.category.id,
    detail: result.category,
  });

  return NextResponse.json({ ok: true, category: result.category }, { status: 200 });
}
