/**
 * A plan laid out as a document: no forms and no editing, meant to be read
 * away from the service. The same sections, in the same order and with the
 * same copy, as the print page (app/[lang]/services/study-plan/plan/print),
 * and built from the same `lib/study-plan/print.ts` shaping, so a plan reads
 * the same on paper as on the shared, read-only page.
 *
 * Has no hooks and reads nothing from the browser, so it renders on the
 * server or in a client island alike. It draws no title of its own: its
 * sections are `h3`, for a page that supplies the `h1` and an `h2` above it.
 * Passed courses are listed flat for the reason given in lib/study-plan/print.ts.
 */
import Link from "next/link";
import Notice from "@/components/Notice";
import FindingsList from "@/components/study-plan/FindingsList";
import InferenceNotice from "@/components/study-plan/InferenceNotice";
import {
  categoryLabel,
  formatTermRef,
  type StudyPlanCopy,
} from "@/components/study-plan/studyPlanCopy";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import { localeHref, type Locale } from "@/lib/i18n";
import { planTotals, remainingRequirements } from "@/lib/study-plan/derive";
import { checkPlan } from "@/lib/study-plan/findings";
import type { StudyPlan } from "@/lib/study-plan/plan";
import { passedCoursesForPrint, plannedTermsForPrint } from "@/lib/study-plan/print";

export type PlanDocumentProps = {
  plan: StudyPlan;
  locale: Locale;
  copy: StudyPlanCopy;
  /** Extra rows for the facts list under the title, after curriculum, cohort and minor. */
  extraFacts?: { label: string; value: string }[];
};

/** A course code that opens the course page, underlined so it reads as a link on screen. */
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

export default function PlanDocument({ plan, locale, copy, extraFacts = [] }: PlanDocumentProps) {
  const version = CURRICULUM_VERSIONS[plan.versionId];
  const minorName = version.minors.find((m) => m.id === plan.minorId)?.name[locale] ?? "";

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

  return (
    <div className="flex flex-col gap-8">
      <div>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
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
          {extraFacts.map((fact) => (
            <div key={fact.label}>
              <dt className="font-semibold text-muted">{fact.label}</dt>
              <dd className="text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <InferenceNotice version={version} cohortCode={plan.cohort} locale={locale} />

      <div>
        <h3 className="font-display text-xl">{copy.print.passedHeading}</h3>
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
        <h3 className="font-display text-xl">{copy.print.termsHeading}</h3>
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
                  <h4 className="font-display text-lg">
                    {formatTermRef(copy.terms, printTerm.term)}
                  </h4>
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
        <h3 className="font-display text-xl">{copy.print.findingsHeading}</h3>
        <div className="mt-4">
          <FindingsList
            findings={findings}
            locale={locale}
            emptyMessage={copy.print.findingsEmpty}
          />
        </div>
      </div>

      <div>
        <h3 className="font-display text-xl">{copy.print.owedHeading}</h3>
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

      {/* The reader of a shared copy may never have used the service, so the
          caveat travels with the plan exactly as it does on the printout. */}
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
