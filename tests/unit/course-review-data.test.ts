import { describe, expect, it } from "vitest";
import { courses } from "@/content/course-review/courses";
import type { Bi, Instructor, StudentReview } from "@/content/course-review/types";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";

const curriculum = CURRICULUM_VERSIONS["2568"];

/**
 * Subjective qualities are described in words, never scored, so a review may
 * only carry these keys. A numeric rating added later must fail this test.
 */
const ALLOWED_REVIEW_KEYS = new Set<keyof StudentReview>([
  "sample",
  "reviewCount",
  "term",
  "instructor",
  "instructorElsewhere",
  "workload",
  "assessmentStyle",
  "tips",
  "quotes",
  "workloadBands",
]);

/**
 * Catalogue codes the 2568 curriculum data does not list. Each is a known,
 * deliberate difference, not drift. Keep this list exact so a new mismatch fails.
 */
const CODES_MISSING_FROM_CURRICULUM: string[] = [];

/** Curriculum courses the catalogue has no page for, for the same reason. */
const CURRICULUM_CODES_MISSING_FROM_CATALOGUE: string[] = [];

function isNonEmpty(value: Bi | undefined): boolean {
  return value !== undefined && value.en.trim().length > 0 && value.th.trim().length > 0;
}

function instructorsOf(course: (typeof courses)[number]): Instructor[] {
  return [
    ...(course.instructors ?? []),
    ...(course.reviews ?? []).flatMap((review) => (review.instructor ? [review.instructor] : [])),
  ];
}

/** Every bilingual field on a course, labelled for readable failures. */
function biFields(course: (typeof courses)[number]): [string, Bi | undefined][] {
  const fields: [string, Bi | undefined][] = [
    ["title", course.title],
    ["description", course.description],
  ];
  if (course.prerequisite) fields.push(["prerequisite", course.prerequisite]);
  instructorsOf(course).forEach((instructor, i) =>
    fields.push([`instructor ${i}`, instructor.name])
  );
  (course.reviews ?? []).forEach((review, r) => {
    fields.push([`review ${r} workload`, review.workload]);
    fields.push([`review ${r} assessmentStyle`, review.assessmentStyle]);
    review.tips.forEach((tip, i) => fields.push([`review ${r} tip ${i}`, tip]));
    (review.quotes ?? []).forEach((quote, i) => {
      fields.push([`review ${r} quote ${i}`, quote.text]);
      if (quote.attribution) fields.push([`review ${r} quote ${i} attribution`, quote.attribution]);
    });
  });
  const facts = course.assessmentFacts;
  if (facts) {
    (facts.weights ?? []).forEach((c, i) => fields.push([`assessment weight ${i}`, c.label]));
    if (facts.examFormat) fields.push(["assessment examFormat", facts.examFormat]);
    if (facts.attendance) fields.push(["assessment attendance", facts.attendance]);
  }
  return fields;
}

describe("course review catalogue: identity", () => {
  it("is not empty", () => {
    expect(courses.length).toBeGreaterThan(0);
  });

  it("has unique codes in the PI### format", () => {
    const codes = courses.map((c) => c.code);
    expect(new Set(codes).size).toBe(codes.length);
    for (const code of codes) expect(code).toMatch(/^PI\d{3}$/);
  });

  it("is sorted by code ascending", () => {
    const codes = courses.map((c) => c.code);
    expect(codes).toEqual([...codes].sort());
  });
});

describe("course review catalogue: bilingual text", () => {
  it("has non-empty English and Thai in every bilingual field", () => {
    const empty: string[] = [];
    for (const course of courses) {
      for (const [label, value] of biFields(course)) {
        if (!isNonEmpty(value)) empty.push(`${course.code} ${label}`);
      }
    }
    expect(empty).toEqual([]);
  });

  it("gives every review at least one tip", () => {
    for (const course of courses) {
      for (const review of course.reviews ?? []) {
        expect(review.tips.length, course.code).toBeGreaterThan(0);
      }
    }
  });
});

describe("course review catalogue: credits and year", () => {
  it("has a positive integer total", () => {
    for (const { code, credits } of courses) {
      expect(Number.isInteger(credits.total) && credits.total > 0, code).toBe(true);
    }
  });

  it("has a non-negative breakdown", () => {
    for (const { code, credits } of courses) {
      for (const part of [credits.lecture, credits.lab, credits.selfStudy]) {
        expect(Number.isFinite(part) && part >= 0, code).toBe(true);
      }
    }
  });

  it("has year levels between 1 and 4", () => {
    for (const { code, yearLevel } of courses) {
      expect(yearLevel.length, code).toBeGreaterThan(0);
      for (const year of yearLevel) {
        expect(Number.isInteger(year) && year >= 1 && year <= 4, `${code} year ${year}`).toBe(true);
      }
    }
  });
});

describe("course review catalogue: reviews", () => {
  const reviews = courses.flatMap((course) =>
    (course.reviews ?? []).map((review) => ({ code: course.code, review }))
  );

  it("has at least one review so these checks are not vacuous", () => {
    expect(reviews.length).toBeGreaterThan(0);
  });

  it("has a positive integer reviewCount", () => {
    for (const { code, review } of reviews) {
      expect(Number.isInteger(review.reviewCount) && review.reviewCount > 0, code).toBe(true);
    }
  });

  it("has a plausible Buddhist Era year and a valid semester", () => {
    for (const { code, review } of reviews) {
      expect(review.term.year, code).toBeGreaterThanOrEqual(2560);
      expect(review.term.year, code).toBeLessThanOrEqual(2600);
      expect([1, 2, "summer"], code).toContain(review.term.semester);
    }
  });

  it("carries no keys beyond the written-review shape (no numeric ratings)", () => {
    for (const { code, review } of reviews) {
      const extra = Object.keys(review).filter(
        (key) => !ALLOWED_REVIEW_KEYS.has(key as keyof StudentReview)
      );
      expect(extra, code).toEqual([]);
    }
  });

  it("only uses sample as a boolean", () => {
    for (const { code, review } of reviews) {
      if ("sample" in review) expect(typeof review.sample, code).toBe("boolean");
    }
  });
});

describe("course review catalogue: assessment facts", () => {
  const withFacts = courses.filter((course) => course.assessmentFacts);

  it("has weights summing to 100 and no syllabus link", () => {
    for (const course of withFacts) {
      const facts = course.assessmentFacts!;
      expect(facts.term.year, course.code).toBeGreaterThanOrEqual(2560);
      expect([1, 2, "summer"], course.code).toContain(facts.term.semester);
      expect(Object.keys(facts), course.code).not.toContain("sourceUrl");
      if (facts.weights) {
        const total = facts.weights.reduce((sum, c) => sum + c.weight, 0);
        expect(total, course.code).toBe(100);
        for (const c of facts.weights) expect(c.weight, course.code).toBeGreaterThan(0);
      }
    }
  });
});

describe("course review catalogue: instructors", () => {
  it("links only to https pages on polsci.tu.ac.th", () => {
    for (const course of courses) {
      for (const instructor of instructorsOf(course)) {
        if (instructor.profileUrl === undefined) continue;
        const url = new URL(instructor.profileUrl);
        expect(url.protocol, `${course.code} ${instructor.name.en}`).toBe("https:");
        expect(url.hostname, `${course.code} ${instructor.name.en}`).toBe("polsci.tu.ac.th");
      }
    }
  });
});

describe("course review catalogue vs curriculum 2568", () => {
  const curriculumByCode = new Map(curriculum.courses.value.map((c) => [c.code, c]));

  it("lists only codes the curriculum knows, apart from the named exceptions", () => {
    const missing = courses
      .map((c) => c.code)
      .filter((code) => !curriculumByCode.has(code))
      .sort();
    expect(missing).toEqual(CODES_MISSING_FROM_CURRICULUM);
  });

  it("covers every PI course in the curriculum, apart from the named exceptions", () => {
    const catalogue = new Set(courses.map((c) => c.code));
    const missing = curriculum.courses.value
      .map((c) => c.code)
      .filter((code) => /^PI\d{3}$/.test(code) && !catalogue.has(code))
      .sort();
    expect(missing).toEqual(CURRICULUM_CODES_MISSING_FROM_CATALOGUE);
  });

  it("matches the curriculum's credits for every shared code", () => {
    const mismatched = courses
      .filter((c) => curriculumByCode.has(c.code))
      .filter((c) => curriculumByCode.get(c.code)!.credits !== c.credits.total)
      .map((c) => `${c.code} ${c.credits.total} vs ${curriculumByCode.get(c.code)!.credits}`);
    expect(mismatched).toEqual([]);
  });
});
