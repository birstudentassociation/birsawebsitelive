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

/**
 * One planned term. `freeElectiveCredits` carries free electives, which can be
 * any Thammasat course and therefore never appear in the BIR catalogue. They
 * are tracked as a credit count rather than as course codes, because the
 * service cannot verify a course it does not hold data for. Without this the
 * term credit total under-counts and the plan can never reach the graduation
 * total.
 */
export type PlannedCourseTerm = {
  term: TermRef;
  codes: string[];
  freeElectiveCredits: number;
};

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
  /**
   * Free elective credits already earned. Counted, not named: a free elective
   * may be any Thammasat course, so there is no catalogue entry to match.
   */
  freeElectiveCreditsPassed: number;
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
  freeElectiveCreditsPassed: z.number().int().min(0).max(60),
  terms: z
    .array(
      z.object({
        term: termRef,
        codes: z.array(courseCode).max(15),
        freeElectiveCredits: z.number().int().min(0).max(21),
      })
    )
    .max(20),
});

/** Name of the hidden input that carries the plan across every form post. */
export const PLAN_FIELD = "plan";

/**
 * base64url without Node's Buffer, because this module is imported from both
 * server actions and client components. Next.js does not polyfill Buffer in
 * client bundles, so using it here would throw a ReferenceError in the browser
 * the first time a "use client" file imported anything from this file.
 */
// Exported for tests only: every field StudyPlan can actually hold is
// constrained to ASCII by studyPlanSchema (course codes, enum ids, digit-only
// cohort strings), so no plan value can exercise the multi-byte path below.
// The only way to prove the TextEncoder/TextDecoder round trip is UTF-8 safe
// (the reason it replaced Node's Buffer, see the module comment) is to drive
// these two functions directly with non-ASCII text.
export function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function fromBase64Url(encoded: string): string {
  const binary = atob(encoded.replace(/-/g, "+").replace(/_/g, "/"));
  return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
}

export function serialisePlan(plan: StudyPlan): string {
  return toBase64Url(JSON.stringify(plan));
}

export function deserialisePlan(raw: string): StudyPlan | null {
  if (!raw) return null;
  try {
    const json: unknown = JSON.parse(fromBase64Url(raw));
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
