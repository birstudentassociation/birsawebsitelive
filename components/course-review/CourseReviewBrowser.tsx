"use client";

import { useMemo, useState } from "react";
import Field from "@/components/Field";
import Card from "@/components/Card";
import Tag from "@/components/Tag";
import Accordion from "@/components/Accordion";
import Button from "@/components/Button";
import type { Locale } from "@/lib/i18n";
import type { Course, CourseCategory, CourseTrack } from "@/content/course-review/types";
import { CATEGORY_ORDER, TRACK_ORDER } from "@/components/course-review/constants";

const PAGE_SIZE = 12;

export type CourseReviewDict = {
  searchLabel: string;
  searchPlaceholder: string;
  trackLabel: string;
  allTracks: string;
  categoryLabel: string;
  allCategories: string;
  showing: string;
  result: string;
  results: string;
  noResults: string;
  clearFilters: string;
  tracks: Record<CourseTrack, string>;
  categories: Record<CourseCategory, string>;
  credits: string;
  yearLabel: string;
  prerequisite: string;
  viewDescription: string;
  hideDescription: string;
  previous: string;
  next: string;
  /** Template containing the literal placeholders "{current}" and "{total}". */
  pageOf: string;
};

export type CourseReviewBrowserProps = {
  courses: Course[];
  locale: Locale;
  dict: CourseReviewDict;
};

function formatYearLevel(yearLevel: number[], yearLabel: string): string {
  if (yearLevel.length === 0) return yearLabel;
  const min = Math.min(...yearLevel);
  const max = Math.max(...yearLevel);
  return min === max ? `${yearLabel} ${min}` : `${yearLabel} ${min}–${max}`;
}

function formatPageOf(template: string, current: number, total: number): string {
  return template.replace("{current}", String(current)).replace("{total}", String(total));
}

/**
 * Client-side search + track/category filter + pagination over the full
 * course list. The list is passed in fully rendered/serialisable; this
 * component only narrows and paginates what's shown, mirroring the pattern
 * used by `ClubsExplorer`. Search/filter counts and page count are always
 * derived from `courses.length` / `.filter()` results, so this keeps working
 * once the placeholder data is replaced by the full ~84-course catalog.
 */
export default function CourseReviewBrowser({ courses, locale, dict }: CourseReviewBrowserProps) {
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState<CourseTrack | "all">("all");
  const [category, setCategory] = useState<CourseCategory | "all">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesTrack = track === "all" || course.track === track;
      const matchesCategory = category === "all" || course.category === category;
      const matchesQuery =
        q.length === 0 ||
        course.code.toLowerCase().includes(q) ||
        course.title.en.toLowerCase().includes(q) ||
        course.title.th.toLowerCase().includes(q) ||
        course.description.en.toLowerCase().includes(q) ||
        course.description.th.toLowerCase().includes(q);
      return matchesTrack && matchesCategory && matchesQuery;
    });
  }, [courses, query, track, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageCourses = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasFilters = query.trim().length > 0 || track !== "all" || category !== "all";

  function handleQueryChange(value: string) {
    setQuery(value);
    setPage(1);
  }
  function handleTrackChange(value: string) {
    setTrack(value as CourseTrack | "all");
    setPage(1);
  }
  function handleCategoryChange(value: string) {
    setCategory(value as CourseCategory | "all");
    setPage(1);
  }
  function clearFilters() {
    setQuery("");
    setTrack("all");
    setCategory("all");
    setPage(1);
  }

  const trackOptions = [
    { value: "all", label: dict.allTracks },
    ...TRACK_ORDER.map((value) => ({ value, label: dict.tracks[value] })),
  ];
  const categoryOptions = [
    { value: "all", label: dict.allCategories },
    ...CATEGORY_ORDER.map((value) => ({ value, label: dict.categories[value] })),
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field
          as="input"
          type="search"
          name="course-search"
          label={dict.searchLabel}
          placeholder={dict.searchPlaceholder}
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
        />
        <Field
          as="select"
          name="course-track"
          label={dict.trackLabel}
          value={track}
          onChange={(event) => handleTrackChange(event.target.value)}
          options={trackOptions}
        />
        <Field
          as="select"
          name="course-category"
          label={dict.categoryLabel}
          value={category}
          onChange={(event) => handleCategoryChange(event.target.value)}
          options={categoryOptions}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-muted text-sm">
          {dict.showing} {filtered.length} {filtered.length === 1 ? dict.result : dict.results}
        </p>
        {hasFilters ? (
          <Button variant="secondary" onClick={clearFilters}>
            {dict.clearFilters}
          </Button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="border-line bg-sunken rounded-lg border p-6">
          <p className="text-ink text-sm">{dict.noResults}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pageCourses.map((course) => (
              <CourseCard key={course.code} course={course} locale={locale} dict={dict} />
            ))}
          </div>

          {totalPages > 1 ? (
            <nav
              aria-label={formatPageOf(dict.pageOf, currentPage, totalPages)}
              className="flex items-center justify-center gap-4"
            >
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                {dict.previous}
              </Button>
              <span aria-hidden="true" className="text-muted text-sm">
                {formatPageOf(dict.pageOf, currentPage, totalPages)}
              </span>
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                {dict.next}
              </Button>
            </nav>
          ) : null}
        </>
      )}
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
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-ink font-mono text-sm font-semibold">{course.code}</span>
        <Tag variant="brand">{dict.tracks[course.track]}</Tag>
        <Tag variant="forest">{dict.categories[course.category]}</Tag>
      </div>
      <div>
        <h3 className="font-display text-ink text-lg leading-snug">{course.title[locale]}</h3>
        <p className="text-muted text-sm">{course.title[otherLocale]}</p>
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="bg-sunken text-ink rounded-full px-2.5 py-1 font-medium">
          {course.credits.total} {dict.credits} ({course.credits.lecture}-{course.credits.lab}-
          {course.credits.selfStudy})
        </span>
        <span className="bg-sunken text-ink rounded-full px-2.5 py-1 font-medium">
          {formatYearLevel(course.yearLevel, dict.yearLabel)}
        </span>
      </div>
      {course.prerequisite ? (
        <p className="text-muted text-sm">
          <span className="text-ink font-semibold">{dict.prerequisite}: </span>
          {course.prerequisite[locale]}
        </p>
      ) : null}
      <Accordion
        summary={open ? dict.hideDescription : dict.viewDescription}
        onToggle={setOpen}
      >
        {course.description[locale]}
      </Accordion>
    </Card>
  );
}
