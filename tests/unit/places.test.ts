import { describe, expect, it } from "vitest";
import {
  computeMapView,
  fitZoom,
  foodGroups,
  foodPlacesFlat,
  housingPlaces,
  housingPlacesLettered,
  layoutMarkers,
  lonLatToTile,
  MAP_LAYOUT_WIDTH,
  markerPosition,
  MARKER_SIZE,
  type MapView,
  type MarkerLayout,
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

describe("layoutMarkers", () => {
  const GAP = 2;
  const FOCUS_RING = 5;
  const DOT_CLEARANCE = 4;
  const MIN_SEPARATION = MARKER_SIZE + GAP;
  const INSET = MARKER_SIZE / 2 + FOCUS_RING;
  const DOT_RADIUS = MARKER_SIZE / 2 + DOT_CLEARANCE;

  /** The three real place sets a places map is ever laid out for, by name. */
  function foodByArea(area: PlaceArea): Place[] {
    return foodPlacesFlat()
      .filter((entry) => entry.place.area === area)
      .map((entry) => entry.place);
  }
  const realSets: Record<string, Place[]> = {
    "old-town food": foodByArea("oldtown"),
    "pinklao food": foodByArea("pinklao"),
    housing: housingPlaces,
  };

  /** `computeMapView` at the zoom PlacesSection actually picks for `places`/`kind`. */
  function viewFor(places: Place[], kind: "food" | "housing"): ReturnType<typeof computeMapView> {
    const zoom = kind === "food" ? fitZoom(places, { maxRows: 10 }) : fitZoom(places);
    return computeMapView(places, zoom);
  }

  /** Marker centre in CSS px within a `mapWidth`-wide frame for `view`. */
  function markerPx(
    layout: MarkerLayout,
    view: ReturnType<typeof computeMapView>,
    mapWidth: number
  ): { x: number; y: number } {
    const mapHeight = (mapWidth * view.rows) / view.cols;
    return {
      x: (layout.marker.leftPct / 100) * mapWidth,
      y: (layout.marker.topPct / 100) * mapHeight,
    };
  }

  /** Axe's own rectangle-overlap check: clear on the x axis or the y axis is enough. */
  function assertAllPairsClear(
    layouts: MarkerLayout[],
    view: ReturnType<typeof computeMapView>,
    mapWidth: number
  ) {
    const points = layouts.map((layout) => markerPx(layout, view, mapWidth));
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = Math.abs(points[i]!.x - points[j]!.x);
        const dy = Math.abs(points[i]!.y - points[j]!.y);
        expect(
          dx >= MIN_SEPARATION || dy >= MIN_SEPARATION,
          `markers ${i} (${layouts[i]!.place.id}) and ${j} (${layouts[j]!.place.id}) overlap: dx=${dx}, dy=${dy}`
        ).toBe(true);
      }
    }
  }

  it("leaves sparse markers on their anchor, undisplaced", () => {
    // Two places far enough apart, at any sane zoom, that they can never
    // collide: opposite corners of the plausible Bangkok bounding box.
    const sparse: Place[] = [
      { ...housingPlaces[0]!, id: "sparse-a", lat: 13.71, lng: 100.41 },
      { ...housingPlaces[0]!, id: "sparse-b", lat: 13.79, lng: 100.54 },
    ];
    const view = computeMapView(sparse, 12);
    const layouts = layoutMarkers(sparse, view);

    for (const layout of layouts) {
      expect(layout.displaced).toBe(false);
      expect(layout.marker).toEqual(layout.anchor);
    }
  });

  it("clears every pair of every real place set at MAP_LAYOUT_WIDTH", () => {
    // This is the actual regression case: 46 markers on the old-town food
    // map, many of them genuine next-door neighbours, laid out exactly the
    // way PlacesSection builds each map. Pinklao and housing are the sets
    // where the frame-edge clamp below actually bites, so a fresh edge
    // collision the clamp might introduce would show up here too.
    for (const [name, places] of Object.entries(realSets)) {
      const kind = name === "housing" ? "housing" : "food";
      const view = viewFor(places, kind);
      const layouts = layoutMarkers(places, view);
      assertAllPairsClear(layouts, view, MAP_LAYOUT_WIDTH);
    }
  });

  it("keeps every marker's centre clear of the frame edge by markerSize/2 + focusRing", () => {
    // The map frame sits in an overflow-x-auto container, and one non-visible
    // overflow axis makes the other compute to auto too, so a marker that
    // hugs the edge risks its focus ring (3px outline, 2px offset) getting
    // clipped: WCAG 2.2 SC 2.4.11. Every marker needs this clearance, not
    // just the ones displaced for a neighbour collision.
    for (const [name, places] of Object.entries(realSets)) {
      const kind = name === "housing" ? "housing" : "food";
      const view = viewFor(places, kind);
      const mapWidth = MAP_LAYOUT_WIDTH;
      const mapHeight = (mapWidth * view.rows) / view.cols;
      const layouts = layoutMarkers(places, view, { mapWidth });

      for (const layout of layouts) {
        const { x, y } = markerPx(layout, view, mapWidth);
        expect(x, `${name}: ${layout.place.id} x=${x}`).toBeGreaterThanOrEqual(INSET - 1e-6);
        expect(x, `${name}: ${layout.place.id} x=${x}`).toBeLessThanOrEqual(
          mapWidth - INSET + 1e-6
        );
        expect(y, `${name}: ${layout.place.id} y=${y}`).toBeGreaterThanOrEqual(INSET - 1e-6);
        expect(y, `${name}: ${layout.place.id} y=${y}`).toBeLessThanOrEqual(
          mapHeight - INSET + 1e-6
        );
      }
    }
  });

  it("clamps a corner anchor inward and marks it displaced", () => {
    // A place sitting right in the frame's corner: markerPosition would put
    // it at (0%, 0%), well inside the focus-ring inset from both edges.
    const corner: Place = { ...housingPlaces[0]!, id: "corner-place" };
    const others = housingPlaces.slice(1, 4);
    const places = [corner, ...others];
    // Force a view whose frame starts exactly at the corner place's tile
    // position, so markerPosition puts it at (0, 0) in pixel space.
    const view = computeMapView(places, 16);
    const cornerTile = lonLatToTile(corner.lng, corner.lat, 16);
    const cornerView: MapView = {
      ...view,
      minX: cornerTile.x,
      minY: cornerTile.y,
      maxX: cornerTile.x + view.cols,
      maxY: cornerTile.y + view.rows,
    };

    const layouts = layoutMarkers(places, cornerView);
    const cornerLayout = layouts.find((layout) => layout.place.id === "corner-place")!;

    expect(cornerLayout.anchor.leftPct).toBeCloseTo(0);
    expect(cornerLayout.anchor.topPct).toBeCloseTo(0);
    expect(cornerLayout.displaced).toBe(true);
    expect(cornerLayout.marker).not.toEqual(cornerLayout.anchor);

    const { x, y } = markerPx(cornerLayout, cornerView, MAP_LAYOUT_WIDTH);
    expect(x).toBeGreaterThanOrEqual(INSET - 1e-6);
    expect(y).toBeGreaterThanOrEqual(INSET - 1e-6);
  });

  it("is deterministic: the same input produces deep-equal output every time", () => {
    const oldtown = foodPlacesFlat()
      .filter((entry) => entry.place.area === "oldtown")
      .map((entry) => entry.place);
    const zoom = fitZoom(oldtown, { maxRows: 10 });
    const view = computeMapView(oldtown, zoom);

    const first = layoutMarkers(oldtown, view);
    const second = layoutMarkers(oldtown, view);
    expect(second).toEqual(first);
  });

  it("returns exactly one entry per input place, in input order", () => {
    const oldtown = foodPlacesFlat()
      .filter((entry) => entry.place.area === "oldtown")
      .map((entry) => entry.place);
    const zoom = fitZoom(oldtown, { maxRows: 10 });
    const view = computeMapView(oldtown, zoom);
    const layouts = layoutMarkers(oldtown, view);

    expect(layouts.map((layout) => layout.place.id)).toEqual(oldtown.map((place) => place.id));
  });

  it("keeps every marker's disc clear of every other place's anchor dot (C2)", () => {
    // The "pointers still covered up" bug: a displaced marker landing on
    // top of some *other* place's anchor dot, hiding it. Checked against
    // every anchor, not only the anchors of displaced places, per the spec.
    for (const [name, places] of Object.entries(realSets)) {
      const kind = name === "housing" ? "housing" : "food";
      const view = viewFor(places, kind);
      const mapWidth = MAP_LAYOUT_WIDTH;
      const layouts = layoutMarkers(places, view);
      const anchorPx = (layout: MarkerLayout) =>
        markerPx({ ...layout, marker: layout.anchor }, view, mapWidth);

      for (let i = 0; i < layouts.length; i++) {
        const marker = markerPx(layouts[i]!, view, mapWidth);
        for (let j = 0; j < layouts.length; j++) {
          if (i === j) continue;
          const anchor = anchorPx(layouts[j]!);
          const dist = Math.hypot(marker.x - anchor.x, marker.y - anchor.y);
          expect(
            dist,
            `${name}: marker ${i} (${layouts[i]!.place.id}) covers anchor ${j} (${layouts[j]!.place.id})'s dot: dist=${dist}`
          ).toBeGreaterThanOrEqual(DOT_RADIUS - 1e-6);
        }
      }
    }
  });

  /**
   * Builds `n` places arranged in a tight ring (radius `spreadDeg`, in
   * degrees) around `housingPlaces[0]`'s coordinates, plus one far-off
   * singleton at `farAngle` degrees to pull the cluster's outward direction
   * away from due east (the degenerate case when a cluster is the only
   * group on the map: its own centroid coincides with the overall one).
   * `n`/`spreadDeg`/`farDeg`/`farAngle` below are chosen, by search, so the
   * rosette formula alone clears every adjacent pair — no marker in the
   * cluster needs the repair pass — which is what makes this fixture usable
   * for an exact (not just "displaced") geometry assertion.
   */
  function tightCluster(
    n: number,
    spreadDeg: number,
    farDeg: number,
    farAngle: number
  ): { places: Place[]; clusterIds: string[] } {
    const base = housingPlaces[0]!;
    const cluster: Place[] = Array.from({ length: n }, (_, i) => {
      const angle = (2 * Math.PI * i) / n;
      return {
        ...base,
        id: `cluster-${i}`,
        lat: base.lat + spreadDeg * Math.sin(angle),
        lng: base.lng + spreadDeg * Math.cos(angle),
      };
    });
    const farRad = (farAngle * Math.PI) / 180;
    const far: Place = {
      ...base,
      id: "cluster-far",
      lat: base.lat + farDeg * Math.sin(farRad),
      lng: base.lng + farDeg * Math.cos(farRad),
    };
    return { places: [...cluster, far], clusterIds: cluster.map((p) => p.id) };
  }

  it("lays a tight cluster out on a single circle around its own centroid", () => {
    const { places, clusterIds } = tightCluster(5, 0.00025, 0.005, 75);
    const view = computeMapView(places, 14);
    const mapWidth = MAP_LAYOUT_WIDTH;
    const layouts = layoutMarkers(places, view);
    const clusterLayouts = clusterIds.map((id) => layouts.find((l) => l.place.id === id)!);

    // Every member should have been moved off its own anchor onto the ring.
    for (const layout of clusterLayouts) {
      expect(layout.displaced).toBe(true);
    }

    const anchorCentroid = {
      x:
        clusterLayouts.reduce(
          (sum, l) => sum + markerPx({ ...l, marker: l.anchor }, view, mapWidth).x,
          0
        ) / clusterLayouts.length,
      y:
        clusterLayouts.reduce(
          (sum, l) => sum + markerPx({ ...l, marker: l.anchor }, view, mapWidth).y,
          0
        ) / clusterLayouts.length,
    };
    const dists = clusterLayouts.map((l) => {
      const mp = markerPx(l, view, mapWidth);
      return Math.hypot(mp.x - anchorCentroid.x, mp.y - anchorCentroid.y);
    });

    for (const dist of dists) {
      expect(dist).toBeCloseTo(dists[0]!, 3);
    }
  });

  it("orders rosette slots to match anchor angular order, so leader lines don't cross", () => {
    const { places, clusterIds } = tightCluster(5, 0.00025, 0.005, 75);
    const view = computeMapView(places, 14);
    const mapWidth = MAP_LAYOUT_WIDTH;
    const layouts = layoutMarkers(places, view);
    const clusterLayouts = clusterIds.map((id) => layouts.find((l) => l.place.id === id)!);

    const anchorCentroid = {
      x:
        clusterLayouts.reduce(
          (sum, l) => sum + markerPx({ ...l, marker: l.anchor }, view, mapWidth).x,
          0
        ) / clusterLayouts.length,
      y:
        clusterLayouts.reduce(
          (sum, l) => sum + markerPx({ ...l, marker: l.anchor }, view, mapWidth).y,
          0
        ) / clusterLayouts.length,
    };
    const angleAround = (p: { x: number; y: number }) =>
      Math.atan2(p.y - anchorCentroid.y, p.x - anchorCentroid.x);
    // Normalise into [0, 2*PI) so ties/wraparound sort the same way on both sides.
    const normalise = (a: number) => ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    const byAnchorAngle = [...clusterLayouts].sort(
      (a, b) =>
        normalise(angleAround(markerPx({ ...a, marker: a.anchor }, view, mapWidth))) -
        normalise(angleAround(markerPx({ ...b, marker: b.anchor }, view, mapWidth)))
    );
    const byMarkerAngle = [...clusterLayouts].sort(
      (a, b) =>
        normalise(angleAround(markerPx(a, view, mapWidth))) -
        normalise(angleAround(markerPx(b, view, mapWidth)))
    );

    // Both lists walk the circle in the same (increasing-angle) direction,
    // but "increasing from 0" can start at a different member on each side
    // of the comparison depending on exactly where the 0/2*PI wraparound
    // falls, so compare them as cyclic sequences rather than requiring the
    // same starting element.
    const anchorIds = byAnchorAngle.map((l) => l.place.id);
    const markerIds = byMarkerAngle.map((l) => l.place.id);
    const startIndex = markerIds.indexOf(anchorIds[0]!);
    const rotatedMarkerIds = [...markerIds.slice(startIndex), ...markerIds.slice(0, startIndex)];

    expect(rotatedMarkerIds).toEqual(anchorIds);
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
