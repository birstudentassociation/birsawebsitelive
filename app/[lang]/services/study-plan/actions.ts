"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { resolveCohort } from "@/content/curriculum";
import { localeHref, type Locale } from "@/lib/i18n";
import { mergeDraft, readDraft } from "@/components/forms/draftCookie";
import { buildStudyPlanCopy } from "@/components/study-plan/studyPlanCopy";
import type { QuestionStepState } from "@/components/forms/QuestionStepForm";
import { STUDY_PLAN_COOKIE, type StudyPlanDraft } from "./steps";

/** First two digits of a student ID, e.g. "66". */
const cohortSchema = z.string().regex(/^\d{2}$/);

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
