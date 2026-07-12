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
