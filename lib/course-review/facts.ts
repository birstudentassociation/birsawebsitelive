/**
 * Fixed, objective course facts derived from the 2568 curriculum data
 * (prerequisites, what a course unlocks, recommended terms, minors). Nothing
 * here is written by hand per course, so it cannot drift from the curriculum.
 * Prerequisite and unlock links only ever name codes that exist in the
 * course-review catalogue, so every returned code has a page to link to.
 */
import { courses } from "@/content/course-review/courses";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import type {
  Course as CurriculumCourse,
  LocalizedText,
  MinorId,
  TermRef,
} from "@/content/curriculum/types";

const curriculum = CURRICULUM_VERSIONS["2568"];

const catalogueCodes = new Set(courses.map((course) => course.code));

const curriculumCourses = new Map(curriculum.courses.value.map((course) => [course.code, course]));

/** The 2568 curriculum entry for a course code, if the curriculum lists it. */
export function curriculumCourse(code: string): CurriculumCourse | undefined {
  return curriculumCourses.get(code);
}

/** Codes of the courses that must be passed first, limited to catalogue courses. */
export function prerequisiteCodes(code: string): string[] {
  return (curriculumCourse(code)?.prerequisites ?? []).filter((c) => catalogueCodes.has(c));
}

/** Sorted codes of catalogue courses that list this course as a prerequisite. */
export function unlocks(code: string): string[] {
  return curriculum.courses.value
    .filter((course) => course.prerequisites.includes(code) && catalogueCodes.has(course.code))
    .map((course) => course.code)
    .sort();
}

/** Every term in the recommended plan that names this course. */
export function recommendedTerms(code: string): TermRef[] {
  return curriculum.recommendedPlan.value
    .filter((planned) =>
      planned.entries.some((entry) => entry.kind === "course" && entry.code === code)
    )
    .map((planned) => planned.term);
}

/** The minors a course counts towards, and whether it is required or elective there. */
export function minorsFor(
  code: string
): { id: MinorId; name: LocalizedText; role: "required" | "elective" }[] {
  const result: { id: MinorId; name: LocalizedText; role: "required" | "elective" }[] = [];
  for (const minor of curriculum.minors) {
    if (minor.required.includes(code)) {
      result.push({ id: minor.id, name: minor.name, role: "required" });
    } else if (minor.electives.includes(code)) {
      result.push({ id: minor.id, name: minor.name, role: "elective" });
    }
  }
  return result;
}
