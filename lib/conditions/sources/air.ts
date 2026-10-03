import { getJson, getTextWithExtraCa } from "@/lib/conditions/fetch";
import { ISRG_ROOT_YR_CROSS, LETS_ENCRYPT_YR1 } from "@/lib/conditions/certs";
import {
  CAMPUS,
  distanceKm,
  type Reading,
  type SeriesPoint,
  type Text,
} from "@/lib/conditions/types";
import {
  asNumber,
  bangkokDateKey,
  bangkokIso,
  bangkokLocalToEpoch,
} from "@/lib/conditions/sources/weather";

const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;
const MINIMUM_VALID_HOURS = 18;
const MAXIMUM_PLAUSIBLE_PM25 = 1000;

const AIRBKK_URL = "https://stations.airbkk.com/api/park1h.php";
const AIR4THAI_URL = "https://air4thai.pcd.go.th/services/getNewAQI_JSON.php";
const OPEN_METEO_AIR_URL =
  `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${CAMPUS.lat}&longitude=${CAMPUS.lon}` +
  "&hourly=pm2_5&forecast_days=3&timezone=Asia%2FBangkok";

export const AIRBKK_STATIONS: { id: number; name: Text }[] = [
  { id: 133, name: { en: "Suan Luang Rama 8", th: "สวนหลวงพระราม 8" } },
  { id: 124, name: { en: "Suan Chalermphrakiat 80 Phansa", th: "สวนเฉลิมพระเกียรติ 80 พรรษา" } },
  { id: 132, name: { en: "Santiphap Park", th: "สวนสันติภาพ" } },
];

const DEFAULT_STATION_NAME: Text = { en: "Suan Luang Rama 8", th: "สวนหลวงพระราม 8" };

const AIRBKK_SOURCE = {
  name: {
    en: "BMA Air Quality and Noise Management Division",
    th: "กองจัดการคุณภาพอากาศและเสียง กรุงเทพมหานคร",
  },
  url: "https://official.airbkk.com/airbkk/",
};

const AIR4THAI_SOURCE = {
  name: { en: "Pollution Control Department Air4Thai", th: "กรมควบคุมมลพิษ (Air4Thai)" },
  url: "https://air4thai.pcd.go.th/",
};

const OPEN_METEO_SOURCE = {
  name: { en: "Open-Meteo (CC BY 4.0)", th: "Open-Meteo (CC BY 4.0)" },
  url: "https://open-meteo.com/",
};

const MODEL_STATION: Text = {
  en: "Air quality model for Tha Prachan campus",
  th: "แบบจำลองคุณภาพอากาศบริเวณท่าพระจันทร์",
};

type UnknownRecord = Record<string, unknown>;

export type OfficialPm25 = {
  value: number;
  observedAt: string | null;
  station: Text;
  distanceKm: number;
  aqi: number | null;
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function roundTo(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function mean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function compactBangkokTime(epochMs: number): string {
  return bangkokIso(epochMs).slice(0, 16).replace(/[-T:]/g, "");
}

export function parseAirbkk(raw: unknown, stationId: number): SeriesPoint[] {
  if (!isRecord(raw) || !isRecord(raw.message)) return [];
  const rows = raw.message[String(stationId)];
  if (!Array.isArray(rows)) return [];
  const points: SeriesPoint[] = [];
  for (const row of rows) {
    if (!isRecord(row)) continue;
    const at = bangkokLocalToEpoch(row.Date_Time);
    const value = asNumber(row["PM2.5"]);
    if (at === null || value === null || value < 0 || value > MAXIMUM_PLAUSIBLE_PM25) continue;
    points.push({ at: bangkokIso(at), value });
  }
  return points.sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
}

export function summariseAirbkk(
  points: SeriesPoint[],
  now: Date
): { value: number; series: SeriesPoint[]; observedAt: string } | null {
  const windowEnd = now.getTime();
  const recent = points.filter((point) => {
    const at = Date.parse(point.at);
    return at > windowEnd - DAY_MS && at <= windowEnd;
  });
  if (recent.length < MINIMUM_VALID_HOURS) return null;
  return {
    value: roundTo(mean(recent.map((point) => point.value)), 1),
    series: recent,
    observedAt: recent[recent.length - 1]?.at ?? "",
  };
}

export function buildPm25Nearest(
  summary: ReturnType<typeof summariseAirbkk>,
  station: Text
): Reading {
  return {
    id: "pm25Nearest",
    value: summary?.value ?? null,
    unit: "ugm3",
    observedAt: summary?.observedAt ?? null,
    staleAfterMinutes: 120,
    station,
    source: AIRBKK_SOURCE,
    detail: { en: "24 hour mean of hourly readings", th: "ค่าเฉลี่ย 24 ชั่วโมงจากค่ารายชั่วโมง" },
    ...(summary ? { series: summary.series } : {}),
  };
}

export function parseAir4Thai(raw: unknown): OfficialPm25 | null {
  if (!isRecord(raw) || !Array.isArray(raw.stations)) return null;
  let best: OfficialPm25 | null = null;
  for (const entry of raw.stations) {
    if (!isRecord(entry) || !isRecord(entry.AQILast) || !isRecord(entry.AQILast.PM25)) continue;
    const value = asNumber(entry.AQILast.PM25.value);
    const lat = asNumber(entry.lat);
    const lon = asNumber(entry.long);
    if (
      value === null ||
      value < 0 ||
      value > MAXIMUM_PLAUSIBLE_PM25 ||
      lat === null ||
      lon === null
    )
      continue;
    const distance = distanceKm(CAMPUS, { lat, lon });
    if (best !== null && distance >= best.distanceKm) continue;
    const date = typeof entry.AQILast.date === "string" ? entry.AQILast.date : "";
    const time = typeof entry.AQILast.time === "string" ? entry.AQILast.time : "";
    const observed = bangkokLocalToEpoch(`${date} ${time}`);
    const nameEn = typeof entry.nameEN === "string" ? entry.nameEN.trim() : "";
    const nameTh = typeof entry.nameTH === "string" ? entry.nameTH.trim() : "";
    const aqi = asNumber(entry.AQILast.PM25.aqi);
    best = {
      value: roundTo(value, 1),
      observedAt: observed === null ? null : bangkokIso(observed),
      station: {
        en: nameEn || nameTh || "Air4Thai station",
        th: nameTh || nameEn || "สถานี Air4Thai",
      },
      distanceKm: roundTo(distance, 1),
      aqi: aqi !== null && aqi >= 0 ? aqi : null,
    };
  }
  return best;
}

export function buildPm25Official(official: OfficialPm25 | null): Reading {
  return {
    id: "pm25Official",
    value: official?.value ?? null,
    unit: "ugm3",
    observedAt: official?.observedAt ?? null,
    staleAfterMinutes: 180,
    station: official?.station ?? {
      en: "Nearest Air4Thai station",
      th: "สถานี Air4Thai ที่ใกล้ที่สุด",
    },
    source: AIR4THAI_SOURCE,
    ...(official
      ? {
          detail: {
            en: `24 hour average, ${official.distanceKm} km from campus`,
            th: `ค่าเฉลี่ย 24 ชั่วโมง ห่างจากมหาวิทยาลัย ${official.distanceKm} กิโลเมตร`,
          },
        }
      : {}),
  };
}

export function parseOpenMeteoAir(raw: unknown, now: Date): Reading {
  const tomorrowKey = bangkokDateKey(now.getTime() + DAY_MS);
  const series: SeriesPoint[] = [];
  if (isRecord(raw) && isRecord(raw.hourly)) {
    const times = Array.isArray(raw.hourly.time) ? raw.hourly.time : [];
    const values = Array.isArray(raw.hourly.pm2_5) ? raw.hourly.pm2_5 : [];
    times.forEach((time, index) => {
      const at = bangkokLocalToEpoch(time);
      const value = asNumber(values[index]);
      if (at === null || value === null || value < 0) return;
      if (bangkokDateKey(at) === tomorrowKey) series.push({ at: bangkokIso(at), value });
    });
  }
  const usable = series.length >= MINIMUM_VALID_HOURS;
  return {
    id: "pm25Forecast",
    value: usable ? roundTo(mean(series.map((point) => point.value)), 1) : null,
    unit: "ugm3",
    observedAt: usable ? bangkokIso(now.getTime()) : null,
    staleAfterMinutes: 360,
    station: MODEL_STATION,
    source: OPEN_METEO_SOURCE,
    modelled: true,
    ...(usable ? { series } : {}),
  };
}

async function fetchPm25Nearest(now: Date): Promise<Reading> {
  const from = compactBangkokTime(now.getTime() - DAY_MS);
  const to = compactBangkokTime(now.getTime());
  for (const station of AIRBKK_STATIONS) {
    const raw = await getJson(`${AIRBKK_URL}?sid=${station.id}&from=${from}&to=${to}`).catch(
      () => null
    );
    const summary = summariseAirbkk(parseAirbkk(raw, station.id), now);
    if (summary) return buildPm25Nearest(summary, station.name);
  }
  return buildPm25Nearest(null, DEFAULT_STATION_NAME);
}

async function fetchPm25Official(): Promise<Reading> {
  const text = await getTextWithExtraCa(AIR4THAI_URL, [LETS_ENCRYPT_YR1, ISRG_ROOT_YR_CROSS], {
    timeoutMs: 15000,
  }).catch(() => null);
  let parsed: unknown = null;
  if (text !== null) {
    try {
      parsed = JSON.parse(text) as unknown;
    } catch {
      parsed = null;
    }
  }
  return buildPm25Official(parseAir4Thai(parsed));
}

export async function fetchAirReadings(now: Date): Promise<Reading[]> {
  const [nearest, official, forecastRaw] = await Promise.all([
    fetchPm25Nearest(now).catch(() => buildPm25Nearest(null, DEFAULT_STATION_NAME)),
    fetchPm25Official().catch(() => buildPm25Official(null)),
    getJson(OPEN_METEO_AIR_URL).catch(() => null),
  ]);
  return [nearest, official, parseOpenMeteoAir(forecastRaw, now)];
}
