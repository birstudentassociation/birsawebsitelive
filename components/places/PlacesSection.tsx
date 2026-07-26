/**
 * Server component: renders one half of the "Food and housing nearby" guide
 * (`content/student-life/{en,th}/home/places-nearby.mdx`), either the food
 * groups (spread across two neighbourhood maps, old town and Pinklao) or the
 * single lettered housing list, as small static maps (`PlacesMap`) followed
 * by a matching, semantically real list.
 *
 * The map markers and the list items share one numbering source
 * (`foodPlacesFlat` / `housingPlacesLettered` in `lib/places.ts`), so the
 * "1" on the map and the "1" in the list can never drift apart.
 *
 * Registered as `NearbyFood` / `NearbyHousing` in `lib/mdx.tsx`'s MDX
 * component map. Group titles render as `<h3>` (the MDX page's own
 * headings are `<h2>`, so this keeps heading order sequential).
 */
import type { ReactNode } from "react";
import ExternalLink from "@/components/ExternalLink";
import Tag from "@/components/Tag";
import VisuallyHidden from "@/components/VisuallyHidden";
import PlacesMap, { type PlaceMapEntry } from "@/components/places/PlacesMap";
import type { Locale } from "@/lib/i18n";
import {
  fitZoom,
  foodGroups,
  foodPlacesFlat,
  housingPlaces,
  housingPlacesLettered,
  type NumberedPlace,
  type Place,
  type PlaceArea,
} from "@/lib/places";

export type PlacesSectionProps = {
  locale: Locale;
  section: "food" | "housing";
};

type Copy = {
  mapsLabel: string;
  mapHeading: string;
  areaMapCaption: Record<PlaceArea, string>;
  areaTag: Record<PlaceArea, string>;
  ratedTitle: (ratingText: string, countText: string) => string;
};

const copy: Record<Locale, Copy> = {
  en: {
    mapsLabel: "Open in Google Maps",
    mapHeading: "Map of the places listed below",
    areaMapCaption: {
      oldtown: "Tha Prachan, Wang Lang and the old town",
      pinklao: "Pinklao and Charansanitwong",
    },
    areaTag: {
      oldtown: "Old town side",
      pinklao: "Pinklao side",
    },
    ratedTitle: (ratingText, countText) =>
      `Rated ${ratingText} out of 5 from ${countText} Google reviews`,
  },
  th: {
    mapsLabel: "เปิดใน Google Maps",
    mapHeading: "แผนที่แสดงตำแหน่งของสถานที่ในรายการด้านล่าง",
    areaMapCaption: {
      oldtown: "ฝั่งท่าพระจันทร์ วังหลัง และเมืองเก่า",
      pinklao: "ฝั่งปิ่นเกล้าและจรัญสนิทวงศ์",
    },
    areaTag: {
      oldtown: "ฝั่งพระนคร",
      pinklao: "ฝั่งปิ่นเกล้า",
    },
    ratedTitle: (ratingText, countText) =>
      `คะแนน ${ratingText} จาก 5 จากรีวิว ${countText} รายการใน Google`,
  },
};

// Fixed hex marker fills, matching `PlacesMap`'s marker colours exactly so
// the chip next to each list item reads as the same object as its pin on
// the map. See `PlacesMap.tsx` for why these are literal hex rather than
// theme-swapping `--color-*` tokens.
const chipFill: Record<"brand" | "forest", string> = {
  brand: "#C3002F",
  forest: "#2f5e4e",
};

function displayName(locale: Locale, place: Place): string {
  if (locale === "en" && place.nameLocal && !place.name.en.includes(place.nameLocal)) {
    return `${place.name.en} (${place.nameLocal})`;
  }
  return place.name[locale];
}

/** Interleaves `separator` between the given nodes; no separator before the first item. */
function joinWithSeparator(nodes: ReactNode[], separator: string): ReactNode[] {
  return nodes.flatMap((node, index) => (index === 0 ? [node] : [separator, node]));
}

function PlaceChip({ label, variant }: { label: string; variant: "brand" | "forest" }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full border-2 border-white px-1 text-xs font-bold text-white shadow-sm"
      style={{ backgroundColor: chipFill[variant] }}
    >
      {label}
    </span>
  );
}

function PlaceListItem({
  place,
  label,
  variant,
  locale,
  section,
}: {
  place: Place;
  label: string;
  variant: "brand" | "forest";
  locale: Locale;
  section: "food" | "housing";
}) {
  const t = copy[locale];
  const name = displayName(locale, place);

  const metaNodes: ReactNode[] = [];
  if (section === "food") {
    metaNodes.push(place.category[locale]);
  }
  if (place.rating !== undefined && place.ratingCount !== undefined) {
    const ratingText = place.rating.toFixed(1);
    const countText = place.ratingCount.toLocaleString(locale === "th" ? "th-TH" : "en-GB");
    metaNodes.push(
      <span key="rating">
        <span aria-hidden="true">★</span> {ratingText} ({countText})
        <VisuallyHidden> {t.ratedTitle(ratingText, countText)}</VisuallyHidden>
      </span>
    );
  }

  return (
    <li id={`place-${place.id}`} className="flex scroll-mt-24 items-start gap-3">
      <PlaceChip label={label} variant={variant} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-ink font-semibold">{name}</p>
          <Tag variant="neutral">
            {section === "food" ? t.areaTag[place.area] : place.category[locale]}
          </Tag>
        </div>
        {metaNodes.length > 0 ? (
          <p className="text-muted text-sm">{joinWithSeparator(metaNodes, " · ")}</p>
        ) : null}
        {place.note ? <p className="text-muted text-sm">{place.note[locale]}</p> : null}
        <p className="text-sm">
          <ExternalLink
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.mapsQuery)}`}
            newTabLabel={locale === "en" ? "opens in a new tab" : "เปิดในแท็บใหม่"}
            className="text-brand-deep font-medium"
          >
            {t.mapsLabel}
          </ExternalLink>
        </p>
      </div>
    </li>
  );
}

const AREAS: PlaceArea[] = ["oldtown", "pinklao"];

function FoodSection({ locale }: { locale: Locale }) {
  const numbered = foodPlacesFlat();
  const labelByPlaceId = new Map(numbered.map((entry) => [entry.place.id, entry.label]));
  const t = copy[locale];

  let runningIndex = 0;

  return (
    <div className="flex flex-col gap-8">
      {AREAS.map((area) => {
        const areaEntries: NumberedPlace[] = numbered.filter((entry) => entry.place.area === area);
        const mapEntries: PlaceMapEntry[] = areaEntries.map(({ place, label }) => ({
          place,
          label,
        }));
        // The food trail spans Wang Lang to Nang Loeng on the old-town side,
        // so allow a taller tile grid than the default budget: dropping a zoom
        // level would stack the dense Tha Prachan cluster's markers on top of
        // each other. Tiles are lazy-loaded, so the bigger grid only costs
        // requests once the map scrolls into view.
        const zoom = fitZoom(
          areaEntries.map((entry) => entry.place),
          { maxRows: 10 }
        );
        const headingId = `places-food-map-${area}-label`;
        return (
          <div key={area} className="flex flex-col gap-2">
            <p id={headingId} className="text-ink text-sm font-semibold">
              {t.areaMapCaption[area]}
            </p>
            <PlacesMap
              places={mapEntries}
              zoom={zoom}
              markerVariant="brand"
              locale={locale}
              labelledBy={headingId}
            />
          </div>
        );
      })}
      {foodGroups.map((group) => {
        const startIndex = runningIndex + 1;
        runningIndex += group.places.length;
        return (
          <div key={group.id} className="flex flex-col gap-3">
            <h3 className="font-display text-lg">{group.title[locale]}</h3>
            {/* `list-none` drops list semantics in WebKit/VoiceOver; the
                explicit role restores them. */}
            <ol start={startIndex} role="list" className="flex list-none flex-col gap-4 pl-0">
              {group.places.map((place) => (
                <PlaceListItem
                  key={place.id}
                  place={place}
                  label={labelByPlaceId.get(place.id) ?? ""}
                  variant="brand"
                  locale={locale}
                  section="food"
                />
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}

function HousingSection({ locale }: { locale: Locale }) {
  const lettered: NumberedPlace[] = housingPlacesLettered();
  const mapEntries: PlaceMapEntry[] = lettered.map(({ place, label }) => ({ place, label }));
  const t = copy[locale];
  const mapHeadingId = "places-housing-map-label";
  const zoom = fitZoom(housingPlaces);

  return (
    <div className="flex flex-col gap-6">
      <p id={mapHeadingId} className="sr-only">
        {t.mapHeading}
      </p>
      <PlacesMap
        places={mapEntries}
        zoom={zoom}
        markerVariant="forest"
        locale={locale}
        labelledBy={mapHeadingId}
      />
      <ol role="list" className="flex list-none flex-col gap-4 pl-0">
        {lettered.map(({ place, label }) => (
          <PlaceListItem
            key={place.id}
            place={place}
            label={label}
            variant="forest"
            locale={locale}
            section="housing"
          />
        ))}
      </ol>
    </div>
  );
}

export default function PlacesSection({ locale, section }: PlacesSectionProps) {
  return section === "food" ? <FoodSection locale={locale} /> : <HousingSection locale={locale} />;
}
