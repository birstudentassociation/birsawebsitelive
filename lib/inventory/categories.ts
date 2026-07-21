/**
 * Data-access layer for inventory categories.
 *
 * Guarded against a missing `POSTGRES_URL` the same way as
 * lib/equipment-loan.ts: reads return empty/neutral values and writes return
 * an explicit `{ ok: false, reason: "not-configured" }` rather than
 * throwing, so the site stays buildable and renderable with zero
 * environment configuration.
 */
import { sql, isInventoryConfigured } from "@/lib/inventory/db";
import type { Bilingual, Category } from "@/lib/inventory/types";

type CategoryRow = {
  id: string;
  slug: string;
  name_en: string;
  name_th: string;
  sort_order: number;
  created_at: string;
};

function mapRow(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: { en: row.name_en, th: row.name_th },
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

function isUniqueViolation(err: unknown): boolean {
  return !!err && typeof err === "object" && (err as { code?: string }).code === "23505";
}

export async function listCategories(): Promise<Category[]> {
  if (!isInventoryConfigured()) {
    return [];
  }

  try {
    const result = await sql<CategoryRow>`
      select * from categories
      order by sort_order, name_en
    `;
    return result.rows.map(mapRow);
  } catch {
    return [];
  }
}

export async function getCategory(id: string): Promise<Category | null> {
  if (!isInventoryConfigured()) {
    return null;
  }

  try {
    const result = await sql<CategoryRow>`
      select * from categories where id = ${id} limit 1
    `;
    const row = result.rows[0];
    return row ? mapRow(row) : null;
  } catch {
    return null;
  }
}

export async function createCategory(input: {
  slug: string;
  name: Bilingual;
  sortOrder?: number;
}): Promise<
  { ok: true; category: Category } | { ok: false; reason: "not-configured" | "duplicate" | "error" }
> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const result = await sql<CategoryRow>`
      insert into categories (slug, name_en, name_th, sort_order)
      values (${input.slug}, ${input.name.en}, ${input.name.th}, ${input.sortOrder ?? 0})
      returning *
    `;
    const row = result.rows[0];
    if (!row) {
      return { ok: false, reason: "error" };
    }
    return { ok: true, category: mapRow(row) };
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { ok: false, reason: "duplicate" };
    }
    return { ok: false, reason: "error" };
  }
}

export async function updateCategory(
  id: string,
  patch: { slug?: string; name?: Bilingual; sortOrder?: number }
): Promise<
  | { ok: true; category: Category }
  | { ok: false; reason: "not-configured" | "not-found" | "duplicate" | "error" }
> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const existing = await getCategory(id);
    if (!existing) {
      return { ok: false, reason: "not-found" };
    }

    const slug = patch.slug ?? existing.slug;
    const nameEn = patch.name?.en ?? existing.name.en;
    const nameTh = patch.name?.th ?? existing.name.th;
    const sortOrder = patch.sortOrder ?? existing.sortOrder;

    const result = await sql<CategoryRow>`
      update categories
      set slug = ${slug}, name_en = ${nameEn}, name_th = ${nameTh}, sort_order = ${sortOrder}
      where id = ${id}
      returning *
    `;
    const row = result.rows[0];
    if (!row) {
      return { ok: false, reason: "not-found" };
    }
    return { ok: true, category: mapRow(row) };
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { ok: false, reason: "duplicate" };
    }
    return { ok: false, reason: "error" };
  }
}
