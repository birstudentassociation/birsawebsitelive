/**
 * Pure, React-free filtering and URL (de)serialisation for the course review
 * browser, shared by the UI and the tests.
 */
import type { Course, CourseCategory, CourseTrack } from "@/content/course-review/types";
import { normaliseCourseQuery } from "@/lib/study-plan/courseMatch";

export type CourseFilters = {
  query: string;
  track: CourseTrack | "all";
  category: CourseCategory | "all";
  year: number | "all";
  /** Keep only courses that have at least one review. */
  reviewed: boolean;
  /** One-based page number, matching the browser's pager. */
  page: number;
};

export const DEFAULT_FILTERS: CourseFilters = {
  query: "",
  track: "all",
  category: "all",
  year: "all",
  reviewed: false,
  page: 1,
};

const TRACKS: readonly CourseTrack[] = [
  "foundational",
  "international-relations",
  "governance-transnational",
  "public-admin-policy",
  "global-political-economy",
];

const CATEGORIES: readonly CourseCategory[] = [
  "general-education",
  "core",
  "required",
  "elective-area",
  "elective-approach",
  "minor-required",
  "minor-elective",
  "free-elective",
];

function searchText(course: Course): string {
  const names = [
    ...(course.instructors ?? []),
    ...(course.reviews ?? []).flatMap((review) => (review.instructor ? [review.instructor] : [])),
  ].flatMap((instructor) => [instructor.name.en, instructor.name.th]);
  return normaliseCourseQuery(
    [
      course.code,
      course.title.en,
      course.title.th,
      course.description.en,
      course.description.th,
      ...names,
    ].join(" ")
  );
}

/**
 * Narrows the catalogue. Every whitespace token of the query must match
 * somewhere in the course's code, titles, descriptions or instructor names
 * (course and review instructors, both languages). `reviewed` keeps courses
 * with any review at all, sample reviews included, so the filter can be
 * demonstrated before real reviews exist. `page` is not applied here.
 */
export function filterCourses(courses: Course[], filters: CourseFilters): Course[] {
  const normalised = normaliseCourseQuery(filters.query);
  const tokens = normalised === "" ? [] : normalised.split(" ");
  return courses.filter((course) => {
    if (filters.track !== "all" && course.track !== filters.track) return false;
    if (filters.category !== "all" && course.category !== filters.category) return false;
    if (filters.year !== "all" && !course.yearLevel.includes(filters.year)) return false;
    if (filters.reviewed && !course.reviews?.length) return false;
    if (tokens.length === 0) return true;
    const text = searchText(course);
    return tokens.every((token) => text.includes(token));
  });
}

function positiveInt(value: string | null): number | null {
  if (value === null || !/^\d+$/.test(value)) return null;
  const n = Number(value);
  return Number.isSafeInteger(n) ? n : null;
}

/** Reads filters from URL params (keys q, track, category, year, reviewed, page). Invalid values fall back to defaults. */
export function parseFilters(params: URLSearchParams): CourseFilters {
  const track = params.get("track");
  const category = params.get("category");
  const year = positiveInt(params.get("year"));
  const page = positiveInt(params.get("page"));
  return {
    query: params.get("q") ?? DEFAULT_FILTERS.query,
    track: TRACKS.includes(track as CourseTrack) ? (track as CourseTrack) : DEFAULT_FILTERS.track,
    category: CATEGORIES.includes(category as CourseCategory)
      ? (category as CourseCategory)
      : DEFAULT_FILTERS.category,
    year: year !== null && year > 0 ? year : DEFAULT_FILTERS.year,
    reviewed: params.get("reviewed") === "1",
    page: page !== null && page > 0 ? page : DEFAULT_FILTERS.page,
  };
}

/** Inverse of `parseFilters`; values equal to the defaults are omitted. */
export function serialiseFilters(filters: CourseFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query !== DEFAULT_FILTERS.query) params.set("q", filters.query);
  if (filters.track !== "all") params.set("track", filters.track);
  if (filters.category !== "all") params.set("category", filters.category);
  if (filters.year !== "all") params.set("year", String(filters.year));
  if (filters.reviewed) params.set("reviewed", "1");
  if (filters.page !== DEFAULT_FILTERS.page) params.set("page", String(filters.page));
  return params;
}
