/**
 * Data-access layer for inventory items (the catalogue).
 *
 * Guarded against a missing `POSTGRES_URL` the same way as
 * lib/equipment-loan.ts: reads return empty/neutral values and writes return
 * an explicit `{ ok: false, reason: "not-configured" }` rather than
 * throwing, so the site stays buildable and renderable with zero
 * environment configuration.
 */
import { sql, isInventoryConfigured } from "@/lib/inventory/db";
import type { Bilingual, Item, TrackingMode } from "@/lib/inventory/types";

type ItemRow = {
  id: string;
  key: string;
  category_id: string | null;
  name_en: string;
  name_th: string;
  description_en: string;
  description_th: string;
  tracking_mode: TrackingMode;
  default_location_id: string | null;
  max_loan_days: number;
  photo_url: string | null;
  qty_on_hand: number | null;
  reorder_threshold: number | null;
  is_retired: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

function mapRow(row: ItemRow): Item {
  return {
    id: row.id,
    key: row.key,
    categoryId: row.category_id,
    name: { en: row.name_en, th: row.name_th },
    description: { en: row.description_en, th: row.description_th },
    trackingMode: row.tracking_mode,
    defaultLocationId: row.default_location_id,
    maxLoanDays: row.max_loan_days,
    photoUrl: row.photo_url,
    qtyOnHand: row.qty_on_hand,
    reorderThreshold: row.reorder_threshold,
    isRetired: row.is_retired,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function isUniqueViolation(err: unknown): boolean {
  return !!err && typeof err === "object" && (err as { code?: string }).code === "23505";
}

export async function listItems(opts?: {
  includeRetired?: boolean;
  categoryId?: string;
  search?: string;
}): Promise<Item[]> {
  if (!isInventoryConfigured()) {
    return [];
  }

  try {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (!opts?.includeRetired) {
      conditions.push("is_retired = false");
    }
    if (opts?.categoryId) {
      params.push(opts.categoryId);
      conditions.push(`category_id = $${params.length}`);
    }
    if (opts?.search) {
      params.push(`%${opts.search}%`);
      const idx = params.length;
      conditions.push(`(name_en ilike $${idx} or name_th ilike $${idx} or key ilike $${idx})`);
    }

    const where = conditions.length > 0 ? `where ${conditions.join(" and ")}` : "";
    const text = `select * from items ${where} order by name_en`;
    const result = await sql.query<ItemRow>(text, params);
    return result.rows.map(mapRow);
  } catch {
    return [];
  }
}

export async function getItem(id: string): Promise<Item | null> {
  if (!isInventoryConfigured()) {
    return null;
  }

  try {
    const result = await sql<ItemRow>`
      select * from items where id = ${id} limit 1
    `;
    const row = result.rows[0];
    return row ? mapRow(row) : null;
  } catch {
    return null;
  }
}

export async function getItemByKey(key: string): Promise<Item | null> {
  if (!isInventoryConfigured()) {
    return null;
  }

  try {
    const result = await sql<ItemRow>`
      select * from items where key = ${key} limit 1
    `;
    const row = result.rows[0];
    return row ? mapRow(row) : null;
  } catch {
    return null;
  }
}

export async function createItem(input: {
  key: string;
  categoryId?: string | null;
  name: Bilingual;
  description?: Bilingual;
  trackingMode: TrackingMode;
  defaultLocationId?: string | null;
  maxLoanDays: number;
  qtyOnHand?: number | null;
  reorderThreshold?: number | null;
  photoUrl?: string | null;
  createdBy?: string | null;
}): Promise<{ ok: true; item: Item } | { ok: false; reason: "not-configured" | "duplicate" | "invalid" | "error" }> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  const qtyOnHand = input.qtyOnHand ?? null;
  if (input.trackingMode === "consumable" && qtyOnHand === null) {
    return { ok: false, reason: "invalid" };
  }
  if (input.trackingMode === "asset" && qtyOnHand !== null) {
    return { ok: false, reason: "invalid" };
  }

  try {
    const result = await sql<ItemRow>`
      insert into items (
        key, category_id, name_en, name_th, description_en, description_th,
        tracking_mode, default_location_id, max_loan_days, photo_url,
        qty_on_hand, reorder_threshold, created_by
      )
      values (
        ${input.key},
        ${input.categoryId ?? null},
        ${input.name.en},
        ${input.name.th},
        ${input.description?.en ?? ""},
        ${input.description?.th ?? ""},
        ${input.trackingMode},
        ${input.defaultLocationId ?? null},
        ${input.maxLoanDays},
        ${input.photoUrl ?? null},
        ${qtyOnHand},
        ${input.reorderThreshold ?? null},
        ${input.createdBy ?? null}
      )
      returning *
    `;
    const row = result.rows[0];
    if (!row) {
      return { ok: false, reason: "error" };
    }
    return { ok: true, item: mapRow(row) };
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { ok: false, reason: "duplicate" };
    }
    return { ok: false, reason: "error" };
  }
}

export async function updateItem(
  id: string,
  patch: Partial<{
    categoryId: string | null;
    name: Bilingual;
    description: Bilingual;
    defaultLocationId: string | null;
    maxLoanDays: number;
    qtyOnHand: number | null;
    reorderThreshold: number | null;
    photoUrl: string | null;
    isRetired: boolean;
  }>
): Promise<{ ok: true; item: Item } | { ok: false; reason: "not-configured" | "not-found" | "error" }> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const existing = await getItem(id);
    if (!existing) {
      return { ok: false, reason: "not-found" };
    }

    const setClauses: string[] = [];
    const params: unknown[] = [];

    const push = (column: string, value: unknown) => {
      params.push(value);
      setClauses.push(`${column} = $${params.length}`);
    };

    if ("categoryId" in patch) push("category_id", patch.categoryId ?? null);
    if (patch.name) {
      push("name_en", patch.name.en);
      push("name_th", patch.name.th);
    }
    if (patch.description) {
      push("description_en", patch.description.en);
      push("description_th", patch.description.th);
    }
    if ("defaultLocationId" in patch) push("default_location_id", patch.defaultLocationId ?? null);
    if (patch.maxLoanDays !== undefined) push("max_loan_days", patch.maxLoanDays);
    if ("qtyOnHand" in patch) push("qty_on_hand", patch.qtyOnHand ?? null);
    if ("reorderThreshold" in patch) push("reorder_threshold", patch.reorderThreshold ?? null);
    if ("photoUrl" in patch) push("photo_url", patch.photoUrl ?? null);
    if (patch.isRetired !== undefined) push("is_retired", patch.isRetired);

    push("updated_at", new Date().toISOString());

    params.push(id);
    const text = `update items set ${setClauses.join(", ")} where id = $${params.length} returning *`;

    const result = await sql.query<ItemRow>(text, params);
    const row = result.rows[0];
    if (!row) {
      return { ok: false, reason: "not-found" };
    }
    return { ok: true, item: mapRow(row) };
  } catch {
    return { ok: false, reason: "error" };
  }
}

export async function getItemAvailabilitySummary(
  item: Item
): Promise<{ total: number; available: number; kind: TrackingMode }> {
  const kind = item.trackingMode;

  if (!isInventoryConfigured()) {
    const qty = kind === "consumable" ? item.qtyOnHand ?? 0 : 0;
    return { total: qty, available: qty, kind };
  }

  if (kind === "consumable") {
    const qty = item.qtyOnHand ?? 0;
    return { total: qty, available: qty, kind };
  }

  try {
    const result = await sql<{ state: string; count: string }>`
      select state, count(*)::text as count
      from units
      where item_id = ${item.id} and state != 'retired'
      group by state
    `;
    let total = 0;
    let available = 0;
    for (const row of result.rows) {
      const count = Number(row.count);
      total += count;
      if (row.state === "available") {
        available += count;
      }
    }
    return { total, available, kind };
  } catch {
    return { total: 0, available: 0, kind };
  }
}
