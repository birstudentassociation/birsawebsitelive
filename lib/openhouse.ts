import { z } from "zod";
import { courses } from "@/content/course-review/courses";
import { CURATED_COURSES, type Bi } from "@/content/openhouse/copy";

export type CuratedCourse = {
  code: string;
  title: Bi;
  field: Bi;
};

/**
 * Resolve the curated slip set against the real catalogue so titles are never
 * duplicated by hand. A curated code with no matching course is dropped rather
 * than rendered blank.
 */
export function getCuratedCourses(): CuratedCourse[] {
  return CURATED_COURSES.flatMap(({ code, field }) => {
    const course = courses.find((c) => c.code === code);
    if (!course) return [];
    return [{ code: course.code, title: course.title, field }];
  });
}

const courseCodes = CURATED_COURSES.map((c) => c.code);

/**
 * Choices carried in the URL. Kept to a small closed set so a shared or
 * bookmarked link never carries anything but the day itself; unknown values
 * fall away instead of throwing.
 */
export const openHouseStateSchema = z.object({
  course: z
    .string()
    .toUpperCase()
    .refine((v) => courseCodes.includes(v))
    .optional()
    .catch(undefined),
});

export type OpenHouseState = z.infer<typeof openHouseStateSchema>;

export function parseState(params: Record<string, string | string[] | undefined>): OpenHouseState {
  const course = Array.isArray(params.course) ? params.course[0] : params.course;
  return openHouseStateSchema.parse({ course });
}
