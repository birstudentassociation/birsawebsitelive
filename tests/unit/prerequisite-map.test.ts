import { describe, expect, it } from "vitest";
import { CURRENT_VERSION, prerequisites, unlocks } from "@/lib/courses/graph";
import { mapStatuses } from "@/lib/courses/mapStatus";
import { MAP_GEOMETRY, buildPrerequisiteMap, mapLists } from "@/lib/courses/prerequisiteMap";
import type { StudyPlan } from "@/lib/study-plan/plan";

const layout = buildPrerequisiteMap(CURRENT_VERSION);
const node = (code: string) => layout.nodes.find((n) => n.code === code)!;

describe("buildPrerequisiteMap", () => {
  it("is deterministic: the same curriculum always gives the same picture", () => {
    expect(buildPrerequisiteMap(CURRENT_VERSION)).toEqual(layout);
    expect(JSON.stringify(buildPrerequisiteMap(CURRENT_VERSION))).toBe(JSON.stringify(layout));
  });

  it("draws only courses that take part in a prerequisite relationship", () => {
    for (const n of layout.nodes) {
      expect(
        prerequisites(n.code, CURRENT_VERSION).length + unlocks(n.code, CURRENT_VERSION).length
      ).toBeGreaterThan(0);
    }
    expect(layout.nodes.map((n) => n.code)).toEqual(expect.arrayContaining(["PI271", "PI280"]));
  });

  it("puts a course one column after its deepest prerequisite", () => {
    expect(node("PI271").layer).toBe(0);
    expect(node("PI280").layer).toBe(1);
    expect(node("PI364").layer).toBe(2);
    for (const edge of layout.edges) {
      expect(node(edge.to).layer, `${edge.from} to ${edge.to}`).toBeGreaterThan(
        node(edge.from).layer
      );
    }
  });

  it("has one edge per prerequisite relationship, drawn from the right of one node to the left of the next", () => {
    const relationships = layout.nodes.reduce((n, c) => n + c.unlocks.length, 0);
    expect(layout.edges).toHaveLength(relationships);
    const edge = layout.edges.find((e) => e.from === "PI271" && e.to === "PI280")!;
    expect(edge.x1).toBe(node("PI271").x + MAP_GEOMETRY.nodeWidth);
    expect(edge.x2).toBe(node("PI280").x);
  });

  it("never overlaps two nodes and stays inside its own box", () => {
    for (const a of layout.nodes) {
      expect(a.x).toBeGreaterThanOrEqual(0);
      expect(a.y).toBeGreaterThanOrEqual(0);
      expect(a.x + MAP_GEOMETRY.nodeWidth).toBeLessThanOrEqual(layout.width);
      expect(a.y + MAP_GEOMETRY.nodeHeight).toBeLessThanOrEqual(layout.height);
      for (const b of layout.nodes) {
        if (a === b || a.x !== b.x) continue;
        expect(Math.abs(a.y - b.y)).toBeGreaterThanOrEqual(MAP_GEOMETRY.nodeHeight);
      }
    }
  });

  it("orders each column by track and then code", () => {
    const column = layout.nodes.filter((n) => n.layer === 1).map((n) => n.code);
    expect(column).toEqual([...column].sort((a, b) => a.localeCompare(b)));
  });

  it("lists the tracks that appear, for the legend", () => {
    expect(layout.tracks).toEqual(["foundational", "international-relations"]);
  });

  it("lays out an earlier curriculum the same way", () => {
    const earlier = buildPrerequisiteMap("2564");
    expect(earlier.nodes.length).toBeGreaterThan(0);
    expect(earlier.layers).toBe(3);
    expect(buildPrerequisiteMap("2564")).toEqual(earlier);
  });
});

describe("mapLists, the no-JavaScript and screen reader version", () => {
  const lists = mapLists(layout);

  it("says what each course unlocks, once per relationship", () => {
    const pi271 = lists.find((l) => l.code === "PI271")!;
    expect(pi271.unlocks.map((u) => u.code)).toEqual(["PI280", "PI390"]);
    const pi280 = lists.find((l) => l.code === "PI280")!;
    expect(pi280.unlocks.length).toBe(unlocks("PI280", CURRENT_VERSION).length);
    expect(lists.reduce((n, l) => n + l.unlocks.length, 0)).toBe(layout.edges.length);
  });

  it("lists only courses that unlock something, each with a title", () => {
    for (const item of lists) {
      expect(item.unlocks.length).toBeGreaterThan(0);
      expect(item.title.length).toBeGreaterThan(0);
    }
  });
});

describe("mapStatuses", () => {
  // September 2024 is semester 1 of 2567: a cohort 66 student is in year 2 semester 1.
  const now = new Date("2024-09-01T12:00:00+07:00");
  const plan: StudyPlan = {
    versionId: "2568",
    cohort: "66",
    startYear: 2566,
    minorId: "governance",
    passed: ["PI211", "PI271"],
    freeElectiveCreditsPassed: 0,
    terms: [{ term: { year: 3, kind: "semester1" }, codes: ["PI300"], freeElectiveCredits: 0 }],
  };
  const codes = layout.nodes.map((n) => n.code);

  it("marks passed, planned, available next term and locked", () => {
    const status = mapStatuses(plan, codes, now);
    expect(status["PI211"]).toBe("passed");
    expect(status["PI300"]).toBe("planned");
    // PI271 is passed, so PI280 can be taken next term; PI364 needs PI280.
    expect(status["PI280"]).toBe("available");
    expect(status["PI364"]).toBe("locked");
  });

  it("gives every node exactly one status", () => {
    const status = mapStatuses(plan, codes, now);
    expect(Object.keys(status).sort()).toEqual([...codes].sort());
  });

  it("says so for a course the student's curriculum has no counterpart for", () => {
    const old: StudyPlan = { ...plan, versionId: "2564", cohort: "64", startYear: 2564 };
    const status = mapStatuses(old, ["PI211", "ZZ999"], now);
    expect(status["ZZ999"]).toBe("notInCurriculum");
    expect(status["PI211"]).toBe("passed");
  });
});
