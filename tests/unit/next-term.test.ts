import { describe, expect, it } from "vitest";
import {
  getJourneyPhase,
  getNextTermJourney,
  shouldShowJourneyChip,
  type NextTermJourney,
} from "@/lib/next-term";
import { keyDateRows, nextTermCopy, nextTermSteps } from "@/content/next-term";

function journeyOn(todayKey: string): NextTermJourney {
  const journey = getNextTermJourney(todayKey);
  if (!journey) throw new Error(`no journey on ${todayKey}`);
  return journey;
}

describe("getNextTermJourney", () => {
  it("picks semester 2 with its recorded windows in November 2026", () => {
    const journey = journeyOn("2026-11-10");
    expect(journey.termKey).toBe("2569-2");
    expect(journey.teachingStart).toBe("2027-01-04");
    expect(journey.registration).toEqual({ start: "2026-11-30", end: "2026-12-04" });
    expect(journey.payment).toEqual({ start: "2026-11-30", end: "2027-01-01" });
    expect(journey.addDrop).toEqual({ start: "2027-01-04", end: "2027-01-17" });
    expect(journey.journeyEnd).toBe("2027-01-17");
  });

  it("keeps the journey open until add-drop closes", () => {
    expect(journeyOn("2027-01-17").termKey).toBe("2569-2");
  });

  it("returns null once every recorded term has passed", () => {
    expect(getNextTermJourney("2027-06-01")).toBeNull();
  });
});

describe("getJourneyPhase", () => {
  const journey = journeyOn("2026-11-10");

  it.each([
    ["2026-11-10", "beforeRegistration", "2026-11-30"],
    ["2026-11-30", "registrationOpen", "2026-12-04"],
    ["2026-12-04", "registrationOpen", "2026-12-04"],
    ["2026-12-20", "beforeAddDrop", "2027-01-04"],
    ["2027-01-10", "addDropOpen", "2027-01-17"],
  ])("on %s is %s until %s", (today, kind, date) => {
    expect(getJourneyPhase(journey, today)).toEqual({ kind, date });
  });
});

describe("shouldShowJourneyChip", () => {
  const journey = journeyOn("2026-11-10");

  it("shows from six weeks before registration until add-drop closes", () => {
    expect(shouldShowJourneyChip(journey, "2026-10-19")).toBe(true);
    expect(shouldShowJourneyChip(journey, "2026-10-18")).toBe(false);
    expect(shouldShowJourneyChip(journey, "2027-01-17")).toBe(true);
    expect(shouldShowJourneyChip(journey, "2027-01-18")).toBe(false);
  });
});

describe("next term copy", () => {
  const journey = journeyOn("2026-11-10");

  it("states the phase in both languages", () => {
    const phase = getJourneyPhase(journey, "2026-11-10");
    expect(nextTermCopy.en.phase(phase)).toBe("Registration opens Monday 30 November");
    expect(nextTermCopy.th.phase(phase)).toBe("เปิดลงทะเบียนวันจันทร์ที่ 30 พฤศจิกายน");
  });

  it("lists every key date", () => {
    expect(keyDateRows("en", journey).map((row) => row.value)).toEqual([
      "Monday 30 November to Friday 4 December",
      "Monday 30 November to Friday 1 January",
      "Monday 4 January to Sunday 17 January",
      "Monday 4 January",
    ]);
  });

  it("walks from planning to add-drop with matching steps in both languages", () => {
    const en = nextTermSteps("en", journey);
    const th = nextTermSteps("th", journey);
    expect(en.map((step) => step.id)).toEqual([
      "needs",
      "choose",
      "check",
      "register",
      "pay",
      "add-drop",
    ]);
    expect(th.map((step) => step.id)).toEqual(en.map((step) => step.id));
    expect(en[1]?.tasks[0]?.href).toBe("/news/bir-timetable-semester-2-2569");
    expect(en[3]?.blurb).toBe(
      "Registration for semester 2 runs from Monday 30 November to Friday 4 December."
    );
    for (const step of [...en, ...th]) {
      expect(step.title).not.toMatch(/[:–—]/);
      expect(step.blurb ?? "").not.toMatch(/[–—]/);
    }
  });
});
