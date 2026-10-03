import { getJson, getText } from "@/lib/conditions/fetch";
import {
  CAMPUS,
  distanceKm,
  type Reading,
  type ReadingItem,
  type Text,
} from "@/lib/conditions/types";

const LONGDO_URL = "https://event.longdo.com/feed/json";
const TMD_QUAKE_URL = "https://earthquake.tmd.go.th/feed/rss_tmd.xml";
const GDACS_URL = "https://www.gdacs.org/xml/rss.xml";
const USGS_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query";

const HOUR_MS = 3_600_000;
const BANGKOK_OFFSET_MS = 7 * HOUR_MS;

const FLOODING = 6;
const DIVERSION = 18;
const MAX_LISTED_STORMS = 3;
const DIVERSION_NEW_WINDOW_MS = 24 * 60 * 60 * 1000;
const CLOSURE = 19;

const INCIDENT_TYPES = [FLOODING, DIVERSION, CLOSURE];
const CLOSURE_TYPES = [FLOODING, CLOSURE];
const INCIDENT_RADIUS_KM = 3;
const CLOSURE_RADIUS_KM = 1;
const CURRENT_START_WINDOW_MS = 12 * HOUR_MS;
const MAX_LISTED_ITEMS = 20;

const QUAKE_WINDOW_MS = 6 * HOUR_MS;
const QUAKE_DUPLICATE_MS = 2 * 60_000;
const QUAKE_DUPLICATE_KM = 50;
const NO_STORM_KM = 10_000;
const STORM_GRACE_MS = 24 * HOUR_MS;

export type LongdoEvent = {
  id: string;
  type: number;
  lat: number;
  lon: number;
  startMs: number;
  stopMs: number | null;
  title: Text;
};

export type NearbyEvent = { event: LongdoEvent; distanceKm: number };

export type Quake = {
  source: "tmd" | "usgs";
  timeMs: number;
  lat: number;
  lon: number;
  magnitude: number;
  place: Text;
  href?: string;
};

export type Storm = {
  name: string;
  lat: number;
  lon: number;
  alertLevel: string;
  href: string;
};

function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function toBangkokIso(ms: number): string {
  return `${new Date(ms + BANGKOK_OFFSET_MS).toISOString().slice(0, 19)}+07:00`;
}

function cleanCopy(value: string): string {
  return value.replace(/[:：]/g, " ").replace(/[-–—]/g, " ").replace(/\s+/g, " ").trim();
}

function parseBangkokLocal(value: unknown): number | null {
  const text = toNonEmptyString(value);
  if (!text) return null;
  const match = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}(?::\d{2})?)/.exec(text);
  if (!match) return null;
  const [, datePart = "", clockPart = ""] = match;
  const time = clockPart.length === 5 ? `${clockPart}:00` : clockPart;
  const ms = Date.parse(`${datePart}T${time}+07:00`);
  return Number.isNaN(ms) ? null : ms;
}

function roundOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

export function parseLongdoEvents(raw: unknown): LongdoEvent[] {
  if (!Array.isArray(raw)) return [];
  const events: LongdoEvent[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const type = toNumber(row.type);
    const lat = toNumber(row.latitude);
    const lon = toNumber(row.longitude);
    const startMs = parseBangkokLocal(row.start);
    const thai = toNonEmptyString(row.title);
    const english = toNonEmptyString(row.title_en);
    if (type === null || lat === null || lon === null || startMs === null) continue;
    if (!thai && !english) continue;
    const stopMs = parseBangkokLocal(row.stop);
    events.push({
      id: String(row.eid ?? `${type}-${lat}-${lon}-${startMs}`),
      type,
      lat,
      lon,
      startMs,
      stopMs,
      title: { en: cleanCopy(english ?? thai ?? ""), th: cleanCopy(thai ?? english ?? "") },
    });
  }
  return events;
}

export function isLongdoEventCurrent(event: LongdoEvent, now: Date): boolean {
  const nowMs = now.getTime();
  if (event.startMs > nowMs) return false;
  if (event.type === DIVERSION && nowMs - event.startMs > DIVERSION_NEW_WINDOW_MS) return false;
  if (event.stopMs !== null) return event.stopMs > nowMs;
  return nowMs - event.startMs <= CURRENT_START_WINDOW_MS;
}

export function selectRoadIncidents(
  events: LongdoEvent[],
  now: Date,
  types: number[],
  maxKm: number
): NearbyEvent[] {
  return events
    .filter((event) => types.includes(event.type) && isLongdoEventCurrent(event, now))
    .map((event) => ({ event, distanceKm: distanceKm(CAMPUS, event) }))
    .filter((nearby) => nearby.distanceKm <= maxKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

function incidentItems(nearby: NearbyEvent[]): ReadingItem[] {
  return nearby.slice(0, MAX_LISTED_ITEMS).map(({ event, distanceKm: km }) => ({
    title: event.title,
    at: toBangkokIso(event.startMs),
    distanceKm: roundOneDecimal(km),
  }));
}

const LONGDO_SOURCE = {
  name: { en: "Longdo Traffic and iTIC", th: "Longdo Traffic และ iTIC" },
  url: "https://traffic.longdo.com/",
};

export function buildRoadReadings(events: LongdoEvent[] | null, now: Date): Reading[] {
  const observedAt = events ? toBangkokIso(now.getTime()) : null;
  const incidents = events
    ? selectRoadIncidents(events, now, INCIDENT_TYPES, INCIDENT_RADIUS_KM)
    : null;
  const closures = events
    ? selectRoadIncidents(events, now, CLOSURE_TYPES, CLOSURE_RADIUS_KM)
    : null;
  return [
    {
      id: "roadIncidents",
      value: incidents ? incidents.length : null,
      unit: "count",
      observedAt,
      staleAfterMinutes: 30,
      station: {
        en: "Within 3 km of Tha Prachan campus",
        th: "ในรัศมี 3 กม. จากธรรมศาสตร์ ท่าพระจันทร์",
      },
      source: LONGDO_SOURCE,
      items: incidents ? incidentItems(incidents) : undefined,
    },
    {
      id: "roadClosuresNear",
      value: closures ? closures.length : null,
      unit: "count",
      observedAt,
      staleAfterMinutes: 30,
      station: {
        en: "Within 1 km of Tha Prachan campus",
        th: "ในรัศมี 1 กม. จากธรรมศาสตร์ ท่าพระจันทร์",
      },
      source: LONGDO_SOURCE,
      items: closures ? incidentItems(closures) : undefined,
    },
  ];
}

function decodeXml(value: string): string {
  return value
    .replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();
}

function xmlItems(xml: string): string[] {
  return xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
}

function xmlTag(block: string, name: string): string | null {
  const match = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`).exec(block);
  return match?.[1] === undefined ? null : decodeXml(match[1]);
}

function splitBilingualTitle(title: string): Text {
  const match = /^(.*?)\s*\(([^()]*)\)\s*$/.exec(title);
  if (!match) {
    const single = cleanCopy(title);
    return { en: single, th: single };
  }
  const thai = cleanCopy(match[1] ?? "") || cleanCopy(match[2] ?? "");
  const english = cleanCopy(match[2] ?? "") || thai;
  return { en: english, th: thai };
}

export function parseTmdQuakeRss(xml: unknown): Quake[] {
  if (typeof xml !== "string") return [];
  const quakes: Quake[] = [];
  for (const block of xmlItems(xml)) {
    const lat = toNumber(xmlTag(block, "geo:lat"));
    const lon = toNumber(xmlTag(block, "geo:long"));
    const magnitude = toNumber(xmlTag(block, "tmd:magnitude"));
    const rawTime = xmlTag(block, "tmd:time");
    const title = xmlTag(block, "title");
    if (lat === null || lon === null || magnitude === null || !rawTime || !title) continue;
    const timeMs = Date.parse(rawTime.replace(" UTC", "Z").replace(" ", "T"));
    if (Number.isNaN(timeMs)) continue;
    quakes.push({
      source: "tmd",
      timeMs,
      lat,
      lon,
      magnitude,
      place: splitBilingualTitle(title),
      href: xmlTag(block, "link") ?? undefined,
    });
  }
  return quakes;
}

export function parseUsgsQuakes(raw: unknown): Quake[] {
  if (!raw || typeof raw !== "object") return [];
  const features = (raw as { features?: unknown }).features;
  if (!Array.isArray(features)) return [];
  const quakes: Quake[] = [];
  for (const feature of features) {
    if (!feature || typeof feature !== "object") continue;
    const { properties, geometry } = feature as { properties?: unknown; geometry?: unknown };
    if (!properties || typeof properties !== "object" || !geometry || typeof geometry !== "object")
      continue;
    const props = properties as Record<string, unknown>;
    const coordinates = (geometry as { coordinates?: unknown }).coordinates;
    if (!Array.isArray(coordinates)) continue;
    const lon = toNumber(coordinates[0]);
    const lat = toNumber(coordinates[1]);
    const magnitude = toNumber(props.mag);
    const timeMs = toNumber(props.time);
    if (lat === null || lon === null || magnitude === null || timeMs === null) continue;
    const place = cleanCopy(toNonEmptyString(props.place) ?? "Unnamed location");
    quakes.push({
      source: "usgs",
      timeMs,
      lat,
      lon,
      magnitude,
      place: { en: place, th: place },
      href: toNonEmptyString(props.url) ?? undefined,
    });
  }
  return quakes;
}

export function mergeQuakes(primary: Quake[], secondary: Quake[]): Quake[] {
  const merged = primary.map((quake) => ({ ...quake }));
  for (const candidate of secondary) {
    const duplicate = merged.find(
      (existing) =>
        Math.abs(existing.timeMs - candidate.timeMs) <= QUAKE_DUPLICATE_MS &&
        distanceKm(existing, candidate) <= QUAKE_DUPLICATE_KM
    );
    if (duplicate) {
      duplicate.magnitude = Math.max(duplicate.magnitude, candidate.magnitude);
      duplicate.href = duplicate.href ?? candidate.href;
    } else {
      merged.push({ ...candidate });
    }
  }
  return merged;
}

export function feltInBangkok(quake: Quake, now: Date): boolean {
  const ageMs = now.getTime() - quake.timeMs;
  if (ageMs < -5 * 60_000 || ageMs > QUAKE_WINDOW_MS) return false;
  const km = distanceKm(CAMPUS, quake);
  return (quake.magnitude >= 5 && km <= 500) || (quake.magnitude >= 6.5 && km <= 1000);
}

function quakeItem(quake: Quake): ReadingItem {
  const km = Math.round(distanceKm(CAMPUS, quake));
  const magnitude = quake.magnitude.toFixed(1);
  return {
    title: {
      en: `Magnitude ${magnitude}, ${quake.place.en}, ${km} km away`,
      th: `แผ่นดินไหวขนาด ${magnitude} ${quake.place.th} ห่างจากท่าพระจันทร์ ${km} กม.`,
    },
    at: toBangkokIso(quake.timeMs),
    distanceKm: km,
    href: quake.href,
  };
}

export function buildEarthquakeReading(quakes: Quake[] | null, now: Date): Reading {
  const felt = (quakes ?? []).filter((quake) => feltInBangkok(quake, now));
  felt.sort((a, b) => b.magnitude - a.magnitude);
  return {
    id: "earthquake",
    value: quakes ? (felt[0]?.magnitude ?? 0) : null,
    unit: "magnitude",
    observedAt: quakes ? toBangkokIso(now.getTime()) : null,
    staleAfterMinutes: 30,
    station: { en: "Thailand and nearby region", th: "ประเทศไทยและพื้นที่ใกล้เคียง" },
    source: {
      name: { en: "Thai Meteorological Department and USGS", th: "กรมอุตุนิยมวิทยา และ USGS" },
      url: "https://earthquake.tmd.go.th/",
    },
    items: quakes ? felt.slice(0, MAX_LISTED_ITEMS).map(quakeItem) : undefined,
  };
}

export function parseGdacsStorms(xml: unknown, now: Date): Storm[] {
  if (typeof xml !== "string") return [];
  const storms: Storm[] = [];
  for (const block of xmlItems(xml)) {
    if (xmlTag(block, "gdacs:eventtype") !== "TC") continue;
    const point = /<geo:Point>([\s\S]*?)<\/geo:Point>/.exec(block)?.[1] ?? block;
    const lat = toNumber(xmlTag(point, "geo:lat"));
    const lon = toNumber(xmlTag(point, "geo:long"));
    if (lat === null || lon === null) continue;
    const toDateMs = Date.parse(xmlTag(block, "gdacs:todate") ?? "");
    const isCurrent = xmlTag(block, "gdacs:iscurrent")?.toLowerCase() === "true";
    const endedRecently = !Number.isNaN(toDateMs) && now.getTime() - toDateMs <= STORM_GRACE_MS;
    if (!isCurrent && !endedRecently) continue;
    const name = cleanCopy(xmlTag(block, "gdacs:eventname") ?? xmlTag(block, "title") ?? "Unnamed");
    storms.push({
      name,
      lat,
      lon,
      alertLevel: xmlTag(block, "gdacs:alertlevel") ?? "Green",
      href: xmlTag(block, "link") ?? "https://www.gdacs.org/",
    });
  }
  return storms;
}

const ALERT_LEVEL_THAI: Record<string, string> = { green: "เขียว", orange: "ส้ม", red: "แดง" };

export function buildStormReading(storms: Storm[] | null, now: Date): Reading {
  const ranked = (storms ?? [])
    .map((storm) => ({ storm, km: distanceKm(CAMPUS, storm) }))
    .sort((a, b) => a.km - b.km);
  const nearest = ranked[0];
  const detail: Text | undefined = nearest
    ? {
        en: `Nearest storm ${nearest.storm.name}, alert level ${nearest.storm.alertLevel}`,
        th: `พายุที่ใกล้ที่สุดคือ ${nearest.storm.name} ระดับเตือน${
          ALERT_LEVEL_THAI[nearest.storm.alertLevel.toLowerCase()] ?? nearest.storm.alertLevel
        }`,
      }
    : undefined;
  return {
    id: "storm",
    value: storms ? (nearest ? Math.round(nearest.km) : NO_STORM_KM) : null,
    unit: "km",
    observedAt: storms ? toBangkokIso(now.getTime()) : null,
    staleAfterMinutes: 360,
    station: {
      en: "Active tropical cyclones worldwide",
      th: "พายุหมุนเขตร้อนที่ยังมีกำลังอยู่ทั่วโลก",
    },
    source: { name: { en: "GDACS", th: "GDACS" }, url: "https://www.gdacs.org/" },
    detail,
    items: storms
      ? ranked.slice(0, MAX_LISTED_STORMS).map(({ storm, km }) => ({
          title: {
            en: `Tropical cyclone ${storm.name}, ${Math.round(km)} km away`,
            th: `พายุหมุนเขตร้อน ${storm.name} ห่างจากท่าพระจันทร์ ${Math.round(km)} กม.`,
          },
          distanceKm: Math.round(km),
          href: storm.href,
        }))
      : undefined,
  };
}

function usgsUrl(now: Date): string {
  const fiveMinutesMs = 5 * 60_000;
  const since = new Date(
    Math.floor((now.getTime() - 24 * HOUR_MS) / fiveMinutesMs) * fiveMinutesMs
  );
  const query = new URLSearchParams({
    format: "geojson",
    minlatitude: "5",
    maxlatitude: "22",
    minlongitude: "92",
    maxlongitude: "106",
    minmagnitude: "4.5",
    starttime: since.toISOString().slice(0, 19),
  });
  return `${USGS_URL}?${query.toString()}`;
}

export async function fetchHazardReadings(now: Date): Promise<Reading[]> {
  const [longdoRaw, tmdXml, usgsRaw, gdacsXml] = await Promise.all([
    getJson(LONGDO_URL, { timeoutMs: 12_000, revalidate: 120 }),
    getText(TMD_QUAKE_URL, { revalidate: 120 }),
    getJson(usgsUrl(now), { revalidate: 120 }),
    getText(GDACS_URL, { timeoutMs: 12_000, revalidate: 600 }),
  ]);

  const longdoEvents = Array.isArray(longdoRaw) ? parseLongdoEvents(longdoRaw) : null;

  const tmdQuakes = tmdXml !== null ? parseTmdQuakeRss(tmdXml) : null;
  const usgsQuakes = usgsRaw !== null ? parseUsgsQuakes(usgsRaw) : null;
  const quakes = tmdQuakes || usgsQuakes ? mergeQuakes(tmdQuakes ?? [], usgsQuakes ?? []) : null;

  const storms = gdacsXml !== null ? parseGdacsStorms(gdacsXml, now) : null;

  return [
    ...buildRoadReadings(longdoEvents, now),
    buildEarthquakeReading(quakes, now),
    buildStormReading(storms, now),
  ];
}
