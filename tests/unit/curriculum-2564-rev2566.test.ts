import { describe, expect, it } from "vitest";
import { curriculum2564rev2566 } from "@/content/curriculum/2564-rev2566";
import { curriculum2564 } from "@/content/curriculum/2564";

const version = curriculum2564rev2566;

describe("curriculum2564rev2566", () => {
  it("graduates at 127 credits, same as the base version", () => {
    expect(version.graduationCredits.value).toBe(127);
  });

  it("replaces the five Year 1 general education courses, keeping PI121 and PI122", () => {
    const codes = new Set(version.courses.value.map((c) => c.code));
    for (const added of ["EL105", "LAS101", "AH208", "EL295"]) {
      expect(codes.has(added), `expected ${added}`).toBe(true);
    }
    for (const kept of ["PI121", "PI122"]) {
      expect(codes.has(kept), `expected ${kept} to survive from the base version`).toBe(true);
    }
    for (const removed of ["TU050", "TU104", "TU105", "PI131", "PI132", "PD102", "PD103"]) {
      expect(codes.has(removed), `did not expect ${removed}`).toBe(false);
    }
  });

  it("keeps every course from Year 2 onward identical to 2564", () => {
    const laterCategories = new Set([
      "core",
      "concentrationRequired",
      "economics",
      "concentrationElectiveArea",
      "concentrationElectiveApproaches",
      "minorRequired",
      "minorElective",
      "minorElectiveOther",
    ]);
    const pick = (v: typeof curriculum2564) =>
      v.courses.value
        .filter((c) => laterCategories.has(c.category))
        .map((c) => `${c.code}:${c.credits}`)
        .sort();
    expect(pick(version)).toEqual(pick(curriculum2564));
  });

  it("maps cohort 66 from the document and cohort 67 as attested", () => {
    const byCode = Object.fromEntries(version.cohorts.map((c) => [c.code, c.provenance]));
    expect(byCode["66"]?.kind).toBe("document");
    expect(byCode["67"]?.kind).toBe("attested");
    expect(byCode["67"]).toMatchObject({ by: "BIRSA", on: "2026-08-01" });
  });

  it("discloses the attested cohort 67 mapping", () => {
    const c = version.verification.contradictions.find((x) => x.id === "cohort-67-attested");
    expect(c?.disclosure).not.toBeNull();
  });

  it("carries PI574 at 1 credit, counted toward the total", () => {
    const internship = version.courses.value.find((c) => c.code === "PI574");
    expect(internship?.credits).toBe(1);
    expect(internship?.excludedFromTotal).toBeFalsy();
  });

  it("category credits sum to the graduation total", () => {
    const sum = version.categories.reduce((n, c) => n + c.credits, 0);
    expect(sum).toBe(127);
  });

  // Regression guards carried forward from Task 2: a course silently dropped
  // from a pool would pass every test above but change these counts, which
  // is why each category and minor elective list is checked by exact length.
  it("has the exact course count per category", () => {
    const counts: Record<string, number> = {};
    for (const c of version.courses.value) {
      counts[c.category] = (counts[c.category] ?? 0) + 1;
    }
    expect(counts.genEdPart1).toBe(7);
    expect(counts.genEdPart2).toBe(4);
    expect(counts.core).toBe(10);
    expect(counts.concentrationRequired).toBe(7);
    expect(counts.economics).toBe(1);
    expect(counts.concentrationElectiveArea).toBe(12);
    expect(counts.concentrationElectiveApproaches).toBe(13);
    expect(counts.minor).toBe(40);
    expect(counts.freeElective ?? 0).toBe(0);
  });

  it("has the exact elective-list length for each minor", () => {
    const byId = Object.fromEntries(version.minors.map((m) => [m.id, m.electives.length]));
    expect(byId.governance).toBe(11);
    expect(byId.publicAdministration).toBe(9);
    expect(byId.globalPoliticalEconomy).toBe(11);
  });
});
