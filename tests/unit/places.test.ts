import { describe, expect, it } from "vitest";
import {
  computeMapView,
  essentialPlaces,
  essentialPlacesLettered,
  foodGroups,
  foodPlacesFlat,
  lonLatToTile,
  markerPosition,
  type Place,
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

const allPlaces: Place[] = [...foodGroups.flatMap((group) => group.places), ...essentialPlaces];

describe("computeMapView", () => {
  it("throws for an empty place list", () => {
    expect(() => computeMapView([], 16)).toThrow();
  });

  it("covers every place's floored tile within the returned integer range, for each section", () => {
    for (const places of [foodGroups.flatMap((g) => g.places), essentialPlaces]) {
      const view = computeMapView(places, 16);
      for (const place of places) {
        const { x, y } = lonLatToTile(place.lng, place.lat, 16);
        expect(Math.floor(x)).toBeGreaterThanOrEqual(view.minX);
        expect(Math.floor(x)).toBeLessThanOrEqual(view.maxX);
        expect(Math.floor(y)).toBeGreaterThanOrEqual(view.minY);
        expect(Math.floor(y)).toBeLessThanOrEqual(view.maxY);
      }
    }
  });

  it("returns cols/rows consistent with the min/max tile range", () => {
    const view = computeMapView(essentialPlaces, 16);
    expect(view.cols).toBe(view.maxX - view.minX + 1);
    expect(view.rows).toBe(view.maxY - view.minY + 1);
    expect(view.cols).toBeGreaterThan(0);
    expect(view.rows).toBeGreaterThan(0);
  });

  it("expands the view for a wider spread of places (more padding needed produces a >= view)", () => {
    const single = computeMapView([allPlaces[0]!], 16);
    const many = computeMapView(allPlaces, 16);
    expect(many.cols * many.rows).toBeGreaterThanOrEqual(single.cols * single.rows);
  });
});

describe("markerPosition", () => {
  it("returns a 0-100 percentage position for every food place within the food map view", () => {
    const places = foodGroups.flatMap((g) => g.places);
    const view = computeMapView(places, 16);
    for (const place of places) {
      const { leftPct, topPct } = markerPosition(place, view);
      expect(leftPct).toBeGreaterThanOrEqual(0);
      expect(leftPct).toBeLessThanOrEqual(100);
      expect(topPct).toBeGreaterThanOrEqual(0);
      expect(topPct).toBeLessThanOrEqual(100);
    }
  });

  it("returns a 0-100 percentage position for every essential place within the essentials map view", () => {
    const view = computeMapView(essentialPlaces, 16);
    for (const place of essentialPlaces) {
      const { leftPct, topPct } = markerPosition(place, view);
      expect(leftPct).toBeGreaterThanOrEqual(0);
      expect(leftPct).toBeLessThanOrEqual(100);
      expect(topPct).toBeGreaterThanOrEqual(0);
      expect(topPct).toBeLessThanOrEqual(100);
    }
  });
});

describe("place data integrity", () => {
  it("has a unique id across every food place and essential place", () => {
    const ids = allPlaces.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has a unique id across every food group", () => {
    const ids = foodGroups.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has non-empty en and th text for every place's name and note", () => {
    for (const place of allPlaces) {
      expect(place.name.en.trim().length).toBeGreaterThan(0);
      expect(place.name.th.trim().length).toBeGreaterThan(0);
      expect(place.note.en.trim().length).toBeGreaterThan(0);
      expect(place.note.th.trim().length).toBeGreaterThan(0);
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

  it("essentialPlacesLettered has one entry per essential place, lettered A, B, C...", () => {
    const lettered = essentialPlacesLettered();
    expect(lettered.length).toBe(essentialPlaces.length);
    expect(lettered.map((entry) => entry.label)).toEqual(
      Array.from({ length: essentialPlaces.length }, (_, i) => String.fromCharCode(65 + i))
    );
  });
});
