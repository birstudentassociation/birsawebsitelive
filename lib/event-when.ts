import { formatDate, type Locale } from "@/lib/i18n";

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export function eventDateIntl(locale: Locale, options: Intl.DateTimeFormatOptions, iso: string) {
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH-u-ca-gregory" : "en-GB", {
    ...options,
    timeZone: DATE_ONLY.test(iso) ? "UTC" : "Asia/Bangkok",
  }).format(new Date(iso));
}

function eventTime(locale: Locale, iso: string) {
  return eventDateIntl(locale, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }, iso);
}

/** The event's date and, when it has one, its time range, as people read it. */
export function eventWhen(locale: Locale, start: string, end?: string): string {
  const date = formatDate(locale, start);
  if (end && formatDate(locale, end) !== date) {
    return locale === "th"
      ? `${date} ถึง ${formatDate(locale, end)}`
      : `${date} to ${formatDate(locale, end)}`;
  }
  if (DATE_ONLY.test(start)) return date;
  const range = end
    ? `${eventTime(locale, start)} ${locale === "th" ? "ถึง" : "to"} ${eventTime(locale, end)}`
    : eventTime(locale, start);
  return locale === "th" ? `${range} น.` : range;
}

/** The event's date and time range on one line, e.g. "11 November 2026, 14:00 to 17:30". */
export function eventWhenFull(locale: Locale, start: string, end?: string): string {
  const when = eventWhen(locale, start, end);
  const date = formatDate(locale, start);
  if (when === date || when.startsWith(date)) return when;
  return locale === "th" ? `${date} เวลา ${when}` : `${date}, ${when}`;
}

/** An ISO date-time written in Bangkok time with its +07:00 offset. */
export function bangkokIso(iso: string): string {
  if (DATE_ONLY.test(iso)) return iso;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const local = new Date(date.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 19);
  return `${local}+07:00`;
}
