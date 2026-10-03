import { getJson, getText } from "@/lib/conditions/fetch";
import {
  CAMPUS,
  distanceKm,
  type Reading,
  type SeriesPoint,
  type Text,
} from "@/lib/conditions/types";

const THAIWATER_API = "https://api-v3.thaiwater.net/api/v1/thaiwater30";
const FEWS_BASE = "https://fews2.hii.or.th/model-output/data_portal";
const URBAN_FLOOD_URL =
  "https://hydro-hims.hii.or.th/api-docs/service/urban/urban_flood.php?urban_area";

const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;
const BANGKOK_OFFSET_MS = 7 * HOUR_MS;
const ROAD_SENSOR_RADIUS_KM = 3;
const CHAO_PHRAYA_DAM_ALARM = 2176;
const CHAO_PHRAYA_DAM_CRITICAL = 2720;

const THAIWATER_SOURCE = {
  name: {
    en: "ThaiWater, Hydro Informatics Institute",
    th: "คลังข้อมูลน้ำแห่งชาติ สสน.",
  },
  url: "https://www.thaiwater.net/water/wl",
};

const RID_SOURCE = {
  name: {
    en: "Royal Irrigation Department, via ThaiWater",
    th: "กรมชลประทาน ผ่านคลังข้อมูลน้ำแห่งชาติ สสน.",
  },
  url: "https://www.thaiwater.net/water/wl",
};

const BMA_WATER_SOURCE = {
  name: {
    en: "Bangkok Metropolitan Administration, via ThaiWater",
    th: "กรุงเทพมหานคร ผ่านคลังข้อมูลน้ำแห่งชาติ สสน.",
  },
  url: "https://www.thaiwater.net/water/wl",
};

const DWR_RAIN_SOURCE = {
  name: {
    en: "Department of Water Resources, via ThaiWater",
    th: "กรมทรัพยากรน้ำ ผ่านคลังข้อมูลน้ำแห่งชาติ สสน.",
  },
  url: "https://www.thaiwater.net/",
};

const FEWS_SOURCE = {
  name: {
    en: "Hydro Informatics Institute forecast model",
    th: "แบบจำลองพยากรณ์ สสน.",
  },
  url: "https://fews2.hii.or.th/model-output/data_portal",
};

const TIDE_SOURCE = {
  name: {
    en: "Hydro Informatics Institute tide prediction",
    th: "การพยากรณ์น้ำขึ้นน้ำลง สสน.",
  },
  url: "https://fews2.hii.or.th/model-output/data_portal",
};

const URBAN_FLOOD_SOURCE = {
  name: {
    en: "Hydro Informatics Institute urban flood warning",
    th: "เตือนภัยน้ำท่วมเมือง สสน.",
  },
  url: "https://hydro-hims.hii.or.th/",
};

export type GraphPoint = { at: string; value: number | null; discharge: number | null };

export type WaterlevelGraph = {
  points: GraphPoint[];
  bankLevel: number | null;
  warningLevel: number | null;
  criticalLevel: number | null;
};

export type FewsRow = { at: string; value: number };

export type ForecastSummary = {
  value: number | null;
  observedAt: string | null;
  series: SeriesPoint[];
};

export type TideHigh = { value: number; at: string; series: SeriesPoint[] };

export type FloodRoadSensor = {
  code: string;
  name: Text;
  distanceKm: number;
  value: number;
  at: string;
};

export type FloodRoadSummary = {
  value: number | null;
  observedAt: string | null;
  sensors: FloodRoadSensor[];
};

export type RainGaugeSummary = {
  value: number | null;
  observedAt: string | null;
  series: SeriesPoint[];
};

export type HiiThresholds = { warning: number | null; critical: number | null };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function toBangkokIso(ms: number): string {
  return `${new Date(ms + BANGKOK_OFFSET_MS).toISOString().slice(0, 19)}+07:00`;
}

function bangkokDate(ms: number): string {
  return new Date(ms + BANGKOK_OFFSET_MS).toISOString().slice(0, 10);
}

function localToIso(local: string): string | null {
  const match = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})(?::(\d{2}))?/.exec(local.trim());
  if (!match) return null;
  return `${match[1]}T${match[2]}:${match[3] ?? "00"}+07:00`;
}

function isoMs(iso: string): number {
  return Date.parse(iso);
}

function text(en: string, th: string): Text {
  return { en, th };
}

function twoDecimals(value: number): string {
  return value.toFixed(2);
}

function thousands(value: number): string {
  return value.toLocaleString("en-GB");
}

export function parseWaterlevelGraph(payload: unknown): WaterlevelGraph | null {
  if (!isRecord(payload) || !isRecord(payload.data)) return null;
  const graph = payload.data.graph_data;
  if (!Array.isArray(graph)) return null;
  const points: GraphPoint[] = [];
  for (const entry of graph) {
    if (!isRecord(entry)) continue;
    const datetime = asString(entry.datetime);
    const at = datetime ? localToIso(datetime) : null;
    if (!at) continue;
    points.push({ at, value: asNumber(entry.value), discharge: asNumber(entry.discharge) });
  }
  points.sort((a, b) => isoMs(a.at) - isoMs(b.at));
  return {
    points,
    bankLevel: asNumber(payload.data.min_bank),
    warningLevel: asNumber(payload.data.warning_level),
    criticalLevel: asNumber(payload.data.critical_level),
  };
}

export function latestGraphValue(
  graph: WaterlevelGraph,
  field: "value" | "discharge",
  now: Date
): { value: number; at: string } | null {
  for (let index = graph.points.length - 1; index >= 0; index--) {
    const point = graph.points[index];
    const value = point?.[field] ?? null;
    if (point && value !== null && isoMs(point.at) <= now.getTime() + 5 * 60_000)
      return { value, at: point.at };
  }
  return null;
}

export function hourlyGraphSeries(
  graph: WaterlevelGraph,
  field: "value" | "discharge",
  now: Date
): SeriesPoint[] {
  const earliest = now.getTime() - 48 * HOUR_MS;
  const byHour = new Map<number, SeriesPoint>();
  for (const point of graph.points) {
    const value = point[field];
    const ms = isoMs(point.at);
    if (value === null || ms < earliest || ms > now.getTime()) continue;
    byHour.set(Math.floor(ms / HOUR_MS), { at: point.at, value });
  }
  return [...byHour.entries()].sort((a, b) => a[0] - b[0]).map(([, point]) => point);
}

export function parseFewsCsv(raw: string): FewsRow[] {
  const rows: FewsRow[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const cells = line.trim().split(",");
    if (cells.length < 4) continue;
    const date = (cells[1] ?? "").trim();
    const time = (cells[2] ?? "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}(:\d{2})?$/.test(time)) continue;
    const value = asNumber(cells[3]);
    if (value === null) continue;
    const at = localToIso(`${date} ${time}`);
    if (at) rows.push({ at, value });
  }
  return rows.sort((a, b) => isoMs(a.at) - isoMs(b.at));
}

export function summariseForecast(rows: FewsRow[], now: Date, horizonDays = 7): ForecastSummary {
  const nowMs = now.getTime();
  const horizonMs = nowMs + horizonDays * DAY_MS;
  let observedAt: string | null = null;
  const series: SeriesPoint[] = [];
  for (const row of rows) {
    const ms = isoMs(row.at);
    if (ms <= nowMs) observedAt = row.at;
    else if (ms <= horizonMs) series.push({ at: row.at, value: row.value });
  }
  const value = series.length > 0 ? Math.max(...series.map((point) => point.value)) : null;
  return { value, observedAt, series };
}

export function parseTideNextHigh(raw: string, now: Date): TideHigh | null {
  const rows = parseFewsCsv(raw);
  const nowMs = now.getTime();
  const limitMs = nowMs + DAY_MS;
  let high: FewsRow | null = null;
  for (let index = 1; index < rows.length - 1; index++) {
    const row = rows[index];
    const before = rows[index - 1];
    const after = rows[index + 1];
    if (!row || !before || !after) continue;
    const ms = isoMs(row.at);
    if (ms <= nowMs) continue;
    if (ms > limitMs) break;
    if (row.value >= before.value && row.value > after.value) {
      high = row;
      break;
    }
  }
  if (!high) return null;
  const seriesEnd = nowMs + 48 * HOUR_MS;
  const series = rows
    .filter((row) => isoMs(row.at) > nowMs && isoMs(row.at) <= seriesEnd)
    .map((row) => ({ at: row.at, value: row.value }));
  return { value: high.value, at: high.at, series };
}

export function parseHiiThresholds(raw: string, code: string): HiiThresholds | null {
  const lines = raw.split(/\r?\n/);
  const header = (lines[0] ?? "").split(",").map((cell) => cell.trim());
  const codeIndex = header.indexOf("code");
  const warningIndex = header.indexOf("warning");
  const criticalIndex = header.indexOf("critical");
  if (codeIndex < 0 || warningIndex < 0 || criticalIndex < 0) return null;
  for (const line of lines.slice(1)) {
    const cells = line.split(",");
    if (cells[codeIndex]?.trim() === code) {
      return { warning: asNumber(cells[warningIndex]), critical: asNumber(cells[criticalIndex]) };
    }
  }
  return null;
}

function roadName(station: Record<string, unknown>): Text {
  const raw = station.floodroad_name;
  let thai: string | null = null;
  let english: string | null = null;
  if (typeof raw === "string") {
    thai = asString(raw);
  } else if (isRecord(raw)) {
    thai = asString(raw.th);
    english = asString(raw.en);
  }
  const fallback = asString(station.floodroad_oldcode) ?? "Road sensor";
  const clean = (value: string) =>
    value
      .replace(/\s+/g, " ")
      .replace(/\s*\*$/, "")
      .trim();
  const thaiName = clean(thai ?? english ?? fallback);
  return text(clean(english ?? thai ?? fallback), thaiName);
}

export function parseFloodRoad(
  payload: unknown,
  now: Date,
  campus: { lat: number; lon: number } = CAMPUS,
  radiusKm: number = ROAD_SENSOR_RADIUS_KM
): FloodRoadSummary {
  const empty: FloodRoadSummary = { value: null, observedAt: null, sensors: [] };
  if (!isRecord(payload) || !Array.isArray(payload.data)) return empty;
  const seen = new Set<string>();
  const nearby: FloodRoadSensor[] = [];
  for (const row of payload.data) {
    if (!isRecord(row) || !isRecord(row.station)) continue;
    const lat = asNumber(row.station.floodroad_lat);
    const lon = asNumber(row.station.floodroad_long);
    const value = asNumber(row.floodroad_value);
    const datetime = asString(row.floodroad_datetime);
    const at = datetime ? localToIso(datetime) : null;
    if (lat === null || lon === null || value === null || !at) continue;
    const distance = distanceKm(campus, { lat, lon });
    if (distance > radiusKm) continue;
    const code =
      asString(row.station.floodroad_oldcode) ??
      String(asNumber(row.station.id) ?? `${lat},${lon}`);
    if (seen.has(code)) continue;
    seen.add(code);
    nearby.push({
      code,
      name: roadName(row.station),
      distanceKm: Math.round(distance * 10) / 10,
      value: Math.max(0, value),
      at,
    });
  }
  if (nearby.length === 0) return empty;
  const newest = nearby.reduce((latest, sensor) =>
    isoMs(sensor.at) > isoMs(latest.at) ? sensor : latest
  );
  const fresh = nearby.filter((sensor) => now.getTime() - isoMs(sensor.at) <= DAY_MS);
  const value = fresh.length > 0 ? Math.max(...fresh.map((sensor) => sensor.value)) : null;
  return { value, observedAt: newest.at, sensors: fresh };
}

export function parseRainGauge(payload: unknown, now: Date): RainGaugeSummary {
  const empty: RainGaugeSummary = { value: null, observedAt: null, series: [] };
  if (!isRecord(payload) || !Array.isArray(payload.data)) return empty;
  const nowMs = now.getTime();
  const series: SeriesPoint[] = [];
  for (const entry of payload.data) {
    if (!isRecord(entry)) continue;
    const datetime = asString(entry.rainfall_datetime);
    const at = datetime ? localToIso(datetime) : null;
    const value = asNumber(entry.rainfall_value);
    if (!at || value === null) continue;
    const ms = isoMs(at);
    if (ms > nowMs || ms <= nowMs - DAY_MS) continue;
    series.push({ at, value });
  }
  if (series.length === 0) return empty;
  series.sort((a, b) => isoMs(a.at) - isoMs(b.at));
  const total = series.reduce((sum, point) => sum + point.value, 0);
  return {
    value: Math.round(total * 10) / 10,
    observedAt: series[series.length - 1]?.at ?? null,
    series,
  };
}

function ringContains(ring: unknown, lon: number, lat: number): boolean {
  if (!Array.isArray(ring)) return false;
  let inside = false;
  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index++) {
    const current: unknown = ring[index];
    const before: unknown = ring[previous];
    if (!Array.isArray(current) || !Array.isArray(before)) continue;
    const x1 = asNumber(current[0]);
    const y1 = asNumber(current[1]);
    const x2 = asNumber(before[0]);
    const y2 = asNumber(before[1]);
    if (x1 === null || y1 === null || x2 === null || y2 === null) continue;
    const crosses = y1 > lat !== y2 > lat && lon < ((x2 - x1) * (lat - y1)) / (y2 - y1) + x1;
    if (crosses) inside = !inside;
  }
  return inside;
}

function polygonContains(rings: unknown, lon: number, lat: number): boolean {
  if (!Array.isArray(rings) || rings.length === 0) return false;
  if (!ringContains(rings[0], lon, lat)) return false;
  return !rings.slice(1).some((hole) => ringContains(hole, lon, lat));
}

function geometryContains(geometry: unknown, lon: number, lat: number): boolean {
  if (!isRecord(geometry)) return false;
  if (geometry.type === "Polygon") return polygonContains(geometry.coordinates, lon, lat);
  if (geometry.type === "MultiPolygon" && Array.isArray(geometry.coordinates)) {
    return geometry.coordinates.some((polygon) => polygonContains(polygon, lon, lat));
  }
  return false;
}

export function pointInGeoJson(geoJson: unknown, lon: number, lat: number): boolean {
  if (!isRecord(geoJson)) return false;
  if (geoJson.type === "FeatureCollection" && Array.isArray(geoJson.features)) {
    return geoJson.features.some((feature) => pointInGeoJson(feature, lon, lat));
  }
  if (geoJson.type === "Feature") return geometryContains(geoJson.geometry, lon, lat);
  return geometryContains(geoJson, lon, lat);
}

function graphUrl(stationType: string, stationId: number, now: Date): string {
  const start = bangkokDate(now.getTime() - 2 * DAY_MS);
  const end = bangkokDate(now.getTime());
  return `${THAIWATER_API}/public/waterlevel_graph?station_type=${stationType}&station_id=${stationId}&start_date=${start}&end_date=${end}`;
}

async function fetchGraph(stationType: string, stationId: number, now: Date) {
  return parseWaterlevelGraph(await getJson(graphUrl(stationType, stationId, now)));
}

async function fetchFewsRows(path: string): Promise<FewsRow[] | null> {
  const raw = await getText(`${FEWS_BASE}/${path}`);
  if (raw === null) return null;
  const rows = parseFewsCsv(raw);
  return rows.length > 0 ? rows : null;
}

type ReadingBase = Pick<
  Reading,
  "id" | "unit" | "staleAfterMinutes" | "station" | "source" | "modelled"
>;

function failed(base: ReadingBase): Reading {
  return { ...base, value: null, observedAt: null };
}

function guard(base: ReadingBase, build: () => Reading): Reading {
  try {
    return build();
  } catch {
    return failed(base);
  }
}

const KRUNG_THEP_BASE: ReadingBase = {
  id: "riverKrungThep",
  unit: "m",
  staleAfterMinutes: 60,
  station: text("Krung Thep Bridge (CPY015)", "สะพานกรุงเทพ (CPY015)"),
  source: THAIWATER_SOURCE,
};

const SAMSEN_BASE: ReadingBase = {
  id: "riverSamsen",
  unit: "m",
  staleAfterMinutes: 180,
  station: text("Samsen (C.12)", "สามเสน (C.12)"),
  source: RID_SOURCE,
};

const PAK_KHLONG_TALAT_BASE: ReadingBase = {
  id: "riverPakKhlongTalat",
  unit: "m",
  staleAfterMinutes: 60,
  station: text("Pak Khlong Talat (WL.PKG.01)", "ปากคลองตลาด (WL.PKG.01)"),
  source: BMA_WATER_SOURCE,
};

const DAM_RELEASE_BASE: ReadingBase = {
  id: "damRelease",
  unit: "m3s",
  staleAfterMinutes: 240,
  station: text("Chao Phraya Dam (C.13)", "เขื่อนเจ้าพระยา (C.13)"),
  source: RID_SOURCE,
};

const DAM_FORECAST_BASE: ReadingBase = {
  id: "damReleaseForecast",
  unit: "m3s",
  staleAfterMinutes: 2160,
  station: text("Chao Phraya Dam (C.13), forecast", "เขื่อนเจ้าพระยา (C.13) ค่าพยากรณ์"),
  source: FEWS_SOURCE,
  modelled: true,
};

const NONTHABURI_FORECAST_BASE: ReadingBase = {
  id: "riverForecastNonthaburi",
  unit: "m",
  staleAfterMinutes: 2160,
  station: text(
    "Nuan Chawee Bridge, Nonthaburi (CPY014), forecast",
    "สะพานนวลฉวี นนทบุรี (CPY014) ค่าพยากรณ์"
  ),
  source: FEWS_SOURCE,
  modelled: true,
};

const TIDE_BASE: ReadingBase = {
  id: "tide",
  unit: "m",
  staleAfterMinutes: 1440,
  station: text("Chao Phraya river mouth tide (N01)", "น้ำขึ้นน้ำลง ปากแม่น้ำเจ้าพระยา (N01)"),
  source: TIDE_SOURCE,
  modelled: true,
};

const RAIN_GAUGE_BASE: ReadingBase = {
  id: "rainGauge24h",
  unit: "mm",
  staleAfterMinutes: 180,
  station: text("Memorial Bridge rain gauge", "สถานีวัดฝนสะพานพุทธ"),
  source: DWR_RAIN_SOURCE,
};

const ROAD_FLOOD_BASE: ReadingBase = {
  id: "roadFlood",
  unit: "cm",
  staleAfterMinutes: 60,
  station: text(
    "Road sensors within 3 km of campus",
    "เซนเซอร์น้ำท่วมถนนในรัศมี 3 กม. จากมหาวิทยาลัย"
  ),
  source: BMA_WATER_SOURCE,
};

const URBAN_FLOOD_BASE: ReadingBase = {
  id: "urbanFloodWarning",
  unit: "flag",
  staleAfterMinutes: 60,
  station: text("Tha Prachan campus area", "พื้นที่ท่าพระจันทร์"),
  source: URBAN_FLOOD_SOURCE,
};

function riverLevelReading(
  base: ReadingBase,
  graph: WaterlevelGraph | null,
  now: Date,
  detail: (graph: WaterlevelGraph) => Text | undefined
): Reading {
  return guard(base, () => {
    if (!graph) return failed(base);
    const latest = latestGraphValue(graph, "value", now);
    if (!latest) return failed(base);
    return {
      ...base,
      value: latest.value,
      observedAt: latest.at,
      detail: detail(graph),
      series: hourlyGraphSeries(graph, "value", now),
    };
  });
}

function bankDetail(graph: WaterlevelGraph): Text | undefined {
  if (graph.bankLevel === null) return undefined;
  const level = twoDecimals(graph.bankLevel);
  return text(`Bank ${level} m`, `ตลิ่ง ${level} ม.`);
}

function pakKhlongTalatDetail(graph: WaterlevelGraph): Text | undefined {
  if (graph.warningLevel === null || graph.criticalLevel === null) return undefined;
  const warning = twoDecimals(graph.warningLevel);
  const wall = twoDecimals(graph.criticalLevel);
  return text(`Warning ${warning} m, wall ${wall} m`, `เตือนภัย ${warning} ม. กำแพง ${wall} ม.`);
}

const DAM_THRESHOLD_DETAIL = text(
  `Alarm ${thousands(CHAO_PHRAYA_DAM_ALARM)} m³/s, critical ${thousands(CHAO_PHRAYA_DAM_CRITICAL)} m³/s`,
  `เฝ้าระวัง ${thousands(CHAO_PHRAYA_DAM_ALARM)} ลบ.ม./วินาที วิกฤต ${thousands(CHAO_PHRAYA_DAM_CRITICAL)} ลบ.ม./วินาที`
);

function damReleaseReading(graph: WaterlevelGraph | null, now: Date): Reading {
  const base = DAM_RELEASE_BASE;
  return guard(base, () => {
    if (!graph) return failed(base);
    const latest = latestGraphValue(graph, "discharge", now);
    if (!latest) return failed(base);
    return {
      ...base,
      value: latest.value,
      observedAt: latest.at,
      detail: DAM_THRESHOLD_DETAIL,
      series: hourlyGraphSeries(graph, "discharge", now),
    };
  });
}

function forecastReading(
  base: ReadingBase,
  rows: FewsRow[] | null,
  now: Date,
  detail: Text | undefined
): Reading {
  return guard(base, () => {
    if (!rows) return failed(base);
    const summary = summariseForecast(rows, now);
    if (summary.value === null) return failed(base);
    return {
      ...base,
      value: summary.value,
      observedAt: summary.observedAt,
      detail,
      series: summary.series,
    };
  });
}

function nonthaburiDetail(thresholds: HiiThresholds | null): Text | undefined {
  if (!thresholds || thresholds.critical === null) return undefined;
  const critical = twoDecimals(thresholds.critical);
  if (thresholds.warning === null)
    return text(`Critical level ${critical} m`, `ระดับวิกฤต ${critical} ม.`);
  const warning = twoDecimals(thresholds.warning);
  return text(
    `Warning ${warning} m, critical ${critical} m`,
    `เตือนภัย ${warning} ม. วิกฤต ${critical} ม.`
  );
}

function tideReading(raw: string | null, now: Date): Reading {
  const base = TIDE_BASE;
  return guard(base, () => {
    if (raw === null) return failed(base);
    const high = parseTideNextHigh(raw, now);
    if (!high) return failed(base);
    const clock = high.at.slice(11, 16);
    return {
      ...base,
      value: high.value,
      observedAt: toBangkokIso(now.getTime()),
      detail: text(`Next high tide at ${clock}`, `น้ำขึ้นสูงสุดครั้งถัดไปเวลา ${clock} น.`),
      series: high.series,
    };
  });
}

function rainGaugeReading(payload: unknown, now: Date): Reading {
  const base = RAIN_GAUGE_BASE;
  return guard(base, () => {
    const summary = parseRainGauge(payload, now);
    if (summary.value === null) return failed(base);
    return {
      ...base,
      value: summary.value,
      observedAt: summary.observedAt,
      series: summary.series,
    };
  });
}

function roadFloodReading(payload: unknown, now: Date): Reading {
  const base = ROAD_FLOOD_BASE;
  return guard(base, () => {
    const summary = parseFloodRoad(payload, now);
    if (summary.observedAt === null) return failed(base);
    return {
      ...base,
      value: summary.value,
      observedAt: summary.observedAt,
      items: summary.sensors
        .filter((sensor) => sensor.value > 0)
        .map((sensor) => ({
          title: text(
            `${sensor.name.en} (${sensor.value} cm)`,
            `${sensor.name.th} (${sensor.value} ซม.)`
          ),
          at: sensor.at,
          distanceKm: sensor.distanceKm,
        })),
    };
  });
}

function urbanFloodReading(payload: unknown, now: Date): Reading {
  const base = URBAN_FLOOD_BASE;
  return guard(base, () => {
    if (!isRecord(payload) || !Array.isArray(payload.features)) return failed(base);
    const inside = pointInGeoJson(payload, CAMPUS.lon, CAMPUS.lat);
    return { ...base, value: inside ? 1 : 0, observedAt: toBangkokIso(now.getTime()) };
  });
}

export async function fetchWaterReadings(now: Date): Promise<Reading[]> {
  const [
    krungThepGraph,
    samsenGraph,
    pakKhlongTalatGraph,
    damGraph,
    damForecastRows,
    nonthaburiRows,
    metadataRaw,
    tideRaw,
    rainPayload,
    roadPayload,
    urbanPayload,
  ] = await Promise.all([
    fetchGraph("tele_waterlevel", 4, now),
    fetchGraph("tele_waterlevel", 2599, now),
    fetchGraph("canal", 118, now),
    fetchGraph("tele_waterlevel", 2744, now),
    fetchFewsRows("rid_discharge/forecast/C13.txt"),
    fetchFewsRows("hii_waterlevel/forecast/CPY014.txt"),
    getText(`${FEWS_BASE}/metadata/hii_waterlevel.csv`),
    getText(`${FEWS_BASE}/tide_table/N01.txt`),
    getJson(`${THAIWATER_API}/public/rain_24h_graph?station_id=6855775`),
    getJson(`${THAIWATER_API}/public/flood_road`),
    getJson(URBAN_FLOOD_URL),
  ]);

  const thresholds = metadataRaw === null ? null : parseHiiThresholds(metadataRaw, "CPY014");

  return [
    riverLevelReading(KRUNG_THEP_BASE, krungThepGraph, now, bankDetail),
    riverLevelReading(SAMSEN_BASE, samsenGraph, now, bankDetail),
    riverLevelReading(PAK_KHLONG_TALAT_BASE, pakKhlongTalatGraph, now, pakKhlongTalatDetail),
    damReleaseReading(damGraph, now),
    forecastReading(DAM_FORECAST_BASE, damForecastRows, now, DAM_THRESHOLD_DETAIL),
    forecastReading(NONTHABURI_FORECAST_BASE, nonthaburiRows, now, nonthaburiDetail(thresholds)),
    tideReading(tideRaw, now),
    rainGaugeReading(rainPayload, now),
    roadFloodReading(roadPayload, now),
    urbanFloodReading(urbanPayload, now),
  ];
}
