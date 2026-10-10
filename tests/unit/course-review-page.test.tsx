/**
 * The reviews section of a course page: published reviews merged with the
 * repository's, the freshness notes, the workload distribution in words, and
 * the "Write a review" link that replaces the /contact invitation once the
 * database is connected.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { Instructor, StudentReview } from "@/content/course-review/types";

const published = vi.hoisted(() => ({ reviews: [] as unknown[] }));

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("not-found");
  },
}));
vi.mock("@/lib/course-review/published", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/course-review/published")>();
  return { ...actual, listPublishedReviews: async () => published.reviews };
});

import CourseDetailPage, { revalidate } from "@/app/[lang]/student-life/course-reviews/[code]/page";
import { courses } from "@/content/course-review/courses";
import { currentTerm } from "@/lib/course-review/terms";

// A catalogue course with named instructors and no reviews of its own.
const course = courses.find((c) => (c.instructors?.length ?? 0) > 0 && !c.reviews)!;
const OTHER: Instructor = { name: { en: "Dr. Someone Else", th: "ดร.คนอื่น" } };

async function render(lang: string, code = course.code): Promise<string> {
  const page = await CourseDetailPage({ params: Promise.resolve({ lang, code }) });
  return renderToStaticMarkup(page);
}

function review(overrides: Partial<StudentReview> = {}): StudentReview {
  const now = currentTerm(new Date());
  return {
    reviewCount: 8,
    term: { year: now.year - 1, semester: 1 },
    instructor: course.instructors![0],
    workload: { en: "A steady workload.", th: "ภาระงานสม่ำเสมอ" },
    assessmentStyle: { en: "Two essays.", th: "เรียงความสองชิ้น" },
    tips: [{ en: "Start early.", th: "เริ่มแต่เนิ่น ๆ" }],
    ...overrides,
  };
}

beforeEach(() => {
  published.reviews = [];
  vi.stubEnv("POSTGRES_URL", "");
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe("course page reviews: publication", () => {
  it("is regenerated at least hourly, so published reviews appear without a deploy", () => {
    expect(revalidate).toBe(3600);
  });

  it("renders published reviews from the database", async () => {
    published.reviews = [review()];
    const html = await render("en");
    expect(html).toContain("A steady workload.");
    expect(html).toContain("Based on 8 student reviews");
    expect(html).not.toContain("No student review yet");
  });

  it("renders the same review in Thai for Thai readers", async () => {
    published.reviews = [review()];
    const html = await render("th");
    expect(html).toContain("ภาระงานสม่ำเสมอ");
    expect(html).not.toContain("A steady workload.");
  });

  it("renders the workload bands as a distribution in words, never a number", async () => {
    published.reviews = [review({ workloadBands: { under_3: 1, "3_to_6": 8, over_6: 3 } })];
    const html = await render("en");
    expect(html).toContain("Hours a week students reported");
    expect(html).toContain("8 of 12 students who gave an estimate said 3 to 6 hours a week.");
    expect(html).toContain("1 of 12 students who gave an estimate said under 3 hours a week.");
    expect(html).toContain("They are not an average or a rating.");
    expect(html).not.toMatch(/average (of|workload)|\d+(\.\d+)? hours a week on average/i);
  });

  it("renders the distribution in Thai", async () => {
    published.reviews = [review({ workloadBands: { "3_to_6": 8, over_6: 4 } })];
    const html = await render("th");
    expect(html).toContain("นักศึกษา 8 จาก 12 คนที่ให้ค่าประมาณไว้");
  });

  it("shows no distribution section when nobody gave a band", async () => {
    published.reviews = [review()];
    expect(await render("en")).not.toContain("Hours a week students reported");
  });
});

describe("course page reviews: freshness", () => {
  it("marks a review from more than three academic years ago as dated", async () => {
    const now = currentTerm(new Date());
    published.reviews = [review({ term: { year: now.year - 4, semester: 1 } })];
    const html = await render("en");
    expect(html).toContain("Dated");
    expect(html).toContain("more than three academic years ago");
  });

  it("does not mark a review from three academic years ago", async () => {
    const now = currentTerm(new Date());
    published.reviews = [review({ term: { year: now.year - 3, semester: 2 } })];
    expect(await render("en")).not.toContain("more than three academic years ago");
  });

  it("says when the reviewed instructor is not among the current instructors", async () => {
    published.reviews = [review({ instructor: OTHER })];
    const html = await render("en");
    expect(html).toContain("Dr. Someone Else");
    expect(html).toContain("is not on the current instructor list for this course");
  });

  it("says so, in Thai, for someone outside the list", async () => {
    published.reviews = [review({ instructor: undefined, instructorElsewhere: true })];
    const html = await render("th");
    expect(html).toContain("ไม่ได้อยู่ในรายชื่อผู้สอนปัจจุบัน");
  });

  it("says nothing when the instructor is still teaching the course", async () => {
    published.reviews = [review()];
    const html = await render("en");
    expect(html).not.toContain("is not on the current instructor list");
    expect(html).not.toContain("not on the current instructor list");
  });
});

describe("course page reviews: the invitation", () => {
  it("keeps the /contact invitation when the database is not connected", async () => {
    const html = await render("en");
    expect(html).toContain("No student review yet");
    expect(html).toContain("get in touch");
    expect(html).not.toContain("Write a review");
  });

  it("links to the review form instead, once the database is connected", async () => {
    vi.stubEnv("POSTGRES_URL", "postgres://example.invalid/db");
    const html = await render("en");
    expect(html).toContain("Write a review");
    expect(html).toContain(`href="/en/student-life/course-reviews/${course.code}/review"`);
    expect(html).toContain(
      "at least 5 students have reviewed the same course, term and instructor"
    );
    expect(html).not.toContain("get in touch");
  });

  it("links to the Thai form from the Thai page", async () => {
    vi.stubEnv("POSTGRES_URL", "postgres://example.invalid/db");
    const html = await render("th");
    expect(html).toContain("เขียนรีวิวรายวิชานี้");
    expect(html).toContain(`href="/th/student-life/course-reviews/${course.code}/review"`);
  });

  it("also offers it under existing reviews", async () => {
    vi.stubEnv("POSTGRES_URL", "postgres://example.invalid/db");
    published.reviews = [review()];
    const html = await render("en");
    expect(html).toContain("Taken this course? You can add your own review.");
    expect(html).toContain(`href="/en/student-life/course-reviews/${course.code}/review"`);
  });

  it("does not offer it under existing reviews when the database is not connected", async () => {
    published.reviews = [review()];
    expect(await render("en")).not.toContain("Taken this course?");
  });
});
