import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { resolveCohort } from "@/content/curriculum";
import PageHeader from "@/components/PageHeader";
import StepNav from "@/components/forms/StepNav";
import MinorStepForm from "@/components/forms/MinorStepForm";
import { buildWizardChromeLabels, formatStepOf } from "@/components/forms/wizardChromeCopy";
import { buildStudyPlanCopy } from "@/components/study-plan/studyPlanCopy";
import { getStudyPlanDraft, submitMinorStep } from "../actions";
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
    title: copy.minor.title,
    description: copy.minor.hint,
    path: "/services/study-plan/minor",
  });
}

/**
 * "Which minor are you taking?": not optional, and with no "not sure"
 * answer. Every minor course is pooled under the catalogue category
 * `"minor"`; pairing it with a chosen minor is the only thing that tells the
 * service whether it is one of the 9 required credits, one of the 6
 * electives within the minor, or one of the 6 from another minor. Skip this
 * and 21 of the student's 127 credits get silently miscounted.
 */
export default async function StudyPlanMinorPage({
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
  // ever written from a Server Action, in submitWhereStep / submitMinorStep.
  const draft = await getStudyPlanDraft();
  if (!draft.cohort) {
    redirect(localeHref(locale, "/services/study-plan/cohort"));
  }
  if (!draft.positionYear || !draft.positionKind) {
    redirect(localeHref(locale, "/services/study-plan/where"));
  }

  const resolution = resolveCohort(draft.cohort);
  if (resolution.status === "unsupported") {
    redirect(localeHref(locale, "/services/study-plan/cannot-help?reason=cohort"));
  }
  const { version } = resolution;
  const courseTitles = new Map(version.courses.value.map((c) => [c.code, c.title]));

  const backHref = localeHref(locale, "/services/study-plan/where");
  const progress = formatStepOf(
    chrome.stepOf,
    STUDY_PLAN_STEPS.indexOf("minor") + 1,
    STUDY_PLAN_STEPS.length
  );

  return (
    <>
      <PageHeader title={copy.minor.title} lede={copy.minor.hint} />
      <div className="wrap max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <StepNav backHref={backHref} backLabel={chrome.back} progressText={progress} />
          <MinorStepForm
            locale={locale}
            minors={version.minors}
            courseTitles={courseTitles}
            defaultValue={draft.minorId}
            action={submitMinorStep.bind(null, locale)}
            legend={copy.minor.legend}
            requiredCoursesLabel={copy.minor.requiredCoursesLabel}
            requiredLabel={dict.actions.required}
            errorSummaryTitle={copy.errorSummaryTitle}
            continueLabel={chrome.continueLabel}
            continuingLabel={chrome.continuing}
          />
        </div>
      </div>
    </>
  );
}
