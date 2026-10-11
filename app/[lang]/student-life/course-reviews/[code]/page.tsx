import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { courseJsonLd, curriculumCourseJsonLd } from "@/lib/structured-data";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import Notice from "@/components/Notice";
import Tag from "@/components/Tag";
import { formatYearLevel, fillTemplate } from "@/components/course-review/constants";
import YourPlanPanel from "@/components/course-review/YourPlanPanel";
import { buildPlanLinkCopy } from "@/components/study-plan/planLinkCopy";
import { buildTermInsightCopy } from "@/components/study-plan/termInsightCopy";
import {
  OFFERING_HISTORY_NOTICE,
  historyLine,
  offeringHistory,
} from "@/lib/courses/offeringHistory";
import { courses } from "@/content/course-review/courses";
import type {
  AcademicTerm,
  Instructor,
  StudentReview,
  AssessmentFacts as AssessmentFactsData,
} from "@/content/course-review/types";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import type { CategoryId, CurriculumVersionId, TermRef } from "@/content/curriculum/types";
import {
  VERSION_ORDER,
  allCourseCodes,
  courseNode,
  equivalentTo,
  prerequisites as prerequisitesIn,
  recommendedIn,
  unlocks as unlocksIn,
  type CourseNode,
} from "@/lib/courses/graph";
import { studentLifeLabel } from "@/content/student-life/topics";
import { PUBLICATION_THRESHOLD } from "@/lib/course-review/groups";
import { reviewFreshness } from "@/lib/course-review/freshness";
import { listPublishedReviews, mergeReviews } from "@/lib/course-review/published";
import { isCourseReviewConfigured } from "@/lib/course-review/submissions";
import { describeBandDistribution } from "@/lib/course-review/workload";

type Dict = ReturnType<typeof getDictionary>["courseReview"];

/**
 * Published reviews come from the database, so the page is regenerated at
 * most an hour after the last request. Publishing and unpublishing from the
 * officer console revalidate the affected pages straight away; this is the
 * backstop for anything that changes the data some other way.
 */
export const revalidate = 3600;

/** "Year 2, Semester 1; Year 2, Summer", or the fallback when the plan never names the course. */
function termsText(terms: TermRef[], t: Dict): string {
  return terms.length > 0
    ? terms.map((term) => `${t.yearLabel} ${term.year}, ${t[term.kind]}`).join("; ")
    : t.notInPlan;
}

/**
 * The bucket a course counts towards in one version, in that version's own
 * words. Minor courses carry the pooled `"minor"` category, which has no
 * credit category of its own, so it gets a plain label here.
 */
function categoryName(
  versionId: CurriculumVersionId,
  category: CategoryId,
  locale: Locale,
  t: Dict
): string {
  if (category === "minor") return t.minorCourseCategory;
  const found = CURRICULUM_VERSIONS[versionId].categories.find((c) => c.id === category);
  return found ? found.name[locale] : category;
}

function termLabel(template: string, term: AcademicTerm, t: Dict, locale: Locale): string {
  const semester =
    term.semester === "summer" ? t.summer : term.semester === 1 ? t.semester1 : t.semester2;
  const start = term.year - 543;
  const year = locale === "th" ? term.year : `${start}/${String(start + 1).slice(-2)}`;
  return fillTemplate(template, { semester, year });
}

// Nested under the literal `course-reviews` route (see the parent page.tsx
// for why that segment already wins over the generic `[audience]` route).
// `[code]` is the only dynamic part, e.g. /student-life/course-reviews/PI121.
//
// Every code any curriculum version lists has a page. Codes in the review
// catalogue get the full page; the rest (the TU, EL, LAS, AH and EE courses,
// and PI courses only older versions list) get the same page with the facts
// the curriculum holds and nothing else. They are reachable by link and by URL
// but are not in the catalogue browser, which stays the PI catalogue.

export function generateStaticParams() {
  return locales.flatMap((lang) => allCourseCodes().map((code) => ({ lang, code })));
}

/** Plain-language summary for a page that has no catalogue description to offer. */
function factsOnlyDescription(node: CourseNode, t: Dict): string {
  return fillTemplate(t.factsOnlyDescription, {
    code: node.code,
    title: node.title,
    credits: node.latest.credits,
  });
}

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
  const path = `/student-life/course-reviews/${node.code}`;
  const course = node.catalogue;
  if (!course) {
    return buildMetadata({
      locale,
      title: `${node.code} ${node.title}`,
      description: factsOnlyDescription(node, getDictionary(locale).courseReview),
      path,
    });
  }

  return buildMetadata({
    locale,
    title: `${course.code} ${course.title[locale]}`,
    description: course.description[locale],
    path,
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

  const node = courseNode(code);
  if (!node) notFound();
  // Present for the PI catalogue; absent for a facts-only page.
  const course = node.catalogue;
  // The latest version that lists the code. For every catalogue course that
  // is 2568, so these are the same facts the page has always shown.
  const version = node.latest.version;
  const index = course ? courses.findIndex((c) => c.code === code) : -1;
  const prevCourse = index > 0 ? courses[index - 1] : null;
  const nextCourse = index >= 0 && index < courses.length - 1 ? courses[index + 1] : null;
  const otherLocale: Locale = locale === "en" ? "th" : "en";
  const prerequisites = prerequisitesIn(node.code, version);
  const neededFor = unlocksIn(node.code, version);
  const terms = recommendedIn(node.code, version);
  const minors = node.latest.minors;
  const equivalents = equivalentTo(node.code);
  // The reviews held in the repository plus those officers have published
  // from approved submissions. Empty when the database isn't configured.
  const reviews = mergeReviews(
    course?.reviews ?? [],
    await listPublishedReviews(node.code, course?.instructors)
  );
  // Where the course is recorded as taught, from review terms (the published
  // ones included) and the assessment facts. Derived history, disclosed below.
  const insight = buildTermInsightCopy(locale);
  const history = offeringHistory(node.code, reviews);
  const collecting = isCourseReviewConfigured();
  const writeReviewHref = localeHref(locale, `/student-life/course-reviews/${node.code}/review`);
  const now = new Date();
  const catalogHref = localeHref(locale, "/student-life/course-reviews");

  return (
    <>
      <JsonLd
        data={
          course
            ? courseJsonLd(locale, course)
            : curriculumCourseJsonLd(locale, node, factsOnlyDescription(node, t))
        }
      />
      <PageHeader
        title={`${node.code}: ${course ? course.title[locale] : node.title}`}
        lede={course ? course.title[otherLocale] : t.factsOnlyLede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: studentLifeLabel[locale], href: "/student-life" },
              { label: t.title, href: "/student-life/course-reviews" },
              { label: node.code },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-7 py-7 sm:gap-10 sm:py-10">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {course ? (
            <>
              <Tag variant="brand">{t.tracks[course.track]}</Tag>
              <Tag variant="forest">{t.categories[course.category]}</Tag>
            </>
          ) : (
            <Tag variant="neutral">{t.factsOnlyBadge}</Tag>
          )}
          {reviews.length ? (
            <Tag variant="neutral">
              {reviews.every((review) => review.sample) ? t.sampleBadge : t.reviewedBadge}
            </Tag>
          ) : null}
        </div>

        {/* Renders only for a visitor with JavaScript and a plan saved on this device. */}
        <YourPlanPanel
          code={node.code}
          locale={locale}
          copy={buildPlanLinkCopy(locale)}
          planHref={localeHref(locale, "/services/study-plan/plan")}
          courseLinkBase={localeHref(locale, "/student-life/course-reviews")}
        />

        <section aria-labelledby="facts-heading" className="flex flex-col gap-2 sm:gap-3">
          <h2 id="facts-heading" className="font-display text-lg sm:text-xl">
            {t.factsHeading}
          </h2>
          <dl className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface text-sm">
            <Fact label={t.creditsLabel}>
              {course
                ? `${course.credits.total} (${course.credits.lecture}-${course.credits.lab}-${course.credits.selfStudy})`
                : node.latest.credits}
            </Fact>
            {course ? (
              <Fact label={t.yearLevelLabel}>
                {formatYearLevel(course.yearLevel, t.yearLabel, t.yearTo)}
              </Fact>
            ) : (
              <Fact label={t.countsTowardsLabel}>
                <ul className="flex flex-col gap-0.5">
                  {VERSION_ORDER.map((id) => {
                    const facts = node.versions[id];
                    return (
                      <li key={id}>
                        {CURRICULUM_VERSIONS[id].label[locale]}:{" "}
                        {facts
                          ? `${categoryName(id, facts.category, locale, t)}${
                              facts.excludedFromTotal ? ` (${t.notCountedInTotal})` : ""
                            }`
                          : t.notInCurriculum}
                      </li>
                    );
                  })}
                </ul>
              </Fact>
            )}
            <Fact label={t.prerequisite}>
              {prerequisites.length > 0 ? (
                <CourseLinks codes={prerequisites} locale={locale} />
              ) : course?.prerequisite ? (
                course.prerequisite[locale]
              ) : (
                t.prerequisitesNone
              )}
            </Fact>
            {neededFor.length > 0 ? (
              <Fact label={t.unlocksLabel}>
                <CourseLinks codes={neededFor} locale={locale} />
              </Fact>
            ) : null}
            <Fact label={t.recommendedTermLabel}>
              {course ? (
                <p>{termsText(terms, t)}</p>
              ) : (
                <ul className="flex flex-col gap-0.5">
                  {VERSION_ORDER.filter((id) => node.versions[id]).map((id) => (
                    <li key={id}>
                      {CURRICULUM_VERSIONS[id].label[locale]}:{" "}
                      {termsText(recommendedIn(node.code, id), t)}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-1">
                <Link
                  href={localeHref(locale, "/services/study-plan")}
                  className="font-semibold text-brand-deep hover:text-brand-dark"
                >
                  {t.studyPlanLink} &rarr;
                </Link>
              </p>
            </Fact>
            {history ? (
              <Fact label={insight.historyLabel}>
                <p>{historyLine(history, locale, insight.history)}</p>
                <p className="mt-1 text-xs">{OFFERING_HISTORY_NOTICE[locale]}</p>
              </Fact>
            ) : null}
            {minors.length > 0 ? (
              <Fact label={t.minorsLabel}>
                <ul className="flex flex-col gap-0.5">
                  {minors.map((minor) => (
                    <li key={minor.id}>
                      {minor.name[locale]} (
                      {minor.role === "required" ? t.minorRequired : t.minorElective})
                    </li>
                  ))}
                </ul>
              </Fact>
            ) : null}
            {equivalents.map((equivalent) => (
              <Fact
                key={equivalent.code}
                label={equivalent.relation === "replacedBy" ? t.replacedByLabel : t.replacesLabel}
              >
                <CourseLinks codes={[equivalent.code]} locale={locale} />
                <p className="mt-1 text-xs">
                  {CURRICULUM_VERSIONS[equivalent.since].label[locale]}
                  {equivalent.derivation.kind === "inferred"
                    ? `. ${equivalent.derivation.reason[locale]}`
                    : ""}
                </p>
              </Fact>
            ))}
            {course?.instructors && course.instructors.length > 0 ? (
              <Fact label={t.instructorsHeading}>
                <ul className="flex flex-wrap gap-x-2 gap-y-1">
                  {course.instructors.map((instructor, i) => (
                    <li key={instructor.name.en} className="flex items-center gap-2">
                      {instructor.profileUrl ? (
                        <a
                          href={instructor.profileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-brand-deep underline underline-offset-2 hover:text-brand-dark"
                        >
                          {instructor.name[locale]}
                        </a>
                      ) : (
                        <span className="font-medium text-ink">{instructor.name[locale]}</span>
                      )}
                      {i < course.instructors!.length - 1 ? (
                        <span aria-hidden className="text-muted">
                          &middot;
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
                <p className="mt-1 text-xs text-muted">{t.instructorsNote}</p>
              </Fact>
            ) : null}
          </dl>
        </section>

        <section className="flex flex-col gap-2 sm:gap-3">
          <h2 className="font-display text-lg sm:text-xl">{t.descriptionHeading}</h2>
          {course ? (
            <p className="max-w-[var(--measure)] leading-relaxed whitespace-pre-line text-ink">
              {course.description[locale]}
            </p>
          ) : (
            <p className="text-sm text-muted">{t.factsOnlyDescriptionBody}</p>
          )}
        </section>

        <section className="flex flex-col gap-2 sm:gap-3">
          <h2 className="font-display text-lg sm:text-xl">{t.assessmentFactsHeading}</h2>
          {course?.assessmentFacts ? (
            <AssessmentFacts facts={course.assessmentFacts} locale={locale} t={t} />
          ) : (
            <p className="text-sm text-muted">{t.assessmentFactsMissing}</p>
          )}
        </section>

        <section className="flex flex-col gap-4 sm:gap-6">
          <h2 className="font-display text-lg sm:text-xl">{t.reviewHeading}</h2>

          {reviews.length ? (
            <>
              {reviews.map((review, index) => (
                <CourseReview
                  key={index}
                  review={review}
                  locale={locale}
                  t={t}
                  currentInstructors={course?.instructors}
                  now={now}
                />
              ))}
              {collecting ? (
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                  {t.collect.addReviewPrompt}
                  <Link
                    href={writeReviewHref}
                    className="inline-flex min-h-11 items-center font-semibold text-brand-deep hover:text-brand-dark"
                  >
                    {t.collect.writeReviewLink} &rarr;
                  </Link>
                </p>
              ) : null}
            </>
          ) : (
            <Notice variant="placeholder" title={t.noReviewTitle}>
              <p className="mb-3">
                {collecting
                  ? fillTemplate(t.collect.noReviewBodyCollecting, {
                      threshold: PUBLICATION_THRESHOLD,
                    })
                  : t.noReviewBody}
              </p>
              {collecting ? (
                <Button href={writeReviewHref} variant="secondary">
                  {t.collect.writeReviewLink}
                </Button>
              ) : (
                <Button href={localeHref(locale, "/contact")} variant="secondary">
                  {dict.actions.contactUs}
                </Button>
              )}
            </Notice>
          )}
        </section>

        {prevCourse || nextCourse ? (
          <nav
            aria-label={t.courseNav}
            className="grid grid-cols-2 gap-2 border-t border-line pt-5 sm:gap-4 sm:pt-8"
          >
            <div>
              {prevCourse ? (
                <Link
                  href={localeHref(locale, `/student-life/course-reviews/${prevCourse.code}`)}
                  className="flex h-full min-h-11 flex-col gap-0.5 rounded-lg border border-line bg-surface p-3 text-sm hover:border-brand sm:gap-1 sm:p-4 sm:text-base"
                >
                  <span className="text-xs font-semibold tracking-wide text-muted uppercase">
                    &larr; {t.previous}
                  </span>
                  <span className="font-semibold text-ink">
                    {prevCourse.code}: {prevCourse.title[locale]}
                  </span>
                </Link>
              ) : null}
            </div>
            <div>
              {nextCourse ? (
                <Link
                  href={localeHref(locale, `/student-life/course-reviews/${nextCourse.code}`)}
                  className="flex h-full min-h-11 flex-col gap-0.5 rounded-lg border border-line bg-surface p-3 text-right text-sm hover:border-brand sm:gap-1 sm:p-4 sm:text-base"
                >
                  <span className="text-xs font-semibold tracking-wide text-muted uppercase">
                    {t.next} &rarr;
                  </span>
                  <span className="font-semibold text-ink">
                    {nextCourse.code}: {nextCourse.title[locale]}
                  </span>
                </Link>
              ) : null}
            </div>
          </nav>
        ) : null}

        <Link
          href={catalogHref}
          className="-my-2 inline-flex min-h-11 items-center self-start text-sm font-semibold text-brand-deep hover:text-brand-dark"
        >
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
  currentInstructors,
  now,
}: {
  review: StudentReview;
  locale: Locale;
  t: Dict;
  currentInstructors: readonly Instructor[] | undefined;
  now: Date;
}) {
  const freshness = reviewFreshness(review, currentInstructors, now);
  const bandSentences = review.workloadBands
    ? describeBandDistribution(review.workloadBands, {
        labels: t.collect.bandLabels,
        sentence: t.collect.bandSentence,
        sentenceSingle: t.collect.bandSentenceSingle,
      })
    : [];
  return (
    <article className="flex flex-col gap-4 sm:gap-6">
      <header className="flex flex-col gap-1">
        <h3 className="flex flex-wrap items-center gap-2 font-display text-lg text-ink">
          {termLabel(t.reviewTerm, review.term, t, locale)}
          {freshness.dated ? <Tag variant="neutral">{t.collect.datedBadge}</Tag> : null}
        </h3>
        {review.instructor ? (
          <p className="text-sm text-muted">
            {t.reviewInstructor} {review.instructor.name[locale]}
          </p>
        ) : null}
        {freshness.dated ? <p className="text-sm text-muted">{t.collect.datedNote}</p> : null}
        {freshness.instructor === "changed" && review.instructor ? (
          <p className="text-sm text-muted">
            {fillTemplate(t.collect.instructorChangedNote, {
              name: review.instructor.name[locale],
            })}
          </p>
        ) : null}
        {freshness.instructor === "elsewhere" ? (
          <p className="text-sm text-muted">{t.collect.instructorElsewhereNote}</p>
        ) : null}
      </header>
      {review.sample ? (
        <Notice variant="placeholder" title={t.sampleReviewTitle}>
          <p>{t.sampleReviewBody}</p>
        </Notice>
      ) : null}

      <p className="text-sm text-muted">
        {fillTemplate(t.reviewBasedOn, { count: review.reviewCount })}
      </p>

      <div className="flex flex-col gap-1 sm:gap-2">
        <h4 className="font-semibold text-ink">{t.workloadHeading}</h4>
        <p className="max-w-[var(--measure)] text-sm leading-relaxed text-muted sm:text-base">
          {review.workload[locale]}
        </p>
        {bandSentences.length > 0 ? (
          <div className="flex max-w-[var(--measure)] flex-col gap-1 text-sm text-muted">
            <h5 className="font-semibold text-ink">{t.collect.bandsHeading}</h5>
            <ul className="flex list-disc flex-col gap-0.5 pl-5">
              {bandSentences.map((sentence) => (
                <li key={sentence}>{sentence}</li>
              ))}
            </ul>
            <p className="text-xs">{t.collect.bandNote}</p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-1 sm:gap-2">
        <h4 className="font-semibold text-ink">{t.assessmentHeading}</h4>
        <p className="max-w-[var(--measure)] text-sm leading-relaxed text-muted sm:text-base">
          {review.assessmentStyle[locale]}
        </p>
      </div>

      <div className="flex flex-col gap-1 sm:gap-2">
        <h4 className="font-semibold text-ink">{t.tipsHeading}</h4>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm leading-relaxed text-muted sm:gap-1.5 sm:text-base">
          {review.tips.map((tip, i) => (
            <li key={i}>{tip[locale]}</li>
          ))}
        </ul>
      </div>

      {review.quotes && review.quotes.length > 0 ? (
        <div className="flex flex-col gap-1 sm:gap-2">
          <h4 className="font-semibold text-ink">{t.quotesHeading}</h4>
          <ul className="flex flex-col gap-2 sm:gap-3">
            {review.quotes.map((quote, i) => (
              <li
                key={i}
                className="rounded-md border-l-4 border-brand bg-sunken px-3 py-2.5 text-sm text-ink sm:p-4"
              >
                <p className="italic">&ldquo;{quote.text[locale]}&rdquo;</p>
                {quote.attribution ? (
                  <p className="mt-1 text-xs text-muted">&middot; {quote.attribution[locale]}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[6.75rem_1fr] gap-x-3 px-3 py-2 sm:grid-cols-[14rem_1fr] sm:gap-x-6 sm:px-4 sm:py-2.5">
      <dt className="font-semibold text-ink">{label}</dt>
      <dd className="min-w-0 text-muted">{children}</dd>
    </div>
  );
}

function CourseLinks({ codes, locale }: { codes: string[]; locale: Locale }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {codes.map((code) => (
        <li key={code}>
          <Link
            href={localeHref(locale, `/student-life/course-reviews/${code}`)}
            className="inline-block rounded-full bg-brand-tint px-2.5 py-0.5 text-xs font-semibold text-brand-deep hover:text-brand-dark"
          >
            {code}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function AssessmentFacts({
  facts,
  locale,
  t,
}: {
  facts: AssessmentFactsData;
  locale: Locale;
  t: Dict;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-3 text-sm sm:gap-4 sm:p-4">
      <h3 className="font-semibold text-ink">
        {termLabel(t.assessmentFactsTerm, facts.term, t, locale)}
      </h3>
      {facts.weights && facts.weights.length > 0 ? (
        <table className="w-full border-collapse text-left tabular-nums sm:max-w-md">
          <caption className="pb-2 text-left font-semibold text-ink">{t.assessmentLabel}</caption>
          <tbody>
            {facts.weights.map((component) => (
              <tr key={component.label.en} className="border-t border-line">
                <th scope="row" className="py-1.5 pr-4 font-normal text-muted sm:py-2">
                  {component.label[locale]}
                </th>
                <td className="py-1.5 text-right font-medium text-ink sm:py-2">
                  {component.weight}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      {facts.examFormat ? (
        <p className="border-t border-line pt-3">
          <span className="font-semibold text-ink">{t.examFormatLabel}: </span>
          <span className="text-muted">{facts.examFormat[locale]}</span>
        </p>
      ) : null}
      {facts.attendance ? (
        <p>
          <span className="font-semibold text-ink">{t.attendanceLabel}: </span>
          <span className="text-muted">{facts.attendance[locale]}</span>
        </p>
      ) : null}
    </div>
  );
}
