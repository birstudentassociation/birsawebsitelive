import { describe, expect, it } from "vitest";
import {
  ARRIVING_THRESHOLD_SECONDS,
  formatWait,
  legacyBusNumber,
  noticeBusRoutes,
  parseStopEta,
  selectNoticeRoutes,
  THA_PRACHAN_OPPOSITE_STOP_ID,
  type StopEtaEntry,
} from "@/lib/shuttle-live";

/**
 * A trimmed slice of a real `/front/stop-eta/1061` response: the three notice
 * routes plus unrelated routes that must be filtered out. Route 53 arrives
 * imminently, route 15 has two live buses (one air-con), and route 43 is
 * present but has no live estimate (waitTime 0).
 */
const sampleData: StopEtaEntry[] = [
  { name: "2-11 (64)", hasGps: true, waitTime: 1, airCondition: true },
  { name: "2-9 (53L) ", hasGps: true, waitTime: 40, airCondition: false },
  { name: "4-2 (15)", hasGps: true, waitTime: 858, airCondition: false },
  { name: "4-2 (15)", hasGps: true, waitTime: 3530, airCondition: true },
  { name: "1", hasGps: true, waitTime: 698, airCondition: true },
  { name: "203", hasGps: false, waitTime: 0, airCondition: false },
  { name: "4-11 (43)", hasGps: true, waitTime: 0, airCondition: true },
];

describe("stop constant", () => {
  it("targets the Opposite Tha Prachan stop", () => {
    expect(THA_PRACHAN_OPPOSITE_STOP_ID).toBe(1061);
  });
});

describe("legacyBusNumber", () => {
  it("reads the legacy number out of a parenthetical, dropping a direction suffix", () => {
    expect(legacyBusNumber("2-9 (53L) ")).toBe("53");
    expect(legacyBusNumber("2-9 (53R)")).toBe("53");
    expect(legacyBusNumber("4-2 (15)")).toBe("15");
    expect(legacyBusNumber("4-11 (43)")).toBe("43");
  });

  it("returns null for labels with no parenthetical or non-string input", () => {
    expect(legacyBusNumber("203")).toBeNull();
    expect(legacyBusNumber("1-9E")).toBeNull();
    expect(legacyBusNumber(undefined)).toBeNull();
    expect(legacyBusNumber(42)).toBeNull();
  });
});

describe("selectNoticeRoutes", () => {
  it("returns exactly the three notice routes in order, even when some are empty", () => {
    const routes = selectNoticeRoutes(sampleData);
    expect(routes.map((r) => r.number)).toEqual(["53", "43", "15"]);
    expect(routes.map((r) => r.number)).toEqual(noticeBusRoutes.map((r) => r.number));
  });

  it("keeps only GPS-backed arrivals with a positive wait, soonest first", () => {
    const routes = selectNoticeRoutes(sampleData);
    const byNumber = Object.fromEntries(routes.map((r) => [r.number, r]));

    expect(byNumber["53"]!.arrivals).toEqual([{ waitSeconds: 40, airCondition: false }]);
    expect(byNumber["15"]!.arrivals).toEqual([
      { waitSeconds: 858, airCondition: false },
      { waitSeconds: 3530, airCondition: true },
    ]);
    // waitTime 0 is "no live estimate" in this feed, not "arriving now".
    expect(byNumber["43"]!.arrivals).toEqual([]);
  });

  it("drops routes not in the notice set", () => {
    const routes = selectNoticeRoutes(sampleData);
    const numbers = routes.map((r) => r.number);
    expect(numbers).not.toContain("64");
    expect(numbers).not.toContain("1");
  });

  it("ignores entries missing hasGps regardless of wait time", () => {
    const routes = selectNoticeRoutes([{ name: "4-11 (43)", waitTime: 120 }]);
    expect(routes.find((r) => r.number === "43")!.arrivals).toEqual([]);
  });
});

describe("parseStopEta", () => {
  it("reads the data array from the upstream envelope", () => {
    const routes = parseStopEta({ code: 200, message: "OK", data: sampleData });
    expect(routes.find((r) => r.number === "53")!.arrivals).toHaveLength(1);
  });

  it("yields empty routes for a malformed or error payload rather than throwing", () => {
    for (const bad of [null, undefined, {}, { data: "nope" }, 5, "x"]) {
      const routes = parseStopEta(bad);
      expect(routes).toHaveLength(3);
      expect(routes.every((r) => r.arrivals.length === 0)).toBe(true);
    }
  });
});

describe("formatWait", () => {
  it("reads as arriving under the threshold", () => {
    expect(formatWait(ARRIVING_THRESHOLD_SECONDS - 1, "en")).toBe("Arriving");
    expect(formatWait(1, "th")).toBe("กำลังจะถึง");
  });

  it("rounds to whole minutes above the threshold", () => {
    expect(formatWait(90, "en")).toBe("in 2 min");
    expect(formatWait(858, "en")).toBe("in 14 min");
    expect(formatWait(600, "th")).toBe("อีก 10 นาที");
  });
});
