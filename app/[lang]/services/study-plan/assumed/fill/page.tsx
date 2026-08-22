import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  CURRICULUM_VERSIONS,
  resolveMinorCategory,
  type CategoryId,
  type Course,
  type CurriculumVersion,
  type MinorId,
  type TermKind,
  type TermRef,
} from "@/content/curriculum";
import { assumedHistory } from "@/lib/study-plan/derive";
import { deserialisePlan, PLAN_FIELD, serialisePlan } from "@/lib/study-plan/plan";
import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import StepNav from "@/components/forms/StepNav";
import FillStepForm, { type FillSlot } from "@/components/forms/FillStepForm";
import { buildWizardChromeLabels, formatStepOf } from "@/components/forms/wizardChromeCopy";
import { buildStudyPlanCopy } from "@/components/study-plan/studyPlanCopy";
import { getStudyPlanDraft, submitFillStep } from "../../actions";
import { STUDY_PLAN_STEPS } from "../../steps";

/**
 * Which courses fit a given placeholder slot. Minor categories
 * (`minorRequired` / `minorElective` / `minorElectiveOther`) are not a fixed
 * property of a course: every minor course is pooled under the catalogue
 * category `"minor"`, and only pairing it with the student's chosen minor
 * (`resolveMinorCategory`) decides which of the three buckets it fills.
 * Every other category matches straight off the course's own category.
 *
 * `choices`, when present, overrides all of that: the slot is an either/or
 * between specific named courses (e.g. "Choose AH208 ..., or EL295 ..."), not
 * an open pick from the whole category, and `category` alone would also
 * offer every other course sharing that category (genEdPart2 also holds
 * PI121/PI122, which this slot never named). The result keeps `choices`'s own
 * order, since that is the order the label lists them in, and silently skips
 * a code with no catalogue entry rather than rendering a blank option.
 */
function coursesForCategory(
  version: CurriculumVersion,
  minorId: MinorId,
  category: CategoryId,
  choices?: string[]
): Course[] {
  if (choices) {
    const byCode = new Map(version.courses.value.map((course) => [course.code, course]));
    return choices.flatMap((code) => {
      const course = byCode.get(code);
      return course ? [course] : [];
    });
  }
  const isMinorBucket =
    category === "minorRequired" ||
    category === "minorElective" ||
    category === "minorElectiveOther";
  if (isMinorBucket) {
    return version.courses.value.filter(
      (course) =>
        course.category === "minor" &&
        resolveMinorCategory(version, minorId, course.code) === category
    );
  }
  return version.courses.value.filter((course) => course.category === category);
}

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
    title: copy.fill.title,
    description: copy.fill.hint,
    path: "/services/study-plan/assumed/fill",
  });
}

/**
 * Roughly a third of the published plan is placeholders rather than named
 * courses ("Minor Required Course 1"), because a student, not the plan,
 * decides which real course fills a slot. Free elective placeholders are
 * excluded here: they are handled by the credit count on the previous
 * screen, since a free elective may be any Thammasat University course and
 * has no catalogue entry to select.
 */
export default async function StudyPlanFillPage({
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
  const position: TermRef = {
    year: Number(draft.positionYear),
    kind: draft.positionKind as TermKind,
  };

  const version = CURRICULUM_VERSIONS[plan.versionId];
  const { placeholders } = assumedHistory(version, position);
  const slots = placeholders.filter((slot) => slot.category !== "freeElective");

  // Nothing to ask: skip straight to the plan rather than showing an empty
  // form, which would just be an extra click with nothing on the page.
  if (slots.length === 0) {
    redirect(
      `${localeHref(locale, "/services/study-plan/plan")}?${PLAN_FIELD}=${encodeURIComponent(serialisePlan(plan))}`
    );
  }

  const fillSlots: FillSlot[] = slots.map((slot) => ({
    id: slot.id,
    label: slot.label[locale],
    options: coursesForCategory(version, plan.minorId, slot.category, slot.choices).map(
      (course) => ({
        value: course.code,
        label: `${course.code} ${course.title}`,
      })
    ),
  }));

  const backHref = `${localeHref(locale, "/services/study-plan/assumed")}?${PLAN_FIELD}=${encodeURIComponent(serialisePlan(plan))}`;
  const progress = formatStepOf(
    chrome.stepOf,
    STUDY_PLAN_STEPS.indexOf("assumed") + 1,
    STUDY_PLAN_STEPS.length
  );

  return (
    <>
      <PageHeader title={copy.fill.title} lede={copy.fill.hint} />
      <div className="wrap max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <StepNav backHref={backHref} backLabel={chrome.back} progressText={progress} />
          <FillStepForm
            action={submitFillStep.bind(null, locale)}
            plan={serialisePlan(plan)}
            slots={fillSlots}
            errorSummaryTitle={copy.errorSummaryTitle}
            continueLabel={chrome.continueLabel}
            continuingLabel={chrome.continuing}
            notTakenLabel={copy.fill.notTakenLabel}
            courseSearch={copy.courseSearch}
          />
        </div>
      </div>
    </>
  );
}
