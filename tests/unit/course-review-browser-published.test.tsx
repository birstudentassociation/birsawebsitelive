// @vitest-environment jsdom
/**
 * The catalogue's "reviewed" badge and filter used to count only the reviews
 * held in the repository. A review published from the database is real
 * feedback and has to count too, or a course with five students behind it
 * would sit in the catalogue looking unreviewed. The catalogue page reads the
 * codes on the server and hands them to the browser as plain data.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { courses } from "@/content/course-review/courses";
import { getDictionary } from "@/lib/i18n";
import {
  DEFAULT_FILTERS,
  filterCourses,
  hasAnyReview,
  type CourseFilters,
} from "@/lib/course-review/filter";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en/student-life/course-reviews",
  useSearchParams: () => new URLSearchParams(),
}));

import CourseReviewBrowser, {
  CourseReviewBrowserFallback,
  type CourseReviewDict,
} from "@/components/course-review/CourseReviewBrowser";
import { buildPlanLinkCopy } from "@/components/study-plan/planLinkCopy";
import { minorMembers } from "@/lib/course-review/facts";

afterEach(cleanup);

const reviewedOnly: CourseFilters = { ...DEFAULT_FILTERS, reviewed: true };
const codesOf = (list: { code: string }[]) => list.map((c) => c.code);

// PI270 carries no review of its own, and PI121 carries only a sample one.
const WITHOUT_REVIEWS = "PI270";

describe("the reviewed filter with published reviews", () => {
  it("leaves out a course with no review of its own when nothing is published", () => {
    expect(codesOf(filterCourses(courses, reviewedOnly))).not.toContain(WITHOUT_REVIEWS);
    expect(
      codesOf(filterCourses(courses, reviewedOnly, { publishedReviewCodes: [] }))
    ).not.toContain(WITHOUT_REVIEWS);
  });

  it("keeps a course whose review is published from the database", () => {
    const result = filterCourses(courses, reviewedOnly, {
      publishedReviewCodes: [WITHOUT_REVIEWS],
    });
    expect(codesOf(result)).toContain(WITHOUT_REVIEWS);
  });

  it("still keeps the courses whose reviews are in the repository", () => {
    const result = filterCourses(courses, reviewedOnly, {
      publishedReviewCodes: [WITHOUT_REVIEWS],
    });
    expect(codesOf(result)).toContain("PI121");
    expect(result.length).toBe(filterCourses(courses, reviewedOnly).length + 1);
  });

  it("does nothing to the list when the filter is off", () => {
    expect(
      filterCourses(courses, DEFAULT_FILTERS, { publishedReviewCodes: [WITHOUT_REVIEWS] })
    ).toEqual(courses);
  });

  it("ignores a published code for a course the catalogue does not hold", () => {
    const result = filterCourses(courses, reviewedOnly, { publishedReviewCodes: ["TU105"] });
    expect(codesOf(result)).not.toContain("TU105");
    expect(result.length).toBe(filterCourses(courses, reviewedOnly).length);
  });

  it("answers hasAnyReview from either source", () => {
    const course = courses.find((c) => c.code === WITHOUT_REVIEWS)!;
    expect(hasAnyReview(course, new Set())).toBe(false);
    expect(hasAnyReview(course, new Set([WITHOUT_REVIEWS]))).toBe(true);
    expect(
      hasAnyReview(
        courses.find((c) => c.code === "PI121")!,
        new Set()
      )
    ).toBe(true);
  });
});

describe("the reviewed badge", () => {
  const dict = getDictionary("en");
  const t = dict.courseReview;
  const browserDict: CourseReviewDict = {
    browseHeading: t.browseHeading,
    searchLabel: dict.actions.search,
    searchPlaceholder: t.searchPlaceholder,
    trackLabel: t.trackLabel,
    allTracks: t.allTracks,
    categoryLabel: dict.actions.category,
    allCategories: dict.actions.allCategories,
    yearFilterLabel: t.yearFilterLabel,
    allYears: t.allYears,
    reviewedFilterLabel: t.reviewedFilterLabel,
    showing: dict.actions.showing,
    result: dict.actions.result,
    results: dict.actions.results,
    noResults: dict.actions.noResults,
    clearFilters: dict.actions.clearFilters,
    tracks: t.tracks,
    categories: t.categories,
    credits: t.credits,
    yearLabel: t.yearLabel,
    yearTo: t.yearTo,
    prerequisite: t.prerequisite,
    instructor: t.instructorsHeading,
    reviewedBadge: t.reviewedBadge,
    sampleBadge: t.sampleBadge,
    previous: t.previous,
    next: t.next,
    pageOf: t.pageOf,
  };

  /** The text of the card for a course, found by its code. */
  function cardText(container: HTMLElement, code: string): string {
    const card = [...container.querySelectorAll("div.group")].find((el) =>
      el.textContent?.includes(code)
    );
    return card?.textContent ?? "";
  }

  const renderBrowser = (publishedReviewCodes: string[], first = courses.slice(0, 12)) =>
    render(
      <CourseReviewBrowser
        courses={first}
        locale="en"
        dict={browserDict}
        minorOptions={[]}
        minorMembers={minorMembers()}
        planCopy={buildPlanLinkCopy("en").browser}
        publishedReviewCodes={publishedReviewCodes}
      />
    );

  it("marks a course reviewed once a review is published for it", () => {
    const first = courses.slice(0, 12);
    expect(first.map((c) => c.code)).toContain(WITHOUT_REVIEWS);
    const without = renderBrowser([], first);
    expect(cardText(without.container, WITHOUT_REVIEWS)).not.toContain(t.reviewedBadge);
    cleanup();
    const published = renderBrowser([WITHOUT_REVIEWS], first);
    expect(cardText(published.container, WITHOUT_REVIEWS)).toContain(t.reviewedBadge);
  });

  it("calls a sample-only course a sample, and a published one reviewed even beside a sample", () => {
    const sampleOnly = renderBrowser(
      [],
      courses.filter((c) => c.code === "PI121")
    );
    expect(cardText(sampleOnly.container, "PI121")).toContain(t.sampleBadge);
    cleanup();
    const published = renderBrowser(
      ["PI121"],
      courses.filter((c) => c.code === "PI121")
    );
    expect(cardText(published.container, "PI121")).toContain(t.reviewedBadge);
    expect(cardText(published.container, "PI121")).not.toContain(t.sampleBadge);
  });

  it("marks the no-script list the same way", () => {
    const { container } = render(
      <CourseReviewBrowserFallback
        courses={courses.filter((c) => c.code === WITHOUT_REVIEWS)}
        locale="en"
        dict={browserDict}
        publishedReviewCodes={[WITHOUT_REVIEWS]}
      />
    );
    expect(container.textContent).toContain(t.reviewedBadge);
  });
});
