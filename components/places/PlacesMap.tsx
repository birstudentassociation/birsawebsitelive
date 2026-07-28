/**
 * Server component: renders a small, static OpenStreetMap raster-tile map
 * as a grid of `<img>` tiles, with a layer of numbered markers on top that
 * link down to the matching `id="place-<id>"` list item in `PlacesSection`.
 * No JavaScript is involved.
 *
 * On a dense map, several places sit close enough together that their
 * markers would overlap if drawn at their true positions, so `layoutMarkers`
 * (in `lib/places.ts`) resolves collisions into a small fan around the
 * crowded spot. Where a marker has been nudged off its true position
 * (`displaced: true`), a thin leader line points from the marker back to a
 * dot at the actual location, so the map stays honest about where things
 * are even when the label isn't drawn exactly on top.
 *
 * `layoutMarkers` only guarantees no two 28px markers overlap at
 * `MIN_MAP_WIDTH` (672px); the guarantee holds at any wider rendered width
 * too, because percentages scale, but not narrower. That's why the map
 * carries a min-width and scrolls horizontally below it rather than
 * shrinking, see the wrapper below.
 *
 * The frame, tile grid and marker layout all come from the pure Web
 * Mercator helpers in `lib/places.ts` (`computeMapView` / `layoutMarkers`),
 * which are unit-tested independently of any rendering.
 *
 * Tile requests hit `https://tile.openstreetmap.org`, allow-listed in the
 * site CSP's `img-src` (see `middleware.ts`). In this sandbox those
 * requests 403 (network is blocked here); they resolve normally in
 * production.
 *
 * Used from `content/student-life/{en,th}/home/places-nearby.mdx` via
 * `PlacesSection` (food and housing), which is registered in `lib/mdx.tsx`.
 */
import ExternalLink from "@/components/ExternalLink";
import VisuallyHidden from "@/components/VisuallyHidden";
import type { Locale } from "@/lib/i18n";
import { computeMapView, layoutMarkers, MIN_MAP_WIDTH, type Place } from "@/lib/places";

export type PlaceMapEntry = {
  place: Place;
  /** The number ("1") or letter ("A") shown on both the marker and the matching list item. */
  label: string;
};

export type PlacesMapProps = {
  places: PlaceMapEntry[];
  zoom: number;
  markerVariant: "brand" | "forest";
  locale: Locale;
  /** Id of an element (usually visually hidden) that labels this map for screen readers. */
  labelledBy?: string;
};

type Copy = {
  attribution: string;
  newTab: string;
  mapLabel: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    attribution: "© OpenStreetMap contributors",
    newTab: "opens in a new tab",
    mapLabel: "Map of the places listed below",
  },
  th: {
    attribution: "ข้อมูลแผนที่ © ผู้ร่วมพัฒนา OpenStreetMap",
    newTab: "เปิดในแท็บใหม่",
    mapLabel: "แผนที่แสดงตำแหน่งของสถานที่ในรายการด้านล่าง",
  },
};

// Fixed hex marker fills, identical in both themes (same pattern as
// ShuttleRoute's line colours). `--color-forest` deliberately inverts to a
// pale green in dark mode for use as *text*, which would fail contrast
// against a white marker glyph if used as a solid fill here.
const markerFill: Record<"brand" | "forest", string> = {
  brand: "#C3002F",
  forest: "#2f5e4e",
};

export default function PlacesMap({
  places,
  zoom,
  markerVariant,
  locale,
  labelledBy,
}: PlacesMapProps) {
  const t = copy[locale];
  const view = computeMapView(
    places.map((entry) => entry.place),
    zoom
  );

  const tiles: { x: number; y: number }[] = [];
  for (let y = view.tileMinY; y <= view.tileMaxY; y++) {
    for (let x = view.tileMinX; x <= view.tileMaxX; x++) {
      tiles.push({ x, y });
    }
  }

  const labelById = new Map(places.map((entry) => [entry.place.id, entry.label]));
  const markers = layoutMarkers(
    places.map((entry) => entry.place),
    view
  );

  // The svg leader-line layer shares the tile grid's aspect ratio, scaled so
  // that one percentage point of the map's width or height is 10 viewBox
  // units. That keeps the maths for turning `leftPct`/`topPct` into
  // coordinates the same on both axes, modulo the height's own scale factor.
  const viewBoxHeight = (1000 * view.rows) / view.cols;
  const yScale = viewBoxHeight / 100;
  const fill = markerFill[markerVariant];

  const groupProps = labelledBy ? { "aria-labelledby": labelledBy } : { "aria-label": t.mapLabel };

  return (
    // Outer wrapper: scrolls horizontally rather than letting the map
    // shrink below `MIN_MAP_WIDTH`, the width `layoutMarkers` solved the
    // collision layout for. WCAG 1.4.10 Reflow exempts content that
    // genuinely needs two-dimensional layout to be meaningful, and a map
    // (like a data table) is exactly that case: the alternative is
    // markers close enough together to fail Target Size again. `tabIndex`
    // makes the scrollable region itself keyboard-reachable.
    <div
      role="group"
      {...groupProps}
      className="border-line overflow-x-auto rounded-lg border"
      tabIndex={0}
    >
      <div
        className="relative"
        style={{ minWidth: MIN_MAP_WIDTH, aspectRatio: `${view.cols} / ${view.rows}` }}
      >
        {/* Tile layer: purely decorative imagery. Whole tiles overhang the
            frame on every side (the frame is cropped to the places' bounding
            box, not rounded out to tile edges), so `overflow-hidden` is doing
            real work here beyond the rounded corners. Kept out of the
            accessibility tree; the list under the map, plus the markers
            below, carry the content. */}
        <div
          className="osm-tile-layer absolute inset-0 overflow-hidden rounded-lg"
          aria-hidden="true"
        >
          {tiles.map(({ x, y }) => (
            <img
              key={`${x}-${y}`}
              src={`https://tile.openstreetmap.org/${view.zoom}/${x}/${y}.png`}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute"
              style={{
                left: `${((x - view.minX) / view.cols) * 100}%`,
                top: `${((y - view.minY) / view.rows) * 100}%`,
                width: `${100 / view.cols}%`,
                height: `${100 / view.rows}%`,
              }}
            />
          ))}
        </div>

        {/* Leader-line layer: purely decorative, and deliberately placed
            before the marker layer in the DOM so the (real, clickable)
            markers always paint on top. An axe accessibility scan treats
            an element drawn over a link's hit area as obscuring it, so this
            layer is also `pointer-events-none` and never gets a chance to
            intercept a click or tap. */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 1000 ${viewBoxHeight}`}
          aria-hidden="true"
        >
          {markers
            .filter((marker) => marker.displaced)
            .map((marker) => {
              const x1 = marker.marker.leftPct * 10;
              const y1 = marker.marker.topPct * yScale;
              const x2 = marker.anchor.leftPct * 10;
              const y2 = marker.anchor.topPct * yScale;
              return (
                <g key={marker.place.id}>
                  {/* Wide white stroke underneath so the line reads against
                      dark tiles, then the narrower coloured stroke on top so
                      it reads against pale ones. */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="white"
                    strokeWidth={3}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={fill}
                    strokeWidth={1.25}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Dot marking the place's true location. */}
                  <circle
                    cx={x2}
                    cy={y2}
                    r={2.5}
                    fill={fill}
                    stroke="white"
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              );
            })}
        </svg>

        {/* Marker layer: a sibling of the clipped tile layer (not itself
            clipped), so a marker sitting on the frame's edge is never sliced
            in half by `overflow-hidden`. Real links, not decoration: each
            jumps to the matching list item, which is where the full name,
            category and "Open in Google Maps" link live. */}
        <div className="absolute inset-0">
          {markers.map((marker) => (
            <a
              key={marker.place.id}
              href={`#place-${marker.place.id}`}
              className="focus-halo absolute flex h-7 min-w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white px-1 text-xs font-bold text-white shadow-md"
              style={{
                left: `${marker.marker.leftPct}%`,
                top: `${marker.marker.topPct}%`,
                backgroundColor: fill,
              }}
            >
              {labelById.get(marker.place.id)}
              <VisuallyHidden>: {marker.place.name[locale]}</VisuallyHidden>
            </a>
          ))}
        </div>

        <div className="bg-surface/85 text-muted absolute right-1 bottom-1 rounded px-2 py-1 text-[11px]">
          <ExternalLink href="https://www.openstreetmap.org/copyright" newTabLabel={t.newTab}>
            {t.attribution}
          </ExternalLink>
        </div>
      </div>
    </div>
  );
}
