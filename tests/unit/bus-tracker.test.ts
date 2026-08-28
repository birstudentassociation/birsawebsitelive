import { describe, expect, it } from "vitest";
import {
  compactFare,
  downstreamText,
  headwayMinutes,
  parseLiveStop,
  patternKey,
  STOP_IDS,
  type LiveEtaEntry,
} from "@/lib/bus-tracker/live";
import { busTrackerData } from "@/lib/bus-tracker/data";

/**
 * A trimmed slice of a real `/front/stop-eta` response: two lines with live
 * buses (route 1 has two, one air-con), one line present but with no live
 * estimate (`waitTime` 0), and one entry with no GPS that must be dropped.
 */
const sampleData: LiveEtaEntry[] = [
  { name: "1", tripHeadsignEn: "Sanam Luang", hasGps: true, waitTime: 698, airCondition: true },
  { name: "1", tripHeadsignEn: "Sanam Luang", hasGps: true, waitTime: 60, airCondition: false },
  {
    name: "4-2 (15)",
    tripHeadsignEn: "BRT Ratchapruek L",
    hasGps: true,
    waitTime: 858,
    airCondition: false,
  },
  { name: "2-9 (53L) ", tripHeadsignEn: "Thewet ", hasGps: true, waitTime: 0, airCondition: false },
  { name: "203", tripHeadsignEn: "Pak Nam", hasGps: false, waitTime: 120, airCondition: false },
];

describe("STOP_IDS", () => {
  it("tracks the three stops around Tha Prachan campus, in display order", () => {
    expect(STOP_IDS).toEqual([2373, 1573, 1061]);
  });
});

describe("patternKey", () => {
  it("joins a trimmed route label and English headsign", () => {
    expect(patternKey("2-9 (53L) ", "Thewet ")).toBe("2-9 (53L)|Thewet");
    expect(patternKey("1", "Sanam Luang")).toBe("1|Sanam Luang");
  });

  it("tolerates a missing headsign but requires a route label", () => {
    expect(patternKey("1", undefined)).toBe("1|");
    expect(patternKey("  ", "x")).toBeNull();
    expect(patternKey(undefined, "x")).toBeNull();
    expect(patternKey(42, "x")).toBeNull();
  });
});

describe("parseLiveStop", () => {
  it("groups GPS-backed positive-wait arrivals by pattern key, soonest first", () => {
    const grouped = parseLiveStop({ code: 200, data: sampleData });
    expect(grouped["1|Sanam Luang"]).toEqual([
      { waitSeconds: 60, airCondition: false },
      { waitSeconds: 698, airCondition: true },
    ]);
    expect(grouped["4-2 (15)|BRT Ratchapruek L"]).toEqual([
      { waitSeconds: 858, airCondition: false },
    ]);
  });

  it("drops no-GPS entries and lines with no live estimate (waitTime 0)", () => {
    const grouped = parseLiveStop({ data: sampleData });
    // 53L is present in the feed but has waitTime 0, so it is not tracked.
    expect(grouped["2-9 (53L)|Thewet"]).toBeUndefined();
    // 203 has no GPS.
    expect(Object.keys(grouped)).not.toContain("203|Pak Nam");
  });

  it("yields an empty map for a malformed or error payload rather than throwing", () => {
    for (const bad of [null, undefined, {}, { data: "nope" }, 5, "x"]) {
      expect(parseLiveStop(bad)).toEqual({});
    }
  });
});

describe("compactFare", () => {
  it("collapses a fare range and drops trailing zeros", () => {
    expect(compactFare("Price 15.00 - 20.00 ฿")).toBe("15–20฿");
    expect(compactFare("Price 15.00 - 25.00 ฿")).toBe("15–25฿");
  });

  it("shows a single fare once", () => {
    expect(compactFare("ราคา 8.00 บาท")).toBe("8฿");
    expect(compactFare("Price 8.00 ฿")).toBe("8฿");
  });

  it("returns the trimmed original when there is no number", () => {
    expect(compactFare("  free  ")).toBe("free");
  });
});

describe("headwayMinutes", () => {
  it("reads the headway in whole minutes", () => {
    expect(headwayMinutes("Departs every 15 minutes (approximately)")).toBe(15);
    expect(headwayMinutes("ออกทุก 20 นาที (โดยประมาณ)")).toBe(20);
  });

  it("returns null when there is no number", () => {
    expect(headwayMinutes("varies")).toBeNull();
  });
});

describe("downstreamText", () => {
  it("joins downstream stops in the requested locale", () => {
    const stops = [
      { en: "Silpakorn University", th: "มหาวิทยาลัยศิลปากร" },
      { en: "Opposite Tha Tian", th: "ตรงข้ามท่าเตียน" },
    ];
    expect(downstreamText(stops, "en")).toBe("Silpakorn University · Opposite Tha Tian");
    expect(downstreamText(stops, "th")).toBe("มหาวิทยาลัยศิลปากร · ตรงข้ามท่าเตียน");
  });
});

describe("baked bus-tracker data", () => {
  it("covers exactly the tracked stops, in order", () => {
    expect(busTrackerData.map((s) => s.stopId)).toEqual([...STOP_IDS]);
  });

  it("is structurally sound for every line", () => {
    for (const stop of busTrackerData) {
      expect(stop.name.en).not.toBe("");
      expect(stop.name.th).not.toBe("");
      expect(stop.lines.length).toBeGreaterThan(0);

      const keys = new Set<string>();
      for (const line of stop.lines) {
        // Pattern keys must be unique within a stop, or live arrivals would
        // attach to more than one row.
        expect(keys.has(line.patternKey)).toBe(false);
        keys.add(line.patternKey);

        expect(line.routeName).not.toBe("");
        expect(line.patternKey).toBe(`${line.routeName}|${line.headsign.en}`);
        expect(line.color).toMatch(/^[0-9a-fA-F]{6}$/);
        expect(line.downstream.length).toBeLessThanOrEqual(4);
        expect(line.terminus.en).not.toBe("");
        expect(line.terminus.th).not.toBe("");
        for (const stopName of line.downstream) {
          expect(stopName.en).not.toBe("");
          expect(stopName.th).not.toBe("");
        }
      }
    }
  });
});
