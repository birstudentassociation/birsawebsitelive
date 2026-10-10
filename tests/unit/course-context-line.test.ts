import { describe, expect, it } from "vitest";
import { courses } from "@/content/course-review/courses";
import type { AssessmentFacts } from "@/content/course-review/types";
import { assessmentShape, courseContext, courseContextLine } from "@/lib/course-review/context";
import { buildPlanLinkCopy } from "@/components/study-plan/planLinkCopy";

const en = buildPlanLinkCopy("en").picker;
const th = buildPlanLinkCopy("th").picker;

const facts = (weights: [string, number][]): AssessmentFacts => ({
  term: { year: 2569, semester: 1 },
  weights: weights.map(([label, weight]) => ({ label: { en: label, th: label }, weight })),
});

describe("assessmentShape", () => {
  it("names the final exam with its weight", () => {
    expect(
      assessmentShape(
        facts([
          ["Final exam", 50],
          ["Essay", 50],
        ]),
        en
      )
    ).toBe("Final exam 50%");
  });

  it("claims coursework only when the weights add up to the whole grade and none is an exam", () => {
    expect(
      assessmentShape(
        facts([
          ["Essay", 60],
          ["Presentation", 40],
        ]),
        en
      )
    ).toBe("Coursework only");
  });

  it("says nothing for a partial record, which could be hiding an exam", () => {
    expect(assessmentShape(facts([["Essay", 60]]), en)).toBeNull();
  });

  it("says nothing when there is an exam but not a final one, rather than guessing", () => {
    expect(
      assessmentShape(
        facts([
          ["Midterm exam", 40],
          ["Essay", 60],
        ]),
        en
      )
    ).toBeNull();
  });

  it("says nothing without recorded weights", () => {
    expect(assessmentShape(undefined, en)).toBeNull();
    expect(assessmentShape({ term: { year: 2569, semester: 1 } }, en)).toBeNull();
    expect(assessmentShape(facts([]), en)).toBeNull();
  });
});

describe("courseContextLine", () => {
  it("gives assessment shape and instructors for a course that has both", () => {
    const line = courseContextLine("PI364", "en", en);
    expect(line).toContain("Final exam 40%");
    expect(line).toContain("Taught by");
  });

  it("is written in the page's language", () => {
    expect(courseContextLine("PI364", "th", th)).toContain("สอบปลายภาค 40%");
    expect(courseContextLine("PI364", "th", th)).toContain("ผู้สอน");
  });

  it("never mentions student reviews while the only review is a sample", () => {
    const sampleOnly = courses.filter((c) => c.reviews?.length && c.reviews.every((r) => r.sample));
    expect(sampleOnly.length).toBeGreaterThan(0);
    for (const course of sampleOnly) {
      expect(courseContextLine(course.code, "en", en) ?? "", course.code).not.toContain(
        "Student reviews"
      );
    }
  });

  it("mentions student reviews once a non-sample review exists", () => {
    // No real review exists in the catalogue yet, so use a copy of a course
    // with its sample review replaced by a real one.
    const base = courses.find((c) => c.reviews?.length)!;
    const sampleReview = base.reviews![0]!;
    const withReal = { ...base, reviews: [{ ...sampleReview, sample: false }] };
    const withSample = { ...base, reviews: [{ ...sampleReview, sample: true }] };
    expect(courseContext(withReal, "en", en)).toContain("Student reviews");
    expect(courseContext(withSample, "en", en) ?? "").not.toContain("Student reviews");
    // Never a count, a score or a summary of what the reviews say.
    expect(courseContext(withReal, "en", en)).not.toMatch(/\d+ (reviews|students)/);
  });

  it("is null for a course with nothing to say, and for a code with no catalogue entry", () => {
    const bare = courses.find((c) => !c.assessmentFacts && !c.instructors?.length);
    if (bare) expect(courseContextLine(bare.code, "en", en)).toBeNull();
    expect(courseContextLine("TU104", "en", en)).toBeNull();
    expect(courseContextLine("ZZ999", "en", en)).toBeNull();
  });

  it("states facts and never a score", () => {
    for (const course of courses) {
      const line = courseContextLine(course.code, "en", en);
      if (line)
        expect(line, course.code).not.toMatch(/\b(stars?|rating|rated|score|difficulty)\b/i);
    }
  });
});
