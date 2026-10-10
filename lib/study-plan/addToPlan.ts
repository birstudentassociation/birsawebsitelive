/**
 * Adding a course to a plan from a link, as the course pages do.
 *
 * A course page cannot edit the plan, which lives on the student's device, so
 * its "Add to plan" button is a link to the plan screen carrying the plan, a
 * course code and a term (`?plan=...&add=PI380&term=3-semester1`). The plan
 * screen applies it before rendering with `applyAddParam` below, shows a
 * confirmation with an undo, and carries on as normal.
 *
 * Nothing in the URL is trusted. The code and the term are re-validated here
 * against the plan's own curriculum version, and anything that does not hold
 * up is refused with a reason rather than applied or thrown on, so a stale
 * link, a hand-edited link or a link from a course page open in another tab
 * leaves the plan exactly as it was and tells the student why.
 *
 * Like the rest of the service this never blocks on a finding: a course whose
 * prerequisite is missing is still added, and the findings list says so.
 */
import { CURRICULUM_VERSIONS, type TermKind, type TermRef } from "@/content/curriculum";
import { counterparts, hasPage } from "@/lib/courses/graph";
import { addableTerms, clearInternshipSummers, termIndex } from "@/lib/study-plan/derive";
import {
  MAX_CODES_PER_TERM,
  MAX_TERMS,
  type PlannedCourseTerm,
  type StudyPlan,
} from "@/lib/study-plan/plan";

/** Query parameter naming the course to add. The term is named by the plan screen's own `term` parameter. */
export const ADD_PARAM = "add";

/** Why a link's add was not applied. Each maps to one explanatory notice on the plan screen. */
export type AddRefusal =
  /** No curriculum version lists the code, or it is not shaped like a code. */
  | "unknownCourse"
  /** Some version lists the code, but the student's version has neither it nor a counterpart. */
  | "notInVersion"
  | "alreadyPassed"
  | "alreadyPlanned"
  /** The term key is missing or malformed. */
  | "badTerm"
  /** The term is before the student's current term. */
  | "pastTerm"
  /** A well-formed term the plan screen does not offer, such as one beyond the seven-year limit. */
  | "unavailableTerm"
  | "termFull"
  | "tooManyTerms"
  /** The change would break the internship-is-the-whole-summer rule. */
  | "internshipTerm";

export type AddResult =
  | {
      status: "added";
      plan: StudyPlan;
      /** The code actually added: the student's version's counterpart when the link named another version's. */
      code: string;
      /** The code the link named, when it differs from `code`. */
      requestedCode?: string;
      term: TermRef;
    }
  | { status: "refused"; reason: AddRefusal; code: string; term?: TermRef };

const TERM_KINDS: readonly TermKind[] = ["semester1", "semester2", "summer"];

/** Parses the plan screen's term key, e.g. "3-semester1". Null for anything else. */
export function parseTermKey(key: unknown): TermRef | null {
  if (typeof key !== "string") return null;
  const match = /^([1-8])-(semester1|semester2|summer)$/.exec(key);
  if (!match) return null;
  const kind = TERM_KINDS.find((candidate) => candidate === match[2]);
  return kind ? { year: Number(match[1]), kind } : null;
}

/** "pi 380" and " PI380 " both name PI380. Null for anything that is not shaped like a course code. */
export function normaliseCodeParam(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const match = /^([a-z]{2,4})\s?(\d{3})$/i.exec(raw.trim());
  return match ? `${match[1]}${match[2]}`.toUpperCase() : null;
}

/**
 * Applies `?add=CODE&term=KEY` to a plan. `position` is where the student is
 * now, so a term before it is refused: the past is not something a link may
 * rewrite. The input plan is never mutated.
 */
export function applyAddParam(
  plan: StudyPlan,
  rawCode: unknown,
  rawTerm: unknown,
  position: TermRef
): AddResult {
  const requested = normaliseCodeParam(rawCode);
  if (!requested) {
    return {
      status: "refused",
      reason: "unknownCourse",
      code: typeof rawCode === "string" ? rawCode.trim().slice(0, 12) : "",
    };
  }

  const term = parseTermKey(rawTerm);
  if (!term) return { status: "refused", reason: "badTerm", code: requested };

  const resolved = counterparts(requested, plan.versionId)[0];
  if (!resolved) {
    return {
      status: "refused",
      reason: hasPage(requested) ? "notInVersion" : "unknownCourse",
      code: requested,
      term,
    };
  }

  if (plan.passed.includes(resolved)) {
    return { status: "refused", reason: "alreadyPassed", code: resolved, term };
  }
  if (plan.terms.some((t) => t.codes.includes(resolved))) {
    return { status: "refused", reason: "alreadyPlanned", code: resolved, term };
  }

  if (termIndex(term) < termIndex(position)) {
    return { status: "refused", reason: "pastTerm", code: resolved, term };
  }
  const version = CURRICULUM_VERSIONS[plan.versionId];
  if (!addableTerms(version, plan, position).some((t) => termIndex(t) === termIndex(term))) {
    return { status: "refused", reason: "unavailableTerm", code: resolved, term };
  }

  const index = plan.terms.findIndex((t) => termIndex(t.term) === termIndex(term));
  let terms: PlannedCourseTerm[];
  if (index === -1) {
    if (plan.terms.length >= MAX_TERMS) {
      return { status: "refused", reason: "tooManyTerms", code: resolved, term };
    }
    terms = [...plan.terms, { term, codes: [resolved], freeElectiveCredits: 0 }];
  } else {
    if ((plan.terms[index]?.codes.length ?? 0) >= MAX_CODES_PER_TERM) {
      return { status: "refused", reason: "termFull", code: resolved, term };
    }
    terms = plan.terms.map((t, i) => (i === index ? { ...t, codes: [...t.codes, resolved] } : t));
  }

  // The plan screen quietly clears whatever sits beside an internship, so a
  // link that would trigger that is refused instead of deleting the student's
  // other courses without a word.
  const edited = terms.filter((t) => termIndex(t.term) === termIndex(term));
  const cleared = clearInternshipSummers(version, edited);
  if (JSON.stringify(cleared) !== JSON.stringify(edited)) {
    return { status: "refused", reason: "internshipTerm", code: resolved, term };
  }

  return {
    status: "added",
    plan: { ...plan, terms },
    code: resolved,
    requestedCode: resolved === requested ? undefined : requested,
    term,
  };
}
