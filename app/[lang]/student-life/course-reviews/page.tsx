import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import CourseStats from "@/components/course-review/CourseStats";
import CourseReviewBrowser from "@/components/course-review/CourseReviewBrowser";
import { courses } from "@/content/course-review/courses";

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
  const sectionLabel = dict.nav.find((n) => n.href === "/information-services")!.label;

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
              { label: sectionLabel, href: "/information-services" },
              { label: t.title },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-10 py-10">
        <CourseStats
          courses={courses}
          locale={locale}
          dict={{
            heading: t.statsHeading,
            totalCourses: t.statsTotalCourses,
            tracks: t.tracks,
          }}
        />

        <CourseReviewBrowser
          courses={courses}
          locale={locale}
          dict={{
            browseHeading: t.browseHeading,
            searchLabel: dict.actions.search,
            searchPlaceholder: t.searchPlaceholder,
            trackLabel: t.trackLabel,
            allTracks: t.allTracks,
            categoryLabel: dict.actions.category,
            allCategories: dict.actions.allCategories,
            showing: dict.actions.showing,
            result: dict.actions.result,
            results: dict.actions.results,
            noResults: dict.actions.noResults,
            clearFilters: dict.actions.clearFilters,
            tracks: t.tracks,
            categories: t.categories,
            credits: t.credits,
            yearLabel: t.yearLabel,
            prerequisite: t.prerequisite,
            instructor: t.instructorsHeading,
            reviewedBadge: t.reviewedBadge,
            previous: t.previous,
            next: t.next,
            pageOf: t.pageOf,
          }}
        />

        <Link
          href={localeHref(locale, "/student-life/home")}
          className="text-brand-deep hover:text-brand-dark text-sm font-semibold"
        >
          &larr; {t.backToGuides}
        </Link>
      </div>
    </>
  );
}
