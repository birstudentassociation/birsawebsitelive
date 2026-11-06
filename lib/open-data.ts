/**
 * Open data: types, formatting and CSV building shared by every open data
 * page. The data itself lives in `content/open-data/<edition>/<topic>.ts`,
 * one typed `Topic` per file, and the page, its chart and its CSV download
 * all read the same rows so they can never drift apart.
 *
 * Rules every data file follows (tests in `tests/unit/open-data.test.ts`
 * enforce the mechanical ones):
 * - No column may hold a person's name, nickname, phone, email, student ID or
 *   signature. People appear as roles ("Treasurer") or counts only.
 * - Numbers are language-free: a figure is identical in English and Thai.
 * - Every label is bilingual. English follows GOV.UK style; Thai is written as
 *   Thai. Neither uses colons outside clock times nor dashes of any kind.
 * - A column with `total: true` gets a totals row, and any `declaredTotal`
 *   must equal the sum of the rows.
 */
import type { Locale } from "@/lib/i18n";
import { csvField } from "@/lib/csv";

export type Bilingual = Record<Locale, string>;

/** How a cell is shown and exported. */
export type ColumnKind =
  /** Free text. Cell value is a `Bilingual` or a language-free string. */
  | "text"
  /** A plain count or quantity. */
  | "number"
  /** Thai baht. Shown as "฿2,760"; exported as a bare number. */
  | "money"
  /** A percentage held as 0 to 100. */
  | "percent"
  /** An ISO date, `YYYY-MM-DD`, or a month, `YYYY-MM`. */
  | "date";

export type Column = {
  key: string;
  label: Bilingual;
  kind: ColumnKind;
  /** Add this column up in a totals row. Only for number or money. */
  total?: boolean;
};

export type CellValue = string | number | Bilingual | null;
export type Row = Record<string, CellValue>;

export type Dataset = {
  /** File slug for the CSV, lowercase with hyphens, e.g. "planned-budget". */
  id: string;
  /** Table caption. Front-loaded, sentence case, under 60 characters. */
  title: Bilingual;
  /** One sentence, under 160 characters, starting with the key fact. */
  summary: Bilingual;
  columns: Column[];
  rows: Row[];
  /**
   * A total stated in the source (e.g. a budget sheet's grand total). Tests
   * check the rows add up to it, per column key.
   */
  declaredTotal?: Record<string, number>;
  /** Short, essential notes shown under the table as [note 1], [note 2]. */
  notes?: Bilingual[];
  /** Where the figures come from, in plain words. Never a link to a raw file. */
  source: Bilingual;
  /** The period covered, e.g. { en: "June 2025 to March 2026", th: ... }. */
  period: Bilingual;
};

export type Headline = {
  /** The figure as it should be read, e.g. "฿230,822" or "40". */
  value: string;
  label: Bilingual;
  /** Optional one-line context under the figure. */
  context?: Bilingual;
};

/**
 * One horizontal bar chart drawn from a dataset. Bars are sorted high to low
 * and start at zero. Use one only where a chart shows something the table
 * does not show at a glance.
 */
export type ChartSpec = {
  datasetId: string;
  /** Column holding the bar label. */
  labelKey: string;
  /** Column holding the bar value (number or money). */
  valueKey: string;
  /** Rows to sum by label first, when one label spans several rows. */
  groupBy?: boolean;
  /** States the finding, under 15 words, sentence case. */
  title: Bilingual;
  /** Measure and period, e.g. "Planned spending in baht, 2025 to 2026". */
  subtitle: Bilingual;
  /** One sentence, 100 to 200 characters: "A bar chart showing that ...". */
  alt: Bilingual;
};

export type Topic = {
  /** URL segment, e.g. "money". */
  slug: string;
  /** The question the page answers, used as the h1. */
  title: Bilingual;
  /** One-line lede under the h1, and the summary on the landing page card. */
  summary: Bilingual;
  /** 3 to 6 main points, each under 25 words, one figure each. */
  mainPoints: Bilingual[];
  /** Up to 4 headline figures shown above the main points. */
  headlines?: Headline[];
  /** One caveat that every reader must see, shown as warning text. */
  warning?: Bilingual;
  chart?: ChartSpec;
  datasets: Dataset[];
};

export type Edition = {
  /** URL segment, e.g. "2025-26". */
  slug: string;
  /** e.g. { en: "2025 to 2026", th: "ปีการศึกษา 2568" }. */
  label: Bilingual;
  /** The day the edition was published; it never changes after that. */
  published: string;
  topics: Topic[];
};

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

export function isBilingual(value: CellValue | undefined): value is Bilingual {
  return typeof value === "object" && value !== null && "en" in value && "th" in value;
}

const numberFormat = new Intl.NumberFormat("en-GB");

/** Decimal places a money column needs: 2 if any value has satang, else 0. */
export function moneyDecimals(values: number[]): number {
  return values.some((v) => Math.round(v * 100) % 100 !== 0) ? 2 : 0;
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatMoney(value: number, decimals = 0): string {
  // U+2212 minus sign: a number's sign, not a dash.
  const sign = value < 0 ? "−" : "";
  return `${sign}฿${formatNumber(Math.abs(value), decimals)}`;
}

const MONTHS: Record<Locale, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
  th: [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ],
};

/**
 * Table dates, after ONS: months abbreviated except June and July, no
 * commas. Thai uses Buddhist Era years.
 */
export function formatTableDate(locale: Locale, iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const month = MONTHS[locale][(m ?? 1) - 1];
  // Thai readers date by the Buddhist Era, as the Thai prose on these pages does.
  const year = locale === "th" ? (y ?? 0) + 543 : y;
  return d ? `${d} ${month} ${year}` : `${month} ${year}`;
}

export function cellText(
  locale: Locale,
  column: Column,
  value: CellValue | undefined,
  decimals = 0
): string {
  if (value === null || value === undefined || value === "") return "";
  if (isBilingual(value)) return value[locale];
  switch (column.kind) {
    case "money":
      return formatMoney(Number(value), decimals);
    case "number":
      return numberFormat.format(Number(value));
    case "percent":
      return `${formatNumber(Number(value))}%`;
    case "date":
      return formatTableDate(locale, String(value));
    default:
      return String(value);
  }
}

export function columnTotal(dataset: Dataset, key: string): number {
  return dataset.rows.reduce((sum, row) => sum + (typeof row[key] === "number" ? row[key] : 0), 0);
}

// ---------------------------------------------------------------------------
// CSV
// ---------------------------------------------------------------------------

/**
 * CSV after the ONS spreadsheet rules: one header row, no merged or blank
 * header cells, money as bare numbers, dates as ISO, text in the reader's
 * language. Notes go in trailing rows prefixed "[note n]" so the table stays
 * rectangular above them.
 */
export function buildCsv(dataset: Dataset, locale: Locale): string {
  const lines: string[] = [];
  lines.push(dataset.columns.map((c) => csvField(c.label[locale])).join(","));
  for (const row of dataset.rows) {
    lines.push(
      dataset.columns
        .map((c) => {
          const value = row[c.key];
          if (value === null || value === undefined) return "";
          if (isBilingual(value)) return csvField(value[locale]);
          return csvField(value);
        })
        .join(",")
    );
  }
  return `﻿${lines.join("\r\n")}\r\n`;
}

export function csvPath(edition: string, topic: string, dataset: string): string {
  return `/open-data/${edition}/${topic}/${dataset}.csv`;
}

export function csvFilename(edition: string, dataset: string, locale: Locale): string {
  return `birsa-${edition}-${dataset}-${locale}.csv`;
}

/** Byte size of the CSV, for "CSV, 2 KB" next to the link. */
export function csvSizeLabel(dataset: Dataset, locale: Locale): string {
  const bytes = new TextEncoder().encode(buildCsv(dataset, locale)).length;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
