import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildPm25Nearest,
  buildPm25Official,
  parseAir4Thai,
  parseAirbkk,
  parseOpenMeteoAir,
  summariseAirbkk,
} from "@/lib/conditions/sources/air";

const json = (name: string): unknown =>
  JSON.parse(readFileSync(join(__dirname, "fixtures/conditions", name), "utf8"));

const NIGHT = new Date("2026-10-02T23:30:00+07:00");

describe("parseAirbkk", () => {
  it("reads hourly PM2.5 strings into a sorted series", () => {
    const points = parseAirbkk(json("airbkk-133.json"), 133);
    expect(points).toHaveLength(24);
    expect(points[0]).toEqual({ at: "2026-10-02T00:00:00+07:00", value: 26.5 });
    expect(points[23]).toEqual({ at: "2026-10-02T23:00:00+07:00", value: 24.3 });
  });

  it("drops negative, null, non numeric and implausible values", () => {
    const raw = {
      status: "Success",
      message: {
        "133": [
          { Date_Time: "2026-10-02 01:00:00", "PM2.5": "-4.0" },
          { Date_Time: "2026-10-02 02:00:00", "PM2.5": null },
          { Date_Time: "2026-10-02 03:00:00", "PM2.5": "abc" },
          { Date_Time: "2026-10-02 04:00:00", "PM2.5": "1500" },
          { Date_Time: "2026-10-02 05:00:00", "PM2.5": "12.5" },
          { Date_Time: "bad", "PM2.5": "9" },
        ],
      },
    };
    expect(parseAirbkk(raw, 133)).toEqual([{ at: "2026-10-02T05:00:00+07:00", value: 12.5 }]);
  });

  it("returns an empty series for malformed input or another station", () => {
    expect(parseAirbkk(null, 133)).toEqual([]);
    expect(parseAirbkk({ status: "Fail", message: "No data" }, 133)).toEqual([]);
    expect(parseAirbkk(json("airbkk-133.json"), 124)).toEqual([]);
  });
});

describe("summariseAirbkk and buildPm25Nearest", () => {
  const points = parseAirbkk(json("airbkk-133.json"), 133);

  it("averages the last 24 hours", () => {
    const summary = summariseAirbkk(points, NIGHT);
    const expected = points.reduce((sum, point) => sum + point.value, 0) / points.length;
    expect(summary?.value).toBe(Math.round(expected * 10) / 10);
    expect(summary?.series).toHaveLength(24);
    expect(summary?.observedAt).toBe("2026-10-02T23:00:00+07:00");
  });

  it("needs at least 18 valid hours", () => {
    expect(summariseAirbkk(points.slice(0, 17), NIGHT)).toBeNull();
    expect(summariseAirbkk(points.slice(0, 18), NIGHT)).not.toBeNull();
  });

  it("ignores hours older than 24 hours", () => {
    expect(summariseAirbkk(points, new Date("2026-10-03T12:00:00+07:00"))).toBeNull();
  });

  it("builds the reading with the station and source", () => {
    const reading = buildPm25Nearest(summariseAirbkk(points, NIGHT), {
      en: "Suan Luang Rama 8",
      th: "สวนหลวงพระราม 8",
    });
    expect(reading.id).toBe("pm25Nearest");
    expect(reading.unit).toBe("ugm3");
    expect(reading.staleAfterMinutes).toBe(120);
    expect(reading.source.url).toBe("https://official.airbkk.com/airbkk/");
    expect(reading.series).toHaveLength(24);
  });

  it("builds a null reading when there is no summary", () => {
    const reading = buildPm25Nearest(null, { en: "A", th: "ก" });
    expect(reading.value).toBeNull();
    expect(reading.observedAt).toBeNull();
  });
});

describe("parseAir4Thai", () => {
  it("picks the nearest Bangkok station with a PM2.5 value", () => {
    const result = parseAir4Thai(json("air4thai.json"));
    expect(result?.station.en).toBe("Bangkok Noi Train Police Station");
    expect(result?.value).toBe(27.9);
    expect(result?.observedAt).toBe("2026-10-03T09:00:00+07:00");
    expect(result?.distanceKm).toBeLessThan(3);
  });

  it("skips stations whose PM2.5 is missing", () => {
    const raw = json("air4thai.json") as { stations: { AQILast: { PM25: { value: string } } }[] };
    raw.stations.slice(0, 1).forEach((station) => {
      station.AQILast.PM25.value = "-1";
    });
    raw.stations.slice(1, 2).forEach((station) => {
      station.AQILast.PM25.value = "-999";
    });
    const result = parseAir4Thai(raw);
    expect(result?.station.en).toBe("Rama VIII Park");
    expect(result?.value).toBe(22.9);
  });

  it("returns null when no station has a value or the input is malformed", () => {
    const raw = json("air4thai.json") as { stations: { AQILast: { PM25: { value: string } } }[] };
    raw.stations.forEach((station) => {
      station.AQILast.PM25.value = "-1";
    });
    expect(parseAir4Thai(raw)).toBeNull();
    expect(parseAir4Thai(null)).toBeNull();
    expect(parseAir4Thai({ stations: "x" })).toBeNull();
  });

  it("builds readings for both outcomes", () => {
    const reading = buildPm25Official(parseAir4Thai(json("air4thai.json")));
    expect(reading.id).toBe("pm25Official");
    expect(reading.value).toBe(27.9);
    expect(reading.source.url).toBe("https://air4thai.pcd.go.th/");
    expect(reading.staleAfterMinutes).toBe(180);
    const empty = buildPm25Official(null);
    expect(empty.value).toBeNull();
    expect(empty.observedAt).toBeNull();
  });
});

describe("parseOpenMeteoAir", () => {
  const now = new Date("2026-10-03T09:40:00+07:00");

  it("averages tomorrow's hourly PM2.5", () => {
    const raw = json("open-meteo-air.json") as { hourly: { time: string[]; pm2_5: number[] } };
    const tomorrow = raw.hourly.pm2_5.filter((_, index) =>
      raw.hourly.time[index]?.startsWith("2026-10-04")
    );
    const expected = tomorrow.reduce((sum, value) => sum + value, 0) / tomorrow.length;
    const reading = parseOpenMeteoAir(raw, now);
    expect(reading.id).toBe("pm25Forecast");
    expect(reading.value).toBe(Math.round(expected * 10) / 10);
    expect(reading.series).toHaveLength(24);
    expect(reading.modelled).toBe(true);
    expect(reading.observedAt).toBe("2026-10-03T09:40:00+07:00");
    expect(reading.source.url).toBe("https://open-meteo.com/");
  });

  it("returns null when tomorrow is not covered or the input is malformed", () => {
    expect(
      parseOpenMeteoAir(json("open-meteo-air.json"), new Date("2026-10-10T09:00:00+07:00")).value
    ).toBeNull();
    expect(parseOpenMeteoAir(null, now).value).toBeNull();
    expect(parseOpenMeteoAir({ hourly: {} }, now).observedAt).toBeNull();
  });
});
