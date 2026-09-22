import { z } from "zod";
import { courses } from "@/content/course-review/courses";
import { foodGroups, type Place } from "@/lib/places";
import type { Locale } from "@/lib/i18n";
import {
  ARRIVE_MODES,
  COPY,
  CURATED_COURSES,
  HOME_ROUTES,
  LUNCH_DIRECTIONS,
  t,
  type Bi,
  type CourseTeaser,
} from "@/content/openhouse/copy";
import { CLUBS, CLUB_SLUGS } from "@/content/openhouse/clubs";

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

export type LunchDirection = {
  key: string;
  label: Bi;
  blurb: Bi;
  ferry: boolean;
  places: Place[];
};

/** Resolve the curated lunch ids to real place entries from `lib/places.ts`. */
export function getLunchDirections(): LunchDirection[] {
  const placeById = new Map<string, Place>(
    foodGroups.flatMap((g) => g.places.map((p) => [p.id, p] as const))
  );
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

export type DayEntry = { time: string; label: string; value: string };

/**
 * The day as a list of stamped entries, built from validated URL state. Used
 * server-side for the share image; the page builds the same list from the
 * props it already holds, so the browser never loads the catalogues.
 */
export function dayEntries(locale: Locale, state: OpenHouseState): DayEntry[] {
  const out: DayEntry[] = [];
  const mode = ARRIVE_MODES.find((m) => m.key === state.arrive);
  if (mode)
    out.push({ time: "08:42", label: t(COPY.fnArrive, locale), value: t(mode.card, locale) });
  const course = getCuratedCourses().find((c) => c.code === state.course);
  if (course)
    out.push({
      time: "09:15",
      label: t(COPY.cardChoiceCourse, locale),
      value: `${course.code} · ${t(course.field, locale)}`,
    });
  const lunch = LUNCH_DIRECTIONS.find((d) => d.key === state.lunch);
  if (lunch)
    out.push({ time: "12:07", label: t(COPY.fnLunch, locale), value: t(lunch.label, locale) });
  const club = CLUBS.find((c) => c.slug === state.club);
  if (club) out.push({ time: "16:34", label: t(COPY.fnClub, locale), value: t(club.name, locale) });
  const home = state.arrive ? HOME_ROUTES[state.arrive] : undefined;
  if (home) out.push({ time: "18:11", label: t(COPY.fnHome, locale), value: t(home.card, locale) });
  return out;
}
