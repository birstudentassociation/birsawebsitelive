import { describe, expect, it } from "vitest";
import { academicCalendar2569 } from "@/content/calendar/academic-2569";
import {
  barPosition,
  buildAcademicIcs,
  formatItemDate,
  formatMonthSpan,
  itemStatus,
  periodsForTrack,
  timelineAxis,
} from "@/lib/academic-calendar";
import { eventWhenFull } from "@/lib/event-when";

describe("academic calendar 2569", () => {
  it("has valid, ordered dates with unique ids", () => {
    const ids = new Set<string>();
    for (const period of academicCalendar2569) {
      for (const item of period.items) {
        expect(item.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        if (item.end) expect(item.end >= item.start, item.id).toBe(true);
        expect(ids.has(item.id), item.id).toBe(false);
        ids.add(item.id);
      }
    }
  });

  it("shows one semester 2 for each track", () => {
    expect(periodsForTrack(academicCalendar2569, "bir").map((p) => p.id)).toEqual([
      "s1",
      "s2-bir",
      "summer",
      "holidays",
      "i-grade",
    ]);
    expect(periodsForTrack(academicCalendar2569, "registrar").map((p) => p.id)).toContain("s2-reg");
  });

  it("works out what is on now and what is coming up", () => {
    const item = { start: "2026-10-27", end: "2026-11-22" };
    expect(itemStatus(item, "2026-11-08")).toEqual({ kind: "now", daysLeft: 14 });
    expect(itemStatus(item, "2026-10-20")).toEqual({ kind: "upcoming", daysUntil: 7 });
    expect(itemStatus(item, "2026-11-23")).toEqual({ kind: "past" });
  });

  it("formats dates in each language, with Buddhist Era years in Thai", () => {
    expect(formatItemDate("en", { start: "2026-08-03" })).toBe("Mon 3 August");
    expect(formatItemDate("en", { start: "2026-08-03", end: "2026-08-16" })).toBe("3 to 16 August");
    expect(formatItemDate("en", { start: "2026-11-30", end: "2027-01-01" })).toBe(
      "30 November 2026 to 1 January 2027"
    );
    expect(formatItemDate("th", { start: "2026-08-19", end: "2026-10-26" })).toBe(
      "19 สิงหาคม ถึง 26 ตุลาคม"
    );
    expect(formatMonthSpan("th", "2026-08-03", "2026-12-11")).toBe("สิงหาคม ถึง ธันวาคม 2569");
  });

  it("places bars inside the timeline", () => {
    for (const period of academicCalendar2569) {
      const axis = timelineAxis(period);
      for (const item of period.items) {
        const bar = barPosition(axis, item);
        expect(bar.left).toBeGreaterThanOrEqual(0);
        expect(bar.left + bar.width).toBeLessThanOrEqual(100.0001);
      }
    }
  });

  it("exports all-day events with an exclusive end date", () => {
    const period = academicCalendar2569[0]!;
    const ics = buildAcademicIcs(
      [{ item: period.items.find((i) => i.id === "s1-finals")!, period }],
      "en",
      "https://example.com",
      "Calendar"
    );
    expect(ics).toContain("DTSTART;VALUE=DATE:20261123");
    expect(ics).toContain("DTEND;VALUE=DATE:20261212");
    expect(ics).toContain("UID:ac2569-s1-finals@example.com");
  });
});

describe("event dates on the page", () => {
  it("shows the date with the time range", () => {
    expect(eventWhenFull("en", "2026-11-11T07:00:00.000Z", "2026-11-11T10:30:00.000Z")).toBe(
      "11 November 2026, 14:00 to 17:30"
    );
    expect(eventWhenFull("en", "2026-08-11T00:00:00+07:00", "2026-08-19T23:59:00+07:00")).toBe(
      "11 August 2026 to 19 August 2026"
    );
  });
});
