/**
 * Live-arrival shaping for the public-bus tracker. Pure functions only, so the
 * parsing stays unit-testable (`tests/unit/bus-tracker.test.ts`) and can run on
 * the server inside the `/api/bus-eta` proxy.
 *
 * The upstream Namtang `stop-eta/{stopId}` feed sends no usable CORS headers,
 * so the browser cannot read it directly; the proxy fetches it server-side and
 * hands the client only the shaped arrivals this module produces, keyed by the
 * same `patternKey` the baked line data (`data.ts`) carries.
 */
import type { Bilingual } from "@/lib/shuttle";

// Formatting is shared with the shuttle notice board: one source of truth for
// "Arriving" vs "in N min" and the sub-minute threshold.
export { formatWait, ARRIVING_THRESHOLD_SECONDS } from "@/lib/shuttle-live";

/** The three stops this page tracks, in the order they are shown. */
export const STOP_IDS = [2373, 1573, 1061] as const;
export type StopId = (typeof STOP_IDS)[number];

/**
 * The subset of a `stop-eta` entry the live board relies on. The feed carries
 * more (icons, colours, wheelchair flags); anything not listed is ignored so an
 * upstream change to an unused field cannot break the board.
 */
export type LiveEtaEntry = {
  /** Route label, e.g. `"2-9 (53L) "` — matches the baked line's `routeName`. */
  name?: unknown;
  /** English headsign, e.g. `"Thewet "` — the second half of the match key. */
  tripHeadsignEn?: unknown;
  /** Whether this arrival is backed by a live GPS position. */
  hasGps?: unknown;
  /** Whole seconds to arrival; `<= 0` means "no live estimate", not "now". */
  waitTime?: unknown;
  /** Whether the vehicle is air-conditioned. */
  airCondition?: unknown;
};

/** A single live arrival for one line, after filtering and shaping. */
export type LiveArrival = {
  /** Whole seconds until arrival (always `> 0`). */
  waitSeconds: number;
  airCondition: boolean;
};

/** Live arrivals for one stop, grouped by the baked line's `patternKey`. */
export type StopLiveArrivals = Record<string, LiveArrival[]>;

/** The `/api/bus-eta` response body. */
export type BusEtaResponse = {
  ok: boolean;
  updatedAt: string;
  /** Keyed by stop id (as a string), each a `patternKey -> arrivals` map. */
  stops: Record<string, StopLiveArrivals>;
};

/**
 * Builds the key that ties a live arrival to a baked line:
 * `"{routeName}|{english headsign}"`, both trimmed. Returns `null` when there
 * is no usable route label, so a malformed entry is dropped rather than bucketed
 * under an empty key.
 */
export function patternKey(routeName: unknown, headsignEn: unknown): string | null {
  if (typeof routeName !== "string") return null;
  const route = routeName.trim();
  if (!route) return null;
  const head = typeof headsignEn === "string" ? headsignEn.trim() : "";
  return `${route}|${head}`;
}

/** Narrows an unknown feed value to a finite number, else `null`. */
function asFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/**
 * Reads one raw `stop-eta` payload defensively and groups its arrivals by
 * `patternKey`, keeping only GPS-backed arrivals with a positive wait (a
 * `waitTime` of `0` in this feed means "no live estimate", not "arriving now").
 * Each group is sorted soonest-first. A payload without a `data` array yields an
 * empty map rather than throwing.
 */
export function parseLiveStop(payload: unknown): StopLiveArrivals {
  const data =
    payload && typeof payload === "object" && Array.isArray((payload as { data?: unknown }).data)
      ? (payload as { data: LiveEtaEntry[] }).data
      : [];

  const byKey: StopLiveArrivals = {};
  for (const entry of data) {
    if (entry.hasGps !== true) continue;
    const waitSeconds = asFiniteNumber(entry.waitTime);
    if (waitSeconds === null || waitSeconds <= 0) continue;
    const key = patternKey(entry.name, entry.tripHeadsignEn);
    if (!key) continue;
    (byKey[key] ??= []).push({ waitSeconds, airCondition: entry.airCondition === true });
  }
  for (const key of Object.keys(byKey)) {
    byKey[key]!.sort((a, b) => a.waitSeconds - b.waitSeconds);
  }
  return byKey;
}

/**
 * Joins downstream stops into a single rider-facing path string, e.g.
 * `"Silpakorn University · Ratcha Woradit Pier · Opposite Tha Tian"`. Used by
 * the accessible fallback; the visible board renders the same stops as chips.
 */
export function downstreamText(stops: readonly Bilingual[], locale: "en" | "th"): string {
  return stops.map((s) => s[locale]).join(" · ");
}

/**
 * Compacts the feed's verbose fare string into a short chip, e.g.
 * `"Price 15.00 - 20.00 ฿"` -> `"15–20฿"`, `"ราคา 8.00 บาท"` -> `"8฿"`. Trailing
 * `.00` is dropped; a range keeps both ends. Returns the trimmed original when
 * no number is found, so an unexpected format degrades to something readable.
 */
export function compactFare(raw: string): string {
  const numbers = raw.match(/\d+(?:\.\d+)?/g);
  if (!numbers || numbers.length === 0) return raw.trim();
  const trim = (n: string) => n.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
  const ends = [trim(numbers[0]!)];
  if (numbers.length > 1 && numbers[numbers.length - 1] !== numbers[0]) {
    ends.push(trim(numbers[numbers.length - 1]!));
  }
  return `${ends.join("–")}฿`;
}

/**
 * Pulls the headway in whole minutes out of the feed's service string, e.g.
 * `"Departs every 15 minutes (approximately)"` -> `15`. Returns `null` when
 * there is no number, so the caller can omit the "every N min" chip entirely.
 */
export function headwayMinutes(raw: string): number | null {
  const match = raw.match(/\d+/);
  return match ? Number(match[0]) : null;
}
