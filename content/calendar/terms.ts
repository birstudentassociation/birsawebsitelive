/**
 * Teaching terms with published dates, used by the calendar builder to repeat
 * a student's weekly classes. Only terms with published dates are listed;
 * no dates are inferred.
 *
 * Semester 1/2569 uses the Registrar's dates (3 August to 21 November 2026).
 * BIR announces its own semester 1 dates separately, on birpolsci.com and the
 * BIR Program Facebook page, so these may differ slightly for BIR students.
 * Semester 2/2569 dates are BIR's own, from the BIR timetable post.
 */
import type { AcademicTerm } from "@/content/course-review/types";
import type { SourceId } from "@/content/curriculum/sources";

export type TeachingTerm = {
  term: AcademicTerm;
  /** First day of teaching, `YYYY-MM-DD`. */
  start: string;
  /** Last day of teaching, `YYYY-MM-DD`. */
  end: string;
  source: SourceId;
};

export const teachingTerms: TeachingTerm[] = [
  {
    term: { year: 2569, semester: 1 },
    start: "2026-08-03",
    end: "2026-11-21",
    source: "registrarCalendar2569",
  },
  {
    term: { year: 2569, semester: 2 },
    start: "2027-01-04",
    end: "2027-05-01",
    source: "courseOffering2026S2",
  },
];

/** How close to a term's end, in days, the next term becomes the default. */
export const NEXT_TERM_WITHIN_DAYS = 28;

/** The key of a term, `<BE year>-<semester>`, e.g. `2569-2`. */
export function termKeyOf(term: TeachingTerm): string {
  return `${term.term.year}-${term.term.semester}`;
}

function sortedTerms(): TeachingTerm[] {
  return [...teachingTerms].sort((a, b) => a.start.localeCompare(b.start));
}

/**
 * The term containing `todayKey` (`YYYY-MM-DD`, Bangkok), else the earliest
 * term starting after it, else null.
 */
export function currentOrNextTeachingTerm(todayKey: string): TeachingTerm | null {
  return sortedTerms().find((t) => t.end >= todayKey) ?? null;
}

/** Terms that are current or still to come, earliest first. */
export function currentAndUpcomingTerms(todayKey: string): TeachingTerm[] {
  return sortedTerms().filter((t) => t.end >= todayKey);
}

function dayNumber(key: string): number {
  const [y = 0, m = 1, d = 1] = key.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

/**
 * The term a student most likely wants: the current one, unless it ends
 * within `NEXT_TERM_WITHIN_DAYS` days of `todayKey` and a next term exists,
 * then the next. Before any term starts, the first; after all end, null.
 */
export function defaultTeachingTerm(todayKey: string): TeachingTerm | null {
  const open = currentAndUpcomingTerms(todayKey);
  const current = open[0];
  if (!current) return null;
  const next = open[1];
  const started = current.start <= todayKey;
  if (started && next && dayNumber(current.end) - dayNumber(todayKey) <= NEXT_TERM_WITHIN_DAYS) {
    return next;
  }
  return current;
}
