import { describe, expect, it } from "vitest";
import { readingCopy, readingSections } from "@/content/conditions/readings";
import { cardTitles, levelLabels, ruleWhy, verdictCopy } from "@/content/conditions/rules";
import type { Reading, ReadingId, Unit, Verdict } from "@/lib/conditions/types";
import { buildVerdicts } from "@/lib/conditions/verdicts";

const NOW = new Date("2026-10-01T21:20:00+07:00");
const HOUR_MS = 3_600_000;

const units: Record<ReadingId, Unit> = {
  riverKrungThep: "m",
  riverSamsen: "m",
  riverPakKhlongTalat: "m",
  damRelease: "m3s",
  damReleaseForecast: "m3s",
  riverForecastNonthaburi: "m",
  tide: "m",
  rainGauge24h: "mm",
  roadFlood: "cm",
  urbanFloodWarning: "flag",
  rainForecast: "mmh",
  rainProbability: "percent",
  heatIndex: "celsius",
  uvIndex: "uv",
  tmdWarning: "flag",
  capAlert: "count",
  pm25Nearest: "ugm3",
  pm25Official: "ugm3",
  pm25Forecast: "ugm3",
  roadIncidents: "count",
  roadClosuresNear: "count",
  earthquake: "magnitude",
  storm: "km",
};

type Overrides = Partial<Omit<Reading, "id">>;

function reading(id: ReadingId, value: number | null, overrides: Overrides = {}): Reading {
  return {
    id,
    value,
    unit: units[id],
    observedAt: value === null ? null : NOW.toISOString(),
    staleAfterMinutes: 60,
    station: { en: "Test station", th: "สถานีทดสอบ" },
    source: { name: { en: "Test", th: "ทดสอบ" }, url: "https://example.com" },
    ...overrides,
  };
}

function iso(timestamp: number) {
  return new Date(timestamp).toISOString();
}

function tideSeries(peaks: { at: string; height: number }[]) {
  return peaks.flatMap(({ at, height }) =>
    [-2, -1, 0, 1, 2].map((offset) => ({
      at: iso(Date.parse(at) + offset * HOUR_MS),
      value: height - Math.abs(offset) * 0.2,
    }))
  );
}

function rainSeries(points: [string, number][]) {
  return points.map(([at, value]) => ({ at, value }));
}

const calmTide = tideSeries([{ at: "2026-10-02T12:00:00+07:00", height: 0.5 }]);
const quietRain = rainSeries([
  ["2026-10-01T21:00:00+07:00", 0],
  ["2026-10-01T22:00:00+07:00", 0],
  ["2026-10-01T23:00:00+07:00", 0],
  ["2026-10-02T00:00:00+07:00", 0],
]);

function calmReadings(replacements: Reading[] = []): Reading[] {
  const defaults: Reading[] = [
    reading("riverKrungThep", 1.0),
    reading("riverPakKhlongTalat", 1.0),
    reading("damRelease", 1000, { staleAfterMinutes: 240 }),
    reading("tide", 0.5, { staleAfterMinutes: 1440, series: calmTide }),
    reading("rainForecast", 0, { staleAfterMinutes: 180, series: quietRain }),
    reading("roadFlood", 0),
    reading("urbanFloodWarning", 0),
    reading("tmdWarning", 0),
    reading("capAlert", 0),
    reading("roadIncidents", 0, { staleAfterMinutes: 30 }),
    reading("roadClosuresNear", 0, { staleAfterMinutes: 30 }),
    reading("earthquake", 0, { staleAfterMinutes: 30 }),
    reading("pm25Nearest", 10, { staleAfterMinutes: 120 }),
    reading("heatIndex", 35, { staleAfterMinutes: 180 }),
    reading("uvIndex", 3, { staleAfterMinutes: 360 }),
    reading("storm", 10000, { staleAfterMinutes: 360 }),
  ];
  const replaced = new Set(replacements.map((item) => item.id));
  return [...defaults.filter((item) => !replaced.has(item.id)), ...replacements];
}

function cardOf(verdicts: Verdict[], card: Verdict["card"]) {
  const found = verdicts.find((verdict) => verdict.card === card);
  if (!found) throw new Error(`missing card ${card}`);
  return found;
}

function hitIds(verdict: Verdict) {
  return verdict.hits.map((hit) => hit.ruleId);
}

describe("calm conditions", () => {
  it("returns four cards in the fixed order, all normal, with nothing unchecked", () => {
    const verdicts = buildVerdicts(calmReadings(), NOW);
    expect(verdicts.map((verdict) => verdict.card)).toEqual([
      "travel",
      "campus",
      "riverside",
      "health",
    ]);
    for (const verdict of verdicts) {
      expect(verdict.level).toBe("normal");
      expect(verdict.hits).toEqual([]);
      expect(verdict.unchecked).toEqual([]);
      expect(verdict.headline).toEqual(verdictCopy[verdict.card].normal.headline);
      expect(verdict.action).toEqual(verdictCopy[verdict.card].normal.action);
    }
  });

  it("still returns four cards when there are no readings at all", () => {
    const verdicts = buildVerdicts([], NOW);
    expect(verdicts).toHaveLength(4);
    expect(verdicts.every((verdict) => verdict.level === "unknown")).toBe(true);
  });
});

describe("single value rules", () => {
  const cases: {
    rule: string;
    card: Verdict["card"];
    level: Verdict["level"];
    replacement: Reading;
    justBelow: Reading;
  }[] = [
    {
      rule: "R1",
      card: "riverside",
      level: "takeCare",
      replacement: reading("riverKrungThep", 1.5),
      justBelow: reading("riverKrungThep", 1.49),
    },
    {
      rule: "R2",
      card: "riverside",
      level: "takeCare",
      replacement: reading("damRelease", 1800, { staleAfterMinutes: 240 }),
      justBelow: reading("damRelease", 1799, { staleAfterMinutes: 240 }),
    },
    {
      rule: "R4",
      card: "riverside",
      level: "disruption",
      replacement: reading("riverKrungThep", 1.9),
      justBelow: reading("riverKrungThep", 1.89),
    },
    {
      rule: "R5",
      card: "riverside",
      level: "disruption",
      replacement: reading("riverPakKhlongTalat", 2.8),
      justBelow: reading("riverPakKhlongTalat", 2.79),
    },
    {
      rule: "C1",
      card: "campus",
      level: "takeCare",
      replacement: reading("rainForecast", 20, { staleAfterMinutes: 180, series: quietRain }),
      justBelow: reading("rainForecast", 19, { staleAfterMinutes: 180, series: quietRain }),
    },
    {
      rule: "C2",
      card: "campus",
      level: "takeCare",
      replacement: reading("roadFlood", 5),
      justBelow: reading("roadFlood", 4),
    },
    {
      rule: "C3",
      card: "campus",
      level: "takeCare",
      replacement: reading("tmdWarning", 1),
      justBelow: reading("tmdWarning", 0),
    },
    {
      rule: "C4",
      card: "campus",
      level: "takeCare",
      replacement: reading("capAlert", 1),
      justBelow: reading("capAlert", 0),
    },
    {
      rule: "C6",
      card: "campus",
      level: "disruption",
      replacement: reading("urbanFloodWarning", 1),
      justBelow: reading("urbanFloodWarning", 0),
    },
    {
      rule: "C7",
      card: "campus",
      level: "disruption",
      replacement: reading("roadFlood", 20),
      justBelow: reading("roadFlood", 19),
    },
    {
      rule: "T1",
      card: "travel",
      level: "takeCare",
      replacement: reading("roadIncidents", 1, { staleAfterMinutes: 30 }),
      justBelow: reading("roadIncidents", 0, { staleAfterMinutes: 30 }),
    },
    {
      rule: "T4",
      card: "travel",
      level: "disruption",
      replacement: reading("roadClosuresNear", 1, { staleAfterMinutes: 30 }),
      justBelow: reading("roadClosuresNear", 0, { staleAfterMinutes: 30 }),
    },
    {
      rule: "T5",
      card: "travel",
      level: "disruption",
      replacement: reading("riverKrungThep", 1.9),
      justBelow: reading("riverKrungThep", 1.89),
    },
    {
      rule: "T6",
      card: "travel",
      level: "disruption",
      replacement: reading("earthquake", 5.2, { staleAfterMinutes: 30 }),
      justBelow: reading("earthquake", 0, { staleAfterMinutes: 30 }),
    },
    {
      rule: "H1",
      card: "health",
      level: "takeCare",
      replacement: reading("pm25Nearest", 15.1, { staleAfterMinutes: 120 }),
      justBelow: reading("pm25Nearest", 15, { staleAfterMinutes: 120 }),
    },
    {
      rule: "H2",
      card: "health",
      level: "takeCare",
      replacement: reading("heatIndex", 41, { staleAfterMinutes: 180 }),
      justBelow: reading("heatIndex", 40.9, { staleAfterMinutes: 180 }),
    },
    {
      rule: "H3",
      card: "health",
      level: "takeCare",
      replacement: reading("uvIndex", 8, { staleAfterMinutes: 360 }),
      justBelow: reading("uvIndex", 7, { staleAfterMinutes: 360 }),
    },
    {
      rule: "H4",
      card: "health",
      level: "disruption",
      replacement: reading("pm25Nearest", 37.6, { staleAfterMinutes: 120 }),
      justBelow: reading("pm25Nearest", 37.5, { staleAfterMinutes: 120 }),
    },
    {
      rule: "H5",
      card: "health",
      level: "disruption",
      replacement: reading("heatIndex", 54, { staleAfterMinutes: 180 }),
      justBelow: reading("heatIndex", 53.9, { staleAfterMinutes: 180 }),
    },
    {
      rule: "H6",
      card: "health",
      level: "disruption",
      replacement: reading("storm", 300, { staleAfterMinutes: 360 }),
      justBelow: reading("storm", 301, { staleAfterMinutes: 360 }),
    },
  ];

  it.each(cases)("$rule fires at its threshold and not just below it", (testCase) => {
    const at = cardOf(buildVerdicts(calmReadings([testCase.replacement]), NOW), testCase.card);
    expect(hitIds(at)).toContain(testCase.rule);
    expect(at.level).toBe(testCase.level);
    expect(at.hits.find((hit) => hit.ruleId === testCase.rule)?.why).toEqual(
      ruleWhy[testCase.rule as keyof typeof ruleWhy]
    );

    const below = cardOf(buildVerdicts(calmReadings([testCase.justBelow]), NOW), testCase.card);
    expect(hitIds(below)).not.toContain(testCase.rule);
  });
});

describe("riverside tide rules", () => {
  const dam = (value: number) => reading("damRelease", value, { staleAfterMinutes: 240 });
  const tide = (peaks: { at: string; height: number }[]) =>
    reading("tide", 0.7, { staleAfterMinutes: 1440, series: tideSeries(peaks) });

  it("R3 fires within 2 hours of a high tide above 0.60 m", () => {
    const riverside = cardOf(
      buildVerdicts(calmReadings([tide([{ at: "2026-10-01T22:30:00+07:00", height: 0.7 }])]), NOW),
      "riverside"
    );
    expect(hitIds(riverside)).toEqual(["R3"]);
    expect(riverside.level).toBe("takeCare");
  });

  it("R3 counts a high tide that has just passed", () => {
    const riverside = cardOf(
      buildVerdicts(calmReadings([tide([{ at: "2026-10-01T19:30:00+07:00", height: 0.7 }])]), NOW),
      "riverside"
    );
    expect(hitIds(riverside)).toContain("R3");
  });

  it("R3 ignores a tide more than 2 hours away", () => {
    const riverside = cardOf(
      buildVerdicts(calmReadings([tide([{ at: "2026-10-02T00:00:00+07:00", height: 0.9 }])]), NOW),
      "riverside"
    );
    expect(hitIds(riverside)).toEqual([]);
  });

  it("R3 ignores a high tide of 0.60 m or less", () => {
    const riverside = cardOf(
      buildVerdicts(calmReadings([tide([{ at: "2026-10-01T22:00:00+07:00", height: 0.6 }])]), NOW),
      "riverside"
    );
    expect(hitIds(riverside)).toEqual([]);
  });

  it("R3 ignores a point on a rising slope that is not a local maximum", () => {
    const rising = ["20:00", "21:00", "22:00", "23:00"].map((time, index) => ({
      at: `2026-10-01T${time}:00+07:00`,
      value: 0.7 + index * 0.1,
    }));
    const riverside = cardOf(
      buildVerdicts(
        calmReadings([reading("tide", 1, { staleAfterMinutes: 1440, series: rising })]),
        NOW
      ),
      "riverside"
    );
    expect(hitIds(riverside)).not.toContain("R3");
  });

  it("R6 needs both the dam at 2,400 and a tide above 0.60 m in the next 24 hours", () => {
    const farTide = [{ at: "2026-10-02T15:00:00+07:00", height: 0.8 }];
    const both = cardOf(buildVerdicts(calmReadings([dam(2400), tide(farTide)]), NOW), "riverside");
    expect(hitIds(both)).toEqual(["R2", "R6"]);
    expect(both.level).toBe("disruption");

    const damOnly = cardOf(buildVerdicts(calmReadings([dam(2400)]), NOW), "riverside");
    expect(hitIds(damOnly)).toEqual(["R2"]);

    const lowDam = cardOf(
      buildVerdicts(calmReadings([dam(2399), tide(farTide)]), NOW),
      "riverside"
    );
    expect(hitIds(lowDam)).toEqual(["R2"]);
  });

  it("R6 ignores a tide more than 24 hours ahead", () => {
    const riverside = cardOf(
      buildVerdicts(
        calmReadings([dam(2500), tide([{ at: "2026-10-02T23:00:00+07:00", height: 0.9 }])]),
        NOW
      ),
      "riverside"
    );
    expect(hitIds(riverside)).not.toContain("R6");
  });
});

describe("campus rule C5", () => {
  const tide = reading("tide", 0.9, {
    staleAfterMinutes: 1440,
    series: tideSeries([{ at: "2026-10-01T22:00:00+07:00", height: 0.9 }]),
  });
  const rainAtTide = reading("rainForecast", 25, {
    staleAfterMinutes: 180,
    series: rainSeries([
      ["2026-10-01T21:00:00+07:00", 0],
      ["2026-10-01T22:00:00+07:00", 25],
      ["2026-10-01T23:00:00+07:00", 0],
    ]),
  });

  it("fires when heavy rain, a high tide and a high river coincide", () => {
    const campus = cardOf(
      buildVerdicts(calmReadings([tide, rainAtTide, reading("riverKrungThep", 1.5)]), NOW),
      "campus"
    );
    expect(hitIds(campus)).toEqual(["C1", "C5"]);
    expect(campus.level).toBe("disruption");
  });

  it("does not fire while the river is below 1.50 m", () => {
    const campus = cardOf(
      buildVerdicts(calmReadings([tide, rainAtTide, reading("riverKrungThep", 1.49)]), NOW),
      "campus"
    );
    expect(hitIds(campus)).toEqual(["C1"]);
    expect(campus.level).toBe("takeCare");
  });

  it("does not fire when the heavy rain is far from the high tide", () => {
    const rainLater = reading("rainForecast", 25, {
      staleAfterMinutes: 180,
      series: rainSeries([
        ["2026-10-01T21:00:00+07:00", 25],
        ["2026-10-01T22:00:00+07:00", 0],
      ]),
    });
    const farTide = reading("tide", 0.9, {
      staleAfterMinutes: 1440,
      series: tideSeries([{ at: "2026-10-02T02:00:00+07:00", height: 0.9 }]),
    });
    const campus = cardOf(
      buildVerdicts(calmReadings([farTide, rainLater, reading("riverKrungThep", 1.6)]), NOW),
      "campus"
    );
    expect(hitIds(campus)).toEqual(["C1"]);
  });

  it("ignores rain more than 3 hours ahead", () => {
    const lateRain = reading("rainForecast", 0, {
      staleAfterMinutes: 180,
      series: rainSeries([
        ["2026-10-01T22:00:00+07:00", 0],
        ["2026-10-02T01:00:00+07:00", 30],
      ]),
    });
    const campus = cardOf(
      buildVerdicts(calmReadings([tide, lateRain, reading("riverKrungThep", 1.6)]), NOW),
      "campus"
    );
    expect(hitIds(campus)).toEqual([]);
  });
});

describe("travel rules T2 and T3", () => {
  const morning = new Date("2026-10-02T06:30:00+07:00");

  function morningReadings(series: [string, number][]) {
    return calmReadings(
      [
        reading("riverKrungThep", 1.0),
        reading("damRelease", 1000, { staleAfterMinutes: 240 }),
        reading("tide", 0.5, { staleAfterMinutes: 1440, series: calmTide }),
        reading("rainForecast", 0, { staleAfterMinutes: 180, series: rainSeries(series) }),
        reading("roadIncidents", 0, { staleAfterMinutes: 30 }),
        reading("roadClosuresNear", 0, { staleAfterMinutes: 30 }),
        reading("earthquake", 0, { staleAfterMinutes: 30 }),
      ].map((item) => ({ ...item, observedAt: morning.toISOString() }))
    ).map((item) => ({ ...item, observedAt: morning.toISOString() }));
  }

  it("T2 fires for 10 mm in the morning rush hour", () => {
    const travel = cardOf(
      buildVerdicts(morningReadings([["2026-10-02T07:00:00+07:00", 10]]), morning),
      "travel"
    );
    expect(hitIds(travel)).toEqual(["T2"]);
    expect(travel.level).toBe("takeCare");
  });

  it("T2 fires in the evening rush hour", () => {
    const evening = new Date("2026-10-02T15:30:00+07:00");
    const readings = morningReadings([["2026-10-02T17:00:00+07:00", 12]]).map((item) => ({
      ...item,
      observedAt: evening.toISOString(),
    }));
    expect(hitIds(cardOf(buildVerdicts(readings, evening), "travel"))).toEqual(["T2"]);
  });

  it("T2 ignores rain outside the rush hours and below 10 mm", () => {
    expect(
      hitIds(
        cardOf(
          buildVerdicts(morningReadings([["2026-10-02T09:00:00+07:00", 9.9]]), morning),
          "travel"
        )
      )
    ).toEqual([]);
    const noon = new Date("2026-10-02T11:30:00+07:00");
    const readings = morningReadings([["2026-10-02T12:00:00+07:00", 15]]).map((item) => ({
      ...item,
      observedAt: noon.toISOString(),
    }));
    expect(hitIds(cardOf(buildVerdicts(readings, noon), "travel"))).toEqual([]);
  });

  it("T3 follows the riverside card at takeCare and at disruption", () => {
    const takeCare = cardOf(
      buildVerdicts(calmReadings([reading("riverKrungThep", 1.6)]), NOW),
      "travel"
    );
    expect(hitIds(takeCare)).toEqual(["T3"]);
    expect(takeCare.level).toBe("takeCare");

    const disruption = cardOf(
      buildVerdicts(calmReadings([reading("riverKrungThep", 2.0)]), NOW),
      "travel"
    );
    expect(hitIds(disruption)).toEqual(["T3", "T5"]);
    expect(disruption.level).toBe("disruption");
  });

  it("T3 stays quiet when the riverside card is normal", () => {
    expect(hitIds(cardOf(buildVerdicts(calmReadings(), NOW), "travel"))).toEqual([]);
  });
});

describe("health fallback and levels", () => {
  it("uses the official PM2.5 reading when the nearest station is not fresh", () => {
    const health = cardOf(
      buildVerdicts(
        calmReadings([
          reading("pm25Nearest", null, { staleAfterMinutes: 120 }),
          reading("pm25Official", 40, { staleAfterMinutes: 180 }),
        ]),
        NOW
      ),
      "health"
    );
    expect(hitIds(health)).toEqual(["H1", "H4"]);
    expect(health.level).toBe("disruption");
    expect(health.unchecked).toEqual([]);
  });

  it("prefers the nearest station when both are fresh", () => {
    const health = cardOf(
      buildVerdicts(
        calmReadings([
          reading("pm25Nearest", 10, { staleAfterMinutes: 120 }),
          reading("pm25Official", 80, { staleAfterMinutes: 180 }),
        ]),
        NOW
      ),
      "health"
    );
    expect(health.hits).toEqual([]);
    expect(health.level).toBe("normal");
  });

  it("takes the highest level among several hits", () => {
    const health = cardOf(
      buildVerdicts(
        calmReadings([
          reading("heatIndex", 41, { staleAfterMinutes: 180 }),
          reading("storm", 250, { staleAfterMinutes: 360 }),
        ]),
        NOW
      ),
      "health"
    );
    expect(hitIds(health)).toEqual(["H2", "H6"]);
    expect(health.level).toBe("disruption");
  });
});

describe("unknown and stale data", () => {
  it("is unknown when a required input is missing and no rule fired", () => {
    const readings = calmReadings().filter((item) => item.id !== "damRelease");
    const riverside = cardOf(buildVerdicts(readings, NOW), "riverside");
    expect(riverside.level).toBe("unknown");
    expect(riverside.unchecked).toEqual(["damRelease"]);
    expect(riverside.headline).toEqual(verdictCopy.riverside.unknown.headline);
  });

  it("keeps the level from a rule that fired even when a required input is missing", () => {
    const readings = calmReadings([reading("riverKrungThep", 1.95)]).filter(
      (item) => item.id !== "tide"
    );
    const riverside = cardOf(buildVerdicts(readings, NOW), "riverside");
    expect(riverside.level).toBe("disruption");
    expect(riverside.unchecked).toEqual(["tide"]);
  });

  it("is unknown for health when neither PM2.5 source is fresh", () => {
    const readings = calmReadings().filter((item) => item.id !== "pm25Nearest");
    const health = cardOf(buildVerdicts(readings, NOW), "health");
    expect(health.level).toBe("unknown");
    expect(health.unchecked).toEqual(["pm25Nearest", "pm25Official"]);
  });

  it("is unknown for campus when the rain forecast is missing", () => {
    const readings = calmReadings().filter((item) => item.id !== "rainForecast");
    const campus = cardOf(buildVerdicts(readings, NOW), "campus");
    expect(campus.level).toBe("unknown");
    expect(campus.unchecked).toContain("rainForecast");
  });

  it("is unknown for travel when the incident feed fails, and lists the optional inputs it cannot see", () => {
    const readings = calmReadings([
      reading("roadIncidents", null, { staleAfterMinutes: 30 }),
      reading("roadClosuresNear", null, { staleAfterMinutes: 30 }),
    ]);
    const travel = cardOf(buildVerdicts(readings, NOW), "travel");
    expect(travel.level).toBe("unknown");
    expect(travel.unchecked).toEqual(["roadIncidents", "roadClosuresNear"]);
  });

  it("stays normal when only an optional input is missing, and lists it as unchecked", () => {
    const readings = calmReadings().filter(
      (item) => item.id !== "riverPakKhlongTalat" && item.id !== "roadFlood"
    );
    const riverside = cardOf(buildVerdicts(readings, NOW), "riverside");
    expect(riverside.level).toBe("normal");
    expect(riverside.unchecked).toEqual(["riverPakKhlongTalat"]);
    const campus = cardOf(buildVerdicts(readings, NOW), "campus");
    expect(campus.level).toBe("normal");
    expect(campus.unchecked).toEqual(["roadFlood"]);
  });

  it("ignores a stale reading that would otherwise fire a rule", () => {
    const staleRiver = reading("riverKrungThep", 2.1, {
      observedAt: new Date(NOW.getTime() - 61 * 60_000).toISOString(),
    });
    const verdicts = buildVerdicts(calmReadings([staleRiver]), NOW);
    const riverside = cardOf(verdicts, "riverside");
    expect(riverside.level).toBe("unknown");
    expect(riverside.hits).toEqual([]);
    expect(riverside.unchecked).toEqual(["riverKrungThep"]);
    expect(cardOf(verdicts, "travel").level).toBe("unknown");
  });

  it("counts a reading exactly at its stale limit as fresh", () => {
    const onTheLimit = reading("riverKrungThep", 1.6, {
      observedAt: new Date(NOW.getTime() - 60 * 60_000).toISOString(),
    });
    const riverside = cardOf(buildVerdicts(calmReadings([onTheLimit]), NOW), "riverside");
    expect(hitIds(riverside)).toEqual(["R1"]);
  });

  it("ignores a stale Pak Khlong Talat reading, as when the gauge has stalled", () => {
    const stalled = reading("riverPakKhlongTalat", 3.1, {
      observedAt: "2026-09-28T10:00:00+07:00",
    });
    const riverside = cardOf(buildVerdicts(calmReadings([stalled]), NOW), "riverside");
    expect(riverside.level).toBe("normal");
    expect(riverside.unchecked).toEqual(["riverPakKhlongTalat"]);
  });

  it("ignores a stale tide series", () => {
    const staleTide = reading("tide", 0.9, {
      staleAfterMinutes: 1440,
      observedAt: new Date(NOW.getTime() - 25 * HOUR_MS).toISOString(),
      series: tideSeries([{ at: "2026-10-01T22:00:00+07:00", height: 0.9 }]),
    });
    const riverside = cardOf(buildVerdicts(calmReadings([staleTide]), NOW), "riverside");
    expect(riverside.level).toBe("unknown");
    expect(riverside.hits).toEqual([]);
  });
});

describe("replay of 1 October 2026 at 21:20", () => {
  const replay = calmReadings([
    reading("riverKrungThep", 1.29),
    reading("damRelease", 2430, { staleAfterMinutes: 240 }),
    reading("tide", 0.93, {
      staleAfterMinutes: 1440,
      series: tideSeries([
        { at: "2026-10-01T20:00:00+07:00", height: 0.87 },
        { at: "2026-10-02T20:00:00+07:00", height: 0.93 },
      ]),
    }),
    reading("pm25Nearest", 16, { staleAfterMinutes: 120 }),
    reading("rainForecast", 0, { staleAfterMinutes: 180, series: quietRain }),
    reading("roadIncidents", 0, { staleAfterMinutes: 30 }),
  ]);

  it("gives riverside disruption, travel take care, campus normal and health take care", () => {
    const verdicts = buildVerdicts(replay, NOW);
    expect(verdicts.map((verdict) => [verdict.card, verdict.level])).toEqual([
      ["travel", "takeCare"],
      ["campus", "normal"],
      ["riverside", "disruption"],
      ["health", "takeCare"],
    ]);
  });

  it("explains each verdict with the rules that fired", () => {
    const verdicts = buildVerdicts(replay, NOW);
    expect(hitIds(cardOf(verdicts, "riverside"))).toEqual(["R2", "R3", "R6"]);
    expect(hitIds(cardOf(verdicts, "travel"))).toEqual(["T3"]);
    expect(hitIds(cardOf(verdicts, "campus"))).toEqual([]);
    expect(hitIds(cardOf(verdicts, "health"))).toEqual(["H1"]);
    expect(cardOf(verdicts, "riverside").headline).toEqual(
      verdictCopy.riverside.disruption.headline
    );
  });
});

describe("copy", () => {
  const allCopy = [
    ...Object.values(cardTitles),
    ...Object.values(levelLabels),
    ...Object.values(ruleWhy),
    ...Object.values(verdictCopy).flatMap((levels) =>
      Object.values(levels).flatMap((entry) => [entry.headline, entry.action])
    ),
    ...Object.values(readingCopy).flatMap((entry) => [entry.label, entry.threshold]),
    ...readingSections.map((section) => section.heading),
  ].flatMap((text) => [text.en, text.th]);

  it("has no empty strings", () => {
    expect(allCopy.every((text) => text.trim().length > 0)).toBe(true);
  });

  it("uses no dashes and no colons outside clock times", () => {
    for (const text of allCopy) {
      expect(text, text).not.toMatch(/[-–—]/);
      expect(text, text).not.toMatch(/(?<!\d):|:(?!\d)/);
    }
  });

  it("keeps English sentences under 25 words", () => {
    const english = [
      ...Object.values(ruleWhy),
      ...Object.values(verdictCopy).flatMap((levels) =>
        Object.values(levels).flatMap((entry) => [entry.headline, entry.action])
      ),
    ].map((text) => text.en);
    for (const text of english) {
      for (const sentence of text.split(/(?<=\.)\s+/)) {
        expect(sentence.split(/\s+/).length, sentence).toBeLessThan(25);
      }
    }
  });

  it("puts every reading in exactly one section", () => {
    const listed = readingSections.flatMap((section) => section.readings);
    expect(new Set(listed).size).toBe(listed.length);
    expect([...listed].sort()).toEqual(Object.keys(readingCopy).sort());
    expect(readingSections.map((section) => section.id)).toEqual([
      "water",
      "weather",
      "air",
      "travel",
    ]);
  });
});
