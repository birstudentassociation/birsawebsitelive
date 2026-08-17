import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { resolveCohort } from "@/content/curriculum";
import PageHeader from "@/components/PageHeader";
import StepNav from "@/components/forms/StepNav";
import Notice from "@/components/Notice";
import InferenceNotice from "@/components/study-plan/InferenceNotice";
import CurriculumConfirmForm from "@/components/forms/CurriculumConfirmForm";
import { buildWizardChromeLabels, formatStepOf } from "@/components/forms/wizardChromeCopy";
import { buildStudyPlanCopy } from "@/components/study-plan/studyPlanCopy";
import { getStudyPlanDraft, submitCurriculumStep } from "../actions";
import { STUDY_PLAN_STEPS } from "../steps";

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
    title: copy.curriculum.title,
    description: copy.curriculum.lede,
    path: "/services/study-plan/curriculum",
  });
}

/**
 * The version gate. What this page shows is evidence, not a claim: the
 * credit total and a handful of first-year course codes the student can
 * check against their own transcript without leaving the page, because
 * curricula differ enough (course codes, credit totals, structure) that the
 * wrong one means the wrong degree.
 */
export default async function StudyPlanCurriculumPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const chrome = buildWizardChromeLabels(locale);
  const copy = buildStudyPlanCopy(locale);

  // readDraft is read-only and safe during render; only submitCohortStep and
  // submitCurriculumStep (both Server Actions) ever write this cookie.
  const draft = await getStudyPlanDraft();
  if (!draft.cohort) {
    redirect(localeHref(locale, "/services/study-plan/cohort"));
  }

  const resolution = resolveCohort(draft.cohort);
  if (resolution.status === "unsupported") {
    redirect(localeHref(locale, "/services/study-plan/cannot-help?reason=cohort"));
  }

  const { version, mapping } = resolution;
  const sourceDoc = version.verification.sources[0];
  const courseTitles = new Map(version.courses.value.map((c) => [c.code, c.title]));

  const backHref = localeHref(locale, "/services/study-plan/cohort");
  const progress = formatStepOf(
    chrome.stepOf,
    STUDY_PLAN_STEPS.indexOf("curriculum") + 1,
    STUDY_PLAN_STEPS.length
  );

  return (
    <>
      <PageHeader title={copy.curriculum.title} lede={copy.curriculum.lede} />
      <div className="wrap max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <StepNav backHref={backHref} backLabel={chrome.back} progressText={progress} />

          <div className="flex flex-col gap-4 rounded-lg border border-line p-5">
            <h2 className="font-display text-2xl">{version.label[locale]}</h2>

            <div>
              <p className="text-sm font-semibold text-muted">{copy.curriculum.totalLabel}</p>
              <p className="text-lg font-semibold text-ink">{version.graduationCredits.value}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-muted">{copy.curriculum.coursesLabel}</p>
              <ul className="mt-1 flex flex-col gap-1 text-sm">
                {version.distinguishingCourses.map((code) => (
                  <li key={code}>
                    <span className="font-semibold">{code}</span>
                    {courseTitles.has(code) ? ` ${courseTitles.get(code)}` : ""}
                  </li>
                ))}
              </ul>
            </div>

            {sourceDoc ? (
              <Link
                href={sourceDoc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit text-sm font-semibold text-brand-deep hover:underline"
              >
                {copy.curriculum.sourceLabel} &rarr;
              </Link>
            ) : null}

            {mapping.provenance.kind === "attested" ? (
              <Notice variant="warning">{copy.curriculum.attestedWarning}</Notice>
            ) : null}
          </div>

          <InferenceNotice version={version} cohortCode={mapping.code} locale={locale} />

          <CurriculumConfirmForm
            action={submitCurriculumStep.bind(null, locale)}
            legend={copy.curriculum.legend}
            requiredLabel={dict.actions.required}
            yesLabel={copy.curriculum.yes}
            noLabel={copy.curriculum.no}
            errorSummaryTitle={copy.errorSummaryTitle}
            continueLabel={chrome.continueLabel}
            continuingLabel={chrome.continuing}
          />
        </div>
      </div>
    </>
  );
}
