import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  bangkokIso,
  buildCapReading,
  heatIndexCelsius,
  parseCapAlert,
  parseCapRss,
  parseOpenMeteo,
  parseTmdWarnings,
} from "@/lib/conditions/sources/weather";

const fixture = (name: string) =>
  readFileSync(join(__dirname, "fixtures/conditions", name), "utf8");
const json = (name: string): unknown => JSON.parse(fixture(name));

const MORNING = new Date("2026-10-03T09:40:00+07:00");

describe("heatIndexCelsius", () => {
  it("matches the NWS table for 32 C and 70 percent humidity", () => {
    expect(heatIndexCelsius(32, 70)).toBeGreaterThan(40);
    expect(heatIndexCelsius(32, 70)).toBeLessThan(41.8);
  });

  it("matches the NWS table for 35 C and 50 percent humidity", () => {
    expect(heatIndexCelsius(35, 50)).toBeGreaterThan(39.5);
    expect(heatIndexCelsius(35, 50)).toBeLessThan(41.5);
  });

  it("uses the simple formula below 80 F and stays close to the air temperature", () => {
    const value = heatIndexCelsius(25, 60);
    expect(value).toBeGreaterThan(24);
    expect(value).toBeLessThan(26.5);
  });

  it("applies the dry air adjustment", () => {
    expect(heatIndexCelsius(35, 10)).toBeLessThan(heatIndexCelsius(35, 30));
  });

  it("applies the humid air adjustment", () => {
    expect(heatIndexCelsius(30, 90)).toBeGreaterThan(heatIndexCelsius(30, 80));
  });
});

describe("parseOpenMeteo", () => {
  const readings = parseOpenMeteo(json("open-meteo.json"), MORNING);
  const byId = (id: string) => {
    const found = readings.find((reading) => reading.id === id);
    if (!found) throw new Error(`missing ${id}`);
    return found;
  };

  it("returns the four readings in order", () => {
    expect(readings.map((reading) => reading.id)).toEqual([
      "rainForecast",
      "rainProbability",
      "heatIndex",
      "uvIndex",
    ]);
  });

  it("takes the maximum precipitation over the next three hours", () => {
    const raw = json("open-meteo.json") as {
      hourly: { time: string[]; precipitation: number[]; precipitation_probability: number[] };
    };
    const start = raw.hourly.time.indexOf("2026-10-03T09:00");
    const window = raw.hourly.precipitation.slice(start, start + 3);
    expect(byId("rainForecast").value).toBe(Math.max(...window));
    const probabilities = raw.hourly.precipitation_probability.slice(start, start + 3);
    expect(byId("rainProbability").value).toBe(Math.max(...probabilities));
  });

  it("builds a 24 hour series with Bangkok offsets", () => {
    const series = byId("rainForecast").series ?? [];
    expect(series).toHaveLength(24);
    expect(series[0]?.at).toBe("2026-10-03T09:00:00+07:00");
    expect(series[23]?.at).toBe("2026-10-04T08:00:00+07:00");
  });

  it("computes a plausible heat index", () => {
    expect(byId("heatIndex").value).toBeGreaterThan(25);
    expect(byId("heatIndex").value).toBeLessThan(60);
    expect(byId("heatIndex").unit).toBe("celsius");
  });

  it("reads the UV index for the Bangkok date", () => {
    const raw = json("open-meteo.json") as { daily: { uv_index_max: number[] } };
    expect(byId("uvIndex").value).toBe(Math.round((raw.daily.uv_index_max[0] ?? 0) * 10) / 10);
    const nextDay = parseOpenMeteo(json("open-meteo.json"), new Date("2026-10-04T08:00:00+07:00"));
    expect(nextDay[3]?.value).toBe(Math.round((raw.daily.uv_index_max[1] ?? 0) * 10) / 10);
  });

  it("marks every reading modelled and stamped at fetch time", () => {
    for (const reading of readings) {
      expect(reading.modelled).toBe(true);
      expect(reading.observedAt).toBe("2026-10-03T09:40:00+07:00");
      expect(reading.source.url).toBe("https://open-meteo.com/");
    }
  });

  it("returns null values for malformed input", () => {
    for (const bad of [null, "text", {}, { hourly: { time: "x" } }]) {
      const result = parseOpenMeteo(bad, MORNING);
      expect(result).toHaveLength(4);
      for (const reading of result) {
        expect(reading.value).toBeNull();
        expect(reading.observedAt).toBeNull();
      }
    }
  });

  it("tolerates null hourly entries", () => {
    const result = parseOpenMeteo(
      {
        hourly: {
          time: ["2026-10-03T09:00", "2026-10-03T10:00"],
          temperature_2m: [null, 33],
          relative_humidity_2m: [70, 60],
          precipitation: [null, 1.2],
          precipitation_probability: [null, null],
        },
        daily: { time: ["2026-10-03"], uv_index_max: [null] },
      },
      MORNING
    );
    expect(result[0]?.value).toBe(1.2);
    expect(result[1]?.value).toBeNull();
    expect(result[2]?.series).toHaveLength(1);
    expect(result[3]?.value).toBeNull();
  });
});

describe("parseTmdWarnings", () => {
  const raw = json("tmd-warning.json");

  it("flags a recent warning that names Bangkok", () => {
    const reading = parseTmdWarnings(raw, MORNING);
    expect(reading.id).toBe("tmdWarning");
    expect(reading.value).toBe(1);
    expect(reading.items).toHaveLength(1);
    expect(reading.items?.[0]?.title.en).toContain("Variable Weather in Upper Thailand");
    expect(reading.items?.[0]?.title.th).toContain("อากาศแปรปรวน");
    expect(reading.items?.[0]?.at).toBe("2026-10-03T05:31:35+07:00");
    expect(reading.items?.[0]?.href).toMatch(/_en\.pdf$/);
    expect(reading.source.url).toBe("https://data.tmd.go.th/");
  });

  it("ignores a warning announced more than 36 hours ago", () => {
    const reading = parseTmdWarnings(raw, new Date("2026-10-05T09:00:00+07:00"));
    expect(reading.value).toBe(0);
    expect(reading.items).toEqual([]);
  });

  it("returns zero when the warning does not name Bangkok", () => {
    const southern = {
      header: {},
      Warnings: {},
      Warning: {
        AnnounceDate: "2026-10-03 06:00:00",
        TitleThai: "คลื่นลมแรงในทะเลอันดามัน",
        TitleEnglish: ["คลื่นลมแรงในทะเลอันดามัน", "Strong waves in the Andaman Sea"],
      },
    };
    expect(parseTmdWarnings(southern, MORNING).value).toBe(0);
  });

  it("handles Warning as an array and Warnings holding items", () => {
    const asArray = {
      Warnings: {},
      Warning: [
        { AnnounceDate: "2026-10-03 06:00:00", TitleEnglish: "Rain in the South" },
        { AnnounceDate: "2026-10-03 07:00:00", TitleEnglish: "Heavy rain in Bangkok" },
      ],
    };
    expect(parseTmdWarnings(asArray, MORNING).value).toBe(1);
    const inWarnings = {
      Warnings: {
        Warning: [{ AnnounceDate: "2026-10-03 07:00:00", TitleThai: "ฝนตกหนักในกรุงเทพมหานคร" }],
      },
    };
    expect(parseTmdWarnings(inWarnings, MORNING).value).toBe(1);
  });

  it("returns zero for an empty but valid feed and null for an unreadable one", () => {
    expect(parseTmdWarnings({ header: {}, Warnings: {}, Warning: {} }, MORNING).value).toBe(0);
    expect(parseTmdWarnings(null, MORNING).value).toBeNull();
    expect(parseTmdWarnings("nope", MORNING).value).toBeNull();
    expect(parseTmdWarnings(null, MORNING).observedAt).toBeNull();
  });
});

describe("TMD CAP", () => {
  it("lists the CAP files from the RSS feed", () => {
    expect(parseCapRss(fixture("tmd-cap-rss.xml"))).toEqual([
      "https://www.tmd.go.th/uploads/CAP/en/CAPTMD20261003060005_2.xml",
      "https://www.tmd.go.th/uploads/CAP/en/CAPTMD20261002155200_2.xml",
      "https://www.tmd.go.th/uploads/CAP/en/CAPTMD20260930163537_2.xml",
    ]);
  });

  it("limits the list to eight files and ignores foreign hosts", () => {
    const items = Array.from(
      { length: 12 },
      (_, index) => `<item><link>https://www.tmd.go.th/uploads/CAP/en/a${index}.xml</link></item>`
    ).join("");
    const foreign = "<item><link>https://example.com/x.xml</link></item>";
    expect(parseCapRss(`<rss><channel>${foreign}${items}</channel></rss>`)).toHaveLength(8);
  });

  it("parses a CAP file", () => {
    const alert = parseCapAlert(fixture("tmd-cap-CAPTMD20261002155200_2.xml"))[0];
    if (!alert) throw new Error("no alert");
    expect(alert.event).toBe("Heavy Rain");
    expect(alert.headline).toBe("Heavy Rain Risk Area");
    expect(alert.severity).toBe("Severe");
    expect(alert.expires).toBe("2026-10-03T06:00:00+07:00");
    expect(alert.sent).toBe("2026-10-02T17:45:00+07:00");
    expect(alert.geocodes).toContain("TH-20");
    expect(alert.areaDescription).toContain("Chonburi");
    expect(alert.coversBangkok).toBe(false);
  });

  it("detects Bangkok by geocode and by area description", () => {
    const byGeocode = `<alert><status>Actual</status><sent>2026-10-03T08:00:00+07:00</sent><info><event>Flood</event>
      <expires>2026-10-04T00:00:00+07:00</expires><area><areaDesc>Central</areaDesc>
      <geocode><valueName>ISO3166-2</valueName><value>TH-10</value></geocode></area></info></alert>`;
    const byName = `<alert><info><event>Storm</event><area><areaDesc>Nonthaburi Bangkok</areaDesc></area></info></alert>`;
    expect(parseCapAlert(byGeocode)[0]?.coversBangkok).toBe(true);
    expect(parseCapAlert(byName)[0]?.coversBangkok).toBe(true);
  });

  it("ignores test alerts and non CAP text", () => {
    expect(parseCapAlert("<html></html>")).toEqual([]);
    expect(
      parseCapAlert("<alert><status>Test</status><info><event>X</event></info></alert>")
    ).toEqual([]);
  });

  it("counts only unexpired alerts covering Bangkok", () => {
    const alert = (expires: string, area: string) =>
      parseCapAlert(
        `<alert><status>Actual</status><sent>2026-10-03T06:00:00+07:00</sent><info><event>Heavy Rain</event>
        <headline>Heavy Rain Risk Area</headline><expires>${expires}</expires>
        <area><areaDesc>${area}</areaDesc></area></info></alert>`
      );
    const alerts = [
      ...alert("2026-10-03T18:00:00+07:00", "Bangkok"),
      ...alert("2026-10-03T08:00:00+07:00", "Bangkok"),
      ...alert("2026-10-03T18:00:00+07:00", "Krabi"),
    ];
    const reading = buildCapReading(alerts, MORNING);
    expect(reading.value).toBe(1);
    expect(reading.items).toHaveLength(1);
    expect(reading.items?.[0]?.title.th).toContain("ฝนตกหนัก");
  });

  it("reports zero for the recorded fixtures and null when the feed failed", () => {
    const alerts = [
      "tmd-cap-CAPTMD20261003060005_2.xml",
      "tmd-cap-CAPTMD20261002155200_2.xml",
      "tmd-cap-CAPTMD20260930163537_2.xml",
    ].flatMap((name) => parseCapAlert(fixture(name)));
    expect(buildCapReading(alerts, MORNING).value).toBe(0);
    const failed = buildCapReading(null, MORNING);
    expect(failed.value).toBeNull();
    expect(failed.observedAt).toBeNull();
  });
});

describe("bangkokIso", () => {
  it("formats an instant with the Bangkok offset", () => {
    expect(bangkokIso(Date.parse("2026-10-01T14:40:00Z"))).toBe("2026-10-01T21:40:00+07:00");
  });
});
