import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The screens that read published reviews, checked at the source: no test
 * harness here renders a page that needs cookies and a database, so (as
 * study-plan-disclosure.test.ts does for the inference notice) these look for
 * the calls that must be there. A page that stopped passing the published
 * reviews on would otherwise quietly fall back to the repository's alone.
 */
const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), "utf8");

describe("published reviews reach every screen that counts reviews", () => {
  it("reads them once on the plan screen and passes them to the findings, the lines and the shortlists", () => {
    const source = read("app/[lang]/services/study-plan/plan/page.tsx");
    expect(source).toContain("listPublishedReviewsByCourse()");
    expect(source).toContain("checkPlan(version, plan, sources)");
    expect(source).toContain("sources={sources}");
    expect(source).toContain("termWorkloadProfile(plannedTerm?.codes ?? [], sources.reviews)");
    expect(source).toContain("offeringHistory(code, published.get(code) ?? [])");
    expect(source).toContain("shortlistForSlot(");
  });

  it("passes them to the print page's document and the summary emailed to the BIR office", () => {
    expect(read("app/[lang]/services/study-plan/plan/print/page.tsx")).toContain(
      "findingSourcesFor(await listPublishedReviewsByCourse())"
    );
    expect(read("app/[lang]/services/study-plan/plan/page.tsx")).toContain(
      "findingSources={sources}"
    );
  });

  it("gives the catalogue page the codes, with the course pages' hourly revalidation", () => {
    const source = read("app/[lang]/student-life/course-reviews/page.tsx");
    expect(source).toContain("export const revalidate = 3600;");
    expect(source).toContain("await listPublishedReviewCodes()");
    expect(source).toContain("publishedReviewCodes={publishedReviewCodes}");
    expect(read("app/[lang]/student-life/course-reviews/[code]/page.tsx")).toContain(
      "export const revalidate = 3600;"
    );
  });

  it("shows the reminder on the plan screen and in the course panel only when the review form is live", () => {
    const plan = read("app/[lang]/services/study-plan/plan/page.tsx");
    expect(plan).toContain("const reviewFormLive = await isCourseReviewLive();");
    expect(plan).toContain("live={reviewFormLive}");
    expect(read("app/[lang]/student-life/course-reviews/[code]/page.tsx")).toContain(
      "reviewLive={collecting}"
    );
  });

  it("offers the elective opt-in on the plan screen only when its table exists, not merely when a database is set", () => {
    const plan = read("app/[lang]/services/study-plan/plan/page.tsx");
    expect(plan).toContain("const demandLive = await isElectiveDemandLive();");
    expect(plan).toContain("demandLive={demandLive}");
    for (const source of [plan, read("components/study-plan/PlanOutreach.tsx")]) {
      expect(source).not.toContain("isCourseReviewConfigured");
      expect(source).not.toContain("isElectiveDemandConfigured");
    }
  });

  it("keeps the shared view free of the database, because its plan never reaches the server", () => {
    for (const file of [
      "components/study-plan/SharedPlanView.tsx",
      "components/study-plan/PlanDocument.tsx",
    ]) {
      const source = read(file);
      expect(source, file).not.toContain("course-review/published");
      expect(source, file).not.toContain("inventory/db");
    }
  });
});
