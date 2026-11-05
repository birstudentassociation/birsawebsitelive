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

const pi271 = { code: "PI271", day: 2 as const, start: "09:00", end: "12:00", place: "R.102" };
const las = { code: "LAS101", day: 5 as const, start: "09:00", end: "12:00", section: "036402" };

function vevents(ics: string): string[] {
  return ics.split("BEGIN:VEVENT").slice(1);
}

describe("buildCustomIcs exams", () => {
  it("emits a timed midterm and final for a timetabled class", () => {
    const ics = buildCustomIcs(sel({ categories: ["exams"], classes: [pi271] }), "en", opts);
    expect(ics).toContain("TZID:Asia/Bangkok");
    expect(ics).not.toContain("RRULE");
    const events = vevents(ics);
    expect(events).toHaveLength(2);
    const [midterm, final] = events as [string, string];
    expect(midterm).toContain("UID:exam-2569-2-PI271-midterm@birsa.example");
    expect(midterm).toContain("DTSTART;TZID=Asia/Bangkok:20270223T090000");
    expect(midterm).toContain("DTEND;TZID=Asia/Bangkok:20270223T110000");
    expect(midterm).toContain("SUMMARY:Midterm PI271 Introduction to International Relations");
    expect(midterm).not.toContain("LOCATION");
    expect(final).toContain("UID:exam-2569-2-PI271-final@birsa.example");
    expect(final).toContain("DTSTART;TZID=Asia/Bangkok:20270518T090000");
    expect(final).toContain("DTEND;TZID=Asia/Bangkok:20270518T120000");
    expect(final).toContain("SUMMARY:Final PI271 Introduction to International Relations");
    expect(final).toContain("LOCATION:R.103");
  });

  it("writes Thai summaries and Thai room names", () => {
    const ics = buildCustomIcs(sel({ categories: ["exams"], classes: [pi271] }), "th", opts);
    expect(ics.replace(/\r\n /g, "")).toContain(
      "SUMMARY:สอบกลางภาค PI271 Introduction to International Relations"
    );
    expect(ics.replace(/\r\n /g, "")).toContain(
      "SUMMARY:สอบปลายภาค PI271 Introduction to International Relations"
    );
    expect(ics.replace(/\r\n /g, "")).toContain("LOCATION:ร.103");
  });

  it("picks the exam room for the chosen section and notes both PI320 rooms", () => {
    const sectioned = buildCustomIcs(sel({ categories: ["exams"], classes: [las] }), "en", opts);
    expect(sectioned).toContain("UID:exam-2569-2-LAS101-036402-final@birsa.example");
    expect(sectioned.replace(/\r\n /g, "")).toContain(
      "SUMMARY:Final LAS101 Critical Thinking\\, Reading\\, and Writing section 036402"
    );
    expect(sectioned.replace(/\r\n /g, "")).toContain("LOCATION:R.406");
    expect(sectioned).not.toContain("036401");
    const pi320 = buildCustomIcs(
      sel({ categories: ["exams"], classes: [{ ...pi271, code: "PI320" }] }),
      "en",
      opts
    );
    expect(pi320.replace(/\r\n /g, "")).toContain("LOCATION:Group 1 R.405\\, group 2 R.406");
  });

  it("skips classes the timetable cannot resolve", () => {
    const ics = buildCustomIcs(
      sel({
        categories: ["exams"],
        classes: [
          { ...las, section: undefined },
          { ...pi271, code: "PI300" },
        ],
      }),
      "en",
      opts
    );
    expect(ics).not.toContain("BEGIN:VEVENT");
    expect(ics).not.toContain("VTIMEZONE");
  });

  it("does not need the classes category, and classes do not need exams", () => {
    const both = buildCustomIcs(
      sel({ categories: ["classes", "exams"], classes: [pi271] }),
      "en",
      opts
    );
    expect(vevents(both)).toHaveLength(3);
    expect(both.match(/BEGIN:VTIMEZONE/g)).toHaveLength(1);
    const classesOnly = buildCustomIcs(
      sel({ categories: ["classes"], classes: [pi271] }),
      "en",
      opts
    );
    expect(vevents(classesOnly)).toHaveLength(1);
    expect(classesOnly).not.toContain("exam-2569-2");
  });

  it("is deterministic with stable UIDs", () => {
    const make = () =>
      buildCustomIcs(sel({ categories: ["exams"], classes: [pi271, las] }), "en", opts);
    expect(make()).toBe(make());
    const uids = make().match(/^UID:.*$/gm) ?? [];
    expect(new Set(uids).size).toBe(uids.length);
  });
});

describe("buildCustomIcs for semester 1", () => {
  const s1 = { code: "PI300", day: 3 as const, start: "10:00", end: "11:00", place: "Room 5" };

  it("repeats from 3 August to 21 November and keeps a section in the UID", () => {
    const ics = buildCustomIcs(sel({ term: "2569-1", classes: [s1] }), "en", opts);
    expect(ics).toContain("DTSTART;TZID=Asia/Bangkok:20260805T100000");
    expect(ics).toContain("RRULE:FREQ=WEEKLY;UNTIL=20261121T165959Z");
    expect(ics).toContain("UID:class-2569-1-PI300-3-1000@birsa.example");
    expect(ics).not.toContain("exam-");
  });

  it("skips semester 1 noClasses days on the class weekday only", () => {
    const wed = buildCustomIcs(sel({ term: "2569-1", classes: [s1] }), "en", opts);
    const skipped = (wed.match(/EXDATE;TZID=Asia\/Bangkok:(\d{8})/g) ?? []).map((l) => l.slice(-8));
    const expected = calendarEvents
      .filter((e) => e.noClasses && e.start >= "2026-08-03" && e.start <= "2026-11-21")
      .flatMap((e) => {
        const days: string[] = [];
        for (
          let d = new Date(`${e.start}T00:00:00Z`);
          d <= new Date(`${e.end ?? e.start}T00:00:00Z`);
          d = new Date(d.getTime() + 86_400_000)
        ) {
          if (d.getUTCDay() === 3) days.push(d.toISOString().slice(0, 10).replace(/-/g, ""));
        }
        return days;
      })
      .sort();
    expect(skipped).toEqual(expected);
    // Semester 2 holidays never leak into semester 1.
    expect(skipped.every((d) => d <= "20261121")).toBe(true);
    expect(wed).toContain("EXDATE;TZID=Asia/Bangkok:20260812T100000"); // Mother's Day, a Wednesday
    const tue = buildCustomIcs(sel({ term: "2569-1", classes: [{ ...s1, day: 2 }] }), "en", opts);
    expect(tue).toContain("EXDATE;TZID=Asia/Bangkok:20261013T100000");
    expect(tue).not.toContain("20260812");
  });
});
