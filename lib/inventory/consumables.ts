/**
 * Data-access layer for consumable stock adjustments, matching the
 * conventions in lib/equipment-loan.ts and lib/inventory/categories.ts.
 *
 * Guarded against a missing `POSTGRES_URL`: reads return empty/neutral
 * values and writes return an explicit `{ ok: false, reason: "not-configured" }`
 * rather than throwing, so the site stays buildable and renderable with zero
 * environment configuration.
 *
 * `items.ts` is owned by another agent, so this module duplicates a small
 * item row mapper rather than importing from it.
 */
import { sql, isInventoryConfigured } from "@/lib/inventory/db";
import type { ConsumableAdjustment, Item, TrackingMode } from "@/lib/inventory/types";

type ItemRow = {
  id: string;
  key: string;
  category_id: string | null;
  custodian_id: string;
  name_en: string;
  name_th: string;
  description_en: string;
  description_th: string;
  tracking_mode: TrackingMode;
  default_location_id: string | null;
  max_loan_days: number;
  online_loanable: boolean;
  photo_url: string | null;
  qty_on_hand: number | null;
  reorder_threshold: number | null;
  is_retired: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

function mapItem(row: ItemRow): Item {
  return {
    id: row.id,
    key: row.key,
    categoryId: row.category_id,
    custodianId: row.custodian_id,
    name: { en: row.name_en, th: row.name_th },
    description: { en: row.description_en, th: row.description_th },
    trackingMode: row.tracking_mode,
    defaultLocationId: row.default_location_id,
    maxLoanDays: row.max_loan_days,
    onlineLoanable: row.online_loanable,
    photoUrl: row.photo_url,
    qtyOnHand: row.qty_on_hand,
    reorderThreshold: row.reorder_threshold,
    isRetired: row.is_retired,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

type AdjustmentRow = {
  id: string;
  item_id: string;
  delta: number;
  reason: string | null;
  borrower_id: string | null;
  officer_id: string | null;
  resulting_qty: number;
  created_at: string;
};

function mapAdjustment(row: AdjustmentRow): ConsumableAdjustment {
  return {
    id: row.id,
    itemId: row.item_id,
    delta: row.delta,
    reason: row.reason,
    borrowerId: row.borrower_id,
    officerId: row.officer_id,
    resultingQty: row.resulting_qty,
    createdAt: row.created_at,
  };
}

/**
 * Adjusts a consumable item's stock by `delta` (positive to restock,
 * negative to draw down), records the adjustment, and returns the new
 * quantity.
 */
export async function adjustStock(input: {
  itemId: string;
  delta: number;
  reason?: string | null;
  borrowerId?: string | null;
  officerId?: string | null;
}): Promise<
  | { ok: true; resultingQty: number }
  | {
      ok: false;
      reason: "not-configured" | "not-found" | "not-consumable" | "insufficient" | "error";
    }
> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const itemResult = await sql<ItemRow>`
      select * from items where id = ${input.itemId} limit 1
    `;
    const itemRow = itemResult.rows[0];
    if (!itemRow) {
      return { ok: false, reason: "not-found" };
    }
    if (itemRow.tracking_mode !== "consumable" || itemRow.qty_on_hand === null) {
      return { ok: false, reason: "not-consumable" };
    }

    const newQty = itemRow.qty_on_hand + input.delta;
    if (newQty < 0) {
      return { ok: false, reason: "insufficient" };
    }

    const updateResult = await sql`
      update items set qty_on_hand = ${newQty}, updated_at = now()
      where id = ${input.itemId}
    `;
    if (updateResult.rowCount === 0) {
      return { ok: false, reason: "error" };
    }

    await sql`
      insert into consumable_adjustments (item_id, delta, reason, borrower_id, officer_id, resulting_qty)
      values (
        ${input.itemId},
        ${input.delta},
        ${input.reason ?? null},
        ${input.borrowerId ?? null},
        ${input.officerId ?? null},
        ${newQty}
      )
    `;

    return { ok: true, resultingQty: newQty };
  } catch {
    return { ok: false, reason: "error" };
  }
}

/** Lists stock adjustments for an item, newest first. */
export async function listAdjustments(itemId: string): Promise<ConsumableAdjustment[]> {
  if (!isInventoryConfigured()) {
    return [];
  }

  try {
    const result = await sql<AdjustmentRow>`
      select * from consumable_adjustments where item_id = ${itemId} order by created_at desc
    `;
    return result.rows.map(mapAdjustment);
  } catch {
    return [];
  }
}

/** Consumable items at or below their reorder threshold. Optionally scoped to one custodian. */
export async function getLowStockItems(custodianId?: string): Promise<Item[]> {
  if (!isInventoryConfigured()) {
    return [];
  }

  try {
    const conditions = [
      "tracking_mode = 'consumable'",
      "reorder_threshold is not null",
      "qty_on_hand <= reorder_threshold",
    ];
    const params: unknown[] = [];

    if (custodianId) {
      params.push(custodianId);
      conditions.push(`custodian_id = $${params.length}`);
    }

    const text = `select * from items where ${conditions.join(" and ")} order by name_en`;
    const result = await sql.query<ItemRow>(text, params);
    return result.rows.map(mapItem);
  } catch {
    return [];
  }
}
