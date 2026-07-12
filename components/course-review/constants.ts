/**
 * Display order for the fixed track/category enums from
 * `content/course-review/types.ts`. Kept here (rather than duplicated in
 * each component) so the browser filter and the stats breakdown always list
 * them in the same order.
 */
import type { CourseCategory, CourseTrack } from "@/content/course-review/types";

export const TRACK_ORDER: CourseTrack[] = [
  "foundational",
  "international-relations",
  "governance-transnational",
  "public-admin-policy",
  "global-political-economy",
];

export const CATEGORY_ORDER: CourseCategory[] = [
  "general-education",
  "core",
  "required",
  "elective-area",
  "elective-approach",
  "minor-required",
  "minor-elective",
  "free-elective",
];

/** Formats e.g. `[1]` -> "Year 1" or `[3, 4]` -> "Year 3–4". */
export function formatYearLevel(yearLevel: number[], yearLabel: string): string {
  if (yearLevel.length === 0) return yearLabel;
  const min = Math.min(...yearLevel);
  const max = Math.max(...yearLevel);
  return min === max ? `${yearLabel} ${min}` : `${yearLabel} ${min}–${max}`;
}

/** Fills a "{current}"/"{total}"-style template, e.g. dict.pageOf. */
export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template
  );
}
