import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, locales, pluralize, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { courses } from "@/content/course-review/courses";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import Table from "@/components/bds/Table";
import Select from "@/components/bds/Select";
import TextInput from "@/components/bds/TextInput";
import Tag from "@/components/bds/Tag";
import { Heading, Text } from "@/components/bds/Type";
import { TRACK_ORDER, CATEGORY_ORDER, filterCourses, hasActiveFilters } from "@/components/studies/catalogue";

/**
 * `/studies/course-reviews` (ROUTE-MAP-2.0 "Wave 5D"): the catalogue and
 * filterable browser. Data comes from `content/course-review/courses.ts`
 * (1.0, read only; the review text on it was already checked for anything
 * sensitive before this route was built, see the wave report).
 *
 * FILTERING IS A PLAIN GET FORM. No client script filters this list: the
 * three fields below post as `?q=&track=&category=` and the server renders
 * the filtered table, so the page works with JavaScript off exactly as
 * BUILD-BRIEF-2.0 section 7 asks, and every filtered view is a real,
 * bookmarkable URL rather than client-only state.
 */

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
    path: "/studies/course-reviews",
  });
}

export default async function CourseReviewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string; track?: string; category?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.courseReview;
  const familyLabel = dict.studiesIndex.title;

  const filters = await searchParams;
  const filtered = filterCourses(courses, filters);
  const filtersActive = hasActiveFilters(filters);

  const totalCredits = courses.reduce((sum, course) => sum + course.credits.total, 0);

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
              { label: familyLabel, href: "/studies" },
              { label: t.title },
            ]}
          />
        }
        helpSlot={
          <Button href={localeHref(locale, "/help")} variant="ghost">
            {dict.actions.getHelp}
          </Button>
        }
      />
      <div className="wrap flex flex-col gap-10 py-10">
        <section className="flex flex-col gap-4">
          <Heading level={2} step="heading-2">
            {t.statsHeading}
          </Heading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatTile label={t.statsTotalCourses} value={courses.length} />
            <StatTile label={t.statsTotalCredits} value={totalCredits} />
            <StatTile
              label={t.statsTracks}
              value={TRACK_ORDER.filter(
                (track) => track !== "foundational" && track !== "international-relations"
              ).length}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Text step="body-sm" className="font-semibold text-ink">
              {t.statsByTrack}
            </Text>
            <ul className="flex flex-col gap-1">
              {TRACK_ORDER.map((track) => (
                <li key={track} className="flex items-center justify-between gap-3 border-b border-line py-1.5">
                  <Text step="body-sm" className="text-muted">
                    {t.tracks[track]}
                  </Text>
                  <Text step="body-sm" className="font-semibold text-ink">
                    {courses.filter((course) => course.track === track).length}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="flex flex-col gap-6 border-t border-line pt-8">
          <Heading level={2} step="heading-2">
            {t.browseHeading}
          </Heading>

          <form
            method="get"
            className="flex flex-col flex-wrap items-end gap-4 sm:flex-row"
          >
            <TextInput
              name="q"
              label={dict.actions.search}
              placeholder={t.searchPlaceholder}
              defaultValue={filters.q ?? ""}
              className="min-w-[220px] flex-1"
            />
            <Select
              name="track"
              label={t.trackLabel}
              defaultValue={filters.track ?? ""}
              options={[
                { value: "", label: t.allTracks },
                ...TRACK_ORDER.map((track) => ({ value: track, label: t.tracks[track] })),
              ]}
              className="min-w-[200px]"
            />
            <Select
              name="category"
              label={dict.actions.category}
              defaultValue={filters.category ?? ""}
              options={[
                { value: "", label: dict.actions.allCategories },
                ...CATEGORY_ORDER.map((category) => ({
                  value: category,
                  label: t.categories[category],
                })),
              ]}
              className="min-w-[200px]"
            />
            <Button type="submit" variant="secondary">
              {dict.actions.search}
            </Button>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Text step="body-sm" className="text-muted">
              {dict.actions.showing} {filtered.length}{" "}
              {pluralize(filtered.length, { one: dict.actions.result, other: dict.actions.results })}
            </Text>
            {filtersActive ? (
              <Link
                href={localeHref(locale, "/studies/course-reviews")}
                className="focus-halo text-body-sm font-semibold text-brand-deep underline underline-offset-2"
              >
                {dict.actions.clearFilters}
              </Link>
            ) : null}
          </div>

          {filtered.length === 0 ? (
            <Text step="body" className="text-muted">
              {dict.actions.noResults}
            </Text>
          ) : (
            <Table
              caption={t.browseHeading}
              captionHidden
              rowHeaders
              columns={[
                { key: "code", header: t.columnCode },
                { key: "course", header: t.columnCourse },
                { key: "track", header: t.trackLabel },
                { key: "category", header: dict.actions.category },
                { key: "credits", header: t.credits },
                { key: "status", header: t.columnStatus },
              ]}
              rows={filtered.map((course) => ({
                code: course.code,
                course: (
                  <Link
                    href={localeHref(locale, `/studies/course-reviews/${course.code}`)}
                    className="focus-halo font-semibold text-brand-deep underline underline-offset-2"
                  >
                    {course.title[locale]}
                  </Link>
                ),
                track: t.tracks[course.track],
                category: t.categories[course.category],
                credits: `${course.credits.total} ${t.credits}`,
                status: course.review ? (
                  <Tag variant={course.review.sample ? "neutral" : "info"}>
                    {course.review.sample ? t.sampleBadge : t.reviewedBadge}
                  </Tag>
                ) : (
                  ""
                ),
              }))}
              rowKey={(row) => String(row.code)}
            />
          )}
        </section>
      </div>
    </>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-line bg-surface p-5">
      <Text step="body-sm" className="font-semibold text-muted">
        {label}
      </Text>
      <Heading level={3} step="display-1">
        {value.toLocaleString()}
      </Heading>
    </div>
  );
}
