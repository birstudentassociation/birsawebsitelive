/**
 * Server component: renders one half of the "Food and places nearby" guide
 * (`content/student-life/{en,th}/home/places-nearby.mdx`) — either the food
 * groups or the single "places to know" list — as a small static map
 * (`PlacesMap`) followed by a matching, semantically real list.
 *
 * The map markers and the list items share one numbering source
 * (`foodPlacesFlat` / `essentialPlacesLettered` in `lib/places.ts`), so the
 * "1" on the map and the "1" in the list can never drift apart.
 *
 * Registered as `NearbyFood` / `NearbyEssentials` in `lib/mdx.tsx`'s MDX
 * component map. Group titles render as `<h3>` (the MDX page's own
 * headings are `<h2>`, so this keeps heading order sequential).
 */
import ExternalLink from "@/components/ExternalLink";
import Tag from "@/components/Tag";
import PlacesMap, { type PlaceMapEntry } from "@/components/places/PlacesMap";
import type { Locale } from "@/lib/i18n";
import {
  essentialPlacesLettered,
  foodGroups,
  foodPlacesFlat,
  type NumberedPlace,
  type Place,
} from "@/lib/places";

export type PlacesSectionProps = {
  locale: Locale;
  section: "food" | "essentials";
};

type Copy = {
  mapsLabel: string;
  priceLabel: (price: string) => string;
  mapHeading: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    mapsLabel: "Open in Google Maps",
    priceLabel: (price) => `Price range: ${price}`,
    mapHeading: "Map of the places listed below",
  },
  th: {
    mapsLabel: "เปิดใน Google Maps",
    priceLabel: (price) => `ช่วงราคา: ${price}`,
    mapHeading: "แผนที่แสดงตำแหน่งของสถานที่ในรายการด้านล่าง",
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
  if (locale === "en" && place.nameLocal) {
    return `${place.name.en} (${place.nameLocal})`;
  }
  return place.name[locale];
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
}: {
  place: Place;
  label: string;
  variant: "brand" | "forest";
  locale: Locale;
}) {
  const t = copy[locale];
  return (
    <li id={`place-${place.id}`} className="flex scroll-mt-24 items-start gap-3">
      <PlaceChip label={label} variant={variant} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-ink font-semibold">{displayName(locale, place)}</p>
          {place.price ? (
            <Tag variant="neutral" aria-label={t.priceLabel(place.price)}>
              {place.price}
            </Tag>
          ) : null}
        </div>
        <p className="text-muted text-sm">{place.note[locale]}</p>
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

function FoodSection({ locale }: { locale: Locale }) {
  const numbered = foodPlacesFlat();
  const labelByPlaceId = new Map(numbered.map((entry) => [entry.place.id, entry.label]));
  const mapEntries: PlaceMapEntry[] = numbered.map(({ place, label }) => ({ place, label }));
  const t = copy[locale];
  const mapHeadingId = "places-food-map-label";

  let runningIndex = 0;

  return (
    <div className="flex flex-col gap-8">
      <p id={mapHeadingId} className="sr-only">
        {t.mapHeading}
      </p>
      <PlacesMap
        places={mapEntries}
        zoom={16}
        markerVariant="brand"
        locale={locale}
        labelledBy={mapHeadingId}
      />
      {foodGroups.map((group) => {
        const startIndex = runningIndex + 1;
        runningIndex += group.places.length;
        return (
          <div key={group.id} className="flex flex-col gap-3">
            <h3 className="font-display text-lg">{group.title[locale]}</h3>
            {group.blurb ? <p className="text-muted text-sm">{group.blurb[locale]}</p> : null}
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
                />
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}

function EssentialsSection({ locale }: { locale: Locale }) {
  const lettered: NumberedPlace[] = essentialPlacesLettered();
  const mapEntries: PlaceMapEntry[] = lettered.map(({ place, label }) => ({ place, label }));
  const t = copy[locale];
  const mapHeadingId = "places-essentials-map-label";

  return (
    <div className="flex flex-col gap-6">
      <p id={mapHeadingId} className="sr-only">
        {t.mapHeading}
      </p>
      <PlacesMap
        places={mapEntries}
        zoom={16}
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
          />
        ))}
      </ol>
    </div>
  );
}

export default function PlacesSection({ locale, section }: PlacesSectionProps) {
  return section === "food" ? (
    <FoodSection locale={locale} />
  ) : (
    <EssentialsSection locale={locale} />
  );
}
