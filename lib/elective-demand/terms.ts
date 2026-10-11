/**
 * Academic terms as the elective demand signal sees them: a term a student
 * planned a course for, named by Buddhist Era academic year and semester, the
 * same shape the course review collection uses (`AcademicTerm`).
 *
 * A plan names a term by study year ("Year 3, Semester 1"), which means
 * different calendar terms for different cohorts. Demand only adds up across
 * students once every plan is turned into the calendar term it falls in, so
 * the conversion lives here. The summer session closes out the academic year
 * that began the previous August (see `academicTermAt` in
 * lib/study-plan/position.ts), so year N's summer belongs to the same academic
 * year as year N's semesters.
 */
import type { AcademicTerm } from "@/content/course-review/types";
import type { TermKind, TermRef } from "@/content/curriculum";
import type { Locale } from "@/lib/i18n";
import { termYearLabel } from "@/lib/course-review/terms";

const SEMESTER_OF: Record<TermKind, AcademicTerm["semester"]> = {
  semester1: 1,
  semester2: 2,
  summer: "summer",
};

/** The calendar term a plan's study-year term falls in, for a student who started in `startYear` (Buddhist Era). */
export function academicTermOf(startYear: number, term: TermRef): AcademicTerm {
  return { year: startYear + term.year - 1, semester: SEMESTER_OF[term.kind] };
}

/** Earlier terms sort first: within a year, semester 1, then semester 2, then summer. */
export function termOrder(term: AcademicTerm): number {
  return term.year * 4 + (term.semester === "summer" ? 3 : term.semester);
}

const SEMESTER_NAMES: Record<Locale, Record<"1" | "2" | "summer", string>> = {
  en: { "1": "Semester 1", "2": "Semester 2", summer: "Summer" },
  th: { "1": "ภาคเรียนที่ 1", "2": "ภาคเรียนที่ 2", summer: "ภาคฤดูร้อน" },
};

/** A term in words: "Semester 1, 2026/27" in English, "ภาคเรียนที่ 1 ปีการศึกษา 2569" in Thai. */
export function academicTermLabel(term: AcademicTerm, locale: Locale): string {
  const semester = SEMESTER_NAMES[locale][String(term.semester) as "1" | "2" | "summer"];
  const year = termYearLabel(term, locale);
  return locale === "th" ? `${semester} ปีการศึกษา ${year}` : `${semester}, ${year}`;
}
