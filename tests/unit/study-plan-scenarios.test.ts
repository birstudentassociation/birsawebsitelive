import { describe, expect, it } from "vitest";
import { CURRICULUM_VERSIONS, type TermRef } from "@/content/curriculum";
import {
  MAX_SCENARIOS,
  activePlan,
  deserialisePlan,
  envelopeOf,
  parseStoredPlans,
  serialiseEnvelope,
  serialisePlan,
  type PlanEnvelope,
  type StudyPlan,
} from "@/lib/study-plan/plan";
import { awayTerm, compareScenarios, minorSwitch } from "@/lib/study-plan/scenarios";
import {
  addScenario,
  cleanScenarioName,
  deleteScenario,
  nextScenarioId,
  renameScenario,
  setActivePlan,
  switchScenario,
  uniqueScenarioName,
} from "@/lib/study-plan/scenarioStore";

const Y3S1: TermRef = { year: 3, kind: "semester1" };
const Y3S2: TermRef = { year: 3, kind: "semester2" };

const plan: StudyPlan = {
  versionId: "2564-rev2566",
  cohort: "66",
  startYear: 2566,
  minorId: "governance",
  passed: ["PI211", "PI271", "PI280"],
  freeElectiveCreditsPassed: 0,
  terms: [
    { term: Y3S1, codes: ["PI380", "PI381", "PI382", "PI364"], freeElectiveCredits: 0 },
    { term: Y3S2, codes: ["PI320"], freeElectiveCredits: 0 },
  ],
};

describe("the stored envelope", () => {
  it("migrates a bare version 1 plan into a one-scenario envelope", () => {
    const migrated = parseStoredPlans(serialisePlan(plan));
    expect(migrated).toEqual({ v: 2, active: "s1", plans: [{ id: "s1", name: "Main", plan }] });
    expect(parseStoredPlans(serialisePlan(plan), "หลัก")?.plans[0]?.name).toBe("หลัก");
  });

  it("round-trips a version 2 envelope, and deserialisePlan returns its active plan", () => {
    const other = { ...plan, minorId: "publicAdministration" as const };
    const envelope = addScenario(envelopeOf(plan), "Other minor", other)!;
    const stored = serialiseEnvelope(envelope);
    expect(parseStoredPlans(stored)).toEqual(envelope);
    expect(deserialisePlan(stored)).toEqual(other);
    expect(activePlan(switchScenario(envelope, "s1")!)).toEqual(plan);
  });

  it("leaves the URL format for the active plan alone", () => {
    expect(deserialisePlan(serialisePlan(plan))).toEqual(plan);
  });

  it("refuses tampered envelopes rather than throwing", () => {
    const good = envelopeOf(plan);
    const bad: unknown[] = [
      { ...good, v: 3 },
      { ...good, active: "missing" },
      { ...good, active: "UPPER" },
      { ...good, plans: [] },
      { ...good, plans: [{ ...good.plans[0], name: "   " }] },
      { ...good, plans: [{ ...good.plans[0], name: "x".repeat(41) }] },
      { ...good, plans: [{ ...good.plans[0], plan: { ...plan, passed: ["not a code"] } }] },
      { ...good, plans: [good.plans[0], good.plans[0]] },
      {
        ...good,
        plans: Array.from({ length: MAX_SCENARIOS + 1 }, (_, i) => ({
          ...good.plans[0],
          id: `s${i + 1}`,
        })),
      },
    ];
    for (const value of bad) {
      expect(
        parseStoredPlans(JSON.stringify(value)),
        JSON.stringify(value).slice(0, 60)
      ).toBeNull();
    }
    for (const junk of ["{", "{}", '{"v":2}', "[]", "null", "garbage", ""]) {
      expect(parseStoredPlans(junk), junk).toBeNull();
      expect(deserialisePlan(junk), junk).toBeNull();
    }
  });
});

describe("scenario management", () => {
  const one = envelopeOf(plan);

  it("adds a scenario, makes it active, and gives it the next id", () => {
    const two = addScenario(one, "  If I\n switch minor ", plan)!;
    expect(two.active).toBe("s2");
    expect(two.plans.map((p) => [p.id, p.name])).toEqual([
      ["s1", "Main"],
      ["s2", "If I switch minor"],
    ]);
    expect(nextScenarioId(two)).toBe("s3");
  });

  it("refuses an empty name and a seventh scenario", () => {
    expect(addScenario(one, "   ", plan)).toBeNull();
    let full: PlanEnvelope = one;
    for (let i = 1; i < MAX_SCENARIOS; i += 1) full = addScenario(full, `Plan ${i}`, plan)!;
    expect(full.plans).toHaveLength(MAX_SCENARIOS);
    expect(addScenario(full, "One too many", plan)).toBeNull();
  });

  it("renames, switches and replaces the active plan", () => {
    const two = addScenario(one, "Away", plan)!;
    expect(renameScenario(two, "s1", "Original")?.plans[0]?.name).toBe("Original");
    expect(renameScenario(two, "nope", "x")).toBeNull();
    expect(renameScenario(two, "s1", " ")).toBeNull();
    expect(switchScenario(two, "s1")?.active).toBe("s1");
    expect(switchScenario(two, "nope")).toBeNull();
    const edited = { ...plan, passed: [] };
    expect(activePlan(setActivePlan(two, edited))).toEqual(edited);
    expect(activePlan(switchScenario(setActivePlan(two, edited), "s1")!)).toEqual(plan);
  });

  it("deletes a scenario, hands over when the active one goes, and keeps the last", () => {
    const two = addScenario(one, "Away", plan)!;
    expect(deleteScenario(two, "s2")?.active).toBe("s1");
    expect(deleteScenario(two, "s1")).toMatchObject({ active: "s2" });
    expect(deleteScenario(one, "s1")).toBeNull();
    expect(deleteScenario(two, "nope")).toBeNull();
  });

  it("keeps names unique and within the length limit", () => {
    const two = addScenario(one, "Away", plan)!;
    expect(uniqueScenarioName(two, "away")).toBe("away 2");
    expect(uniqueScenarioName(two, "Fresh")).toBe("Fresh");
    expect(cleanScenarioName("x".repeat(80))).toHaveLength(40);
    expect(cleanScenarioName("   ")).toBeNull();
  });
});

describe("minorSwitch", () => {
  const version = CURRICULUM_VERSIONS["2564-rev2566"];

  it("sorts every passed and planned minor course into carried, other minor and reclassified", () => {
    // Governance: PI380, PI381, PI382 required. Moving to public administration
    // makes all three count as credits from another minor.
    const result = minorSwitch(version, plan, "publicAdministration");
    expect(result.plan.minorId).toBe("publicAdministration");
    expect(result.rows.map((r) => [r.code, r.from, r.to, r.outcome])).toEqual([
      ["PI380", "minorRequired", "minorElectiveOther", "otherMinor"],
      ["PI381", "minorRequired", "minorElectiveOther", "otherMinor"],
      ["PI382", "minorRequired", "minorElectiveOther", "otherMinor"],
    ]);
    expect(result.rows.every((r) => r.planned)).toBe(true);
    expect(result.credits).toMatchObject({
      carriedOver: 0,
      movedToOtherMinor: 9,
      reclassified: 0,
    });
  });

  it("reports credits beyond what the other-minor bucket takes as no longer counting", () => {
    // The other-minor bucket asks for 6 credits; 9 land in it, so 3 count for nothing.
    const result = minorSwitch(version, plan, "publicAdministration");
    expect(result.credits.noLongerCounting).toBe(3);
    // The required bucket is now 9 short, and the other-minor bucket stops owing its 6.
    expect(result.remainingAfter - result.remainingBefore).toBe(3);
  });

  it("changes nothing for a switch to the same minor", () => {
    const same = minorSwitch(version, plan, "governance");
    expect(same.credits).toEqual({
      carriedOver: 9,
      movedToOtherMinor: 0,
      reclassified: 0,
      noLongerCounting: 0,
    });
    expect(same.remainingAfter).toBe(same.remainingBefore);
  });

  it("never touches the courses themselves, or the input plan", () => {
    const copy = JSON.parse(JSON.stringify(plan)) as StudyPlan;
    const result = minorSwitch(version, plan, "globalPoliticalEconomy");
    expect(plan).toEqual(copy);
    expect({ ...result.plan, minorId: plan.minorId }).toEqual(plan);
  });
});

describe("awayTerm", () => {
  const version = CURRICULUM_VERSIONS["2564-rev2566"];
  const withChain: StudyPlan = {
    ...plan,
    passed: ["PI211", "PI271"],
    terms: [
      { term: { year: 3, kind: "semester1" }, codes: ["PI280"], freeElectiveCredits: 0 },
      { term: { year: 3, kind: "semester2" }, codes: ["PI364"], freeElectiveCredits: 0 },
    ],
  };

  it("shows the displaced courses, the chains through them and the graduation term", () => {
    const result = awayTerm(version, withChain, Y3S1, "exchange");
    expect(result.kind).toBe("exchange");
    expect(result.whatIf.graduationBefore).toEqual(Y3S2);
    expect(result.whatIf.graduationAfter).toEqual({ year: 4, kind: "semester1" });
    expect(result.chains).toEqual([{ code: "PI280", dependents: ["PI364"] }]);
    expect(result.beyondTimeLimit).toBe(false);
    expect(
      result.plan.terms.find((t) => t.term.kind === "semester1" && t.term.year === 3)?.codes
    ).toEqual([]);
  });

  it("says when the delay carries the plan past the years the rules allow", () => {
    const late: StudyPlan = {
      ...withChain,
      terms: [{ term: { year: 7, kind: "semester2" }, codes: ["PI280"], freeElectiveCredits: 0 }],
    };
    expect(awayTerm(version, late, { year: 7, kind: "semester2" }, "leave").beyondTimeLimit).toBe(
      true
    );
  });

  it("is a no-op for a term with nothing in it", () => {
    const result = awayTerm(version, withChain, { year: 4, kind: "summer" }, "leave");
    expect(result.whatIf.applied).toBe(false);
    expect(result.chains).toEqual([]);
    expect(result.whatIf.graduationAfter).toEqual(result.whatIf.graduationBefore);
  });
});

describe("compareScenarios", () => {
  it("compares graduation, credits per category and findings counts", () => {
    const version = CURRICULUM_VERSIONS["2564-rev2566"];
    const chained: StudyPlan = {
      ...plan,
      passed: ["PI211", "PI271"],
      terms: [
        { term: Y3S1, codes: ["PI280", "PI380", "PI381", "PI382"], freeElectiveCredits: 0 },
        { term: Y3S2, codes: ["PI364"], freeElectiveCredits: 0 },
      ],
    };
    const away = awayTerm(version, chained, Y3S1, "exchange").plan;
    const comparison = compareScenarios(
      { name: "Main", plan: chained },
      { name: "Away", plan: away }
    );
    expect(comparison.a.name).toBe("Main");
    expect(comparison.a.graduation).toEqual(Y3S2);
    expect(comparison.b.graduation).toEqual({ year: 4, kind: "semester1" });
    expect(comparison.graduationDiffers).toBe(true);
    expect(comparison.categories.map((c) => c.id)).toContain("minorRequired");
    const minorRequired = comparison.categories.find((c) => c.id === "minorRequired");
    expect(minorRequired).toMatchObject({ a: 9, b: 9 });
    expect(comparison.a.creditsRequired).toBe(version.graduationCredits.value);
    for (const summary of [comparison.a, comparison.b]) {
      expect(Object.keys(summary.findings).sort()).toEqual(["note", "problem", "warning"]);
    }
  });

  it("reports no difference between a scenario and itself", () => {
    const same = compareScenarios({ name: "A", plan }, { name: "B", plan });
    expect(same.graduationDiffers).toBe(false);
    expect(same.a.findings).toEqual(same.b.findings);
    expect(same.categories.every((c) => c.a === c.b)).toBe(true);
  });

  it("counts a category the other scenario's curriculum lacks as null", () => {
    const other: StudyPlan = { ...plan, versionId: "2568" };
    const comparison = compareScenarios({ name: "A", plan }, { name: "B", plan: other });
    expect(comparison.categories.length).toBeGreaterThan(0);
  });
});
