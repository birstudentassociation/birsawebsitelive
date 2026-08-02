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

  // This version's plan is no longer borrowed from anywhere. The 2568
  // document has its own study plan at section 4.3.2.3, pages 53 to 55, and
  // that is what ships.
  it("takes its recommended plan from its own document", () => {
    const derivation = version.recommendedPlan.derivation;
    expect(derivation.kind).toBe("published");
    expect(derivation).toMatchObject({ source: "comparison2568" });
  });

  it("no longer carries the no-2568-study-plan contradiction", () => {
    const c = version.verification.contradictions.find((x) => x.id === "no-2568-study-plan");
    expect(c).toBeUndefined();
  });

  // The published plan differs from the 2023 revision's in four ways, each of
  // which a reuse-the-revision implementation would silently lose.
  it("follows the document where it departs from the 2023 revision", () => {
    const term = (year: number, kind: string) =>
      version.recommendedPlan.value.find((t) => t.term.year === year && t.term.kind === kind);
    const codes = (year: number, kind: string) =>
      (term(year, kind)?.entries ?? [])
        .filter((e) => e.kind === "course")
        .map((e) => (e.kind === "course" ? e.code : ""));

    // PI470 in Year 3 semester 1, not Year 4.
    expect(codes(3, "semester1")).toContain("PI470");
    expect(codes(4, "semester1")).not.toContain("PI470");
    // PI270 in Year 2 semester 1 and PI280 in semester 2, not the reverse.
    expect(codes(2, "semester1")).toContain("PI270");
    expect(codes(2, "semester2")).toContain("PI280");
    // The Year 2 summer is load-bearing here: without its 6 credits the plan
    // does not reach 126, so it is not marked optional as it is in 2564.
    expect(term(2, "summer")?.optional).toBe(false);
    // No Year 3 summer at all, PI574 having become a free elective.
    expect(term(3, "summer")).toBeUndefined();
  });

  it("plans exactly the 126 credits it takes to graduate", () => {
    const byCode = new Map(version.courses.value.map((c) => [c.code, c]));
    const planned = version.recommendedPlan.value.reduce(
      (total, term) =>
        total +
        term.entries.reduce(
          (n, entry) => n + (entry.kind === "course" ? (byCode.get(entry.code)?.credits ?? 0) : 3),
          0
        ),
      0
    );
    expect(planned).toBe(version.graduationCredits.value);
  });

  // The catalogue really is identical to the 2023 revision's, so this record
  // stays. It has no disclosure: it tells a maintainer why the confirm screen
  // cannot separate cohort 66 from cohort 68 by course code, which is not
  // something a student needs read to them.
  it("still records that its catalogue is identical to the 2023 revision's", () => {
    const c = version.verification.contradictions.find((x) => x.id === "catalogue-identical");
    expect(c).toBeDefined();
    expect(c?.disclosure).toBeNull();
  });

  it("takes its credit structure from its own document, not the inference", () => {
    expect(version.graduationCredits.derivation.kind).toBe("published");
    expect(version.graduationCredits.derivation).toMatchObject({ source: "comparison2568" });
  });

  it("maps both cohort 68 and cohort 69 from the document", () => {
    const byCode = Object.fromEntries(version.cohorts.map((c) => [c.code, c.provenance]));
    expect(byCode["68"]?.kind).toBe("document");
    expect(byCode["69"]?.kind).toBe("document");
    expect(byCode["69"]).toMatchObject({ source: "comparison2568", page: 1 });
  });

  it("no longer records PI574 as sitting outside the total", () => {
    // pi574-outside-total was a record of a false inference (PI574 excluded
    // from the 126); now that PI574 is a counted free elective, that record
    // would itself be false, so it must be gone, not merely suppressed.
    const c = version.verification.contradictions.find((x) => x.id === "pi574-outside-total");
    expect(c).toBeUndefined();
  });

  // Regression guards: pi574-credits-attested and cohort-69-attested both
  // claimed a fact was "printed in no document". BIRSA confirmed on
  // 2026-08-02 that both are printed in comparison2568, so both claims are
  // now false and both records must be gone, not merely suppressed, mirroring
  // how cohort-67-attested was deleted in 2564-rev2566.test.ts.
  it("no longer carries the pi574-credits-attested disclosure, now that the value is documented", () => {
    const c = version.verification.contradictions.find((x) => x.id === "pi574-credits-attested");
    expect(c).toBeUndefined();
  });

  it("no longer carries the cohort-69-attested disclosure, now that cohort 69 is documented", () => {
    const c = version.verification.contradictions.find((x) => x.id === "cohort-69-attested");
    expect(c).toBeUndefined();
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
