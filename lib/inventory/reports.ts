/**
 * Officer reporting data-access for the inventory management suite: status
 * counts, per-item utilisation, and CSV export builders.
 *
 * Guarded against a missing `POSTGRES_URL`, matching the convention in
 * lib/equipment-loan.ts: reads return empty/neutral values rather than
 * throwing, so the site stays buildable and renderable with zero environment
 * configuration. CSV builders return a header-only string when unconfigured
 * so export downloads always produce a valid (if empty) file.
 */
import { sql, isInventoryConfigured } from "@/lib/inventory/db";
import type { LoanStatus } from "@/lib/inventory/types";

/** Wraps a CSV field in double quotes (doubling internal quotes) when it contains a comma, quote, or newline. */
function csvField(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function csvRow(fields: unknown[]): string {
  return fields.map(csvField).join(",");
}

/** Builds a CSV string (header + rows) with CRLF line endings, including a trailing CRLF. */
function buildCsv(header: string[], rows: unknown[][]): string {
  const lines = [csvRow(header), ...rows.map((row) => csvRow(row))];
  return lines.join("\r\n") + "\r\n";
}

export async function getStatusCounts(): Promise<{ status: LoanStatus; count: number }[]> {
  if (!isInventoryConfigured()) {
    return [];
  }

  try {
    const result = await sql<{ status: LoanStatus; count: string }>`
      select status, count(*)::text as count
      from loans
      group by status
    `;
    return result.rows.map((row) => ({ status: row.status, count: Number(row.count) }));
  } catch {
    return [];
  }
}

export type ItemUtilisation = {
  itemId: string;
  itemKey: string;
  nameEn: string;
  nameTh: string;
  totalLoans: number;
  activeLoans: number;
  unitCount: number;
};

/** Per-item loan totals, currently-active loans, and unit counts, ordered by total loans (most-borrowed first). */
export async function getItemUtilisation(): Promise<ItemUtilisation[]> {
  if (!isInventoryConfigured()) {
    return [];
  }

  try {
    const result = await sql<{
      item_id: string;
      item_key: string;
      name_en: string;
      name_th: string;
      total_loans: string;
      active_loans: string;
      unit_count: string;
    }>`
      select
        i.id as item_id,
        i.key as item_key,
        i.name_en,
        i.name_th,
        count(l.id)::text as total_loans,
        count(*) filter (where l.status in ('pending', 'approved', 'checked_out', 'overdue'))::text as active_loans,
        (select count(*) from units u where u.item_id = i.id and u.state <> 'retired')::text as unit_count
      from items i
      left join loans l on l.item_id = i.id
      group by i.id, i.key, i.name_en, i.name_th
      order by count(l.id) desc
    `;
    return result.rows.map((row) => ({
      itemId: row.item_id,
      itemKey: row.item_key,
      nameEn: row.name_en,
      nameTh: row.name_th,
      totalLoans: Number(row.total_loans),
      activeLoans: Number(row.active_loans),
      unitCount: Number(row.unit_count),
    }));
  } catch {
    return [];
  }
}

const LOANS_CSV_HEADER = [
  "reference",
  "item",
  "borrowerStudentId",
  "borrowerName",
  "email",
  "startDate",
  "endDate",
  "status",
  "createdAt",
];

export async function loansCsv(): Promise<string> {
  if (!isInventoryConfigured()) {
    return buildCsv(LOANS_CSV_HEADER, []);
  }

  try {
    const result = await sql<{
      reference: string;
      item_name: string;
      tu_student_id: string;
      name: string;
      email: string;
      start_date: string;
      end_date: string;
      status: string;
      created_at: string;
    }>`
      select
        l.reference,
        i.name_en as item_name,
        b.tu_student_id,
        b.name,
        b.email,
        l.start_date,
        l.end_date,
        l.status,
        l.created_at
      from loans l
      join items i on i.id = l.item_id
      join borrowers b on b.id = l.borrower_id
      order by l.created_at desc
    `;
    const rows = result.rows.map((row) => [
      row.reference,
      row.item_name,
      row.tu_student_id,
      row.name,
      row.email,
      row.start_date,
      row.end_date,
      row.status,
      row.created_at,
    ]);
    return buildCsv(LOANS_CSV_HEADER, rows);
  } catch {
    return buildCsv(LOANS_CSV_HEADER, []);
  }
}

const UNITS_CSV_HEADER = ["itemKey", "label", "condition", "state", "location"];

export async function unitsCsv(): Promise<string> {
  if (!isInventoryConfigured()) {
    return buildCsv(UNITS_CSV_HEADER, []);
  }

  try {
    const result = await sql<{
      item_key: string;
      label: string;
      condition: string;
      state: string;
      location_name: string | null;
    }>`
      select
        i.key as item_key,
        u.label,
        u.condition,
        u.state,
        loc.name_en as location_name
      from units u
      join items i on i.id = u.item_id
      left join locations loc on loc.id = u.location_id
      order by i.key, u.label
    `;
    const rows = result.rows.map((row) => [
      row.item_key,
      row.label,
      row.condition,
      row.state,
      row.location_name ?? "",
    ]);
    return buildCsv(UNITS_CSV_HEADER, rows);
  } catch {
    return buildCsv(UNITS_CSV_HEADER, []);
  }
}

const BORROWERS_CSV_HEADER = ["studentId", "name", "email", "phone", "blocklisted", "activeLoans"];

export async function borrowersCsv(): Promise<string> {
  if (!isInventoryConfigured()) {
    return buildCsv(BORROWERS_CSV_HEADER, []);
  }

  try {
    const result = await sql<{
      tu_student_id: string;
      name: string;
      email: string;
      phone: string | null;
      blocklisted: boolean;
      active_loans: string;
    }>`
      select
        b.tu_student_id,
        b.name,
        b.email,
        b.phone,
        b.blocklisted,
        (
          select count(*) from loans l
          where l.borrower_id = b.id
            and l.status in ('pending', 'approved', 'checked_out', 'overdue')
        )::text as active_loans
      from borrowers b
      order by b.name
    `;
    const rows = result.rows.map((row) => [
      row.tu_student_id,
      row.name,
      row.email,
      row.phone ?? "",
      row.blocklisted ? "true" : "false",
      row.active_loans,
    ]);
    return buildCsv(BORROWERS_CSV_HEADER, rows);
  } catch {
    return buildCsv(BORROWERS_CSV_HEADER, []);
  }
}
