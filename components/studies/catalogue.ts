import type { Course, CourseCategory, CourseTrack } from "@/content/course-review/types";

/**
 * Display order for the course review catalogue's two fixed enums
 * (`content/course-review/types.ts`). Owned by Wave 5D, distinct from
 * `components/course-review/constants.ts` (1.0, untouched) so this route
 * family has no dependency on a path outside its own ownership.
 */
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

export type CatalogueFilters = {
  q?: string;
  track?: string;
  category?: string;
};

/** Whether any filter in `filters` is actually set, for the "clear filters" link. */
export function hasActiveFilters(filters: CatalogueFilters): boolean {
  return Boolean(filters.q?.trim() || filters.track || filters.category);
}

/** Filters the catalogue by track, category and a free-text match on code and title (both locales). */
export function filterCourses(courses: readonly Course[], filters: CatalogueFilters): Course[] {
  const needle = filters.q?.trim().toLowerCase();
  return courses.filter((course) => {
    if (filters.track && course.track !== filters.track) return false;
    if (filters.category && course.category !== filters.category) return false;
    if (needle) {
      const haystack = `${course.code} ${course.title.en} ${course.title.th}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
}

/** Formats e.g. `[1]` -> "Year 1" or `[3, 4]` -> "Year 3 to 4" (the label carries the word "Year"/"ชั้นปี"). */
export function formatYearLevel(yearLevel: readonly number[], yearLabel: string): string {
  if (yearLevel.length === 0) return yearLabel;
  const min = Math.min(...yearLevel);
  const max = Math.max(...yearLevel);
  return min === max ? `${yearLabel} ${min}` : `${yearLabel} ${min} to ${max}`;
}

/** Fills a "{name}"-style template, e.g. dict.courseReview.pageOf or dict.courseReview.reviewBasedOn. */
export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template
  );
}
