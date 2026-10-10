/**
 * Academic terms as the course review collection sees them: which terms a
 * student may write about, and when a published review counts as dated.
 *
 * Built on `academicTermAt` in lib/study-plan/position.ts, so "what term is it
 * now" has one answer across the site. `now` is always a parameter, never read
 * from inside this module, so every rule here is testable without mocking the
 * clock.
 */
import type { AcademicTerm } from "@/content/course-review/types";
import { academicTermAt } from "@/lib/study-plan/position";

/** A review from more than this many academic years ago is shown as dated. */
export const DATED_AFTER_YEARS = 3;

/**
 * How many terms back the submission form offers: three academic years of
 * three terms each. Matches `DATED_AFTER_YEARS`, so a review is never dated
 * on the day it is written.
 */
export const RECENT_TERM_COUNT = DATED_AFTER_YEARS * 3;

const SEMESTERS: AcademicTerm["semester"][] = [1, 2, "summer"];

/** The term the calendar is in at `now`, in the review catalogue's own shape. */
export function currentTerm(now: Date): AcademicTerm {
  const { academicYear, kind } = academicTermAt(now);
  const semester = kind === "semester1" ? 1 : kind === "semester2" ? 2 : "summer";
  return { year: academicYear, semester };
}

/** The term immediately before `term`: semester 1, semester 2, summer, then semester 1 of the next year. */
function previousTerm(term: AcademicTerm): AcademicTerm {
  const index = SEMESTERS.indexOf(term.semester);
  if (index === 0) return { year: term.year - 1, semester: "summer" };
  return { year: term.year, semester: SEMESTERS[index - 1]! };
}

/** A term as a form value and a URL-safe key, e.g. "2567-1" or "2567-summer". */
export function termKey(term: AcademicTerm): string {
  return `${term.year}-${term.semester}`;
}

/** The term a key names, or null for anything `termKey` could not have produced. */
export function parseTermKey(key: string): AcademicTerm | null {
  const match = /^(\d{4})-(1|2|summer)$/.exec(key);
  if (!match) return null;
  const semester = match[2] === "summer" ? "summer" : (Number(match[2]) as 1 | 2);
  return { year: Number(match[1]), semester };
}

/**
 * The academic year as readers of each language expect it: Thai uses the
 * Buddhist Era year ("2567"), English the Gregorian span ("2024/25").
 */
export function termYearLabel(term: AcademicTerm, locale: "en" | "th"): string {
  if (locale === "th") return String(term.year);
  const start = term.year - 543;
  return `${start}/${String(start + 1).slice(-2)}`;
}

/**
 * The terms a student may write about, newest first. The term in progress is
 * left out, because a student cannot yet say how its assessment went.
 */
export function recentTerms(now: Date): AcademicTerm[] {
  const terms: AcademicTerm[] = [];
  let term = previousTerm(currentTerm(now));
  for (let i = 0; i < RECENT_TERM_COUNT; i += 1) {
    terms.push(term);
    term = previousTerm(term);
  }
  return terms;
}

/** True when `term` is one the submission form offers at `now`. */
export function isRecentTerm(term: AcademicTerm, now: Date): boolean {
  return recentTerms(now).some((candidate) => termKey(candidate) === termKey(term));
}

/**
 * True when a review of `term` is more than `DATED_AFTER_YEARS` academic years
 * old at `now`. Counted in academic years, so a review from three academic
 * years ago is still current for the whole of this one.
 */
export function isDated(term: AcademicTerm, now: Date): boolean {
  return currentTerm(now).year - term.year > DATED_AFTER_YEARS;
}
