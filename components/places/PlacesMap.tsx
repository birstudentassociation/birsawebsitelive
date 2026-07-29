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
 * `layoutMarkers` solves its collision layout in px at `MAP_LAYOUT_WIDTH`
 * (360px) and hands back percentages of the frame, so the map itself is
 * fully fluid: it has no min-width and never scrolls, it just renders at
 * whatever width the content column gives it. Above `MAP_LAYOUT_WIDTH` the
 * markers below are pinned to a fixed px size while the percentage grid
 * they sit on keeps growing, so clearance only improves. Below it there's
 * no slack left to spend, so the markers shrink in lockstep with the frame
 * instead, using `@container` query units — that keeps each marker the same
 * *proportion* of the frame it was solved for, which is what the solved
 * percentages actually depend on. See the marker layer below for how.
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
import {
  computeMapView,
  layoutMarkers,
  MAP_LAYOUT_WIDTH,
  MARKER_SIZE,
  type Place,
} from "@/lib/places";

// Glyph size, in CSS px, at `MAP_LAYOUT_WIDTH`. Not exported alongside
// `MARKER_SIZE` because it's purely a rendering choice with no bearing on
// the collision-layout maths in `lib/places.ts`; `PlacesSection.tsx`'s
// `PlaceChip` duplicates this value for its own, non-container-query
// sizing, so the two need to be kept in step by hand.
const MARKER_FONT_SIZE = 11;

/**
 * `min(fixedPx, referenceCqw)`: exactly `fixedPx` at container widths at or
 * above `MAP_LAYOUT_WIDTH`, and shrinking proportionally with the container
 * below it, because `referenceCqw` is the percentage of `MAP_LAYOUT_WIDTH`
 * that `fixedPx` represents. Requires `container-type: inline-size` on an
 * ancestor, set on the map frame below.
 */
function fluidPx(fixedPx: number): string {
  return `min(${fixedPx}px, ${((fixedPx / MAP_LAYOUT_WIDTH) * 100).toFixed(4)}cqw)`;
}

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
  const markerBoxSize = fluidPx(MARKER_SIZE);
  const markerFontSize = fluidPx(MARKER_FONT_SIZE);

  return (
    // Outer wrapper: purely a border/rounding frame now. There's nothing
    // left to scroll — the map frame inside is `w-full` and always fits the
    // content column — so this no longer needs `overflow-x-auto` or the
    // `tabIndex` that made a scroll region keyboard-reachable.
    <div role="group" {...groupProps} className="border-line rounded-lg border">
      <div
        // `container-type: inline-size` turns this frame into the `@container`
        // context the markers below query against, so they can read their own
        // size off *this* element's width rather than the viewport's.
        className="relative w-full"
        style={{ aspectRatio: `${view.cols} / ${view.rows}`, containerType: "inline-size" }}
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
              // Sizing is inline (`markerBoxSize`/`markerFontSize`) rather than
              // Tailwind's `h-7 min-w-7 text-xs` because it has to respond to
              // container width, not a breakpoint. `min-width` matches the box
              // size so a two-digit label like "68" still fits inside a circle
              // at the reference width; `px-1` is what lets it grow into a
              // pill past that rather than overflow. Tailwind's default
              // `box-border` puts the 2px border *inside* the box, so the
              // interactive target stays a true `MARKER_SIZE`px, which matters
              // now that this size is load-bearing for WCAG 2.5.8 Target Size.
              className="focus-halo absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white px-1 font-bold text-white shadow-md"
              style={{
                left: `${marker.marker.leftPct}%`,
                top: `${marker.marker.topPct}%`,
                backgroundColor: fill,
                width: markerBoxSize,
                height: markerBoxSize,
                minWidth: markerBoxSize,
                fontSize: markerFontSize,
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
