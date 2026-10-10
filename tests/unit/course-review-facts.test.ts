import { describe, expect, it } from "vitest";
import { courses } from "@/content/course-review/courses";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import {
  curriculumCourse,
  minorsFor,
  prerequisiteCodes,
  recommendedTerms,
  unlocks,
} from "@/lib/course-review/facts";

const curriculum = CURRICULUM_VERSIONS["2568"];
const codes = courses.map((c) => c.code);
const catalogue = new Set(codes);

describe("prerequisiteCodes and unlocks", () => {
  it("only return codes that exist in the catalogue", () => {
    for (const code of codes) {
      for (const other of [...prerequisiteCodes(code), ...unlocks(code)]) {
        expect(catalogue.has(other), `${code} -> ${other}`).toBe(true);
      }
    }
  });

  it("are mutual inverses across the catalogue", () => {
    for (const code of codes) {
      for (const pre of prerequisiteCodes(code)) {
        expect(unlocks(pre), `${pre} should unlock ${code}`).toContain(code);
      }
      for (const next of unlocks(code)) {
        expect(prerequisiteCodes(next), `${next} should require ${code}`).toContain(code);
      }
    }
  });

  it("returns unlocks sorted and without duplicates", () => {
    for (const code of codes) {
      const result = unlocks(code);
      expect(result).toEqual([...new Set(result)].sort());
    }
  });

  it("has at least one prerequisite link, so the inverse check is not vacuous", () => {
    expect(codes.some((code) => prerequisiteCodes(code).length > 0)).toBe(true);
  });

  it("reads the curriculum for a known chain (PI271 then PI280)", () => {
    expect(prerequisiteCodes("PI280")).toContain("PI271");
    expect(unlocks("PI271")).toContain("PI280");
  });

  it("returns nothing for an unknown code", () => {
    expect(prerequisiteCodes("PI999")).toEqual([]);
    expect(unlocks("PI999")).toEqual([]);
    expect(curriculumCourse("PI999")).toBeUndefined();
  });
});

describe("recommendedTerms", () => {
  it("places PI270 in year 2 semester 1", () => {
    expect(recommendedTerms("PI270")).toEqual([{ year: 2, kind: "semester1" }]);
  });

  it("places PI280 in year 2 semester 2", () => {
    expect(recommendedTerms("PI280")).toEqual([{ year: 2, kind: "semester2" }]);
  });

  it("places PI121 in year 1 semester 1", () => {
    expect(recommendedTerms("PI121")).toEqual([{ year: 1, kind: "semester1" }]);
  });

  it("matches the plan for every catalogue course", () => {
    for (const code of codes) {
      const expected = curriculum.recommendedPlan.value
        .filter((planned) => planned.entries.some((e) => e.kind === "course" && e.code === code))
        .map((planned) => planned.term);
      expect(recommendedTerms(code), code).toEqual(expected);
    }
  });

  it("returns an empty list for a course the plan does not name", () => {
    expect(recommendedTerms("PI999")).toEqual([]);
  });
});

describe("minorsFor", () => {
  it("returns roles consistent with the curriculum minors for every course", () => {
    for (const code of codes) {
      const result = minorsFor(code);
      for (const minor of curriculum.minors) {
        const found = result.find((m) => m.id === minor.id);
        if (minor.required.includes(code)) expect(found?.role, code).toBe("required");
        else if (minor.electives.includes(code)) expect(found?.role, code).toBe("elective");
        else expect(found, `${code} in ${minor.id}`).toBeUndefined();
      }
    }
  });

  it("reports each minor's required courses as required", () => {
    for (const minor of curriculum.minors) {
      for (const code of minor.required) {
        expect(minorsFor(code).find((m) => m.id === minor.id)?.role).toBe("required");
      }
    }
  });

  it("reports each minor's elective pool as elective", () => {
    for (const minor of curriculum.minors) {
      for (const code of minor.electives) {
        expect(minorsFor(code).find((m) => m.id === minor.id)?.role).toBe("elective");
      }
    }
  });

  it("returns a minor at most once per course and carries its name", () => {
    for (const code of codes) {
      const result = minorsFor(code);
      expect(new Set(result.map((m) => m.id)).size).toBe(result.length);
      for (const m of result) {
        expect(m.name.en.length).toBeGreaterThan(0);
        expect(m.name.th.length).toBeGreaterThan(0);
      }
    }
  });

  it("returns no minors for a course outside every minor", () => {
    expect(minorsFor("PI121")).toEqual([]);
  });
});
