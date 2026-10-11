/**
 * Registration and add-drop dates for the terms in a plan.
 *
 * The activity calendar (`content/calendar/events.ts`) holds a window only
 * when an entry carries the `academic` field naming the window and the term it
 * is for. Nothing is derived or assumed here: BIR is a special programme whose
 * dates BIRSA announces itself, so a term with no tagged entry has no dates
 * and the plan screen says so rather than offering the Registrar's regular
 * programme windows. Adding the entries is a content change (see
 * docs/EDITING.md); this module and the export route pick them up unchanged.
 *
 * The term list travels in the query of the export link as `terms`, for
 * example `2569-1,2569-2,2569-summer`. It is untrusted input: unknown or
 * malformed terms are dropped, repeats are folded and the list is capped.
 */
import type { AcademicTerm } from "@/content/course-review/types";
import type { CalendarEvent } from "@/content/calendar/events";
import { parseTermKey, termKey } from "@/lib/course-review/terms";
import { academicTermOf, termOrder } from "@/lib/elective-demand/terms";
import type { StudyPlan } from "@/lib/study-plan/plan";

/** Name of the query parameter that carries the term list. */
export const TERMS_PARAM = "terms";

/** The most terms one export may name: more than any plan holds (see `MAX_TERMS`). */
export const MAX_EXPORT_TERMS = 24;

/**
 * The calendar terms a plan has something planned in, earliest first. A term
 * the student opened but left empty is not one they will register for.
 */
export function plannedAcademicTerms(plan: StudyPlan): AcademicTerm[] {
  const terms = new Map<string, AcademicTerm>();
  for (const planned of plan.terms) {
    if (planned.codes.length === 0 && planned.freeElectiveCredits === 0) continue;
    const term = academicTermOf(plan.startYear, planned.term);
    terms.set(termKey(term), term);
  }
  return [...terms.values()].sort((a, b) => termOrder(a) - termOrder(b));
}

/** The terms as one query value, e.g. `2569-1,2569-summer`. */
export function encodeTermsParam(terms: readonly AcademicTerm[]): string {
  return terms.map(termKey).join(",");
}

/** The valid terms a query value names, once each, in the order given. Never throws. */
export function parseTermsParam(value: string | null | undefined): AcademicTerm[] {
  if (!value) return [];
  const terms = new Map<string, AcademicTerm>();
  for (const part of value.split(",")) {
    const term = parseTermKey(part.trim());
    if (term) terms.set(termKey(term), term);
    if (terms.size >= MAX_EXPORT_TERMS) break;
  }
  return [...terms.values()];
}

/**
 * The calendar's registration and add-drop windows for these terms, earliest
 * first. An event without the `academic` field is never returned, however
 * close its date or its title.
 */
export function registrationEventsFor(
  events: readonly CalendarEvent[],
  terms: readonly AcademicTerm[]
): CalendarEvent[] {
  const wanted = new Set(terms.map(termKey));
  return events
    .filter((event) => event.academic && wanted.has(termKey(event.academic.term)))
    .sort((a, b) => a.start.localeCompare(b.start) || a.id.localeCompare(b.id));
}
