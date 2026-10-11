// @vitest-environment jsdom
/**
 * The shell of the read-only shared plan page: never indexed, the same for
 * every visitor (so the plan cannot be in it), and honest with a reader who
 * has JavaScript off about what to do instead.
 */
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NOT_FOUND");
  },
}));

import SharedStudyPlanPage, { generateMetadata } from "@/app/[lang]/services/study-plan/view/page";
import sitemap from "@/app/sitemap";

const params = (lang: string) => ({ params: Promise.resolve({ lang }) });

describe("/services/study-plan/view", () => {
  it("is not indexed, in either language", async () => {
    for (const lang of ["en", "th"]) {
      const metadata = await generateMetadata(params(lang));
      expect(metadata.robots, lang).toEqual({ index: false, follow: false });
    }
  });

  it("is not in the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls.filter((url) => url.includes("study-plan/view"))).toEqual([]);
  });

  it("renders the same markup whatever the request, because the plan is only in the fragment", async () => {
    const first = renderToStaticMarkup(await SharedStudyPlanPage(params("en")));
    const second = renderToStaticMarkup(await SharedStudyPlanPage(params("en")));
    expect(first).toBe(second);
    // The server renders no plan: the island draws nothing until it has read the fragment.
    expect(first).not.toContain("Terms you have planned");
    expect(first).not.toMatch(/PI\d{3}/);
  });

  it("explains, for a reader without JavaScript, that the print page is the route that works", async () => {
    const html = renderToStaticMarkup(await SharedStudyPlanPage(params("en")));
    const noscript = /<noscript>(.*?)<\/noscript>/s.exec(html)?.[1] ?? "";
    expect(noscript).toContain("This page needs JavaScript");
    expect(noscript).toMatch(/print page of the study plan service/);
    expect(noscript).toMatch(/send you the printout or a PDF/);
    expect(noscript).toContain('href="/en/services/study-plan"');
  });

  it("says the same in Thai", async () => {
    const html = renderToStaticMarkup(await SharedStudyPlanPage(params("th")));
    const noscript = /<noscript>(.*?)<\/noscript>/s.exec(html)?.[1] ?? "";
    expect(noscript).toContain("หน้านี้ต้องใช้ JavaScript");
    expect(noscript).toContain('href="/th/services/study-plan"');
  });

  it("404s for a language the site does not have", async () => {
    await expect(SharedStudyPlanPage(params("fr"))).rejects.toThrow("NOT_FOUND");
  });
});
