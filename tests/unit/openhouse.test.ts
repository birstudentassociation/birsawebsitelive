import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { dayEntries, getCuratedCourses, getLunchDirections, parseState } from "@/lib/openhouse";
import { CAMPUS, RIVER, projector, smoothPath } from "@/lib/openhouse-geo";
import {
  ARRIVE_MODES,
  CURATED_COURSES,
  HOME_ROUTES,
  LUNCH_DIRECTIONS,
} from "@/content/openhouse/copy";
import { CLUBS } from "@/content/openhouse/clubs";

describe("Open House URL state", () => {
  it("keeps valid closed-set choices and normalises the course code", () => {
    expect(
      parseState({ arrive: "ferry", course: "pi280", lunch: "wanglang", club: "tu-mun" })
    ).toEqual({ arrive: "ferry", course: "PI280", lunch: "wanglang", club: "tu-mun" });
  });

  it("drops anything outside the closed sets instead of throwing", () => {
    expect(
      parseState({ arrive: "helicopter", course: "PI999", lunch: "<script>", club: "x" })
    ).toEqual({ arrive: undefined, course: undefined, lunch: undefined, club: undefined });
  });

  it("takes the first value when a parameter is repeated", () => {
    expect(parseState({ arrive: ["bus", "ferry"] }).arrive).toBe("bus");
  });
});

describe("Open House data joins", () => {
  it("resolves every curated course against the real catalogue", () => {
    const resolved = getCuratedCourses();
    expect(resolved.map((c) => c.code)).toEqual(CURATED_COURSES.map((c) => c.code));
    for (const c of resolved) expect(c.title.en && c.title.th).toBeTruthy();
  });

  it("resolves every curated lunch place id in lib/places, so none silently vanish", () => {
    const directions = getLunchDirections();
    for (const d of LUNCH_DIRECTIONS) {
      const resolved = directions.find((r) => r.key === d.key);
      expect(resolved?.places.map((p) => p.id)).toEqual(d.places);
    }
  });

  it("keeps each lunch direction honest about distance from the gate", () => {
    const metres = (p: { lat: number; lng: number }) => {
      const dx = (p.lng - CAMPUS.lng) * 111320 * Math.cos((CAMPUS.lat * Math.PI) / 180);
      const dy = (p.lat - CAMPUS.lat) * 110574;
      return Math.hypot(dx, dy);
    };
    const byKey = Object.fromEntries(getLunchDirections().map((d) => [d.key, d.places]));
    // "A few minutes on foot"
    for (const p of byKey.near ?? []) expect(metres(p)).toBeLessThan(350);
    // "Ten to fifteen minutes each way"
    for (const p of byKey.further ?? []) {
      expect(metres(p)).toBeGreaterThan(500);
      expect(metres(p)).toBeLessThan(1100);
    }
    // Across the river: every Wang Lang place is on the west bank.
    for (const p of byKey.wanglang ?? []) expect(p.lng).toBeLessThan(100.4875);
  });

  it("gives every curated course the years it is usually taken in", () => {
    for (const c of getCuratedCourses()) expect(c.years.length).toBeGreaterThan(0);
  });

  it("has a club entry for exactly the clubs published in both languages", () => {
    const slugs = (lang: string) =>
      fs
        .readdirSync(path.join(process.cwd(), "content", "clubs", lang))
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => f.replace(/\.mdx$/, ""))
        .sort();
    const wall = CLUBS.map((c) => c.slug).sort();
    expect(wall).toEqual(slugs("en"));
    expect(wall).toEqual(slugs("th"));
  });

  it("gives every arrival mode a way home", () => {
    for (const m of ARRIVE_MODES) expect(HOME_ROUTES[m.key]).toBeDefined();
  });
});

describe("the day card entries", () => {
  it("builds a full day in time order, with the way home carried from the way in", () => {
    const entries = dayEntries(
      "en",
      parseState({ arrive: "ferry", course: "PI280", lunch: "wanglang", club: "tu-mun" })
    );
    expect(entries.map((e) => e.time)).toEqual(["08:42", "09:15", "12:07", "16:34", "18:11"]);
    expect(entries[4]?.value).toBe(HOME_ROUTES.ferry?.card.en);
  });

  it("builds a partial day without gaps and an empty day as nothing", () => {
    expect(dayEntries("th", parseState({ club: "birify" })).map((e) => e.time)).toEqual(["16:34"]);
    expect(dayEntries("en", parseState({}))).toEqual([]);
  });
});

describe("the river geometry", () => {
  const box = { x: 10, y: 20, w: 200, h: 600 };
  const project = projector(RIVER, box);

  it("fits the whole course inside the box", () => {
    for (const p of RIVER.map(project)) {
      expect(p.x).toBeGreaterThanOrEqual(box.x - 1e-6);
      expect(p.x).toBeLessThanOrEqual(box.x + box.w + 1e-6);
      expect(p.y).toBeGreaterThanOrEqual(box.y - 1e-6);
      expect(p.y).toBeLessThanOrEqual(box.y + box.h + 1e-6);
    }
  });

  it("puts Thammasat on the east bank, as it is", () => {
    const nearest = RIVER.reduce((a, b) =>
      Math.abs(b.lat - CAMPUS.lat) < Math.abs(a.lat - CAMPUS.lat) ? b : a
    );
    expect(project(CAMPUS).x).toBeGreaterThan(project(nearest).x);
  });

  it("draws one continuous path", () => {
    const d = smoothPath(RIVER.map(project));
    expect(d.startsWith("M")).toBe(true);
    expect(d.match(/C/g)?.length).toBe(RIVER.length - 1);
  });
});
