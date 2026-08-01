/**
 * The plan itself, and the one format it is written in.
 *
 * The same string is posted in a hidden field on every step (so the service
 * works with JavaScript off) and mirrored to localStorage by
 * `components/study-plan/PlanStore.tsx` (so it survives closing the tab).
 * One format and one parser, because two would drift.
 *
 * Nothing here is trusted. The string comes back from the browser on every
 * request, so `deserialisePlan` re-validates it with zod and returns null on
 * anything unexpected rather than throwing: a tampered or stale plan means
 * the student starts again, never an error boundary.
 */
import { z } from "zod";
import type { CurriculumVersionId, MinorId, TermRef } from "@/content/curriculum";

export type PlannedCourseTerm = { term: TermRef; codes: string[] };

export type StudyPlan = {
  versionId: CurriculumVersionId;
  cohort: string;
  /** Buddhist Era year of entry, derived from the cohort code, e.g. 2566. */
  startYear: number;
  /**
   * Which of the three minors the student is taking. Required, because it is
   * what decides whether a minor course counts as required, as an elective
   * within the minor, or as one of the 6 credits from another minor.
   */
  minorId: MinorId;
  /** Course codes the student has already passed. */
  passed: string[];
  /** Future terms the student has planned. */
  terms: PlannedCourseTerm[];
};

/** Course codes are two to four letters then three digits, e.g. PI574, LAS101. */
const courseCode = z.string().regex(/^[A-Z]{2,4}\d{3}$/);

const termRef = z.object({
  // Up to 8 so a plan can represent breaking the seven-year limit and be
  // told about it, rather than being unrepresentable.
  year: z.number().int().min(1).max(8),
  kind: z.enum(["semester1", "semester2", "summer"]),
});

const studyPlanSchema = z.object({
  versionId: z.enum(["2564", "2564-rev2566", "2568"]),
  cohort: z.string().regex(/^\d{2}$/),
  startYear: z.number().int().min(2560).max(2599),
  minorId: z.enum(["governance", "publicAdministration", "globalPoliticalEconomy"]),
  passed: z.array(courseCode).max(120),
  terms: z
    .array(z.object({ term: termRef, codes: z.array(courseCode).max(15) }))
    .max(20),
});

/** Name of the hidden input that carries the plan across every form post. */
export const PLAN_FIELD = "plan";

export function serialisePlan(plan: StudyPlan): string {
  return Buffer.from(JSON.stringify(plan), "utf8").toString("base64url");
}

export function deserialisePlan(raw: string): StudyPlan | null {
  if (!raw) return null;
  try {
    const json: unknown = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    const result = studyPlanSchema.safeParse(json);
    return result.success ? (result.data as StudyPlan) : null;
  } catch {
    return null;
  }
}

/** Cohort "66" means entry in B.E. 2566. */
export function startYearFromCohort(cohort: string): number {
  return 2500 + Number(cohort);
}
