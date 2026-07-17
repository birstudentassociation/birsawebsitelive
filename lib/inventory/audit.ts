/**
 * Audit log data-access for the inventory management suite.
 *
 * Guarded against a missing `POSTGRES_URL`, matching the convention in
 * lib/equipment-loan.ts: reads return neutral empty values and writes are
 * swallowed rather than throwing, since an audit failure must never break
 * the mutation it's recording.
 */
import { sql, isInventoryConfigured } from "@/lib/inventory/db";
import type { AuditEntry } from "@/lib/inventory/types";

type AuditRow = {
  id: string;
  officer_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  detail: unknown;
  created_at: string;
};

function mapAudit(row: AuditRow): AuditEntry {
  return {
    id: row.id,
    officerId: row.officer_id,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    detail: row.detail,
    createdAt: row.created_at,
  };
}

/** Records an audit entry. Never throws; failures are swallowed so audit logging can't break a mutation. */
export async function recordAudit(input: {
  officerId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  detail?: unknown;
}): Promise<void> {
  if (!isInventoryConfigured()) {
    return;
  }

  try {
    const detailJson = JSON.stringify(input.detail ?? null);
    await sql`
      insert into audit_log (officer_id, action, entity_type, entity_id, detail)
      values (${input.officerId}, ${input.action}, ${input.entityType}, ${input.entityId}, ${detailJson}::jsonb)
    `;
  } catch {
    // Swallow: audit failures must never break the caller's mutation.
  }
}

/** Lists audit entries, newest first. Returns [] when unconfigured or on error. */
export async function listAudit(opts?: { limit?: number }): Promise<AuditEntry[]> {
  if (!isInventoryConfigured()) {
    return [];
  }

  const limit = opts?.limit ?? 100;

  try {
    const result = await sql<AuditRow>`
      select * from audit_log order by created_at desc limit ${limit}
    `;
    return result.rows.map(mapAudit);
  } catch {
    return [];
  }
}
