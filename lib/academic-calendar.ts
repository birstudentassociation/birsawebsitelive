import type {
  AcademicItem,
  AcademicItemKind,
  AcademicPeriod,
  AcademicTrack,
} from "@/content/calendar/academic-2569";
import type { Locale } from "@/lib/i18n";
import { escapeIcsText, formatIcsDate, ICS_STAMP, line, parseIsoDate } from "@/lib/ics";

const DAY_MS = 86_400_000;

export function dayIndex(iso: string): number {
  const { y, m, d } = parseIsoDate(iso);
  return Math.round(Date.UTC(y, m - 1, d) / DAY_MS);
}

export function itemEnd(item: Pick<AcademicItem, "start" | "end">): string {
  return item.end ?? item.start;
}

export type ItemStatus =
  { kind: "past" } | { kind: "now"; daysLeft: number } | { kind: "upcoming"; daysUntil: number };

export function itemStatus(
  item: Pick<AcademicItem, "start" | "end">,
  todayKey: string
): ItemStatus {
  const today = dayIndex(todayKey);
  const start = dayIndex(item.start);
  const end = dayIndex(itemEnd(item));
  if (end < today) return { kind: "past" };
  if (start <= today) return { kind: "now", daysLeft: end - today };
  return { kind: "upcoming", daysUntil: start - today };
}

export function periodsForTrack(periods: AcademicPeriod[], track: AcademicTrack): AcademicPeriod[] {
  return periods.filter((p) => !p.track || p.track === track);
}

export function periodSpan(period: AcademicPeriod): { start: string; end: string } {
  const starts = period.items.map((i) => i.start).sort();
  const ends = period.items.map(itemEnd).sort();
  return { start: starts[0] ?? "", end: ends[ends.length - 1] ?? "" };
}

const MONTHS: Record<Locale, string[]> = {
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  th: [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ],
};

const SHORT_MONTHS: Record<Locale, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  th: [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ],
};

const WEEKDAYS: Record<Locale, string[]> = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  th: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."],
};

const LONG_WEEKDAYS: Record<Locale, string[]> = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  th: ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"],
};

const TO: Record<Locale, string> = { en: "to", th: "ถึง" };

export function displayYear(locale: Locale, year: number): number {
  return locale === "th" ? year + 543 : year;
}

export function monthName(locale: Locale, month: number, short = false): string {
  return (short ? SHORT_MONTHS : MONTHS)[locale][month - 1] ?? "";
}

function weekday(iso: string): number {
  const { y, m, d } = parseIsoDate(iso);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function formatLongDay(locale: Locale, iso: string): string {
  const { y, m, d } = parseIsoDate(iso);
  return `${LONG_WEEKDAYS[locale][weekday(iso)]} ${d} ${monthName(locale, m)} ${displayYear(locale, y)}`;
}

export function formatItemDate(
  locale: Locale,
  item: Pick<AcademicItem, "start" | "end">,
  withYear = false
): string {
  const a = parseIsoDate(item.start);
  const yearOf = (y: number) => ` ${displayYear(locale, y)}`;
  if (!item.end || item.end === item.start) {
    return `${WEEKDAYS[locale][weekday(item.start)]} ${a.d} ${monthName(locale, a.m)}${withYear ? yearOf(a.y) : ""}`;
  }
  const b = parseIsoDate(item.end);
  if (a.y !== b.y) {
    return `${a.d} ${monthName(locale, a.m)}${yearOf(a.y)} ${TO[locale]} ${b.d} ${monthName(locale, b.m)}${yearOf(b.y)}`;
  }
  const tail = withYear ? yearOf(b.y) : "";
  if (a.m === b.m) return `${a.d} ${TO[locale]} ${b.d} ${monthName(locale, b.m)}${tail}`;
  return `${a.d} ${monthName(locale, a.m)} ${TO[locale]} ${b.d} ${monthName(locale, b.m)}${tail}`;
}

export function formatMonthSpan(locale: Locale, start: string, end: string): string {
  const a = parseIsoDate(start);
  const b = parseIsoDate(end);
  if (a.y === b.y && a.m === b.m) return `${monthName(locale, a.m)} ${displayYear(locale, a.y)}`;
  if (a.y === b.y) {
    return `${monthName(locale, a.m)} ${TO[locale]} ${monthName(locale, b.m)} ${displayYear(locale, b.y)}`;
  }
  return `${monthName(locale, a.m)} ${displayYear(locale, a.y)} ${TO[locale]} ${monthName(locale, b.m)} ${displayYear(locale, b.y)}`;
}

export type TimelineAxis = {
  start: number;
  length: number;
  months: { key: string; month: number; year: number; offset: number }[];
};

export function timelineAxis(period: AcademicPeriod): TimelineAxis {
  const span = periodSpan(period);
  const a = parseIsoDate(span.start);
  const b = parseIsoDate(span.end);
  const first = Math.round(Date.UTC(a.y, a.m - 1, 1) / DAY_MS);
  const last = Math.round(Date.UTC(b.y, b.m, 1) / DAY_MS);
  const months: TimelineAxis["months"] = [];
  const total = (b.y - a.y) * 12 + (b.m - a.m);
  for (let i = 0; i <= total; i++) {
    const date = new Date(Date.UTC(a.y, a.m - 1 + i, 1));
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth() + 1;
    months.push({
      key: `${y}-${m}`,
      month: m,
      year: y,
      offset: Math.round(date.getTime() / DAY_MS) - first,
    });
  }
  return { start: first, length: last - first, months };
}

export function barPosition(
  axis: TimelineAxis,
  item: Pick<AcademicItem, "start" | "end">
): { left: number; width: number } {
  const start = dayIndex(item.start) - axis.start;
  const end = dayIndex(itemEnd(item)) - axis.start + 1;
  return { left: (start / axis.length) * 100, width: ((end - start) / axis.length) * 100 };
}

export const ACADEMIC_KINDS: AcademicItemKind[] = [
  "exam",
  "registration",
  "withdrawal",
  "deadline",
  "holiday",
  "term",
];

export function buildAcademicIcs(
  items: { item: AcademicItem; period: AcademicPeriod }[],
  locale: Locale,
  siteUrl: string,
  calendarName: string
): string {
  const host = new URL(siteUrl).host;
  const url = `${siteUrl}/${locale}/news/academic-calendar-2569`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    line("PRODID", "-//BIRSA Portal//Academic Calendar//EN"),
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    line("X-WR-CALNAME", escapeIcsText(calendarName)),
    "X-WR-TIMEZONE:Asia/Bangkok",
  ];
  for (const { item, period } of items) {
    const s = parseIsoDate(item.start);
    const e = parseIsoDate(itemEnd(item));
    const next = new Date(Date.UTC(e.y, e.m - 1, e.d + 1));
    lines.push(
      "BEGIN:VEVENT",
      line("UID", `ac2569-${item.id}@${host}`),
      line("DTSTAMP", ICS_STAMP),
      `DTSTART;VALUE=DATE:${formatIcsDate(s.y, s.m, s.d)}`,
      `DTEND;VALUE=DATE:${formatIcsDate(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate())}`,
      line("SUMMARY", escapeIcsText(item.title[locale])),
      line("DESCRIPTION", escapeIcsText(`${period.title[locale]}\n${url}`)),
      line("URL", escapeIcsText(url)),
      line("CATEGORIES", escapeIcsText(item.kind)),
      "TRANSP:TRANSPARENT",
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}
