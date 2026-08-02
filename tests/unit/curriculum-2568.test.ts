import { describe, expect, it } from "vitest";
import { curriculum2568 } from "@/content/curriculum/2568";

const version = curriculum2568;

describe("curriculum2568", () => {
  it("graduates at 126 credits", () => {
    expect(version.graduationCredits.value).toBe(126);
  });

  it("carries PI574 at 3 credits, counted as a free elective inside the total", () => {
    const internship = version.courses.value.find((c) => c.code === "PI574");
    expect(internship?.credits).toBe(3);
    expect(internship?.category).toBe("freeElective");
    expect(internship?.excludedFromTotal).toBeUndefined();
  });

  it("counts concentration-required as 18 credits", () => {
    const category = version.categories.find((c) => c.id === "concentrationRequired");
    expect(category?.credits).toBe(18);
  });

  it("sums its counted categories to 126", () => {
    const sum = version.categories.reduce((n, c) => n + c.credits, 0);
    expect(sum).toBe(126);
  });

  it("borrows its recommended plan from the 2023 revision and says so", () => {
    const derivation = version.recommendedPlan.derivation;
    expect(derivation.kind).toBe("inferred");
    if (derivation.kind !== "inferred") throw new Error("unreachable");
    expect(derivation.from).toBe("2564-rev2566");
    expect(derivation.reason.en.length).toBeGreaterThan(0);
    expect(derivation.reason.th.length).toBeGreaterThan(0);
  });

  it("takes its credit structure from its own document, not the inference", () => {
    expect(version.graduationCredits.derivation.kind).toBe("published");
    expect(version.graduationCredits.derivation).toMatchObject({ source: "comparison2568" });
  });

  it("maps cohort 68 from the document and cohort 69 as attested", () => {
    const byCode = Object.fromEntries(version.cohorts.map((c) => [c.code, c.provenance]));
    expect(byCode["68"]?.kind).toBe("document");
    expect(byCode["69"]?.kind).toBe("attested");
  });

  it("no longer records PI574 as sitting outside the total", () => {
    // pi574-outside-total was a record of a false inference (PI574 excluded
    // from the 126); now that PI574 is a counted free elective, that record
    // would itself be false, so it must be gone, not merely suppressed.
    const c = version.verification.contradictions.find((x) => x.id === "pi574-outside-total");
    expect(c).toBeUndefined();
  });

  it("discloses that PI574's 3-credit value is attested, not printed in the source", () => {
    const c = version.verification.contradictions.find((x) => x.id === "pi574-credits-attested");
    expect(c?.disclosure).not.toBeNull();
    expect(c?.disclosure?.en.length).toBeGreaterThan(0);
    expect(c?.disclosure?.th.length).toBeGreaterThan(0);
  });

  // Regression guard, not in the brief: the catalogue is unchanged between
  // the 2023 revision and 2568 apart from PI574 (credit value, and now
  // category), so every other category's course count must be identical to
  // the 2023 revision's. A course silently dropped from a pool would still
  // pass every test above. concentrationRequired is 6, not the 2023
  // revision's 7, and freeElective is 1, not 0, because PI574 moved
  // categories; every other count is unchanged.
  it("keeps the exact course count per category, PI574 moved to freeElective", () => {
    const counts: Record<string, number> = {};
    for (const course of version.courses.value) {
      counts[course.category] = (counts[course.category] ?? 0) + 1;
    }
    expect(counts).toMatchObject({
      genEdPart1: 7,
      genEdPart2: 4,
      core: 10,
      concentrationRequired: 6,
      economics: 1,
      concentrationElectiveArea: 12,
      concentrationElectiveApproaches: 13,
      minor: 40,
      freeElective: 1,
    });
  });

  // Regression guard, not in the brief: minor elective lists are inherited by
  // reference from 2564, so their lengths should match automatically.
  it("keeps each minor's elective-list length", () => {
    const byId = Object.fromEntries(version.minors.map((m) => [m.id, m.electives.length]));
    expect(byId).toEqual({
      governance: 11,
      publicAdministration: 9,
      globalPoliticalEconomy: 11,
    });
  });
});
