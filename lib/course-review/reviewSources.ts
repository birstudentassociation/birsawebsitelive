/**
 * The reviews a screen that looks at many courses at once should see: those
 * held in the repository together with those published from the database.
 *
 * The plan screen, the print page and the compare page each read the published
 * reviews once (`listPublishedReviewsByCourse`) and hand the result here, so
 * the workload lines, the `workloadLoad` and `offering` findings and the
 * elective shortlist all stand on the same reviews a course page shows. A
 * published summary for the same term and instructor as a repository one
 * replaces it (`mergeReviews`), so a review moved into the database is never
 * counted twice.
 *
 * Kept apart from `lib/study-plan/findings.ts` because it imports the
 * database module, and findings run in the browser too (the shared plan view).
 * Pure functions: the published reviews are passed in.
 */
import type { StudentReview } from "@/content/course-review/types";
import { courseNode } from "@/lib/courses/graph";
import { offeringHistory } from "@/lib/courses/offeringHistory";
import { mergeReviews } from "@/lib/course-review/published";
import type { FindingSources } from "@/lib/study-plan/findings";

/** Published reviews by course code, as `listPublishedReviewsByCourse` returns them. */
export type PublishedByCourse = ReadonlyMap<string, readonly StudentReview[]>;

/** Every review held for a course: the repository's and the published ones, newest term first. */
export function reviewsFor(code: string, published: PublishedByCourse): StudentReview[] {
  return mergeReviews(courseNode(code)?.catalogue?.reviews ?? [], published.get(code) ?? []);
}

/**
 * The lookups `checkPlan` takes, with published reviews counted. Assessment
 * facts are not in the database, so that lookup is left to its default.
 */
export function findingSourcesFor(
  published: PublishedByCourse
): FindingSources & Required<Pick<FindingSources, "reviews" | "offeringHistory">> {
  return {
    reviews: (code) => reviewsFor(code, published),
    offeringHistory: (code) => offeringHistory(code, published.get(code) ?? []),
  };
}
