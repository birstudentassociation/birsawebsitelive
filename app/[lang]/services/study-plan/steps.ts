// Lives outside actions.ts because a "use server" file may only export
// async functions: this constant (and the types derived from it) are plain
// runtime and type data, not server actions, so they cannot live there.

/**
 * Step order after the start page. Unlike `clubs/start`, the first question
 * ("cohort") does not live at the journey root: this journey has a real
 * start page (`page.tsx`) explaining what the service needs and why, so the
 * root is spent on that instead of on the first question.
 */
export const STUDY_PLAN_STEPS = ["cohort", "curriculum", "where", "minor", "assumed", "plan"] as const;
export type StudyPlanStep = (typeof STUDY_PLAN_STEPS)[number];

export const STUDY_PLAN_COOKIE = "birsa_study_plan_draft";

/**
 * Partial answers carried across this journey's steps in the draft cookie.
 * `positionYear` / `positionKind` / `minorId` are read and written starting
 * with the steps built in later tasks; they are declared here now so the
 * draft's shape is settled once, not grown piecemeal per task.
 */
export type StudyPlanDraft = {
  cohort?: string;
  confirmed?: "yes" | "no";
  positionYear?: string;
  positionKind?: string;
  minorId?: string;
};
