import { describe, expect, it } from "vitest";
import type { CalendarEvent } from "@/content/calendar/events";
import { currentOrNextTeachingTerm } from "@/content/calendar/terms";
import {
  DEFAULT_CATEGORIES,
  MAX_CLASSES,
  MAX_PLACE_LENGTH,
  decodeSelection,
  encodeSelection,
  eventsForCategories,
  feedPath,
  validateClassSlot,
  type Selection,
} from "@/lib/calendar-builder/selection";

const base = { code: "PI271", day: 1, start: "09:30", end: "12:20" };

function ev(id: string, over: Partial<CalendarEvent>): CalendarEvent {
  return { id, start: "2026-07-15", title: { en: id, th: id }, slug: id, kind: "birsa", ...over };
}

describe("validateClassSlot", () => {
  it("accepts a valid slot", () => {
    expect(validateClassSlot(base)).toEqual([]);
    expect(validateClassSlot({ ...base, code: " pi271 ", place: "Room 301" })).toEqual([]);
  });
  it("reports each problem", () => {
    expect(validateClassSlot({ ...base, code: "" })).toEqual(["code-missing"]);
    expect(validateClassSlot({ ...base, code: "X1" })).toEqual(["code-invalid"]);
    expect(validateClassSlot({ ...base, day: undefined })).toEqual(["day-missing"]);
    expect(validateClassSlot({ ...base, day: 8 })).toEqual(["day-missing"]);
    expect(validateClassSlot({ ...base, start: "9:30" })).toEqual(["start-invalid"]);
    expect(validateClassSlot({ ...base, end: "25:00" })).toEqual(["end-invalid"]);
    expect(validateClassSlot({ ...base, end: "09:30" })).toEqual(["end-before-start"]);
    expect(validateClassSlot({ ...base, end: "08:00" })).toEqual(["end-before-start"]);
    expect(validateClassSlot({ ...base, place: "x".repeat(MAX_PLACE_LENGTH + 1) })).toEqual([
      "place-too-long",
    ]);
  });
});

describe("eventsForCategories", () => {
  const events = [
    ev("b", { kind: "birsa" }),
    ev("h", { kind: "university" }),
    ev("r", {
      kind: "university",
      academic: { window: "registration", term: { year: 2569, semester: 2 } },
    }),
  ];
  it("filters by category and keeps order", () => {
    expect(eventsForCategories(events, ["birsa"]).map((e) => e.id)).toEqual(["b"]);
    expect(eventsForCategories(events, ["holidays"]).map((e) => e.id)).toEqual(["h"]);
    expect(eventsForCategories(events, ["registration"]).map((e) => e.id)).toEqual(["r"]);
    expect(eventsForCategories(events, ["classes"])).toEqual([]);
    expect(eventsForCategories(events, [...DEFAULT_CATEGORIES]).map((e) => e.id)).toEqual([
      "b",
      "h",
      "r",
    ]);
  });
});

describe("encode and decode", () => {
  const selection: Selection = {
    categories: ["birsa", "classes"],
    term: "2569-2",
    classes: [
      { code: "PI271", day: 1, start: "09:30", end: "12:20", place: "Room 301" },
      { code: "PI300A", day: 7, start: "08:00", end: "09:00" },
    ],
  };

  it("round-trips", () => {
    const params = encodeSelection(selection);
    expect(params.get("inc")).toBe("birsa,classes");
    expect(params.getAll("c")[0]).toBe("PI271~1~0930~1220~Room 301");
    expect(decodeSelection(new URLSearchParams(params.toString()))).toEqual(selection);
  });

  it("round-trips a place containing ~ and non-ASCII text", () => {
    const s: Selection = {
      ...selection,
      classes: [{ ...base, day: 2, place: "ห้อง ~ 3&4" } as Selection["classes"][number]],
    };
    expect(decodeSelection(new URLSearchParams(encodeSelection(s).toString()))).toEqual(s);
  });

  it("uses defaults when inc is absent and none when empty", () => {
    expect(decodeSelection(new URLSearchParams()).categories).toEqual([...DEFAULT_CATEGORIES]);
    expect(decodeSelection(new URLSearchParams("inc=")).categories).toEqual([]);
  });

  it("drops unknown categories, malformed slots and extras without throwing", () => {
    const params = new URLSearchParams();
    params.set("inc", "birsa,bogus,holidays");
    params.set("term", "nonsense");
    params.append("c", "garbage");
    params.append("c", "PI271~9~0930~1220~");
    params.append("c", "PI271~1~1220~0930~");
    params.append("c", "pi271~1~0930~1220~");
    const out = decodeSelection(params);
    expect(out.categories).toEqual(["birsa", "holidays"]);
    expect(out.term).toBe("2569-2");
    expect(out.classes).toEqual([{ code: "PI271", day: 1, start: "09:30", end: "12:20" }]);
  });

  it("caps classes at MAX_CLASSES", () => {
    const params = new URLSearchParams();
    for (let i = 0; i < MAX_CLASSES + 5; i++) params.append("c", `PI${100 + i}~1~0900~1000~`);
    expect(decodeSelection(params).classes).toHaveLength(MAX_CLASSES);
  });

  it("builds the feed path", () => {
    const path = feedPath("th", selection);
    expect(path.startsWith("/th/my-calendar.ics?inc=birsa%2Cclasses&term=2569-2&c=")).toBe(true);
  });
});

describe("currentOrNextTeachingTerm", () => {
  it("returns the term before, during, and null after", () => {
    expect(currentOrNextTeachingTerm("2026-11-05")?.start).toBe("2027-01-04");
    expect(currentOrNextTeachingTerm("2027-03-01")?.end).toBe("2027-05-01");
    expect(currentOrNextTeachingTerm("2027-05-01")?.end).toBe("2027-05-01");
    expect(currentOrNextTeachingTerm("2027-05-02")).toBeNull();
  });
});
