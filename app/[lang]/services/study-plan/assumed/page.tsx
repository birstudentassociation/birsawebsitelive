import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CURRICULUM_VERSIONS, type TermKind, type TermRef } from "@/content/curriculum";
import { assumedHistory, termIndex } from "@/lib/study-plan/derive";
import { deserialisePlan, PLAN_FIELD, serialisePlan } from "@/lib/study-plan/plan";
import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import StepNav from "@/components/forms/StepNav";
import AssumedStepForm, { type AssumedCourseGroup } from "@/components/forms/AssumedStepForm";
import { buildWizardChromeLabels, formatStepOf } from "@/components/forms/wizardChromeCopy";
import { buildStudyPlanCopy } from "@/components/study-plan/studyPlanCopy";
import { getStudyPlanDraft, submitAssumedStep } from "../actions";
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
    title: copy.assumed.title,
    description: copy.assumed.hint,
    path: "/services/study-plan/assumed",
  });
}

/**
 * "Check what we have assumed": the plan built by `submitMinorStep` travels
 * here in the query string (not the draft cookie), since it is the thing
 * this journey is building, not a partial answer to a single question. Every
 * form on this page carries it forward again in a hidden field, exactly as
 * the finished plan will on the `/plan` screen.
 */
export default async function StudyPlanAssumedPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [PLAN_FIELD]?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const chrome = buildWizardChromeLabels(locale);
  const copy = buildStudyPlanCopy(locale);

  const { [PLAN_FIELD]: rawPlan } = await searchParams;
  const plan = rawPlan ? deserialisePlan(rawPlan) : null;
  if (!plan) {
    redirect(localeHref(locale, "/services/study-plan/minor"));
  }

  // readDraft is safe to call during render (read-only); the draft is only
  // ever written from a Server Action.
  const draft = await getStudyPlanDraft();
  if (!draft.positionYear || !draft.positionKind) {
    redirect(localeHref(locale, "/services/study-plan/where"));
  }
  const position: TermRef = { year: Number(draft.positionYear), kind: draft.positionKind as TermKind };

  const version = CURRICULUM_VERSIONS[plan.versionId];
  const history = assumedHistory(version, position);
  const courseTitles = new Map(version.courses.value.map((c) => [c.code, c.title]));
  const passedSet = new Set(plan.passed);

  const cutoff = termIndex(position);
  const groups: AssumedCourseGroup[] = [];
  for (const term of version.recommendedPlan.value) {
    if (termIndex(term.term) >= cutoff) continue;
    const courses: { code: string; title: string }[] = [];
    for (const entry of term.entries) {
      if (entry.kind !== "course" || !passedSet.has(entry.code)) continue;
      courses.push({ code: entry.code, title: courseTitles.get(entry.code) ?? "" });
    }
    if (courses.length === 0) continue;
    groups.push({
      termLabel: `${copy.terms.yearTemplate.replace("{n}", String(term.term.year))}, ${copy.terms[term.term.kind]}`,
      courses,
    });
  }

  // Defaults to 3 credits per free elective placeholder before the
  // student's position, so the field is never blank on arrival: most
  // students only need to correct it, not fill it in from nothing.
  const freeElectiveDefault =
    history.placeholders.filter((slot) => slot.category === "freeElective").length * 3;

  const backHref = localeHref(locale, "/services/study-plan/minor");
  const progress = formatStepOf(
    chrome.stepOf,
    STUDY_PLAN_STEPS.indexOf("assumed") + 1,
    STUDY_PLAN_STEPS.length
  );

  return (
    <>
      <PageHeader title={copy.assumed.title} lede={copy.assumed.hint} />
      <div className="wrap max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <StepNav backHref={backHref} backLabel={chrome.back} progressText={progress} />
          <AssumedStepForm
            action={submitAssumedStep.bind(null, locale)}
            plan={serialisePlan(plan)}
            groups={groups}
            freeElectiveLabel={copy.assumed.freeElectiveLabel}
            freeElectiveHint={copy.assumed.freeElectiveHint}
            freeElectiveDefault={freeElectiveDefault}
            errorSummaryTitle={copy.errorSummaryTitle}
            continueLabel={chrome.continueLabel}
            continuingLabel={chrome.continuing}
          />
        </div>
      </div>
    </>
  );
}
