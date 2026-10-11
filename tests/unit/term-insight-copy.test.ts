import { describe, expect, it } from "vitest";
import { buildTermInsightCopy } from "@/components/study-plan/termInsightCopy";
import { OFFERING_HISTORY_NOTICE } from "@/lib/courses/offeringHistory";
import { whatIf } from "@/lib/study-plan/whatIf";
import { whatIfSentences } from "@/lib/study-plan/whatIfText";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import type { StudyPlan } from "@/lib/study-plan/plan";

/** Every string in a copy object with its path, so en and th can be compared leaf by leaf. */
function leaves(value: unknown, path = ""): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      leaves(child, path ? `${path}.${key}` : key)
    );
  }
  return [];
}

const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe("term insight copy", () => {
  const en = leaves(buildTermInsightCopy("en"));
  const th = leaves(buildTermInsightCopy("th"));

  it("has the same keys in English and Thai", () => {
    expect(th.map(([path]) => path)).toEqual(en.map(([path]) => path));
  });

  it("has no empty string in either language", () => {
    for (const [path, text] of [...en, ...th]) expect(text.trim().length, path).toBeGreaterThan(0);
  });

  it("fills the same placeholders in both languages, so neither shows a raw {token}", () => {
    en.forEach(([path, text], i) => {
      expect(placeholders(th[i]![1]), path).toEqual(placeholders(text));
    });
  });

  it("writes Thai as Thai: every Thai string contains Thai script", () => {
    for (const [path, text] of th) expect(text, path).toMatch(/[฀-๿]/);
  });

  it("never scores or ranks anything", () => {
    for (const [path, text] of en) {
      expect(text, path).not.toMatch(/\b(stars?|rating|score|difficulty|best|worst)\b/i);
    }
  });

  it("states the offering history as history in both languages", () => {
    expect(OFFERING_HISTORY_NOTICE.en).toMatch(/not a promise/);
    expect(OFFERING_HISTORY_NOTICE.th).toMatch(/ไม่ใช่คำยืนยัน/);
  });
});

describe("whatIfSentences", () => {
  const version = CURRICULUM_VERSIONS["2564-rev2566"];
  const plan: StudyPlan = {
    versionId: "2564-rev2566",
    cohort: "66",
    startYear: 2566,
    minorId: "governance",
    passed: ["PI211"],
    freeElectiveCreditsPassed: 0,
    terms: [
      { term: { year: 2, kind: "semester1" }, codes: ["PI271"], freeElectiveCredits: 0 },
      { term: { year: 2, kind: "semester2" }, codes: ["PI280"], freeElectiveCredits: 0 },
      { term: { year: 3, kind: "semester1" }, codes: ["PI364"], freeElectiveCredits: 0 },
    ],
  };
  const termText = (term: { year: number; kind: string }) => `Y${term.year} ${term.kind}`;

  for (const locale of ["en", "th"] as const) {
    const copy = buildTermInsightCopy(locale).whatIf;

    it(`reads the move, the graduation change and the pushed course in ${locale}`, () => {
      const sentences = whatIfSentences(
        whatIf(version, plan, { kind: "deferCourse", code: "PI280" }),
        copy,
        termText
      );
      expect(sentences.length).toBe(3);
      expect(sentences.join(" ")).toContain("PI280");
      expect(sentences.join(" ")).toContain("PI364");
      expect(sentences.join(" ")).toContain("Y3 semester2");
      for (const sentence of sentences) expect(sentence).not.toMatch(/\{\w+\}/);
    });

    it(`says there is nothing to move for a course not in the plan, in ${locale}`, () => {
      const [only, ...rest] = whatIfSentences(
        whatIf(version, plan, { kind: "deferCourse", code: "PI390" }),
        copy,
        termText
      );
      expect(rest).toEqual([]);
      expect(only).toContain("PI390");
    });

    it(`says a course with nothing depending on it is alone, in ${locale}`, () => {
      const sentences = whatIfSentences(
        whatIf(version, plan, { kind: "deferCourse", code: "PI364" }),
        copy,
        termText
      );
      expect(sentences).toContain(copy.noDependentsText);
    });

    it(`describes leaving a term empty in ${locale}`, () => {
      const sentences = whatIfSentences(
        whatIf(version, plan, { kind: "emptyTerm", term: { year: 2, kind: "semester2" } }),
        copy,
        termText
      );
      expect(sentences[0]).toContain("Y2 semester2");
    });
  }
});
