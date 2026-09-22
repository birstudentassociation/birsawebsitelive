import type { Locale } from "@/lib/i18n";
import type { LunchDirection } from "@/lib/openhouse";
import { POINTS } from "./ArrivalMap";
import TileMap, { type LatLng, type MapMark } from "./TileMap";

// Where each direction's name sits on the map: beside its cluster of places,
// not on top of one, so the numbered markers stay clear.
const ZONES: Record<string, LatLng & { en: string; th: string }> = {
  wanglang: { lat: 13.7541, lng: 100.4862, en: "Wang Lang", th: "วังหลัง" },
  further: { lat: 13.7636, lng: 100.4958, en: "Banglamphu", th: "บางลำพู" },
};

/**
 * The 12:07 map. One steady frame holds all three directions, so choosing one
 * only adds its numbered places and the way there; the map itself never moves.
 * The numbers match the list beneath, which carries the actual content.
 */
export default function LunchMap({
  locale,
  directions,
  selected,
}: {
  locale: Locale;
  directions: LunchDirection[];
  selected: LunchDirection | null;
}) {
  const campus: MapMark = {
    ...POINTS.campus,
    key: "campus",
    kind: "campus",
    label: POINTS.campus.label[locale],
  };
  const zones: MapMark[] = Object.entries(ZONES).map(([key, z]) => ({
    ...z,
    key: `zone-${key}`,
    kind: "zone",
    label: z[locale],
  }));

  // Nothing chosen: the whole neighbourhood, with each direction named.
  // Something chosen: that direction's own frame, with its places numbered.
  const frame: LatLng[] = selected
    ? [POINTS.campus, ...selected.places, ...(selected.ferry ? [POINTS.pier] : [])]
    : [POINTS.campus, ...directions.flatMap((d) => d.places), ...Object.values(ZONES)];
  const marks: MapMark[] = selected
    ? [
        campus,
        ...(selected.ferry
          ? [{ lat: POINTS.pier.lat, lng: POINTS.pier.lng, key: "pier", kind: "dot" as const }]
          : []),
      ]
    : [campus, ...zones];
  let routes: LatLng[][] = [];
  if (selected?.ferry) routes = [[POINTS.campus, POINTS.pier, POINTS.wanglang]];
  else if (selected?.key === "further" && selected.places[0])
    routes = [[POINTS.campus, selected.places[0]]];

  return (
    <div key={selected?.key ?? "all"} className="oh-lunch-view">
      <TileMap
        label={
          locale === "th"
            ? "แผนที่ร้านอาหารรอบท่าพระจันทร์"
            : "Map of lunch spots around Tha Prachan"
        }
        frame={frame}
        marks={marks}
        routes={routes}
        numbered={(selected?.places ?? []).map((p, i) => ({
          key: p.id,
          lat: p.lat,
          lng: p.lng,
          num: i + 1,
        }))}
        maxCols={5}
        maxRows={4}
        maxZoom={17}
        aspect={3 / 2}
      />
    </div>
  );
}
