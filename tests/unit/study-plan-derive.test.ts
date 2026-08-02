import { describe, expect, it } from "vitest";
import { CURRICULUM_VERSIONS, type PlannedTerm, type TermRef } from "@/content/curriculum";
import {
  assumedHistory,
  nextTerm,
  populateRecommendedTerms,
  remainingRequirements,
} from "@/lib/study-plan/derive";
import type { PlannedCourseTerm } from "@/lib/study-plan/plan";

const version = CURRICULUM_VERSIONS["2564-rev2566"];

describe("nextTerm", () => {
  it("steps semester 1 to semester 2 within the same year", () => {
    expect(nextTerm({ year: 4, kind: "semester1" })).toEqual({ year: 4, kind: "semester2" });
  });

  it("steps semester 2 to summer within the same year", () => {
    expect(nextTerm({ year: 4, kind: "semester2" })).toEqual({ year: 4, kind: "summer" });
  });

  it("steps summer to semester 1 of the next year", () => {
    expect(nextTerm({ year: 4, kind: "summer" })).toEqual({ year: 5, kind: "semester1" });
  });

  it("can extend a plan whose last term is year 4, semester 1, one step at a time", () => {
    let term: TermRef = { year: 4, kind: "semester1" };
    const sequence: TermRef[] = [term];
    for (let i = 0; i < 3; i++) {
      const next = nextTerm(term);
      expect(next).not.toBeNull();
      term = next!;
      sequence.push(term);
    }
    expect(sequence).toEqual([
      { year: 4, kind: "semester1" },
      { year: 4, kind: "semester2" },
      { year: 4, kind: "summer" },
      { year: 5, kind: "semester1" },
    ]);
  });

  it("returns null past year 8 summer, the cap `TermRef.year` and the plan schema both share", () => {
    expect(nextTerm({ year: 8, kind: "summer" })).toBeNull();
  });

  it("still offers year 8 summer itself, only stopping one step further", () => {
    expect(nextTerm({ year: 8, kind: "semester2" })).toEqual({ year: 8, kind: "summer" });
  });
});

describe("assumedHistory", () => {
  it("assumes nothing for a student in their first term", () => {
    const result = assumedHistory(version, { year: 1, kind: "semester1" });
    expect(result.courses).toEqual([]);
    expect(result.placeholders).toEqual([]);
  });

  it("assumes the first semester for a student in their second", () => {
    const result = assumedHistory(version, { year: 1, kind: "semester2" });
    expect(result.courses).toContain("TU100");
    expect(result.courses).toContain("PI121");
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
    // Guards the concentrationRequired override (19 -> 18) and PI574's move
    // into freeElective together: this version's total only comes out to
    // 126, not 127, if both of those apply.
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
    // TU050 is the one remaining excludedFromTotal course, and it carries 0
    // credits, so passing it proves nothing by itself: earned would be 0
    // whether or not the exclusion check ran. Build a fixture instead: take
    // a real, currently-counted 3-credit core course and mark it excluded,
    // so a passing test can only mean the exclusion check actually fired.
    const excludedCore = version.courses.value.map((c) =>
      c.code === "PI211" ? { ...c, excludedFromTotal: true } : c
    );
    const fixture = { ...version, courses: { ...version.courses, value: excludedCore } };

    const shortfalls = remainingRequirements(fixture, ["PI211"], "governance", 0);
    const core = shortfalls.find((s) => s.category.id === "core");
    expect(core?.earned).toBe(0);
  });

  it("counts PI574 as a free elective for the 2568 version, which no longer sits outside the total", () => {
    const v2568 = CURRICULUM_VERSIONS["2568"];
    const shortfalls = remainingRequirements(v2568, ["PI574"], "governance", 0);
    const freeElective = shortfalls.find((s) => s.category.id === "freeElective");
    expect(freeElective?.earned).toBe(3);
    expect(freeElective?.remaining).toBe(3);
  });

  it("adds a named free elective (PI574) to the student's declared free elective credits", () => {
    const v2568 = CURRICULUM_VERSIONS["2568"];
    const shortfalls = remainingRequirements(v2568, ["PI574"], "governance", 3);
    const freeElective = shortfalls.find((s) => s.category.id === "freeElective");
    expect(freeElective?.earned).toBe(6);
    expect(freeElective?.remaining).toBe(0);
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
      (minorRequired?.earned ?? 0) +
      (minorElective?.earned ?? 0) +
      (minorElectiveOther?.earned ?? 0);
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

describe("populateRecommendedTerms", () => {
  it("running it twice produces the same plan", () => {
    const plan = { passed: [], terms: [] as PlannedCourseTerm[], minorId: "governance" as const };
    const once = populateRecommendedTerms(version, { year: 2, kind: "semester1" }, plan);
    const twice = populateRecommendedTerms(
      version,
      { year: 2, kind: "semester1" },
      {
        passed: [],
        terms: once,
        minorId: "governance",
      }
    );
    expect(twice).toEqual(once);
  });

  it("does not plan a course already in passed", () => {
    const result = populateRecommendedTerms(
      version,
      { year: 2, kind: "semester1" },
      { passed: ["PI321"], terms: [], minorId: "governance" }
    );
    const allCodes = result.flatMap((t) => t.codes);
    expect(allCodes).not.toContain("PI321");
  });

  it("does not duplicate a course the student has already placed in a different term", () => {
    // PI321 is recommended for year 2 semester 2, but the student has already
    // moved it into year 4 semester 1 of their own plan.
    const moved: PlannedCourseTerm = {
      term: { year: 4, kind: "semester1" },
      codes: ["PI321"],
      freeElectiveCredits: 0,
    };
    const result = populateRecommendedTerms(
      version,
      { year: 2, kind: "semester1" },
      { passed: [], terms: [moved], minorId: "governance" }
    );
    const allCodes = result.flatMap((t) => t.codes);
    expect(allCodes.filter((c) => c === "PI321").length).toBe(1);
    const movedResult = result.find((t) => t.term.year === 4 && t.term.kind === "semester1");
    expect(movedResult?.codes).toContain("PI321");
  });

  it("creates a term entry for Year 2 summer even though every entry in it is a placeholder", () => {
    const result = populateRecommendedTerms(
      version,
      { year: 1, kind: "semester1" },
      { passed: [], terms: [], minorId: "governance" }
    );
    const year2Summer = result.find((t) => t.term.year === 2 && t.term.kind === "summer");
    expect(year2Summer).toBeDefined();
    expect(year2Summer?.codes).toEqual([]);
  });

  it("does not create or fill terms before the student's position", () => {
    const result = populateRecommendedTerms(
      version,
      { year: 3, kind: "semester1" },
      { passed: [], terms: [], minorId: "governance" }
    );
    const past = result.find((t) => t.term.year === 1 && t.term.kind === "semester1");
    expect(past).toBeUndefined();
    const allCodes = result.flatMap((t) => t.codes);
    expect(allCodes).not.toContain("TU100");
  });

  it("preserves existing codes and freeElectiveCredits in a term the student already edited", () => {
    const edited: PlannedCourseTerm = {
      term: { year: 3, kind: "semester1" },
      codes: ["TU100"],
      freeElectiveCredits: 6,
    };
    const result = populateRecommendedTerms(
      version,
      { year: 3, kind: "semester1" },
      { passed: [], terms: [edited], minorId: "governance" }
    );
    const same = result.find((t) => t.term.year === 3 && t.term.kind === "semester1");
    expect(same?.codes[0]).toBe("TU100");
    expect(same?.codes).toContain("PI300");
    expect(same?.freeElectiveCredits).toBe(6);
  });

  it("fills in the chosen minor's three required courses, which sit in Year 3", () => {
    // Governance's required courses are PI380, PI381, PI382. Autofilling from
    // before Year 3 semester 1 (where the two minorRequired slots sit) and
    // Year 3 semester 2 (where the third one sits) should place all three.
    const result = populateRecommendedTerms(
      version,
      { year: 2, kind: "semester1" },
      { passed: [], terms: [], minorId: "governance" }
    );
    const allCodes = result.flatMap((t) => t.codes);
    expect(allCodes).toContain("PI380");
    expect(allCodes).toContain("PI381");
    expect(allCodes).toContain("PI382");
  });

  it("does not fill a minor elective slot, only the required slots", () => {
    // PI385 is one of governance's electives, not one of its three required
    // courses, so it must never be planned by autofill: the minorElective
    // placeholders stay untouched, exactly as every other elective category.
    const result = populateRecommendedTerms(
      version,
      { year: 2, kind: "semester1" },
      { passed: [], terms: [], minorId: "governance" }
    );
    const allCodes = result.flatMap((t) => t.codes);
    expect(allCodes).not.toContain("PI385");
  });

  it("does not plan a minor required course the student has already passed", () => {
    const result = populateRecommendedTerms(
      version,
      { year: 2, kind: "semester1" },
      { passed: ["PI380"], terms: [], minorId: "governance" }
    );
    const allCodes = result.flatMap((t) => t.codes);
    expect(allCodes).not.toContain("PI380");
    expect(allCodes).toContain("PI381");
    expect(allCodes).toContain("PI382");
  });

  it("does not duplicate a minor required course the student already placed in a different term", () => {
    const moved: PlannedCourseTerm = {
      term: { year: 4, kind: "semester1" },
      codes: ["PI380"],
      freeElectiveCredits: 0,
    };
    const result = populateRecommendedTerms(
      version,
      { year: 2, kind: "semester1" },
      { passed: [], terms: [moved], minorId: "governance" }
    );
    const allCodes = result.flatMap((t) => t.codes);
    expect(allCodes.filter((c) => c === "PI380").length).toBe(1);
    const movedResult = result.find((t) => t.term.year === 4 && t.term.kind === "semester1");
    expect(movedResult?.codes).toContain("PI380");
  });

  it("running it twice still produces the same plan when a minor's required courses are involved", () => {
    const plan = { passed: [], terms: [] as PlannedCourseTerm[], minorId: "governance" as const };
    const once = populateRecommendedTerms(version, { year: 2, kind: "semester1" }, plan);
    const twice = populateRecommendedTerms(
      version,
      { year: 2, kind: "semester1" },
      { passed: [], terms: once, minorId: "governance" }
    );
    expect(twice).toEqual(once);
  });

  it("fills a different minor's required courses when a different minor is chosen", () => {
    // Global Political Economy's required courses are PI392, PI480, PI490,
    // disjoint from governance's PI380/PI381/PI382.
    const result = populateRecommendedTerms(
      version,
      { year: 2, kind: "semester1" },
      { passed: [], terms: [], minorId: "globalPoliticalEconomy" }
    );
    const allCodes = result.flatMap((t) => t.codes);
    expect(allCodes).toContain("PI392");
    expect(allCodes).toContain("PI480");
    expect(allCodes).toContain("PI490");
    expect(allCodes).not.toContain("PI380");
    expect(allCodes).not.toContain("PI381");
    expect(allCodes).not.toContain("PI382");
  });
});
