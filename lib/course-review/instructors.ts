/**
 * Stable keys for course instructors.
 *
 * A submission has to say who taught the course, and that answer has to
 * survive a change to the instructor's title or the Thai spelling of their
 * name, so it is stored as a key rather than as the name. The key is the last
 * segment of the faculty profile URL where there is one (it is the staff
 * directory's own identifier) and a slug of the English name otherwise.
 *
 * "other" is the key for someone who is not on the course's instructor list.
 * Pure functions over static data, so the form, the console and the course
 * page all agree on what a key means.
 */
import type { Instructor } from "@/content/course-review/types";

/** The key stored when the reviewer says someone else taught the course. */
export const OTHER_INSTRUCTOR = "other";

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The stable key for an instructor: the profile URL's last path segment, or a slug of the English name. */
export function instructorKey(instructor: Instructor): string {
  if (instructor.profileUrl) {
    const segments = new URL(instructor.profileUrl).pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1];
    if (last) return last;
  }
  return slug(instructor.name.en);
}

/** The instructor a key names among `instructors`, or undefined for "other" and for an unknown key. */
export function instructorByKey(
  instructors: readonly Instructor[] | undefined,
  key: string
): Instructor | undefined {
  return (instructors ?? []).find((instructor) => instructorKey(instructor) === key);
}

/** Every key a submission for a course with these instructors may carry: each instructor's key, then "other". */
export function validInstructorKeys(instructors: readonly Instructor[] | undefined): string[] {
  return [...(instructors ?? []).map(instructorKey), OTHER_INSTRUCTOR];
}
