/**
 * Server component: renders a small, static OpenStreetMap raster-tile map
 * as a grid of `<img>` tiles, with a layer of real anchor markers on top
 * that link down to the matching `id="place-<id>"` list item rendered by
 * `PlacesSection`. No JavaScript is involved. The markers are plain,
 * always-focusable links, so the map is progressively enhanced by
 * construction rather than requiring any client-side code.
 *
 * The frame, tile grid and marker positions all come from the pure Web
 * Mercator helpers in `lib/places.ts` (`computeMapView` / `markerPosition`),
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
import { computeMapView, markerPosition, type Place } from "@/lib/places";

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

  const groupProps = labelledBy ? { "aria-labelledby": labelledBy } : { "aria-label": t.mapLabel };

  return (
    <div
      role="group"
      {...groupProps}
      className="border-line relative rounded-lg border"
      style={{ aspectRatio: `${view.cols} / ${view.rows}` }}
    >
      {/* Tile layer: purely decorative imagery. Whole tiles overhang the
          frame on every side (the frame is cropped to the places' bounding
          box, not rounded out to tile edges), so `overflow-hidden` is doing
          real work here beyond the rounded corners. Kept out of the
          accessibility tree entirely; the markers below (real links) and the
          list under the map carry the content. */}
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

      {/* Marker layer: a sibling of the clipped tile layer (not itself
          clipped), so a focus ring on a marker near the edge is never cut
          off by `overflow-hidden`. */}
      <div className="absolute inset-0">
        {places.map(({ place, label }) => {
          const pos = markerPosition(place, view);
          return (
            <a
              key={place.id}
              href={`#place-${place.id}`}
              className="focus-halo absolute flex h-7 min-w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white px-1 text-xs font-bold text-white shadow-md"
              style={{
                left: `${pos.leftPct}%`,
                top: `${pos.topPct}%`,
                backgroundColor: markerFill[markerVariant],
              }}
            >
              {label}
              <VisuallyHidden>: {place.name[locale]}</VisuallyHidden>
            </a>
          );
        })}
      </div>

      <div className="bg-surface/85 text-muted absolute right-1 bottom-1 rounded px-2 py-1 text-[11px]">
        <ExternalLink href="https://www.openstreetmap.org/copyright" newTabLabel={t.newTab}>
          {t.attribution}
        </ExternalLink>
      </div>
    </div>
  );
}
