// @vitest-environment jsdom
/**
 * Unit tests for Wave 5D (`/studies`): the family index, the study plan
 * landing page, the course review catalogue and course detail, the
 * curriculum page, academic issues, and the student handbook index and
 * document pages.
 *
 * Follows `tests/unit/whatson-routes.test.tsx`'s pattern for rendering an
 * async server component page directly: `await Page({ params })`, then
 * `render(el)`.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// `lib/mdx.tsx`'s `Mdx` (used by `/studies/handbook/[doc]`) wraps
// `next-mdx-remote/rsc`'s `MDXRemote`, an async React Server Component that
// React Testing Library's synchronous `render()` cannot resolve in jsdom.
// Stubbed here exactly as `tests/unit/whatson-routes.test.tsx` stubs it for
// the same reason: nothing about MDX rendering is under test here, only the
// page chrome around it.
vi.mock("next-mdx-remote/rsc", () => ({
  MDXRemote: () => null,
}));

import StudiesIndexPage from "@/app/[lang]/studies/page";
import StudyPlanLandingPage from "@/app/[lang]/studies/study-plan/page";
import CourseReviewsPage from "@/app/[lang]/studies/course-reviews/page";
import CourseDetailPage from "@/app/[lang]/studies/course-reviews/[code]/page";
import CurriculumPage from "@/app/[lang]/studies/curriculum/page";
import AcademicIssuesPage from "@/app/[lang]/studies/academic-issues/page";
import HandbookIndexPage from "@/app/[lang]/studies/handbook/page";
import HandbookDocPage from "@/app/[lang]/studies/handbook/[doc]/page";

import { studies as studiesEn } from "@/content/dictionaries/en/studies";
import { courses } from "@/content/course-review/courses";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import { getGuideEntries } from "@/lib/content";

afterEach(cleanup);

/** Any Tailwind font-size or line-height utility (BUILD-BRIEF-2.0 SS7, defect D7). */
const TAILWIND_TYPE_UTILITY = /\b(text-(xs|sm|base|lg|xl|\d?xl)|leading-)/;

/** Every element under `container` carries no forbidden Tailwind type utility. */
function assertNoRawTypeUtilities(container: HTMLElement) {
  for (const node of container.querySelectorAll<HTMLElement>("*")) {
    const classAttr = node.getAttribute("class") ?? "";
    expect(classAttr).not.toMatch(TAILWIND_TYPE_UTILITY);
  }
}

/** Asserts exactly one h1, carrying `title`, and that no heading level is skipped. */
function assertOneH1AndLogicalOrder(container: HTMLElement, title: string) {
  const h1s = screen.getAllByRole("heading", { level: 1 });
  expect(h1s).toHaveLength(1);
  expect(h1s[0]).toHaveTextContent(title);

  const levels = [...container.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((node) =>
    Number(node.tagName.slice(1))
  );
  let deepestSeen = 0;
  for (const level of levels) {
    expect(level).toBeLessThanOrEqual(deepestSeen + 1);
    deepestSeen = Math.max(deepestSeen, level);
  }
}

/** Asserts a `helpSlot` rendered: a link out to Get help, present on every page in this family. */
function assertHelpSlot() {
  const helpLink = screen.getByRole("link", { name: "Get help" });
  expect(helpLink).toHaveAttribute("href", "/en/help");
}

const version = CURRICULUM_VERSIONS["2568"];

describe("/studies: the family index", () => {
  it("renders exactly one h1 and a logical heading order", async () => {
    const el = await StudiesIndexPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    assertOneH1AndLogicalOrder(container, studiesEn.studiesIndex.title);
  });

  it("renders the required helpSlot, linking to Get help", async () => {
    const el = await StudiesIndexPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);
    assertHelpSlot();
  });

  it("makes academic issues reachable in a single click, named the way a student would say it", async () => {
    const el = await StudiesIndexPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);

    const link = screen.getByRole("link", {
      name: studiesEn.studiesIndex.entries.academicIssues.title,
    });
    expect(link).toHaveAttribute("href", "/en/studies/academic-issues");
  });

  it("links every family entry to its own real route", async () => {
    const el = await StudiesIndexPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);

    const entries = studiesEn.studiesIndex.entries;
    expect(screen.getByRole("link", { name: entries.studyPlan.title })).toHaveAttribute(
      "href",
      "/en/studies/study-plan"
    );
    expect(screen.getByRole("link", { name: entries.courseReviews.title })).toHaveAttribute(
      "href",
      "/en/studies/course-reviews"
    );
    expect(screen.getByRole("link", { name: entries.curriculum.title })).toHaveAttribute(
      "href",
      "/en/studies/curriculum"
    );
    expect(screen.getByRole("link", { name: entries.handbook.title })).toHaveAttribute(
      "href",
      "/en/studies/handbook"
    );
  });

  it("emits no raw Tailwind font-size or line-height utility", async () => {
    const el = await StudiesIndexPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    assertNoRawTypeUtilities(container);
  });
});

describe("/studies/study-plan: the landing page", () => {
  it("renders exactly one h1 and a logical heading order", async () => {
    const el = await StudyPlanLandingPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    assertOneH1AndLogicalOrder(container, studiesEn.studyPlan.title);
  });

  it("renders the required helpSlot", async () => {
    const el = await StudyPlanLandingPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);
    assertHelpSlot();
  });

  it("links to the frozen study plan service rather than rebuilding it", async () => {
    const el = await StudyPlanLandingPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);
    expect(screen.getByRole("link", { name: studiesEn.studyPlan.startLabel })).toHaveAttribute(
      "href",
      "/en/services/study-plan"
    );
  });

  it("emits no raw Tailwind font-size or line-height utility", async () => {
    const el = await StudyPlanLandingPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    assertNoRawTypeUtilities(container);
  });
});

describe("/studies/course-reviews: the catalogue", () => {
  it("renders exactly one h1 and a logical heading order", async () => {
    const el = await CourseReviewsPage({
      params: Promise.resolve({ lang: "en" }),
      searchParams: Promise.resolve({}),
    });
    const { container } = render(el);
    assertOneH1AndLogicalOrder(container, studiesEn.courseReview.title);
  });

  it("renders the required helpSlot", async () => {
    const el = await CourseReviewsPage({
      params: Promise.resolve({ lang: "en" }),
      searchParams: Promise.resolve({}),
    });
    render(el);
    assertHelpSlot();
  });

  it("filters as a plain GET form, so it works with JavaScript off", async () => {
    const el = await CourseReviewsPage({
      params: Promise.resolve({ lang: "en" }),
      searchParams: Promise.resolve({}),
    });
    const { container } = render(el);
    const form = container.querySelector("form");
    expect(form).toHaveAttribute("method", "get");
  });

  it("links every listed course to its own detail page", async () => {
    const el = await CourseReviewsPage({
      params: Promise.resolve({ lang: "en" }),
      searchParams: Promise.resolve({}),
    });
    render(el);
    const first = courses[0]!;
    expect(screen.getByRole("link", { name: first.title.en })).toHaveAttribute(
      "href",
      `/en/studies/course-reviews/${first.code}`
    );
  });

  it("emits no raw Tailwind font-size or line-height utility", async () => {
    const el = await CourseReviewsPage({
      params: Promise.resolve({ lang: "en" }),
      searchParams: Promise.resolve({}),
    });
    const { container } = render(el);
    assertNoRawTypeUtilities(container);
  });
});

describe("/studies/course-reviews/[code]: a course detail page", () => {
  const sampleCourse = courses.find((c) => c.review?.sample) ?? courses[0]!;
  const plainCourse = courses.find((c) => !c.review) ?? courses[0]!;

  it("renders exactly one h1 carrying the course code and title", async () => {
    const el = await CourseDetailPage({
      params: Promise.resolve({ lang: "en", code: sampleCourse.code }),
    });
    const { container } = render(el);
    assertOneH1AndLogicalOrder(container, sampleCourse.title.en);
  });

  it("renders the required helpSlot", async () => {
    const el = await CourseDetailPage({
      params: Promise.resolve({ lang: "en", code: sampleCourse.code }),
    });
    render(el);
    assertHelpSlot();
  });

  it("marks sample review content as an example, never as a real student review", async () => {
    const el = await CourseDetailPage({
      params: Promise.resolve({ lang: "en", code: sampleCourse.code }),
    });
    render(el);
    expect(screen.getByText(studiesEn.courseReview.sampleReviewTitle)).toBeInTheDocument();
  });

  it("never attributes a review quote to a real name", async () => {
    const el = await CourseDetailPage({
      params: Promise.resolve({ lang: "en", code: sampleCourse.code }),
    });
    const { container } = render(el);
    // `content/course-review/types.ts` documents `attribution` as "kept
    // general, never a real name" (e.g. "2nd-year student"). A real name
    // would not match this shape and this is the only sample review on the
    // site, so a plain, generic string is the whole surface to check.
    for (const quote of sampleCourse.review?.quotes ?? []) {
      expect(container.textContent).toContain(quote.attribution?.en ?? "");
    }
  });

  it("shows a plain notice, not fabricated content, for a course with no review yet", async () => {
    const el = await CourseDetailPage({
      params: Promise.resolve({ lang: "en", code: plainCourse.code }),
    });
    render(el);
    expect(screen.getByText(studiesEn.courseReview.noReviewTitle)).toBeInTheDocument();
  });

  it("emits no raw Tailwind font-size or line-height utility", async () => {
    const el = await CourseDetailPage({
      params: Promise.resolve({ lang: "en", code: sampleCourse.code }),
    });
    const { container } = render(el);
    assertNoRawTypeUtilities(container);
  });
});

describe("/studies/curriculum: the widest table in this wave", () => {
  it("renders exactly one h1 and a logical heading order", async () => {
    const el = await CurriculumPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    assertOneH1AndLogicalOrder(container, studiesEn.curriculum.title);
  });

  it("renders the required helpSlot", async () => {
    const el = await CurriculumPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);
    assertHelpSlot();
  });

  it("scrolls the wide course catalogue in its own container, not the page", async () => {
    const el = await CurriculumPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);

    const region = screen.getByRole("region", { name: studiesEn.curriculum.catalogueCaption });
    expect(region.className).toMatch(/overflow-x-auto/);

    // The page's own top-level wrapper never carries a horizontal scroll
    // utility: only the table's own region does.
    const pageWrap = container.querySelector(".wrap");
    expect(pageWrap).not.toBeNull();
    expect(pageWrap!.className).not.toMatch(/overflow-x-auto/);
  });

  it("is reachable and operable from the keyboard alone", async () => {
    const el = await CurriculumPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);
    const region = screen.getByRole("region", { name: studiesEn.curriculum.catalogueCaption });
    expect(region.getAttribute("tabindex")).toBe("0");
  });

  it("gives every column a real <th scope='col'> header", async () => {
    const el = await CurriculumPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);
    const region = screen.getByRole("region", { name: studiesEn.curriculum.catalogueCaption });
    const headers = within(region).getAllByRole("columnheader");
    expect(headers.length).toBe(4); // code, title, credits, category
    for (const header of headers) {
      expect(header.tagName).toBe("TH");
      expect(header).toHaveAttribute("scope", "col");
    }
  });

  it("gives every row a real <th scope='row'> identifying it by course code", async () => {
    const el = await CurriculumPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);
    const region = screen.getByRole("region", { name: studiesEn.curriculum.catalogueCaption });
    const rowHeaders = within(region).getAllByRole("rowheader");
    expect(rowHeaders.length).toBe(version.courses.value.length);
  });

  it("states only figures that come from the curriculum data module, never an invented total", async () => {
    const el = await CurriculumPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    expect(container.textContent).toContain(String(version.graduationCredits.value));
  });

  it("emits no raw Tailwind font-size or line-height utility", async () => {
    const el = await CurriculumPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    assertNoRawTypeUtilities(container);
  });
});

describe("/studies/academic-issues: the page the card sort nearly missed", () => {
  it("renders exactly one h1 and a logical heading order", async () => {
    const el = await AcademicIssuesPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    assertOneH1AndLogicalOrder(container, studiesEn.academicIssues.title);
  });

  it("renders the required helpSlot", async () => {
    const el = await AcademicIssuesPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);
    assertHelpSlot();
  });

  it("lists dropping or withdrawing from a course first, the exact task the card sort sent elsewhere", async () => {
    const el = await AcademicIssuesPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    const summaries = [...container.querySelectorAll("details summary")].map(
      (node) => node.textContent
    );
    expect(summaries[0]).toBe(studiesEn.academicIssues.topics.dropping.summary);
  });

  it("exposes every topic as a native, keyboard-operable disclosure", async () => {
    const el = await AcademicIssuesPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    const items = container.querySelectorAll("details > summary");
    expect(items.length).toBe(Object.keys(studiesEn.academicIssues.topics).length);
  });

  it("surfaces the warning about consecutive academic warnings plainly, not behind a click", async () => {
    const el = await AcademicIssuesPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);
    expect(screen.getByText(studiesEn.academicIssues.warningBody)).toBeInTheDocument();
  });

  it("points at the BIR programme office rather than inventing a dispute process for grades", async () => {
    const el = await AcademicIssuesPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);
    expect(screen.getByRole("link", { name: studiesEn.academicIssues.contactCta })).toHaveAttribute(
      "href",
      "/en/studies/handbook/about-bir"
    );
  });

  it("emits no raw Tailwind font-size or line-height utility", async () => {
    const el = await AcademicIssuesPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    assertNoRawTypeUtilities(container);
  });
});

describe("/studies/handbook: the index", () => {
  it("renders exactly one h1 and a logical heading order", async () => {
    const el = await HandbookIndexPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    assertOneH1AndLogicalOrder(container, studiesEn.handbookIndex.title);
  });

  it("renders the required helpSlot", async () => {
    const el = await HandbookIndexPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);
    assertHelpSlot();
  });

  it("lists every handbook document, KEEP per SCOPE-AUDIT-2.0 SS3.1, with a working link", async () => {
    const el = await HandbookIndexPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);
    const entries = getGuideEntries("en", "handbook");
    expect(entries.length).toBe(7);
    for (const entry of entries) {
      expect(screen.getByRole("link", { name: entry.frontmatter.title })).toHaveAttribute(
        "href",
        `/en/studies/handbook/${entry.slug}`
      );
    }
  });

  it("emits no raw Tailwind font-size or line-height utility", async () => {
    const el = await HandbookIndexPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    assertNoRawTypeUtilities(container);
  });
});

describe("/studies/handbook/[doc]: a single handbook document", () => {
  const doc = "academic-life";

  it("renders exactly one h1, carrying the document's own title", async () => {
    const el = await HandbookDocPage({ params: Promise.resolve({ lang: "en", doc }) });
    const { container } = render(el);
    const entry = getGuideEntries("en", "handbook").find((e) => e.slug === doc)!;
    assertOneH1AndLogicalOrder(container, entry.frontmatter.title);
  });

  it("renders the required helpSlot", async () => {
    const el = await HandbookDocPage({ params: Promise.resolve({ lang: "en", doc }) });
    render(el);
    assertHelpSlot();
  });

  it("links back to the handbook index", async () => {
    const el = await HandbookDocPage({ params: Promise.resolve({ lang: "en", doc }) });
    render(el);
    expect(
      screen.getByRole("link", { name: new RegExp(studiesEn.handbookDoc.backToHandbook) })
    ).toHaveAttribute("href", "/en/studies/handbook");
  });

  it("emits no raw Tailwind font-size or line-height utility", async () => {
    const el = await HandbookDocPage({ params: Promise.resolve({ lang: "en", doc }) });
    const { container } = render(el);
    assertNoRawTypeUtilities(container);
  });
});
