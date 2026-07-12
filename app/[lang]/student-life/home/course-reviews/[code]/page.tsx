import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import Notice from "@/components/Notice";
import Tag from "@/components/Tag";
import RatingBar from "@/components/course-review/RatingBar";
import { formatYearLevel, fillTemplate } from "@/components/course-review/constants";
import { courses } from "@/content/course-review/courses";

// Nested under the literal `course-reviews` route (see the parent page.tsx
// for why that segment already wins over the generic guide `[slug]` route).
// `[code]` is the only dynamic part, e.g. /student-life/home/course-reviews/PI121.

export function generateStaticParams() {
  return locales.flatMap((lang) => courses.map((course) => ({ lang, code: course.code })));
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
  params: Promise<{ lang: string; code: string }>;
}): Promise<Metadata> {
  const { lang, code } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const course = courses.find((c) => c.code === code);
  if (!course) return {};

  return buildMetadata({
    locale,
    title: `${course.code} — ${course.title[locale]}`,
    description: course.description[locale],
    path: `/student-life/home/course-reviews/${course.code}`,
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

  const index = courses.findIndex((c) => c.code === code);
  const course = courses[index];
  if (!course) notFound();
  const prevCourse = index > 0 ? courses[index - 1] : null;
  const nextCourse = index < courses.length - 1 ? courses[index + 1] : null;
  const otherLocale: Locale = locale === "en" ? "th" : "en";
  const catalogHref = localeHref(locale, "/student-life/home/course-reviews");

  return (
    <>
      <PageHeader
        title={`${course.code} — ${course.title[locale]}`}
        lede={course.title[otherLocale]}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: sectionLabel[locale], href: "/information-services" },
              { label: guidesLabel[locale], href: "/student-life/home" },
              { label: t.title, href: "/student-life/home/course-reviews" },
              { label: course.code },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-10 py-10">
        <div className="flex flex-wrap items-center gap-2">
          <Tag variant="brand">{t.tracks[course.track]}</Tag>
          <Tag variant="forest">{t.categories[course.category]}</Tag>
          {course.review ? <Tag variant="neutral">{t.reviewedBadge}</Tag> : null}
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          <span className="bg-sunken text-ink rounded-full px-3 py-1.5 font-medium">
            {course.credits.total} {t.credits} ({course.credits.lecture}-{course.credits.lab}-
            {course.credits.selfStudy})
          </span>
          <span className="bg-sunken text-ink rounded-full px-3 py-1.5 font-medium">
            {formatYearLevel(course.yearLevel, t.yearLabel)}
          </span>
        </div>

        {course.prerequisite ? (
          <p className="text-sm">
            <span className="text-ink font-semibold">{t.prerequisite}: </span>
            <span className="text-muted">{course.prerequisite[locale]}</span>
          </p>
        ) : null}

        <section className="flex flex-col gap-3">
          <h2 className="font-display text-xl">{t.descriptionHeading}</h2>
          <p className="text-ink max-w-[var(--measure)] leading-relaxed whitespace-pre-line">
            {course.description[locale]}
          </p>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-display text-xl">{t.reviewHeading}</h2>

          {course.review ? (
            <CourseReview review={course.review} locale={locale} t={t} />
          ) : (
            <Notice variant="placeholder" title={t.noReviewTitle}>
              <p className="mb-3">{t.noReviewBody}</p>
              <Button href={localeHref(locale, "/contact")} variant="secondary">
                {dict.actions.contactUs}
              </Button>
            </Notice>
          )}
        </section>

        {prevCourse || nextCourse ? (
          <nav
            aria-label={t.reviewHeading}
            className="border-line grid grid-cols-1 gap-4 border-t pt-8 sm:grid-cols-2"
          >
            <div>
              {prevCourse ? (
                <Link
                  href={localeHref(locale, `/student-life/home/course-reviews/${prevCourse.code}`)}
                  className="border-line bg-surface hover:border-brand flex h-full flex-col gap-1 rounded-lg border p-4"
                >
                  <span className="text-muted text-xs font-semibold tracking-wide uppercase">
                    &larr; {t.previous}
                  </span>
                  <span className="text-ink font-semibold">
                    {prevCourse.code} — {prevCourse.title[locale]}
                  </span>
                </Link>
              ) : null}
            </div>
            <div>
              {nextCourse ? (
                <Link
                  href={localeHref(locale, `/student-life/home/course-reviews/${nextCourse.code}`)}
                  className="border-line bg-surface hover:border-brand flex h-full flex-col gap-1 rounded-lg border p-4 text-right"
                >
                  <span className="text-muted text-xs font-semibold tracking-wide uppercase">
                    {t.next} &rarr;
                  </span>
                  <span className="text-ink font-semibold">
                    {nextCourse.code} — {nextCourse.title[locale]}
                  </span>
                </Link>
              ) : null}
            </div>
          </nav>
        ) : null}

        <Link href={catalogHref} className="text-brand-deep hover:text-brand-dark text-sm font-semibold">
          &larr; {t.backToCatalog}
        </Link>
      </div>
    </>
  );
}

function CourseReview({
  review,
  locale,
  t,
}: {
  review: NonNullable<(typeof courses)[number]["review"]>;
  locale: Locale;
  t: ReturnType<typeof getDictionary>["courseReview"];
}) {
  return (
    <div className="flex flex-col gap-8">
      <p className="text-muted text-sm">
        {fillTemplate(t.reviewBasedOn, { count: review.reviewCount })}
      </p>

      <div className="border-line bg-surface flex flex-col gap-4 rounded-lg border p-5">
        <RatingBar label={t.ratingOverall} value={review.overallRating} outOf={t.ratingOutOf} />
        <RatingBar label={t.ratingWorkload} value={review.workloadRating} outOf={t.ratingOutOf} />
        <RatingBar label={t.ratingDifficulty} value={review.difficultyRating} outOf={t.ratingOutOf} />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-ink font-semibold">{t.workloadHeading}</h3>
        <p className="text-muted max-w-[var(--measure)] leading-relaxed">{review.workload[locale]}</p>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-ink font-semibold">{t.assessmentHeading}</h3>
        <p className="text-muted max-w-[var(--measure)] leading-relaxed">
          {review.assessmentStyle[locale]}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-ink font-semibold">{t.tipsHeading}</h3>
        <ul className="text-muted flex list-disc flex-col gap-1.5 pl-5 leading-relaxed">
          {review.tips.map((tip, i) => (
            <li key={i}>{tip[locale]}</li>
          ))}
        </ul>
      </div>

      {review.quotes && review.quotes.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-ink font-semibold">{t.quotesHeading}</h3>
          <ul className="flex flex-col gap-3">
            {review.quotes.map((quote, i) => (
              <li key={i} className="border-brand bg-sunken text-ink rounded-md border-l-4 p-4 text-sm">
                <p className="italic">&ldquo;{quote.text[locale]}&rdquo;</p>
                {quote.attribution ? (
                  <p className="text-muted mt-2 text-xs">&mdash; {quote.attribution[locale]}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
