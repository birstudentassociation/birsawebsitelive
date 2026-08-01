import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import StepNav from "@/components/forms/StepNav";
import QuestionStepForm from "@/components/forms/QuestionStepForm";
import { buildWizardChromeLabels, formatStepOf } from "@/components/forms/wizardChromeCopy";
import { buildStudyPlanCopy } from "@/components/study-plan/studyPlanCopy";
import { getStudyPlanDraft, submitCohortStep } from "../actions";
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
    title: copy.cohort.title,
    description: copy.cohort.title,
    path: "/services/study-plan/cohort",
  });
}

export default async function StudyPlanCohortPage({
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

  // readDraft is safe to call during render (read-only); the draft is only
  // ever written from a Server Action, in submitCohortStep.
  const draft = await getStudyPlanDraft();
  const backHref = localeHref(locale, "/services/study-plan");
  const progress = formatStepOf(
    chrome.stepOf,
    STUDY_PLAN_STEPS.indexOf("cohort") + 1,
    STUDY_PLAN_STEPS.length
  );

  return (
    <>
      <PageHeader title={copy.cohort.title} />
      <div className="wrap max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <StepNav backHref={backHref} backLabel={chrome.back} progressText={progress} />
          <QuestionStepForm
            action={submitCohortStep.bind(null, locale)}
            initialState={{ status: "idle" }}
            errorSummaryTitle={copy.errorSummaryTitle}
            continueLabel={chrome.continueLabel}
            continuingLabel={chrome.continuing}
            field={{
              name: "cohort",
              label: copy.cohort.label,
              hint: copy.cohort.hint,
              required: true,
              requiredLabel: dict.actions.required,
              defaultValue: draft.cohort,
              autoComplete: "off",
            }}
          />
        </div>
      </div>
    </>
  );
}
