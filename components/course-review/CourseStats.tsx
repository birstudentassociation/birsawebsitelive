import type { Course, CourseTrack } from "@/content/course-review/types";
import type { Locale } from "@/lib/i18n";
import { TRACK_ORDER } from "@/components/course-review/constants";

export type CourseStatsDict = {
  heading: string;
  totalCourses: string;
  totalCredits: string;
  minorTracks: string;
  byTrack: string;
  tracks: Record<CourseTrack, string>;
};

export type CourseStatsProps = {
  courses: Course[];
  locale: Locale;
  dict: CourseStatsDict;
};

/**
 * Visual overview above the browsable course list: a few stat tiles plus a
 * horizontal bar breakdown of course count by track. All numbers are
 * derived from `courses` (never hardcoded), so this stays correct as the
 * catalogue grows from the current placeholder set to the full ~84 courses.
 *
 * Deliberately a single hue (brand red) for every bar; the site's palette
 * has no categorical rainbow, and each bar already carries its identity via
 * the adjacent text label, not via color.
 */
export default function CourseStats({ courses, locale, dict }: CourseStatsProps) {
  const numberFormat = locale === "th" ? "th-TH" : "en-GB";
  const totalCourses = courses.length;
  const totalCredits = courses.reduce((sum, course) => sum + course.credits.total, 0);
  const minorTrackCount = new Set(
    courses.filter((course) => course.category.startsWith("minor")).map((course) => course.track)
  ).size;

  const byTrack = TRACK_ORDER.map((track) => ({
    track,
    label: dict.tracks[track],
    count: courses.filter((course) => course.track === track).length,
  }));
  const maxCount = Math.max(1, ...byTrack.map((row) => row.count));

  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-display text-xl">{dict.heading}</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label={dict.totalCourses} value={totalCourses.toLocaleString(numberFormat)} />
        <StatTile label={dict.totalCredits} value={totalCredits.toLocaleString(numberFormat)} />
        <StatTile label={dict.minorTracks} value={minorTrackCount.toLocaleString(numberFormat)} />
      </div>

      <div className="border-line bg-surface flex flex-col gap-4 rounded-lg border p-5">
        <h3 className="text-muted text-sm font-semibold tracking-wide uppercase">{dict.byTrack}</h3>
        <ul className="flex flex-col gap-3">
          {byTrack.map((row) => (
            <li key={row.track} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-ink font-medium">{row.label}</span>
                <span className="text-muted shrink-0">{row.count.toLocaleString(numberFormat)}</span>
              </div>
              <div className="bg-sunken h-1.5 w-full overflow-hidden rounded-full">
                <div
                  className="bg-brand h-full rounded-full"
                  style={{ width: `${(row.count / maxCount) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-line bg-surface flex flex-col gap-1 rounded-lg border p-5">
      <span className="text-muted text-sm font-semibold">{label}</span>
      <span className="font-display text-ink text-3xl">{value}</span>
    </div>
  );
}
