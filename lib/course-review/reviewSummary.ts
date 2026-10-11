/**
 * What the reviews held for a course say about workload, reduced to the few
 * facts the planner can repeat without judging anything: whether real reviews
 * exist, how many students they rest on, and the workload band distribution
 * of the most recent term that has one.
 *
 * The reviews passed in are whatever the caller holds for the course, so the
 * same functions serve the repository reviews alone and the repository plus
 * the summaries published from the database (`mergeReviews` in
 * `lib/course-review/published.ts`). Sample reviews are demonstration content
 * and never count. Nothing here averages bands, picks a middle one or returns
 * a single number for a course: a `LatestBands` is a count per band for one
 * named term, which is what the words are written from.
 *
 * Pure functions, with no React and no database, so the planner's workload
 * line, its finding and the elective shortlist all read reviews one way.
 */
import type {
  AcademicTerm,
  StudentReview,
  WorkloadBandCounts,
} from "@/content/course-review/types";
import { termKey } from "@/lib/course-review/terms";
import {
  bandAnswerCount,
  describeBandDistribution,
  type BandCopy,
} from "@/lib/course-review/workload";

/**
 * The fewest band answers a term needs before the planner repeats it. A
 * published summary stands on at least five approved submissions, but a band
 * is optional, so a summary can carry two answers or none. Two students saying
 * "over 6 hours" is an anecdote, and "mostly" needs more than that behind it.
 */
export const MIN_BAND_ANSWERS = 3;

/** The workload bands of one term, summed over every review of that term. */
export type LatestBands = {
  term: AcademicTerm;
  counts: WorkloadBandCounts;
  /** How many students gave a band, the denominator of the distribution. */
  answers: number;
};

export type ReviewDigest = {
  /** Students the real reviews rest on, summed over their summaries. 0 means no real review. */
  students: number;
  /** The most recent term any real review is for, or null with none. */
  latestTerm: AcademicTerm | null;
  /** The most recent term with at least `MIN_BAND_ANSWERS` band answers, or null. */
  bands: LatestBands | null;
};

function termOrder(term: AcademicTerm): number {
  return term.year * 4 + (term.semester === "summer" ? 3 : term.semester);
}

/** Reviews that are real student feedback: sample reviews are layout demonstrations. */
export function realReviews(reviews: readonly StudentReview[]): StudentReview[] {
  return reviews.filter((review) => !review.sample);
}

/**
 * The band distribution of the most recent term that has enough answers.
 * Several summaries of one term (one per instructor) are summed, because the
 * planner is asked about the course in that term and not about one lecturer.
 * Older terms are ignored once a newer one qualifies, so a distribution never
 * mixes terms.
 */
export function latestBandReport(reviews: readonly StudentReview[]): LatestBands | null {
  const byTerm = new Map<string, LatestBands>();
  for (const review of realReviews(reviews)) {
    if (!review.workloadBands) continue;
    const key = termKey(review.term);
    const found = byTerm.get(key) ?? { term: review.term, counts: {}, answers: 0 };
    for (const band of ["under_3", "3_to_6", "over_6"] as const) {
      const n = review.workloadBands[band] ?? 0;
      if (n > 0) found.counts[band] = (found.counts[band] ?? 0) + n;
    }
    found.answers = bandAnswerCount(found.counts);
    byTerm.set(key, found);
  }
  const qualifying = [...byTerm.values()]
    .filter((bands) => bands.answers >= MIN_BAND_ANSWERS)
    .sort((a, b) => termOrder(b.term) - termOrder(a.term));
  return qualifying[0] ?? null;
}

export function digestReviews(reviews: readonly StudentReview[]): ReviewDigest {
  const real = realReviews(reviews);
  const latest = [...real].sort((a, b) => termOrder(b.term) - termOrder(a.term))[0];
  return {
    students: real.reduce((sum, review) => sum + review.reviewCount, 0),
    latestTerm: latest?.term ?? null,
    bands: latestBandReport(reviews),
  };
}

/** Words for a course's review line, one set per language. */
export type ReviewLineCopy = {
  /** Said when no real review exists. */
  none: string;
  /** Contains "{term}", the most recent term any real review is for. */
  existsTemplate: string;
  /** Said when reviews exist but too few students gave an hours estimate. */
  noBands: string;
  /** Contains "{term}" and "{sentences}"; the sentences are the distribution in words. */
  bandsTemplate: string;
  /** The band wording, shared with the course page. */
  band: BandCopy;
};

/**
 * The one line a candidate carries in a list: whether reviews exist, and the
 * workload as a distribution in words, for a named term. Never a number for
 * the course as a whole. `termLabel` words a term in the page's language.
 */
export function reviewLine(
  digest: ReviewDigest,
  copy: ReviewLineCopy,
  termLabel: (term: AcademicTerm) => string
): string {
  if (digest.students === 0 || !digest.latestTerm) return copy.none;
  const exists = copy.existsTemplate.replace("{term}", termLabel(digest.latestTerm));
  if (!digest.bands) return `${exists} ${copy.noBands}`;
  const sentences = describeBandDistribution(digest.bands.counts, copy.band).join(" ");
  return `${exists} ${copy.bandsTemplate
    .replace("{term}", termLabel(digest.bands.term))
    .replace("{sentences}", sentences)}`;
}
