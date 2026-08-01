import { describe, expect, it } from "vitest";
import { curriculum2564 } from "@/content/curriculum/2564";

describe("curriculum2564", () => {
  it("graduates at 127 credits", () => {
    expect(curriculum2564.graduationCredits.value).toBe(127);
  });

  it("records the 127 total as a sum rather than a quoted figure", () => {
    const disclosed = curriculum2564.verification.contradictions.find(
      (c) => c.id === "total-never-printed"
    );
    expect(disclosed).toBeDefined();
    expect(disclosed?.disclosure).not.toBeNull();
  });

  it("category credits sum to the graduation total", () => {
    const sum = curriculum2564.categories.reduce((n, c) => n + c.credits, 0);
    expect(sum).toBe(curriculum2564.graduationCredits.value);
  });

  it("carries PI574 at 1 credit", () => {
    const internship = curriculum2564.courses.value.find((c) => c.code === "PI574");
    expect(internship?.credits).toBe(1);
    expect(internship?.excludedFromTotal).toBeFalsy();
  });

  it("maps cohorts 64 and 65, both from a document", () => {
    expect(curriculum2564.cohorts.map((c) => c.code)).toEqual(["64", "65"]);
    for (const cohort of curriculum2564.cohorts) {
      expect(cohort.provenance.kind).toBe("document");
    }
  });

  it("has TU105 and PI121 as gen-ed courses, not the 2023 replacements", () => {
    const codes = new Set(curriculum2564.courses.value.map((c) => c.code));
    expect(codes.has("TU105")).toBe(true);
    expect(codes.has("PI121")).toBe(true);
    expect(codes.has("EL105")).toBe(false);
    expect(codes.has("PD102")).toBe(false);
  });

  it("gives every prerequisite a course that exists", () => {
    const codes = new Set(curriculum2564.courses.value.map((c) => c.code));
    for (const course of curriculum2564.courses.value) {
      for (const prereq of course.prerequisites) {
        expect(codes.has(prereq), `${course.code} requires missing ${prereq}`).toBe(true);
      }
    }
  });

  it("references only real courses and declared categories in the recommended plan", () => {
    const codes = new Set(curriculum2564.courses.value.map((c) => c.code));
    const categories = new Set(curriculum2564.categories.map((c) => c.id));
    for (const term of curriculum2564.recommendedPlan.value) {
      for (const entry of term.entries) {
        if (entry.kind === "course") {
          expect(codes.has(entry.code), `plan references missing ${entry.code}`).toBe(true);
        } else {
          expect(categories.has(entry.category)).toBe(true);
        }
      }
    }
  });

  it("gives every placeholder a unique id", () => {
    const ids = curriculum2564.recommendedPlan.value
      .flatMap((t) => t.entries)
      .filter((e) => e.kind === "placeholder")
      .map((e) => (e as { id: string }).id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("defines all three minors, each with exactly 3 required courses", () => {
    expect(curriculum2564.minors.map((m) => m.id).sort()).toEqual([
      "globalPoliticalEconomy",
      "governance",
      "publicAdministration",
    ]);
    for (const minor of curriculum2564.minors) {
      expect(minor.required, `${minor.id} required`).toHaveLength(3);
      expect(minor.electives.length, `${minor.id} electives`).toBeGreaterThanOrEqual(2);
    }
  });

  it("pools every minor course under the single 'minor' category", () => {
    const inMinors = new Set(
      curriculum2564.minors.flatMap((m) => [...m.required, ...m.electives])
    );
    for (const course of curriculum2564.courses.value) {
      if (inMinors.has(course.code)) {
        expect(course.category, `${course.code}`).toBe("minor");
      } else {
        expect(course.category, `${course.code}`).not.toBe("minor");
      }
    }
  });

  it("gives every minor course code a course that exists", () => {
    const codes = new Set(curriculum2564.courses.value.map((c) => c.code));
    for (const minor of curriculum2564.minors) {
      for (const code of [...minor.required, ...minor.electives]) {
        expect(codes.has(code), `${minor.id} names missing ${code}`).toBe(true);
      }
    }
  });

  it("never lists the same course as required in two different minors", () => {
    const seen = new Map<string, string>();
    for (const minor of curriculum2564.minors) {
      for (const code of minor.required) {
        expect(seen.has(code), `${code} required by two minors`).toBe(false);
        seen.set(code, minor.id);
      }
    }
  });

  it("applies the handbook credit-load rules", () => {
    expect(curriculum2564.rules.value.minCreditsRegularTerm).toBe(9);
    expect(curriculum2564.rules.value.maxCreditsRegularTerm).toBe(21);
    expect(curriculum2564.rules.value.maxCreditsSummerTerm).toBe(6);
    expect(curriculum2564.rules.value.maxYears).toBe(7);
    expect(curriculum2564.rules.value.minSemesters).toBe(7);
    expect(curriculum2564.rules.value.minGpa).toBe(2);
  });
});
