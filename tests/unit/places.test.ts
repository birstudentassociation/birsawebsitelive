import { describe, expect, it } from "vitest";
import {
  computeMapView,
  fitZoom,
  foodGroups,
  foodPlacesFlat,
  housingPlaces,
  housingPlacesLettered,
  lonLatToTile,
  markerPosition,
  type Place,
  type PlaceArea,
} from "@/lib/places";

describe("lonLatToTile", () => {
  it("places lng 0 / lat 0 at the centre tile fraction (x=0.5, y=0.5) at zoom 0", () => {
    const { x, y } = lonLatToTile(0, 0, 0);
    expect(x).toBeCloseTo(0.5);
    expect(y).toBeCloseTo(0.5);
  });

  it("doubles the tile index at zoom 1", () => {
    const { x, y } = lonLatToTile(0, 0, 1);
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(1);
  });

  it("puts the western edge (lng -180) at x=0", () => {
    const { x } = lonLatToTile(-180, 0, 4);
    expect(x).toBeCloseTo(0);
  });

  it("puts the eastern edge (lng 180) at x = 2^zoom", () => {
    const { x } = lonLatToTile(180, 0, 4);
    expect(x).toBeCloseTo(16);
  });
});

const foodPlacesAll: Place[] = foodGroups.flatMap((group) => group.places);
const allPlaces: Place[] = [...foodPlacesAll, ...housingPlaces];

const AREAS: PlaceArea[] = ["oldtown", "pinklao"];

function placesByArea(area: PlaceArea): Place[] {
  return foodPlacesAll.filter((place) => place.area === area);
}

describe("computeMapView", () => {
  it("throws for an empty place list", () => {
    expect(() => computeMapView([], 16)).toThrow();
  });

  it("covers every place's floored tile within the returned integer range, for each section", () => {
    for (const places of [foodPlacesAll, housingPlaces]) {
      const view = computeMapView(places, 16);
      for (const place of places) {
        const { x, y } = lonLatToTile(place.lng, place.lat, 16);
        expect(Math.floor(x)).toBeGreaterThanOrEqual(view.tileMinX);
        expect(Math.floor(x)).toBeLessThanOrEqual(view.tileMaxX);
        expect(Math.floor(y)).toBeGreaterThanOrEqual(view.tileMinY);
        expect(Math.floor(y)).toBeLessThanOrEqual(view.tileMaxY);
      }
    }
  });

  it("returns cols/rows consistent with the fractional frame bounds", () => {
    const view = computeMapView(housingPlaces, 16);
    expect(view.cols).toBeCloseTo(view.maxX - view.minX);
    expect(view.rows).toBeCloseTo(view.maxY - view.minY);
    expect(view.cols).toBeGreaterThan(0);
    expect(view.rows).toBeGreaterThan(0);
  });

  it("returns a tile range that covers the frame without falling short of it", () => {
    for (const places of [...AREAS.map(placesByArea), housingPlaces]) {
      const view = computeMapView(places, 16);
      expect(view.tileMinX).toBeLessThanOrEqual(view.minX);
      expect(view.tileMinY).toBeLessThanOrEqual(view.minY);
      expect(view.tileMaxX + 1).toBeGreaterThanOrEqual(view.maxX);
      expect(view.tileMaxY + 1).toBeGreaterThanOrEqual(view.maxY);
      expect(view.tileCols).toBe(view.tileMaxX - view.tileMinX + 1);
      expect(view.tileRows).toBe(view.tileMaxY - view.tileMinY + 1);
    }
  });

  it("crops the frame to the places themselves: padding only, no rounding out to whole tiles", () => {
    const padding = 0.1;
    for (const places of [...AREAS.map(placesByArea), housingPlaces]) {
      const view = computeMapView(places, 16, padding);
      const tiles = places.map((place) => lonLatToTile(place.lng, place.lat, 16));
      const spanX = Math.max(...tiles.map((t) => t.x)) - Math.min(...tiles.map((t) => t.x));
      const spanY = Math.max(...tiles.map((t) => t.y)) - Math.min(...tiles.map((t) => t.y));
      // The aspect clamp may widen one axis, so only the axis that was not
      // widened is guaranteed to be exactly span + 2 * padding.
      expect(view.cols).toBeGreaterThanOrEqual(spanX + 2 * padding - 1e-9);
      expect(view.rows).toBeGreaterThanOrEqual(spanY + 2 * padding - 1e-9);
      expect(Math.min(view.cols - spanX, view.rows - spanY)).toBeCloseTo(2 * padding);
    }
  });

  it("widens the short axis of a lopsided set rather than rendering a sliver", () => {
    // Four places strung along one road: a tall, thin bounding box.
    const strip: Place[] = [13.75, 13.76, 13.77, 13.78].map((lat, i) => ({
      ...housingPlaces[0]!,
      id: `strip-${i}`,
      lat,
      lng: 100.48,
    }));
    const view = computeMapView(strip, 16);
    expect(view.cols / view.rows).toBeCloseTo(0.75);
  });

  it("expands the view for a wider spread of places (more padding needed produces a >= view)", () => {
    const single = computeMapView([allPlaces[0]!], 16);
    const many = computeMapView(allPlaces, 16);
    expect(many.cols * many.rows).toBeGreaterThanOrEqual(single.cols * single.rows);
  });
});

describe("markerPosition", () => {
  it("returns a 0-100 percentage position for every food place within its own area's map view", () => {
    // Mirrors what PlacesSection actually renders: one map per area, sized
    // with fitZoom, containing only that area's places.
    for (const area of AREAS) {
      const places = placesByArea(area);
      const zoom = fitZoom(places, { maxRows: 10 });
      const view = computeMapView(places, zoom);
      for (const place of places) {
        const { leftPct, topPct } = markerPosition(place, view);
        expect(leftPct).toBeGreaterThanOrEqual(0);
        expect(leftPct).toBeLessThanOrEqual(100);
        expect(topPct).toBeGreaterThanOrEqual(0);
        expect(topPct).toBeLessThanOrEqual(100);
      }
    }
  });

  it("returns a 0-100 percentage position for every housing place within the housing map view", () => {
    const zoom = fitZoom(housingPlaces);
    const view = computeMapView(housingPlaces, zoom);
    for (const place of housingPlaces) {
      const { leftPct, topPct } = markerPosition(place, view);
      expect(leftPct).toBeGreaterThanOrEqual(0);
      expect(leftPct).toBeLessThanOrEqual(100);
      expect(topPct).toBeGreaterThanOrEqual(0);
      expect(topPct).toBeLessThanOrEqual(100);
    }
  });
});

describe("fitZoom", () => {
  it("returns an integer zoom within [minZoom, maxZoom]", () => {
    for (const places of [...AREAS.map(placesByArea), housingPlaces]) {
      const zoom = fitZoom(places);
      expect(Number.isInteger(zoom)).toBe(true);
      expect(zoom).toBeGreaterThanOrEqual(12);
      expect(zoom).toBeLessThanOrEqual(17);
    }
  });

  it("respects the default maxCols/maxRows tile budget for each food area and for housing", () => {
    for (const places of [...AREAS.map(placesByArea), housingPlaces]) {
      const zoom = fitZoom(places);
      const view = computeMapView(places, zoom);
      expect(view.tileCols).toBeLessThanOrEqual(7);
      expect(view.tileRows).toBeLessThanOrEqual(9);
    }
  });

  it("returns maxZoom for a single place (a tiny bounding box always fits)", () => {
    const zoom = fitZoom([allPlaces[0]!]);
    expect(zoom).toBe(17);
  });

  it("honours custom maxCols/maxRows/minZoom/maxZoom options", () => {
    const zoom = fitZoom(housingPlaces, { maxCols: 100, maxRows: 100, minZoom: 10, maxZoom: 15 });
    expect(zoom).toBe(15);
  });
});

describe("place data integrity", () => {
  it("has a unique id across every food place and housing place", () => {
    const ids = allPlaces.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has a unique id across every food group", () => {
    const ids = foodGroups.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has non-empty en and th text for every place's name and category", () => {
    for (const place of allPlaces) {
      expect(place.name.en.trim().length).toBeGreaterThan(0);
      expect(place.name.th.trim().length).toBeGreaterThan(0);
      expect(place.category.en.trim().length).toBeGreaterThan(0);
      expect(place.category.th.trim().length).toBeGreaterThan(0);
    }
  });

  it("has non-empty en and th text for every place's note, when present", () => {
    for (const place of allPlaces) {
      if (place.note) {
        expect(place.note.en.trim().length).toBeGreaterThan(0);
        expect(place.note.th.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("has non-empty en and th text for every group's title", () => {
    for (const group of foodGroups) {
      expect(group.title.en.trim().length).toBeGreaterThan(0);
      expect(group.title.th.trim().length).toBeGreaterThan(0);
    }
  });

  it("has plausible Bangkok-area coordinates for every place", () => {
    for (const place of allPlaces) {
      expect(place.lat).toBeGreaterThan(13.7);
      expect(place.lat).toBeLessThan(13.8);
      expect(place.lng).toBeGreaterThan(100.4);
      expect(place.lng).toBeLessThan(100.55);
    }
  });

  it("has a valid area on every place", () => {
    for (const place of allPlaces) {
      expect(AREAS).toContain(place.area);
    }
  });
});

describe("ratings", () => {
  it("every rating is between 1 and 5, every ratingCount is a positive integer", () => {
    for (const place of allPlaces) {
      if (place.rating !== undefined) {
        expect(place.rating).toBeGreaterThanOrEqual(1);
        expect(place.rating).toBeLessThanOrEqual(5);
      }
      if (place.ratingCount !== undefined) {
        expect(Number.isInteger(place.ratingCount)).toBe(true);
        expect(place.ratingCount).toBeGreaterThan(0);
      }
    }
  });
});

describe("global numbering helpers", () => {
  it("foodPlacesFlat has one entry per food place, numbered 1..n in order", () => {
    const flat = foodPlacesFlat();
    const totalFoodPlaces = foodGroups.reduce((sum, g) => sum + g.places.length, 0);
    expect(flat.length).toBe(totalFoodPlaces);
    expect(flat.map((entry) => entry.label)).toEqual(
      Array.from({ length: totalFoodPlaces }, (_, i) => String(i + 1))
    );
  });

  it("foodPlacesFlat stays in group order, then place order within each group", () => {
    const flat = foodPlacesFlat();
    const expectedIds = foodGroups.flatMap((g) => g.places.map((p) => p.id));
    expect(flat.map((entry) => entry.place.id)).toEqual(expectedIds);
  });

  it("housingPlacesLettered has one entry per housing place, lettered A..P for 16 entries", () => {
    const lettered = housingPlacesLettered();
    expect(housingPlaces.length).toBe(16);
    expect(lettered.length).toBe(housingPlaces.length);
    expect(lettered.map((entry) => entry.label)).toEqual(
      Array.from({ length: housingPlaces.length }, (_, i) => String.fromCharCode(65 + i))
    );
    expect(lettered.map((entry) => entry.label)[0]).toBe("A");
    expect(lettered.map((entry) => entry.label).at(-1)).toBe("P");
  });
});
