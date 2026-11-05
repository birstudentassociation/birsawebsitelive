/**
 * Builds the personal iCalendar feed: public all-day events from the chosen
 * categories, the student's weekly classes and, for classes in the BIR
 * timetable, their midterm and final exams. Pure and deterministic.
 */
import { calendarEvents, type CalendarEvent } from "@/content/calendar/events";
import {
  currentOrNextTeachingTerm,
  teachingTerms,
  termKeyOf,
  type TeachingTerm,
} from "@/content/calendar/terms";
import { timetableEntriesByCode } from "@/content/calendar/timetable";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import type { Locale } from "@/lib/i18n";
import {
  allDayEventLines,
  escapeIcsText,
  formatIcsDate,
  ICS_STAMP,
  line,
  parseIsoDate,
} from "@/lib/ics";
import { examOccurrences, examTitle, type ExamOccurrence } from "./exams";
import { eventsForCategories, type ClassSlot, type Selection } from "./selection";

const CALENDAR_NAME: Record<Locale, string> = {
  en: "My BIR calendar",
  th: "ปฏิทิน BIR ของฉัน",
};

export type BuildCustomIcsOptions = {
  siteUrl: string;
  /** Bangkok `YYYY-MM-DD`; picks a term when the selection's is unknown. */
  todayKey?: string;
};

const VTIMEZONE = [
  "BEGIN:VTIMEZONE",
  "TZID:Asia/Bangkok",
  "BEGIN:STANDARD",
  "DTSTART:19700101T000000",
  "TZOFFSETFROM:+0700",
  "TZOFFSETTO:+0700",
  "TZNAME:ICT",
  "END:STANDARD",
  "END:VTIMEZONE",
];

function findTerm(selection: Selection, todayKey?: string): TeachingTerm | null {
  const exact = teachingTerms.find((t) => termKeyOf(t) === selection.term);
  if (exact) return exact;
  return todayKey ? currentOrNextTeachingTerm(todayKey) : null;
}

function courseTitle(code: string, termKey: string): string | null {
  const timetabled = timetableEntriesByCode(termKey, code)[0];
  if (timetabled) return timetabled.title;
  for (const version of Object.values(CURRICULUM_VERSIONS)) {
    const course = version.courses.value.find((c) => c.code === code);
    if (course) return course.title;
  }
  return null;
}

/** ISO weekday (Mon = 1) of a `YYYY-MM-DD` date. */
function isoWeekday(key: string): number {
  const { y, m, d } = parseIsoDate(key);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay() || 7;
}

function addDays(key: string, days: number): string {
  const { y, m, d } = parseIsoDate(key);
  const next = new Date(Date.UTC(y, m - 1, d + days));
  return formatIcsDate(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate());
}

function toKey(compact: string): string {
  return `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6)}`;
}

/** Compact dates (`YYYYMMDD`) of `noClasses` days on `weekday` within the term. */
function skippedDates(term: TeachingTerm, weekday: number): string[] {
  const dates = new Set<string>();
  for (const event of calendarEvents) {
    if (!event.noClasses) continue;
    const last = event.end ?? event.start;
    for (let key = event.start; key <= last; key = toKey(addDays(key, 1))) {
      if (key >= term.start && key <= term.end && isoWeekday(key) === weekday) {
        dates.add(key.replace(/-/g, ""));
      }
    }
  }
  return [...dates].sort();
}

function classLines(slot: ClassSlot, term: TeachingTerm, locale: Locale, host: string): string[] {
  const termKey = termKeyOf(term);
  const offset = (slot.day - isoWeekday(term.start) + 7) % 7;
  const first = addDays(term.start, offset).replace(/-/g, "");
  const hhmm = (t: string) => `${t.replace(":", "")}00`;
  const until = `${term.end.replace(/-/g, "")}T165959Z`;
  const title = courseTitle(slot.code, termKey);
  const section = slot.section ? `-${slot.section}` : "";
  const lines = [
    "BEGIN:VEVENT",
    line(
      "UID",
      `class-${termKey}-${slot.code}${section}-${slot.day}-${slot.start.replace(":", "")}@${host}`
    ),
    line("DTSTAMP", ICS_STAMP),
    `DTSTART;TZID=Asia/Bangkok:${first}T${hhmm(slot.start)}`,
    `DTEND;TZID=Asia/Bangkok:${first}T${hhmm(slot.end)}`,
    `RRULE:FREQ=WEEKLY;UNTIL=${until}`,
  ];
  for (const date of skippedDates(term, slot.day)) {
    lines.push(`EXDATE;TZID=Asia/Bangkok:${date}T${hhmm(slot.start)}`);
  }
  const label = title ? `${slot.code} ${title}` : slot.code;
  lines.push(
    line(
      "SUMMARY",
      escapeIcsText(
        slot.section ? `${label} (${locale === "th" ? "ตอน" : "section"} ${slot.section})` : label
      )
    )
  );
  if (slot.place) lines.push(line("LOCATION", escapeIcsText(slot.place)));
  lines.push(line("LAST-MODIFIED", ICS_STAMP), "END:VEVENT");
  return lines;
}

function examLines(exam: ExamOccurrence, locale: Locale, host: string): string[] {
  const date = exam.date.replace(/-/g, "");
  const hhmm = (t: string) => `${t.replace(":", "")}00`;
  const lines = [
    "BEGIN:VEVENT",
    line("UID", `${exam.id}@${host}`),
    line("DTSTAMP", ICS_STAMP),
    `DTSTART;TZID=Asia/Bangkok:${date}T${hhmm(exam.start)}`,
    `DTEND;TZID=Asia/Bangkok:${date}T${hhmm(exam.end)}`,
    line("SUMMARY", escapeIcsText(examTitle(exam, locale))),
  ];
  if (exam.room) lines.push(line("LOCATION", escapeIcsText(exam.room)));
  lines.push(line("LAST-MODIFIED", ICS_STAMP), "END:VEVENT");
  return lines;
}

/** The complete calendar document for a selection. */
export function buildCustomIcs(
  selection: Selection,
  locale: Locale,
  options: BuildCustomIcsOptions
): string {
  const host = new URL(options.siteUrl).host;
  const events: CalendarEvent[] = eventsForCategories(calendarEvents, selection.categories);
  const wantsClasses = selection.categories.includes("classes");
  const wantsExams = selection.categories.includes("exams");
  const term = wantsClasses || wantsExams ? findTerm(selection, options.todayKey) : null;
  const termKey = term ? termKeyOf(term) : "";
  const slots = term && wantsClasses ? selection.classes : [];
  const exams = term && wantsExams ? examOccurrences(termKey, selection.classes, locale) : [];

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    line("PRODID", "-//BIRSA Portal//My Calendar//EN"),
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    line("X-WR-CALNAME", escapeIcsText(CALENDAR_NAME[locale])),
    "X-WR-TIMEZONE:Asia/Bangkok",
  ];
  if (slots.length > 0 || exams.length > 0) lines.push(...VTIMEZONE);
  for (const event of events) lines.push(...allDayEventLines(event, locale, options.siteUrl));
  if (term) for (const slot of slots) lines.push(...classLines(slot, term, locale, host));
  for (const exam of exams) lines.push(...examLines(exam, locale, host));
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}
