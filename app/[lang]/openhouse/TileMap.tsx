import {
  computeMapView,
  fitZoom,
  layoutMarkers,
  markerPosition,
  type MapView,
  type Place,
} from "@/lib/places";

export type LatLng = { lat: number; lng: number };

export type MapMark = LatLng & {
  key: string;
  label?: string;
  kind: "campus" | "origin" | "dot" | "zone";
};

export type NumberedMark = LatLng & { key: string; num: number };

type Props = {
  label: string;
  /** Points the frame must contain. Keep it constant across choices so the map never jumps. */
  frame: LatLng[];
  marks: MapMark[];
  numbered?: NumberedMark[];
  routes?: LatLng[][];
  maxCols?: number;
  maxRows?: number;
  maxZoom?: number;
  /** Width over height. The frame is widened or deepened around its centre to match, so every view of a map is the same shape. */
  aspect?: number;
};

const stub = (p: LatLng): Place => ({
  id: "",
  name: { en: "", th: "" },
  category: { en: "", th: "" },
  area: "oldtown",
  lat: p.lat,
  lng: p.lng,
  mapsQuery: "",
});

/**
 * Grow a set of points' bounding box to a given aspect ratio around its centre.
 * Over a few kilometres Web Mercator is close enough to longitude against
 * latitude scaled by sec(latitude) for this.
 */
function toAspect(points: LatLng[], aspect: number): LatLng[] {
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const midLat = (minLat + maxLat) / 2;
  const midLng = (minLng + maxLng) / 2;
  const sec = 1 / Math.cos((midLat * Math.PI) / 180);
  // A margin so markers at the edge of the set are never clipped.
  let w = (maxLng - minLng) * 1.3;
  let h = (maxLat - minLat) * sec * 1.3;
  if (w / h < aspect) w = h * aspect;
  else h = w / aspect;
  const dLat = h / sec / 2;
  return [
    { lat: midLat - dLat, lng: midLng - w / 2 },
    { lat: midLat + dLat, lng: midLng + w / 2 },
  ];
}

/**
 * Real OpenStreetMap raster tiles (same source and CSP allow-listing as
 * `components/places/PlacesMap.tsx`) under an SVG overlay drawn from verified
 * coordinates. The tiles are recoloured by the `oh-tiles-*` filters defined
 * once in OpenHouseExperience, so the map reads as paper and water rather than
 * a stock embed. The overlay is aria-hidden; the controls and lists beside
 * each map carry the actual content.
 */
export default function TileMap({
  label,
  frame,
  marks,
  numbered = [],
  routes = [],
  maxCols = 6,
  maxRows = 7,
  maxZoom = 16,
  aspect,
}: Props) {
  const framePlaces = (aspect ? toAspect(frame, aspect) : frame).map(stub);
  const zoom = fitZoom(framePlaces, { maxCols, maxRows, minZoom: 13, maxZoom });
  const view: MapView = computeMapView(framePlaces, zoom);
  const h = (1000 * view.rows) / view.cols;

  const tiles: { x: number; y: number }[] = [];
  for (let y = view.tileMinY; y <= view.tileMaxY; y++) {
    for (let x = view.tileMinX; x <= view.tileMaxX; x++) tiles.push({ x, y });
  }

  const pos = (p: LatLng) => {
    const m = markerPosition(stub(p), view);
    return { x: m.leftPct * 10, y: (m.topPct * h) / 100, leftPct: m.leftPct };
  };
  const routeD = routes.map((r) =>
    r.map((p, i) => `${i === 0 ? "M" : "L"}${pos(p).x} ${pos(p).y}`).join(" ")
  );

  const laid = numbered.length
    ? layoutMarkers(numbered.map(stub), view, { mapWidth: 380, markerSize: 26 })
    : [];

  return (
    <div
      role="group"
      aria-label={label}
      className="oh-map-frame"
      data-fixed={aspect ? "" : undefined}
      style={aspect ? { aspectRatio: String(aspect) } : undefined}
    >
      <div className="oh-map-inner" style={{ aspectRatio: `${view.cols} / ${view.rows}` }}>
        <div className="oh-map-tiles" aria-hidden="true">
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
          {routeD.map((d, i) => (
            <path key={i} className="oh-map-route" d={d} fill="none" />
          ))}
          {laid.map((l, i) =>
            l.displaced ? (
              <g key={`leader-${i}`} className="oh-map-leader">
                <line
                  x1={l.anchor.leftPct * 10}
                  y1={(l.anchor.topPct * h) / 100}
                  x2={l.marker.leftPct * 10}
                  y2={(l.marker.topPct * h) / 100}
                />
                <circle cx={l.anchor.leftPct * 10} cy={(l.anchor.topPct * h) / 100} r={5} />
              </g>
            ) : null
          )}
          {marks.map((m) => {
            const p = pos(m);
            const anchorEnd = p.leftPct > 62;
            if (m.kind === "zone") {
              return (
                <text key={m.key} className="oh-map-zone" x={p.x} y={p.y} textAnchor="middle">
                  {m.label}
                </text>
              );
            }
            const isCampus = m.kind === "campus";
            return (
              <g key={m.key}>
                <circle
                  className={
                    isCampus
                      ? "oh-map-campus-dot"
                      : m.kind === "origin"
                        ? "oh-map-origin"
                        : "oh-map-dot"
                  }
                  cx={p.x}
                  cy={p.y}
                  r={isCampus ? 9 : 6}
                />
                {m.label ? (
                  <text
                    className={isCampus ? "oh-map-campus" : "oh-map-label"}
                    x={anchorEnd ? p.x - 14 : p.x + 14}
                    y={p.y + 7}
                    textAnchor={anchorEnd ? "end" : "start"}
                  >
                    {m.label}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>

        {laid.map((l, i) => {
          const n = numbered[i];
          if (!n) return null;
          return (
            <span
              key={n.key}
              className="oh-map-num"
              aria-hidden="true"
              style={{ left: `${l.marker.leftPct}%`, top: `${l.marker.topPct}%` }}
            >
              {n.num}
            </span>
          );
        })}
      </div>
    </div>
  );
}
