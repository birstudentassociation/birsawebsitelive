import type { ConditionsSnapshot, Reading } from "@/lib/conditions/types";
import { fetchWaterReadings } from "@/lib/conditions/sources/water";
import { fetchWeatherReadings } from "@/lib/conditions/sources/weather";
import { fetchAirReadings } from "@/lib/conditions/sources/air";
import { fetchHazardReadings } from "@/lib/conditions/sources/hazards";
import { buildVerdicts } from "@/lib/conditions/verdicts";

const SOURCES = [fetchWaterReadings, fetchWeatherReadings, fetchAirReadings, fetchHazardReadings];

export function snapshotFrom(readings: Reading[], now: Date): ConditionsSnapshot {
  return { generatedAt: now.toISOString(), cards: buildVerdicts(readings, now), readings };
}

export async function getConditionsSnapshot(now: Date = new Date()): Promise<ConditionsSnapshot> {
  const groups = await Promise.all(SOURCES.map((source) => source(now).catch(() => [])));
  return snapshotFrom(groups.flat(), now);
}
