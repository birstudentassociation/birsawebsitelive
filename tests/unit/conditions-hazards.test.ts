import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildEarthquakeReading,
  buildRoadReadings,
  buildStormReading,
  feltInBangkok,
  isLongdoEventCurrent,
  mergeQuakes,
  parseGdacsStorms,
  parseLongdoEvents,
  parseTmdQuakeRss,
  parseUsgsQuakes,
  selectRoadIncidents,
  type Quake,
} from "@/lib/conditions/sources/hazards";

const fixtureDirectory = join(__dirname, "fixtures", "conditions");
const readFixture = (name: string) => readFileSync(join(fixtureDirectory, name), "utf8");

const longdoRaw: unknown = JSON.parse(readFixture("hazards-longdo.json"));
const tmdXml = readFixture("hazards-tmd.xml");
const usgsRaw: unknown = JSON.parse(readFixture("hazards-usgs.json"));
const gdacsXml = readFixture("hazards-gdacs.xml");

function required<T>(value: T | undefined): T {
  if (value === undefined) throw new Error("Expected a value");
  return value;
}

const now = new Date("2026-10-03T03:00:00Z");

function quake(overrides: Partial<Quake>): Quake {
  return {
    source: "tmd",
    timeMs: now.getTime() - 30 * 60_000,
    lat: 13.7563,
    lon: 100.49,
    magnitude: 5,
    place: { en: "Test", th: "ทดสอบ" },
    ...overrides,
  };
}

describe("parseLongdoEvents", () => {
  const events = parseLongdoEvents(longdoRaw);

  it("reads every well formed row", () => {
    expect(events).toHaveLength(23);
  });

  it("reads Bangkok local times as UTC+7", () => {
    const flooding = events.find((event) => event.id === "900001");
    expect(flooding?.startMs).toBe(Date.parse("2026-10-03T00:30:00Z"));
    expect(flooding?.stopMs).toBeNull();
  });

  it("keeps both titles and falls back to Thai when English is missing", () => {
    const flooding = events.find((event) => event.id === "900001");
    expect(flooding?.title.en).toBe("Flooding at Maha Rat Rd. near Tha Prachan");
    expect(flooding?.title.th).toContain("น้ำท่วมขัง");
    const closure = events.find((event) => event.id === "900002");
    expect(closure?.title.en).toBe(closure?.title.th);
  });

  it("ignores malformed input", () => {
    expect(parseLongdoEvents(null)).toEqual([]);
    expect(parseLongdoEvents({})).toEqual([]);
    expect(parseLongdoEvents([null, 4, { type: "6" }])).toEqual([]);
  });
});

describe("selectRoadIncidents", () => {
  const events = parseLongdoEvents(longdoRaw);

  it("treats an event with a future stop as current and an old open one as not", () => {
    const byId = (id: string) => events.find((event) => event.id === id)!;
    expect(isLongdoEventCurrent(byId("900001"), now)).toBe(true);
    expect(isLongdoEventCurrent(byId("900002"), now)).toBe(true);
    expect(isLongdoEventCurrent(byId("900003"), now)).toBe(false);
    expect(isLongdoEventCurrent(byId("900001"), new Date("2026-10-03T14:00:00Z"))).toBe(false);
  });

  it("does not count events that have not started", () => {
    const early = new Date("2026-10-02T23:00:00Z");
    expect(
      isLongdoEventCurrent(
        events.find((event) => event.id === "900001")!,
        early
      )
    ).toBe(false);
  });

  it("selects flooding, diversions and closures within 3 km, nearest first", () => {
    const selected = selectRoadIncidents(events, now, [6, 18, 19], 3);
    const ids = selected.map((nearby) => nearby.event.id);
    expect(ids.slice(0, 2)).toEqual(["900001", "900002"]);
    expect(ids).not.toContain("900003");
    expect(selected.every((nearby) => nearby.distanceKm <= 3)).toBe(true);
    const distances = selected.map((nearby) => nearby.distanceKm);
    expect(distances).toEqual([...distances].sort((a, b) => a - b));
    expect(selected.map((nearby) => nearby.event.title.en)).not.toContain(
      "Road Diversion at Mahachai Rd."
    );
  });

  it("counts a diversion only in its first 24 hours", () => {
    const diversion = events.find((event) => event.title.en === "Road Diversion at Mahachai Rd.")!;
    expect(isLongdoEventCurrent(diversion, new Date(diversion.startMs + 60 * 60 * 1000))).toBe(
      true
    );
    expect(isLongdoEventCurrent(diversion, now)).toBe(false);
  });

  it("selects only flooding and closures within 1 km", () => {
    const selected = selectRoadIncidents(events, now, [6, 19], 1);
    expect(selected.map((nearby) => nearby.event.id)).toEqual(["900001", "900002"]);
  });
});

describe("buildRoadReadings", () => {
  it("returns counts, items and a Bangkok timestamp", () => {
    const readings = buildRoadReadings(parseLongdoEvents(longdoRaw), now);
    const incidents = required(readings[0]);
    const closures = required(readings[1]);
    expect(incidents.id).toBe("roadIncidents");
    expect(incidents.value).toBe(incidents.items?.length);
    expect(incidents.value).toBeGreaterThanOrEqual(2);
    expect(incidents.observedAt).toBe("2026-10-03T10:00:00+07:00");
    expect(required(incidents.items?.[0]).at).toBe("2026-10-03T07:30:00+07:00");
    expect(required(incidents.items?.[0]).distanceKm).toBeLessThan(0.5);
    expect(closures.id).toBe("roadClosuresNear");
    expect(closures.value).toBe(2);
  });

  it("returns null readings when the feed failed", () => {
    const readings = buildRoadReadings(null, now);
    expect(readings.map((reading) => reading.id)).toEqual(["roadIncidents", "roadClosuresNear"]);
    for (const reading of readings) {
      expect(reading.value).toBeNull();
      expect(reading.observedAt).toBeNull();
    }
  });
});

describe("parseTmdQuakeRss", () => {
  const quakes = parseTmdQuakeRss(tmdXml);

  it("reads items with UTC times, coordinates and magnitude", () => {
    expect(quakes).toHaveLength(10);
    expect(required(quakes[0]).magnitude).toBe(2.6);
    expect(required(quakes[0]).lat).toBeCloseTo(21.244);
    expect(required(quakes[0]).lon).toBeCloseTo(98.28);
    expect(required(quakes[0]).timeMs).toBe(Date.parse("2026-10-03T00:15:16Z"));
    expect(required(quakes[0]).href).toContain("earthquake=17162");
  });

  it("splits bilingual titles", () => {
    expect(required(quakes[0]).place).toEqual({ en: "Myanmar", th: "ประเทศเมียนมา" });
    const tambon = quakes.find((item) => item.place.en.includes("Tambon"));
    expect(tambon?.place.th).toContain("อ.");
    expect(tambon?.place.en).not.toContain("(");
  });

  it("ignores non text input", () => {
    expect(parseTmdQuakeRss(null)).toEqual([]);
    expect(parseTmdQuakeRss("<rss></rss>")).toEqual([]);
  });
});

describe("parseUsgsQuakes", () => {
  it("reads magnitude, place, millisecond time and coordinates in lon lat order", () => {
    const first = required(parseUsgsQuakes(usgsRaw)[0]);
    expect(first.magnitude).toBe(4.7);
    expect(first.place.en).toBe("115 km WSW of Banda Aceh, Indonesia");
    expect(first.timeMs).toBe(1790606590687);
    expect(first.lat).toBeCloseTo(5.2548);
    expect(first.lon).toBeCloseTo(94.3303);
    expect(first.href).toContain("us6000ty5h");
  });

  it("ignores malformed input", () => {
    expect(parseUsgsQuakes(null)).toEqual([]);
    expect(parseUsgsQuakes({ features: [{}, { properties: {}, geometry: {} }] })).toEqual([]);
  });
});

describe("mergeQuakes and feltInBangkok", () => {
  it("merges events within 2 minutes and 50 km and keeps the larger magnitude", () => {
    const tmd = quake({ lat: 21.9, lon: 96.1, magnitude: 5.4 });
    const usgs = quake({
      source: "usgs",
      lat: 21.95,
      lon: 96.12,
      magnitude: 5.6,
      timeMs: tmd.timeMs + 90_000,
    });
    const merged = mergeQuakes([tmd], [usgs]);
    expect(merged).toHaveLength(1);
    expect(required(merged[0]).magnitude).toBe(5.6);
    expect(required(merged[0]).source).toBe("tmd");
  });

  it("keeps events that are too far apart in time or distance", () => {
    const tmd = quake({ lat: 21.9, lon: 96.1 });
    const later = quake({ source: "usgs", lat: 21.9, lon: 96.1, timeMs: tmd.timeMs + 5 * 60_000 });
    const farther = quake({ source: "usgs", lat: 19, lon: 96.1, timeMs: tmd.timeMs });
    expect(mergeQuakes([tmd], [later, farther])).toHaveLength(3);
  });

  it("applies the felt rule by magnitude, distance and age", () => {
    expect(feltInBangkok(quake({ lat: 14.5, lon: 100.5, magnitude: 5 }), now)).toBe(true);
    expect(feltInBangkok(quake({ lat: 14.5, lon: 100.5, magnitude: 4.9 }), now)).toBe(false);
    expect(feltInBangkok(quake({ lat: 19.5, lon: 97, magnitude: 5.6 }), now)).toBe(false);
    expect(feltInBangkok(quake({ lat: 19.5, lon: 97, magnitude: 6.5 }), now)).toBe(true);
    expect(feltInBangkok(quake({ lat: 3, lon: 98, magnitude: 7 }), now)).toBe(false);
    expect(feltInBangkok(quake({ lat: 22.011, lon: 95.936, magnitude: 7.7 }), now)).toBe(true);
    expect(feltInBangkok(quake({ lat: 22.011, lon: 95.936, magnitude: 7.4 }), now)).toBe(false);
    const sevenHoursAgo = now.getTime() - 7 * 3_600_000;
    expect(
      feltInBangkok(quake({ lat: 14.5, lon: 100.5, magnitude: 6, timeMs: sevenHoursAgo }), now)
    ).toBe(false);
  });
});

describe("buildEarthquakeReading", () => {
  it("reports 0 with no items when nothing would be felt", () => {
    const quakes = [...parseTmdQuakeRss(tmdXml), ...parseUsgsQuakes(usgsRaw)];
    const reading = buildEarthquakeReading(quakes, now);
    expect(reading.id).toBe("earthquake");
    expect(reading.value).toBe(0);
    expect(reading.items).toEqual([]);
    expect(reading.observedAt).toBe("2026-10-03T10:00:00+07:00");
  });

  it("reports the largest felt magnitude with bilingual items free of colons and dashes", () => {
    const felt = [
      quake({
        lat: 19.5,
        lon: 97,
        magnitude: 6.7,
        place: { en: "Mandalay, Myanmar", th: "มัณฑะเลย์ เมียนมา" },
      }),
      quake({ lat: 14.5, lon: 100.5, magnitude: 5.1 }),
    ];
    const reading = buildEarthquakeReading(felt, now);
    expect(reading.value).toBe(6.7);
    expect(reading.items).toHaveLength(2);
    const first = required(reading.items?.[0]);
    expect(first.title.en).toMatch(/^Magnitude 6\.7, Mandalay, Myanmar, \d+ km away$/);
    expect(first.title.th).toMatch(/^แผ่นดินไหวขนาด 6\.7 มัณฑะเลย์ เมียนมา /);
    for (const text of [first.title.en, first.title.th]) expect(text).not.toMatch(/[:\-–—]/);
  });

  it("returns null when both feeds failed", () => {
    const reading = buildEarthquakeReading(null, now);
    expect(reading.value).toBeNull();
    expect(reading.observedAt).toBeNull();
  });
});

describe("parseGdacsStorms and buildStormReading", () => {
  const storms = parseGdacsStorms(gdacsXml, now);

  it("keeps only active tropical cyclones with coordinates from geo:Point", () => {
    expect(storms.length).toBe(3);
    const choiWan = storms.find((storm) => storm.name === "CHOI WAN 26");
    expect(choiWan?.lat).toBeCloseTo(18.1);
    expect(choiWan?.lon).toBeCloseTo(144.7);
    expect(choiWan?.href).toBe("https://www.gdacs.org/report.aspx?eventtype=TC&eventid=1001332");
  });

  it("drops cyclones that are not current and ended more than 24 hours ago", () => {
    const stale = gdacsXml
      .replace(
        /<gdacs:iscurrent>true<\/gdacs:iscurrent>/g,
        "<gdacs:iscurrent>false</gdacs:iscurrent>"
      )
      .replace(
        /<gdacs:todate>[^<]*<\/gdacs:todate>/g,
        "<gdacs:todate>Mon, 28 Sep 2026 00:00:00 GMT</gdacs:todate>"
      );
    expect(parseGdacsStorms(stale, now)).toEqual([]);
  });

  it("keeps a cyclone that is not flagged current but ended within 24 hours", () => {
    const recent = gdacsXml
      .replace(
        /<gdacs:iscurrent>true<\/gdacs:iscurrent>/g,
        "<gdacs:iscurrent>false</gdacs:iscurrent>"
      )
      .replace(
        /<gdacs:todate>[^<]*<\/gdacs:todate>/g,
        "<gdacs:todate>Sat, 03 Oct 2026 00:00:00 GMT</gdacs:todate>"
      );
    expect(parseGdacsStorms(recent, now)).toHaveLength(3);
  });

  it("reports the distance to the nearest storm with items sorted by distance", () => {
    const reading = buildStormReading(storms, now);
    expect(reading.id).toBe("storm");
    expect(reading.unit).toBe("km");
    expect(reading.value).toBeGreaterThan(1000);
    expect(reading.value).toBe(required(reading.items?.[0]).distanceKm);
    expect(reading.detail?.en).toContain("alert level");
    const distances = reading.items!.map((item) => item.distanceKm!);
    expect(distances).toEqual([...distances].sort((a, b) => a - b));
    for (const item of reading.items!) expect(item.title.en).not.toMatch(/[:\-–—]/);
  });

  it("reports 10000 when no storm is active and null when the feed failed", () => {
    expect(buildStormReading([], now).value).toBe(10000);
    const failed = buildStormReading(null, now);
    expect(failed.value).toBeNull();
    expect(failed.observedAt).toBeNull();
  });

  it("ignores non text input", () => {
    expect(parseGdacsStorms(null, now)).toEqual([]);
  });
});
