import { describe, expect, it } from "vitest";
import { calendarEvents } from "@/content/calendar/events";
import { buildCustomIcs } from "@/lib/calendar-builder/feed";
import type { Selection } from "@/lib/calendar-builder/selection";
import { ICS_REVISION, foldIcsLine } from "@/lib/ics";

const opts = { siteUrl: "https://birsa.example" };

function sel(over: Partial<Selection>): Selection {
  return { categories: ["classes"], term: "2569-2", classes: [], ...over };
}

const monday = { code: "PI271", day: 1 as const, start: "09:30", end: "12:20", place: "Room 301" };

describe("buildCustomIcs", () => {
  it("returns a valid empty calendar for an empty selection", () => {
    const ics = buildCustomIcs(sel({ categories: [] }), "en", opts);
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.trimEnd().endsWith("END:VCALENDAR")).toBe(true);
    expect(ics).not.toContain("BEGIN:VEVENT");
    expect(ics).not.toContain("VTIMEZONE");
  });

  it("includes only the chosen categories' all-day events", () => {
    const ics = buildCustomIcs(sel({ categories: ["birsa"] }), "en", opts);
    const birsa = calendarEvents.filter((e) => e.kind === "birsa" && !e.academic);
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(birsa.length);
    expect(ics).toContain("DTSTART;VALUE=DATE:");
    expect(ics).not.toContain("VTIMEZONE");
  });

  it("starts a Monday class on the first Monday of term with weekly recurrence to term end", () => {
    const ics = buildCustomIcs(sel({ classes: [monday] }), "en", opts);
    expect(ics).toContain("DTSTART;TZID=Asia/Bangkok:20270104T093000");
    expect(ics).toContain("DTEND;TZID=Asia/Bangkok:20270104T122000");
    expect(ics).toContain("RRULE:FREQ=WEEKLY;UNTIL=20270501T165959Z");
    expect(ics).toContain("LOCATION:Room 301");
  });

  it("moves the first occurrence to the matching weekday on or after term start", () => {
    const wed = buildCustomIcs(sel({ classes: [{ ...monday, day: 3 }] }), "en", opts);
    expect(wed).toContain("DTSTART;TZID=Asia/Bangkok:20270106T093000");
    const sun = buildCustomIcs(sel({ classes: [{ ...monday, day: 7 }] }), "en", opts);
    expect(sun).toContain("DTSTART;TZID=Asia/Bangkok:20270110T093000");
  });

  it("excludes noClasses days on the class weekday only", () => {
    const mon = buildCustomIcs(sel({ classes: [monday] }), "en", opts);
    // Makha Bucha substitute (Mon 22 Feb) and Songkran week Monday (12 Apr).
    expect(mon).toContain("EXDATE;TZID=Asia/Bangkok:20270222T093000");
    expect(mon).toContain("EXDATE;TZID=Asia/Bangkok:20270412T093000");
    // Chakri Day, Tue 6 Apr, is not a Monday.
    expect(mon).not.toContain("EXDATE;TZID=Asia/Bangkok:20270406");
    expect(mon.match(/EXDATE/g)).toHaveLength(2);
    const tue = buildCustomIcs(sel({ classes: [{ ...monday, day: 2 }] }), "en", opts);
    expect(tue).toContain("EXDATE;TZID=Asia/Bangkok:20270406T093000");
    expect(tue).toContain("EXDATE;TZID=Asia/Bangkok:20270413T093000");
    // 2026 holidays are outside the term.
    expect(tue).not.toContain("EXDATE;TZID=Asia/Bangkok:2026");
  });

  it("includes one VTIMEZONE when classes exist", () => {
    const ics = buildCustomIcs(sel({ classes: [monday, { ...monday, day: 2 }] }), "en", opts);
    expect(ics.match(/BEGIN:VTIMEZONE/g)).toHaveLength(1);
    expect(ics).toContain("TZID:Asia/Bangkok");
  });

  it("gives stable UIDs and DTSTAMP from the revision", () => {
    const a = buildCustomIcs(sel({ classes: [monday] }), "en", opts);
    const b = buildCustomIcs(sel({ classes: [monday] }), "en", opts);
    expect(a).toBe(b);
    expect(a).toContain("UID:class-2569-2-PI271-1-0930@birsa.example");
    expect(a).toContain(`DTSTAMP:${ICS_REVISION.replace(/[-:]/g, "")}`);
  });

  it("uses the curriculum title when known and the bare code otherwise", () => {
    const known = buildCustomIcs(sel({ classes: [monday] }), "en", opts);
    expect(known).toMatch(/SUMMARY:PI271 \S/);
    const unknown = buildCustomIcs(sel({ classes: [{ ...monday, code: "ZZ999" }] }), "en", opts);
    expect(unknown).toContain("SUMMARY:ZZ999\r\n");
  });

  it("omits classes when the category is off or the term is unknown", () => {
    expect(buildCustomIcs(sel({ categories: [], classes: [monday] }), "en", opts)).not.toContain(
      "RRULE"
    );
    const none = buildCustomIcs(sel({ term: "2000-1", classes: [monday] }), "en", opts);
    expect(none).not.toContain("RRULE");
    const fallback = buildCustomIcs(sel({ term: "2000-1", classes: [monday] }), "en", {
      ...opts,
      todayKey: "2026-11-05",
    });
    expect(fallback).toContain("RRULE");
  });

  it("folds long lines to 75 octets and uses CRLF", () => {
    const ics = buildCustomIcs(
      sel({ classes: [{ ...monday, place: "ห้องเรียนรวมชั้นสามอาคารเรียนรวม" }] }),
      "th",
      opts
    );
    expect(ics).not.toMatch(/[^\r]\n/);
    const enc = new TextEncoder();
    for (const l of ics.split("\r\n")) expect(enc.encode(l).length).toBeLessThanOrEqual(75);
    expect(ics).toContain(foldIcsLine("LOCATION:ห้องเรียนรวมชั้นสามอาคารเรียนรวม"));
  });
});
