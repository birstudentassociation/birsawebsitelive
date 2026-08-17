/**
 * Shaping a plan for the print page, which has to be honest about what the
 * service actually knows.
 *
 * `StudyPlan.passed` is a flat list with no term attribution: the service
 * never records which term a passed course was taken in, because the
 * recommended plan it would otherwise infer that from is an assumption, not
 * a record (see `assumedHistory` in derive.ts). Grouping passed courses by
 * term on the print page would mean presenting that guess as fact, which is
 * the one thing this service is built not to do. So passed courses are
 * listed flat, and only the terms the student actually built
 * (`plan.terms`, which do carry real term attribution) are grouped.
 */
import { termIndex } from "./derive";
import type { PlannedCourseTerm } from "./plan";
import type { CurriculumVersion, TermRef } from "@/content/curriculum";

export type PrintCourse = { code: string; title: string; credits: number };

export type PrintTerm = {
  term: TermRef;
  courses: PrintCourse[];
  freeElectiveCredits: number;
};

/** Looks up title and credits for each code, tolerating a code with no catalogue entry rather than dropping it. */
export function coursesForPrint(version: CurriculumVersion, codes: string[]): PrintCourse[] {
  const byCode = new Map(version.courses.value.map((c) => [c.code, c]));
  return codes.map((code) => {
    const course = byCode.get(code);
    return { code, title: course?.title ?? "", credits: course?.credits ?? 0 };
  });
}

/**
 * Every course the student has passed, sorted by code. Not grouped by term:
 * see this module's header comment for why.
 */
export function passedCoursesForPrint(version: CurriculumVersion, passed: string[]): PrintCourse[] {
  return coursesForPrint(version, passed).sort((a, b) => a.code.localeCompare(b.code));
}

/**
 * The plan's future terms, in order, dropping any term the student has
 * touched but left with nothing in it (no courses, no free elective
 * credits): an empty term is noise on a document meant to be read away from
 * the service.
 */
export function plannedTermsForPrint(
  version: CurriculumVersion,
  terms: PlannedCourseTerm[]
): PrintTerm[] {
  return terms
    .filter((t) => t.codes.length > 0 || t.freeElectiveCredits > 0)
    .sort((a, b) => termIndex(a.term) - termIndex(b.term))
    .map((t) => ({
      term: t.term,
      courses: coursesForPrint(version, t.codes),
      freeElectiveCredits: t.freeElectiveCredits,
    }));
}
