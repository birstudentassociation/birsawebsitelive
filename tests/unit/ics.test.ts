import { describe, expect, it } from "vitest";
import { buildIcs, escapeIcsText, foldIcsLine, ICS_REVISION } from "@/lib/ics";
import type { CalendarEvent } from "@/content/calendar/events";

const SITE_URL = "https://birsa.example";

function makeEvent(overrides: Partial<CalendarEvent>): CalendarEvent {
  return {
    id: "test-event",
    start: "2026-07-15",
    title: { en: "Test event", th: "กิจกรรมทดสอบ" },
    slug: "test-event",
    kind: "birsa",
    ...overrides,
  };
}

describe("buildIcs", () => {
  it("produces the required calendar-level properties", () => {
    const ics = buildIcs([], "en", { siteUrl: SITE_URL });
    expect(ics).toContain("BEGIN:VCALENDAR\r\n");
    expect(ics).toContain("VERSION:2.0\r\n");
    expect(ics).toContain("PRODID:");
    expect(ics).toContain("CALSCALE:GREGORIAN\r\n");
    expect(ics).toContain("METHOD:PUBLISH\r\n");
    expect(ics).toContain("X-WR-CALNAME:");
    expect(ics).toContain("X-WR-TIMEZONE:Asia/Bangkok\r\n");
    expect(ics.trimEnd()).toMatch(/END:VCALENDAR$/);
  });

  it("uses CRLF line endings throughout", () => {
    const ics = buildIcs([makeEvent({})], "en", { siteUrl: SITE_URL });
    // No bare LF (a LF not preceded by CR).
    expect(ics).not.toMatch(/[^\r]\n/);
    expect(ics).toMatch(/\r\n/);
  });

  it("sets an exclusive DTEND the day after a single-day event's start", () => {
    const ics = buildIcs([makeEvent({ start: "2026-07-15" })], "en", { siteUrl: SITE_URL });
    expect(ics).toContain("DTSTART;VALUE=DATE:20260715");
    expect(ics).toContain("DTEND;VALUE=DATE:20260716");
  });

  it("sets an exclusive DTEND the day after a multi-day event's inclusive end", () => {
    const ics = buildIcs([makeEvent({ start: "2026-07-13", end: "2026-07-31" })], "en", {
      siteUrl: SITE_URL,
    });
    expect(ics).toContain("DTSTART;VALUE=DATE:20260713");
    expect(ics).toContain("DTEND;VALUE=DATE:20260801");
  });

  it("rolls DTEND over a month boundary", () => {
    const ics = buildIcs([makeEvent({ start: "2026-06-25", end: "2026-06-30" })], "en", {
      siteUrl: SITE_URL,
    });
    expect(ics).toContain("DTEND;VALUE=DATE:20260701");
  });

  it("rolls DTEND over a year boundary", () => {
    const ics = buildIcs([makeEvent({ start: "2026-12-28", end: "2026-12-31" })], "en", {
      siteUrl: SITE_URL,
    });
    expect(ics).toContain("DTEND;VALUE=DATE:20270101");
  });

  it("produces a stable UID derived from the event id and site host", () => {
    const ics = buildIcs([makeEvent({ id: "jul-newbies" })], "en", { siteUrl: SITE_URL });
    expect(ics).toContain("UID:jul-newbies@birsa.example");
  });

  it("uses the localized SUMMARY for each locale", () => {
    const event = makeEvent({ title: { en: "BIR The Newbies", th: "บีไออาร์เดอะนิวบี้ส์" } });
    const en = buildIcs([event], "en", { siteUrl: SITE_URL });
    const th = buildIcs([event], "th", { siteUrl: SITE_URL });
    expect(en).toContain("SUMMARY:BIR The Newbies");
    expect(th).toContain("บีไออาร์เดอะนิวบี้ส์".slice(0, 10));
  });

  it("includes an absolute news URL for the event's locale and slug", () => {
    const ics = buildIcs([makeEvent({ slug: "some-news-post" })], "en", { siteUrl: SITE_URL });
    expect(ics).toContain("https://birsa.example/en/news/some-news-post");
  });

  it("includes CATEGORIES from the event kind", () => {
    const ics = buildIcs([makeEvent({ kind: "university" })], "en", { siteUrl: SITE_URL });
    expect(ics).toContain("CATEGORIES:university");
  });

  it("uses the fixed ICS_REVISION for DTSTAMP and LAST-MODIFIED, never a live clock", () => {
    const expected = ICS_REVISION.replace(/[-:]/g, "");
    const ics = buildIcs([makeEvent({})], "en", { siteUrl: SITE_URL });
    expect(ics).toContain(`DTSTAMP:${expected}`);
    expect(ics).toContain(`LAST-MODIFIED:${expected}`);
  });

  it("is byte-stable across repeated calls (no timestamp drift)", () => {
    const a = buildIcs([makeEvent({})], "en", { siteUrl: SITE_URL });
    const b = buildIcs([makeEvent({})], "en", { siteUrl: SITE_URL });
    expect(a).toBe(b);
  });
});

describe("escapeIcsText", () => {
  it("escapes backslashes, semicolons, commas and newlines per RFC 5545", () => {
    expect(escapeIcsText("a\\b;c,d\ne")).toBe("a\\\\b\\;c\\,d\\ne");
  });

  it("escapes backslashes before other characters so escapes aren't double-escaped", () => {
    expect(escapeIcsText("back\\,slash")).toBe("back\\\\\\,slash");
  });

  it("handles CRLF newlines", () => {
    expect(escapeIcsText("line1\r\nline2")).toBe("line1\\nline2");
  });
});

describe("foldIcsLine", () => {
  it("leaves short lines unfolded", () => {
    const short = "SUMMARY:Short title";
    expect(foldIcsLine(short)).toBe(short);
  });

  it("folds a long ASCII line at 75 octets with a single leading space continuation", () => {
    const longValue = "x".repeat(120);
    const folded = foldIcsLine(`SUMMARY:${longValue}`);
    const segments = folded.split("\r\n");
    expect(segments.length).toBeGreaterThan(1);
    for (const segment of segments.slice(1)) {
      expect(segment.startsWith(" ")).toBe(true);
    }
    // Every physical line must be <= 75 octets.
    const encoder = new TextEncoder();
    for (const segment of segments) {
      expect(encoder.encode(segment).length).toBeLessThanOrEqual(75);
    }
    // Rejoining (stripping the fold: CRLF + space) must reproduce the original.
    const rejoined = segments.map((s, i) => (i === 0 ? s : s.slice(1))).join("");
    expect(rejoined).toBe(`SUMMARY:${longValue}`);
  });

  it("folds multi-byte Thai text without splitting a character across the boundary", () => {
    const longThai = "สวัสดีชาวโลก".repeat(20);
    const folded = foldIcsLine(`SUMMARY:${longThai}`);
    const segments = folded.split("\r\n");
    expect(segments.length).toBeGreaterThan(1);

    const encoder = new TextEncoder();
    const decoder = new TextDecoder("utf-8", { fatal: true });
    for (const segment of segments) {
      const bytes = encoder.encode(segment);
      expect(bytes.length).toBeLessThanOrEqual(75);
      // Decoding must not throw: proves no multi-byte character was split.
      expect(() => decoder.decode(bytes)).not.toThrow();
    }

    const rejoined = segments.map((s, i) => (i === 0 ? s : s.slice(1))).join("");
    expect(rejoined).toBe(`SUMMARY:${longThai}`);
  });
});
