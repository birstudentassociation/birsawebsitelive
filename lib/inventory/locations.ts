/**
 * Data-access layer for inventory locations.
 *
 * Guarded against a missing `POSTGRES_URL` the same way as
 * lib/equipment-loan.ts: reads return empty/neutral values and writes return
 * an explicit `{ ok: false, reason: "not-configured" }` rather than
 * throwing, so the site stays buildable and renderable with zero
 * environment configuration.
 */
import { sql, isInventoryConfigured } from "@/lib/inventory/db";
import type { Bilingual, Location } from "@/lib/inventory/types";

type LocationRow = {
  id: string;
  slug: string;
  name_en: string;
  name_th: string;
  description_en: string;
  description_th: string;
  sort_order: number;
  created_at: string;
};

function mapRow(row: LocationRow): Location {
  return {
    id: row.id,
    slug: row.slug,
    name: { en: row.name_en, th: row.name_th },
    description: { en: row.description_en, th: row.description_th },
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

function isUniqueViolation(err: unknown): boolean {
  return !!err && typeof err === "object" && (err as { code?: string }).code === "23505";
}

export async function listLocations(): Promise<Location[]> {
  if (!isInventoryConfigured()) {
    return [];
  }

  try {
    const result = await sql<LocationRow>`
      select * from locations
      order by sort_order, name_en
    `;
    return result.rows.map(mapRow);
  } catch {
    return [];
  }
}

export async function getLocation(id: string): Promise<Location | null> {
  if (!isInventoryConfigured()) {
    return null;
  }

  try {
    const result = await sql<LocationRow>`
      select * from locations where id = ${id} limit 1
    `;
    const row = result.rows[0];
    return row ? mapRow(row) : null;
  } catch {
    return null;
  }
}

export async function createLocation(input: {
  slug: string;
  name: Bilingual;
  description?: Bilingual;
  sortOrder?: number;
}): Promise<
  { ok: true; location: Location } | { ok: false; reason: "not-configured" | "duplicate" | "error" }
> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const result = await sql<LocationRow>`
      insert into locations (slug, name_en, name_th, description_en, description_th, sort_order)
      values (
        ${input.slug},
        ${input.name.en},
        ${input.name.th},
        ${input.description?.en ?? ""},
        ${input.description?.th ?? ""},
        ${input.sortOrder ?? 0}
      )
      returning *
    `;
    const row = result.rows[0];
    if (!row) {
      return { ok: false, reason: "error" };
    }
    return { ok: true, location: mapRow(row) };
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { ok: false, reason: "duplicate" };
    }
    return { ok: false, reason: "error" };
  }
}

export async function updateLocation(
  id: string,
  patch: { slug?: string; name?: Bilingual; description?: Bilingual; sortOrder?: number }
): Promise<
  | { ok: true; location: Location }
  | { ok: false; reason: "not-configured" | "not-found" | "duplicate" | "error" }
> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const existing = await getLocation(id);
    if (!existing) {
      return { ok: false, reason: "not-found" };
    }

    const slug = patch.slug ?? existing.slug;
    const nameEn = patch.name?.en ?? existing.name.en;
    const nameTh = patch.name?.th ?? existing.name.th;
    const descriptionEn = patch.description?.en ?? existing.description.en;
    const descriptionTh = patch.description?.th ?? existing.description.th;
    const sortOrder = patch.sortOrder ?? existing.sortOrder;

    const result = await sql<LocationRow>`
      update locations
      set slug = ${slug},
          name_en = ${nameEn},
          name_th = ${nameTh},
          description_en = ${descriptionEn},
          description_th = ${descriptionTh},
          sort_order = ${sortOrder}
      where id = ${id}
      returning *
    `;
    const row = result.rows[0];
    if (!row) {
      return { ok: false, reason: "not-found" };
    }
    return { ok: true, location: mapRow(row) };
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { ok: false, reason: "duplicate" };
    }
    return { ok: false, reason: "error" };
  }
}
