import { describe, expect, it } from "vitest";
import { courses } from "@/content/course-review/courses";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";

/**
 * The review catalogue holds its own copy of each PI course's title and
 * credits. The curriculum is the source for both, so this test fails when the
 * two stop agreeing, which is cheaper than restructuring the catalogue to stop
 * holding them.
 */
const curriculum = new Map(CURRICULUM_VERSIONS["2568"].courses.value.map((c) => [c.code, c]));

/** Whitespace and case are not differences. Spelling and punctuation are. */
function normalise(title: string): string {
  return title.replace(/\s+/g, " ").trim().toLowerCase();
}

/**
 * Catalogue titles that differ from the 2568 curriculum module beyond
 * whitespace and case. Each is a known difference that has not been settled,
 * not an endorsement of either side. The catalogue spells the British way
 * (Organisation, Globalisation), which is house style for English on this site,
 * while the curriculum module carries the American spelling of the faculty
 * documents it was read from. PI121 and PI484 differ in wording or punctuation
 * and the faculty source PDF needs checking before either side is changed.
 * Keep this list exact so a new mismatch fails and a fixed one is removed.
 */
const TITLE_MISMATCHES: Record<string, { catalogue: string; curriculum: string }> = {
  PI121: {
    catalogue: "Introduction to Social Sciences",
    curriculum: "Introduction to Social Science",
  },
  PI292: {
    catalogue: "International Organisations and Regimes",
    curriculum: "International Organizations and Regimes",
  },
  PI342: {
    catalogue: "Organisation and Human Resources Management: Theories and Practices",
    curriculum: "Organization and Human Resource Management: Theories and Practices",
  },
  PI381: {
    catalogue: "Globalisation and Global Governance",
    curriculum: "Globalization and Global Governance",
  },
  PI413: {
    catalogue: "Seminar: Globalisation, Regional Grouping and the State",
    curriculum: "Seminar: Globalization, Regional Grouping and the State",
  },
  PI484: {
    catalogue: "Seminar: International Regimes, Institutions and Governance",
    curriculum: "Seminar: International Regimes, Institutions, and Governance",
  },
};

describe("review catalogue agrees with the 2568 curriculum", () => {
  it("has a curriculum counterpart for every catalogue course", () => {
    const missing = courses.map((c) => c.code).filter((code) => !curriculum.has(code));
    expect(missing).toEqual([]);
  });

  it("totals the same credits as the curriculum for every catalogue course", () => {
    const mismatched = courses
      .filter((c) => curriculum.has(c.code))
      .filter((c) => curriculum.get(c.code)!.credits !== c.credits.total)
      .map(
        (c) =>
          `${c.code}: catalogue ${c.credits.total}, curriculum ${curriculum.get(c.code)!.credits}`
      );
    expect(mismatched).toEqual([]);
  });

  it("uses the curriculum's English title for every catalogue course, apart from the named exceptions", () => {
    const mismatched: Record<string, { catalogue: string; curriculum: string }> = {};
    for (const course of courses) {
      const counterpart = curriculum.get(course.code);
      if (counterpart && normalise(counterpart.title) !== normalise(course.title.en)) {
        mismatched[course.code] = { catalogue: course.title.en, curriculum: counterpart.title };
      }
    }
    expect(mismatched).toEqual(TITLE_MISMATCHES);
  });

  it("allow-lists only titles that really still differ", () => {
    for (const [code, titles] of Object.entries(TITLE_MISMATCHES)) {
      expect(normalise(titles.catalogue), code).not.toBe(normalise(titles.curriculum));
    }
  });
});
