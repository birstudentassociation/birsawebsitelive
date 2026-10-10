/**
 * One short line of context for a course in the plan screen's picker: how it
 * is assessed, whether real student reviews exist, and who teaches it.
 *
 * Facts and words only, in line with the rule that subjective qualities are
 * never scored. Each part appears only where the catalogue holds the data, so
 * most courses get no line at all, and a course with no catalogue entry (the
 * TU, EL and LAS courses, say) gets none.
 *
 * "Student reviews" is shown only for a review that is not a sample: the one
 * review in the catalogue today is demonstration content, and advertising it
 * in a picker would claim feedback that does not exist.
 */
import type { Locale } from "@/lib/i18n";
import { courseNode } from "@/lib/courses/graph";
import type { AssessmentFacts, Course } from "@/content/course-review/types";

export type ContextCopy = {
  /** Contains "{n}". */
  finalExamTemplate: string;
  courseworkOnly: string;
  studentReviews: string;
  /** Contains "{names}". */
  instructorsTemplate: string;
};

/**
 * The assessment shape in a few words, or null if nothing can be said. A final
 * exam is named with its weight. "Coursework only" is claimed only when the
 * recorded weights add up to the whole grade and none of them is an exam, so
 * a partial record never reads as a complete one.
 */
export function assessmentShape(
  facts: AssessmentFacts | undefined,
  copy: ContextCopy
): string | null {
  const weights = facts?.weights;
  if (!weights || weights.length === 0) return null;
  const finalExam = weights.find((component) => /final exam/i.test(component.label.en));
  if (finalExam) return copy.finalExamTemplate.replace("{n}", String(finalExam.weight));
  const total = weights.reduce((sum, component) => sum + component.weight, 0);
  const anyExam = weights.some((component) => /exam/i.test(component.label.en));
  return total === 100 && !anyExam ? copy.courseworkOnly : null;
}

/** The picker's context line for a course code, or null when the catalogue has nothing to say. */
export function courseContextLine(code: string, locale: Locale, copy: ContextCopy): string | null {
  const course = courseNode(code)?.catalogue;
  return course ? courseContext(course, locale, copy) : null;
}

/** The context line for a catalogue entry, or null when it holds nothing worth a line. */
export function courseContext(course: Course, locale: Locale, copy: ContextCopy): string | null {
  const parts: string[] = [];

  const shape = assessmentShape(course.assessmentFacts, copy);
  if (shape) parts.push(shape);

  if (course.reviews?.some((review) => !review.sample)) parts.push(copy.studentReviews);

  const names = (course.instructors ?? []).map((instructor) => instructor.name[locale]);
  if (names.length > 0) {
    parts.push(copy.instructorsTemplate.replace("{names}", names.join(", ")));
  }

  return parts.length > 0 ? parts.join(" · ") : null;
}
