import { describe, expect, it } from "vitest";
import {
  buildNextHours,
  fillTemplate,
  formatBangkokClock,
  formatBangkokDateTime,
  formatCell,
  formatReadingValue,
  type ValueLabels,
} from "@/lib/conditions/format";
import type { Reading } from "@/lib/conditions/types";

const labels: ValueLabels = {
  yes: "Yes",
  no: "No",
  none: "None",
  mm: "mm",
  cm: "cm",
  mmh: " mm an hour",
  km: "km",
};

describe("formatReadingValue", () => {
  it("formats each unit", () => {
    expect(formatReadingValue(1.286, "m", labels)).toBe("1.29 m");
    expect(formatReadingValue(2430, "m3s", labels)).toBe("2,430 m³/s");
    expect(formatReadingValue(16.2, "ugm3", labels)).toBe("16 µg/m³");
    expect(formatReadingValue(40.6, "celsius", labels)).toBe("41 °C");
    expect(formatReadingValue(30, "percent", labels)).toBe("30%");
    expect(formatReadingValue(12, "mmh", labels)).toBe("12 mm an hour");
    expect(formatReadingValue(5.6, "magnitude", labels)).toBe("M5.6");
    expect(formatReadingValue(14, "cm", labels)).toBe("14 cm");
    expect(formatReadingValue(32, "mm", labels)).toBe("32 mm");
    expect(formatReadingValue(3, "count", labels)).toBe("3");
    expect(formatReadingValue(420.4, "km", labels)).toBe("420 km");
  });

  it("formats flags, no storm and no earthquake", () => {
    expect(formatReadingValue(1, "flag", labels)).toBe("Yes");
    expect(formatReadingValue(0, "flag", labels)).toBe("No");
    expect(formatReadingValue(10000, "km", labels)).toBe("None");
    expect(formatReadingValue(0, "magnitude", labels)).toBe("None");
  });
});

describe("Bangkok time", () => {
  it("reads the clock in UTC+7", () => {
    expect(formatBangkokClock("2026-10-01T14:40:00Z")).toBe("21:40");
    expect(formatBangkokClock("2026-10-01T21:40:00+07:00")).toBe("21:40");
    expect(formatBangkokClock("2026-10-01T17:05:00Z")).toBe("00:05");
  });

  it("adds the day and month", () => {
    expect(formatBangkokDateTime("2026-10-01T14:10:00+07:00", "en")).toBe("1 Oct 14:10");
    expect(formatBangkokDateTime("2026-10-01T14:10:00+07:00", "th")).toBe("1 ต.ค. 14:10");
    expect(formatBangkokDateTime("nonsense", "en")).toBe("");
  });
});

function reading(id: Reading["id"], values: number[], startIso: string): Reading {
  const start = Date.parse(startIso);
  return {
    id,
    value: values[0] ?? null,
    unit: "mmh",
    observedAt: startIso,
    staleAfterMinutes: 180,
    station: { en: "", th: "" },
    source: { name: { en: "", th: "" }, url: "https://example.com" },
    series: values.map((value, index) => ({
      at: new Date(start + index * 3_600_000).toISOString(),
      value,
    })),
  };
}

describe("buildNextHours", () => {
  const now = new Date("2026-10-01T14:20:00Z");

  it("starts at the current hour and aligns series by hour", () => {
    const rows = buildNextHours(
      [
        reading("rainForecast", [1, 2, 3], "2026-10-01T13:00:00Z"),
        reading("tide", [0.5, 0.6, 0.7, 0.8], "2026-10-01T14:00:00Z"),
      ],
      now
    );
    expect(rows.map((row) => row.at)).toEqual([
      "2026-10-01T14:00:00.000Z",
      "2026-10-01T15:00:00.000Z",
      "2026-10-01T16:00:00.000Z",
      "2026-10-01T17:00:00.000Z",
    ]);
    expect(rows[0]).toMatchObject({ rain: 2, tide: 0.5, chance: null, heat: null });
    expect(rows[2]).toMatchObject({ rain: null, tide: 0.7 });
  });

  it("limits the number of hours and copes with no series", () => {
    const long = reading(
      "heatIndex",
      Array.from({ length: 24 }, (_, i) => i),
      "2026-10-01T14:00:00Z"
    );
    expect(buildNextHours([long], now)).toHaveLength(12);
    expect(buildNextHours([], now)).toEqual([]);
  });
});

describe("small helpers", () => {
  it("formats cells and fills templates", () => {
    expect(formatCell(1.234, 1, "n/a")).toBe("1.2");
    expect(formatCell(null, 1, "n/a")).toBe("n/a");
    expect(fillTemplate("Read {time}", { time: "21:40" })).toBe("Read 21:40");
    expect(fillTemplate("Read {other}", {})).toBe("Read {other}");
  });
});
