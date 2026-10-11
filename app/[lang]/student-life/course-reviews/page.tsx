import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import CourseReviewBrowser, {
  CourseReviewBrowserFallback,
  type CourseReviewDict,
} from "@/components/course-review/CourseReviewBrowser";
import PrerequisiteMap from "@/components/course-review/PrerequisiteMap";
import { buildPlanLinkCopy } from "@/components/study-plan/planLinkCopy";
import { buildTermInsightCopy } from "@/components/study-plan/termInsightCopy";
import { courses } from "@/content/course-review/courses";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import { CURRENT_VERSION } from "@/lib/courses/graph";
import { minorMembers } from "@/lib/course-review/facts";
import { listPublishedReviewCodes } from "@/lib/course-review/published";
import { studentLifeLabel } from "@/content/student-life/topics";

/**
 * Whether a course has a published review comes from the database, so the page
 * is regenerated at most an hour after the last request, exactly as the course
 * pages are. Publishing and unpublishing from the officer console revalidate it
 * straight away; this is the backstop for anything that changes the data some
 * other way. With no database configured the codes are empty and the page is
 * the one a static build has always produced.
 */
export const revalidate = 3600;

// Literal route: sits as a sibling of `[audience]/page.tsx` and takes
// precedence over the dynamic `[audience]` segment for exactly this URL, so
// `/student-life/course-reviews` renders this dedicated browser instead of
// being swallowed by the generic guide-track route.

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = getDictionary(locale).courseReview;

  return buildMetadata({
    locale,
    title: t.title,
    description: t.lede,
    path: "/student-life/course-reviews",
  });
}

export default async function CourseReviewsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.courseReview;
  const publishedReviewCodes = await listPublishedReviewCodes();

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

  // The minors of the curriculum the catalogue describes, named in the page's
  // language, for the minor filter.
  const minorOptions = CURRICULUM_VERSIONS[CURRENT_VERSION].minors.map((minor) => ({
    id: minor.id,
    label: minor.name[locale],
  }));

  return (
    <>
      <PageHeader
        title={t.title}
        lede={t.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: studentLifeLabel[locale], href: "/student-life" },
              { label: t.title },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-4 py-6 sm:gap-6 sm:py-10">
        <Suspense
          fallback={
            <CourseReviewBrowserFallback
              courses={courses}
              locale={locale}
              dict={browserDict}
              publishedReviewCodes={publishedReviewCodes}
            />
          }
        >
          <CourseReviewBrowser
            courses={courses}
            locale={locale}
            dict={browserDict}
            minorOptions={minorOptions}
            minorMembers={minorMembers()}
            planCopy={buildPlanLinkCopy(locale).browser}
            publishedReviewCodes={publishedReviewCodes}
          />
        </Suspense>
        <PrerequisiteMap
          copy={buildTermInsightCopy(locale).map}
          trackLabels={t.tracks}
          courseLinkBase={localeHref(locale, "/student-life/course-reviews")}
        />
      </div>
    </>
  );
}
