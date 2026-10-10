/**
 * Pure, React-free filtering and URL (de)serialisation for the course review
 * browser, shared by the UI and the tests.
 */
import type { Course, CourseCategory, CourseTrack } from "@/content/course-review/types";
import type { MinorId } from "@/content/curriculum/types";
import { normaliseCourseQuery } from "@/lib/study-plan/courseMatch";

export type CourseFilters = {
  query: string;
  track: CourseTrack | "all";
  category: CourseCategory | "all";
  year: number | "all";
  /** Keep only courses that are in this minor, required or elective (current curriculum). */
  minor: MinorId | "all";
  /** Keep only courses that have at least one review. */
  reviewed: boolean;
  /**
   * The three "with my plan" filters. They mean something only when a plan is
   * stored on the device, so they are applied only when `FilterContext.plan`
   * is given; without a plan they are carried in the URL and otherwise
   * ignored, which is what lets a link from search switch them on for a
   * visitor who has a plan and do nothing for one who has not.
   */
  notPassed: boolean;
  ready: boolean;
  short: boolean;
  /** One-based page number, matching the browser's pager. */
  page: number;
};

export const DEFAULT_FILTERS: CourseFilters = {
  query: "",
  track: "all",
  category: "all",
  year: "all",
  minor: "all",
  reviewed: false,
  notPassed: false,
  ready: false,
  short: false,
  page: 1,
};

/** The student-specific answers the "with my plan" filters need, one question per filter. */
export type PlanMatcher = {
  /** The student has not passed the course (or its counterpart in their curriculum). */
  notPassed: (code: string) => boolean;
  /** Every prerequisite is passed or planned early enough for the next term. */
  ready: (code: string) => boolean;
  /** The course counts towards a category the student is still short in. */
  short: (code: string) => boolean;
};

/**
 * What filtering needs beyond the courses themselves. Both parts are optional
 * so the catalogue works, and its tests run, without a curriculum or a plan:
 * `minorMembers` maps each minor to the course codes in it (the course graph's
 * membership for the current curriculum, built by `minorMembers` in
 * `lib/course-review/facts.ts`), and `plan` exists only when the visitor has a
 * stored plan.
 */
export type FilterContext = {
  minorMembers?: Readonly<Partial<Record<MinorId, readonly string[]>>>;
  plan?: PlanMatcher;
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

/** The curriculum's three minors, in the order the browser lists them. */
export const MINOR_IDS: readonly MinorId[] = [
  "governance",
  "publicAdministration",
  "globalPoliticalEconomy",
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
 * demonstrated before real reviews exist. `minor` keeps the courses the
 * context lists for that minor, and keeps none if the context lists none, so a
 * missing membership table can never read as "every course". The "with my
 * plan" filters apply only when the context carries a plan matcher. `page` is
 * not applied here.
 */
export function filterCourses(
  courses: Course[],
  filters: CourseFilters,
  context: FilterContext = {}
): Course[] {
  const normalised = normaliseCourseQuery(filters.query);
  const tokens = normalised === "" ? [] : normalised.split(" ");
  const minorCodes = filters.minor === "all" ? null : context.minorMembers?.[filters.minor];
  const plan = context.plan;
  return courses.filter((course) => {
    if (filters.track !== "all" && course.track !== filters.track) return false;
    if (filters.category !== "all" && course.category !== filters.category) return false;
    if (filters.year !== "all" && !course.yearLevel.includes(filters.year)) return false;
    if (filters.minor !== "all" && !minorCodes?.includes(course.code)) return false;
    if (filters.reviewed && !course.reviews?.length) return false;
    if (plan) {
      if (filters.notPassed && !plan.notPassed(course.code)) return false;
      if (filters.ready && !plan.ready(course.code)) return false;
      if (filters.short && !plan.short(course.code)) return false;
    }
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

/**
 * Reads filters from URL params (keys q, track, category, year, minor,
 * reviewed, notPassed, ready, short, page). Invalid values fall back to
 * defaults.
 */
export function parseFilters(params: URLSearchParams): CourseFilters {
  const track = params.get("track");
  const category = params.get("category");
  const minor = params.get("minor");
  const year = positiveInt(params.get("year"));
  const page = positiveInt(params.get("page"));
  return {
    query: params.get("q") ?? DEFAULT_FILTERS.query,
    track: TRACKS.includes(track as CourseTrack) ? (track as CourseTrack) : DEFAULT_FILTERS.track,
    category: CATEGORIES.includes(category as CourseCategory)
      ? (category as CourseCategory)
      : DEFAULT_FILTERS.category,
    year: year !== null && year > 0 ? year : DEFAULT_FILTERS.year,
    minor: MINOR_IDS.includes(minor as MinorId) ? (minor as MinorId) : DEFAULT_FILTERS.minor,
    reviewed: params.get("reviewed") === "1",
    notPassed: params.get("notPassed") === "1",
    ready: params.get("ready") === "1",
    short: params.get("short") === "1",
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
  if (filters.minor !== "all") params.set("minor", filters.minor);
  if (filters.reviewed) params.set("reviewed", "1");
  if (filters.notPassed) params.set("notPassed", "1");
  if (filters.ready) params.set("ready", "1");
  if (filters.short) params.set("short", "1");
  if (filters.page !== DEFAULT_FILTERS.page) params.set("page", String(filters.page));
  return params;
}
