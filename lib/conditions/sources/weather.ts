import { getJson, getTextWithExtraCa } from "@/lib/conditions/fetch";
import { GLOBALSIGN_GCC_R6_ALPHASSL_2025 } from "@/lib/conditions/certs";
import {
  CAMPUS,
  type Reading,
  type ReadingItem,
  type SeriesPoint,
  type Text,
} from "@/lib/conditions/types";

const HOUR_MS = 3_600_000;
const BANGKOK_OFFSET_MS = 7 * HOUR_MS;
const WARNING_WINDOW_MS = 36 * HOUR_MS;
const MAX_CAP_FILES = 8;

const OPEN_METEO_URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${CAMPUS.lat}&longitude=${CAMPUS.lon}` +
  "&hourly=temperature_2m,relative_humidity_2m,precipitation,precipitation_probability" +
  "&daily=uv_index_max&forecast_days=2&timezone=Asia%2FBangkok";

const TMD_WARNING_BASE = "https://data.tmd.go.th/api/WeatherWarningNews/v2/";
const TMD_CAP_RSS_URL = "https://www.tmd.go.th/en/api/xml/CAP";
const TMD_WARNING_PAGE = "https://www.tmd.go.th/en/warning-and-events/warning-storm";
const TMD_DATA_URL = "https://data.tmd.go.th/";

const OPEN_METEO_SOURCE = {
  name: { en: "Open-Meteo (CC BY 4.0)", th: "Open-Meteo (CC BY 4.0)" },
  url: "https://open-meteo.com/",
};

const TMD_NAME: Text = { en: "Thai Meteorological Department (TMD)", th: "กรมอุตุนิยมวิทยา (TMD)" };

const MODEL_STATION: Text = {
  en: "Forecast model for Tha Prachan campus",
  th: "แบบจำลองพยากรณ์อากาศบริเวณท่าพระจันทร์",
};

const BANGKOK_AREA: Text = { en: "Bangkok and vicinity", th: "กรุงเทพมหานครและปริมณฑล" };

const BANGKOK_PATTERN = /bangkok|กรุงเทพ/i;
const THAI_CHARACTER = /[฀-๿]/;

const CAP_EVENT_THAI: Record<string, string> = {
  "heavy rain": "ฝนตกหนัก",
  thunderstorm: "พายุฝนฟ้าคะนอง",
  flood: "น้ำท่วม",
  "flash flood": "น้ำท่วมฉับพลัน",
  storm: "พายุ",
  "tropical cyclone": "พายุหมุนเขตร้อน",
  "strong wind": "ลมแรง",
  "high waves": "คลื่นสูง",
  "hot weather": "อากาศร้อน",
  "cold weather": "อากาศหนาว",
};

type UnknownRecord = Record<string, unknown>;

export type CapAlert = {
  sent: string | null;
  expires: string | null;
  event: string;
  headline: string;
  severity: string;
  areaDescription: string;
  geocodes: string[];
  web: string | null;
  coversBangkok: boolean;
};

export type TmdWarning = {
  announcedAt: string | null;
  title: Text;
  href: string | null;
  mentionsBangkok: boolean;
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function asNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function bangkokIso(epochMs: number): string {
  return `${new Date(epochMs + BANGKOK_OFFSET_MS).toISOString().slice(0, 19)}+07:00`;
}

export function bangkokDateKey(epochMs: number): string {
  return new Date(epochMs + BANGKOK_OFFSET_MS).toISOString().slice(0, 10);
}

export function bangkokLocalToEpoch(local: unknown): number | null {
  if (typeof local !== "string") return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/.exec(local.trim());
  if (!match) return null;
  const [, year, month, day, hour, minute, second] = match;
  const epoch =
    Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second ?? 0)
    ) - BANGKOK_OFFSET_MS;
  return Number.isNaN(epoch) ? null : epoch;
}

export function floorToHour(epochMs: number): number {
  return Math.floor(epochMs / HOUR_MS) * HOUR_MS;
}

function roundTo(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function heatIndexCelsius(temperatureC: number, relativeHumidity: number): number {
  const t = (temperatureC * 9) / 5 + 32;
  const rh = relativeHumidity;
  let index: number;
  if (t < 80) {
    index = 0.5 * (t + 61 + (t - 68) * 1.2 + rh * 0.094);
  } else {
    index =
      -42.379 +
      2.04901523 * t +
      10.14333127 * rh -
      0.22475541 * t * rh -
      0.00683783 * t * t -
      0.05481717 * rh * rh +
      0.00122874 * t * t * rh +
      0.00085282 * t * rh * rh -
      0.00000199 * t * t * rh * rh;
    if (rh < 13 && t <= 112) {
      index -= ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(t - 95)) / 17);
    } else if (rh > 85 && t <= 87) {
      index += ((rh - 85) / 10) * ((87 - t) / 5);
    }
  }
  return ((index - 32) * 5) / 9;
}

type HourlyRow = {
  at: number;
  temperature: number | null;
  humidity: number | null;
  precipitation: number | null;
  probability: number | null;
};

function readHourly(raw: unknown): HourlyRow[] {
  if (!isRecord(raw) || !isRecord(raw.hourly)) return [];
  const hourly = raw.hourly;
  const times = Array.isArray(hourly.time) ? hourly.time : [];
  const column = (key: string): unknown[] =>
    Array.isArray(hourly[key]) ? (hourly[key] as unknown[]) : [];
  const temperature = column("temperature_2m");
  const humidity = column("relative_humidity_2m");
  const precipitation = column("precipitation");
  const probability = column("precipitation_probability");
  const rows: HourlyRow[] = [];
  times.forEach((time, index) => {
    const at = bangkokLocalToEpoch(time);
    if (at === null) return;
    rows.push({
      at,
      temperature: asNumber(temperature[index]),
      humidity: asNumber(humidity[index]),
      precipitation: asNumber(precipitation[index]),
      probability: asNumber(probability[index]),
    });
  });
  return rows;
}

function maxOf(values: number[]): number | null {
  return values.length === 0 ? null : Math.max(...values);
}

function nonNull(values: (number | null)[]): number[] {
  return values.filter((value): value is number => value !== null);
}

export function parseOpenMeteo(raw: unknown, now: Date): Reading[] {
  const rows = readHourly(raw);
  const start = floorToHour(now.getTime());
  const nextHours = (hours: number) =>
    rows.filter((row) => row.at >= start && row.at < start + hours * HOUR_MS);
  const next3 = nextHours(3);
  const next12 = nextHours(12);
  const next24 = nextHours(24);
  const observedAtFetch = bangkokIso(now.getTime());

  const seriesOf = (pick: (row: HourlyRow) => number | null): SeriesPoint[] =>
    next24.flatMap((row) => {
      const value = pick(row);
      return value === null ? [] : [{ at: bangkokIso(row.at), value }];
    });

  const heatValue = (row: HourlyRow): number | null =>
    row.temperature === null || row.humidity === null
      ? null
      : roundTo(heatIndexCelsius(row.temperature, row.humidity), 1);

  const rainValue = maxOf(nonNull(next3.map((row) => row.precipitation)));
  const probabilityValue = maxOf(nonNull(next3.map((row) => row.probability)));
  const heatValue12 = maxOf(nonNull(next12.map(heatValue)));

  const base = {
    station: MODEL_STATION,
    source: OPEN_METEO_SOURCE,
    modelled: true,
    observedAt: observedAtFetch,
  } as const;
  const missing = rows.length === 0;
  const nullable = <T extends number | null>(value: T): T | null => (missing ? null : value);
  const nullableObservedAt = missing ? null : observedAtFetch;

  return [
    {
      ...base,
      id: "rainForecast",
      value: nullable(rainValue),
      unit: "mmh",
      observedAt: nullableObservedAt,
      staleAfterMinutes: 180,
      series: seriesOf((row) => row.precipitation),
    },
    {
      ...base,
      id: "rainProbability",
      value: nullable(probabilityValue),
      unit: "percent",
      observedAt: nullableObservedAt,
      staleAfterMinutes: 180,
      series: seriesOf((row) => row.probability),
    },
    {
      ...base,
      id: "heatIndex",
      value: nullable(heatValue12),
      unit: "celsius",
      observedAt: nullableObservedAt,
      staleAfterMinutes: 180,
      series: seriesOf(heatValue),
    },
    parseUvIndex(raw, now),
  ];
}

function parseUvIndex(raw: unknown, now: Date): Reading {
  const todayKey = bangkokDateKey(now.getTime());
  let value: number | null = null;
  if (isRecord(raw) && isRecord(raw.daily)) {
    const days = Array.isArray(raw.daily.time) ? raw.daily.time : [];
    const maxima = Array.isArray(raw.daily.uv_index_max) ? raw.daily.uv_index_max : [];
    const index = days.findIndex((day) => typeof day === "string" && day.slice(0, 10) === todayKey);
    if (index >= 0) value = asNumber(maxima[index]);
  }
  return {
    id: "uvIndex",
    value: value === null ? null : roundTo(value, 1),
    unit: "uv",
    observedAt: value === null ? null : bangkokIso(now.getTime()),
    staleAfterMinutes: 360,
    station: MODEL_STATION,
    source: OPEN_METEO_SOURCE,
    modelled: true,
  };
}

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return value.trim() === "" ? [] : [value.trim()];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  return [];
}

function bilingual(...fields: unknown[]): Text {
  const strings = fields.flatMap(collectStrings);
  const thai = strings.find((text) => THAI_CHARACTER.test(text));
  const english = strings.find((text) => !THAI_CHARACTER.test(text));
  return { en: english ?? thai ?? "", th: thai ?? english ?? "" };
}

function warningCandidates(raw: unknown): UnknownRecord[] {
  if (!isRecord(raw)) return [];
  const found: UnknownRecord[] = [];
  const visit = (value: unknown, depth: number) => {
    if (depth > 3) return;
    if (Array.isArray(value)) {
      value.forEach((entry) => visit(entry, depth + 1));
    } else if (isRecord(value)) {
      if ("AnnounceDate" in value || "TitleThai" in value || "TitleEnglish" in value) {
        found.push(value);
      } else {
        Object.values(value).forEach((entry) => visit(entry, depth + 1));
      }
    }
  };
  visit(raw.Warning, 0);
  visit(raw.Warnings, 0);
  return found;
}

export function parseTmdWarningList(raw: unknown): TmdWarning[] {
  return warningCandidates(raw).map((entry) => {
    const announced = bangkokLocalToEpoch(entry.AnnounceDate);
    const title = bilingual(entry.TitleThai, entry.TitleEnglish, entry.Title);
    const searchable = [
      entry.TitleThai,
      entry.TitleEnglish,
      entry.Title,
      entry.HeadlineThai,
      entry.HeadlineEnglish,
      entry.DescriptionThai,
      entry.DescriptionEnglish,
      entry.Description,
    ]
      .flatMap(collectStrings)
      .join("\n");
    const links = [entry.WebUrlEnglish, entry.WebUrlThai].flatMap(collectStrings);
    return {
      announcedAt: announced === null ? null : bangkokIso(announced),
      title,
      href:
        links.find((link) => /^https?:\/\//.test(link) && !/_th\.[a-z]+$/i.test(link)) ??
        links.find((link) => /^https?:\/\//.test(link)) ??
        null,
      mentionsBangkok: BANGKOK_PATTERN.test(searchable),
    };
  });
}

export function parseTmdWarnings(raw: unknown, now: Date): Reading {
  const unreadable = !isRecord(raw) || !("Warning" in raw || "Warnings" in raw);
  const recent = unreadable
    ? []
    : parseTmdWarningList(raw).filter((warning) => {
        if (!warning.mentionsBangkok || warning.announcedAt === null) return false;
        const age = now.getTime() - Date.parse(warning.announcedAt);
        return age >= -HOUR_MS && age <= WARNING_WINDOW_MS;
      });
  const items: ReadingItem[] = recent.map((warning) => ({
    title: warning.title,
    ...(warning.announcedAt ? { at: warning.announcedAt } : {}),
    ...(warning.href ? { href: warning.href } : {}),
  }));
  return {
    id: "tmdWarning",
    value: unreadable ? null : recent.length > 0 ? 1 : 0,
    unit: "flag",
    observedAt: unreadable ? null : bangkokIso(now.getTime()),
    staleAfterMinutes: 120,
    station: BANGKOK_AREA,
    source: { name: TMD_NAME, url: TMD_DATA_URL },
    items,
  };
}

function decodeEntities(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, "&");
}

function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function tagValues(xml: string, tag: string): string[] {
  const pattern = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "g");
  return [...xml.matchAll(pattern)].map((match) => decodeEntities(match[1] ?? "").trim());
}

function firstTag(xml: string, tag: string): string {
  return tagValues(xml, tag)[0] ?? "";
}

export function parseCapRss(xml: string): string[] {
  const links = tagValues(stripBom(xml), "item")
    .map((item) => firstTag(item, "link"))
    .filter((link) => /^https:\/\/([a-z0-9-]+\.)*tmd\.go\.th\/.+\.xml$/i.test(link));
  return [...new Set(links)].slice(0, MAX_CAP_FILES);
}

export function parseCapAlert(xml: string): CapAlert[] {
  const document = stripBom(xml);
  if (!/<alert[\s>]/.test(document)) return [];
  const status = firstTag(document.replace(/<info[\s>][\s\S]*?<\/info>/g, ""), "status");
  if (/^(test|exercise|draft)$/i.test(status)) return [];
  const sent = firstTag(document.replace(/<info[\s>][\s\S]*?<\/info>/g, ""), "sent");
  return tagValues(document, "info").map((info) => {
    const areas = tagValues(info, "area");
    const areaDescription = areas.map((area) => firstTag(area, "areaDesc")).join(" ");
    const geocodes = areas.flatMap((area) =>
      tagValues(area, "geocode").map((code) => firstTag(code, "value"))
    );
    return {
      sent: sent || null,
      expires: firstTag(info, "expires") || null,
      event: firstTag(info, "event"),
      headline: firstTag(info, "headline"),
      severity: firstTag(info, "severity"),
      areaDescription,
      geocodes,
      web: firstTag(info, "web") || null,
      coversBangkok: geocodes.includes("TH-10") || BANGKOK_PATTERN.test(areaDescription),
    };
  });
}

function capAlertTitle(alert: CapAlert): Text {
  const english = alert.headline || alert.event || "TMD alert";
  const thaiEvent = CAP_EVENT_THAI[alert.event.toLowerCase()];
  return {
    en: english,
    th: thaiEvent
      ? `ประกาศเตือนภัย${thaiEvent}จากกรมอุตุนิยมวิทยา`
      : "ประกาศเตือนภัยจากกรมอุตุนิยมวิทยา",
  };
}

export function isUnexpired(alert: CapAlert, now: Date): boolean {
  if (!alert.expires) return true;
  const expires = Date.parse(alert.expires);
  return Number.isNaN(expires) ? true : expires > now.getTime();
}

export function buildCapReading(alerts: CapAlert[] | null, now: Date): Reading {
  const active = (alerts ?? []).filter((alert) => alert.coversBangkok && isUnexpired(alert, now));
  const items: ReadingItem[] = active.map((alert) => ({
    title: capAlertTitle(alert),
    ...(alert.sent ? { at: alert.sent } : {}),
    ...(alert.web ? { href: alert.web } : {}),
  }));
  return {
    id: "capAlert",
    value: alerts === null ? null : active.length,
    unit: "count",
    observedAt: alerts === null ? null : bangkokIso(now.getTime()),
    staleAfterMinutes: 120,
    station: BANGKOK_AREA,
    source: { name: TMD_NAME, url: TMD_WARNING_PAGE },
    items,
  };
}

async function fetchCapAlerts(): Promise<CapAlert[] | null> {
  const rss = await getTextWithExtraCa(TMD_CAP_RSS_URL, [GLOBALSIGN_GCC_R6_ALPHASSL_2025]);
  if (rss === null) return null;
  const links = parseCapRss(rss);
  if (links.length === 0) return [];
  const files = await Promise.all(
    links.map((link) => getTextWithExtraCa(link, [GLOBALSIGN_GCC_R6_ALPHASSL_2025]))
  );
  const readable = files.filter((file): file is string => file !== null);
  if (readable.length === 0) return null;
  return readable.flatMap(parseCapAlert);
}

function tmdWarningUrl(): string {
  const uid = process.env.TMD_API_UID || "api";
  const key = process.env.TMD_API_KEY || "api12345";
  return `${TMD_WARNING_BASE}?uid=${encodeURIComponent(uid)}&ukey=${encodeURIComponent(key)}&format=json`;
}

export async function fetchWeatherReadings(now: Date): Promise<Reading[]> {
  const [openMeteo, warnings, capAlerts] = await Promise.all([
    getJson(OPEN_METEO_URL).catch(() => null),
    getJson(tmdWarningUrl()).catch(() => null),
    fetchCapAlerts().catch(() => null),
  ]);
  return [
    ...parseOpenMeteo(openMeteo, now),
    parseTmdWarnings(warnings, now),
    buildCapReading(capAlerts, now),
  ];
}
