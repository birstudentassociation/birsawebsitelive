/**
 * The plan itself, and the one format it is written in.
 *
 * The same string is posted in a hidden field on every step (so the service
 * works with JavaScript off) and mirrored to localStorage by
 * `components/study-plan/PlanStore.tsx` (so it survives closing the tab).
 * One format and one parser, because two would drift.
 *
 * What localStorage holds is a little more than that string. Several named
 * plans ("scenarios") can sit under the one `birsa-study-plan` key, in a
 * versioned envelope (`PlanEnvelope`, version 2). The envelope is only ever a
 * storage shape: the URL and the hidden field still carry exactly one plan, in
 * the format above, so nothing on the server changed. A version 1 value (the
 * bare serialised plan every earlier visit wrote) is migrated transparently by
 * `parseStoredPlans`, and `deserialisePlan` reads either, returning the active
 * plan, so a reader that only wants "the student's plan" needs no changes.
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

export const MAX_TERMS = 24;
export const MAX_CODES_PER_TERM = 15;
export const MAX_PASSED_COURSES = 120;

const termRef = z.object({
  // Up to 8 so a plan can represent breaking the seven-year limit and be
  // told about it, rather than being unrepresentable.
  year: z.number().int().min(1).max(8),
  kind: z.enum(["semester1", "semester2", "summer"]),
});

export const studyPlanSchema = z.object({
  versionId: z.enum(["2564", "2564-rev2566", "2568"]),
  cohort: z.string().regex(/^\d{2}$/),
  startYear: z.number().int().min(2560).max(2599),
  minorId: z.enum(["governance", "publicAdministration", "globalPoliticalEconomy"]),
  passed: z.array(courseCode).max(MAX_PASSED_COURSES),
  freeElectiveCreditsPassed: z.number().int().min(0).max(60),
  terms: z
    .array(
      z.object({
        term: termRef,
        codes: z.array(courseCode).max(MAX_CODES_PER_TERM),
        freeElectiveCredits: z.number().int().min(0).max(21),
      })
    )
    .max(MAX_TERMS),
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

/**
 * Parses one serialised plan, or a stored envelope (returning its active plan).
 * An envelope is JSON and so starts with "{", which base64url never does, so
 * the two cannot be confused.
 */
export function deserialisePlan(raw: string): StudyPlan | null {
  if (!raw) return null;
  if (raw.startsWith("{")) {
    const envelope = parseStoredPlans(raw);
    return envelope ? activePlan(envelope) : null;
  }
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

/** Most scenarios one device keeps. Six is plenty to compare and keeps the stored value small. */
export const MAX_SCENARIOS = 6;
export const MAX_SCENARIO_NAME_LENGTH = 40;

/** What a migrated version 1 plan is called until the student renames it. */
export const DEFAULT_SCENARIO_NAME = "Main";

/**
 * Ids are short and generated by the app (`nextScenarioId` in scenarios.ts),
 * never typed, so they can be held to a tight pattern.
 */
const scenarioId = z.string().regex(/^[a-z0-9]{1,12}$/);

export type PlanScenario = { id: string; name: string; plan: StudyPlan };

/**
 * The most course codes whose review prompt can be remembered as dismissed.
 * Far more than a degree has courses, so it is only a bound on a tampered
 * value; `dismissReviewPrompt` drops the oldest past it.
 */
export const MAX_DISMISSED_REVIEW_PROMPTS = 200;

/**
 * The value kept under `birsa-study-plan` from version 2 on.
 *
 * `dismissedReviewPrompts` holds the course codes whose "help next year's
 * students" prompt the student has dismissed (see
 * `lib/study-plan/reviewPrompt.ts`). It was added after version 2 first
 * shipped, without a version bump: the schema defaults it to an empty list, so
 * every envelope written before it existed still parses, and one written with
 * it is read by an older build as an envelope with an extra field it ignores.
 */
export type PlanEnvelope = {
  v: 2;
  active: string;
  plans: PlanScenario[];
  dismissedReviewPrompts: string[];
};

const envelopeSchema = z
  .object({
    v: z.literal(2),
    active: scenarioId,
    plans: z
      .array(
        z.object({
          id: scenarioId,
          name: z.string().trim().min(1).max(MAX_SCENARIO_NAME_LENGTH),
          plan: studyPlanSchema,
        })
      )
      .min(1)
      .max(MAX_SCENARIOS),
    dismissedReviewPrompts: z.array(courseCode).max(MAX_DISMISSED_REVIEW_PROMPTS).default([]),
  })
  .refine((envelope) => new Set(envelope.plans.map((p) => p.id)).size === envelope.plans.length)
  .refine((envelope) => envelope.plans.some((p) => p.id === envelope.active));

/** The envelope's active plan. The schema guarantees the active id is one of the plans. */
export function activePlan(envelope: PlanEnvelope): StudyPlan {
  return (envelope.plans.find((p) => p.id === envelope.active) ?? envelope.plans[0]!).plan;
}

/** A one-plan envelope, which is what a version 1 value becomes. */
export function envelopeOf(plan: StudyPlan, name = DEFAULT_SCENARIO_NAME): PlanEnvelope {
  return { v: 2, active: "s1", plans: [{ id: "s1", name, plan }], dismissedReviewPrompts: [] };
}

export function serialiseEnvelope(envelope: PlanEnvelope): string {
  return JSON.stringify(envelope);
}

/**
 * Reads whatever `birsa-study-plan` holds: a version 2 envelope, or a version 1
 * bare serialised plan, which is migrated into a one-scenario envelope. Like
 * `deserialisePlan` it trusts nothing and returns null rather than throwing,
 * so a tampered or half-written value means the student starts again.
 */
export function parseStoredPlans(
  raw: string | null | undefined,
  defaultName = DEFAULT_SCENARIO_NAME
): PlanEnvelope | null {
  if (!raw) return null;
  if (raw.startsWith("{")) {
    try {
      const result = envelopeSchema.safeParse(JSON.parse(raw));
      return result.success ? (result.data as PlanEnvelope) : null;
    } catch {
      return null;
    }
  }
  const plan = deserialisePlan(raw);
  return plan ? envelopeOf(plan, defaultName) : null;
}
