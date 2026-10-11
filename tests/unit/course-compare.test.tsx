import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("not-found");
  },
}));

import CompareCoursesPage, {
  generateMetadata,
} from "@/app/[lang]/student-life/course-reviews/compare/page";
import CourseDetailPage from "@/app/[lang]/student-life/course-reviews/[code]/page";
import type { StudentReview } from "@/content/course-review/types";
import { allCourseCodes } from "@/lib/courses/graph";
import {
  assembleCompare,
  comparableCourses,
  comparePath,
  resolveCompareCode,
} from "@/lib/courses/compare";
import { hasOwnShareImage } from "@/lib/seo";
import sitemap from "@/app/sitemap";

const review = (year: number, semester: 1 | 2 | "summer", reviewCount = 6): StudentReview => ({
  reviewCount,
  term: { year, semester },
  workload: { en: "w", th: "w" },
  assessmentStyle: { en: "a", th: "a" },
  tips: [],
  workloadBands: { "3_to_6": 4, over_6: 2 },
});

describe("resolveCompareCode", () => {
  it("normalises case and spacing", () => {
    expect(resolveCompareCode("pi380")).toBe("PI380");
    expect(resolveCompareCode(" pi 381 ")).toBe("PI381");
  });

  it("accepts any code a curriculum lists, including ones outside the PI catalogue", () => {
    expect(resolveCompareCode("TU104")).toBe("TU104");
    expect(resolveCompareCode("el105")).toBe("EL105");
  });

  it("refuses anything else", () => {
    for (const bad of [
      undefined,
      "",
      "   ",
      "PI999",
      "ZZ123",
      "PI38",
      "380",
      "PI380; drop",
      "<b>PI380",
      "P".repeat(40),
    ]) {
      expect(resolveCompareCode(bad), String(bad)).toBeNull();
    }
  });
});

describe("assembleCompare", () => {
  it("assembles both sides from the graph and the catalogue", () => {
    const result = assembleCompare("PI380", "PI381");
    if (!result.ok) throw new Error("expected a comparison");
    expect(result.a.code).toBe("PI380");
    expect(result.b.code).toBe("PI381");
    for (const side of [result.a, result.b]) {
      expect(side.credits).toBe(3);
      expect(side.version).toBe("2568");
      expect(side.counts.minors.length).toBeGreaterThan(0);
    }
  });

  it("reads prerequisites and unlocks from the curriculum, so they cannot drift", () => {
    const result = assembleCompare("PI280", "PI271");
    if (!result.ok) throw new Error("expected a comparison");
    expect(result.a.prerequisites).toEqual(["PI271"]);
    expect(result.b.unlocks).toContain("PI280");
    expect(result.a.unlocks.length).toBeGreaterThan(5);
  });

  it("states the assessment shape as far as it is recorded, and unknown otherwise", () => {
    const result = assembleCompare("PI364", "PI211");
    if (!result.ok) throw new Error("expected a comparison");
    expect(result.a.assessment.kind).toBe("finalExam");
    expect(result.a.assessment.finalExamWeight).toBe(40);
    expect(result.b.assessment.kind).toBe("unknown");
  });

  it("carries the offering history of each course, derived from recorded terms", () => {
    const result = assembleCompare("PI390", "PI211");
    if (!result.ok) throw new Error("expected a comparison");
    expect(result.a.history?.yearsByKind.semester1).toEqual([2569]);
    expect(result.b.history).toBeNull();
  });

  it("counts the reviews it is given, published ones included, and ignores samples", () => {
    const reviewsOf = (code: string) =>
      code === "PI380" ? [review(2568, 1, 8), { ...review(2566, 1), sample: true }] : [];
    const result = assembleCompare("PI380", "PI381", reviewsOf);
    if (!result.ok) throw new Error("expected a comparison");
    expect(result.a.digest.students).toBe(8);
    expect(result.a.digest.bands?.counts).toEqual({ "3_to_6": 4, over_6: 2 });
    expect(result.b.digest.students).toBe(0);
    // The history includes a term only a published review names.
    expect(result.a.history?.terms).toContainEqual({ year: 2568, semester: 1 });
    expect(result.a.history?.terms).not.toContainEqual({ year: 2566, semester: 1 });
  });

  it("compares a facts-only course with a catalogue course", () => {
    const result = assembleCompare("TU104", "PI380");
    if (!result.ok) throw new Error("expected a comparison");
    expect(result.a.node.catalogue).toBeUndefined();
    expect(result.a.version).toBe("2564");
    expect(result.a.assessment.kind).toBe("unknown");
    expect(result.b.node.catalogue).toBeDefined();
  });

  it("reports a missing code", () => {
    expect(assembleCompare(undefined, "PI380")).toEqual({
      ok: false,
      reason: "missing",
      missing: ["a"],
    });
    expect(assembleCompare("PI380", "  ")).toEqual({
      ok: false,
      reason: "missing",
      missing: ["b"],
    });
    expect(assembleCompare(undefined, undefined)).toEqual({
      ok: false,
      reason: "missing",
      missing: ["a", "b"],
    });
  });

  it("reports an unknown code as typed, never throwing", () => {
    expect(assembleCompare("PI380", "PI999")).toEqual({
      ok: false,
      reason: "unknown",
      unknown: ["PI999"],
    });
    expect(assembleCompare("nope", "also nope")).toEqual({
      ok: false,
      reason: "unknown",
      unknown: ["nope", "also nope"],
    });
  });

  it("refuses to compare a course with itself, even spelled two ways", () => {
    expect(assembleCompare("PI380", "pi 380")).toEqual({
      ok: false,
      reason: "same",
      code: "PI380",
    });
  });
});

describe("comparable courses and the address", () => {
  it("lists every course that has a page, sorted, with a title in the page's language", () => {
    const list = comparableCourses("th");
    expect(list.map((c) => c.code)).toEqual(allCourseCodes());
    expect(list.find((c) => c.code === "PI280")?.title).toMatch(/[฀-๿]/);
    expect(list.find((c) => c.code === "TU104")?.title).toBe(
      "Critical Thinking, Reading, and Writing"
    );
  });

  it("leaves out the course the form is on", () => {
    expect(comparableCourses("en", "PI280").map((c) => c.code)).not.toContain("PI280");
  });

  it("builds the address the page reads", () => {
    expect(comparePath("PI380", "PI381")).toBe(
      "/student-life/course-reviews/compare?a=PI380&b=PI381"
    );
  });
});

describe("the compare page", () => {
  const params = (lang: string) => Promise.resolve({ lang });
  const render = async (lang: string, query: Record<string, string | string[]>) =>
    renderToStaticMarkup(
      await CompareCoursesPage({ params: params(lang), searchParams: Promise.resolve(query) })
    );

  it("is never indexed, because every pair is a thin page", async () => {
    for (const lang of ["en", "th"]) {
      const metadata = await generateMetadata({ params: params(lang) });
      expect(metadata.robots, lang).toEqual({ index: false, follow: true });
    }
  });

  it("is not in the sitemap and does not claim a share image it does not have", () => {
    expect(sitemap().filter((entry) => entry.url.includes("/compare"))).toEqual([]);
    expect(hasOwnShareImage("/student-life/course-reviews/compare")).toBe(false);
    expect(hasOwnShareImage("/student-life/course-reviews/PI280")).toBe(true);
  });

  it("shows two courses side by side with the facts a course page states", async () => {
    const html = await render("en", { a: "PI380", b: "pi 381" });
    expect(html).toContain("<table");
    expect(html).toContain('href="/en/student-life/course-reviews/PI380"');
    expect(html).toContain('href="/en/student-life/course-reviews/PI381"');
    for (const row of [
      "Credits",
      "Counts towards",
      "Prerequisite",
      "Needed for",
      "Recommended term",
      "How it is assessed",
      "Recorded history",
      "Student reviews",
    ]) {
      expect(html, row).toContain(row);
    }
    expect(html).toContain("No student reviews yet.");
  });

  it("states assessment shape and offering history with the history disclosure", async () => {
    const html = await render("en", { a: "PI390", b: "PI364" });
    expect(html).toContain("Final exam worth 30% of the grade.");
    expect(html).toContain("Recorded as taught in semester 1 of 2026/27");
    expect(html).toContain("history, not a promise");
  });

  it("never ranks the two courses", async () => {
    const html = await render("en", { a: "PI380", b: "PI381" });
    expect(html).toContain("not ranked");
    // Apart from the sentence that says so, nothing on the page uses a ranking word.
    const rest = html.replace(/Nothing on this page says one is better than the other\./, "");
    const match = rest.match(/\b(better|best|worse|worst|score|rating)\b/i);
    expect(match?.[0]).toBeUndefined();
  });

  it("works with JavaScript off: a plain GET form to the same page, nothing shown only by script", async () => {
    const html = await render("en", { a: "PI380", b: "PI381" });
    expect(html).toContain('method="get"');
    expect(html).toContain('action="/en/student-life/course-reviews/compare"');
    expect(html).toContain('name="a"');
    expect(html).toContain('name="b"');
    // The plan rows are added in the browser only, so the server markup has none.
    expect(html).not.toContain("For your plan");
  });

  it("explains each invalid request and still offers the form", async () => {
    const missing = await render("en", { a: "PI380" });
    expect(missing).toContain("Choose two courses to compare.");
    expect(missing).not.toContain("<table");
    expect(missing).toContain('name="b"');

    const unknown = await render("en", { a: "PI380", b: "PI999" });
    expect(unknown).toContain("We could not find a course for PI999.");

    const same = await render("en", { a: "PI380", b: "PI380" });
    expect(same).toContain("PI380 is the same course twice.");
  });

  it("does not trust the address: markup in a code is never reflected unescaped", async () => {
    const html = await render("en", { a: "PI380", b: "<script>alert(1)</script>" });
    expect(html).not.toContain("<script>alert(1)");
  });

  it("takes the first value when a parameter is repeated", async () => {
    const html = await render("en", { a: ["PI380", "PI999"], b: "PI381" });
    expect(html).toContain("<table");
  });

  it("reads in Thai", async () => {
    const html = await render("th", { a: "PI380", b: "PI381" });
    expect(html).toContain("เปรียบเทียบสองรายวิชา");
    expect(html).toContain("ยังไม่มีรีวิวจากนักศึกษา");
    expect(html).toContain('href="/th/student-life/course-reviews/PI380"');
  });
});

describe("the link from a course page", () => {
  const renderCourse = async (lang: string, code: string) =>
    renderToStaticMarkup(await CourseDetailPage({ params: Promise.resolve({ lang, code }) }));

  it("is a small GET form that sends the page's course as a, and works without a script", async () => {
    const html = await renderCourse("en", "PI280");
    expect(html).toContain('action="/en/student-life/course-reviews/compare"');
    expect(html).toContain('<input type="hidden" name="a" value="PI280"/>');
    expect(html).toContain('name="b"');
    expect(html).toContain("Compare PI280 with another course");
  });

  it("does not offer a course to compare with itself", async () => {
    const html = await renderCourse("en", "PI280");
    const select = /<select[^>]*name="b"[\s\S]*?<\/select>/.exec(html)?.[0] ?? "";
    expect(select).toContain('value="PI270"');
    expect(select).not.toContain('value="PI280"');
  });

  it("is on a facts-only page too", async () => {
    const html = await renderCourse("th", "TU104");
    expect(html).toContain('name="a" value="TU104"');
    expect(html).toContain("เปรียบเทียบวิชา TU104");
  });
});
