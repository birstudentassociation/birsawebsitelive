/**
 * Fixed, objective course facts for the course-review pages (prerequisites,
 * what a course unlocks, recommended terms, minors), read from the 2568
 * curriculum through the course graph in `lib/courses/graph.ts`. Nothing here
 * is written by hand per course, so it cannot drift from the curriculum.
 *
 * This is the 2568 view of the graph and nothing more: the API is the one the
 * pages and tests were written against, pinned to `CURRENT_VERSION`. Code that
 * needs another version, or a code the 2568 curriculum does not list, asks the
 * graph directly. Every code the graph returns has a course page, so each
 * result is safe to link to.
 */
import {
  CURRENT_VERSION,
  courseNode,
  prerequisites,
  recommendedIn,
  unlocks as unlocksIn,
  type MinorMembership,
} from "@/lib/courses/graph";
import type { Course as CurriculumCourse, TermRef } from "@/content/curriculum/types";

/** The 2568 curriculum entry for a course code, if the curriculum lists it. */
export function curriculumCourse(code: string): CurriculumCourse | undefined {
  return courseNode(code)?.versions[CURRENT_VERSION];
}

/** Codes of the courses that must be passed first. */
export function prerequisiteCodes(code: string): string[] {
  return prerequisites(code, CURRENT_VERSION);
}

/** Sorted codes of the courses that list this course as a prerequisite. */
export function unlocks(code: string): string[] {
  return unlocksIn(code, CURRENT_VERSION);
}

/** Every term in the recommended plan that names this course. */
export function recommendedTerms(code: string): TermRef[] {
  return recommendedIn(code, CURRENT_VERSION);
}

/** The minors a course counts towards, and whether it is required or elective there. */
export function minorsFor(code: string): MinorMembership[] {
  return [...(courseNode(code)?.versions[CURRENT_VERSION]?.minors ?? [])];
}
