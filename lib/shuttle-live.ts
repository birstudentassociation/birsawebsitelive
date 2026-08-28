/**
 * Live public-bus arrivals at the "Opposite Tha Prachan" stop, sourced from
 * the OTP "Namtang" open-data live feed. This is the data behind the modified
 * Sanam Chai Line service notice: when that shuttle runs fewer buses, the
 * university points students at public bus routes 53, 43 and 15, which all
 * pass the stop directly across the road from campus.
 *
 * The feed is reverse-engineered from the Namtang stop page
 * (https://namtang.otp.go.th/maptrip/1061), which loads
 * `https://namtang-api.otp.go.th/front/stop-eta/{stopId}?locale={en|th}`.
 * That endpoint sends no CORS headers, so the browser cannot call it directly;
 * `app/api/shuttle-eta/route.ts` proxies it same-origin and hands the client
 * only the shaped result this module produces.
 *
 * No React here so the parsing/formatting stays unit-testable; see
 * `tests/unit/shuttle-live.test.ts`.
 */

import type { Bilingual } from "@/lib/shuttle";

/**
 * Namtang stop id for "ตรงข้ามท่าพระจันทร์ / Opposite Tha Phra Chan", the bus
 * stop on the far side of Phrachan Road from the Thammasat Tha Prachan campus.
 * Confirmed against the open-data stop list (`N00001061`) and the GTFS stop
 * feed (stop_id `1061`).
 */
export const THA_PRACHAN_OPPOSITE_STOP_ID = 1061;

/**
 * The public bus routes the modified-service notice sends students to, keyed
 * by the legacy route number riders and the notice actually use ("53", "43",
 * "15"). Namtang labels routes with the new numbering and the legacy number in
 * parentheses, e.g. `2-9 (53L)`, `4-11 (43)`, `4-2 (15)`, so we match on the
 * parenthetical. Order here is the order shown on the board.
 */
export type NoticeBusRoute = {
  /** Legacy bus number as it appears on the street and in the notice. */
  number: string;
  /** Short description of where the route runs. */
  name: Bilingual;
};

export const noticeBusRoutes: NoticeBusRoute[] = [
  {
    number: "53",
    name: { en: "Circular via Sanam Luang and Thewet", th: "สายวนรอบเกาะรัตนโกสินทร์" },
  },
  { number: "43", name: { en: "Ekkachai to Thewet", th: "เอกชัย ถึง เทเวศร์" } },
  {
    number: "15",
    name: { en: "Ratchaphruek to Bang Lamphu and Siam", th: "ราชพฤกษ์ ถึง บางลำพู และสยาม" },
  },
];

/**
 * The subset of a `stop-eta` entry this feature relies on. The upstream
 * payload carries more fields (icons, wheelchair flags, headsigns); anything
 * not listed here is deliberately ignored so an upstream shape change to an
 * unused field cannot break the board.
 */
export type StopEtaEntry = {
  /** Route label, e.g. `"2-9 (53L) "` or `"4-2 (15)"`. */
  name?: unknown;
  /** Whether this arrival is backed by a live GPS position. */
  hasGps?: unknown;
  /** Whole seconds until the bus reaches the stop. `<= 0` means no live estimate. */
  waitTime?: unknown;
  /** Whether the vehicle is air-conditioned. */
  airCondition?: unknown;
};

/** A single live arrival for one route, after filtering and shaping. */
export type LiveArrival = {
  /** Whole seconds until arrival (always `> 0`). */
  waitSeconds: number;
  /** Whether the vehicle is air-conditioned. */
  airCondition: boolean;
};

/** Every live arrival for one notice route, soonest first. */
export type RouteLiveTimes = {
  number: string;
  name: Bilingual;
  arrivals: LiveArrival[];
};

/**
 * Pulls the legacy bus number out of a Namtang route label. The number lives
 * in parentheses after the new-scheme code, and a circular route carries a
 * direction suffix we drop (`"2-9 (53L)"` -> `"53"`). Labels without a
 * parenthetical (`"203"`, `"91"`, `"1-9E"`) return `null`.
 */
export function legacyBusNumber(name: unknown): string | null {
  if (typeof name !== "string") return null;
  const match = name.match(/\((\d+)/);
  return match ? (match[1] ?? null) : null;
}

/** Narrows an unknown feed value to a finite number, else `null`. */
function asFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/**
 * Groups the raw feed into the three notice routes, keeping only arrivals that
 * are GPS-backed with a positive wait time (a `waitTime` of `0` in this feed
 * means "no live estimate", not "arriving now"). Routes with no live bus come
 * back with an empty `arrivals` list rather than being dropped, so the board
 * can still show the route and say nothing is being tracked.
 */
export function selectNoticeRoutes(entries: readonly StopEtaEntry[]): RouteLiveTimes[] {
  return noticeBusRoutes.map((route) => {
    const arrivals: LiveArrival[] = entries
      .filter((entry) => legacyBusNumber(entry.name) === route.number && entry.hasGps === true)
      .map((entry) => ({
        waitSeconds: asFiniteNumber(entry.waitTime),
        airCondition: entry.airCondition === true,
      }))
      .filter(
        (arrival): arrival is LiveArrival => arrival.waitSeconds !== null && arrival.waitSeconds > 0
      )
      .sort((a, b) => a.waitSeconds - b.waitSeconds);
    return { number: route.number, name: route.name, arrivals };
  });
}

/**
 * Reads the raw upstream JSON defensively and returns the shaped routes. A
 * payload without a `data` array (an error body, an upstream shape change)
 * yields the three routes with no arrivals rather than throwing.
 */
export function parseStopEta(payload: unknown): RouteLiveTimes[] {
  const data =
    payload && typeof payload === "object" && Array.isArray((payload as { data?: unknown }).data)
      ? (payload as { data: StopEtaEntry[] }).data
      : [];
  return selectNoticeRoutes(data);
}

/** Below this many seconds an arrival reads as "arriving", not a minute count. */
export const ARRIVING_THRESHOLD_SECONDS = 60;

/**
 * Formats a positive wait in seconds as rider-facing copy: "arriving" within
 * the last minute, otherwise whole minutes rounded to nearest (so a 90-second
 * wait shows as 2 min, never 1.5).
 */
export function formatWait(waitSeconds: number, locale: "en" | "th"): string {
  if (waitSeconds < ARRIVING_THRESHOLD_SECONDS) {
    return locale === "en" ? "Arriving" : "กำลังจะถึง";
  }
  const minutes = Math.round(waitSeconds / 60);
  return locale === "en" ? `in ${minutes} min` : `อีก ${minutes} นาที`;
}
