/**
 * Bakes the static structure of the live public-bus tracker into
 * `lib/bus-tracker/data.ts`.
 *
 * The Namtang open-data API has no "routes at a stop" endpoint, so the roster
 * of lines calling at a stop can only be read from the live `stop-eta` feed;
 * and the ordered stop sequence (which gives "next three stops" and the
 * terminus) comes from `trip/{tripId}`. Neither changes often, so we snapshot
 * both here and commit the result, keeping the page fast, deterministic, and
 * able to show full route information even at night when no bus is running.
 * Live arrival times are layered on at runtime via `/api/bus-eta`.
 *
 * Re-run when routes change:
 *
 *   node scripts/generate-bus-data.mjs
 *
 * Then `npm run format` (this writes machine-shaped TS that prettier tidies).
 */
import { writeFileSync } from "node:fs";
import path from "node:path";

const API = "https://namtang-api.otp.go.th/front";
const STOP_IDS = [2373, 1573, 1061];
const SNAPSHOTS = 3; // union a few live rosters so we miss fewer lines
const SNAPSHOT_GAP_MS = 1500;
const MAX_DOWNSTREAM = 3;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url) {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

/** Union of tripIds serving a stop, across a few live snapshots. */
async function tripIdsForStop(stopId) {
  const ids = new Set();
  for (let i = 0; i < SNAPSHOTS; i++) {
    try {
      const body = await getJson(`${API}/stop-eta/${stopId}?locale=en`);
      for (const entry of body.data ?? []) {
        if (typeof entry.tripId === "number") ids.add(entry.tripId);
      }
    } catch (err) {
      console.warn(`  snapshot ${i + 1} for stop ${stopId} failed: ${err.message}`);
    }
    if (i < SNAPSHOTS - 1) await sleep(SNAPSHOT_GAP_MS);
  }
  return [...ids];
}

const bilingual = (en, th) => ({ en: (en ?? "").trim(), th: (th ?? "").trim() });

/** Builds one line record from a trip's English and Thai payloads. */
function buildLine(stopId, tripEn, tripTh) {
  const stopsEn = tripEn.stopList ?? [];
  const stopsTh = tripTh.stopList ?? [];
  const index = stopsEn.findIndex((s) => s.stopId === stopId);
  if (index === -1) return null;

  const downstream = [];
  for (let i = index + 1; i <= index + MAX_DOWNSTREAM && i < stopsEn.length; i++) {
    downstream.push(bilingual(stopsEn[i]?.stopName, stopsTh[i]?.stopName));
  }

  const lastEn = stopsEn[stopsEn.length - 1];
  const lastTh = stopsTh[stopsTh.length - 1];
  const routeName = (tripEn.routeShortName ?? "").trim();
  const headsignEn = (tripEn.tripHeadsign ?? "").trim();
  const vEn = (tripEn.vehicleList ?? [])[0] ?? {};
  const vTh = (tripTh.vehicleList ?? [])[0] ?? {};

  return {
    patternKey: `${routeName}|${headsignEn}`,
    routeName,
    routeLongName: bilingual(tripEn.routeLongName, tripTh.routeLongName),
    color: (tripEn.routeColor ?? "").trim().replace(/^#/, ""),
    headsign: bilingual(tripEn.tripHeadsign, tripTh.tripHeadsign),
    downstream,
    terminus: bilingual(lastEn?.stopName, lastTh?.stopName),
    operator: bilingual(vEn.agencyName, vTh.agencyName),
    fare: bilingual(vEn.price, vTh.price),
    serviceHours: bilingual(vEn.workingHours, vTh.workingHours),
    headway: bilingual(vEn.waitingSpan, vTh.waitingSpan),
    airConditioned: tripEn.airCondition === true,
    wheelchairAccessible: tripEn.wheelchairAccessible === true,
  };
}

async function buildStop(stopId) {
  console.log(`stop ${stopId}: gathering roster...`);
  const [stopEn, stopTh, tripIds] = await Promise.all([
    getJson(`${API}/stop/${stopId}?locale=en`).then((b) => b.data),
    getJson(`${API}/stop/${stopId}?locale=th`).then((b) => b.data),
    tripIdsForStop(stopId),
  ]);
  console.log(`  ${tripIds.length} trips seen`);

  const lines = [];
  const seen = new Set();
  for (const tripId of tripIds) {
    try {
      const [tripEn, tripTh] = await Promise.all([
        getJson(`${API}/trip/${tripId}?locale=en`).then((b) => b.data),
        getJson(`${API}/trip/${tripId}?locale=th`).then((b) => b.data),
      ]);
      const line = buildLine(stopId, tripEn, tripTh);
      if (!line || seen.has(line.patternKey)) continue;
      seen.add(line.patternKey);
      lines.push(line);
    } catch (err) {
      console.warn(`  trip ${tripId} failed: ${err.message}`);
    }
  }

  // Deterministic order: by route label (numeric-aware), then headsign. The
  // live board re-sorts by soonest actual arrival at runtime.
  lines.sort(
    (a, b) =>
      a.routeName.localeCompare(b.routeName, "en", { numeric: true }) ||
      a.headsign.en.localeCompare(b.headsign.en, "en")
  );

  const stop = {
    stopId,
    name: bilingual(stopEn.nameEn ?? stopEn.name, stopTh.nameTh ?? stopTh.name),
    lines,
  };
  const detail = bilingual(stopEn.detail, stopTh.detail);
  if (detail.en || detail.th) stop.detail = detail;
  return stop;
}

async function main() {
  const stops = [];
  for (const stopId of STOP_IDS) stops.push(await buildStop(stopId));

  const header = `/**
 * GENERATED FILE — do not edit by hand.
 *
 * Baked static structure for the live public-bus tracker: which lines call at
 * each tracked stop, where each goes next, and the terminus. Regenerate with
 * \`node scripts/generate-bus-data.mjs\` then \`npm run format\`. Live arrival
 * times are fetched at runtime through \`/api/bus-eta\`, not stored here.
 *
 * Source: Namtang open data (https://namtang-api.otp.go.th/front).
 */
import type { BusStopData } from "@/lib/bus-tracker/types";

export const busTrackerGeneratedAt = ${JSON.stringify(new Date().toISOString().slice(0, 10))};

export const busTrackerData: BusStopData[] = ${JSON.stringify(stops, null, 2)};
`;

  const out = path.join(process.cwd(), "lib", "bus-tracker", "data.ts");
  writeFileSync(out, header, "utf8");
  const total = stops.reduce((n, s) => n + s.lines.length, 0);
  console.log(`\nWrote ${out}: ${stops.length} stops, ${total} lines.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
