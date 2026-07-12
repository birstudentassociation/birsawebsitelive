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

// Literal route — takes precedence over `[audience]/[slug]/page.tsx` for
// exactly this URL, so `/student-life/home/course-reviews` renders this
// dedicated browser instead of the generic MDX guide page. The guide's MDX
// entry (content/student-life/{en,th}/home/course-reviews.mdx) is left in
// place only so it still lists correctly as a card on `/student-life/home`.

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const sectionLabel: Record<Locale, string> = {
  en: "Information & services",
  th: "ข้อมูลและบริการ",
};

const guidesLabel: Record<Locale, string> = {
  en: "Student life & culture guides",
  th: "คู่มือชีวิตนักศึกษาและวัฒนธรรม",
};

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
    path: "/student-life/home/course-reviews",
  });
}

export default async function CourseReviewsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.courseReview;

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
              { label: sectionLabel[locale], href: "/information-services" },
              { label: guidesLabel[locale], href: "/student-life/home" },
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
            totalCredits: t.statsTotalCredits,
            minorTracks: t.statsTracks,
            byTrack: t.statsByTrack,
            tracks: t.tracks,
          }}
        />

        <CourseReviewBrowser
          courses={courses}
          locale={locale}
          dict={{
            searchLabel: dict.actions.search,
            searchPlaceholder: dict.actions.searchPlaceholder,
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
            viewDescription: t.viewDescription,
            hideDescription: t.hideDescription,
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
