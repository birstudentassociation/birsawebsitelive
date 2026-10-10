import { describe, expect, it } from "vitest";
import { CURRICULUM_VERSIONS, type TermRef } from "@/content/curriculum";
import { allCourseCodes, counterparts, versionsOf } from "@/lib/courses/graph";
import { derivePlanPanel, suggestTerm } from "@/lib/course-review/planPanel";
import { buildPlanContext } from "@/lib/course-review/planContext";
import type { StudyPlan } from "@/lib/study-plan/plan";

/**
 * September 2024 is semester 1 of academic year 2567. A cohort 66 student is
 * then in study year 2 (2567 - 2566 + 1), a cohort 65 student in year 3.
 */
const now = new Date("2024-09-01T12:00:00+07:00");

function planOf(overrides: Partial<StudyPlan> = {}): StudyPlan {
  return {
    versionId: "2564-rev2566",
    cohort: "66",
    startYear: 2566,
    minorId: "governance",
    passed: [],
    freeElectiveCreditsPassed: 0,
    terms: [],
    ...overrides,
  };
}

const planned = (year: number, kind: TermRef["kind"], codes: string[]) => ({
  term: { year, kind } as TermRef,
  codes,
  freeElectiveCredits: 0,
});

describe("derivePlanPanel: status", () => {
  it("reports a passed course", () => {
    const view = derivePlanPanel("PI300", planOf({ passed: ["PI300"] }), now);
    expect(view.status).toEqual({ kind: "passed" });
    expect(view.suggestedTerm).toBeNull();
  });

  it("reports a planned course with its term, and judges prerequisites against that term", () => {
    const view = derivePlanPanel(
      "PI300",
      planOf({ terms: [planned(3, "semester2", ["PI300"])] }),
      now
    );
    expect(view.status).toEqual({ kind: "planned", term: { year: 3, kind: "semester2" } });
    expect(view.referenceTerm).toEqual({ year: 3, kind: "semester2" });
    expect(view.suggestedTerm).toBeNull();
  });

  it("reports a course in neither list as not in the plan", () => {
    expect(derivePlanPanel("PI300", planOf(), now).status).toEqual({ kind: "none" });
  });
});

describe("derivePlanPanel: prerequisites against the plan", () => {
  // PI300 needs PI211 and is recommended for year 3 semester 1, which is where
  // it will be suggested.
  const states = (plan: StudyPlan) => derivePlanPanel("PI300", plan, now).prerequisites;

  it("is met by a passed course", () => {
    const view = derivePlanPanel("PI300", planOf({ passed: ["PI211"] }), now);
    expect(view.prerequisites).toEqual([{ code: "PI211", state: "passed" }]);
    expect(view.prerequisitesMet).toBe(true);
  });

  it("is met by a course planned in an earlier term, and says which", () => {
    const view = derivePlanPanel(
      "PI300",
      planOf({ terms: [planned(2, "semester2", ["PI211"])] }),
      now
    );
    expect(view.prerequisites).toEqual([
      { code: "PI211", state: "plannedEarlier", term: { year: 2, kind: "semester2" } },
    ]);
    expect(view.prerequisitesMet).toBe(true);
  });

  it("is not met by a course planned in the same term", () => {
    const view = derivePlanPanel(
      "PI300",
      planOf({ terms: [planned(3, "semester1", ["PI211"])] }),
      now
    );
    expect(states(planOf({ terms: [planned(3, "semester1", ["PI211"])] }))).toEqual([
      { code: "PI211", state: "plannedLater", term: { year: 3, kind: "semester1" } },
    ]);
    expect(view.prerequisitesMet).toBe(false);
  });

  it("is not met by a course planned after it", () => {
    expect(states(planOf({ terms: [planned(4, "semester1", ["PI211"])] }))[0]?.state).toBe(
      "plannedLater"
    );
  });

  it("is not met when the prerequisite is nowhere, and names it", () => {
    const view = derivePlanPanel("PI300", planOf(), now);
    expect(view.prerequisites).toEqual([{ code: "PI211", state: "notMet" }]);
    expect(view.prerequisitesMet).toBe(false);
  });

  it("is vacuously met for a course with none", () => {
    const view = derivePlanPanel("PI121", planOf(), now);
    expect(view.prerequisites).toEqual([]);
    expect(view.prerequisitesMet).toBe(true);
  });
});

describe("derivePlanPanel: what it counts towards for this student", () => {
  it("resolves a minor course through the student's own minor", () => {
    // PI380 is required for Governance and an elective in another minor for
    // Global Political Economy (the study plan design spec's own example).
    expect(derivePlanPanel("PI380", planOf({ minorId: "governance" }), now).counts).toEqual({
      bucket: "minorRequired",
      excludedFromTotal: false,
    });
    expect(
      derivePlanPanel("PI380", planOf({ minorId: "globalPoliticalEconomy" }), now).counts?.bucket
    ).toBe("minorElectiveOther");
  });

  it("gives an ordinary course its own category whatever the minor", () => {
    for (const minorId of [
      "governance",
      "publicAdministration",
      "globalPoliticalEconomy",
    ] as const) {
      expect(derivePlanPanel("PI300", planOf({ minorId }), now).counts?.bucket).toBe("core");
    }
  });

  it("flags a course that counts towards no total", () => {
    const excluded = allCourseCodes().find(
      (code) =>
        CURRICULUM_VERSIONS["2564"].courses.value.find((c) => c.code === code)?.excludedFromTotal
    );
    expect(excluded, "a 2564 course excluded from the total").toBeDefined();
    const view = derivePlanPanel(
      excluded!,
      planOf({ versionId: "2564", cohort: "64", startYear: 2564 }),
      now
    );
    expect(view.counts?.excludedFromTotal).toBe(true);
  });
});

describe("derivePlanPanel: a course from another curriculum", () => {
  const older = planOf({ versionId: "2564", cohort: "64", startYear: 2564 });

  it("resolves through the counterpart and answers for that course", () => {
    expect(counterparts("LAS101", "2564")).toEqual(["TU104"]);
    const view = derivePlanPanel("LAS101", { ...older, passed: ["TU104"] }, now);
    expect(view.versionCode).toBe("TU104");
    expect(view.status).toEqual({ kind: "passed" });
  });

  it("says there is no such course in the student's curriculum when there is no counterpart", () => {
    const orphan = allCourseCodes().find(
      (code) => !versionsOf(code).includes("2564") && counterparts(code, "2564").length === 0
    )!;
    const view = derivePlanPanel(orphan, older, now);
    expect(view).toMatchObject({
      versionCode: null,
      status: { kind: "none" },
      counts: null,
      prerequisites: [],
      suggestedTerm: null,
    });
  });
});

describe("suggestTerm", () => {
  const position: TermRef = { year: 2, kind: "semester1" };

  it("uses the version's recommended term when it is still ahead", () => {
    expect(suggestTerm("PI300", planOf(), position)).toEqual({ year: 3, kind: "semester1" });
  });

  it("uses the current term when the course is recommended for it", () => {
    expect(suggestTerm("PI280", planOf(), position)).toEqual({ year: 2, kind: "semester1" });
  });

  it("maps a recommendation that has passed to the next term of the same kind", () => {
    // PI280 is recommended for year 2 semester 1; a student now in year 3
    // semester 1 has missed it and gets the next semester 1.
    expect(suggestTerm("PI280", planOf({ cohort: "65" }), { year: 3, kind: "semester1" })).toEqual({
      year: 4,
      kind: "semester1",
    });
  });

  it("falls back to the next ordinary semester when the course has no recommended term", () => {
    expect(suggestTerm("PI340", planOf(), position)).toEqual({ year: 2, kind: "semester2" });
    expect(suggestTerm("PI340", planOf(), { year: 2, kind: "semester2" })).toEqual({
      year: 3,
      kind: "semester1",
    });
  });

  it("skips summer, which nothing says the course runs in", () => {
    const suggestion = suggestTerm("PI340", planOf(), { year: 2, kind: "semester2" });
    expect(suggestion?.kind).not.toBe("summer");
  });

  it("only ever suggests a term the plan screen would accept", () => {
    for (const code of CURRICULUM_VERSIONS["2564-rev2566"].courses.value.map((c) => c.code)) {
      const term = suggestTerm(code, planOf(), position);
      if (!term) continue;
      expect(term.year, code).toBeGreaterThanOrEqual(2);
      expect(term.year, code).toBeLessThanOrEqual(8);
    }
  });

  it("suggests nothing when the position is unknown", () => {
    expect(suggestTerm("PI300", planOf(), null)).toBeNull();
    // A cohort that has not started yet has no position.
    expect(derivePlanPanel("PI300", planOf({ cohort: "99" }), now).suggestedTerm).toBeNull();
  });
});

describe("buildPlanContext (the catalogue's view of the plan)", () => {
  it("tags passed and planned courses, and nothing else", () => {
    const { status } = buildPlanContext(
      planOf({ passed: ["PI211"], terms: [planned(3, "semester1", ["PI300"])] }),
      now
    );
    expect(status("PI211")).toEqual({ kind: "passed" });
    expect(status("PI300")).toEqual({ kind: "planned", term: { year: 3, kind: "semester1" } });
    expect(status("PI121")).toEqual({ kind: "none" });
  });

  it("matches a counterpart: LAS101 is passed when the student passed TU104", () => {
    const { status, matcher } = buildPlanContext(
      planOf({ versionId: "2564", cohort: "64", startYear: 2564, passed: ["TU104"] }),
      now
    );
    expect(status("LAS101")).toEqual({ kind: "passed" });
    expect(matcher.notPassed("LAS101")).toBe(false);
  });

  it("notPassed excludes only passed courses", () => {
    const { matcher } = buildPlanContext(planOf({ passed: ["PI211"] }), now);
    expect(matcher.notPassed("PI211")).toBe(false);
    expect(matcher.notPassed("PI300")).toBe(true);
  });

  describe("ready: prerequisites met by next term", () => {
    // Position is year 2 semester 1, so the next term is year 2 semester 2.
    it("is true with no prerequisites, and for a passed prerequisite", () => {
      const { matcher } = buildPlanContext(planOf({ passed: ["PI211"] }), now);
      expect(matcher.ready("PI121")).toBe(true);
      expect(matcher.ready("PI300")).toBe(true);
    });

    it("counts a prerequisite planned in the current term, which ends before the next", () => {
      const { matcher, nextTerm } = buildPlanContext(
        planOf({ terms: [planned(2, "semester1", ["PI211"])] }),
        now
      );
      expect(nextTerm).toEqual({ year: 2, kind: "semester2" });
      expect(matcher.ready("PI300")).toBe(true);
    });

    it("does not count a prerequisite planned for the next term or later", () => {
      expect(
        buildPlanContext(
          planOf({ terms: [planned(2, "semester2", ["PI211"])] }),
          now
        ).matcher.ready("PI300")
      ).toBe(false);
      expect(
        buildPlanContext(
          planOf({ terms: [planned(3, "semester1", ["PI211"])] }),
          now
        ).matcher.ready("PI300")
      ).toBe(false);
    });

    it("is false when the prerequisite is nowhere in the plan", () => {
      expect(buildPlanContext(planOf(), now).matcher.ready("PI300")).toBe(false);
    });

    it("is false for a course the student's curriculum does not have", () => {
      const orphan = allCourseCodes().find(
        (code) => !versionsOf(code).includes("2564") && counterparts(code, "2564").length === 0
      )!;
      const { matcher } = buildPlanContext(
        planOf({ versionId: "2564", cohort: "64", startYear: 2564 }),
        now
      );
      expect(matcher.ready(orphan)).toBe(false);
      expect(matcher.short(orphan)).toBe(false);
    });
  });

  describe("short: counts towards a category the student still needs", () => {
    it("is true for every counted course while nothing has been earned", () => {
      const { matcher } = buildPlanContext(planOf(), now);
      expect(matcher.short("PI300")).toBe(true);
      expect(matcher.short("PI121")).toBe(true);
    });

    it("is false once the course's own category is full, and true for the others", () => {
      const version = CURRICULUM_VERSIONS["2564-rev2566"];
      const core = version.courses.value.filter((c) => c.category === "core");
      const { matcher } = buildPlanContext(planOf({ passed: core.map((c) => c.code) }), now);
      // Every core course is passed, so core owes nothing.
      expect(matcher.short(core[0]!.code)).toBe(false);
      expect(matcher.short("PI121")).toBe(true);
    });

    it("counts a planned course towards a category the same as a passed one", () => {
      const version = CURRICULUM_VERSIONS["2564-rev2566"];
      const core = version.courses.value.filter((c) => c.category === "core");
      const { matcher } = buildPlanContext(
        planOf({ terms: [planned(3, "semester1", core.map((c) => c.code).slice(0, 15))] }),
        now
      );
      // Not a claim that all of core is covered, only that planned credits are
      // counted: with 15 core courses planned the category owes less than it
      // did, and PI121 (another category) is unaffected.
      expect(matcher.short("PI121")).toBe(true);
    });

    it("resolves a minor course through the student's minor", () => {
      // Governance owes its required minor credits, so a required minor course
      // is short; a student who has covered them is not short in it.
      const version = CURRICULUM_VERSIONS["2564-rev2566"];
      const governance = version.minors.find((m) => m.id === "governance")!;
      const open = buildPlanContext(planOf(), now).matcher;
      expect(open.short(governance.required[0]!)).toBe(true);
      const covered = buildPlanContext(planOf({ passed: governance.required }), now).matcher;
      expect(covered.short(governance.required[0]!)).toBe(false);
    });
  });
});
