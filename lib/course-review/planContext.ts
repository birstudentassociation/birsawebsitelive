/**
 * The catalogue's view of a stored plan: the three "with my plan" filters and
 * the passed / planned tag on each card.
 *
 * Built once per plan from the same pieces the plan screen uses
 * (`remainingRequirements`, `planTotals`, the course graph), so the filters
 * cannot disagree with the "what you still owe" table or the course page's
 * panel. Pure, with the clock passed in; the browser loads this module only
 * for a visitor who has a plan, so the curriculum data it imports costs
 * everyone else nothing.
 *
 * Every answer is given for the student's own curriculum version. A catalogue
 * course is the 2568 course, so a student on an earlier curriculum is matched
 * through the graph's `counterparts`; a course their version has no
 * counterpart for is never offered as ready or as counting towards anything.
 */
import {
  CURRICULUM_VERSIONS,
  resolveMinorCategory,
  type CategoryId,
  type TermRef,
} from "@/content/curriculum";
import { counterparts, courseNode, prerequisites } from "@/lib/courses/graph";
import type { PlanMatcher } from "@/lib/course-review/filter";
import {
  allPrerequisitesMet,
  courseStatus,
  prerequisiteStates,
  type CourseStatus,
} from "@/lib/course-review/planPanel";
import { nextTerm, planTotals, remainingRequirements } from "@/lib/study-plan/derive";
import type { StudyPlan } from "@/lib/study-plan/plan";
import { derivePosition } from "@/lib/study-plan/position";

export type PlanContext = {
  matcher: PlanMatcher;
  /** Passed, planned (and when), or neither, for a catalogue code. */
  status: (code: string) => CourseStatus;
  /** The term "ready" was judged against, or null when the position could not be worked out. */
  nextTerm: TermRef | null;
};

export function buildPlanContext(plan: StudyPlan, now: Date): PlanContext {
  const versionId = plan.versionId;
  const version = CURRICULUM_VERSIONS[versionId];
  const position = derivePosition(plan.cohort, now)?.term ?? null;
  const next = position ? nextTerm(position) : null;

  const { allCodes, totalFreeElectiveCredits } = planTotals(plan);
  const stillShort = new Set<CategoryId>(
    remainingRequirements(version, allCodes, plan.minorId, totalFreeElectiveCredits)
      .filter((shortfall) => shortfall.remaining > 0)
      .map((shortfall) => shortfall.category.id)
  );

  const inVersion = (code: string): string | null => counterparts(code, versionId)[0] ?? null;

  return {
    nextTerm: next,
    status: (code) => {
      const own = inVersion(code);
      return own ? courseStatus(plan, own) : { kind: "none" };
    },
    matcher: {
      notPassed: (code) => {
        const own = inVersion(code);
        return !own || !plan.passed.includes(own);
      },
      ready: (code) => {
        const own = inVersion(code);
        if (!own) return false;
        return allPrerequisitesMet(prerequisiteStates(plan, prerequisites(own, versionId), next));
      },
      short: (code) => {
        const own = inVersion(code);
        const facts = own ? courseNode(own)?.versions[versionId] : undefined;
        if (!own || !facts || facts.excludedFromTotal) return false;
        const bucket =
          facts.category === "minor"
            ? resolveMinorCategory(version, plan.minorId, own)
            : facts.category;
        return bucket !== null && stillShort.has(bucket);
      },
    },
  };
}
