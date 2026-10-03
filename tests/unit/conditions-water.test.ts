import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchWaterReadings,
  hourlyGraphSeries,
  latestGraphValue,
  pakKhlongTalatReading,
  parseBmaStation,
  parseFewsCsv,
  parseFloodRoad,
  parseHiiThresholds,
  parseRainGauge,
  parseTideNextHigh,
  parseWaterlevelGraph,
  pointInGeoJson,
  summariseForecast,
} from "@/lib/conditions/sources/water";
import { CAMPUS, type Reading } from "@/lib/conditions/types";

const fixtureDirectory = join(__dirname, "fixtures", "conditions");

function fixtureText(name: string): string {
  return readFileSync(join(fixtureDirectory, name), "utf8");
}

function fixtureJson(name: string): unknown {
  return JSON.parse(fixtureText(name)) as unknown;
}

const now = new Date("2026-10-03T09:15:00+07:00");

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("parseWaterlevelGraph", () => {
  it("reads points, converts Bangkok time and keeps thresholds", () => {
    const graph = parseWaterlevelGraph(fixtureJson("water-krungthep.json"));
    expect(graph).not.toBeNull();
    expect(graph!.bankLevel).toBeCloseTo(2.161);
    expect(graph!.points[0]?.at).toBe("2026-10-02T06:00:00+07:00");
  });

  it("takes the latest non-null value and ignores a trailing null", () => {
    const graph = parseWaterlevelGraph(fixtureJson("water-krungthep.json"))!;
    expect(latestGraphValue(graph, "value", now)).toEqual({
      value: 1,
      at: "2026-10-03T09:00:00+07:00",
    });
  });

  it("falls back to an earlier hour when the newest hour is null", () => {
    const graph = parseWaterlevelGraph(fixtureJson("water-samsen.json"))!;
    expect(latestGraphValue(graph, "value", now)).toEqual({
      value: 1.12,
      at: "2026-10-03T08:00:00+07:00",
    });
  });

  it("reads discharge for the dam", () => {
    const graph = parseWaterlevelGraph(fixtureJson("water-c13-discharge.json"))!;
    expect(latestGraphValue(graph, "discharge", now)?.value).toBe(2500);
  });

  it("keeps a stalled canal reading with its old timestamp so it reads as stale", () => {
    const graph = parseWaterlevelGraph(fixtureJson("water-pakkhlongtalat.json"))!;
    expect(graph.warningLevel).toBe(2.8);
    expect(graph.criticalLevel).toBe(3);
    expect(latestGraphValue(graph, "value", now)).toEqual({
      value: 1.02,
      at: "2026-09-28T13:15:00+07:00",
    });
  });

  it("builds an hourly series covering at most 48 hours", () => {
    const graph = parseWaterlevelGraph(fixtureJson("water-krungthep.json"))!;
    const series = hourlyGraphSeries(graph, "value", now);
    expect(series.length).toBeGreaterThan(20);
    expect(series.length).toBeLessThanOrEqual(49);
    const hours = series.map((point) => point.at.slice(0, 13));
    expect(new Set(hours).size).toBe(hours.length);
  });

  it("rejects malformed payloads", () => {
    expect(parseWaterlevelGraph(null)).toBeNull();
    expect(parseWaterlevelGraph({ data: {} })).toBeNull();
    expect(
      parseWaterlevelGraph({ data: { graph_data: [{ datetime: "bad", value: 1 }] } })?.points
    ).toEqual([]);
  });
});

describe("parseFewsCsv and summariseForecast", () => {
  it("skips the header and keeps rows in time order", () => {
    const rows = parseFewsCsv(fixtureText("water-fews-c13.txt"));
    expect(rows[0]).toEqual({ at: "2026-09-26T06:00:00+07:00", value: 1947.07 });
    expect(rows.length).toBeGreaterThan(300);
  });

  it("separates observed from forecast rows around now", () => {
    const rows = parseFewsCsv(fixtureText("water-fews-c13.txt"));
    const summary = summariseForecast(rows, now);
    expect(summary.observedAt).toBe("2026-10-03T09:00:00+07:00");
    expect(summary.series[0]?.at).toBe("2026-10-03T10:00:00+07:00");
    expect(summary.value).toBe(Math.max(...summary.series.map((point) => point.value)));
    expect(summary.value).toBeGreaterThanOrEqual(2500);
  });

  it("limits the forecast to seven days", () => {
    const rows = parseFewsCsv(
      "station,date,time,value\nX,2026-10-03,09:00:00,1\nX,2026-10-09,09:00:00,5\nX,2026-10-12,09:00:00,99\n"
    );
    expect(summariseForecast(rows, now).value).toBe(5);
  });

  it("returns null when there are no future rows", () => {
    const rows = parseFewsCsv("station,date,time,value\nX,2026-10-01,09:00:00,1\n");
    expect(summariseForecast(rows, now).value).toBeNull();
  });

  it("reads thresholds for Nonthaburi from the metadata", () => {
    expect(parseHiiThresholds(fixtureText("water-hii-metadata.txt"), "CPY014")).toEqual({
      warning: 0.74,
      critical: 2.3,
    });
    expect(parseHiiThresholds(fixtureText("water-hii-metadata.txt"), "NOPE")).toBeNull();
    expect(parseHiiThresholds("", "CPY014")).toBeNull();
  });

  it("forecasts Nonthaburi from the recorded file", () => {
    const rows = parseFewsCsv(fixtureText("water-fews-cpy014.txt"));
    const summary = summariseForecast(rows, now);
    expect(summary.value).not.toBeNull();
    expect(summary.observedAt).toBe("2026-10-03T09:00:00+07:00");
  });
});

describe("parseTideNextHigh", () => {
  it("finds the next predicted high tide within 24 hours", () => {
    const high = parseTideNextHigh(fixtureText("water-tide-n01.txt"), now);
    expect(high?.at).toBe("2026-10-03T20:00:00+07:00");
    expect(high?.value).toBeCloseTo(0.91377);
  });

  it("returns 48 hours of predictions after now", () => {
    const high = parseTideNextHigh(fixtureText("water-tide-n01.txt"), now)!;
    expect(high.series[0]?.at).toBe("2026-10-03T10:00:00+07:00");
    expect(high.series).toHaveLength(48);
  });

  it("returns null when no peak falls in the window", () => {
    const csv =
      "station,date,time,value\nN01,2026-10-03,10:00:00,0.1\nN01,2026-10-03,11:00:00,0.2\nN01,2026-10-03,12:00:00,0.3\n";
    expect(parseTideNextHigh(csv, now)).toBeNull();
    expect(parseTideNextHigh("", now)).toBeNull();
  });
});

describe("parseFloodRoad", () => {
  const payload = fixtureJson("water-flood-road.json");
  const sensorDay = new Date("2026-09-28T14:00:00+07:00");

  it("includes only sensors within 3 km", () => {
    const summary = parseFloodRoad(payload, sensorDay);
    const codes = summary.sensors.map((sensor) => sensor.code).sort();
    expect(codes).toEqual(["FL.BKN.01", "FL.PNK.02", "FL.PPS.01", "FL.PPS.02"]);
    expect(codes).not.toContain("FL.CTC.04");
    expect(summary.sensors.every((sensor) => sensor.distanceKm <= 3)).toBe(true);
  });

  it("reports zero when fresh sensors are dry", () => {
    const summary = parseFloodRoad(payload, sensorDay);
    expect(summary.value).toBe(0);
    expect(summary.observedAt).toBe("2026-09-28T13:25:00+07:00");
  });

  it("returns null with the newest timestamp when every sensor is stale", () => {
    const summary = parseFloodRoad(payload, now);
    expect(summary.value).toBeNull();
    expect(summary.sensors).toEqual([]);
    expect(summary.observedAt).toBe("2026-09-28T13:25:00+07:00");
  });

  it("takes the maximum depth among fresh sensors and ignores stale ones", () => {
    const rows = (payload as { data: Record<string, unknown>[] }).data.map((row) => {
      const station = row.station as { floodroad_oldcode: string };
      if (station.floodroad_oldcode === "FL.PPS.01") return { ...row, floodroad_value: 12 };
      if (station.floodroad_oldcode === "FL.SPW.01") return { ...row, floodroad_value: 80 };
      return row;
    });
    const summary = parseFloodRoad({ data: rows }, sensorDay);
    expect(summary.value).toBe(12);
  });

  it("accepts plain string names and rejects malformed input", () => {
    const row = {
      floodroad_value: 5,
      floodroad_datetime: "2026-10-03 09:00",
      station: {
        floodroad_oldcode: "X.1",
        floodroad_name: "Test road",
        floodroad_lat: 13.7563,
        floodroad_long: 100.49,
      },
    };
    const summary = parseFloodRoad({ data: [row] }, now);
    expect(summary.sensors[0]?.name).toEqual({ en: "Test road", th: "Test road" });
    expect(parseFloodRoad(null, now).value).toBeNull();
    expect(parseFloodRoad({ data: [{}] }, now).observedAt).toBeNull();
  });
});

describe("parseRainGauge", () => {
  it("sums the hourly points inside the last 24 hours", () => {
    const summary = parseRainGauge(fixtureJson("water-rain-gauge.json"), now);
    expect(summary.value).toBe(21);
    expect(summary.observedAt).toBe("2026-10-03T08:00:00+07:00");
  });

  it("drops points older than 24 hours", () => {
    const later = new Date("2026-10-03T15:30:00+07:00");
    const summary = parseRainGauge(fixtureJson("water-rain-gauge.json"), later);
    expect(summary.value).toBe(0);
    const muchLater = new Date("2026-10-04T15:30:00+07:00");
    expect(parseRainGauge(fixtureJson("water-rain-gauge.json"), muchLater).value).toBeNull();
  });

  it("returns null for malformed input", () => {
    expect(parseRainGauge({}, now).value).toBeNull();
  });
});

describe("pointInGeoJson", () => {
  const square = [
    [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
      [0, 0],
    ],
  ];
  const holed = [
    square[0],
    [
      [4, 4],
      [6, 4],
      [6, 6],
      [4, 6],
      [4, 4],
    ],
  ];

  it("handles polygons, holes and multipolygons", () => {
    expect(pointInGeoJson({ type: "Polygon", coordinates: square }, 5, 5)).toBe(true);
    expect(pointInGeoJson({ type: "Polygon", coordinates: square }, 11, 5)).toBe(false);
    expect(pointInGeoJson({ type: "Polygon", coordinates: holed }, 5, 5)).toBe(false);
    expect(pointInGeoJson({ type: "Polygon", coordinates: holed }, 2, 2)).toBe(true);
    expect(pointInGeoJson({ type: "MultiPolygon", coordinates: [square, holed] }, 2, 2)).toBe(true);
  });

  it("handles features and feature collections", () => {
    const feature = { type: "Feature", geometry: { type: "Polygon", coordinates: square } };
    expect(pointInGeoJson({ type: "FeatureCollection", features: [feature] }, 5, 5)).toBe(true);
    expect(pointInGeoJson(feature, 50, 5)).toBe(false);
    expect(pointInGeoJson(null, 1, 1)).toBe(false);
    expect(pointInGeoJson({ type: "FeatureCollection", features: [{}] }, 1, 1)).toBe(false);
  });

  it("finds a point inside and outside the recorded urban flood area", () => {
    const geoJson = fixtureJson("water-urban-flood.json");
    expect(pointInGeoJson(geoJson, 100.71, 13.72)).toBe(true);
    expect(pointInGeoJson(geoJson, CAMPUS.lon, CAMPUS.lat)).toBe(false);
  });
});

describe("parseBmaStation", () => {
  const summary = fixtureText("water-bma-summary.txt");

  it("reads Pak Khlong Talat from the embedded station list", () => {
    expect(parseBmaStation(summary, 76)).toEqual({
      value: 1.59,
      at: "2026-10-03T09:10:00+07:00",
      warning: 2.8,
      critical: 3,
    });
  });

  it("reads .NET style timestamps", () => {
    const html =
      'waterSummaryList = [{"water_id":76,"wl_in":"1.70","site_timestamp":"/Date(1790994600000)/"}]';
    expect(parseBmaStation(html, 76)?.at).toBe("2026-10-03T09:30:00+07:00");
    expect(parseBmaStation(html, 76)?.value).toBe(1.7);
  });

  it("returns null for a Cloudflare challenge page", () => {
    expect(parseBmaStation(fixtureText("water-bma-challenge.txt"), 76)).toBeNull();
  });

  it("returns null when the station is missing or has no level", () => {
    expect(parseBmaStation(summary, 999)).toBeNull();
    expect(
      parseBmaStation(
        'waterSummaryList = [{"water_id":76,"wl_in":null,"site_timestamp":"2026-10-03 09:10:00"}]',
        76
      )
    ).toBeNull();
  });
});

describe("pakKhlongTalatReading", () => {
  const graph = parseWaterlevelGraph(fixtureJson("water-pakkhlongtalat.json"));

  it("prefers BMA's own gauge when its page is served", () => {
    const reading = pakKhlongTalatReading(fixtureText("water-bma-summary.txt"), graph, now);
    expect(reading.value).toBe(1.59);
    expect(reading.observedAt).toBe("2026-10-03T09:10:00+07:00");
    expect(reading.source.url).toBe("https://weather.bangkok.go.th/water/StationDetail?id=76");
    expect(reading.detail?.en).toBe("Warning 2.80 m, wall 3.00 m");
  });

  it("falls back to the ThaiWater copy when BMA serves a challenge", () => {
    const reading = pakKhlongTalatReading(fixtureText("water-bma-challenge.txt"), graph, now);
    expect(reading.source.url).toBe("https://www.thaiwater.net/water/wl");
  });
});

describe("fetchWaterReadings", () => {
  const expectedIds = [
    "riverKrungThep",
    "riverSamsen",
    "riverPakKhlongTalat",
    "damRelease",
    "damReleaseForecast",
    "riverForecastNonthaburi",
    "tide",
    "rainGauge24h",
    "roadFlood",
    "urbanFloodWarning",
  ];

  it("returns all ten readings with null values when every feed fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const readings = await fetchWaterReadings(now);
    expect(readings.map((reading) => reading.id)).toEqual(expectedIds);
    expect(readings.every((reading) => reading.value === null && reading.observedAt === null)).toBe(
      true
    );
  });

  it("builds readings from recorded responses", async () => {
    const responses: [string, string][] = [
      ["station_id=4&", "water-krungthep.json"],
      ["station_id=2599&", "water-samsen.json"],
      ["station_id=118&", "water-pakkhlongtalat.json"],
      ["station_id=2744&", "water-c13-discharge.json"],
      ["forecast/C13.txt", "water-fews-c13.txt"],
      ["forecast/CPY014.txt", "water-fews-cpy014.txt"],
      ["hii_waterlevel.csv", "water-hii-metadata.txt"],
      ["tide_table/N01.txt", "water-tide-n01.txt"],
      ["rain_24h_graph", "water-rain-gauge.json"],
      ["flood_road", "water-flood-road.json"],
      ["urban_flood", "water-urban-flood.json"],
    ];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        const match = responses.find(([needle]) => url.includes(needle));
        return match ? new Response(fixtureText(match[1])) : new Response("", { status: 404 });
      })
    );
    const readings = await fetchWaterReadings(now);
    const byId = (id: string): Reading => {
      const found = readings.find((reading) => reading.id === id);
      if (!found) throw new Error(`missing ${id}`);
      return found;
    };
    expect(readings).toHaveLength(10);
    expect(byId("riverKrungThep").value).toBe(1);
    expect(byId("riverKrungThep").detail?.en).toBe("Bank 2.16 m");
    expect(byId("damRelease").value).toBe(2500);
    expect(byId("damReleaseForecast").modelled).toBe(true);
    expect(byId("riverForecastNonthaburi").detail?.en).toBe("Warning 0.74 m, critical 2.30 m");
    expect(byId("tide").value).toBeCloseTo(0.91377);
    expect(byId("tide").detail?.en).toBe("Next high tide at 20:00");
    expect(byId("rainGauge24h").value).toBe(21);
    expect(byId("roadFlood").value).toBeNull();
    expect(byId("urbanFloodWarning").value).toBe(0);
    expect(byId("riverPakKhlongTalat").observedAt).toBe("2026-09-28T13:15:00+07:00");
    expect(byId("riverPakKhlongTalat").detail?.en).toBe("Warning 2.80 m, wall 3.00 m");
  });
});
