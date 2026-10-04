import type { Locale } from "@/lib/i18n";

export type Text = Record<Locale, string>;

export const CAMPUS = { lat: 13.7563, lon: 100.49 } as const;

export type ReadingId =
  | "riverKrungThep"
  | "riverSamsen"
  | "riverPakKhlongTalat"
  | "damRelease"
  | "damReleaseForecast"
  | "riverForecastNonthaburi"
  | "tide"
  | "rainGauge24h"
  | "rainGauge3h"
  | "roadFlood"
  | "urbanFloodWarning"
  | "rainForecast"
  | "rainProbability"
  | "heatIndex"
  | "heatIndexObserved"
  | "thunderstorm"
  | "uvIndex"
  | "tmdWarning"
  | "capAlert"
  | "pm25Nearest"
  | "pm25Official"
  | "pm25Forecast"
  | "roadIncidents"
  | "roadClosuresNear"
  | "earthquake"
  | "storm";

export type Unit =
  | "m"
  | "cm"
  | "m3s"
  | "mm"
  | "mmh"
  | "percent"
  | "celsius"
  | "uv"
  | "ugm3"
  | "count"
  | "km"
  | "magnitude"
  | "flag";
export type SeriesPoint = { at: string; value: number };

export type ReadingItem = {
  title: Text;
  at?: string;
  distanceKm?: number;
  href?: string;
};

export type Reading = {
  id: ReadingId;
  value: number | null;
  unit: Unit;
  observedAt: string | null;
  staleAfterMinutes: number;
  station: Text;
  source: { name: Text; url: string };
  detail?: Text;
  series?: SeriesPoint[];
  items?: ReadingItem[];
  modelled?: boolean;
};

export type CardId = "travel" | "campus" | "riverside" | "health";

export type Level = "normal" | "takeCare" | "disruption" | "unknown";

export type RuleHit = {
  ruleId: string;
  level: "takeCare" | "disruption";
  why: Text;
};

export type Verdict = {
  card: CardId;
  level: Level;
  headline: Text;
  action: Text;
  hits: RuleHit[];
  unchecked: ReadingId[];
};

export type ConditionsSnapshot = {
  generatedAt: string;
  cards: Verdict[];
  readings: Reading[];
};

export function isFresh(reading: Reading | undefined, now: Date): reading is Reading {
  if (!reading || reading.value === null || !reading.observedAt) return false;
  const observed = Date.parse(reading.observedAt);
  if (Number.isNaN(observed)) return false;
  return now.getTime() - observed <= reading.staleAfterMinutes * 60_000;
}

export function distanceKm(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number }
): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
