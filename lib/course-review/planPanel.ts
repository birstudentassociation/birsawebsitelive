/**
 * What a course page can say about a course given the student's stored plan:
 * where it sits in the plan, what it counts towards for this student, whether
 * its prerequisites are in hand, and where it could be added.
 *
 * Pure functions over the plan and the course graph, with no React and no
 * storage, so the derivations are testable without a browser. The panel in
 * `components/course-review/YourPlanPanel.tsx` only reads the plan and
 * renders what this returns.
 *
 * Everything is answered in the student's own curriculum version. A course
 * page describes the latest version that lists the code, but the student's
 * plan holds the codes of theirs, so the page's code is first resolved through
 * the graph's `counterparts` (`PO211` on the page, `PI211` in the plan). A
 * course with no counterpart in the student's version is reported as not being
 * in their curriculum rather than being judged against another version's
 * rules.
 *
 * Nothing here blocks anything. A prerequisite that is not met is reported,
 * and the "Add to plan" link is still offered, because the plan screen's
 * findings are where that is raised and the service never refuses a plan (see
 * `lib/study-plan/findings.ts`).
 */
import {
  CURRICULUM_VERSIONS,
  resolveMinorCategory,
  type CategoryId,
  type CurriculumVersionId,
  type TermRef,
} from "@/content/curriculum";
import { counterparts, courseNode, prerequisites, recommendedIn } from "@/lib/courses/graph";
import { addableTerms, termIndex } from "@/lib/study-plan/derive";
import type { StudyPlan } from "@/lib/study-plan/plan";
import { derivePosition } from "@/lib/study-plan/position";

/** Where one course stands in a plan. */
export type CourseStatus =
  { kind: "passed" } | { kind: "planned"; term: TermRef } | { kind: "none" };

/** Whether one prerequisite is in hand, judged against the term the course sits in or would be added to. */
export type PrerequisiteState =
  | { code: string; state: "passed" }
  | { code: string; state: "plannedEarlier"; term: TermRef }
  /** Planned, but in the same term as the course or after it, so it does not satisfy the prerequisite. */
  | { code: string; state: "plannedLater"; term: TermRef }
  | { code: string; state: "notMet" };

export type PlanPanelView = {
  versionId: CurriculumVersionId;
  /** The code in the student's version, or null if that version has neither the code nor a counterpart. */
  versionCode: string | null;
  status: CourseStatus;
  /** The requirement bucket the course counts towards for this student, null when it counts towards none. */
  counts: { bucket: CategoryId; excludedFromTotal: boolean } | null;
  prerequisites: PrerequisiteState[];
  /** True when every prerequisite is passed or planned in an earlier term. Vacuously true with none. */
  prerequisitesMet: boolean;
  /** The term the prerequisites were judged against: where the course is planned, else the suggestion. */
  referenceTerm: TermRef | null;
  /** Where "Add to plan" would put the course. Null once it is passed or planned, or when no term fits. */
  suggestedTerm: TermRef | null;
};

/** Passed, planned (and in which term), or neither. Passed wins if a tampered plan has both. */
export function courseStatus(plan: StudyPlan, code: string): CourseStatus {
  if (plan.passed.includes(code)) return { kind: "passed" };
  const planned = plan.terms.find((t) => t.codes.includes(code));
  return planned ? { kind: "planned", term: planned.term } : { kind: "none" };
}

/**
 * Each prerequisite's state against a reference term. A planned prerequisite
 * only counts when its term is strictly earlier, matching `checkPlan` and
 * `suggestForTerm`: a course beside its own prerequisite in the same term has
 * not had it satisfied yet. A null reference means "after everything already
 * planned", which is what adding a course with no particular term amounts to.
 */
export function prerequisiteStates(
  plan: StudyPlan,
  codes: readonly string[],
  reference: TermRef | null
): PrerequisiteState[] {
  const before = reference ? termIndex(reference) : Number.POSITIVE_INFINITY;
  return codes.map((code): PrerequisiteState => {
    const status = courseStatus(plan, code);
    if (status.kind === "passed") return { code, state: "passed" };
    if (status.kind === "planned") {
      return termIndex(status.term) < before
        ? { code, state: "plannedEarlier", term: status.term }
        : { code, state: "plannedLater", term: status.term };
    }
    return { code, state: "notMet" };
  });
}

/** Whether every prerequisite is passed or planned earlier. */
export function allPrerequisitesMet(states: readonly PrerequisiteState[]): boolean {
  return states.every((s) => s.state === "passed" || s.state === "plannedEarlier");
}

/**
 * The term a course would be added to. Only terms the plan screen would
 * accept (`addableTerms`) are considered, so the link built from this never
 * lands on a refusal. In order of preference:
 *
 * 1. The student's version recommends it for a term still ahead, so the
 *    earliest such term.
 * 2. Its recommended term has passed, so the next term of the same kind
 *    (semester 1 courses go to the next semester 1).
 * 3. It has no recommended term, or no term of its kind is on offer, so the
 *    next ordinary semester after the student's position. Summer is skipped
 *    here because nothing says the course runs then. The service does not
 *    know which terms a course runs in (see `checkPlan`), so this is where it
 *    could be planned, not where it will be taught.
 */
export function suggestTerm(
  versionCode: string,
  plan: StudyPlan,
  position: TermRef | null
): TermRef | null {
  if (!position) return null;
  const version = CURRICULUM_VERSIONS[plan.versionId];
  const candidates = addableTerms(version, plan, position).sort(
    (a, b) => termIndex(a) - termIndex(b)
  );
  const cutoff = termIndex(position);
  const recommended = recommendedIn(versionCode, plan.versionId);

  const ahead = candidates.find((term) =>
    recommended.some((r) => termIndex(r) === termIndex(term))
  );
  if (ahead) return ahead;

  const kinds = new Set(recommended.map((r) => r.kind));
  const sameKind = candidates.find((term) => termIndex(term) > cutoff && kinds.has(term.kind));
  if (sameKind) return sameKind;

  return candidates.find((term) => termIndex(term) > cutoff && term.kind !== "summer") ?? null;
}

/** Derives everything the panel shows for one course page. */
export function derivePlanPanel(code: string, plan: StudyPlan, now: Date): PlanPanelView {
  const versionId = plan.versionId;
  const versionCode = counterparts(code, versionId)[0] ?? null;
  if (!versionCode) {
    return {
      versionId,
      versionCode: null,
      status: { kind: "none" },
      counts: null,
      prerequisites: [],
      prerequisitesMet: true,
      referenceTerm: null,
      suggestedTerm: null,
    };
  }

  const status = courseStatus(plan, versionCode);
  const position = derivePosition(plan.cohort, now)?.term ?? null;
  const suggestedTerm = status.kind === "none" ? suggestTerm(versionCode, plan, position) : null;
  const referenceTerm = status.kind === "planned" ? status.term : suggestedTerm;
  const states = prerequisiteStates(plan, prerequisites(versionCode, versionId), referenceTerm);

  const facts = courseNode(versionCode)?.versions[versionId];
  const version = CURRICULUM_VERSIONS[versionId];
  let bucket: CategoryId | null = null;
  if (facts) {
    bucket =
      facts.category === "minor"
        ? resolveMinorCategory(version, plan.minorId, versionCode)
        : facts.category;
  }

  return {
    versionId,
    versionCode,
    status,
    counts:
      bucket && facts ? { bucket, excludedFromTotal: facts.excludedFromTotal === true } : null,
    prerequisites: states,
    prerequisitesMet: allPrerequisitesMet(states),
    referenceTerm,
    suggestedTerm,
  };
}
