import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import StepNav from "@/components/forms/StepNav";
import WhereStepForm from "@/components/forms/WhereStepForm";
import { buildWizardChromeLabels, formatStepOf } from "@/components/forms/wizardChromeCopy";
import { buildStudyPlanCopy } from "@/components/study-plan/studyPlanCopy";
import { getStudyPlanDraft, submitWhereStep } from "../actions";
import { STUDY_PLAN_STEPS } from "../steps";

const YEARS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const TERM_KINDS = ["semester1", "semester2", "summer"] as const;

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
    title: copy.where.title,
    description: copy.where.hint,
    path: "/services/study-plan/where",
  });
}

/**
 * "Which year and semester are you in now?": the first of the two questions
 * that decide the initial plan. The plan itself is not built here (it needs
 * the minor too), so this step only records the position in the draft
 * cookie and moves on.
 */
export default async function StudyPlanWherePage({
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
  // ever written from a Server Action, in submitWhereStep.
  const draft = await getStudyPlanDraft();
  if (!draft.cohort) {
    redirect(localeHref(locale, "/services/study-plan/cohort"));
  }

  const yearOptions = YEARS.map((n) => ({
    value: n,
    label: copy.terms.yearTemplate.replace("{n}", n),
  }));
  const termOptions = TERM_KINDS.map((kind) => ({ value: kind, label: copy.terms[kind] }));

  const backHref = localeHref(locale, "/services/study-plan/curriculum");
  const progress = formatStepOf(
    chrome.stepOf,
    STUDY_PLAN_STEPS.indexOf("where") + 1,
    STUDY_PLAN_STEPS.length
  );

  return (
    <>
      <PageHeader title={copy.where.title} lede={copy.where.hint} />
      <div className="wrap max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <StepNav backHref={backHref} backLabel={chrome.back} progressText={progress} />
          <WhereStepForm
            action={submitWhereStep.bind(null, locale)}
            yearLabel={copy.where.yearLabel}
            yearOptions={yearOptions}
            termLabel={copy.where.termLabel}
            termOptions={termOptions}
            requiredLabel={dict.actions.required}
            defaultYear={draft.positionYear}
            defaultKind={draft.positionKind}
            errorSummaryTitle={copy.errorSummaryTitle}
            continueLabel={chrome.continueLabel}
            continuingLabel={chrome.continuing}
          />
        </div>
      </div>
    </>
  );
}
