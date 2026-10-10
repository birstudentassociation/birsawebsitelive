import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import Notice from "@/components/Notice";
import ReviewForm from "@/components/course-review/ReviewForm";
import { fillTemplate } from "@/components/course-review/constants";
import { reviewFormCopy } from "@/components/course-review/reviewFormCopy";
import { courseNode } from "@/lib/courses/graph";
import { PUBLICATION_THRESHOLD } from "@/lib/course-review/groups";
import { instructorKey, OTHER_INSTRUCTOR } from "@/lib/course-review/instructors";
import { isCourseReviewConfigured } from "@/lib/course-review/submissions";
import { recentTerms, termKey, termYearLabel } from "@/lib/course-review/terms";
import { studentLifeLabel } from "@/content/student-life/topics";
import { submitReviewAction } from "./actions";

/**
 * The terms the form offers depend on today's date, so this page is rendered
 * per request rather than frozen at build time, when the list would go stale
 * the next term.
 */
export const dynamic = "force-dynamic";

/** A form is not a page worth finding in search; the course page is. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; code: string }>;
}): Promise<Metadata> {
  const { lang, code } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const node = courseNode(code);
  if (!node) return {};
  const t = reviewFormCopy[locale];

  const metadata = buildMetadata({
    locale,
    title: `${t.title}: ${node.code}`,
    description: t.lede,
    path: `/student-life/course-reviews/${node.code}/review`,
  });
  return { ...metadata, robots: { index: false, follow: true } };
}

export default async function WriteReviewPage({
  params,
}: {
  params: Promise<{ lang: string; code: string }>;
}) {
  const { lang, code } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const cr = dict.courseReview;
  const t = reviewFormCopy[locale];

  const node = courseNode(code);
  if (!node) notFound();

  const courseHref = `/student-life/course-reviews/${node.code}`;
  const course = node.catalogue;
  const semesterName = { 1: cr.semester1, 2: cr.semester2, summer: cr.summer } as const;
  const terms = recentTerms(new Date()).map((term) => ({
    value: termKey(term),
    label: `${semesterName[term.semester]}, ${termYearLabel(term, locale)}`,
  }));
  const instructors = (course?.instructors ?? []).map((instructor) => ({
    value: instructorKey(instructor),
    label: instructor.name[locale],
  }));

  return (
    <>
      <PageHeader
        title={`${t.title}: ${node.code}`}
        lede={course ? course.title[locale] : node.title}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: studentLifeLabel[locale], href: "/student-life" },
              { label: cr.title, href: "/student-life/course-reviews" },
              { label: node.code, href: courseHref },
              { label: t.breadcrumbLabel },
            ]}
          />
        }
      />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-7 py-7 sm:gap-10 sm:py-10">
        {isCourseReviewConfigured() ? (
          <>
            <section aria-labelledby="how-heading" className="flex flex-col gap-2">
              <h2 id="how-heading" className="font-display text-lg sm:text-xl">
                {t.howItWorksTitle}
              </h2>
              <ul className="flex list-disc flex-col gap-1.5 pl-5 text-muted">
                {t.howItWorks.map((line) => (
                  <li key={line}>{fillTemplate(line, { threshold: PUBLICATION_THRESHOLD })}</li>
                ))}
              </ul>
            </section>
            <ReviewForm
              locale={locale}
              code={node.code}
              terms={terms}
              instructors={instructors}
              otherInstructor={OTHER_INSTRUCTOR}
              action={submitReviewAction}
            />
          </>
        ) : (
          <Notice variant="warning" title={t.unavailableTitle}>
            <p className="mb-3">{t.unavailableBody}</p>
            <Button href={localeHref(locale, "/contact")} variant="secondary">
              {dict.actions.contactUs}
            </Button>
          </Notice>
        )}
        <div>
          <Button href={localeHref(locale, courseHref)} variant="secondary">
            {t.backToCourse}
          </Button>
        </div>
      </div>
    </>
  );
}
