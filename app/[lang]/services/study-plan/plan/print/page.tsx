import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CURRICULUM_VERSIONS, type TermRef } from "@/content/curriculum";
import { planTotals, remainingRequirements } from "@/lib/study-plan/derive";
import { checkPlan } from "@/lib/study-plan/findings";
import { deserialisePlan, PLAN_FIELD } from "@/lib/study-plan/plan";
import {
  generatedOnForPrint,
  passedCoursesForPrint,
  plannedTermsForPrint,
} from "@/lib/study-plan/print";
import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import InferenceNotice from "@/components/study-plan/InferenceNotice";
import FindingsList from "@/components/study-plan/FindingsList";
import Notice from "@/components/Notice";
import {
  buildStudyPlanCopy,
  categoryLabel,
  type StudyPlanCopy,
} from "@/components/study-plan/studyPlanCopy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const copy = buildStudyPlanCopy(locale);

  return buildMetadata({
    locale,
    title: copy.print.title,
    description: copy.print.title,
    path: "/services/study-plan/plan/print",
  });
}

/** e.g. "Year 3, Semester 1", built from the same `copy.terms` labels every other step in this journey uses. */
function formatTermLabel(copy: StudyPlanCopy, term: TermRef): string {
  return `${copy.terms.yearTemplate.replace("{n}", String(term.year))}, ${copy.terms[term.kind]}`;
}

/**
 * A course code that opens the course page, in the page's own text colour on
 * paper: the underline marks it as a link on screen, and the printout loses
 * nothing because the code is still printed.
 */
function CourseCodeLink({ code, locale }: { code: string; locale: Locale }) {
  return (
    <Link
      href={localeHref(locale, `/student-life/course-reviews/${code}`)}
      className="font-semibold text-brand-deep underline underline-offset-2 hover:text-brand-dark print:text-ink"
    >
      {code}
    </Link>
  );
}

/**
 * The print page: everything on one page, no forms and no editing, meant to
 * be kept or printed for the student's own reference.
 *
 * Passed courses are listed flat, not grouped by term: `StudyPlan.passed` is
 * a flat list with no term attribution, because the service never records
 * which term a passed course was taken in (see the header comment on
 * lib/study-plan/print.ts for why reconstructing that from the recommended
 * plan would be presenting a guess as fact). Only the terms the student
 * actually built (`plan.terms`) are grouped by term, because those carry
 * real term attribution the student chose.
 */
export default async function StudyPlanPrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [PLAN_FIELD]?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const copy = buildStudyPlanCopy(locale);

  const { [PLAN_FIELD]: rawPlan } = await searchParams;
  const plan = rawPlan ? deserialisePlan(rawPlan) : null;
  if (!plan) {
    redirect(localeHref(locale, "/services/study-plan/minor"));
  }

  const version = CURRICULUM_VERSIONS[plan.versionId];
  const chosenMinor = version.minors.find((m) => m.id === plan.minorId);
  const minorName = chosenMinor?.name[locale] ?? "";

  const passedCourses = passedCoursesForPrint(version, plan.passed);
  const plannedTerms = plannedTermsForPrint(version, plan.terms);

  const { allCodes, totalFreeElectiveCredits } = planTotals(plan);

  const findings = checkPlan(version, plan);
  const shortfalls = remainingRequirements(
    version,
    allCodes,
    plan.minorId,
    totalFreeElectiveCredits
  );

  const generatedOn = generatedOnForPrint(locale);

  return (
    <div className="wrap flex max-w-[var(--measure)] flex-col gap-8 py-10">
      <div>
        <h1 className="font-display text-3xl">{copy.print.title}</h1>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-muted">{copy.print.curriculumLabel}</dt>
            <dd className="text-ink">{version.label[locale]}</dd>
          </div>
          <div>
            <dt className="font-semibold text-muted">{copy.print.cohortLabel}</dt>
            <dd className="text-ink">{plan.cohort}</dd>
          </div>
          <div>
            <dt className="font-semibold text-muted">{copy.print.minorLabel}</dt>
            <dd className="text-ink">{minorName}</dd>
          </div>
          <div>
            <dt className="font-semibold text-muted">{copy.print.generatedOnLabel}</dt>
            <dd className="text-ink">{generatedOn}</dd>
          </div>
        </dl>
      </div>

      <InferenceNotice version={version} cohortCode={plan.cohort} locale={locale} />

      <div>
        <h2 className="font-display text-xl">{copy.print.passedHeading}</h2>
        <p className="mt-1 text-sm text-muted">{copy.print.passedHint}</p>
        {passedCourses.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-1 text-sm">
            {passedCourses.map((course) => (
              <li key={course.code}>
                <CourseCodeLink code={course.code} locale={locale} />
                {course.title ? ` ${course.title}` : ""} &middot; {course.credits}{" "}
                {copy.plan.creditsUnit}
              </li>
            ))}
          </ul>
        ) : null}
        {plan.freeElectiveCreditsPassed > 0 ? (
          <p className="mt-2 text-sm text-ink">
            {copy.print.passedFreeElectiveTemplate.replace(
              "{n}",
              String(plan.freeElectiveCreditsPassed)
            )}
          </p>
        ) : null}
      </div>

      <div>
        <h2 className="font-display text-xl">{copy.print.termsHeading}</h2>
        <div className="mt-4 flex flex-col gap-4">
          {plannedTerms.map((printTerm) => {
            const termCredits =
              printTerm.courses.reduce((n, c) => n + c.credits, 0) + printTerm.freeElectiveCredits;
            return (
              <div
                key={`${printTerm.term.year}-${printTerm.term.kind}`}
                className="rounded-lg border border-line p-4"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-lg">{formatTermLabel(copy, printTerm.term)}</h3>
                  <p className="text-sm text-muted">
                    {termCredits} {copy.plan.creditsUnit}
                  </p>
                </div>
                {printTerm.courses.length > 0 ? (
                  <ul className="mt-2 flex flex-col gap-1 text-sm">
                    {printTerm.courses.map((course) => (
                      <li key={course.code}>
                        <CourseCodeLink code={course.code} locale={locale} />
                        {course.title ? ` ${course.title}` : ""} &middot; {course.credits}{" "}
                        {copy.plan.creditsUnit}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {printTerm.freeElectiveCredits > 0 ? (
                  <p className="mt-2 text-sm text-muted">
                    {copy.print.freeElectiveCreditsTemplate.replace(
                      "{n}",
                      String(printTerm.freeElectiveCredits)
                    )}
                  </p>
                ) : null}
                {printTerm.courses.length === 0 && printTerm.freeElectiveCredits === 0 ? (
                  <p className="mt-2 text-sm text-muted">{copy.print.noCoursesInTerm}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl">{copy.print.findingsHeading}</h2>
        <div className="mt-4">
          <FindingsList
            findings={findings}
            locale={locale}
            emptyMessage={copy.print.findingsEmpty}
          />
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl">{copy.print.owedHeading}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="py-2 pr-3 font-semibold text-muted">
                  {copy.print.owedCategoryHeader}
                </th>
                <th className="py-2 pr-3 font-semibold text-muted">
                  {copy.print.owedEarnedHeader}
                </th>
                <th className="py-2 font-semibold text-muted">{copy.print.owedRemainingHeader}</th>
              </tr>
            </thead>
            <tbody>
              {shortfalls.map((shortfall) => (
                <tr key={shortfall.category.id} className="border-b border-line">
                  <td className="py-2 pr-3 text-ink">
                    {categoryLabel(
                      copy.plan,
                      shortfall.category.id,
                      shortfall.category.name[locale],
                      minorName
                    )}
                  </td>
                  <td className="py-2 pr-3 text-ink">{shortfall.earned}</td>
                  <td className="py-2 text-ink">{shortfall.remaining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/*
        The printout is read away from the service (see the header comment
        above), so it has to carry this caveat itself: reading only the paper,
        a student has no other way to learn the plan does not check whether a
        course actually runs in a term, anything at the Dean's or an advisor's
        discretion, or anything depending on GPA. Reuses copy.plan's keys
        rather than a second copy of the same text, because two copies would
        drift.
      */}
      <Notice variant="info" title={copy.plan.doesNotCheckHeading}>
        <ul className="flex flex-col gap-1.5">
          {copy.plan.doesNotCheck.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true">&bull;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Notice>
    </div>
  );
}
