import { describe, expect, it } from "vitest";
import { CURRICULUM_VERSIONS, type TermRef } from "@/content/curriculum";
import {
  suggestForTerm,
  type SuggestedCourse,
  type TermSuggestion,
} from "@/lib/study-plan/suggest";
import type { StudyPlan } from "@/lib/study-plan/plan";

const version = CURRICULUM_VERSIONS["2564"];
const version2568 = CURRICULUM_VERSIONS["2568"];

function planWith(overrides: Partial<StudyPlan> = {}): StudyPlan {
  return {
    versionId: "2564",
    cohort: "64",
    startYear: 2564,
    minorId: "governance",
    passed: [],
    freeElectiveCreditsPassed: 0,
    terms: [],
    ...overrides,
  };
}

function allCourses(suggestion: TermSuggestion): SuggestedCourse[] {
  return suggestion.groups.flatMap((g) => g.courses);
}

function findCourse(suggestion: TermSuggestion, code: string): SuggestedCourse | undefined {
  return allCourses(suggestion).find((c) => c.code === code);
}

describe("suggestForTerm availability", () => {
  it("never offers a course already passed or already placed in any term", () => {
    const plan = planWith({
      passed: ["PI211"],
      terms: [{ term: { year: 2, kind: "semester1" }, codes: ["PI210"], freeElectiveCredits: 0 }],
    });
    const suggestion = suggestForTerm(version, plan, { year: 1, kind: "semester1" });
    const codes = allCourses(suggestion).map((c) => c.code);
    expect(codes).not.toContain("PI211");
    expect(codes).not.toContain("PI210");
  });
});

describe("suggestForTerm recommended grouping", () => {
  it("puts a course the recommended plan names in this term into 'recommended', not its bucket group", () => {
    // TU100 is named in Year 1 semester 1 and belongs to genEdPart1.
    const plan = planWith();
    const suggestion = suggestForTerm(version, plan, { year: 1, kind: "semester1" });

    const recommendedGroup = suggestion.groups.find((g) => g.id === "recommended");
    expect(recommendedGroup?.courses.some((c) => c.code === "TU100")).toBe(true);

    const genEdGroup = suggestion.groups.find((g) => g.id === "genEdPart1");
    expect(genEdGroup).toBeUndefined();
  });

  it("only offers courses the study plan schedules in this term", () => {
    const suggestion = suggestForTerm(
      version2568,
      {
        ...planWith(),
        versionId: "2568",
        cohort: "68",
        startYear: 2568,
      },
      { year: 1, kind: "semester1" }
    );

    // AH208 is an open choice in Year 1 semester 2, not an extra course for
    // the already-full first semester shown in the reported issue.
    expect(findCourse(suggestion, "AH208")).toBeUndefined();
    expect(
      allCourses(suggestion)
        .map((course) => course.code)
        .sort()
    ).toEqual(["EL105", "LAS101", "PI121", "TU100", "TU101", "TU106"]);
  });
});

describe("suggestForTerm bucket satisfaction", () => {
  it("does not turn a satisfied bucket into an off-schedule recommendation", () => {
    // concentrationElectiveArea needs 9 of its 36 available credits (3 of 12
    // courses). Passing exactly 3 satisfies it; the other 9 remain
    // available, and should now land in 'other'.
    const plan = planWith({ passed: ["PI364", "PI365", "PI366"] });
    const suggestion = suggestForTerm(version, plan, { year: 1, kind: "semester1" });

    expect(findCourse(suggestion, "PI367")).toBeUndefined();
  });
});

describe("suggestForTerm prescribed credit load", () => {
  it("stops recommending courses once the term has the scheduled 18 credits", () => {
    const firstSemester = { year: 1, kind: "semester1" } as const;
    const plan: StudyPlan = {
      ...planWith(),
      versionId: "2568",
      cohort: "68",
      startYear: 2568,
      terms: [
        {
          term: firstSemester,
          codes: ["TU100", "TU101", "LAS101", "EL105", "TU106", "PI121"],
          freeElectiveCredits: 0,
        },
      ],
    };

    const suggestion = suggestForTerm(version2568, plan, firstSemester);

    expect(suggestion.recommendedCredits).toBe(18);
    expect(suggestion.recommendedTermComplete).toBe(true);
    expect(suggestion.groups).toEqual([]);
    expect(suggestion.openSlots).toEqual([]);
  });

  it("counts free-elective credits toward a planned free-elective slot", () => {
    const term = { year: 3, kind: "semester2" } as const;
    const courseCodes = ["PI320", "PI380", "PI313", "PI364", "PI365"];
    const partlyFilledPlan = planWith({
      terms: [
        {
          term,
          codes: courseCodes,
          freeElectiveCredits: 0,
        },
      ],
    });

    expect(
      suggestForTerm(version, partlyFilledPlan, term).openSlots.map((slot) => slot.id)
    ).toContain("freeElective2");

    const plan = {
      ...partlyFilledPlan,
      terms: [{ term, codes: courseCodes, freeElectiveCredits: 3 }],
    };
    const suggestion = suggestForTerm(version, plan, term);
    expect(suggestion.recommendedTermComplete).toBe(true);
    expect(suggestion.recommendedCredits).toBe(18);
    expect(suggestion.openSlots).toEqual([]);
  });
});

describe("suggestForTerm missing prerequisites", () => {
  const recommendedTerm: TermRef = { year: 3, kind: "semester1" };

  it("flags a prerequisite placed in the same term as still missing", () => {
    const plan = planWith({
      terms: [{ term: recommendedTerm, codes: ["PI211"], freeElectiveCredits: 0 }],
    });
    const suggestion = suggestForTerm(version, plan, recommendedTerm);
    const pi300 = findCourse(suggestion, "PI300");
    expect(pi300?.missingPrerequisites).toContain("PI211");
  });

  it("clears the prerequisite when it sits in a strictly earlier term", () => {
    const plan = planWith({
      terms: [{ term: { year: 2, kind: "semester2" }, codes: ["PI211"], freeElectiveCredits: 0 }],
    });
    const suggestion = suggestForTerm(version, plan, recommendedTerm);
    const pi300 = findCourse(suggestion, "PI300");
    expect(pi300?.missingPrerequisites).toEqual([]);
  });

  it("clears the prerequisite when it is already passed", () => {
    const plan = planWith({ passed: ["PI211"] });
    const suggestion = suggestForTerm(version, plan, recommendedTerm);
    const pi300 = findCourse(suggestion, "PI300");
    expect(pi300?.missingPrerequisites).toEqual([]);
  });

  it("still offers the course despite the missing prerequisite; findings never block", () => {
    const plan = planWith({
      terms: [{ term: recommendedTerm, codes: ["PI211"], freeElectiveCredits: 0 }],
    });
    const suggestion = suggestForTerm(version, plan, recommendedTerm);
    expect(findCourse(suggestion, "PI300")).toBeDefined();
  });
});

describe("suggestForTerm open slots", () => {
  const summerTerm: TermRef = { year: 2, kind: "summer" };

  it("offers both minor-bucket placeholder slots for an untouched term", () => {
    const plan = planWith();
    const suggestion = suggestForTerm(version, plan, summerTerm);
    const ids = suggestion.openSlots.map((s) => s.id);
    expect(ids).toContain("minorElective1");
    expect(ids).toContain("minorElectiveOther1");
  });

  it("consumes one slot as the student places a course of that bucket into the term", () => {
    // PI313 is a governance elective, so its bucket is minorElective and it
    // fills minorElective1, leaving minorElectiveOther1 open.
    const plan = planWith({
      terms: [{ term: summerTerm, codes: ["PI313"], freeElectiveCredits: 0 }],
    });
    const suggestion = suggestForTerm(version, plan, summerTerm);
    const ids = suggestion.openSlots.map((s) => s.id);
    expect(ids).not.toContain("minorElective1");
    expect(ids).toContain("minorElectiveOther1");
  });

  it("candidates for the minor elective slot are exactly the chosen minor's elective courses", () => {
    const governanceElectives = version.minors.find((m) => m.id === "governance")!.electives;
    const plan = planWith();
    const suggestion = suggestForTerm(version, plan, summerTerm);
    const slot = suggestion.openSlots.find((s) => s.id === "minorElective1");
    expect(slot).toBeDefined();
    const candidateCodes = slot!.candidates.map((c) => c.code).sort();
    expect(candidateCodes).toEqual([...governanceElectives].sort());
  });

  it("offers exactly a named-choice slot's own courses, not the rest of its category", () => {
    // genEdPart2Elective1 (Year 1 semester 2) names only PI131 and PI132, but
    // genEdPart2 also holds PI121 and PI122, which this slot never offered.
    const plan = planWith();
    const suggestion = suggestForTerm(version, plan, { year: 1, kind: "semester2" });
    const slot = suggestion.openSlots.find((s) => s.id === "genEdPart2Elective1");
    expect(slot).toBeDefined();
    expect(slot!.choices).toEqual(["PI131", "PI132"]);
    const candidateCodes = slot!.candidates.map((c) => c.code).sort();
    expect(candidateCodes).toEqual(["PI131", "PI132"]);
  });

  it("a slot without `choices` still offers the whole bucket, unaffected by the named-choice case", () => {
    const governanceElectives = version.minors.find((m) => m.id === "governance")!.electives;
    const plan = planWith();
    const suggestion = suggestForTerm(version, plan, summerTerm);
    const slot = suggestion.openSlots.find((s) => s.id === "minorElective1");
    expect(slot?.choices).toBeUndefined();
    expect(slot!.candidates.length).toBe(governanceElectives.length);
  });
});

describe("suggestForTerm internshipOnly", () => {
  const internshipSummer: TermRef = { year: 3, kind: "summer" };

  it("is true, with no groups and no open slots, for a summer holding the internship", () => {
    const plan = planWith({
      terms: [{ term: internshipSummer, codes: ["PI574"], freeElectiveCredits: 0 }],
    });
    const suggestion = suggestForTerm(version, plan, internshipSummer);
    expect(suggestion.internshipOnly).toBe(true);
    expect(suggestion.groups).toEqual([]);
    expect(suggestion.openSlots).toEqual([]);
  });

  it("is false for the ordinary case, an untouched or normally-filled term", () => {
    const plan = planWith();
    const suggestion = suggestForTerm(version, plan, internshipSummer);
    expect(suggestion.internshipOnly).toBe(false);
  });

  it("is false for a summer term the student has not placed the internship in", () => {
    const plan = planWith({
      terms: [{ term: internshipSummer, codes: [], freeElectiveCredits: 3 }],
    });
    const suggestion = suggestForTerm(version, plan, internshipSummer);
    expect(suggestion.internshipOnly).toBe(false);
  });
});

describe("suggestForTerm group ordering", () => {
  it("orders 'recommended' first and 'other' last", () => {
    // A student-added term has no prescribed sequence, so it keeps the
    // catch-up picker and its category / other grouping.
    const plan = planWith({ passed: ["PI364", "PI365", "PI366"] });
    const suggestion = suggestForTerm(version, plan, { year: 8, kind: "semester1" });

    expect(suggestion.groups.at(-1)?.id).toBe("other");
  });
});
