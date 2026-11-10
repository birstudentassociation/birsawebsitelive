import { academicCalendar2569 } from "@/content/calendar/academic-2569";
import { teachingTerms, type TeachingTerm } from "@/content/calendar/terms";
import type { Locale } from "@/lib/i18n";

const FINALS_ITEM_IDS: Record<string, string> = {
  "2569-1": "s1-finals",
  "2569-2": "s2b-finals",
};

type DateRange = { start: string; end: string };

function dayNumber(key: string): number {
  const [year = 0, month = 1, day = 1] = key.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

export function weekdayDate(locale: Locale, key: string): string {
  const parts = new Intl.DateTimeFormat(locale === "th" ? "th-TH-u-ca-gregory" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).formatToParts(new Date(`${key}T00:00:00Z`));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return locale === "th"
    ? `${part("weekday")}ที่ ${part("day")} ${part("month")}`
    : `${part("weekday")} ${part("day")} ${part("month")}`;
}

function finalsFor(term: TeachingTerm): DateRange | null {
  const itemId = FINALS_ITEM_IDS[`${term.term.year}-${term.term.semester}`];
  if (!itemId) return null;
  for (const period of academicCalendar2569) {
    const item = period.items.find((candidate) => candidate.id === itemId);
    if (item) return { start: item.start, end: item.end ?? item.start };
  }
  return null;
}

type Semester = TeachingTerm["term"]["semester"];

function semesterLabel(locale: Locale, semester: Semester): string {
  if (locale === "th") return semester === "summer" ? "ภาคฤดูร้อน" : `ภาคการศึกษาที่ ${semester}`;
  return semester === "summer" ? "the summer session" : `semester ${semester}`;
}

function capitalised(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const sentences = {
  en: {
    week: (week: number, label: string) => `Week ${week} of ${label}.`,
    finalsStart: (date: string) => `Finals start ${date}.`,
    classesEnded: (label: string) => `Classes for ${label} have ended.`,
    finalsUntil: (date: string) => `Final exams until ${date}.`,
    termStarts: (label: string, date: string) => `${capitalised(label)} starts ${date}.`,
  },
  th: {
    week: (week: number, label: string) => `สัปดาห์ที่ ${week} ของ${label}`,
    finalsStart: (date: string) => `สอบปลายภาคเริ่ม${date}`,
    classesEnded: (label: string) => `${label} สิ้นสุดการเรียนการสอนแล้ว`,
    finalsUntil: (date: string) => `สอบปลายภาคถึง${date}`,
    termStarts: (label: string, date: string) => `${label} เริ่ม${date}`,
  },
};

export function getTermStatus(todayKey: string, locale: Locale): string | null {
  const text = sentences[locale];
  const join = (...parts: string[]) => parts.join(" ");
  const terms = [...teachingTerms].sort((a, b) => a.start.localeCompare(b.start));

  const teaching = terms.find((term) => term.start <= todayKey && todayKey <= term.end);
  if (teaching) {
    const week = Math.floor((dayNumber(todayKey) - dayNumber(teaching.start)) / 7) + 1;
    const finals = finalsFor(teaching);
    const parts = [text.week(week, semesterLabel(locale, teaching.term.semester))];
    if (finals && finals.start > todayKey) {
      parts.push(text.finalsStart(weekdayDate(locale, finals.start)));
    }
    return join(...parts);
  }

  const finishedTerm = [...terms].reverse().find((term) => term.end < todayKey);
  const finals = finishedTerm ? finalsFor(finishedTerm) : null;
  if (finishedTerm && finals && todayKey <= finals.end) {
    if (todayKey >= finals.start) {
      return text.finalsUntil(weekdayDate(locale, finals.end));
    }
    return join(
      text.classesEnded(semesterLabel(locale, finishedTerm.term.semester)),
      text.finalsStart(weekdayDate(locale, finals.start))
    );
  }

  const nextTerm = terms.find((term) => term.start > todayKey);
  if (nextTerm) {
    return text.termStarts(
      semesterLabel(locale, nextTerm.term.semester),
      weekdayDate(locale, nextTerm.start)
    );
  }
  return null;
}
