import { describe, expect, it } from "vitest";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import { passedCoursesForPrint, plannedTermsForPrint } from "@/lib/study-plan/print";

const version = CURRICULUM_VERSIONS["2564-rev2566"];

describe("passedCoursesForPrint", () => {
  it("includes a course that only exists in `passed`, never named in the recommended plan", () => {
    // PI385 (Peace Studies) is a governance elective a student can only reach
    // by filling a placeholder slot at the "assumed/fill" step; it is never
    // written as a literal `{ kind: "course", code: "PI385" }` entry anywhere
    // in this version's recommended plan. Grouping passed courses by
    // matching them against the recommended plan (the bug this test guards
    // against) would silently drop it from the print page.
    const isNamedInRecommendedPlan = version.recommendedPlan.value.some((term) =>
      term.entries.some((entry) => entry.kind === "course" && entry.code === "PI385")
    );
    expect(isNamedInRecommendedPlan).toBe(false);

    const result = passedCoursesForPrint(version, ["PI385"]);
    expect(result).toEqual([{ code: "PI385", title: "Peace Studies", credits: 3 }]);
  });

  it("lists every passed course regardless of whether it is named in the recommended plan", () => {
    const result = passedCoursesForPrint(version, ["PI300", "PI385"]);
    expect(result.map((c) => c.code).sort()).toEqual(["PI300", "PI385"]);
  });

  it("sorts by course code", () => {
    const result = passedCoursesForPrint(version, ["PI385", "PI211"]);
    expect(result.map((c) => c.code)).toEqual(["PI211", "PI385"]);
  });

  it("returns an empty list for no passed courses", () => {
    expect(passedCoursesForPrint(version, [])).toEqual([]);
  });
});

describe("plannedTermsForPrint", () => {
  it("drops a term with no courses and no free elective credits", () => {
    const result = plannedTermsForPrint(version, [
      { term: { year: 3, kind: "semester1" }, codes: [], freeElectiveCredits: 0 },
    ]);
    expect(result).toEqual([]);
  });

  it("keeps a term that only carries free elective credits", () => {
    const result = plannedTermsForPrint(version, [
      { term: { year: 3, kind: "semester1" }, codes: [], freeElectiveCredits: 3 },
    ]);
    expect(result).toEqual([
      { term: { year: 3, kind: "semester1" }, courses: [], freeElectiveCredits: 3 },
    ]);
  });

  it("sorts terms in order, summer after semester 2 of the same year", () => {
    const result = plannedTermsForPrint(version, [
      { term: { year: 3, kind: "summer" }, codes: ["PI574"], freeElectiveCredits: 0 },
      { term: { year: 3, kind: "semester1" }, codes: ["PI300"], freeElectiveCredits: 0 },
      { term: { year: 3, kind: "semester2" }, codes: [], freeElectiveCredits: 3 },
    ]);
    expect(result.map((t) => `${t.term.year}-${t.term.kind}`)).toEqual([
      "3-semester1",
      "3-semester2",
      "3-summer",
    ]);
  });
});
