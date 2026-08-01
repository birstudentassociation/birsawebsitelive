"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { CURRICULUM_VERSIONS, resolveCohort, type TermKind, type TermRef } from "@/content/curriculum";
import { assumedHistory } from "@/lib/study-plan/derive";
import {
  deserialisePlan,
  PLAN_FIELD,
  serialisePlan,
  startYearFromCohort,
  type StudyPlan,
} from "@/lib/study-plan/plan";
import { localeHref, type Locale } from "@/lib/i18n";
import { mergeDraft, readDraft } from "@/components/forms/draftCookie";
import { buildStudyPlanCopy } from "@/components/study-plan/studyPlanCopy";
import type { QuestionStepState } from "@/components/forms/QuestionStepForm";
import { STUDY_PLAN_COOKIE, type StudyPlanDraft } from "./steps";

/** First two digits of a student ID, e.g. "66". */
const cohortSchema = z.string().regex(/^\d{2}$/);

/** Matches `TermRef.year`: up to 8, not 4, so extended study is representable. */
const yearSchema = z.string().regex(/^[1-8]$/);
const kindSchema = z.enum(["semester1", "semester2", "summer"]);

const freeElectiveCreditsSchema = z
  .string()
  .regex(/^\d+$/)
  .transform(Number)
  .pipe(z.number().int().min(0).max(60));

/** Builds a `TermRef` from the draft's saved position, or null if either half is missing. */
function draftPosition(draft: StudyPlanDraft): TermRef | null {
  if (!draft.positionYear || !draft.positionKind) return null;
  return { year: Number(draft.positionYear), kind: draft.positionKind as TermKind };
}

export async function getStudyPlanDraft(): Promise<StudyPlanDraft> {
  return readDraft<StudyPlanDraft>(STUDY_PLAN_COOKIE);
}

export async function submitCohortStep(
  locale: Locale,
  _prev: QuestionStepState,
  formData: FormData
): Promise<QuestionStepState> {
  const copy = buildStudyPlanCopy(locale);
  const value = String(formData.get("cohort") ?? "").trim();

  if (!value) {
    return { status: "invalid", error: copy.cohort.errorRequired };
  }
  const result = cohortSchema.safeParse(value);
  if (!result.success) {
    return { status: "invalid", error: copy.cohort.errorFormat };
  }

  await mergeDraft<StudyPlanDraft>(STUDY_PLAN_COOKIE, { cohort: result.data });

  // resolveCohort is the single place that decides which curriculum governs
  // a student; an unsupported code is routed to the stop page rather than
  // guessed at anywhere downstream.
  const resolution = resolveCohort(result.data);
  if (resolution.status === "unsupported") {
    redirect(localeHref(locale, "/services/study-plan/cannot-help?reason=cohort"));
  }
  redirect(localeHref(locale, "/services/study-plan/curriculum"));
}

export async function submitCurriculumStep(
  locale: Locale,
  _prev: QuestionStepState,
  formData: FormData
): Promise<QuestionStepState> {
  const copy = buildStudyPlanCopy(locale);
  const value = String(formData.get("confirmed") ?? "");

  if (value !== "yes" && value !== "no") {
    return { status: "invalid", error: copy.curriculum.errorRequired };
  }

  await mergeDraft<StudyPlanDraft>(STUDY_PLAN_COOKIE, { confirmed: value });

  // "No, or I am not sure" is a legitimate, expected answer, not a validation
  // failure: a plan built on the wrong curriculum is worse than no plan, so
  // this goes to the stop page rather than being nudged back to try again.
  if (value === "no") {
    redirect(localeHref(locale, "/services/study-plan/cannot-help?reason=not-sure"));
  }
  redirect(localeHref(locale, "/services/study-plan/where"));
}

export async function submitWhereStep(
  locale: Locale,
  _prev: QuestionStepState,
  formData: FormData
): Promise<QuestionStepState> {
  const copy = buildStudyPlanCopy(locale);
  const year = String(formData.get("year") ?? "");
  const kind = String(formData.get("kind") ?? "");

  const yearResult = yearSchema.safeParse(year);
  const kindResult = kindSchema.safeParse(kind);
  if (!yearResult.success || !kindResult.success) {
    return { status: "invalid", error: copy.where.errorRequired };
  }

  await mergeDraft<StudyPlanDraft>(STUDY_PLAN_COOKIE, {
    positionYear: yearResult.data,
    positionKind: kindResult.data,
  });

  // Not building the plan here: a plan cannot exist until the minor is
  // known, since a minor course's requirement bucket depends on it.
  redirect(localeHref(locale, "/services/study-plan/minor"));
}

export async function submitMinorStep(
  locale: Locale,
  _prev: QuestionStepState,
  formData: FormData
): Promise<QuestionStepState> {
  const copy = buildStudyPlanCopy(locale);
  const draft = await readDraft<StudyPlanDraft>(STUDY_PLAN_COOKIE);

  if (!draft.cohort) {
    redirect(localeHref(locale, "/services/study-plan/cohort"));
  }
  const resolution = resolveCohort(draft.cohort);
  if (resolution.status === "unsupported") {
    redirect(localeHref(locale, "/services/study-plan/cannot-help?reason=cohort"));
  }
  const { version } = resolution;

  const minorValue = String(formData.get("minor") ?? "");
  const chosen = version.minors.find((m) => m.id === minorValue);
  if (!chosen) {
    return { status: "invalid", error: copy.minor.errorRequired };
  }

  const position = draftPosition(draft);
  if (!position) {
    redirect(localeHref(locale, "/services/study-plan/where"));
  }

  await mergeDraft<StudyPlanDraft>(STUDY_PLAN_COOKIE, { minorId: chosen.id });

  // The whole reason this step exists: PI380 is a required course for a
  // Governance student and an elective-in-another-minor for a Global
  // Political Economy one, so the initial plan cannot be built until the
  // minor is known.
  const history = assumedHistory(version, position);
  const plan: StudyPlan = {
    versionId: version.id,
    cohort: draft.cohort,
    startYear: startYearFromCohort(draft.cohort),
    minorId: chosen.id,
    passed: history.courses,
    freeElectiveCreditsPassed: 0,
    terms: [],
  };

  redirect(
    `${localeHref(locale, "/services/study-plan/assumed")}?${PLAN_FIELD}=${encodeURIComponent(serialisePlan(plan))}`
  );
}

export async function submitAssumedStep(
  locale: Locale,
  _prev: QuestionStepState,
  formData: FormData
): Promise<QuestionStepState> {
  const copy = buildStudyPlanCopy(locale);
  const current = deserialisePlan(String(formData.get(PLAN_FIELD) ?? ""));
  if (!current) {
    // A missing or tampered plan cannot be corrected; the minor is the
    // earliest step that produces one, so that is where recovery starts.
    redirect(localeHref(locale, "/services/study-plan/minor"));
  }

  const freeElectiveResult = freeElectiveCreditsSchema.safeParse(
    String(formData.get("freeElectiveCreditsPassed") ?? "")
  );
  if (!freeElectiveResult.success) {
    return { status: "invalid", error: copy.assumed.freeElectiveError };
  }

  // Rebuilt from exactly the checkboxes that came back, not merged with
  // `current.passed`: an unchecked box means "I did not take this", and
  // that has to be able to remove a course, not just add one.
  const plan: StudyPlan = {
    ...current,
    passed: formData.getAll("passed").map(String),
    freeElectiveCreditsPassed: freeElectiveResult.data,
  };
  const encodedPlan = encodeURIComponent(serialisePlan(plan));

  const draft = await readDraft<StudyPlanDraft>(STUDY_PLAN_COOKIE);
  const position = draftPosition(draft);
  if (position) {
    const version = CURRICULUM_VERSIONS[plan.versionId];
    const { placeholders } = assumedHistory(version, position);
    // Free elective placeholders are already handled by the number input
    // above; only a *named-slot* placeholder needs the fill step.
    const hasSlotsToFill = placeholders.some((slot) => slot.category !== "freeElective");
    if (hasSlotsToFill) {
      redirect(`${localeHref(locale, "/services/study-plan/assumed/fill")}?${PLAN_FIELD}=${encodedPlan}`);
    }
  }

  redirect(`${localeHref(locale, "/services/study-plan/plan")}?${PLAN_FIELD}=${encodedPlan}`);
}

export async function submitFillStep(
  locale: Locale,
  _prev: QuestionStepState,
  formData: FormData
): Promise<QuestionStepState> {
  const current = deserialisePlan(String(formData.get(PLAN_FIELD) ?? ""));
  if (!current) {
    redirect(localeHref(locale, "/services/study-plan/minor"));
  }

  const passed = new Set(current.passed);
  const draft = await readDraft<StudyPlanDraft>(STUDY_PLAN_COOKIE);
  const position = draftPosition(draft);
  if (position) {
    const version = CURRICULUM_VERSIONS[current.versionId];
    const { placeholders } = assumedHistory(version, position);
    for (const slot of placeholders) {
      if (slot.category === "freeElective") continue;
      const value = String(formData.get(`slot-${slot.id}`) ?? "");
      // Empty value is "I have not taken this yet", a legitimate answer,
      // not a validation failure.
      if (value) passed.add(value);
    }
  }

  const plan: StudyPlan = { ...current, passed: [...passed] };
  redirect(
    `${localeHref(locale, "/services/study-plan/plan")}?${PLAN_FIELD}=${encodeURIComponent(serialisePlan(plan))}`
  );
}
