/**
 * Shared types for the live public-bus tracker (the "Live public bus tracker"
 * student-life guide). The structural route data — which lines call at each of
 * the three tracked stops, and where each line goes next — is static and baked
 * at build time into `data.ts` by `scripts/generate-bus-data.mjs`; the live
 * arrival times are fetched per request through the `/api/bus-eta` proxy and
 * shaped by `live.ts`.
 *
 * Kept free of React so both the baking script and the unit tests can import
 * it without pulling in the client.
 */
import type { Bilingual } from "@/lib/shuttle";

/**
 * One line (a single route in a single direction) as it calls at one stop.
 * Everything here is static and comes from the Namtang `trip/{tripId}` feed;
 * live arrivals are layered on top at runtime, matched by `patternKey`.
 */
export type BusLine = {
  /**
   * Stable key matching a baked line to its live arrivals, built as
   * `"{routeName}|{english headsign}"`. A route in two directions produces two
   * lines with different headsigns and so different keys; several vehicles
   * running the same pattern share one key and collapse to a single line.
   */
  patternKey: string;
  /** Official route label, trimmed, e.g. `"4-2 (15)"` or bare `"1"`. */
  routeName: string;
  /** Full route name, e.g. `"Sanamluang - Thewet"`. */
  routeLongName: Bilingual;
  /** Route brand colour as a bare hex triple, e.g. `"ff0000"` (no `#`). */
  color: string;
  /** Direction/destination headsign, e.g. `"Thewet"`. */
  headsign: Bilingual;
  /** Up to three stops downstream of this stop, in travel order. */
  downstream: Bilingual[];
  /** Final stop on the trip. On a loop route this can equal the origin. */
  terminus: Bilingual;
  /** Operating agency, e.g. `"Thai Smile Bus"`. */
  operator: Bilingual;
  /** Fare as the feed's display string, e.g. `"Price 15.00 - 20.00 ฿"`. */
  fare: Bilingual;
  /** Service hours as the feed's display string, when given. */
  serviceHours: Bilingual;
  /** Headway ("every N min") as the feed's display string, when given. */
  headway: Bilingual;
  airConditioned: boolean;
  wheelchairAccessible: boolean;
};

/** One tracked stop and every line baked as calling at it. */
export type BusStopData = {
  /** Namtang stop id, e.g. `1061`. */
  stopId: number;
  /** Stop name. */
  name: Bilingual;
  /** Short locating detail, e.g. `"Phra Chan Pier (OPP Thammasat U)"`. */
  detail?: Bilingual;
  /** Lines calling here, in the order they were baked (soonest-typical first). */
  lines: BusLine[];
};
