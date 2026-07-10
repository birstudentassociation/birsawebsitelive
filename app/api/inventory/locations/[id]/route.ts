import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { requireRole } from "@/lib/inventory/auth";
import { updateLocation } from "@/lib/inventory/locations";
import { recordAudit } from "@/lib/inventory/audit";

const bilingualSchema = z.object({ en: z.string(), th: z.string() });

const updateLocationSchema = z.object({
  slug: z.string().optional(),
  name: bilingualSchema.optional(),
  description: bilingualSchema.optional(),
  sortOrder: z.number().optional(),
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

  const parsed = updateLocationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const result = await updateLocation(id, parsed.data);
  if (!result.ok) {
    const status =
      result.reason === "not-configured" ? 200 : result.reason === "not-found" ? 404 : result.reason === "duplicate" ? 409 : 400;
    return NextResponse.json({ ok: false, reason: result.reason }, { status });
  }

  await recordAudit({
    officerId: auth.officer.id,
    action: "location.update",
    entityType: "location",
    entityId: result.location.id,
    detail: parsed.data,
  });

  return NextResponse.json({ ok: true, location: result.location }, { status: 200 });
}
