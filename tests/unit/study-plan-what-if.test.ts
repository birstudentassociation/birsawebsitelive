import { describe, expect, it } from "vitest";
import { CURRICULUM_VERSIONS, type TermRef } from "@/content/curriculum";
import { checkPlan } from "@/lib/study-plan/findings";
import type { StudyPlan } from "@/lib/study-plan/plan";
import { criticalPath, deferralsOnCriticalPath, laterTerm, whatIf } from "@/lib/study-plan/whatIf";

const version = CURRICULUM_VERSIONS["2564-rev2566"];

const Y2S1: TermRef = { year: 2, kind: "semester1" };
const Y2S2: TermRef = { year: 2, kind: "semester2" };
const Y3S1: TermRef = { year: 3, kind: "semester1" };
const Y3S2: TermRef = { year: 3, kind: "semester2" };

function planWith(
  terms: { term: TermRef; codes: string[]; freeElectiveCredits?: number }[],
  passed: string[] = ["PI211"]
): StudyPlan {
  return {
    versionId: "2564-rev2566",
    cohort: "66",
    startYear: 2566,
    minorId: "governance",
    passed,
    freeElectiveCreditsPassed: 0,
    terms: terms.map((t) => ({ freeElectiveCredits: 0, ...t })),
  };
}

/** PI271, then PI280 and PI300, then the area studies elective PI364 (needs PI280) and PI320, last. */
const base = () =>
  planWith([
    { term: Y2S1, codes: ["PI271"] },
    { term: Y2S2, codes: ["PI280", "PI300"] },
    { term: Y3S1, codes: ["PI364", "PI320"] },
  ]);

describe("laterTerm", () => {
  it("steps a semester to the next semester and a summer to the next summer", () => {
    expect(laterTerm({ year: 2, kind: "semester1" })).toEqual({ year: 2, kind: "semester2" });
    expect(laterTerm({ year: 2, kind: "semester2" })).toEqual({ year: 3, kind: "semester1" });
    expect(laterTerm({ year: 2, kind: "summer" })).toEqual({ year: 3, kind: "summer" });
  });
});

describe("whatIf deferCourse", () => {
  it("pushes a dependent back and moves graduation when the chain ends in the last term", () => {
    const original = base();
    const result = whatIf(version, original, { kind: "deferCourse", code: "PI280" });
    expect(result.applied).toBe(true);
    expect(result.graduationBefore).toEqual(Y3S1);
    expect(result.graduationAfter).toEqual(Y3S2);
    expect(result.graduationMoved).toBe(true);
    expect(result.pushedBack).toEqual([
      { code: "PI280", from: Y2S2, to: Y3S1, reason: "moved" },
      { code: "PI364", from: Y3S1, to: Y3S2, reason: "dependent" },
    ]);
    // The counterfactual is a plan in its own right, and the input is untouched.
    expect(
      result.plan.terms.find((t) => t.term.year === 3 && t.term.kind === "semester2")?.codes
    ).toEqual(["PI364"]);
    expect(original).toEqual(base());
  });

  it("changes nothing else when the course has no dependants and is not in the last term", () => {
    const result = whatIf(version, base(), { kind: "deferCourse", code: "PI300" });
    expect(result.applied).toBe(true);
    expect(result.graduationMoved).toBe(false);
    expect(result.graduationAfter).toEqual(Y3S1);
    expect(result.pushedBack.map((p) => p.code)).toEqual(["PI300"]);
  });

  it("moves graduation when a course in the last term is deferred", () => {
    const result = whatIf(version, base(), { kind: "deferCourse", code: "PI320" });
    expect(result.graduationAfter).toEqual(Y3S2);
  });

  it("does nothing for a course that is not planned", () => {
    const original = base();
    const result = whatIf(version, original, { kind: "deferCourse", code: "PI390" });
    expect(result.applied).toBe(false);
    expect(result.plan).toBe(original);
    expect(result.graduationMoved).toBe(false);
    expect(result.pushedBack).toEqual([]);
  });

  it("leaves a prerequisite that was already broken before the change alone", () => {
    // PI300 is before its prerequisite here; deferring something unrelated must not repair that.
    const broken = planWith(
      [
        { term: Y2S1, codes: ["PI300"] },
        { term: Y2S2, codes: ["PI211"] },
        { term: Y3S1, codes: ["PI390"] },
      ],
      ["PI271"]
    );
    const result = whatIf(version, broken, { kind: "deferCourse", code: "PI390" });
    expect(result.pushedBack.map((p) => p.code)).toEqual(["PI390"]);
    expect(
      result.plan.terms.find((t) => t.term.kind === "semester1" && t.term.year === 2)?.codes
    ).toEqual(["PI300"]);
  });

  it("reports a term the change pushes over its credit limit, and only that one", () => {
    const loaded = planWith([
      { term: Y2S2, codes: ["PI300"] },
      { term: Y3S1, codes: ["PI364", "PI320"], freeElectiveCredits: 15 },
    ]);
    const result = whatIf(version, loaded, { kind: "deferCourse", code: "PI300" });
    expect(result.overloaded).toEqual([{ term: Y3S1, credits: 24, limit: 21 }]);
    // Already over before the change is not "because of" the change.
    const over = planWith([
      { term: Y2S2, codes: ["PI300"] },
      { term: Y3S1, codes: ["PI364", "PI320"], freeElectiveCredits: 20 },
    ]);
    expect(whatIf(version, over, { kind: "deferCourse", code: "PI300" }).overloaded).toEqual([]);
  });
});

describe("whatIf emptyTerm", () => {
  it("moves every course in the term one term later and cascades to dependants", () => {
    const result = whatIf(version, base(), { kind: "emptyTerm", term: Y2S2 });
    expect(result.applied).toBe(true);
    expect(result.pushedBack).toEqual([
      { code: "PI280", from: Y2S2, to: Y3S1, reason: "moved" },
      { code: "PI300", from: Y2S2, to: Y3S1, reason: "moved" },
      { code: "PI364", from: Y3S1, to: Y3S2, reason: "dependent" },
    ]);
    expect(result.graduationAfter).toEqual(Y3S2);
    const emptied = result.plan.terms.find((t) => t.term.year === 2 && t.term.kind === "semester2");
    expect(emptied?.codes).toEqual([]);
  });

  it("carries the term's free elective credits to the next term", () => {
    const withCredits = planWith([{ term: Y2S2, codes: ["PI300"], freeElectiveCredits: 6 }]);
    const result = whatIf(version, withCredits, { kind: "emptyTerm", term: Y2S2 });
    const total = result.plan.terms.reduce((n, t) => n + t.freeElectiveCredits, 0);
    expect(total).toBe(6);
    expect(result.plan.terms.find((t) => t.term.kind === "semester2")?.freeElectiveCredits).toBe(0);
    expect(result.graduationAfter).toEqual(Y3S1);
  });

  it("does nothing for a term that is empty or not in the plan", () => {
    const original = base();
    const missing: TermRef[] = [
      { year: 4, kind: "summer" },
      { year: 2, kind: "summer" },
    ];
    for (const term of missing) {
      const result = whatIf(version, original, { kind: "emptyTerm", term });
      expect(result.applied).toBe(false);
      expect(result.graduationMoved).toBe(false);
    }
  });
});

describe("criticalPath", () => {
  it("marks planned courses on a chain whose deferral moves graduation", () => {
    const critical = criticalPath(version, base());
    expect(critical).toEqual(expect.arrayContaining(["PI271", "PI280", "PI364"]));
  });

  it("does not mark a chain with room to spare, or a course with no chain", () => {
    const critical = criticalPath(version, base());
    // PI211 is passed; PI300 hangs off it with a term to spare.
    expect(critical).not.toContain("PI300");
    const alone = planWith([{ term: Y3S1, codes: ["PI390"] }], []);
    expect(criticalPath(version, alone)).toEqual([]);
  });
});

describe("deferrals already in the plan", () => {
  // The recommended plan has PI280 in year 2 semester 1 and finishes in year 4 semester 1.
  const late = planWith(
    [
      { term: { year: 4, kind: "semester1" }, codes: ["PI280"] },
      { term: { year: 4, kind: "semester2" }, codes: ["PI364"] },
    ],
    ["PI211", "PI271"]
  );

  it("finds a deferred course on the critical path when graduation is later than recommended", () => {
    const found = deferralsOnCriticalPath(version, late);
    expect(found.map((d) => d.code)).toEqual(["PI280"]);
    expect(found[0]).toMatchObject({
      planned: { year: 4, kind: "semester1" },
      recommended: { year: 2, kind: "semester1" },
      graduation: { year: 4, kind: "semester2" },
      recommendedGraduation: { year: 4, kind: "semester1" },
    });
  });

  it("raises a warning finding with a citation", () => {
    const finding = checkPlan(version, late).find((f) => f.id === "deferral:PI280");
    expect(finding?.severity).toBe("warning");
    expect(finding?.message.en).toContain("PI280");
    expect(finding?.message.th).toContain("PI280");
    expect(finding?.source.provision.length).toBeGreaterThan(0);
  });

  it("is quiet when the plan graduates no later than the recommended plan", () => {
    const onTime = planWith(
      [
        { term: Y3S1, codes: ["PI280"] },
        { term: { year: 4, kind: "semester1" }, codes: ["PI364"] },
      ],
      ["PI211", "PI271"]
    );
    expect(deferralsOnCriticalPath(version, onTime)).toEqual([]);
    expect(checkPlan(version, onTime).some((f) => f.id.startsWith("deferral:"))).toBe(false);
  });
});
