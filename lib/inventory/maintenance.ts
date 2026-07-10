/**
 * Data-access layer for unit maintenance records, matching the conventions
 * in lib/equipment-loan.ts and lib/inventory/categories.ts.
 *
 * Guarded against a missing `POSTGRES_URL`: reads return empty/neutral
 * values and writes return an explicit `{ ok: false, reason: "not-configured" }`
 * rather than throwing, so the site stays buildable and renderable with zero
 * environment configuration.
 */
import { sql, isInventoryConfigured } from "@/lib/inventory/db";
import type { MaintenanceEntry, UnitCondition } from "@/lib/inventory/types";

type MaintenanceRow = {
  id: string;
  unit_id: string;
  opened_at: string;
  closed_at: string | null;
  issue: string;
  action_taken: string | null;
  condition_before: UnitCondition | null;
  condition_after: UnitCondition | null;
  officer_id: string | null;
  created_at: string;
};

function mapRow(row: MaintenanceRow): MaintenanceEntry {
  return {
    id: row.id,
    unitId: row.unit_id,
    openedAt: row.opened_at,
    closedAt: row.closed_at,
    issue: row.issue,
    actionTaken: row.action_taken,
    conditionBefore: row.condition_before,
    conditionAfter: row.condition_after,
    officerId: row.officer_id,
    createdAt: row.created_at,
  };
}

/**
 * Opens a maintenance record for a unit and moves the unit into the
 * `maintenance` state. Two sequential writes, best-effort consistent (no
 * transaction API available in this MVP).
 */
export async function openMaintenance(input: {
  unitId: string;
  issue: string;
  conditionBefore?: UnitCondition | null;
  officerId?: string | null;
}): Promise<{ ok: true; entry: MaintenanceEntry } | { ok: false; reason: "not-configured" | "not-found" | "error" }> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const unitCheck = await sql`select id from units where id = ${input.unitId} limit 1`;
    if (unitCheck.rows.length === 0) {
      return { ok: false, reason: "not-found" };
    }

    const result = await sql<MaintenanceRow>`
      insert into maintenance_log (unit_id, issue, condition_before, officer_id)
      values (${input.unitId}, ${input.issue}, ${input.conditionBefore ?? null}, ${input.officerId ?? null})
      returning *
    `;
    const row = result.rows[0];
    if (!row) {
      return { ok: false, reason: "error" };
    }

    await sql`
      update units set state = 'maintenance', updated_at = now() where id = ${input.unitId}
    `;

    return { ok: true, entry: mapRow(row) };
  } catch {
    return { ok: false, reason: "error" };
  }
}

/**
 * Closes an open maintenance record and moves the unit back to `available`,
 * updating its condition when `conditionAfter` is provided.
 */
export async function closeMaintenance(
  id: string,
  input: { actionTaken?: string | null; conditionAfter?: UnitCondition | null; officerId?: string | null }
): Promise<
  | { ok: true; entry: MaintenanceEntry }
  | { ok: false; reason: "not-configured" | "not-found" | "already-closed" | "error" }
> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const existing = await sql<MaintenanceRow>`
      select * from maintenance_log where id = ${id} limit 1
    `;
    const existingRow = existing.rows[0];
    if (!existingRow) {
      return { ok: false, reason: "not-found" };
    }
    if (existingRow.closed_at) {
      return { ok: false, reason: "already-closed" };
    }

    const result = await sql<MaintenanceRow>`
      update maintenance_log
      set closed_at = now(),
          action_taken = ${input.actionTaken ?? null},
          condition_after = ${input.conditionAfter ?? null}
      where id = ${id} and closed_at is null
      returning *
    `;
    const row = result.rows[0];
    if (!row) {
      return { ok: false, reason: "already-closed" };
    }

    if (input.conditionAfter) {
      await sql`
        update units
        set state = 'available', condition = ${input.conditionAfter}, updated_at = now()
        where id = ${row.unit_id}
      `;
    } else {
      await sql`
        update units
        set state = 'available', updated_at = now()
        where id = ${row.unit_id}
      `;
    }

    return { ok: true, entry: mapRow(row) };
  } catch {
    return { ok: false, reason: "error" };
  }
}

/** Lists maintenance entries for a unit, newest opened_at first. */
export async function listMaintenance(unitId: string): Promise<MaintenanceEntry[]> {
  if (!isInventoryConfigured()) {
    return [];
  }

  try {
    const result = await sql<MaintenanceRow>`
      select * from maintenance_log where unit_id = ${unitId} order by opened_at desc
    `;
    return result.rows.map(mapRow);
  } catch {
    return [];
  }
}
