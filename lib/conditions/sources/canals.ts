import { unstable_cache } from "next/cache";
import { USER_AGENT } from "@/lib/conditions/fetch";
import { CAMPUS, distanceKm, type Text } from "@/lib/conditions/types";

export const BMA_CANAL_URL = "https://weather.bangkok.go.th/MuangMap/GetDataForUpdate";
export const BMA_CANAL_PAGE = "https://weather.bangkok.go.th/KlongMap";

const LEVEL_SYSTEM_ID = 2;
const FRESH_WINDOW_MS = 30 * 60_000;
const BANGKOK_OFFSET_MS = 7 * 3_600_000;
const MISSING_BELOW = -90;

export type CanalStatus = "critical" | "warning" | "normal" | "low" | "noData";

export type CanalPoint = {
  level: number;
  warning: number | null;
  critical: number | null;
  status: Exclude<CanalStatus, "noData">;
};

export type CanalStation = {
  id: number;
  code: string | null;
  name: Text;
  canal: string | null;
  lat: number;
  lon: number;
  distanceKm: number;
  bank: number | null;
  at: string | null;
  inside: CanalPoint | null;
  outside: CanalPoint | null;
  status: CanalStatus;
};

export type CanalSnapshot = {
  observedAt: string | null;
  stations: CanalStation[];
};

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

function asLevel(value: unknown): number | null {
  const level = asNumber(value);
  return level !== null && level > MISSING_BELOW ? level : null;
}

function dotNetMs(value: unknown): number | null {
  const match = /Date\((-?\d+)/.exec(String(value ?? ""));
  return match ? Number(match[1]) : null;
}

function toBangkokIso(ms: number): string {
  return `${new Date(ms + BANGKOK_OFFSET_MS).toISOString().slice(0, 19)}+07:00`;
}

function readingMs(last: Record<string, unknown>): number | null {
  const site = dotNetMs(last.site_timestamp);
  const update = dotNetMs(last.update_timestamp);
  return site !== null && update !== null && site > update ? update : site;
}

export function classify(
  level: number,
  warning: number | null,
  critical: number | null,
  dry: number | null
): CanalPoint["status"] {
  if (dry !== null && level < dry) return "low";
  if (critical !== null && level >= critical) return "critical";
  if (warning !== null && level >= warning) return "warning";
  return "normal";
}

function point(
  level: number | null,
  warning: number | null,
  critical: number | null,
  dry: number | null
): CanalPoint | null {
  if (level === null) return null;
  return { level, warning, critical, status: classify(level, warning, critical, dry) };
}

type Draft = Omit<CanalStation, "status" | "inside" | "outside"> & {
  ms: number | null;
  inside: CanalPoint | null;
  outside: CanalPoint | null;
};

function draftStation(row: Record<string, unknown>): Draft | null {
  if (asNumber(row.system_id) !== LEVEL_SYSTEM_ID) return null;
  const info = row.water_station_info;
  const last = row.water_level_last;
  if (!isRecord(info) || !isRecord(last)) return null;
  const id = asNumber(row.water_id);
  const lat = asNumber(info.latitude);
  const lon = asNumber(info.longitude);
  if (id === null || lat === null || lon === null) return null;

  const nameTh = asString(info.water_name) ?? asString(row.station_name);
  if (!nameTh) return null;
  const nameEn = asString(info.water_shortname_en) ?? asString(row.station_name_en) ?? nameTh;
  const checksDry = asNumber(info.checkdry) === 1;
  const banks = [asNumber(info.left_bank), asNumber(info.right_bank)].filter(
    (bank): bank is number => bank !== null
  );
  const ms = readingMs(last);

  return {
    id,
    code: asString(info.water_code),
    name: { en: nameEn, th: nameTh },
    canal: asString(info.river_name),
    lat,
    lon,
    distanceKm: Math.round(distanceKm(CAMPUS, { lat, lon }) * 10) / 10,
    bank: banks.length > 0 ? Math.min(...banks) : null,
    at: ms === null ? null : toBangkokIso(ms),
    ms,
    inside: point(
      asLevel(last.wl_in),
      asNumber(info.warning),
      asNumber(info.critical),
      checksDry ? asNumber(info.dry_in) : null
    ),
    outside: point(
      asLevel(last.wl_out01),
      asNumber(info.warning_out01),
      asNumber(info.critical_out01),
      checksDry ? asNumber(info.dry_out01) : null
    ),
  };
}

export function parseCanalStations(payload: unknown): CanalSnapshot | null {
  if (!isRecord(payload) || !Array.isArray(payload.waterStation)) return null;
  const seen = new Set<number>();
  const drafts: Draft[] = [];
  for (const row of payload.waterStation) {
    if (!isRecord(row)) continue;
    const draft = draftStation(row);
    if (!draft || seen.has(draft.id)) continue;
    seen.add(draft.id);
    drafts.push(draft);
  }
  if (drafts.length === 0) return null;

  const times = drafts.flatMap((draft) => (draft.ms === null ? [] : [draft.ms]));
  const newest = times.length > 0 ? Math.max(...times) : null;

  const stations = drafts.map(({ ms, ...draft }): CanalStation => {
    const fresh = newest !== null && ms !== null && newest - ms <= FRESH_WINDOW_MS;
    const inside = fresh ? draft.inside : null;
    const outside = fresh ? draft.outside : null;
    return { ...draft, inside, outside, status: inside?.status ?? "noData" };
  });

  return { observedAt: newest === null ? null : toBangkokIso(newest), stations };
}

export const STATUS_ORDER: CanalStatus[] = ["critical", "warning", "normal", "low", "noData"];

export function countByStatus(stations: CanalStation[]): Record<CanalStatus, number> {
  const counts: Record<CanalStatus, number> = {
    critical: 0,
    warning: 0,
    normal: 0,
    low: 0,
    noData: 0,
  };
  for (const station of stations) counts[station.status] += 1;
  return counts;
}

export function nearestStations(stations: CanalStation[], count: number): CanalStation[] {
  return [...stations].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, count);
}

export function aboveWarning(stations: CanalStation[]): CanalStation[] {
  return stations
    .filter((station) => station.status === "critical" || station.status === "warning")
    .sort(
      (a, b) =>
        STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) ||
        a.distanceKm - b.distanceKm
    );
}

export async function fetchCanalSnapshot(): Promise<CanalSnapshot | null> {
  try {
    const res = await fetch(BMA_CANAL_URL, {
      headers: {
        "user-agent": USER_AGENT,
        accept: "application/json",
        referer: BMA_CANAL_PAGE,
        "x-requested-with": "XMLHttpRequest",
      },
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return parseCanalStations(await res.json());
  } catch {
    return null;
  }
}

const cachedSnapshot = unstable_cache(
  async () => {
    const snapshot = await fetchCanalSnapshot();
    if (!snapshot) throw new Error("BMA canal data unavailable");
    return snapshot;
  },
  ["bma-canal-snapshot"],
  { revalidate: 600 }
);

export async function getCanalSnapshot(): Promise<CanalSnapshot | null> {
  try {
    return await cachedSnapshot();
  } catch {
    return null;
  }
}
