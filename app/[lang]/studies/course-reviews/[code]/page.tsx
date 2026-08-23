import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { courses } from "@/content/course-review/courses";
import type { Course } from "@/content/course-review/types";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import Notice from "@/components/bds/Notice";
import Tag from "@/components/bds/Tag";
import InsetText from "@/components/bds/InsetText";
import ExternalLink from "@/components/bds/ExternalLink";
import { Heading, Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";
import RatingBar from "@/components/studies/RatingBar";
import { fillTemplate, formatYearLevel } from "@/components/studies/catalogue";

/**
 * `/studies/course-reviews/[code]` (ROUTE-MAP-2.0 "Wave 5D").
 *
 * WHAT IS NOT SURFACED HERE, AND WHY (see the wave report for the full
 * account). `content/course-review/courses.ts`'s own `ReviewQuote` type
 * documents that `attribution` is "kept general, never a real name", and
 * reading every entry confirms none carries one; a review's `sample: true`
 * flag marks made-up demonstration content, rendered with its own notice
 * below rather than presented as real feedback. Instructor names are drawn
 * from the Faculty of Political Science's own public staff directory
 * (`courses.ts`'s own header), the same information the 1.0 site already
 * published at this route, so nothing here goes further than what the 1.0
 * site already surfaces.
 */

export function generateStaticParams() {
  return locales.flatMap((lang) => courses.map((course) => ({ lang, code: course.code })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; code: string }>;
}): Promise<Metadata> {
  const { lang, code } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const course = courses.find((c) => c.code === code);
  if (!course) return {};

  return buildMetadata({
    locale,
    title: `${course.code} ${course.title[locale]}`,
    description: course.description[locale],
    path: `/studies/course-reviews/${course.code}`,
  });
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ lang: string; code: string }>;
}) {
  const { lang, code } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.courseReview;
  const familyLabel = dict.studiesIndex.title;

  const index = courses.findIndex((c) => c.code === code);
  const course = courses[index];
  if (!course) notFound();
  const prevCourse = index > 0 ? courses[index - 1] : null;
  const nextCourse = index < courses.length - 1 ? courses[index + 1] : null;
  const catalogueHref = localeHref(locale, "/studies/course-reviews");

  return (
    <>
      <PageHeader
        title={`${course.code} ${course.title[locale]}`}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: familyLabel, href: "/studies" },
              { label: t.title, href: "/studies/course-reviews" },
              { label: course.code },
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
        <div className="flex flex-wrap items-center gap-2">
          <Tag variant="brand">{t.tracks[course.track]}</Tag>
          <Tag>{t.categories[course.category]}</Tag>
          {course.review ? (
            <Tag variant={course.review.sample ? "neutral" : "info"}>
              {course.review.sample ? t.sampleBadge : t.reviewedBadge}
            </Tag>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-4">
          <Text step="body-sm" className="text-muted">
            {course.credits.total} {t.credits} ({course.credits.lecture}-{course.credits.lab}-
            {course.credits.selfStudy})
          </Text>
          <Text step="body-sm" className="text-muted">
            {formatYearLevel(course.yearLevel, t.yearLabel)}
          </Text>
        </div>

        {course.prerequisite ? (
          <Text step="body-sm">
            <span className="font-semibold text-ink">{t.prerequisite} </span>
            <span className="text-muted">{course.prerequisite[locale]}</span>
          </Text>
        ) : null}

        {course.instructors && course.instructors.length > 0 ? (
          <Stack gap="xs" as="div">
            <Heading level={2} step="heading-3">
              {t.instructorsHeading}
            </Heading>
            <ul className="flex flex-wrap gap-x-2 gap-y-1">
              {course.instructors.map((instructor) => (
                <Text as="li" step="body-sm" key={instructor.name.en} className="text-ink">
                  {instructor.profileUrl ? (
                    <ExternalLink href={instructor.profileUrl} newTabLabel={dict.a11y.newTab}>
                      {instructor.name[locale]}
                    </ExternalLink>
                  ) : (
                    instructor.name[locale]
                  )}
                </Text>
              ))}
            </ul>
            <Text step="body-sm" className="text-muted">
              {t.instructorsNote}
            </Text>
          </Stack>
        ) : null}

        <Stack gap="sm" as="div">
          <Heading level={2} step="heading-2">
            {t.descriptionHeading}
          </Heading>
          <Text step="body" className="max-w-[var(--measure)] whitespace-pre-line text-ink">
            {course.description[locale]}
          </Text>
        </Stack>

        <Stack gap="lg" as="div">
          <Heading level={2} step="heading-2">
            {t.reviewHeading}
          </Heading>

          {course.review ? (
            <CourseReviewBody course={course} locale={locale} t={t} />
          ) : (
            <Notice variant="placeholder" title={t.noReviewTitle}>
              <Text step="body" className="mb-3">
                {t.noReviewBody}
              </Text>
              <Button href={localeHref(locale, "/contact")} variant="secondary">
                {dict.actions.contactUs}
              </Button>
            </Notice>
          )}
        </Stack>

        {prevCourse || nextCourse ? (
          <nav
            aria-label={t.reviewHeading}
            className="grid grid-cols-1 gap-4 border-t border-line pt-8 sm:grid-cols-2"
          >
            <div>
              {prevCourse ? (
                <Link
                  href={localeHref(locale, `/studies/course-reviews/${prevCourse.code}`)}
                  className="focus-halo flex h-full flex-col gap-1 rounded-lg border border-line bg-surface p-4 hover:border-brand"
                >
                  <Text step="body-sm" className="font-semibold text-muted uppercase">
                    &larr; {t.previous}
                  </Text>
                  <Text step="body" className="font-semibold text-ink">
                    {prevCourse.code} {prevCourse.title[locale]}
                  </Text>
                </Link>
              ) : null}
            </div>
            <div>
              {nextCourse ? (
                <Link
                  href={localeHref(locale, `/studies/course-reviews/${nextCourse.code}`)}
                  className="focus-halo flex h-full flex-col gap-1 rounded-lg border border-line bg-surface p-4 text-right hover:border-brand"
                >
                  <Text step="body-sm" className="font-semibold text-muted uppercase">
                    {t.next} &rarr;
                  </Text>
                  <Text step="body" className="font-semibold text-ink">
                    {nextCourse.code} {nextCourse.title[locale]}
                  </Text>
                </Link>
              ) : null}
            </div>
          </nav>
        ) : null}

        <Link
          href={catalogueHref}
          className="focus-halo text-body-sm font-semibold text-brand-deep underline underline-offset-2"
        >
          &larr; {t.backToCatalog}
        </Link>
      </div>
    </>
  );
}

function CourseReviewBody({
  course,
  locale,
  t,
}: {
  course: Course;
  locale: Locale;
  t: ReturnType<typeof getDictionary>["courseReview"];
}) {
  const review = course.review;
  if (!review) return null;

  return (
    <Stack gap="lg" as="div">
      {review.sample ? (
        <Notice variant="placeholder" title={t.sampleReviewTitle}>
          <Text step="body">{t.sampleReviewBody}</Text>
        </Notice>
      ) : null}

      <Text step="body-sm" className="text-muted">
        {fillTemplate(t.reviewBasedOn, { count: review.reviewCount })}
      </Text>

      <div className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-5">
        <RatingBar label={t.ratingOverall} value={review.overallRating} outOf={t.ratingOutOf} />
        <RatingBar label={t.ratingWorkload} value={review.workloadRating} outOf={t.ratingOutOf} />
        <RatingBar
          label={t.ratingDifficulty}
          value={review.difficultyRating}
          outOf={t.ratingOutOf}
        />
      </div>

      <Stack gap="xs" as="div">
        <Heading level={3} step="heading-3">
          {t.workloadHeading}
        </Heading>
        <Text step="body-sm" className="max-w-[var(--measure)] text-muted">
          {review.workload[locale]}
        </Text>
      </Stack>

      <Stack gap="xs" as="div">
        <Heading level={3} step="heading-3">
          {t.assessmentHeading}
        </Heading>
        <Text step="body-sm" className="max-w-[var(--measure)] text-muted">
          {review.assessmentStyle[locale]}
        </Text>
      </Stack>

      <Stack gap="xs" as="div">
        <Heading level={3} step="heading-3">
          {t.tipsHeading}
        </Heading>
        <ul className="flex list-disc flex-col gap-1.5 pl-5">
          {review.tips.map((tip, i) => (
            <Text as="li" step="body-sm" key={i} className="text-muted">
              {tip[locale]}
            </Text>
          ))}
        </ul>
      </Stack>

      {review.quotes && review.quotes.length > 0 ? (
        <Stack gap="xs" as="div">
          <Heading level={3} step="heading-3">
            {t.quotesHeading}
          </Heading>
          <Stack gap="sm" as="ul">
            {review.quotes.map((quote, i) => (
              <li key={i}>
                <InsetText as="blockquote">
                  <Text step="body-sm" className="italic">
                    &ldquo;{quote.text[locale]}&rdquo;
                  </Text>
                  {quote.attribution ? (
                    <Text step="body-sm" className="mt-2 text-muted">
                      {quote.attribution[locale]}
                    </Text>
                  ) : null}
                </InsetText>
              </li>
            ))}
          </Stack>
        </Stack>
      ) : null}
    </Stack>
  );
}
