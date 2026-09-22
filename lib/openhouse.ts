import { z } from "zod";
import { courses } from "@/content/course-review/courses";
import { foodGroups, type Place } from "@/lib/places";
import {
  ARRIVE_MODES,
  CURATED_COURSES,
  LUNCH_DIRECTIONS,
  type Bi,
  type CourseTeaser,
} from "@/content/openhouse/copy";
import { CLUB_SLUGS } from "@/content/openhouse/clubs";

export type CuratedCourse = {
  code: string;
  title: Bi;
  field: Bi;
  teaser: CourseTeaser;
};

/**
 * Resolve the curated slip set against the real catalogue so titles are never
 * duplicated by hand. A curated code with no matching course is dropped rather
 * than rendered blank.
 */
export function getCuratedCourses(): CuratedCourse[] {
  return CURATED_COURSES.flatMap(({ code, field, teaser }) => {
    const course = courses.find((c) => c.code === code);
    if (!course) return [];
    return [{ code: course.code, title: course.title, field, teaser }];
  });
}

const placeById = new Map<string, Place>(
  foodGroups.flatMap((g) => g.places.map((p) => [p.id, p] as const))
);

export type LunchDirection = {
  key: string;
  label: Bi;
  blurb: Bi;
  ferry: boolean;
  places: Place[];
};

/** Resolve the curated lunch ids to real place entries from `lib/places.ts`. */
export function getLunchDirections(): LunchDirection[] {
  return LUNCH_DIRECTIONS.map((d) => ({
    key: d.key,
    label: d.label,
    blurb: d.blurb,
    ferry: d.ferry,
    places: d.places.flatMap((id) => {
      const place = placeById.get(id);
      return place ? [place] : [];
    }),
  }));
}

export function mapsHref(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

const courseCodes = CURATED_COURSES.map((c) => c.code);
const arriveKeys = ARRIVE_MODES.map((a) => a.key);
const lunchKeys = LUNCH_DIRECTIONS.map((l) => l.key);

const inSet = (set: string[]) =>
  z
    .string()
    .refine((v) => set.includes(v))
    .optional()
    .catch(undefined);

/**
 * Choices carried in the URL. Kept to a small closed set so a shared or
 * bookmarked link never carries anything but the day itself; unknown values
 * fall away instead of throwing.
 */
export const openHouseStateSchema = z.object({
  arrive: inSet(arriveKeys),
  course: z
    .string()
    .toUpperCase()
    .refine((v) => courseCodes.includes(v))
    .optional()
    .catch(undefined),
  lunch: inSet(lunchKeys),
  club: inSet(CLUB_SLUGS),
});

export type OpenHouseState = z.infer<typeof openHouseStateSchema>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export function parseState(params: Record<string, string | string[] | undefined>): OpenHouseState {
  return openHouseStateSchema.parse({
    arrive: first(params.arrive),
    course: first(params.course),
    lunch: first(params.lunch),
    club: first(params.club),
  });
}
