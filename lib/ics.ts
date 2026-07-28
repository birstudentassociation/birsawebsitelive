/**
 * RFC 5545 (iCalendar) generation for the activity calendar subscribe feed.
 *
 * Pure and dependency-free: no `new Date()` at module or call time, so the
 * output is byte-stable across builds and the route stays statically
 * generatable. `DTSTAMP`/`LAST-MODIFIED` come from `ICS_REVISION`, a fixed
 * constant bumped by hand whenever the underlying event data changes
 * meaningfully (it does not need to track every edit, only ones worth
 * nudging subscribed calendar apps to notice).
 *
 * All events in `calendarEvents` are all-day, so every VEVENT uses the
 * `VALUE=DATE` form. `DTEND` in iCalendar is exclusive, so it is always set
 * to the day after the inclusive `end` (or after `start` when there is no
 * `end`), computed with UTC date arithmetic so it can never drift across a
 * timezone boundary.
 */
import type { CalendarEvent } from "@/content/calendar/events";
import type { Locale } from "@/lib/i18n";

/**
 * Fixed revision timestamp for `DTSTAMP`/`LAST-MODIFIED`. Bump this (to the
 * current UTC time) whenever `content/calendar/events.ts` changes in a way
 * subscribers should be nudged to notice. Never replace with `new Date()`:
 * that would make the static route's output non-deterministic per build.
 */
export const ICS_REVISION = "2026-07-28T00:00:00Z";

const CALENDAR_NAME: Record<Locale, string> = {
  en: "BIRSA activity calendar",
  th: "ปฏิทินกิจกรรม BIRSA",
};

/** Parses a `YYYY-MM-DD` string into UTC date parts, ignoring local timezone. */
function parseIsoDate(iso: string): { y: number; m: number; d: number } {
  const [y = "1970", m = "1", d = "1"] = iso.split("-");
  return { y: Number(y), m: Number(m), d: Number(d) };
}

/** Formats UTC date parts as `YYYYMMDD` for the `VALUE=DATE` iCalendar form. */
function formatIcsDate(y: number, m: number, d: number): string {
  const pad2 = (n: number) => String(n).padStart(2, "0");
  return `${String(y).padStart(4, "0")}${pad2(m)}${pad2(d)}`;
}

/**
 * The exclusive DTEND for an all-day event: the day after the inclusive
 * `end` (or after `start` when there is no `end`). Uses `Date.UTC` so month
 * and year rollovers (e.g. 2026-06-30 -> 2026-07-01, 2026-12-31 -> 2027-01-01)
 * are handled by the platform's calendar arithmetic, not string math.
 */
function exclusiveDtEnd(event: Pick<CalendarEvent, "start" | "end">): string {
  const { y, m, d } = parseIsoDate(event.end ?? event.start);
  const next = new Date(Date.UTC(y, m - 1, d + 1));
  return formatIcsDate(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate());
}

function dtStart(event: Pick<CalendarEvent, "start">): string {
  const { y, m, d } = parseIsoDate(event.start);
  return formatIcsDate(y, m, d);
}

/**
 * Escapes a text value per RFC 5545 3.3.11: backslash, semicolon, comma and
 * newlines each get a backslash escape. Order matters: backslashes must be
 * escaped first so the escapes just added aren't themselves re-escaped.
 */
export function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

/**
 * Folds a single unfolded content line at 75 octets per RFC 5545 3.1, joining
 * folded segments with CRLF + a single leading space. Folding is measured in
 * UTF-8 octets (not JS UTF-16 code units), and never splits a multi-byte
 * character across a fold boundary.
 */
export function foldIcsLine(line: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(line);
  if (bytes.length <= 75) return line;

  const segments: string[] = [];
  // Walk the string by Unicode code point (handles astral characters, e.g.
  // emoji, correctly) while tracking the running UTF-8 octet length.
  const chars = Array.from(line);
  let current = "";
  let currentOctets = 0;
  // The first line has a 75-octet budget; continuation lines start with a
  // single space, which itself costs one octet, leaving 74 for content.
  let limit = 75;

  for (const ch of chars) {
    const chOctets = encoder.encode(ch).length;
    if (currentOctets + chOctets > limit) {
      segments.push(current);
      current = ch;
      currentOctets = chOctets;
      limit = 74;
    } else {
      current += ch;
      currentOctets += chOctets;
    }
  }
  if (current) segments.push(current);

  return segments.map((segment, i) => (i === 0 ? segment : ` ${segment}`)).join("\r\n");
}

function line(name: string, value: string): string {
  return foldIcsLine(`${name}:${value}`);
}

export type BuildIcsOptions = {
  /** Absolute site origin, e.g. `https://example.com` (no trailing slash). */
  siteUrl: string;
};

/**
 * Builds a complete, valid RFC 5545 calendar document for the given events,
 * localised to `locale`. All events are treated as all-day.
 */
export function buildIcs(
  events: CalendarEvent[],
  locale: Locale,
  options: BuildIcsOptions
): string {
  const host = new URL(options.siteUrl).host;

  const lines: string[] = [];
  lines.push("BEGIN:VCALENDAR");
  lines.push("VERSION:2.0");
  lines.push(line("PRODID", "-//BIRSA Portal//Activity Calendar//EN"));
  lines.push("CALSCALE:GREGORIAN");
  lines.push("METHOD:PUBLISH");
  lines.push(line("X-WR-CALNAME", escapeIcsText(CALENDAR_NAME[locale])));
  lines.push("X-WR-TIMEZONE:Asia/Bangkok");

  const dtStampValue = ICS_REVISION.replace(/[-:]/g, "");

  for (const event of events) {
    const url = `${options.siteUrl}/${locale}/news/${event.slug}`;
    lines.push("BEGIN:VEVENT");
    lines.push(line("UID", `${event.id}@${host}`));
    lines.push(line("DTSTAMP", dtStampValue));
    lines.push(`DTSTART;VALUE=DATE:${dtStart(event)}`);
    lines.push(`DTEND;VALUE=DATE:${exclusiveDtEnd(event)}`);
    lines.push(line("SUMMARY", escapeIcsText(event.title[locale])));
    lines.push(line("DESCRIPTION", escapeIcsText(url)));
    lines.push(line("URL", escapeIcsText(url)));
    lines.push(line("CATEGORIES", escapeIcsText(event.kind)));
    lines.push(line("LAST-MODIFIED", dtStampValue));
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  return lines.join("\r\n") + "\r\n";
}
