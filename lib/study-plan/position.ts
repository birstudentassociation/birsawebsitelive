/**
 * Deriving where a student is right now: which study year, which term.
 *
 * The cohort code names when the student started; the current instant names
 * where the calendar is. Together they answer "what term is this student in
 * today", which is what lets the journey skip straight to filling in a
 * position rather than asking the student to work it out themselves.
 *
 * `now` is always a parameter, never read from inside this module, so every
 * rule here is testable without mocking the clock.
 */
import type { TermKind, TermRef } from "@/content/curriculum";
import { startYearFromCohort } from "@/lib/study-plan/plan";

/** Which term of which Thai academic year an instant falls in. */
export type AcademicTerm = { academicYear: number; kind: TermKind };

export type DerivedPosition = {
  term: TermRef;
  /** The academic term the derivation was made from, e.g. { academicYear: 2569, kind: "semester1" }. */
  now: AcademicTerm;
  /** True when the raw study year exceeded 8 and `term.year` was clamped to 8. */
  clamped: boolean;
};

/**
 * Resolves the Asia/Bangkok calendar month for an instant, independent of the
 * host timezone. Follows the same `Intl.DateTimeFormat` + `formatToParts`
 * convention as `getBangkokParts` in lib/shuttle.ts, rather than trusting
 * `Date`'s local getters, which read whatever timezone the host happens to
 * be in.
 */
function bangkokYearMonth(now: Date): { year: number; month: number } {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
  });
  const parts = formatter.formatToParts(now);
  const lookup = new Map(parts.map((p) => [p.type, p.value]));
  return {
    year: Number(lookup.get("year") ?? "0"),
    month: Number(lookup.get("month") ?? "0"),
  };
}

/**
 * Thammasat's academic year runs from August. A calendar month therefore maps
 * to one of three bands:
 *
 * - August to December: semester 1 of the academic year that starts this
 *   Gregorian year.
 * - January to May: semester 2 of the academic year that started the
 *   *previous* Gregorian year.
 * - June to July: the summer session that closes out that same academic
 *   year.
 *
 * Semester 2 and the summer session of academic year N therefore fall in the
 * Gregorian year after the one semester 1 fell in, which is why their
 * Buddhist-Era academic year is one behind the calendar year they are
 * actually in.
 */
export function academicTermAt(now: Date): AcademicTerm {
  const { year, month } = bangkokYearMonth(now);
  const buddhistYear = year + 543;

  if (month >= 8) {
    return { academicYear: buddhistYear, kind: "semester1" };
  }
  if (month <= 5) {
    return { academicYear: buddhistYear - 1, kind: "semester2" };
  }
  return { academicYear: buddhistYear - 1, kind: "summer" };
}

/**
 * Derives a student's current study year and term from their cohort code and
 * the current instant. Returns null when the cohort is not a usable
 * two-digit code, or when the derived study year has not started yet (a
 * negative or zero study year is not a position, it is a student who has not
 * enrolled), leaving the caller to decide what to show in that case.
 *
 * The study year is capped at 8, matching the schema's cap in
 * lib/study-plan/plan.ts (`TermRef.year` maxes out at 8, so a plan can
 * represent breaking the seven-year limit and be told about it). A student
 * genuinely further along than that is still reported at year 8, with
 * `clamped` set so the caller can surface the finding rather than silently
 * losing it.
 */
export function derivePosition(cohort: string, now: Date): DerivedPosition | null {
  if (!/^\d{2}$/.test(cohort)) return null;

  const nowTerm = academicTermAt(now);
  const studyYear = nowTerm.academicYear - startYearFromCohort(cohort) + 1;

  if (studyYear < 1) return null;

  const clamped = studyYear > 8;
  const term: TermRef = { year: clamped ? 8 : studyYear, kind: nowTerm.kind };

  return { term, now: nowTerm, clamped };
}
