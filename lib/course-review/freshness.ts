/**
 * Review freshness: whether a review is old enough to flag as dated, and
 * whether the person who taught the course then is still the person who
 * teaches it. Both are statements about the review, not about the course, so
 * they are worded as notes beside the review and never remove it.
 *
 * Pure functions with `now` passed in, so they are testable without a clock.
 */
import type { Instructor, StudentReview } from "@/content/course-review/types";
import { instructorKey } from "@/lib/course-review/instructors";
import { isDated } from "@/lib/course-review/terms";

/**
 * How a review's instructor relates to the course's current instructors:
 * - `changed`: the review names an instructor who is not on the current list
 * - `elsewhere`: the students said someone outside the list taught it
 * - `null`: nothing to say, including when the course has no instructors on
 *   record to compare against
 */
export type InstructorNote = "changed" | "elsewhere" | null;

export function instructorNote(
  review: StudentReview,
  currentInstructors: readonly Instructor[] | undefined
): InstructorNote {
  if (!currentInstructors || currentInstructors.length === 0) return null;
  if (review.instructorElsewhere) return "elsewhere";
  if (!review.instructor) return null;
  const reviewed = instructorKey(review.instructor);
  return currentInstructors.some((current) => instructorKey(current) === reviewed)
    ? null
    : "changed";
}

export type ReviewFreshness = {
  /** More than three academic years old. */
  dated: boolean;
  instructor: InstructorNote;
};

export function reviewFreshness(
  review: StudentReview,
  currentInstructors: readonly Instructor[] | undefined,
  now: Date
): ReviewFreshness {
  return {
    dated: isDated(review.term, now),
    instructor: instructorNote(review, currentInstructors),
  };
}
