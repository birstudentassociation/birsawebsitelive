import { calendarEvents } from "@/content/calendar/events";
import { timetableForTerm } from "@/content/calendar/timetable";
import { todayInBangkok } from "@/lib/bangkok-today";
import { hasPage } from "@/lib/courses/graph";
import type { Locale } from "@/lib/i18n";
import { MILESTONES_2569_2, type NoClassDay } from "@/lib/timetable-planner";
import TimetablePlanner from "./TimetablePlanner";

const TERM = "2569-2";

export default function BirTimetable({ locale }: { locale: Locale }) {
  const entries = [...timetableForTerm(TERM)];
  const noClassDays: NoClassDay[] = calendarEvents
    .filter((e) => e.noClasses)
    .map((e) => ({ start: e.start, end: e.end ?? e.start, title: e.title[locale] }));
  const coursePages = [...new Set(entries.map((e) => e.code))].filter(hasPage);
  return (
    <TimetablePlanner
      locale={locale}
      termKey={TERM}
      entries={entries}
      milestones={MILESTONES_2569_2}
      noClassDays={noClassDays}
      coursePages={coursePages}
      todayKey={todayInBangkok()}
    />
  );
}
