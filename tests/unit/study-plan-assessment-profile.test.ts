import { describe, expect, it } from "vitest";
import { CURRICULUM_VERSIONS, type TermRef } from "@/content/curriculum";
import type { AssessmentFacts } from "@/content/course-review/types";
import {
  EXAM_HEAVY_TERM_COUNT,
  EXAM_HEAVY_WEIGHT,
  PROFILE_COPY,
  classifyAssessment,
  profileLine,
  stacksExams,
  termAssessmentProfile,
} from "@/lib/study-plan/assessmentProfile";
import { checkPlan } from "@/lib/study-plan/findings";
import type { StudyPlan } from "@/lib/study-plan/plan";

const version = CURRICULUM_VERSIONS["2564-rev2566"];
const term = { year: 2, semester: 1 } as const;

/** Facts with just the weights, for a lookup a test controls. */
const facts = (...weights: [string, number][]): AssessmentFacts => ({
  term: { year: 2569, semester: 1 },
  weights: weights.map(([label, weight]) => ({ label: { en: label, th: label }, weight })),
});

describe("classifyAssessment", () => {
  it("reads a final exam, its weight and graded attendance from the catalogue", () => {
    const heavy = termAssessmentProfile(["PI364", "PI487"]);
    expect(heavy.finalExam).toEqual([
      { code: "PI364", weight: 40 },
      { code: "PI487", weight: 35 },
    ]);
    expect(heavy.attendanceGraded).toEqual(["PI487"]);
  });

  it("treats a final oral assessment as a final exam, as the catalogue's exam format does", () => {
    expect(classifyAssessment("X", facts(["Final oral assessment", 35], ["Essay", 65])).kind).toBe(
      "finalExam"
    );
  });

  it("calls a course coursework only when the weights make up the whole grade with no exam", () => {
    expect(classifyAssessment("X", facts(["Essay", 60], ["Presentation", 40])).kind).toBe(
      "courseworkOnly"
    );
  });

  it("never assumes: a partial record, or no record, is unknown", () => {
    expect(classifyAssessment("X", facts(["Essay", 60])).kind).toBe("unknown");
    expect(classifyAssessment("X", { term })).toMatchObject({ kind: "unknown" });
    expect(classifyAssessment("X", undefined).kind).toBe("unknown");
  });

  it("separates a complete record with only a midterm from both of the above", () => {
    expect(classifyAssessment("X", facts(["Midterm exam", 50], ["Essay", 50])).kind).toBe(
      "otherExam"
    );
  });
});

describe("termAssessmentProfile", () => {
  it("counts finals, exam-heavy courses, coursework only and unknowns, and names the unknowns", () => {
    const profile = termAssessmentProfile(["PI364", "PI390", "PI340", "PI211"]);
    expect(profile.courseCount).toBe(4);
    expect(profile.finalExam).toEqual([
      { code: "PI364", weight: 40 },
      { code: "PI390", weight: 30 },
    ]);
    expect(profile.examHeavy).toEqual([{ code: "PI364", weight: 40 }]);
    expect(profile.courseworkOnly).toEqual(["PI340"]);
    expect(profile.unknown).toEqual(["PI211"]);
    expect(profile.recordedTerms).toEqual([{ year: 2569, semester: 1 }]);
  });

  it("counts a final exam at exactly the exam-heavy weight and not one point below", () => {
    const lookup = (code: string) =>
      code === "A"
        ? facts(["Final exam", EXAM_HEAVY_WEIGHT])
        : facts(["Final exam", EXAM_HEAVY_WEIGHT - 1]);
    const profile = termAssessmentProfile(["A", "B"], lookup);
    expect(profile.examHeavy.map((e) => e.code)).toEqual(["A"]);
  });

  it("stacks exams only from the chosen number of heavy courses", () => {
    const heavy = () => facts(["Final exam", 50]);
    const codes = (n: number) => Array.from({ length: n }, (_, i) => `C${i}`);
    expect(stacksExams(termAssessmentProfile(codes(EXAM_HEAVY_TERM_COUNT - 1), heavy))).toBe(false);
    expect(stacksExams(termAssessmentProfile(codes(EXAM_HEAVY_TERM_COUNT), heavy))).toBe(true);
  });

  it("does not cite a term for a course it could not use", () => {
    const profile = termAssessmentProfile(["A"], () => ({ term: { year: 2560, semester: 2 } }));
    expect(profile.recordedTerms).toEqual([]);
  });
});

describe("profileLine", () => {
  const profile = termAssessmentProfile(["PI364", "PI390", "PI340", "PI211"]);

  it("states how many courses it rests on, the finals, coursework only, the unknowns and the term", () => {
    const line = profileLine(profile, "en", PROFILE_COPY.en);
    expect(line).toContain("Assessment on record for 3 of 4 courses.");
    expect(line).toContain("Final exam in 2 (PI364 40%, PI390 30%).");
    expect(line).toContain("Coursework only in 1 (PI340).");
    expect(line).toContain("Nothing on record for PI211.");
    expect(line).toContain("Recorded for semester 1, 2026/27.");
  });

  it("says plainly when nothing in the term is on record", () => {
    const none = termAssessmentProfile(["PI211", "PI271"]);
    expect(profileLine(none, "en", PROFILE_COPY.en)).toBe(
      "No assessment facts are on record for PI211 and PI271."
    );
  });

  it("is null for a term with no named course", () => {
    expect(profileLine(termAssessmentProfile([]), "en", PROFILE_COPY.en)).toBeNull();
  });

  it("is written in Thai for Thai readers, with the Buddhist Era year", () => {
    const line = profileLine(profile, "th", PROFILE_COPY.th)!;
    expect(line).toMatch(/[฀-๿]/);
    expect(line).toContain("2569");
    expect(line).not.toMatch(/\{\w+\}/);
  });
});

describe("the examLoad finding", () => {
  const Y3S1: TermRef = { year: 3, kind: "semester1" };
  const planOf = (codes: string[]): StudyPlan => ({
    versionId: "2564-rev2566",
    cohort: "66",
    startYear: 2566,
    minorId: "governance",
    passed: [],
    freeElectiveCreditsPassed: 0,
    terms: [{ term: Y3S1, codes, freeElectiveCredits: 0 }],
  });
  const heavy = (code: string) =>
    ["PI300", "PI320", "PI390", "PI364"].includes(code) ? facts(["Final exam", 50]) : undefined;

  it("raises a note when a term stacks three heavy final exams, citing the recorded term", () => {
    const finding = checkPlan(version, planOf(["PI300", "PI320", "PI390", "PI211"]), {
      assessmentFacts: heavy,
    }).find((f) => f.id === "examLoad:3-semester1");
    expect(finding?.severity).toBe("note");
    expect(finding?.message.en).toContain("3 courses with a final exam worth 40% or more");
    expect(finding?.message.en).toContain("Nothing is on record for PI211, so there may be more");
    expect(finding?.message.th).toContain("PI300");
    expect(finding?.source.provision).toContain("semester 1, 2026/27");
  });

  it("stays quiet with two heavy exams, and with nothing recorded", () => {
    const two = checkPlan(version, planOf(["PI300", "PI320", "PI211"]), { assessmentFacts: heavy });
    expect(two.some((f) => f.id.startsWith("examLoad"))).toBe(false);
    const real = checkPlan(version, planOf(["PI300", "PI320", "PI390"]));
    expect(real.some((f) => f.id.startsWith("examLoad"))).toBe(false);
  });
});
