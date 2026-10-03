import type { Locale } from "@/lib/i18n";
import type { Reading, ReadingId, Unit } from "@/lib/conditions/types";

export type ValueLabels = {
  yes: string;
  no: string;
  none: string;
  mm: string;
  cm: string;
  mmh: string;
  km: string;
};

const NO_STORM_KM = 10000;

const EN_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const TH_MONTHS = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

function bangkokParts(iso: string) {
  const time = Date.parse(iso);
  if (Number.isNaN(time)) return null;
  const shifted = new Date(time + BANGKOK_OFFSET_MS);
  return {
    day: shifted.getUTCDate(),
    month: shifted.getUTCMonth(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
  };
}

function twoDigits(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatBangkokClock(iso: string): string {
  const parts = bangkokParts(iso);
  if (!parts) return "";
  return `${twoDigits(parts.hour)}:${twoDigits(parts.minute)}`;
}

export function formatBangkokDateTime(iso: string, locale: Locale): string {
  const parts = bangkokParts(iso);
  if (!parts) return "";
  const month = (locale === "th" ? TH_MONTHS : EN_MONTHS)[parts.month];
  return `${parts.day} ${month} ${formatBangkokClock(iso)}`;
}

function grouped(value: number, fractionDigits: number): string {
  return value.toLocaleString("en-GB", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function formatReadingValue(value: number, unit: Unit, labels: ValueLabels): string {
  switch (unit) {
    case "m":
      return `${grouped(value, 2)} m`;
    case "cm":
      return `${grouped(value, 0)} ${labels.cm}`;
    case "mm":
      return `${grouped(value, 0)} ${labels.mm}`;
    case "m3s":
      return `${grouped(value, 0)} m³/s`;
    case "mmh":
      return `${grouped(value, value < 10 ? 1 : 0)}${labels.mmh}`;
    case "ugm3":
      return `${grouped(value, 0)} µg/m³`;
    case "percent":
      return `${grouped(value, 0)}%`;
    case "celsius":
      return `${grouped(value, 0)} °C`;
    case "uv":
      return grouped(value, 0);
    case "flag":
      return value >= 1 ? labels.yes : labels.no;
    case "count":
      return grouped(value, 0);
    case "km":
      return value >= NO_STORM_KM ? labels.none : `${grouped(value, 0)} ${labels.km}`;
    case "magnitude":
      return value <= 0 ? labels.none : `M${grouped(value, 1)}`;
  }
}

export type HourRow = {
  at: string;
  rain: number | null;
  chance: number | null;
  tide: number | null;
  heat: number | null;
};

const NEXT_HOURS = 12;

function valuesByHour(reading: Reading | undefined): Map<number, number> {
  const map = new Map<number, number>();
  for (const point of reading?.series ?? []) {
    const time = Date.parse(point.at);
    if (!Number.isNaN(time)) map.set(Math.floor(time / HOUR_MS), point.value);
  }
  return map;
}

export function buildNextHours(readings: Reading[], now: Date, count = NEXT_HOURS): HourRow[] {
  const byId = new Map<ReadingId, Reading>(readings.map((reading) => [reading.id, reading]));
  const rain = valuesByHour(byId.get("rainForecast"));
  const chance = valuesByHour(byId.get("rainProbability"));
  const tide = valuesByHour(byId.get("tide"));
  const heat = valuesByHour(byId.get("heatIndex"));
  const firstHour = Math.floor(now.getTime() / HOUR_MS);

  const hours = new Set<number>();
  for (const map of [rain, chance, tide, heat]) {
    for (const hour of map.keys()) if (hour >= firstHour) hours.add(hour);
  }

  return [...hours]
    .sort((a, b) => a - b)
    .slice(0, count)
    .map((hour) => ({
      at: new Date(hour * HOUR_MS).toISOString(),
      rain: rain.get(hour) ?? null,
      chance: chance.get(hour) ?? null,
      tide: tide.get(hour) ?? null,
      heat: heat.get(hour) ?? null,
    }));
}

export function formatCell(value: number | null, fractionDigits: number, missing: string): string {
  return value === null ? missing : grouped(value, fractionDigits);
}

export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}
