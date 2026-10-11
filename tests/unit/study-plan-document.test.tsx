import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NOT_FOUND");
  },
  redirect: (to: string) => {
    throw new Error(`REDIRECT ${to}`);
  },
}));

import StudyPlanPrintPage from "@/app/[lang]/services/study-plan/plan/print/page";
import PlanDocument from "@/components/study-plan/PlanDocument";
import { buildStudyPlanCopy } from "@/components/study-plan/studyPlanCopy";
import type { StudentReview } from "@/content/course-review/types";
import { findingSourcesFor } from "@/lib/course-review/reviewSources";
import { serialisePlan, type StudyPlan } from "@/lib/study-plan/plan";

// Cohort 68, so the plan is in the 2568 curriculum. PI364 and PI487 have
// recorded assessment facts, so the print page has assessment lines to show.
const plan: StudyPlan = {
  versionId: "2568",
  cohort: "68",
  startYear: 2568,
  minorId: "governance",
  passed: ["PI121", "PI122", "PI271"],
  freeElectiveCreditsPassed: 3,
  terms: [
    {
      term: { year: 2, kind: "semester1" },
      codes: ["PI280", "PI364", "PI390"],
      freeElectiveCredits: 3,
    },
    { term: { year: 2, kind: "semester2" }, codes: [], freeElectiveCredits: 0 },
    { term: { year: 3, kind: "semester1" }, codes: ["PI487", "PI340"], freeElectiveCredits: 0 },
  ],
};

const params = (lang: string) => Promise.resolve({ lang });
const printHtml = async (lang: "en" | "th") =>
  renderToStaticMarkup(
    await StudyPlanPrintPage({
      params: params(lang),
      searchParams: Promise.resolve({ plan: serialisePlan(plan) }),
    })
  );
const documentHtml = (lang: "en" | "th", props: Partial<Parameters<typeof PlanDocument>[0]> = {}) =>
  renderToStaticMarkup(
    <PlanDocument plan={plan} locale={lang} copy={buildStudyPlanCopy(lang)} {...props} />
  );

/** The headings of a page as "h2 Text" in order, to compare outlines without comparing classes. */
function outline(html: string): string[] {
  return [...html.matchAll(/<h([1-4])[^>]*>(.*?)<\/h\1>/g)].map(
    ([, level, text]) => `h${level} ${text}`
  );
}

/** Text with the tags removed, to compare what a reader reads. */
const textOf = (html: string) =>
  html
    .replace(/<[^>]+>/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

describe("the print page and the advisor's view share one document", () => {
  for (const lang of ["en", "th"] as const) {
    it(`reads the same in ${lang}, section for section`, async () => {
      const copy = buildStudyPlanCopy(lang);
      const print = await printHtml(lang);
      // The shared view is the same component under a title and notice of its own.
      const shared = documentHtml(lang, {
        extraFacts: [{ label: "Shared on", value: "1 January" }],
      });

      const sections = [
        copy.print.passedHeading,
        copy.print.termsHeading,
        copy.print.findingsHeading,
        copy.print.owedHeading,
      ];
      const sectionTexts = (html: string, level: number) =>
        outline(html)
          .filter((line) => line.startsWith(`h${level} `))
          .map((line) => line.slice(3));
      expect(sectionTexts(print, 2)).toEqual(sections);
      expect(sectionTexts(shared, 3)).toEqual(sections);

      // Every course, term total, finding and owed row the shared view reads, the printout reads.
      const printed = textOf(print).join("\n");
      for (const line of textOf(shared)) {
        if (line === "Shared on" || line === "1 January") continue;
        expect(printed, line).toContain(line);
      }
    });
  }

  it("lays the facts out the same way with and without a title, apart from the space under it", async () => {
    expect(await printHtml("en")).toContain('<dl class="grid gap-3 text-sm sm:grid-cols-2 mt-4">');
    expect(documentHtml("en")).toContain('<dl class="grid gap-3 text-sm sm:grid-cols-2">');
  });

  it("gives the print page the document's title as its h1 and sections at h2, with terms at h3", async () => {
    const copy = buildStudyPlanCopy("en");
    const lines = outline(await printHtml("en"));
    expect(lines[0]).toBe(`h1 ${copy.print.title}`);
    expect(lines.filter((l) => l.startsWith("h2 "))).toHaveLength(4);
    expect(lines.filter((l) => l.startsWith("h3 "))).toEqual([
      "h3 Year 2, Semester 1",
      "h3 Year 3, Semester 1",
    ]);
    expect(lines.some((l) => l.startsWith("h4 "))).toBe(false);
  });

  it("gives the shared view no h1 of its own, sections at h3 and terms at h4", () => {
    const lines = outline(documentHtml("en"));
    expect(lines.some((l) => l.startsWith("h1 ") || l.startsWith("h2 "))).toBe(false);
    expect(lines.filter((l) => l.startsWith("h3 "))).toHaveLength(4);
    expect(lines.filter((l) => l.startsWith("h4 "))).toEqual([
      "h4 Year 2, Semester 1",
      "h4 Year 3, Semester 1",
    ]);
  });

  it("puts the generation date on the print page and the sharing date on the shared view", async () => {
    const print = await printHtml("en");
    expect(print).toContain("Generated on");
    const shared = documentHtml("en", { extraFacts: [{ label: "Shared on", value: "1 January" }] });
    expect(shared).toContain("Shared on");
    expect(shared).not.toContain("Generated on");
  });

  it("links every course code to its course page on both", async () => {
    for (const html of [await printHtml("en"), documentHtml("en")]) {
      for (const code of ["PI121", "PI280", "PI364", "PI487"]) {
        expect(html, code).toContain(`href="/en/student-life/course-reviews/${code}"`);
      }
    }
  });

  it("carries the caveat about what the plan does not check, and the inference notice, on both", async () => {
    const copy = buildStudyPlanCopy("en");
    for (const html of [await printHtml("en"), documentHtml("en")]) {
      expect(html).toContain(copy.plan.doesNotCheckHeading);
      for (const item of copy.plan.doesNotCheck)
        expect(html).toContain(item.replace(/'/g, "&#x27;"));
    }
  });

  it("shows each term's assessment line on the print page, which the shared view still does not", async () => {
    const print = await printHtml("en");
    expect(print).toContain("Assessment on record for");
    expect(documentHtml("en")).not.toContain("Assessment on record for");
    // And the shared view can be asked to, which is how the print page gets them.
    expect(documentHtml("en", { termLines: true })).toContain("Assessment on record for");
  });

  it("has no form, button or script in either, because it is a document", async () => {
    for (const html of [await printHtml("th"), documentHtml("th")]) {
      expect(html).not.toMatch(/<form|<button|<script|<input/);
    }
  });

  it("sends a request with no valid plan to the start of the journey", async () => {
    await expect(
      StudyPlanPrintPage({
        params: params("en"),
        searchParams: Promise.resolve({ plan: "nonsense" }),
      })
    ).rejects.toThrow("REDIRECT /en/services/study-plan/minor");
  });
});

describe("the document and published reviews", () => {
  const heavy = (n: number): StudentReview => ({
    reviewCount: n,
    term: { year: 2568, semester: 1 },
    workload: { en: "w", th: "w" },
    assessmentStyle: { en: "a", th: "a" },
    tips: [],
    workloadBands: { over_6: n },
  });
  const published = new Map([
    ["PI280", [heavy(6)]],
    ["PI390", [heavy(7)]],
  ]);

  it("counts them in the findings and the workload line when given sources", () => {
    const html = documentHtml("en", {
      termLines: true,
      sources: findingSourcesFor(published),
    });
    expect(html).toContain("Two courses in this term are reported as over 6 hours a week");
    expect(html).toContain("13 student reports for semester 1, 2025/26");
    expect(html).toContain("most students who gave an estimate report as over 6 hours a week");
  });

  it("leaves them out when no sources are given, as the shared view does", () => {
    const html = documentHtml("en", { termLines: true });
    expect(html).not.toContain("reported as over 6 hours a week");
  });
});
