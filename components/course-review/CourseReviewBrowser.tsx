"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Field from "@/components/Field";
import { CardTitle } from "@/components/Card";
import Tag from "@/components/Tag";
import Button from "@/components/Button";
import { localeHref, type Locale } from "@/lib/i18n";
import type { Course, CourseCategory, CourseTrack } from "@/content/course-review/types";
import {
  CATEGORY_ORDER,
  TRACK_ORDER,
  formatYearLevel,
  fillTemplate,
} from "@/components/course-review/constants";
import {
  DEFAULT_FILTERS,
  filterCourses,
  parseFilters,
  serialiseFilters,
  type CourseFilters,
} from "@/lib/course-review/filter";

const PAGE_SIZE = 12;
const YEARS = [1, 2, 3, 4];

export type CourseReviewDict = {
  browseHeading: string;
  searchLabel: string;
  searchPlaceholder: string;
  trackLabel: string;
  allTracks: string;
  categoryLabel: string;
  allCategories: string;
  yearFilterLabel: string;
  allYears: string;
  reviewedFilterLabel: string;
  showing: string;
  result: string;
  results: string;
  noResults: string;
  clearFilters: string;
  tracks: Record<CourseTrack, string>;
  categories: Record<CourseCategory, string>;
  credits: string;
  yearLabel: string;
  yearTo: string;
  prerequisite: string;
  instructor: string;
  reviewedBadge: string;
  sampleBadge: string;
  previous: string;
  next: string;
  /** Template containing the literal placeholder "{current}" and "{total}". */
  pageOf: string;
};

export type CourseReviewBrowserProps = {
  courses: Course[];
  locale: Locale;
  dict: CourseReviewDict;
};

/**
 * Search, filter and paginate the course list. Filter state lives in the URL
 * (see `lib/course-review/filter.ts`) so filtered views are shareable. The URL
 * is read once on mount and then only written, with replaceState, so it never
 * adds history entries and a lagging URL can never overwrite what was typed.
 * Needs a <Suspense> boundary because of useSearchParams.
 */
export default function CourseReviewBrowser({ courses, locale, dict }: CourseReviewBrowserProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<CourseFilters>(() =>
    parseFilters(new URLSearchParams(searchParams.toString()))
  );
  // After a Previous/Next press, keep keyboard focus inside the pager: when the
  // pressed button becomes disabled at a boundary, focus is redirected to its
  // still-enabled sibling so it is never lost to <body> (WCAG 2.4.3).
  const pendingFocus = useRef<"prev" | "next" | null>(null);

  const filtered = useMemo(() => filterCourses(courses, filters), [courses, filters]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(filters.page, totalPages);
  const pageCourses = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasFilters = serialiseFilters({ ...filters, page: 1 }).size > 0;

  useEffect(() => {
    if (!pendingFocus.current) return;
    const id = pendingFocus.current === "next" ? "course-page-next" : "course-page-prev";
    pendingFocus.current = null;
    document.getElementById(id)?.focus();
  }, [currentPage]);

  function update(next: CourseFilters) {
    setFilters(next);
    const qs = serialiseFilters(next).toString();
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
  }

  function change(patch: Partial<CourseFilters>) {
    update({ ...filters, ...patch, page: 1 });
  }

  function goToPage(target: number) {
    const next = Math.min(totalPages, Math.max(1, target));
    // If the button just pressed will disable at this boundary, hand focus to
    // the opposite button, which stays enabled.
    if (next > currentPage) pendingFocus.current = next === totalPages ? "prev" : "next";
    else if (next < currentPage) pendingFocus.current = next === 1 ? "next" : "prev";
    update({ ...filters, page: next });
  }

  const trackOptions = [
    { value: "all", label: dict.allTracks },
    ...TRACK_ORDER.map((value) => ({ value, label: dict.tracks[value] })),
  ];
  const categoryOptions = [
    { value: "all", label: dict.allCategories },
    ...CATEGORY_ORDER.map((value) => ({ value, label: dict.categories[value] })),
  ];
  const yearOptions = [
    { value: "all", label: dict.allYears },
    ...YEARS.map((value) => ({ value: String(value), label: `${dict.yearLabel} ${value}` })),
  ];

  const statusText =
    `${dict.showing} ${filtered.length} ${filtered.length === 1 ? dict.result : dict.results}` +
    (totalPages > 1
      ? ` · ${fillTemplate(dict.pageOf, { current: currentPage, total: totalPages })}`
      : "");

  return (
    <section aria-labelledby="course-browse-heading" className="flex flex-col gap-4 sm:gap-6">
      <h2 id="course-browse-heading" className="font-display text-xl">
        {dict.browseHeading}
      </h2>
      <div className="grid grid-cols-2 gap-x-3 gap-y-3 sm:gap-4 lg:grid-cols-4">
        <Field
          className="col-span-2 lg:col-span-1"
          as="input"
          type="search"
          name="course-search"
          label={dict.searchLabel}
          placeholder={dict.searchPlaceholder}
          value={filters.query}
          onChange={(event) => change({ query: event.target.value })}
        />
        <Field
          as="select"
          name="course-track"
          label={dict.trackLabel}
          value={filters.track}
          onChange={(event) => change({ track: event.target.value as CourseFilters["track"] })}
          options={trackOptions}
        />
        <Field
          as="select"
          name="course-category"
          label={dict.categoryLabel}
          value={filters.category}
          onChange={(event) =>
            change({ category: event.target.value as CourseFilters["category"] })
          }
          options={categoryOptions}
        />
        <Field
          as="select"
          name="course-year"
          label={dict.yearFilterLabel}
          value={String(filters.year)}
          onChange={(event) =>
            change({ year: event.target.value === "all" ? "all" : Number(event.target.value) })
          }
          options={yearOptions}
        />
        <label className="flex min-h-11 items-center gap-2.5 self-end text-sm leading-tight font-semibold text-ink lg:col-span-4">
          <input
            type="checkbox"
            name="course-reviewed"
            checked={filters.reviewed}
            onChange={(event) => change({ reviewed: event.target.checked })}
            className="focus-halo h-5 w-5 shrink-0 border-input-border accent-brand"
          />
          {dict.reviewedFilterLabel}
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <p role="status" className="text-sm text-muted">
          {statusText}
        </p>
        {hasFilters ? (
          <Button variant="secondary" onClick={() => update(DEFAULT_FILTERS)}>
            {dict.clearFilters}
          </Button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-line bg-sunken p-6">
          <p className="text-sm text-ink">{dict.noResults}</p>
        </div>
      ) : (
        <>
          <CourseGrid courses={pageCourses} locale={locale} dict={dict} />

          {totalPages > 1 ? (
            <nav
              aria-label={fillTemplate(dict.pageOf, { current: currentPage, total: totalPages })}
              className="flex items-center justify-center gap-4"
            >
              <Button
                id="course-page-prev"
                variant="secondary"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                {dict.previous}
              </Button>
              <span aria-hidden="true" className="text-sm text-muted">
                {fillTemplate(dict.pageOf, { current: currentPage, total: totalPages })}
              </span>
              <Button
                id="course-page-next"
                variant="secondary"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                {dict.next}
              </Button>
            </nav>
          ) : null}
        </>
      )}
    </section>
  );
}

/** Suspense fallback: the unfiltered first page as a plain list, no controls. */
export function CourseReviewBrowserFallback({ courses, locale, dict }: CourseReviewBrowserProps) {
  return (
    <section aria-labelledby="course-browse-heading" className="flex flex-col gap-4 sm:gap-6">
      <h2 id="course-browse-heading" className="font-display text-xl">
        {dict.browseHeading}
      </h2>
      <CourseGrid courses={courses.slice(0, PAGE_SIZE)} locale={locale} dict={dict} />
    </section>
  );
}

function CourseGrid({
  courses,
  locale,
  dict,
}: {
  courses: Course[];
  locale: Locale;
  dict: CourseReviewDict;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.code} course={course} locale={locale} dict={dict} />
      ))}
    </div>
  );
}

function CourseCard({
  course,
  locale,
  dict,
}: {
  course: Course;
  locale: Locale;
  dict: CourseReviewDict;
}) {
  const otherLocale: Locale = locale === "en" ? "th" : "en";
  const href = localeHref(locale, `/student-life/course-reviews/${course.code}`);

  const yearText = formatYearLevel(course.yearLevel, dict.yearLabel, dict.yearTo);
  const creditsText = `${course.credits.total} ${dict.credits} (${course.credits.lecture}-${course.credits.lab}-${course.credits.selfStudy})`;
  const instructors = course.instructors?.map((instructor) => instructor.name[locale]).join(", ");

  return (
    <div className="group relative flex flex-col gap-1.5 rounded-lg border border-line bg-surface p-4 shadow-sm transition-shadow duration-150 hover:shadow-md sm:gap-2 sm:p-5">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="font-mono text-sm font-semibold text-ink">{course.code}</span>
        <Tag variant="brand">{dict.tracks[course.track]}</Tag>
        <Tag variant="forest" className="hidden sm:inline-flex">
          {dict.categories[course.category]}
        </Tag>
        {course.reviews?.length ? (
          <Tag variant="neutral">
            {course.reviews.every((review) => review.sample)
              ? dict.sampleBadge
              : dict.reviewedBadge}
          </Tag>
        ) : null}
      </div>
      <div>
        <CardTitle href={href} className="text-base sm:text-lg">
          {course.title[locale]}
        </CardTitle>
        <p className="truncate text-xs text-muted sm:text-sm">{course.title[otherLocale]}</p>
      </div>
      <p className="text-xs text-muted sm:hidden">
        {[dict.categories[course.category], creditsText, yearText].join(" \u00b7 ")}
      </p>
      <div className="hidden flex-wrap gap-2 text-xs sm:flex">
        <span className="rounded-full bg-sunken px-2.5 py-1 font-medium text-ink">
          {creditsText}
        </span>
        <span className="rounded-full bg-sunken px-2.5 py-1 font-medium text-ink">{yearText}</span>
      </div>
      {course.prerequisite ? (
        <p className="hidden text-sm text-muted sm:block">
          <span className="font-semibold text-ink">{dict.prerequisite}: </span>
          {course.prerequisite[locale]}
        </p>
      ) : null}
      {instructors ? (
        <p className="truncate text-xs text-muted sm:text-sm sm:whitespace-normal">
          <span className="font-semibold text-ink">{dict.instructor}: </span>
          {instructors}
        </p>
      ) : null}
    </div>
  );
}
