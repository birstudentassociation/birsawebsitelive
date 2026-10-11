/**
 * Asking for a review at the right moment: which courses in a stored plan
 * belong to the term that has just ended, so the plan screen and the course
 * page can offer "two minutes to help next year's students".
 *
 * Worked out from the plan and today's date alone, on the device. Nothing is
 * sent anywhere and nothing is recorded about who was asked: whether a prompt
 * was dismissed is kept in the stored plan envelope (`dismissedReviewPrompts`
 * in `plan.ts`), which never leaves the browser.
 *
 * "Just ended" is the most recent completed term, taken from `academicTermAt`
 * so the site has one answer to "what term is it now". The summer session is
 * the one exception: most students do not take one, so when the term just
 * gone is a summer and the plan holds nothing in it, the term before it
 * (semester 2) counts as the one that just ended. Without that, a student
 * whose courses were all in semester 2 would be asked only during June and
 * July, and never once semester 1 began. Only that one term is ever offered,
 * so "last term" in the prompt stays true.
 *
 * `now` is always a parameter, never read from inside this module, so every
 * rule here is testable without mocking the clock. Light enough for the
 * browser: it imports neither the curriculum nor the course graph.
 */
import type { TermKind, TermRef } from "@/content/curriculum";
import type { StudyPlan } from "@/lib/study-plan/plan";
import { academicTermAt, type AcademicTerm } from "@/lib/study-plan/position";

/** Most prompts shown at once. A term can hold many courses, and a wall of requests is a nag. */
export const MAX_REVIEW_PROMPTS = 3;

const KIND_ORDER: readonly TermKind[] = ["semester1", "semester2", "summer"];

/** Terms in sequence: semester 1, semester 2 and summer of one academic year, then the next year's semester 1. */
function ordinal(term: AcademicTerm): number {
  return term.academicYear * KIND_ORDER.length + KIND_ORDER.indexOf(term.kind);
}

function fromOrdinal(n: number): AcademicTerm {
  return {
    academicYear: Math.floor(n / KIND_ORDER.length),
    kind: KIND_ORDER[n % KIND_ORDER.length]!,
  };
}

/** The calendar term a plan's term falls in: study year 1 is the year of entry. */
export function academicTermOf(plan: StudyPlan, term: TermRef): AcademicTerm {
  return { academicYear: plan.startYear + term.year - 1, kind: term.kind };
}

/** Course codes the plan places in a calendar term, from every entry that falls in it. */
function codesIn(plan: StudyPlan, academic: AcademicTerm): string[] {
  return plan.terms
    .filter((planned) => ordinal(academicTermOf(plan, planned.term)) === ordinal(academic))
    .flatMap((planned) => planned.codes);
}

/**
 * The term that has just ended, and the plan's courses in it. Null when the
 * plan has nothing in that term (or the term is before the plan's first).
 */
export function justEndedTerm(
  plan: StudyPlan,
  now: Date
): { term: AcademicTerm; codes: string[] } | null {
  const current = ordinal(academicTermAt(now));
  const previous = fromOrdinal(current - 1);
  const previousCodes = codesIn(plan, previous);
  if (previousCodes.length > 0) return { term: previous, codes: previousCodes };
  if (previous.kind !== "summer") return null;
  const before = fromOrdinal(current - 2);
  const beforeCodes = codesIn(plan, before);
  return beforeCodes.length > 0 ? { term: before, codes: beforeCodes } : null;
}

/**
 * The courses to ask about: those in the term that just ended, in the order
 * the plan lists them, without the ones the student has dismissed, and at most
 * `MAX_REVIEW_PROMPTS`.
 */
export function reviewPromptCodes(
  plan: StudyPlan,
  now: Date,
  dismissed: readonly string[] = []
): string[] {
  const ended = justEndedTerm(plan, now);
  if (!ended) return [];
  const unique = [...new Set(ended.codes)];
  return unique.filter((code) => !dismissed.includes(code)).slice(0, MAX_REVIEW_PROMPTS);
}
