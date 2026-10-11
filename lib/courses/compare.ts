/**
 * The data behind the compare page (`/student-life/course-reviews/compare`):
 * two courses laid side by side, facts first.
 *
 * Everything comes from the course graph, the assessment classifier and the
 * reviews the caller passes in, so the page can compare any two codes the site
 * has a page for, including the facts-only ones, and states nothing that a
 * course page does not. It describes and never ranks: there is no "better
 * course", no score and no recommendation, and reviews appear as the same
 * distribution in words they appear as everywhere else. Whether the two courses
 * fit the student's plan is not decided here, because the plan is on the
 * device; the page adds that in the browser.
 *
 * The two codes arrive from the address, so they are untrusted. `assembleCompare`
 * returns a reason rather than throwing for a missing, unknown or repeated
 * code, and the page turns that into a message and the form to try again.
 *
 * Pure functions with the reviews passed in.
 */
import type { StudentReview } from "@/content/course-review/types";
import type { CurriculumVersionId, TermRef } from "@/content/curriculum/types";
import {
  allCourseCodes,
  courseNode,
  prerequisites,
  recommendedIn,
  unlocks,
  type CountsTowards,
  type CourseNode,
} from "@/lib/courses/graph";
import { offeringHistory, type OfferingHistory } from "@/lib/courses/offeringHistory";
import { digestReviews, type ReviewDigest } from "@/lib/course-review/reviewSummary";
import { classifyAssessment, type CourseAssessment } from "@/lib/study-plan/assessmentProfile";

/** The query parameters of the compare page. */
export const COMPARE_A = "a";
export const COMPARE_B = "b";

export type CompareSide = {
  code: string;
  node: CourseNode;
  /** The latest curriculum version that lists the code, which every fact below is read in. */
  version: CurriculumVersionId;
  credits: number;
  prerequisites: string[];
  unlocks: string[];
  recommendedTerms: TermRef[];
  /** Where it counts in that version, generically: a bucket and the minors that list it. */
  counts: CountsTowards;
  /** How it is assessed, as far as the catalogue has recorded. `kind` is "unknown" with no record. */
  assessment: CourseAssessment;
  history: OfferingHistory | null;
  /** The reviews held, sample ones included, for the page to describe. */
  reviews: StudentReview[];
  digest: ReviewDigest;
};

export type CompareResult =
  | { ok: true; a: CompareSide; b: CompareSide }
  /** One or both codes were not given. */
  | { ok: false; reason: "missing"; missing: ("a" | "b")[] }
  /** The codes given that no curriculum lists, as typed. */
  | { ok: false; reason: "unknown"; unknown: string[] }
  | { ok: false; reason: "same"; code: string };

/** Longest typed code worth looking at; anything longer is not a course code. */
const MAX_CODE_LENGTH = 12;

/**
 * The course code a typed value means: spaces dropped and upper-cased, so
 * "pi 380" reads as PI380. Null for anything that is not a code some
 * curriculum lists.
 */
export function resolveCompareCode(raw: string | undefined): string | null {
  if (!raw || raw.length > MAX_CODE_LENGTH) return null;
  const code = raw.replace(/\s+/g, "").toUpperCase();
  return /^[A-Z]{2,4}\d{3}$/.test(code) && courseNode(code) ? code : null;
}

function sideOf(
  node: CourseNode,
  reviewsOf: (code: string) => readonly StudentReview[]
): CompareSide {
  const version = node.latest.version;
  const reviews = [...reviewsOf(node.code)];
  return {
    code: node.code,
    node,
    version,
    credits: node.latest.credits,
    prerequisites: prerequisites(node.code, version),
    unlocks: unlocks(node.code, version),
    recommendedTerms: recommendedIn(node.code, version),
    counts: { category: node.latest.category, minors: node.latest.minors },
    assessment: classifyAssessment(node.code, node.catalogue?.assessmentFacts),
    history: offeringHistory(node.code, reviews),
    reviews,
    digest: digestReviews(reviews),
  };
}

/**
 * Assembles the two sides from the raw `a` and `b` parameters. `reviewsOf`
 * returns every review held for a code, the repository's and the published
 * ones together.
 */
export function assembleCompare(
  rawA: string | undefined,
  rawB: string | undefined,
  reviewsOf: (code: string) => readonly StudentReview[] = (code) =>
    courseNode(code)?.catalogue?.reviews ?? []
): CompareResult {
  const missing = (
    [
      ["a", rawA],
      ["b", rawB],
    ] as const
  )
    .filter(([, raw]) => !raw || raw.trim() === "")
    .map(([which]) => which);
  if (missing.length > 0) return { ok: false, reason: "missing", missing };

  const a = resolveCompareCode(rawA);
  const b = resolveCompareCode(rawB);
  const unknown = [a ? null : rawA!.trim(), b ? null : rawB!.trim()].filter(
    (value): value is string => value !== null
  );
  if (!a || !b) return { ok: false, reason: "unknown", unknown };
  if (a === b) return { ok: false, reason: "same", code: a };

  return {
    ok: true,
    a: sideOf(courseNode(a)!, reviewsOf),
    b: sideOf(courseNode(b)!, reviewsOf),
  };
}

/** The compare page's address for two codes, without the locale prefix. */
export function comparePath(a: string, b: string): string {
  return `/student-life/course-reviews/compare?${COMPARE_A}=${encodeURIComponent(a)}&${COMPARE_B}=${encodeURIComponent(b)}`;
}

/**
 * Every course a page can be compared to, with the title in the page's
 * language (the English title for a code the review catalogue does not hold),
 * sorted by code. Optionally without one code, so a course page does not offer
 * to compare a course with itself.
 */
export function comparableCourses(
  locale: "en" | "th",
  except?: string
): { code: string; title: string }[] {
  return allCourseCodes()
    .filter((code) => code !== except)
    .map((code) => {
      const node = courseNode(code)!;
      return { code, title: node.catalogue ? node.catalogue.title[locale] : node.title };
    });
}
