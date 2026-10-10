/**
 * The officer's summary editor as a form: turning a `ReviewSummary` into the
 * field values the editor shows, and the posted fields back into a
 * `ReviewSummary` that is safe to publish.
 *
 * Whatever an officer submits is what publishes, whether Claude drafted it or
 * they wrote it by hand, so this is the last check before text reaches the
 * public site. It holds the bilingual parity rule (a tip or quote is in both
 * languages or in neither) and the same identifying-details check the
 * submission form uses. Pure, so it is testable without a form or a database.
 */
import type { ReviewSummary } from "@/lib/course-review/published";
import { looksIdentifying } from "@/lib/validation";

/** How many tip and quote boxes the editor offers. A draft never has more. */
export const SUMMARY_TIP_SLOTS = 5;
export const SUMMARY_QUOTE_SLOTS = 3;

export const SUMMARY_LIMITS = {
  minText: 10,
  text: 1500,
  tip: 400,
  quote: 600,
} as const;

export type SummaryErrorCode =
  "required" | "tooShort" | "tooLong" | "identifying" | "pairIncomplete" | "noTips";

/** Field values keyed by form field name, e.g. "workload_en" or "tip2_th". */
export type SummaryFields = Record<string, string>;

/** Every field name the editor posts. */
export function summaryFieldNames(): string[] {
  const names = ["workload_en", "workload_th", "assessment_en", "assessment_th"];
  for (let n = 1; n <= SUMMARY_TIP_SLOTS; n += 1) names.push(`tip${n}_en`, `tip${n}_th`);
  for (let n = 1; n <= SUMMARY_QUOTE_SLOTS; n += 1) names.push(`quote${n}_en`, `quote${n}_th`);
  return names;
}

/** The editor's field values for `summary`, with every empty slot present as an empty string. */
export function summaryToFields(summary: ReviewSummary | null): SummaryFields {
  const fields: SummaryFields = Object.fromEntries(summaryFieldNames().map((name) => [name, ""]));
  if (!summary) return fields;
  fields.workload_en = summary.workload.en;
  fields.workload_th = summary.workload.th;
  fields.assessment_en = summary.assessment.en;
  fields.assessment_th = summary.assessment.th;
  summary.tips.slice(0, SUMMARY_TIP_SLOTS).forEach((tip, i) => {
    fields[`tip${i + 1}_en`] = tip.en;
    fields[`tip${i + 1}_th`] = tip.th;
  });
  summary.quotes.slice(0, SUMMARY_QUOTE_SLOTS).forEach((quote, i) => {
    fields[`quote${i + 1}_en`] = quote.en;
    fields[`quote${i + 1}_th`] = quote.th;
  });
  return fields;
}

function checkText(
  value: string,
  max: number,
  minLength: number
): Exclude<SummaryErrorCode, "pairIncomplete" | "noTips"> | null {
  if (value.length === 0) return "required";
  if (value.length < minLength) return "tooShort";
  if (value.length > max) return "tooLong";
  if (looksIdentifying(value)) return "identifying";
  return null;
}

/**
 * Reads the posted fields into a summary. Blank tip and quote slots are
 * skipped; a slot with only one language filled is an error, so the published
 * page can never show one language's tip beside a gap in the other.
 */
export function parseSummaryFields(
  fields: SummaryFields
): { ok: true; summary: ReviewSummary } | { ok: false; errors: Record<string, SummaryErrorCode> } {
  const value = (name: string) => (fields[name] ?? "").trim();
  const errors: Record<string, SummaryErrorCode> = {};

  for (const base of ["workload", "assessment"] as const) {
    for (const lang of ["en", "th"] as const) {
      const name = `${base}_${lang}`;
      const problem = checkText(value(name), SUMMARY_LIMITS.text, SUMMARY_LIMITS.minText);
      if (problem) errors[name] = problem;
    }
  }

  const pairs = (base: "tip" | "quote", slots: number, max: number) => {
    const found: { en: string; th: string }[] = [];
    for (let n = 1; n <= slots; n += 1) {
      const en = value(`${base}${n}_en`);
      const th = value(`${base}${n}_th`);
      if (!en && !th) continue;
      if (!en || !th) {
        errors[en ? `${base}${n}_th` : `${base}${n}_en`] = "pairIncomplete";
        continue;
      }
      for (const [lang, text] of [
        ["en", en],
        ["th", th],
      ] as const) {
        const problem = checkText(text, max, 1);
        if (problem) errors[`${base}${n}_${lang}`] = problem;
      }
      found.push({ en, th });
    }
    return found;
  };

  const tips = pairs("tip", SUMMARY_TIP_SLOTS, SUMMARY_LIMITS.tip);
  const quotes = pairs("quote", SUMMARY_QUOTE_SLOTS, SUMMARY_LIMITS.quote);
  if (tips.length === 0 && !Object.keys(errors).some((name) => name.startsWith("tip"))) {
    errors.tip1_en = "noTips";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return {
    ok: true,
    summary: {
      workload: { en: value("workload_en"), th: value("workload_th") },
      assessment: { en: value("assessment_en"), th: value("assessment_th") },
      tips,
      quotes,
    },
  };
}
