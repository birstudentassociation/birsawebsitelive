import { computeMapView, fitZoom, markerPosition, type Place } from "@/lib/places";
import type { Locale } from "@/lib/i18n";

type Bi = { en: string; th: string };
const L = (b: Bi, l: Locale) => b[l];

/**
 * Real OpenStreetMap raster tiles (same source and CSP allow-listing as
 * `components/places/PlacesMap.tsx`) centred on the Tha Prachan campus, with a
 * marker layer drawn from verified coordinates. Selecting an arrival mode draws
 * its route into campus. Coordinates checked against OpenStreetMap / Wikipedia
 * (campus 13.7575,100.4900; Sanam Luang; Phra Pinklao Bridge; MRT Sanam Chai
 * 13.7439,100.4948) and the repo's own Wang Lang pins in `lib/places.ts`.
 *
 * The tile requests 403 in this sandbox (network blocked, as PlacesMap notes)
 * and resolve normally in production. The overlay is aria-hidden decoration;
 * the mode buttons beneath carry the actual choice.
 */
type MapPoint = { lat: number; lng: number; label: Bi };

const POINTS = {
  campus: { lat: 13.757, lng: 100.4906, label: { en: "Tha Prachan", th: "ท่าพระจันทร์" } },
  pier: {
    lat: 13.7566,
    lng: 100.4897,
    label: { en: "Tha Prachan pier", th: "ท่าเรือท่าพระจันทร์" },
  },
  wanglang: { lat: 13.7561, lng: 100.4863, label: { en: "Wang Lang", th: "วังหลัง" } },
  sanamchai: { lat: 13.7439, lng: 100.4948, label: { en: "MRT Sanam Chai", th: "MRT สนามไชย" } },
  sanamluang: { lat: 13.755, lng: 100.4931, label: { en: "Sanam Luang", th: "สนามหลวง" } },
  oldcity: { lat: 13.7576, lng: 100.4924, label: { en: "Phra Chan Road", th: "ถนนพระจันทร์" } },
} satisfies Record<string, MapPoint>;

type PointKey = keyof typeof POINTS;

const ROUTES: Record<string, PointKey[]> = {
  ferry: ["wanglang", "pier", "campus"],
  bus: ["oldcity", "campus"],
  mrt: ["sanamchai", "campus"],
  shuttle: ["sanamchai", "campus"],
  walk: ["sanamluang", "campus"],
};

// The map frames only what the current route touches (plus a little river
// context by default), so it stays tight and legible instead of stretching to
// hold the far-south MRT on every view. Picking a mode reframes to that journey.
const DEFAULT_CONTEXT: PointKey[] = ["campus", "pier", "wanglang", "sanamluang"];

const stub = (p: MapPoint): Place => ({
  id: "",
  name: { en: "", th: "" },
  category: { en: "", th: "" },
  area: "oldtown",
  lat: p.lat,
  lng: p.lng,
  mapsQuery: "",
});

export default function ArrivalMap({ locale, mode }: { locale: Locale; mode?: string }) {
  const route = mode ? ROUTES[mode] : undefined;
  const origin = route?.[0];
  const shownKeys = route ? Array.from(new Set<PointKey>(["campus", ...route])) : DEFAULT_CONTEXT;

  const shownPoints = shownKeys.map((k) => stub(POINTS[k]));
  const zoom = fitZoom(shownPoints, { maxCols: 6, maxRows: 7, minZoom: 13, maxZoom: 16 });
  const view = computeMapView(shownPoints, zoom);
  const h = (1000 * view.rows) / view.cols;

  const tiles: { x: number; y: number }[] = [];
  for (let y = view.tileMinY; y <= view.tileMaxY; y++) {
    for (let x = view.tileMinX; x <= view.tileMaxX; x++) tiles.push({ x, y });
  }

  const pos = (k: PointKey) => {
    const p = markerPosition(stub(POINTS[k]), view);
    return { x: p.leftPct * 10, y: (p.topPct * h) / 100, leftPct: p.leftPct };
  };
  const routeD = route
    ? route.map((k, i) => `${i === 0 ? "M" : "L"}${pos(k).x} ${pos(k).y}`).join(" ")
    : "";

  const label = locale === "th" ? "แผนที่บริเวณท่าพระจันทร์" : "Map of the Tha Prachan area";

  return (
    <div role="group" aria-label={label} className="oh-map-frame">
      <div className="oh-map-inner" style={{ aspectRatio: `${view.cols} / ${view.rows}` }}>
        <div className="osm-tile-layer oh-map-tiles" aria-hidden="true">
          {tiles.map(({ x, y }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${x}-${y}`}
              src={`https://tile.openstreetmap.org/${view.zoom}/${x}/${y}.png`}
              alt=""
              loading="lazy"
              decoding="async"
              style={{
                left: `${((x - view.minX) / view.cols) * 100}%`,
                top: `${((y - view.minY) / view.rows) * 100}%`,
                width: `${100 / view.cols}%`,
                height: `${100 / view.rows}%`,
              }}
            />
          ))}
        </div>

        <svg
          className="oh-map-overlay"
          viewBox={`0 0 1000 ${h}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {route ? <path className="oh-map-route" d={routeD} pathLength={1} fill="none" /> : null}
          {shownKeys.map((k) => {
            const p = pos(k);
            const isCampus = k === "campus";
            const isOrigin = k === origin;
            const anchorEnd = p.leftPct > 62;
            return (
              <g key={k}>
                <circle
                  className={
                    isCampus ? "oh-map-campus-dot" : isOrigin ? "oh-map-origin" : "oh-map-dot"
                  }
                  cx={p.x}
                  cy={p.y}
                  r={isCampus ? 11 : 7}
                />
                <text
                  className={isCampus ? "oh-map-campus" : "oh-map-label"}
                  x={anchorEnd ? p.x - 16 : p.x + 16}
                  y={p.y + 8}
                  textAnchor={anchorEnd ? "end" : "start"}
                >
                  {L(POINTS[k].label, locale)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
