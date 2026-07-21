import type { Course, CourseTrack } from "@/content/course-review/types";
import type { Locale } from "@/lib/i18n";
import { TRACK_ORDER } from "@/components/course-review/constants";

export type CourseStatsDict = {
  heading: string;
  totalCourses: string;
  tracks: Record<CourseTrack, string>;
};

export type CourseStatsProps = {
  courses: Course[];
  locale: Locale;
  dict: CourseStatsDict;
};

/**
 * Visual overview above the browsable course list: six stat tiles, the first
 * showing every course in the catalogue combined, followed by one tile per
 * track showing that track's course count. All numbers are derived from
 * `courses` (never hardcoded), so this stays correct as the catalogue grows
 * from the current placeholder set to the full ~84 courses.
 */
export default function CourseStats({ courses, locale, dict }: CourseStatsProps) {
  const numberFormat = locale === "th" ? "th-TH" : "en-GB";

  const tiles = [
    { key: "all", label: dict.totalCourses, count: courses.length },
    ...TRACK_ORDER.map((track) => ({
      key: track,
      label: dict.tracks[track],
      count: courses.filter((course) => course.track === track).length,
    })),
  ];

  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-display text-xl">{dict.heading}</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => (
          <StatTile
            key={tile.key}
            label={tile.label}
            value={tile.count.toLocaleString(numberFormat)}
          />
        ))}
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
