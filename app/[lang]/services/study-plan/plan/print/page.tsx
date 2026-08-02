import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CURRICULUM_VERSIONS, type CategoryId, type TermRef } from "@/content/curriculum";
import { planTotals, remainingRequirements } from "@/lib/study-plan/derive";
import { checkPlan } from "@/lib/study-plan/findings";
import { deserialisePlan, PLAN_FIELD } from "@/lib/study-plan/plan";
import { passedCoursesForPrint, plannedTermsForPrint } from "@/lib/study-plan/print";
import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import InferenceNotice from "@/components/study-plan/InferenceNotice";
import FindingsList from "@/components/study-plan/FindingsList";
import Notice from "@/components/Notice";
import { buildStudyPlanCopy, type StudyPlanCopy } from "@/components/study-plan/studyPlanCopy";

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

/** See the identical function on the plan screen: the three minor buckets are named for the student's actual chosen minor. */
function categoryLabel(
  copy: StudyPlanCopy,
  categoryId: CategoryId,
  categoryName: string,
  minorName: string
): string {
  switch (categoryId) {
    case "minorRequired":
      return copy.plan.minorRequiredTemplate.replace("{minor}", minorName);
    case "minorElective":
      return copy.plan.minorElectiveTemplate.replace("{minor}", minorName);
    case "minorElectiveOther":
      return copy.plan.minorElectiveOtherTemplate.replace("{minor}", minorName);
    default:
      return categoryName;
  }
}

/**
 * The print page: everything on one page, no forms and no editing, meant to
 * be handed to an advisor.
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
  const shortfalls = remainingRequirements(version, allCodes, plan.minorId, totalFreeElectiveCredits);

  const generatedOn = new Date().toLocaleDateString(locale === "th" ? "th-TH" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="wrap max-w-[var(--measure)] flex flex-col gap-8 py-10">
      <div>
        <h1 className="font-display text-3xl">{copy.print.title}</h1>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted font-semibold">{copy.print.curriculumLabel}</dt>
            <dd className="text-ink">{version.label[locale]}</dd>
          </div>
          <div>
            <dt className="text-muted font-semibold">{copy.print.cohortLabel}</dt>
            <dd className="text-ink">{plan.cohort}</dd>
          </div>
          <div>
            <dt className="text-muted font-semibold">{copy.print.minorLabel}</dt>
            <dd className="text-ink">{minorName}</dd>
          </div>
          <div>
            <dt className="text-muted font-semibold">{copy.print.generatedOnLabel}</dt>
            <dd className="text-ink">{generatedOn}</dd>
          </div>
        </dl>
      </div>

      <InferenceNotice version={version} cohortCode={plan.cohort} locale={locale} />

      <div>
        <h2 className="font-display text-xl">{copy.print.passedHeading}</h2>
        <p className="text-muted mt-1 text-sm">{copy.print.passedHint}</p>
        {passedCourses.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-1 text-sm">
            {passedCourses.map((course) => (
              <li key={course.code}>
                <span className="font-semibold">{course.code}</span>
                {course.title ? ` ${course.title}` : ""} &middot; {course.credits} {copy.plan.creditsUnit}
              </li>
            ))}
          </ul>
        ) : null}
        {plan.freeElectiveCreditsPassed > 0 ? (
          <p className="text-ink mt-2 text-sm">
            {copy.print.passedFreeElectiveTemplate.replace("{n}", String(plan.freeElectiveCreditsPassed))}
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
                className="border-line rounded-lg border p-4"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-lg">{formatTermLabel(copy, printTerm.term)}</h3>
                  <p className="text-muted text-sm">
                    {termCredits} {copy.plan.creditsUnit}
                  </p>
                </div>
                {printTerm.courses.length > 0 ? (
                  <ul className="mt-2 flex flex-col gap-1 text-sm">
                    {printTerm.courses.map((course) => (
                      <li key={course.code}>
                        <span className="font-semibold">{course.code}</span>
                        {course.title ? ` ${course.title}` : ""} &middot; {course.credits}{" "}
                        {copy.plan.creditsUnit}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {printTerm.freeElectiveCredits > 0 ? (
                  <p className="text-muted mt-2 text-sm">
                    {copy.print.freeElectiveCreditsTemplate.replace(
                      "{n}",
                      String(printTerm.freeElectiveCredits)
                    )}
                  </p>
                ) : null}
                {printTerm.courses.length === 0 && printTerm.freeElectiveCredits === 0 ? (
                  <p className="text-muted mt-2 text-sm">{copy.print.noCoursesInTerm}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl">{copy.print.findingsHeading}</h2>
        <div className="mt-4">
          <FindingsList findings={findings} locale={locale} emptyMessage={copy.print.findingsEmpty} />
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl">{copy.print.owedHeading}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-sm">
            <thead>
              <tr className="border-line border-b text-left">
                <th className="text-muted py-2 pr-3 font-semibold">{copy.print.owedCategoryHeader}</th>
                <th className="text-muted py-2 pr-3 font-semibold">{copy.print.owedEarnedHeader}</th>
                <th className="text-muted py-2 font-semibold">{copy.print.owedRemainingHeader}</th>
              </tr>
            </thead>
            <tbody>
              {shortfalls.map((shortfall) => (
                <tr key={shortfall.category.id} className="border-line border-b">
                  <td className="text-ink py-2 pr-3">
                    {categoryLabel(copy, shortfall.category.id, shortfall.category.name[locale], minorName)}
                  </td>
                  <td className="text-ink py-2 pr-3">{shortfall.earned}</td>
                  <td className="text-ink py-2">{shortfall.remaining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/*
        The print page is the document a student hands to an advisor (see the
        header comment above), so the advisor needs this caveat at least as
        much as the student does: reading only the printout, they have no
        other way to learn the plan does not check whether a course actually
        runs in a term, anything at the Dean's or an advisor's discretion, or
        anything depending on GPA. Reuses copy.plan's keys rather than a
        second copy of the same text, because two copies would drift.
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
