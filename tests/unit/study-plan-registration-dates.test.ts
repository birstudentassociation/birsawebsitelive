/**
 * Registration and add-drop dates for the terms in a plan. The calendar holds
 * none today (BIRSA announces BIR's dates separately), so what is tested is
 * the mechanism: which events count, how the planned terms are worked out, how
 * the term list in the export link is read back, and what the export route
 * answers with and without dates. Fixtures stand in for the dates; none of
 * them are real.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CalendarEvent } from "@/content/calendar/events";

const calendar = vi.hoisted(() => ({ events: [] as unknown[] }));

vi.mock("@/content/calendar/events", async () => {
  const actual = await vi.importActual<typeof import("@/content/calendar/events")>(
    "@/content/calendar/events"
  );
  return {
    ...actual,
    get calendarEvents() {
      return calendar.events;
    },
  };
});
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NOT_FOUND");
  },
}));

import { GET } from "@/app/[lang]/services/study-plan/plan/registration.ics/route";
import type { StudyPlan } from "@/lib/study-plan/plan";
import {
  encodeTermsParam,
  MAX_EXPORT_TERMS,
  parseTermsParam,
  plannedAcademicTerms,
  registrationEventsFor,
} from "@/lib/study-plan/registrationDates";

function event(overrides: Partial<CalendarEvent>): CalendarEvent {
  return {
    id: "fixture",
    start: "2027-07-12",
    end: "2027-07-16",
    title: { en: "Fixture window", th: "ช่วงเวลาทดสอบ" },
    slug: "fixture-post",
    kind: "birsa",
    academic: { window: "registration", term: { year: 2570, semester: 1 } },
    ...overrides,
  };
}

const registration1 = event({ id: "reg-s1" });
const addDrop1 = event({
  id: "drop-s1",
  start: "2027-08-02",
  end: "2027-08-06",
  academic: { window: "add-drop", term: { year: 2570, semester: 1 } },
});
const registration2 = event({
  id: "reg-s2",
  start: "2027-12-06",
  academic: { window: "registration", term: { year: 2570, semester: 2 } },
});
const summerWindow = event({
  id: "reg-summer",
  start: "2028-04-03",
  academic: { window: "registration", term: { year: 2570, semester: "summer" } },
});
const untagged = event({
  id: "untagged",
  title: { en: "Registration week party", th: "งานเลี้ยงสัปดาห์ลงทะเบียน" },
  academic: undefined,
});

const plan: StudyPlan = {
  versionId: "2568",
  cohort: "68",
  startYear: 2568,
  minorId: "governance",
  passed: [],
  freeElectiveCreditsPassed: 0,
  terms: [
    { term: { year: 3, kind: "semester2" }, codes: ["PI376"], freeElectiveCredits: 0 },
    { term: { year: 3, kind: "semester1" }, codes: ["PI364"], freeElectiveCredits: 0 },
    { term: { year: 3, kind: "summer" }, codes: [], freeElectiveCredits: 0 },
    { term: { year: 4, kind: "semester1" }, codes: [], freeElectiveCredits: 3 },
  ],
};

beforeEach(() => {
  calendar.events = [];
});

describe("plannedAcademicTerms", () => {
  it("turns each term with something in it into the calendar term, earliest first", () => {
    expect(plannedAcademicTerms(plan)).toEqual([
      { year: 2570, semester: 1 },
      { year: 2570, semester: 2 },
      { year: 2571, semester: 1 },
    ]);
  });

  it("leaves out a term the student opened but left empty", () => {
    const keys = plannedAcademicTerms(plan).map((t) => `${t.year}-${t.semester}`);
    expect(keys).not.toContain("2570-summer");
  });

  it("is empty for a plan with nothing planned", () => {
    expect(plannedAcademicTerms({ ...plan, terms: [] })).toEqual([]);
  });
});

describe("the term list in the export link", () => {
  it("round-trips", () => {
    const terms = plannedAcademicTerms(plan);
    expect(encodeTermsParam(terms)).toBe("2570-1,2570-2,2571-1");
    expect(parseTermsParam(encodeTermsParam(terms))).toEqual(terms);
    expect(parseTermsParam("2570-summer")).toEqual([{ year: 2570, semester: "summer" }]);
  });

  it("drops anything that is not a term, folds repeats and survives rubbish", () => {
    expect(parseTermsParam("2570-1,nope,2570-3,,2570-1, 2570-2 ,<script>")).toEqual([
      { year: 2570, semester: 1 },
      { year: 2570, semester: 2 },
    ]);
    for (const empty of [null, undefined, "", ",", "x"]) {
      expect(parseTermsParam(empty), String(empty)).toEqual([]);
    }
  });

  it("caps how many terms one link may name", () => {
    const many = Array.from({ length: 100 }, (_, i) => `${2500 + i}-1`).join(",");
    expect(parseTermsParam(many)).toHaveLength(MAX_EXPORT_TERMS);
  });
});

describe("registrationEventsFor", () => {
  const all = [summerWindow, untagged, registration2, addDrop1, registration1];

  it("keeps the windows for the planned terms and puts the earliest first", () => {
    const events = registrationEventsFor(all, [
      { year: 2570, semester: 1 },
      { year: 2570, semester: 2 },
    ]);
    expect(events.map((e) => e.id)).toEqual(["reg-s1", "drop-s1", "reg-s2"]);
  });

  it("leaves out windows for terms that are not in the plan", () => {
    const events = registrationEventsFor(all, [{ year: 2570, semester: 2 }]);
    expect(events.map((e) => e.id)).toEqual(["reg-s2"]);
  });

  it("matches the summer session as a term of its own", () => {
    const events = registrationEventsFor(all, [{ year: 2570, semester: "summer" }]);
    expect(events.map((e) => e.id)).toEqual(["reg-summer"]);
  });

  it("never returns an event that is not tagged as a window, however it is titled", () => {
    const events = registrationEventsFor(all, [
      { year: 2570, semester: 1 },
      { year: 2570, semester: 2 },
      { year: 2570, semester: "summer" },
    ]);
    expect(events.map((e) => e.id)).not.toContain("untagged");
  });

  it("is empty when no terms are asked for or the calendar holds none", () => {
    expect(registrationEventsFor(all, [])).toEqual([]);
    expect(registrationEventsFor([untagged], [{ year: 2570, semester: 1 }])).toEqual([]);
    expect(registrationEventsFor([], [{ year: 2570, semester: 1 }])).toEqual([]);
  });
});

describe("the calendar as it stands", () => {
  // The real content, not the fixtures the rest of this file mocks in.
  const realCalendar = async () =>
    (await vi.importActual<typeof import("@/content/calendar/events")>("@/content/calendar/events"))
      .calendarEvents;

  it("holds the calendar at all", async () => {
    expect((await realCalendar()).length).toBeGreaterThan(10);
  });

  it("tags a window only with a known kind and a real term", async () => {
    for (const entry of await realCalendar()) {
      if (!entry.academic) continue;
      expect(["registration", "add-drop"], entry.id).toContain(entry.academic.window);
      expect(entry.academic.term.year, entry.id).toBeGreaterThan(2500);
      expect(["1", "2", "summer"], entry.id).toContain(String(entry.academic.term.semester));
    }
  });

  it("does not present any untagged event as a registration window", async () => {
    const planned = [
      { year: 2569, semester: 1 as const },
      { year: 2569, semester: 2 as const },
      { year: 2570, semester: 1 as const },
    ];
    for (const found of registrationEventsFor(await realCalendar(), planned)) {
      expect(found.academic).toBeDefined();
    }
  });
});

describe("the registration.ics route", () => {
  const params = (lang: string) => ({ params: Promise.resolve({ lang }) });
  const request = (terms: string) =>
    new Request(
      `https://birsa.example/en/services/study-plan/plan/registration.ics?terms=${terms}`
    );

  it("answers with a calendar of only the windows for the terms asked for", async () => {
    calendar.events = [registration1, addDrop1, registration2, untagged];
    const response = await GET(request("2570-1"), params("en"));
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/calendar; charset=utf-8");
    expect(response.headers.get("content-disposition")).toContain(
      "birsa-registration-dates-en.ics"
    );
    const body = await response.text();
    expect(body).toContain("BEGIN:VCALENDAR\r\n");
    expect(body).toContain("UID:reg-s1@");
    expect(body).toContain("UID:drop-s1@");
    expect(body).not.toContain("UID:reg-s2@");
    expect(body).not.toContain("UID:untagged@");
    expect(body).toContain("DTSTART;VALUE=DATE:20270712");
    expect(body).toContain("DTEND;VALUE=DATE:20270717");
    expect(body).toContain("X-WR-CALNAME:BIRSA registration and add-drop dates");
  });

  it("names the calendar in Thai for a Thai reader", async () => {
    calendar.events = [registration1];
    const body = await (await GET(request("2570-1"), params("th"))).text();
    expect(body).toMatch(/X-WR-CALNAME:วันลงทะเบียน/);
    expect(body).toContain("SUMMARY:ช่วงเวลาทดสอบ");
  });

  it("answers 404 with a sentence, not an empty calendar, when the calendar holds none", async () => {
    calendar.events = [untagged];
    const response = await GET(request("2570-1"), params("en"));
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(await response.text()).toMatch(/has not recorded registration or add-drop dates/);
  });

  it("answers 404 for terms it cannot read, and for no terms at all", async () => {
    calendar.events = [registration1];
    expect((await GET(request("garbage"), params("en"))).status).toBe(404);
    expect((await GET(new Request("https://birsa.example/en/x.ics"), params("en"))).status).toBe(
      404
    );
  });

  it("does not know any other language", async () => {
    await expect(GET(request("2570-1"), params("fr"))).rejects.toThrow("NOT_FOUND");
  });
});
