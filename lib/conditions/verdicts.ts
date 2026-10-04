import {
  CAP_ALERT_TAKE_CARE_COUNT,
  DAM_RELEASE_TAKE_CARE_M3S,
  EVENING_RUSH_HOURS,
  HEAT_INDEX_DISRUPTION_C,
  HEAT_INDEX_TAKE_CARE_C,
  HEAVY_RAIN_MMH,
  HIGH_TIDE_AHEAD_HOURS,
  HIGH_TIDE_MIN_M,
  HIGH_TIDE_WINDOW_HOURS,
  MORNING_RUSH_HOURS,
  PM25_THAI_RED_UGM3,
  PM25_THAI_STANDARD_UGM3,
  RAIN_FALLEN_3H_DISRUPTION_MM,
  RAIN_FALLEN_HOUR_TAKE_CARE_MM,
  RAIN_LOOKAHEAD_HOURS,
  RIVER_KRUNG_THEP_DISRUPTION_M,
  RIVER_KRUNG_THEP_RISING_M,
  RIVER_KRUNG_THEP_TAKE_CARE_M,
  RIVER_PAK_KHLONG_TALAT_DISRUPTION_M,
  ROAD_CLOSURES_NEAR_DISRUPTION_COUNT,
  ROAD_FLOOD_DISRUPTION_CM,
  ROAD_FLOOD_TAKE_CARE_CM,
  ROAD_INCIDENTS_TAKE_CARE_COUNT,
  RUSH_HOUR_RAIN_MMH,
  STORM_DISRUPTION_KM,
  ruleWhy,
  verdictCopy,
  type RuleId,
} from "@/content/conditions/rules";
import {
  isFresh,
  type CardId,
  type Level,
  type Reading,
  type ReadingId,
  type RuleHit,
  type SeriesPoint,
  type Verdict,
} from "@/lib/conditions/types";

const HOUR_MS = 3_600_000;
const BANGKOK_OFFSET_MS = 7 * HOUR_MS;

type Context = {
  now: Date;
  fresh: Map<ReadingId, Reading>;
  riversideLevel: Level;
};

type Rule = {
  id: RuleId;
  level: "takeCare" | "disruption";
  applies: (context: Context) => boolean;
};

type CardSpec = {
  card: CardId;
  rules: Rule[];
  required: ReadingId[][];
  used: ReadingId[];
};

const valueOf = (context: Context, id: ReadingId): number | undefined =>
  context.fresh.get(id)?.value ?? undefined;

const atLeast = (id: ReadingId, threshold: number) => (context: Context) => {
  const value = valueOf(context, id);
  return value !== undefined && value >= threshold;
};

const equalsOne = (id: ReadingId) => (context: Context) => valueOf(context, id) === 1;

const seriesOf = (context: Context, id: ReadingId): SeriesPoint[] =>
  context.fresh.get(id)?.series ?? [];

const timeOf = (point: SeriesPoint) => Date.parse(point.at);

const bangkokHour = (timestamp: number) => new Date(timestamp + BANGKOK_OFFSET_MS).getUTCHours();

const isRushHour = (timestamp: number) => {
  const hour = bangkokHour(timestamp);
  return (
    (hour >= MORNING_RUSH_HOURS.from && hour <= MORNING_RUSH_HOURS.to) ||
    (hour >= EVENING_RUSH_HOURS.from && hour <= EVENING_RUSH_HOURS.to)
  );
};

const highTideTimes = (context: Context): number[] => {
  const series = seriesOf(context, "tide");
  const times: number[] = [];
  series.forEach((point, index) => {
    const before = series[index - 1];
    const after = series[index + 1];
    if (!before || !after) return;
    const isPeak =
      point.value > before.value && point.value >= after.value && point.value > HIGH_TIDE_MIN_M;
    if (isPeak && !Number.isNaN(timeOf(point))) times.push(timeOf(point));
  });
  return times;
};

const isNearHighTide = (timestamp: number, tideTimes: number[]) =>
  tideTimes.some((tideTime) => Math.abs(tideTime - timestamp) <= HIGH_TIDE_WINDOW_HOURS * HOUR_MS);

const highTideSoon = (context: Context): boolean => {
  const start = context.now.getTime();
  const end = start + HIGH_TIDE_AHEAD_HOURS * HOUR_MS;
  return highTideTimes(context).some((time) => time >= start && time <= end);
};

const latestRainHour = (context: Context): number | undefined => {
  const series = seriesOf(context, "rainGauge3h");
  return series[series.length - 1]?.value;
};

const heatIndexAtLeast = (threshold: number) => (context: Context) =>
  atLeast("heatIndex", threshold)(context) || atLeast("heatIndexObserved", threshold)(context);

const earthquakeFelt = (context: Context) => (valueOf(context, "earthquake") ?? 0) > 0;

const rainHoursAhead = (context: Context): SeriesPoint[] => {
  const start = context.now.getTime();
  const end = start + RAIN_LOOKAHEAD_HOURS * HOUR_MS;
  return seriesOf(context, "rainForecast").filter(
    (point) => timeOf(point) + HOUR_MS > start && timeOf(point) <= end
  );
};

const nearestPm25 = (context: Context): number | undefined =>
  valueOf(context, "pm25Nearest") ?? valueOf(context, "pm25Official");

const riversideRules: Rule[] = [
  { id: "R1", level: "takeCare", applies: atLeast("riverKrungThep", RIVER_KRUNG_THEP_TAKE_CARE_M) },
  { id: "R2", level: "takeCare", applies: atLeast("damRelease", DAM_RELEASE_TAKE_CARE_M3S) },
  {
    id: "R3",
    level: "takeCare",
    applies: (context) =>
      atLeast("riverKrungThep", RIVER_KRUNG_THEP_RISING_M)(context) && highTideSoon(context),
  },
  {
    id: "R4",
    level: "disruption",
    applies: atLeast("riverKrungThep", RIVER_KRUNG_THEP_DISRUPTION_M),
  },
  {
    id: "R5",
    level: "disruption",
    applies: atLeast("riverPakKhlongTalat", RIVER_PAK_KHLONG_TALAT_DISRUPTION_M),
  },
];

const campusRules: Rule[] = [
  { id: "C1", level: "takeCare", applies: atLeast("rainForecast", HEAVY_RAIN_MMH) },
  { id: "C2", level: "takeCare", applies: atLeast("roadFlood", ROAD_FLOOD_TAKE_CARE_CM) },
  { id: "C3", level: "takeCare", applies: equalsOne("tmdWarning") },
  { id: "C4", level: "takeCare", applies: atLeast("capAlert", CAP_ALERT_TAKE_CARE_COUNT) },
  {
    id: "C8",
    level: "takeCare",
    applies: (context) => (latestRainHour(context) ?? 0) >= RAIN_FALLEN_HOUR_TAKE_CARE_MM,
  },
  { id: "C11", level: "takeCare", applies: earthquakeFelt },
  {
    id: "C5",
    level: "disruption",
    applies: (context) => {
      if (!atLeast("riverKrungThep", RIVER_KRUNG_THEP_RISING_M)(context)) return false;
      const tideTimes = highTideTimes(context);
      return rainHoursAhead(context).some(
        (point) => point.value >= HEAVY_RAIN_MMH && isNearHighTide(timeOf(point), tideTimes)
      );
    },
  },
  { id: "C6", level: "disruption", applies: equalsOne("urbanFloodWarning") },
  { id: "C7", level: "disruption", applies: atLeast("roadFlood", ROAD_FLOOD_DISRUPTION_CM) },
  { id: "C9", level: "disruption", applies: atLeast("rainGauge3h", RAIN_FALLEN_3H_DISRUPTION_MM) },
  {
    id: "C10",
    level: "disruption",
    applies: atLeast("riverKrungThep", RIVER_KRUNG_THEP_DISRUPTION_M),
  },
];

const travelRules: Rule[] = [
  {
    id: "T1",
    level: "takeCare",
    applies: atLeast("roadIncidents", ROAD_INCIDENTS_TAKE_CARE_COUNT),
  },
  {
    id: "T2",
    level: "takeCare",
    applies: (context) =>
      rainHoursAhead(context).some(
        (point) => point.value >= RUSH_HOUR_RAIN_MMH && isRushHour(timeOf(point))
      ),
  },
  {
    id: "T3",
    level: "takeCare",
    applies: (context) =>
      context.riversideLevel === "takeCare" || context.riversideLevel === "disruption",
  },
  {
    id: "T4",
    level: "disruption",
    applies: atLeast("roadClosuresNear", ROAD_CLOSURES_NEAR_DISRUPTION_COUNT),
  },
  {
    id: "T5",
    level: "disruption",
    applies: atLeast("riverKrungThep", RIVER_KRUNG_THEP_DISRUPTION_M),
  },
  { id: "T6", level: "disruption", applies: earthquakeFelt },
  { id: "T7", level: "disruption", applies: atLeast("rainGauge3h", RAIN_FALLEN_3H_DISRUPTION_MM) },
];

const healthRules: Rule[] = [
  {
    id: "H1",
    level: "takeCare",
    applies: (context) => (nearestPm25(context) ?? 0) > PM25_THAI_STANDARD_UGM3,
  },
  { id: "H2", level: "takeCare", applies: heatIndexAtLeast(HEAT_INDEX_TAKE_CARE_C) },
  { id: "H7", level: "takeCare", applies: equalsOne("thunderstorm") },
  {
    id: "H4",
    level: "disruption",
    applies: (context) => (nearestPm25(context) ?? 0) > PM25_THAI_RED_UGM3,
  },
  { id: "H5", level: "disruption", applies: heatIndexAtLeast(HEAT_INDEX_DISRUPTION_C) },
  {
    id: "H6",
    level: "disruption",
    applies: (context) => {
      const distance = valueOf(context, "storm");
      return distance !== undefined && distance <= STORM_DISRUPTION_KM;
    },
  },
];

const riversideSpec: CardSpec = {
  card: "riverside",
  rules: riversideRules,
  required: [["riverKrungThep"], ["tide"]],
  used: ["riverKrungThep", "damRelease", "tide", "riverPakKhlongTalat"],
};

const campusSpec: CardSpec = {
  card: "campus",
  rules: campusRules,
  required: [["rainForecast"]],
  used: [
    "rainForecast",
    "rainGauge3h",
    "roadFlood",
    "tmdWarning",
    "capAlert",
    "urbanFloodWarning",
    "riverKrungThep",
    "tide",
    "earthquake",
  ],
};

const travelSpec: CardSpec = {
  card: "travel",
  rules: travelRules,
  required: [["roadIncidents"], ["riverKrungThep"]],
  used: [
    "roadIncidents",
    "riverKrungThep",
    "rainForecast",
    "rainGauge3h",
    "roadClosuresNear",
    "earthquake",
    "damRelease",
    "tide",
  ],
};

const healthSpec: CardSpec = {
  card: "health",
  rules: healthRules,
  required: [
    ["pm25Nearest", "pm25Official"],
    ["heatIndex", "heatIndexObserved"],
  ],
  used: ["pm25Nearest", "pm25Official", "heatIndex", "heatIndexObserved", "thunderstorm", "storm"],
};

const levelRank: Record<Level, number> = { normal: 0, unknown: 0, takeCare: 1, disruption: 2 };

function evaluate(spec: CardSpec, context: Context): Verdict {
  const hits: RuleHit[] = spec.rules
    .filter((rule) => rule.applies(context))
    .map((rule) => ({ ruleId: rule.id, level: rule.level, why: ruleWhy[rule.id] }));

  const isFreshId = (id: ReadingId) => context.fresh.has(id);
  const missingRequired = spec.required.some((group) => !group.some(isFreshId));
  const coveredByAlternative = new Set(
    spec.required.filter((group) => group.some(isFreshId)).flat()
  );
  const unchecked = spec.used.filter((id) => !isFreshId(id) && !coveredByAlternative.has(id));

  let level: Level;
  if (hits.length > 0) {
    level = hits.reduce<Level>(
      (highest, hit) => (levelRank[hit.level] > levelRank[highest] ? hit.level : highest),
      "takeCare"
    );
  } else {
    level = missingRequired ? "unknown" : "normal";
  }

  const copy = verdictCopy[spec.card][level];
  return { card: spec.card, level, headline: copy.headline, action: copy.action, hits, unchecked };
}

export function buildVerdicts(readings: Reading[], now: Date): Verdict[] {
  const fresh = new Map<ReadingId, Reading>();
  for (const reading of readings) {
    if (isFresh(reading, now)) fresh.set(reading.id, reading);
  }

  const baseContext: Context = { now, fresh, riversideLevel: "unknown" };
  const riverside = evaluate(riversideSpec, baseContext);
  const context: Context = { ...baseContext, riversideLevel: riverside.level };

  return [
    evaluate(travelSpec, context),
    evaluate(campusSpec, context),
    riverside,
    evaluate(healthSpec, context),
  ];
}
