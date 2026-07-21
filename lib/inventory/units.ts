/**
 * Data-access layer for individually-tracked units (physical assets) and
 * their availability, matching the conventions in lib/equipment-loan.ts and
 * lib/inventory/categories.ts.
 *
 * Guarded against a missing `POSTGRES_URL`: reads return empty/neutral
 * values and writes return an explicit `{ ok: false, reason: "not-configured" }`
 * rather than throwing, so the site stays buildable and renderable with zero
 * environment configuration.
 */
import { sql, isInventoryConfigured } from "@/lib/inventory/db";
import type { Unit, UnitCondition, UnitState } from "@/lib/inventory/types";

type UnitRow = {
  id: string;
  item_id: string;
  label: string;
  condition: UnitCondition;
  state: UnitState;
  location_id: string | null;
  photo_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

function mapRow(row: UnitRow): Unit {
  return {
    id: row.id,
    itemId: row.item_id,
    label: row.label,
    condition: row.condition,
    state: row.state,
    locationId: row.location_id,
    photoUrl: row.photo_url,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function isUniqueViolation(err: unknown): boolean {
  return !!err && typeof err === "object" && (err as { code?: string }).code === "23505";
}

/**
 * Inclusive overlap check for two ISO (YYYY-MM-DD) date ranges. Pure, no DB
 * access; exported for unit tests. String comparison is valid here because
 * lexical order matches chronological order for YYYY-MM-DD strings.
 */
export function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart <= bEnd && aEnd >= bStart;
}

/** Lists units, optionally filtered by item, state, and/or location. Ordered by label. */
export async function listUnits(opts?: {
  itemId?: string;
  state?: UnitState;
  locationId?: string;
}): Promise<Unit[]> {
  if (!isInventoryConfigured()) {
    return [];
  }

  try {
    const itemId = opts?.itemId ?? null;
    const state = opts?.state ?? null;
    const locationId = opts?.locationId ?? null;
    const result = await sql<UnitRow>`
      select * from units
      where (${itemId}::uuid is null or item_id = ${itemId}::uuid)
        and (${state}::text is null or state = ${state}::text)
        and (${locationId}::uuid is null or location_id = ${locationId}::uuid)
      order by label
    `;
    return result.rows.map(mapRow);
  } catch {
    return [];
  }
}

export async function getUnit(id: string): Promise<Unit | null> {
  if (!isInventoryConfigured()) {
    return null;
  }

  try {
    const result = await sql<UnitRow>`
      select * from units where id = ${id} limit 1
    `;
    const row = result.rows[0];
    return row ? mapRow(row) : null;
  } catch {
    return null;
  }
}

export async function createUnit(input: {
  itemId: string;
  label: string;
  condition?: UnitCondition;
  state?: UnitState;
  locationId?: string | null;
  notes?: string | null;
  photoUrl?: string | null;
}): Promise<
  { ok: true; unit: Unit } | { ok: false; reason: "not-configured" | "duplicate" | "error" }
> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const result = await sql<UnitRow>`
      insert into units (item_id, label, condition, state, location_id, notes, photo_url)
      values (
        ${input.itemId},
        ${input.label},
        ${input.condition ?? "good"},
        ${input.state ?? "available"},
        ${input.locationId ?? null},
        ${input.notes ?? null},
        ${input.photoUrl ?? null}
      )
      returning *
    `;
    const row = result.rows[0];
    if (!row) {
      return { ok: false, reason: "error" };
    }
    return { ok: true, unit: mapRow(row) };
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { ok: false, reason: "duplicate" };
    }
    return { ok: false, reason: "error" };
  }
}

const UPDATE_COLUMNS: Record<string, string> = {
  label: "label",
  condition: "condition",
  state: "state",
  locationId: "location_id",
  notes: "notes",
  photoUrl: "photo_url",
};

export async function updateUnit(
  id: string,
  patch: Partial<{
    label: string;
    condition: UnitCondition;
    state: UnitState;
    locationId: string | null;
    notes: string | null;
    photoUrl: string | null;
  }>
): Promise<
  { ok: true; unit: Unit } | { ok: false; reason: "not-configured" | "not-found" | "error" }
> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const setClauses: string[] = [];
    const params: unknown[] = [];
    const patchRecord = patch as Record<string, unknown>;
    for (const [key, column] of Object.entries(UPDATE_COLUMNS)) {
      if (key in patch) {
        params.push(patchRecord[key]);
        setClauses.push(`${column} = $${params.length}`);
      }
    }

    if (setClauses.length === 0) {
      const existing = await getUnit(id);
      return existing ? { ok: true, unit: existing } : { ok: false, reason: "not-found" };
    }

    setClauses.push("updated_at = now()");
    params.push(id);
    const query = `
      update units
      set ${setClauses.join(", ")}
      where id = $${params.length}
      returning *
    `;
    const result = await sql.query<UnitRow>(query, params);
    const row = result.rows[0];
    if (!row) {
      return { ok: false, reason: "not-found" };
    }
    return { ok: true, unit: mapRow(row) };
  } catch {
    return { ok: false, reason: "error" };
  }
}

/**
 * Units of `itemId` that are neither in maintenance nor retired, and have no
 * overlapping active loan for the given inclusive date range.
 */
export async function getAvailableUnitsForRange(
  itemId: string,
  startDate: string,
  endDate: string
): Promise<Unit[]> {
  if (!isInventoryConfigured()) {
    return [];
  }

  try {
    const result = await sql<UnitRow>`
      select * from units
      where item_id = ${itemId}
        and state not in ('maintenance', 'retired')
        and not exists (
          select 1 from loans l
          where l.unit_id = units.id
            and l.status in ('pending', 'approved', 'checked_out', 'overdue')
            and l.start_date <= ${endDate}
            and l.end_date >= ${startDate}
        )
      order by label
    `;
    return result.rows.map(mapRow);
  } catch {
    return [];
  }
}
