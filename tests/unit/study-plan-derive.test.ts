import { describe, expect, it } from "vitest";
import { CURRICULUM_VERSIONS, type PlannedTerm } from "@/content/curriculum";
import { assumedHistory, remainingRequirements } from "@/lib/study-plan/derive";

const version = CURRICULUM_VERSIONS["2564-rev2566"];

describe("assumedHistory", () => {
  it("assumes nothing for a student in their first term", () => {
    const result = assumedHistory(version, { year: 1, kind: "semester1" });
    expect(result.courses).toEqual([]);
    expect(result.placeholders).toEqual([]);
  });

  it("assumes the first semester for a student in their second", () => {
    const result = assumedHistory(version, { year: 1, kind: "semester2" });
    expect(result.courses).toContain("TU100");
    expect(result.courses).toContain("PD102");
    expect(result.courses).not.toContain("PI211");
  });

  it("orders terms correctly across years, putting summer after semester 2", () => {
    const result = assumedHistory(version, { year: 3, kind: "semester1" });
    expect(result.courses).toContain("PI321");
    expect(result.courses).not.toContain("PI300");
  });

  it("keeps a real course in a summer term out until the summer itself is past", () => {
    // Year 3 summer holds PI574 (an internship, not a placeholder), sitting
    // strictly between year 3 semester 2 and year 4 semester 1. This is the
    // case that would break if summer ever sorted before semester 2.
    const beforeSummer = assumedHistory(version, { year: 3, kind: "semester2" });
    expect(beforeSummer.courses).not.toContain("PI574");

    const afterSummer = assumedHistory(version, { year: 4, kind: "semester1" });
    expect(afterSummer.courses).toContain("PI574");
  });

  it("returns placeholders separately from named courses", () => {
    const result = assumedHistory(version, { year: 3, kind: "semester2" });
    expect(result.placeholders.length).toBeGreaterThan(0);
    for (const slot of result.placeholders) {
      expect(slot.id.length).toBeGreaterThan(0);
      expect(result.courses).not.toContain(slot.id);
    }
  });

  it("never returns a code that is not a real course", () => {
    const codes = new Set(version.courses.value.map((c) => c.code));
    const result = assumedHistory(version, { year: 4, kind: "semester1" });
    for (const code of result.courses) expect(codes.has(code)).toBe(true);
  });

  it("does not double-count a course that appears in two terms", () => {
    // No real curriculum repeats a course code across terms, so this has to
    // be built as a synthetic fixture: spread a real version and override
    // only `recommendedPlan` so the rest of the data (courses, categories,
    // minors) stays valid.
    const duplicatePlan: PlannedTerm[] = [
      {
        term: { year: 1, kind: "semester1" },
        optional: false,
        entries: [{ kind: "course", code: "PI211" }],
      },
      {
        term: { year: 1, kind: "semester2" },
        optional: false,
        entries: [{ kind: "course", code: "PI211" }],
      },
    ];
    const fixture = {
      ...version,
      recommendedPlan: { ...version.recommendedPlan, value: duplicatePlan },
    };

    const result = assumedHistory(fixture, { year: 2, kind: "semester1" });
    expect(result.courses.filter((code) => code === "PI211").length).toBe(1);
  });
});

describe("remainingRequirements", () => {
  it("owes the full requirement when nothing has been passed", () => {
    const shortfalls = remainingRequirements(version, [], "governance", 0);
    const total = shortfalls.reduce((n, s) => n + s.remaining, 0);
    expect(total).toBe(version.graduationCredits.value);
  });

  it("owes the full 126 credits for the 2568 version, whose arithmetic differs most from the others", () => {
    // Guards the concentrationRequired override (19 -> 18) and the PI574
    // exclusion together: this version's total only comes out to 126, not
    // 127, if both of those apply.
    const v2568 = CURRICULUM_VERSIONS["2568"];
    const shortfalls = remainingRequirements(v2568, [], "governance", 0);
    const total = shortfalls.reduce((n, s) => n + s.remaining, 0);
    expect(total).toBe(126);
    expect(total).toBe(v2568.graduationCredits.value);
  });

  it("credits a passed course against its own category", () => {
    const shortfalls = remainingRequirements(version, ["PI211"], "governance", 0);
    const core = shortfalls.find((s) => s.category.id === "core");
    expect(core?.earned).toBe(3);
    expect(core?.remaining).toBe(27);
  });

  it("ignores courses excluded from the total", () => {
    const v2568 = CURRICULUM_VERSIONS["2568"];
    const shortfalls = remainingRequirements(v2568, ["PI574"], "governance", 0);
    const concentration = shortfalls.find((s) => s.category.id === "concentrationRequired");
    expect(concentration?.earned).toBe(0);
  });

  it("counts a minor course into the bucket the chosen minor puts it in", () => {
    const asGovernance = remainingRequirements(version, ["PI380"], "governance", 0);
    expect(asGovernance.find((s) => s.category.id === "minorRequired")?.earned).toBe(3);
    expect(asGovernance.find((s) => s.category.id === "minorElectiveOther")?.earned).toBe(0);
  });

  it("counts the same course into a different bucket for a different minor", () => {
    const asGpe = remainingRequirements(version, ["PI380"], "globalPoliticalEconomy", 0);
    expect(asGpe.find((s) => s.category.id === "minorRequired")?.earned).toBe(0);
    expect(asGpe.find((s) => s.category.id === "minorElectiveOther")?.earned).toBe(3);
  });

  it("satisfies the free elective category from a credit count, not matched courses", () => {
    const withoutFreeElectives = remainingRequirements(version, [], "governance", 0);
    const totalWithout = withoutFreeElectives.reduce((n, s) => n + s.remaining, 0);

    const withFreeElectives = remainingRequirements(version, [], "governance", 6);
    const freeElective = withFreeElectives.find((s) => s.category.id === "freeElective");
    expect(freeElective?.earned).toBe(6);
    expect(freeElective?.remaining).toBe(0);

    const totalWith = withFreeElectives.reduce((n, s) => n + s.remaining, 0);
    expect(totalWithout - totalWith).toBe(6);
  });

  it("resolves every minor course into a real bucket, never the pooled 'minor' category", () => {
    // No version defines a category with id "minor", so asserting that id's
    // absence proves nothing about bucketFor. Exercise the resolution
    // directly instead: pass in the three governance-required courses, one
    // governance elective, and one course that belongs to a different minor
    // (publicAdministration's PI340), and check the credits land exactly
    // where resolveMinorCategory says they should, with nothing lost.
    const passed = ["PI380", "PI381", "PI382", "PI385", "PI340"];
    const shortfalls = remainingRequirements(version, passed, "governance", 0);

    const minorRequired = shortfalls.find((s) => s.category.id === "minorRequired");
    const minorElective = shortfalls.find((s) => s.category.id === "minorElective");
    const minorElectiveOther = shortfalls.find((s) => s.category.id === "minorElectiveOther");

    // PI380, PI381, PI382 are governance's three required courses.
    expect(minorRequired?.earned).toBe(9);
    // PI385 is a governance elective.
    expect(minorElective?.earned).toBe(3);
    // PI340 is required in publicAdministration, so under governance it
    // counts as an elective from another minor.
    expect(minorElectiveOther?.earned).toBe(3);

    const totalMinorCredit =
      (minorRequired?.earned ?? 0) + (minorElective?.earned ?? 0) + (minorElectiveOther?.earned ?? 0);
    expect(totalMinorCredit).toBe(15);
    expect(shortfalls.some((s) => s.category.id === "minor")).toBe(false);
  });

  it("never reports a negative remaining", () => {
    const everything = version.courses.value.map((c) => c.code);
    for (const s of remainingRequirements(version, everything, "governance", 0)) {
      expect(s.remaining).toBeGreaterThanOrEqual(0);
    }
  });
});
