import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import { fillTemplate } from "@/components/course-review/constants";
import CompareForm from "@/components/course-review/CompareForm";
import ComparePlanRows from "@/components/course-review/ComparePlanRows";
import CourseLinks from "@/components/course-review/CourseLinks";
import { buildPlanLinkCopy } from "@/components/study-plan/planLinkCopy";
import { buildTermInsightCopy } from "@/components/study-plan/termInsightCopy";
import type { AcademicTerm } from "@/content/course-review/types";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import { studentLifeLabel } from "@/content/student-life/topics";
import {
  COMPARE_A,
  COMPARE_B,
  assembleCompare,
  resolveCompareCode,
  type CompareSide,
} from "@/lib/courses/compare";
import { courseNode } from "@/lib/courses/graph";
import { OFFERING_HISTORY_NOTICE, historyLine } from "@/lib/courses/offeringHistory";
import { categoryName, termsText } from "@/lib/course-review/display";
import { listPublishedReviews, mergeReviews } from "@/lib/course-review/published";
import { reviewLine, type ReviewLineCopy } from "@/lib/course-review/reviewSummary";
import { describeRecordedTerm } from "@/lib/study-plan/assessmentProfile";

/**
 * A comparison is one of hundreds of thousands of possible pairs, each a thin
 * page that only repeats what the two course pages already say, so it is never
 * offered to search engines. The courses' own pages are the ones worth finding.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const copy = buildTermInsightCopy(locale).courseCompare;

  const metadata = buildMetadata({
    locale,
    title: copy.title,
    description: copy.lede,
    path: "/student-life/course-reviews/compare",
  });
  return { ...metadata, robots: { index: false, follow: true } };
}

/** The first value of a query parameter, which Next types as a string or an array when repeated. */
function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function Row({ label, cells }: { label: string; cells: [React.ReactNode, React.ReactNode] }) {
  return (
    <tr className="border-t border-line align-top">
      <th scope="row" className="px-3 py-2 text-left font-semibold text-ink sm:px-4">
        {label}
      </th>
      {cells.map((cell, index) => (
        <td key={index} className="min-w-0 px-3 py-2 text-muted sm:px-4">
          {cell}
        </td>
      ))}
    </tr>
  );
}

/**
 * Two courses side by side. The comparison is made of the same facts the course
 * pages state, read from the same places, and it never ranks: no row says which
 * course is better, and reviews appear only as a distribution in words.
 *
 * It is a plain GET page, so it works with JavaScript off. What each course
 * counts towards is stated generically; a visitor with a plan saved on this
 * device also gets rows for their own plan, added in the browser.
 */
export default async function CompareCoursesPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [COMPARE_A]?: string | string[]; [COMPARE_B]?: string | string[] }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.courseReview;
  const insight = buildTermInsightCopy(locale);
  const c = insight.courseCompare;

  const query = await searchParams;
  const rawA = firstParam(query[COMPARE_A]);
  const rawB = firstParam(query[COMPARE_B]);

  // The reviews each course page would show: the repository's and the ones
  // published from the database. Read only for a code that is valid.
  const reviews = new Map<string, ReturnType<typeof mergeReviews>>();
  for (const code of [resolveCompareCode(rawA), resolveCompareCode(rawB)]) {
    if (!code || reviews.has(code)) continue;
    const course = courseNode(code)?.catalogue;
    reviews.set(
      code,
      mergeReviews(course?.reviews ?? [], await listPublishedReviews(code, course?.instructors))
    );
  }
  const result = assembleCompare(rawA, rawB, (code) => reviews.get(code) ?? []);

  const collect = t.collect;
  const reviewCopy: ReviewLineCopy = {
    ...insight.reviewLine,
    band: {
      labels: collect.bandLabels,
      sentence: collect.bandSentence,
      sentenceSingle: collect.bandSentenceSingle,
    },
  };
  const termLabel = (term: AcademicTerm) => describeRecordedTerm(term, locale, insight.profile);

  const titleOf = (side: CompareSide) =>
    side.node.catalogue ? side.node.catalogue.title[locale] : side.node.title;
  const courseHref = (code: string) => localeHref(locale, `/student-life/course-reviews/${code}`);

  const assessment = (side: CompareSide) => {
    const { kind, finalExamWeight, term } = side.assessment;
    const shape =
      kind === "finalExam"
        ? fillTemplate(c.finalExamTemplate, { n: finalExamWeight ?? 0 })
        : kind === "courseworkOnly"
          ? c.courseworkOnly
          : kind === "otherExam"
            ? c.otherExam
            : c.assessmentUnknown;
    return (
      <>
        <p>{shape}</p>
        {term && kind !== "unknown" ? (
          <p className="mt-1 text-xs">
            {fillTemplate(c.assessmentRecordedFor, { term: termLabel(term) })}
          </p>
        ) : null}
      </>
    );
  };

  const countsTowards = (side: CompareSide) => (
    <>
      <p>
        {categoryName(side.version, side.counts.category, locale, t)}
        {side.node.latest.excludedFromTotal ? ` (${t.notCountedInTotal})` : ""}
      </p>
      {side.counts.minors.length > 0 ? (
        <p className="mt-1 text-xs">
          {side.counts.minors
            .map(
              (minor) =>
                `${minor.name[locale]} (${minor.role === "required" ? t.minorRequired : t.minorElective})`
            )
            .join("; ")}
        </p>
      ) : null}
      <p className="mt-1 text-xs">{CURRICULUM_VERSIONS[side.version].label[locale]}</p>
    </>
  );

  const codeList = (codes: string[], none: string) =>
    codes.length > 0 ? <CourseLinks codes={codes} locale={locale} /> : none;

  const historyCell = (side: CompareSide) =>
    side.history ? historyLine(side.history, locale, insight.history) : c.noHistory;

  const reviewCell = (side: CompareSide) => (
    <>
      <p>{reviewLine(side.digest, reviewCopy, termLabel)}</p>
      <p className="mt-1">
        <Link
          href={courseHref(side.code)}
          className="text-xs font-semibold text-brand-deep hover:text-brand-dark"
        >
          {c.coursePage}
          <span className="sr-only"> {side.code}</span>
        </Link>
      </p>
    </>
  );

  return (
    <>
      <PageHeader
        title={c.title}
        lede={c.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: studentLifeLabel[locale], href: "/student-life" },
              { label: t.title, href: "/student-life/course-reviews" },
              { label: c.title },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-7 py-7 sm:gap-10 sm:py-10">
        <CompareForm
          locale={locale}
          selected={{
            a: resolveCompareCode(rawA) ?? undefined,
            b: resolveCompareCode(rawB) ?? undefined,
          }}
        />

        {!result.ok ? (
          <Notice variant="warning">
            {result.reason === "missing"
              ? c.missing
              : result.reason === "unknown"
                ? fillTemplate(c.unknown, { codes: result.unknown.join(", ") })
                : fillTemplate(c.same, { code: result.code })}
          </Notice>
        ) : (
          <section aria-labelledby="compare-heading" className="flex flex-col gap-3">
            <h2 id="compare-heading" className="sr-only">
              {c.title}
            </h2>
            <p className="max-w-[var(--measure)] text-sm leading-relaxed text-muted">
              {c.notRanked}
            </p>
            <div className="overflow-x-auto rounded-lg border border-line bg-surface">
              <table className="w-full min-w-[32rem] border-collapse text-sm">
                <thead>
                  <tr className="bg-sunken">
                    <th scope="col" className="px-3 py-2 text-left font-semibold text-ink sm:px-4">
                      {c.courseRow}
                    </th>
                    {[result.a, result.b].map((side) => (
                      <th
                        key={side.code}
                        scope="col"
                        className="px-3 py-2 text-left font-semibold text-ink sm:px-4"
                      >
                        <Link
                          href={courseHref(side.code)}
                          className="text-brand-deep hover:text-brand-dark"
                        >
                          {side.code}
                        </Link>
                        <span className="block font-normal text-muted">{titleOf(side)}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <Row label={t.creditsLabel} cells={[result.a.credits, result.b.credits]} />
                  <Row
                    label={t.countsTowardsLabel}
                    cells={[countsTowards(result.a), countsTowards(result.b)]}
                  />
                  <Row
                    label={t.prerequisite}
                    cells={[
                      codeList(result.a.prerequisites, t.prerequisitesNone),
                      codeList(result.b.prerequisites, t.prerequisitesNone),
                    ]}
                  />
                  <Row
                    label={t.unlocksLabel}
                    cells={[codeList(result.a.unlocks, c.none), codeList(result.b.unlocks, c.none)]}
                  />
                  <Row
                    label={t.recommendedTermLabel}
                    cells={[
                      termsText(result.a.recommendedTerms, t),
                      termsText(result.b.recommendedTerms, t),
                    ]}
                  />
                  <Row
                    label={c.assessmentRow}
                    cells={[assessment(result.a), assessment(result.b)]}
                  />
                  <Row
                    label={insight.historyLabel}
                    cells={[historyCell(result.a), historyCell(result.b)]}
                  />
                  <Row label={c.reviewsRow} cells={[reviewCell(result.a), reviewCell(result.b)]} />
                </tbody>
                {/* Renders only for a visitor with JavaScript and a plan saved on this device. */}
                <ComparePlanRows
                  codes={[result.a.code, result.b.code]}
                  locale={locale}
                  copy={buildPlanLinkCopy(locale)}
                  compareCopy={c}
                />
              </table>
            </div>
            {result.a.history || result.b.history ? (
              <p className="max-w-[var(--measure)] text-xs leading-relaxed text-muted">
                {OFFERING_HISTORY_NOTICE[locale]}
              </p>
            ) : null}
          </section>
        )}

        <Link
          href={localeHref(locale, "/student-life/course-reviews")}
          className="-my-2 inline-flex min-h-11 items-center self-start text-sm font-semibold text-brand-deep hover:text-brand-dark"
        >
          &larr; {t.backToCatalog}
        </Link>
      </div>
    </>
  );
}
