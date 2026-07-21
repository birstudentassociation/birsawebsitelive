/**
 * Data-access layer for custodian organisations (BIRSA + clubs).
 *
 * Guarded against a missing `POSTGRES_URL` the same way as
 * lib/equipment-loan.ts: reads return empty/neutral values and writes return
 * an explicit `{ ok: false, reason: "not-configured" }` rather than
 * throwing, so the site stays buildable and renderable with zero
 * environment configuration.
 */
import { sql, isInventoryConfigured } from "@/lib/inventory/db";
import type { Bilingual, Custodian, CustodianKind } from "@/lib/inventory/types";

type CustodianRow = {
  id: string;
  slug: string;
  kind: CustodianKind;
  name_en: string;
  name_th: string;
  contact_name_en: string;
  contact_name_th: string;
  contact_email: string | null;
  contact_instagram: string | null;
  contact_other: string | null;
  borrow_note_en: string;
  borrow_note_th: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

function mapRow(row: CustodianRow): Custodian {
  return {
    id: row.id,
    slug: row.slug,
    kind: row.kind,
    name: { en: row.name_en, th: row.name_th },
    contactName: { en: row.contact_name_en, th: row.contact_name_th },
    contactEmail: row.contact_email,
    contactInstagram: row.contact_instagram,
    contactOther: row.contact_other,
    borrowNote: { en: row.borrow_note_en, th: row.borrow_note_th },
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

function isUniqueViolation(err: unknown): boolean {
  return !!err && typeof err === "object" && (err as { code?: string }).code === "23505";
}

export async function listCustodians(opts?: { includeInactive?: boolean }): Promise<Custodian[]> {
  if (!isInventoryConfigured()) {
    return [];
  }

  try {
    const where = opts?.includeInactive ? "" : "where is_active = true";
    const result = await sql.query<CustodianRow>(
      `select * from custodians ${where} order by sort_order, name_en`,
      []
    );
    return result.rows.map(mapRow);
  } catch {
    return [];
  }
}

export async function getCustodian(id: string): Promise<Custodian | null> {
  if (!isInventoryConfigured()) {
    return null;
  }

  try {
    const result = await sql<CustodianRow>`
      select * from custodians where id = ${id} limit 1
    `;
    const row = result.rows[0];
    return row ? mapRow(row) : null;
  } catch {
    return null;
  }
}

export async function getCustodianBySlug(slug: string): Promise<Custodian | null> {
  if (!isInventoryConfigured()) {
    return null;
  }

  try {
    const result = await sql<CustodianRow>`
      select * from custodians where slug = ${slug} limit 1
    `;
    const row = result.rows[0];
    return row ? mapRow(row) : null;
  } catch {
    return null;
  }
}

export async function createCustodian(input: {
  slug: string;
  kind: CustodianKind;
  name: Bilingual;
  contactName?: Bilingual;
  contactEmail?: string | null;
  contactInstagram?: string | null;
  contactOther?: string | null;
  borrowNote?: Bilingual;
  sortOrder?: number;
}): Promise<
  | { ok: true; custodian: Custodian }
  | { ok: false; reason: "not-configured" | "duplicate" | "error" }
> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const result = await sql<CustodianRow>`
      insert into custodians (
        slug, kind, name_en, name_th, contact_name_en, contact_name_th,
        contact_email, contact_instagram, contact_other, borrow_note_en, borrow_note_th, sort_order
      )
      values (
        ${input.slug},
        ${input.kind},
        ${input.name.en},
        ${input.name.th},
        ${input.contactName?.en ?? ""},
        ${input.contactName?.th ?? ""},
        ${input.contactEmail ?? null},
        ${input.contactInstagram ?? null},
        ${input.contactOther ?? null},
        ${input.borrowNote?.en ?? ""},
        ${input.borrowNote?.th ?? ""},
        ${input.sortOrder ?? 0}
      )
      returning *
    `;
    const row = result.rows[0];
    if (!row) {
      return { ok: false, reason: "error" };
    }
    return { ok: true, custodian: mapRow(row) };
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { ok: false, reason: "duplicate" };
    }
    return { ok: false, reason: "error" };
  }
}

export async function updateCustodian(
  id: string,
  patch: Partial<{
    name: Bilingual;
    contactName: Bilingual;
    contactEmail: string | null;
    contactInstagram: string | null;
    contactOther: string | null;
    borrowNote: Bilingual;
    isActive: boolean;
    sortOrder: number;
  }>
): Promise<
  | { ok: true; custodian: Custodian }
  | { ok: false; reason: "not-configured" | "not-found" | "error" }
> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const existing = await getCustodian(id);
    if (!existing) {
      return { ok: false, reason: "not-found" };
    }

    const setClauses: string[] = [];
    const params: unknown[] = [];

    const push = (column: string, value: unknown) => {
      params.push(value);
      setClauses.push(`${column} = $${params.length}`);
    };

    if (patch.name) {
      push("name_en", patch.name.en);
      push("name_th", patch.name.th);
    }
    if (patch.contactName) {
      push("contact_name_en", patch.contactName.en);
      push("contact_name_th", patch.contactName.th);
    }
    if ("contactEmail" in patch) push("contact_email", patch.contactEmail ?? null);
    if ("contactInstagram" in patch) push("contact_instagram", patch.contactInstagram ?? null);
    if ("contactOther" in patch) push("contact_other", patch.contactOther ?? null);
    if (patch.borrowNote) {
      push("borrow_note_en", patch.borrowNote.en);
      push("borrow_note_th", patch.borrowNote.th);
    }
    if (patch.isActive !== undefined) push("is_active", patch.isActive);
    if (patch.sortOrder !== undefined) push("sort_order", patch.sortOrder);

    if (setClauses.length === 0) {
      return { ok: true, custodian: existing };
    }

    params.push(id);
    const text = `update custodians set ${setClauses.join(", ")} where id = $${params.length} returning *`;

    const result = await sql.query<CustodianRow>(text, params);
    const row = result.rows[0];
    if (!row) {
      return { ok: false, reason: "not-found" };
    }
    return { ok: true, custodian: mapRow(row) };
  } catch {
    return { ok: false, reason: "error" };
  }
}
