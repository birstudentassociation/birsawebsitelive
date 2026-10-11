/**
 * The shortlist for an open choice in a term: the candidates a student can
 * actually take there, in an order that depends on the plan and on nothing
 * else.
 *
 * `suggestForTerm` already lists, for each choice the recommended plan leaves
 * open, the courses that count towards it for the student's curriculum version
 * and minor. This narrows that list to the courses that make sense to take in
 * this term, by three tests applied in turn:
 *
 * 1. it counts towards the slot (re-checked here, so the shortlist is correct
 *    for any slot it is given);
 * 2. its prerequisites are met by this term: passed, or planned in a strictly
 *    earlier term, the rule `checkPlan` uses;
 * 3. where offering history exists for the course, it has been recorded in this
 *    kind of term. A course with no history at all is kept, because no history
 *    is not a signal.
 *
 * What the tests leave out is counted, not hidden: the screen says how many
 * courses were left out and why, and every one of them is still in the full
 * picker, because findings never block.
 *
 * The order is deterministic and is the plan's business alone:
 *
 * 1. courses the recommended plan itself puts in this term come first;
 * 2. then the course that unlocks more later courses, counting the courses in
 *    the student's version that list it as a prerequisite and that the student
 *    has not already passed;
 * 3. then the course code, so equal courses never swap places between renders.
 *
 * Reviews are attached to each entry for display after the order is fixed and
 * play no part in it: the lookup is never consulted by the comparison, and a
 * test moves reviews between candidates to prove the order does not change.
 * There is no quality score, no popularity and no difficulty here, by design.
 *
 * Pure functions, with the lookups passed in.
 */
import type { CurriculumVersion, TermRef } from "@/content/curriculum";
import { unlocks } from "@/lib/courses/graph";
import { recordedInKind, type OfferingHistory } from "@/lib/courses/offeringHistory";
import { digestReviews, type ReviewDigest } from "@/lib/course-review/reviewSummary";
import type { StudyPlan } from "@/lib/study-plan/plan";
import type { OpenSlot, SuggestedCourse } from "@/lib/study-plan/suggest";
import { catalogueReviews, type ReviewLookup } from "@/lib/study-plan/workloadProfile";

/** Why a course that counts towards the slot is not on its shortlist. */
export type LeftOutReason = "prerequisites" | "notRecordedInKind";

export type ShortlistEntry = {
  course: SuggestedCourse;
  /** Later courses in the student's curriculum that list this one as a prerequisite and are not yet passed. */
  unlocksCount: number;
  /** For display only. The order never reads it. */
  reviews: ReviewDigest;
};

export type Shortlist = {
  entries: ShortlistEntry[];
  /** Courses that count towards the slot but did not pass a test, by the first test they failed. */
  leftOut: Record<LeftOutReason, string[]>;
};

export type ShortlistSources = {
  offeringHistory: (code: string) => OfferingHistory | null;
  /** Used to fill each entry's `reviews`, never to order. */
  reviews?: ReviewLookup;
};

const MINOR_BUCKETS = ["minorRequired", "minorElective", "minorElectiveOther"];

/** Whether a candidate counts towards the slot, for the version and minor it was resolved under. */
function countsTowardsSlot(slot: OpenSlot, course: SuggestedCourse): boolean {
  if (slot.choices) return slot.choices.includes(course.code);
  if (slot.category === "minor") {
    return course.bucket !== null && MINOR_BUCKETS.includes(course.bucket);
  }
  return course.bucket === slot.category;
}

/** The order the shortlist is in: recommended here, then more unlocked, then code. */
export function compareEntries(
  a: Pick<ShortlistEntry, "course" | "unlocksCount">,
  b: Pick<ShortlistEntry, "course" | "unlocksCount">
): number {
  if (a.course.recommendedHere !== b.course.recommendedHere) {
    return a.course.recommendedHere ? -1 : 1;
  }
  if (a.unlocksCount !== b.unlocksCount) return b.unlocksCount - a.unlocksCount;
  return a.course.code < b.course.code ? -1 : a.course.code > b.course.code ? 1 : 0;
}

/** The shortlist for one open slot of a term. */
export function shortlistForSlot(
  version: CurriculumVersion,
  plan: StudyPlan,
  term: TermRef,
  slot: OpenSlot,
  sources: ShortlistSources
): Shortlist {
  const passed = new Set(plan.passed);
  const leftOut: Shortlist["leftOut"] = { prerequisites: [], notRecordedInKind: [] };
  const kept: Omit<ShortlistEntry, "reviews">[] = [];

  for (const course of slot.candidates) {
    if (!countsTowardsSlot(slot, course)) continue;
    if (course.missingPrerequisites.length > 0) {
      leftOut.prerequisites.push(course.code);
      continue;
    }
    const history = sources.offeringHistory(course.code);
    if (history && !recordedInKind(history, term.kind)) {
      leftOut.notRecordedInKind.push(course.code);
      continue;
    }
    kept.push({
      course,
      unlocksCount: unlocks(course.code, version.id).filter((code) => !passed.has(code)).length,
    });
  }

  const lookup = sources.reviews ?? catalogueReviews;
  return {
    entries: kept
      .sort(compareEntries)
      .map((entry) => ({ ...entry, reviews: digestReviews(lookup(entry.course.code)) })),
    leftOut,
  };
}
