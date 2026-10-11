/**
 * The line a course page shows once enough students have planned the course
 * for a term: "Planned by 20 or more students for <term>". The page asks the
 * store for terms, gets terms, and prints the band; there is no count for it
 * to print. With no terms, or no database, the page is as it was.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { AcademicTerm } from "@/content/course-review/types";

const demand = vi.hoisted(() => ({ terms: [] as AcademicTerm[], asked: [] as string[] }));

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("not-found");
  },
}));
vi.mock("@/lib/course-review/published", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/course-review/published")>();
  return { ...actual, listPublishedReviews: async () => [] };
});
vi.mock("@/lib/elective-demand/store", () => ({
  listDemandTerms: async (code: string) => {
    demand.asked.push(code);
    return demand.terms;
  },
}));

import CourseDetailPage, { revalidate } from "@/app/[lang]/student-life/course-reviews/[code]/page";

async function render(lang: string, code = "PI364"): Promise<string> {
  const page = await CourseDetailPage({ params: Promise.resolve({ lang, code }) });
  return renderToStaticMarkup(page);
}

beforeEach(() => {
  demand.terms = [];
  demand.asked = [];
  vi.stubEnv("POSTGRES_URL", "");
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe("elective demand on a course page", () => {
  it("is regenerated hourly, so the line appears and goes without a deploy", () => {
    expect(revalidate).toBe(3600);
  });

  it("asks for this course only", async () => {
    await render("en");
    expect(demand.asked).toEqual(["PI364"]);
  });

  it("says nothing when no term qualifies", async () => {
    const html = await render("en");
    expect(html).not.toContain("Planned by");
    expect(html).not.toContain("Student interest");
  });

  it("states the band for each qualifying term, in English", async () => {
    demand.terms = [
      { year: 2569, semester: 2 },
      { year: 2570, semester: 1 },
    ];
    const html = await render("en");
    expect(html).toContain("Student interest");
    expect(html).toContain("Planned by 20 or more students for Semester 2, 2026/27.");
    expect(html).toContain("Planned by 20 or more students for Semester 1, 2027/28.");
  });

  it("states it in Thai for Thai readers", async () => {
    demand.terms = [{ year: 2569, semester: 2 }];
    const html = await render("th");
    expect(html).toContain("ความสนใจของนักศึกษา");
    expect(html).toContain(
      "มีนักศึกษาวางแผนเรียนวิชานี้ในภาคเรียนที่ 2 ปีการศึกษา 2569 ตั้งแต่ 20 คนขึ้นไป"
    );
    expect(html).not.toContain("Planned by");
  });

  it("explains the band, and never prints a count", async () => {
    demand.terms = [{ year: 2569, semester: 2 }];
    const html = await render("en");
    expect(html).toContain("never shows the exact number");
    expect(html).toContain("not a promise that the course will run");
    // The only numbers in the line are the threshold, the semester and the year.
    const line = /Planned by[^<]*/.exec(html)![0];
    expect(line.match(/\d+/g)).toEqual(["20", "2", "2026", "27"]);
  });

  it("is on a facts-only page too, for a course outside the catalogue", async () => {
    demand.terms = [{ year: 2569, semester: 2 }];
    const html = await render("en", "TU100");
    expect(html).toContain("Planned by 20 or more students for Semester 2, 2026/27.");
  });
});
