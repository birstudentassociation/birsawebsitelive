/**
 * The plan screen's course picker used to be one flat list of every catalogue
 * course the student had not passed and had not placed anywhere: correct, but
 * useless for deciding what belongs in THIS term. This module turns that flat
 * list into something that knows what it is looking at, for a single term at
 * a time.
 *
 * It groups the available courses by the requirement bucket they would
 * actually count toward for this student (minor courses resolved through
 * their chosen minor, same as `remainingRequirements`), calls out the ones
 * the recommended plan names in this exact term, and surfaces the open
 * choices ("Minor elective course 1") the recommended plan leaves for the
 * student to fill in this term. It never invents a plan of its own; every
 * shape it returns comes from the curriculum data plus the student's own
 * plan, the same inputs `derive.ts` and `findings.ts` already work from.
 *
 * Findings never block (see the header of findings.ts), and this module
 * keeps that stance: a course with an unmet prerequisite is still offered,
 * only annotated with `missingPrerequisites`, because telling the student is
 * this service's whole job and blocking them is not.
 */
import {
  resolveMinorCategory,
  type CategoryId,
  type Course,
  type CurriculumVersion,
  type LocalizedText,
  type MinorId,
  type TermRef,
} from "@/content/curriculum";
import type { StudyPlan } from "@/lib/study-plan/plan";
import { planTotals, remainingRequirements, termIndex } from "@/lib/study-plan/derive";

export type SuggestedCourse = {
  code: string;
  title: string;
  credits: number;
  bucket: CategoryId | null;
  recommendedHere: boolean;
  missingPrerequisites: string[];
};

export type SuggestionGroupId = CategoryId | "recommended" | "other";

export type SuggestionGroup = {
  id: SuggestionGroupId;
  remaining: number;
  courses: SuggestedCourse[];
};

export type OpenSlot = {
  id: string;
  label: LocalizedText;
  category: CategoryId;
  candidates: SuggestedCourse[];
};

export type TermSuggestion = {
  openSlots: OpenSlot[];
  groups: SuggestionGroup[];
};

/**
 * The three buckets a minor course can land in, which is what an unresolvable
 * pooled `"minor"` placeholder has to offer candidates from (see the open-slot
 * code below).
 */
const MINOR_BUCKETS: CategoryId[] = ["minorRequired", "minorElective", "minorElectiveOther"];

/**
 * The requirement bucket a course counts toward for this student. Shared by
 * every place below that needs it, so a course and a placeholder resolve the
 * same way: `course.category` directly, except the pooled `"minor"` value,
 * which only means something once paired with the student's chosen minor
 * (see `resolveMinorCategory`'s own comment for why the course cannot carry
 * its bucket itself). `excludedFromTotal` courses (TU050) resolve to null:
 * they count toward nothing, so grouping them under a bucket would be a lie.
 */
function bucketFor(
  version: CurriculumVersion,
  minorId: MinorId,
  course: Course
): CategoryId | null {
  if (course.excludedFromTotal) return null;
  if (course.category !== "minor") return course.category;
  return resolveMinorCategory(version, minorId, course.code);
}

export function suggestForTerm(
  version: CurriculumVersion,
  plan: StudyPlan,
  term: TermRef
): TermSuggestion {
  const cutoff = termIndex(term);

  // Everything already spoken for, whether by a passed course or a course
  // placed anywhere in the plan, including this same term: a course already
  // sitting in this term is not something the picker should still be
  // offering as a choice for it.
  const passedSet = new Set(plan.passed);
  const placedSet = new Set(plan.terms.flatMap((t) => t.codes));

  // A prerequisite counts as met by `plan.passed` or by a planned term
  // strictly earlier than `term`. Same-term does not count, matching
  // `checkPlan`'s prerequisite check in findings.ts: a course sitting next to
  // its own prerequisite in the same term has not actually had that
  // prerequisite satisfied yet.
  const earnedByEarlierTerm = new Set(plan.passed);
  for (const plannedTerm of plan.terms) {
    if (termIndex(plannedTerm.term) < cutoff) {
      for (const code of plannedTerm.codes) earnedByEarlierTerm.add(code);
    }
  }

  const recommendedTerm = version.recommendedPlan.value.find((t) => termIndex(t.term) === cutoff);
  const recommendedCodesHere = new Set(
    (recommendedTerm?.entries ?? []).flatMap((e) => (e.kind === "course" ? [e.code] : []))
  );

  // The pool this whole module works from: every catalogue course not
  // already passed and not already placed anywhere, in any term.
  const available = version.courses.value.filter(
    (c) => !passedSet.has(c.code) && !placedSet.has(c.code)
  );

  // Same numbers the "what you still owe" table on the plan screen shows
  // (`remainingRequirements` fed by `planTotals`), so the picker's grouping
  // and that table can never disagree about whether a bucket is still open.
  const { allCodes, totalFreeElectiveCredits } = planTotals(plan);
  const shortfalls = remainingRequirements(
    version,
    allCodes,
    plan.minorId,
    totalFreeElectiveCredits
  );
  const remainingByBucket = new Map(shortfalls.map((s) => [s.category.id, s.remaining]));

  function toSuggested(course: Course): SuggestedCourse {
    const missingPrerequisites = course.prerequisites.filter((p) => !earnedByEarlierTerm.has(p));
    return {
      code: course.code,
      title: course.title,
      credits: course.credits,
      bucket: bucketFor(version, plan.minorId, course),
      recommendedHere: recommendedCodesHere.has(course.code),
      missingPrerequisites,
    };
  }

  const suggestedByCode = new Map(available.map((c) => [c.code, toSuggested(c)]));

  // Group assignment, first match wins: recommended-here beats its own
  // bucket, and an already-satisfied bucket falls through to "other" rather
  // than keep advertising credits the student does not need.
  const byGroup = new Map<SuggestionGroupId, SuggestedCourse[]>();
  for (const suggested of suggestedByCode.values()) {
    let groupId: SuggestionGroupId;
    if (suggested.recommendedHere) {
      groupId = "recommended";
    } else if (suggested.bucket !== null && (remainingByBucket.get(suggested.bucket) ?? 0) > 0) {
      groupId = suggested.bucket;
    } else {
      groupId = "other";
    }
    const list = byGroup.get(groupId);
    if (list) list.push(suggested);
    else byGroup.set(groupId, [suggested]);
  }

  const byCode = (a: SuggestedCourse, b: SuggestedCourse) => (a.code < b.code ? -1 : 1);

  // Group order: "recommended" first, then buckets in the curriculum's own
  // category order, then "other" last. Empty groups are dropped rather than
  // returned with an empty course list, so the UI never has to special-case
  // "a group with nothing in it".
  const groups: SuggestionGroup[] = [];
  const recommendedCourses = byGroup.get("recommended");
  if (recommendedCourses?.length) {
    groups.push({ id: "recommended", remaining: 0, courses: [...recommendedCourses].sort(byCode) });
  }
  for (const category of version.categories) {
    const courses = byGroup.get(category.id);
    if (courses?.length) {
      groups.push({
        id: category.id,
        remaining: remainingByBucket.get(category.id) ?? 0,
        courses: [...courses].sort(byCode),
      });
    }
  }
  const otherCourses = byGroup.get("other");
  if (otherCourses?.length) {
    groups.push({ id: "other", remaining: 0, courses: [...otherCourses].sort(byCode) });
  }

  // Open slots: the recommended plan's placeholders for this term, minus the
  // ones the student has already effectively filled. A slot is "filled" when
  // the student has placed, in this same term, a course whose bucket matches
  // the slot's own bucket; slots are consumed one per matching placed course,
  // in the order they appear, because the recommended plan itself does not
  // distinguish "elective 1" from "elective 2" beyond their label.
  const thisTerm = plan.terms.find((t) => termIndex(t.term) === cutoff);
  const placedCoursesHere = (thisTerm?.codes ?? [])
    .map((code) => version.courses.value.find((c) => c.code === code))
    .filter((c): c is Course => c !== undefined);

  const placedBucketCounts = new Map<CategoryId, number>();
  for (const course of placedCoursesHere) {
    const bucket = bucketFor(version, plan.minorId, course);
    if (bucket === null) continue;
    placedBucketCounts.set(bucket, (placedBucketCounts.get(bucket) ?? 0) + 1);
  }

  const openSlots: OpenSlot[] = [];
  for (const entry of recommendedTerm?.entries ?? []) {
    if (entry.kind !== "placeholder") continue;

    // A placeholder names its own bucket directly, with one case that cannot
    // be resolved at all: the pooled `"minor"` category. A course carrying it
    // can be resolved through the chosen minor because a course code is a
    // thing `resolveMinorCategory` can look up; a placeholder carries only an
    // id and a label, which name a slot and not a course, so there is nothing
    // to look up. Such a slot genuinely means "one of your minor courses,
    // any bucket", so it is left unresolved here and its candidates are drawn
    // from all three minor buckets below. Current data has no such
    // placeholder, but leaving it to fall through to a free-elective-shaped
    // "any Thammasat course" message would be actively wrong if one appeared.
    const isPooledMinorSlot = entry.category === "minor";
    const slotBucket: CategoryId | null = isPooledMinorSlot ? null : entry.category;

    if (slotBucket !== null) {
      const remainingFillsThisBucket = placedBucketCounts.get(slotBucket) ?? 0;
      if (remainingFillsThisBucket > 0) {
        placedBucketCounts.set(slotBucket, remainingFillsThisBucket - 1);
        continue;
      }
    }

    // Candidates are just "available courses whose bucket matches the slot's
    // bucket", the same match used for group assignment above. This is
    // deliberately the whole rule, with no special case for free electives:
    // a free elective slot ordinarily has nothing to offer because the
    // catalogue holds no general list of Thammasat courses, so the match
    // naturally comes back empty. The one exception, PI574 counting as a
    // free elective from 2568 onward, needs no branch of its own either: it
    // simply is an available course whose bucket is freeElective, so it
    // shows up here the same way any other bucket match would.
    const matchesSlot = (s: SuggestedCourse): boolean =>
      isPooledMinorSlot
        ? s.bucket !== null && MINOR_BUCKETS.includes(s.bucket)
        : s.bucket === slotBucket;

    const candidates =
      slotBucket === null && !isPooledMinorSlot
        ? []
        : [...suggestedByCode.values()].filter(matchesSlot).sort(byCode);

    openSlots.push({ id: entry.id, label: entry.label, category: entry.category, candidates });
  }

  return { openSlots, groups };
}
