import type { Locale } from "@/lib/i18n";
import TileMap from "./TileMap";

type Bi = { en: string; th: string };
const L = (b: Bi, l: Locale) => b[l];

/**
 * The 08:42 map. Selecting an arrival mode draws its route into campus.
 * Coordinates checked against OpenStreetMap / Wikipedia (campus 13.7575,100.4900; Sanam Luang; Phra Pinklao Bridge; MRT Sanam Chai
 * 13.7439,100.4948) and the repo's own Wang Lang pins in `lib/places.ts`.
 */
type MapPoint = { lat: number; lng: number; label: Bi };

export const POINTS = {
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

// The near modes (ferry, bus, walk and the default view) share one steady
// old-city frame so flipping between them doesn't jump the zoom around; only
// the two long rides south (MRT, shuttle) zoom out to reach Sanam Chai. Both
// frames are the same shape, so the page never moves when the map changes.
const NEAR_FRAME: PointKey[] = ["campus", "pier", "wanglang", "sanamluang"];
const FAR_FRAME: PointKey[] = ["campus", "sanamluang", "sanamchai"];

export default function ArrivalMap({ locale, mode }: { locale: Locale; mode?: string }) {
  const route = mode ? ROUTES[mode] : undefined;
  const origin = route?.[0];
  const isFar = mode === "mrt" || mode === "shuttle";
  const shownKeys = Array.from(
    new Set<PointKey>([...(isFar ? FAR_FRAME : NEAR_FRAME), ...(route ?? [])])
  );

  return (
    <TileMap
      label={locale === "th" ? "แผนที่บริเวณท่าพระจันทร์" : "Map of the Tha Prachan area"}
      frame={shownKeys.map((k) => POINTS[k])}
      marks={shownKeys.map((k) => ({
        ...POINTS[k],
        key: k,
        label: L(POINTS[k].label, locale),
        kind: k === "campus" ? "campus" : k === origin ? "origin" : "dot",
      }))}
      routes={route ? [route.map((k) => POINTS[k])] : []}
      aspect={4 / 3}
    />
  );
}
