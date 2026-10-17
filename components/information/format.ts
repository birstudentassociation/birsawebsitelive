import { formatGuideDate, type Locale } from "@/lib/i18n";
import type { DateSpan } from "@/content/information/admissions";

export function formatSpan(locale: Locale, span: DateSpan): string {
  const end = formatGuideDate(locale, span.end ?? span.start);
  if (!span.end || span.end === span.start) return end;
  const [startDay, startMonth, startYear] = formatGuideDate(locale, span.start).split(" ");
  const [, endMonth, endYear] = end.split(" ");
  const to = locale === "th" ? "ถึง" : "to";
  if (startYear !== endYear) return `${startDay} ${startMonth} ${startYear} ${to} ${end}`;
  if (startMonth !== endMonth) return `${startDay} ${startMonth} ${to} ${end}`;
  return `${startDay} ${to} ${end}`;
}

export function formatMonth(locale: Locale, isoMonth: string): string {
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH-u-ca-buddhist" : "en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoMonth}-01T00:00:00Z`));
}
