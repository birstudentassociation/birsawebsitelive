import { describe, expect, it } from "vitest";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import { checkPlan, projectedGraduation } from "@/lib/study-plan/findings";
import type { StudyPlan } from "@/lib/study-plan/plan";

const version = CURRICULUM_VERSIONS["2564-rev2566"];

type TermInput = { term: StudyPlan["terms"][number]["term"]; codes: string[] };

function planWith(
  terms: TermInput[],
  passed: string[] = [],
  freeElectiveCreditsPassed = 0
): StudyPlan {
  return {
    versionId: "2564-rev2566",
    cohort: "66",
    startYear: 2566,
    minorId: "governance",
    passed,
    freeElectiveCreditsPassed,
    terms: terms.map((t) => ({ ...t, freeElectiveCredits: 0 })),
  };
}

describe("checkPlan prerequisites", () => {
  it("flags a course placed before its prerequisite", () => {
    const plan = planWith([
      { term: { year: 2, kind: "semester1" }, codes: ["PI300"] },
      { term: { year: 2, kind: "semester2" }, codes: ["PI211"] },
    ]);
    const findings = checkPlan(version, plan);
    const prereq = findings.find((f) => f.id === "prerequisite:PI300");
    expect(prereq?.severity).toBe("problem");
    expect(prereq?.message.en).toContain("PI211");
    expect(prereq?.message.th.length).toBeGreaterThan(0);
  });

  it("accepts a prerequisite satisfied in an earlier term", () => {
    const plan = planWith([
      { term: { year: 2, kind: "semester1" }, codes: ["PI211"] },
      { term: { year: 2, kind: "semester2" }, codes: ["PI300"] },
    ]);
    expect(checkPlan(version, plan).some((f) => f.id === "prerequisite:PI300")).toBe(false);
  });

  it("accepts a prerequisite already passed", () => {
    const plan = planWith(
      [{ term: { year: 2, kind: "semester1" }, codes: ["PI300"] }],
      ["PI211"]
    );
    expect(checkPlan(version, plan).some((f) => f.id === "prerequisite:PI300")).toBe(false);
  });

  it("rejects a prerequisite taken in the same term", () => {
    const plan = planWith([{ term: { year: 2, kind: "semester1" }, codes: ["PI211", "PI300"] }]);
    expect(checkPlan(version, plan).some((f) => f.id === "prerequisite:PI300")).toBe(true);
  });
});

describe("checkPlan credit load", () => {
  it("flags a regular term over 21 credits", () => {
    const codes = ["PI210", "PI211", "PI241", "PI271", "PI280", "PI282", "PI300", "PI320"];
    const findings = checkPlan(version, planWith([{ term: { year: 2, kind: "semester1" }, codes }]));
    const overload = findings.find((f) => f.id === "creditLoad:2-semester1");
    expect(overload?.severity).toBe("problem");
    expect(overload?.source.provision).toContain("10.4");
  });

  it("flags a regular term under 9 credits", () => {
    const findings = checkPlan(
      version,
      planWith([{ term: { year: 2, kind: "semester1" }, codes: ["PI211"] }])
    );
    expect(findings.some((f) => f.id === "creditLoad:2-semester1")).toBe(true);
  });

  it("accepts a regular term of exactly 9 and exactly 21 credits", () => {
    const nine = planWith([{ term: { year: 2, kind: "semester1" }, codes: ["PI210", "PI211", "PI241"] }]);
    expect(checkPlan(version, nine).some((f) => f.id.startsWith("creditLoad:"))).toBe(false);

    const twentyOne = planWith([
      {
        term: { year: 2, kind: "semester1" },
        codes: ["PI210", "PI211", "PI241", "PI271", "PI280", "PI282", "PI300"],
      },
    ]);
    expect(checkPlan(version, twentyOne).some((f) => f.id.startsWith("creditLoad:"))).toBe(false);
  });

  it("flags a summer term over 6 credits", () => {
    const findings = checkPlan(
      version,
      planWith([{ term: { year: 3, kind: "summer" }, codes: ["PI210", "PI211", "PI241"] }])
    );
    expect(findings.some((f) => f.id === "creditLoad:3-summer")).toBe(true);
  });

  it("does not apply the 9-credit floor to a summer term", () => {
    const findings = checkPlan(
      version,
      planWith([{ term: { year: 3, kind: "summer" }, codes: ["PI574"] }])
    );
    expect(findings.some((f) => f.id.startsWith("creditLoad:"))).toBe(false);
  });

  it("ignores empty terms entirely", () => {
    const findings = checkPlan(version, planWith([{ term: { year: 2, kind: "semester1" }, codes: [] }]));
    expect(findings.some((f) => f.id.startsWith("creditLoad:"))).toBe(false);
  });

  it("counts free elective credits toward the term load", () => {
    const codes = ["PI210", "PI211", "PI241", "PI271", "PI280", "PI282", "PI300"];
    const withoutFreeElective = planWith([{ term: { year: 2, kind: "semester1" }, codes }]);
    expect(
      checkPlan(version, withoutFreeElective).some((f) => f.id === "creditLoad:2-semester1")
    ).toBe(false);

    const withFreeElective: StudyPlan = {
      ...withoutFreeElective,
      terms: [
        {
          term: { year: 2, kind: "semester1" },
          codes,
          freeElectiveCredits: 3,
        },
      ],
    };
    expect(
      checkPlan(version, withFreeElective).some((f) => f.id === "creditLoad:2-semester1")
    ).toBe(true);
  });
});

describe("checkPlan completion and timing", () => {
  it("notes how many credits short the plan is", () => {
    const findings = checkPlan(version, planWith([]));
    const shortfall = findings.find((f) => f.id === "shortfall");
    expect(shortfall?.severity).toBe("warning");
    expect(shortfall?.message.en).toContain("127");
  });

  it("does not report a shortfall once the plan reaches the total", () => {
    const everything = version.courses.value.map((c) => c.code);
    const findings = checkPlan(version, planWith([], everything, 6));
    expect(findings.some((f) => f.id === "shortfall")).toBe(false);
  });

  it("flags a plan running past seven years from intake", () => {
    const findings = checkPlan(
      version,
      planWith([{ term: { year: 5, kind: "semester2" }, codes: ["PI211", "PI210", "PI241"] }])
    );
    expect(findings.some((f) => f.id === "maxYears")).toBe(false);

    const late = planWith([{ term: { year: 8, kind: "semester1" }, codes: ["PI211"] }]);
    expect(checkPlan(version, late).some((f) => f.id === "maxYears")).toBe(true);
  });
});

describe("projectedGraduation", () => {
  it("returns the last planned term", () => {
    const plan = planWith([
      { term: { year: 3, kind: "semester1" }, codes: ["PI300"] },
      { term: { year: 4, kind: "semester2" }, codes: ["PI470"] },
      { term: { year: 3, kind: "summer" }, codes: ["PI574"] },
    ]);
    expect(projectedGraduation(plan)).toEqual({ year: 4, kind: "semester2" });
  });

  it("returns null for a plan with no terms", () => {
    expect(projectedGraduation(planWith([]))).toBeNull();
  });
});
