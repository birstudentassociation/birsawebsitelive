/**
 * Managing the named plans in the stored envelope: add, rename, delete, switch
 * and replace the active plan, and remembering which review prompts the student
 * has dismissed.
 *
 * Pure functions that return a new envelope, or null for a change they refuse,
 * so a caller can say why or simply do nothing; none of them touches storage
 * (`components/study-plan/PlanStore.tsx` and `ScenarioManager.tsx` do that, in
 * try/catch). Kept apart from `scenarios.ts`, which needs the whole curriculum
 * and the findings engine, because the plan screen's storage mirror runs in the
 * browser for every visitor and should not carry them. The envelope's shape and
 * parser are in `plan.ts`.
 */
import {
  MAX_DISMISSED_REVIEW_PROMPTS,
  MAX_SCENARIOS,
  MAX_SCENARIO_NAME_LENGTH,
  type PlanEnvelope,
  type StudyPlan,
} from "@/lib/study-plan/plan";

/** The query parameter the plan screen's comparison reads the other scenario's plan from. */
export const COMPARE_FIELD = "compare";
/** The query parameter carrying the other scenario's name, for the comparison's column heading. */
export const COMPARE_NAME_FIELD = "compareName";

/** The query parameters of the two built-in previews: the minor to try, and the term to leave empty. */
export const MINOR_FIELD = "minor";
export const AWAY_FIELD = "away";
export const AWAY_KIND_FIELD = "awayKind";

/** The next unused id: "s1", "s2", and so on, one past the highest in use. */
export function nextScenarioId(envelope: PlanEnvelope): string {
  const used = envelope.plans.map((p) => Number(/^s(\d+)$/.exec(p.id)?.[1] ?? 0));
  return `s${Math.max(0, ...used) + 1}`;
}

/** A name as stored: surrounding space trimmed, runs of space collapsed. Null when nothing is left. */
export function cleanScenarioName(raw: string): string | null {
  const name = raw.replace(/\s+/g, " ").trim().slice(0, MAX_SCENARIO_NAME_LENGTH).trim();
  return name === "" ? null : name;
}

/** `base`, or `base 2`, `base 3` and so on when a scenario already has that name. */
export function uniqueScenarioName(envelope: PlanEnvelope, base: string): string {
  const taken = new Set(envelope.plans.map((p) => p.name.toLowerCase()));
  const root = cleanScenarioName(base) ?? "Scenario";
  if (!taken.has(root.toLowerCase())) return root;
  for (let n = 2; ; n += 1) {
    const suffix = ` ${n}`;
    const candidate = `${root.slice(0, MAX_SCENARIO_NAME_LENGTH - suffix.length)}${suffix}`;
    if (!taken.has(candidate.toLowerCase())) return candidate;
  }
}

/** Adds a scenario and makes it the active one. Null at the limit or for an empty name. */
export function addScenario(
  envelope: PlanEnvelope,
  name: string,
  plan: StudyPlan
): PlanEnvelope | null {
  const clean = cleanScenarioName(name);
  if (!clean || envelope.plans.length >= MAX_SCENARIOS) return null;
  const id = nextScenarioId(envelope);
  return { ...envelope, active: id, plans: [...envelope.plans, { id, name: clean, plan }] };
}

export function renameScenario(
  envelope: PlanEnvelope,
  id: string,
  name: string
): PlanEnvelope | null {
  const clean = cleanScenarioName(name);
  if (!clean || !envelope.plans.some((p) => p.id === id)) return null;
  return {
    ...envelope,
    plans: envelope.plans.map((p) => (p.id === id ? { ...p, name: clean } : p)),
  };
}

/** Deletes a scenario. The last one cannot go (deleting the plan is a separate control), and an active one hands over to the first that remains. */
export function deleteScenario(envelope: PlanEnvelope, id: string): PlanEnvelope | null {
  if (envelope.plans.length <= 1 || !envelope.plans.some((p) => p.id === id)) return null;
  const plans = envelope.plans.filter((p) => p.id !== id);
  return { ...envelope, active: envelope.active === id ? plans[0]!.id : envelope.active, plans };
}

export function switchScenario(envelope: PlanEnvelope, id: string): PlanEnvelope | null {
  return envelope.plans.some((p) => p.id === id) ? { ...envelope, active: id } : null;
}

/** Replaces the active scenario's plan, which is what editing on the plan screen does. */
export function setActivePlan(envelope: PlanEnvelope, plan: StudyPlan): PlanEnvelope {
  return {
    ...envelope,
    plans: envelope.plans.map((p) => (p.id === envelope.active ? { ...p, plan } : p)),
  };
}

/** True when the student has dismissed the review prompt for this course. */
export function isReviewPromptDismissed(envelope: PlanEnvelope, code: string): boolean {
  return envelope.dismissedReviewPrompts.includes(code);
}

/**
 * Remembers that the student dismissed the review prompt for a course. Saying
 * it twice changes nothing. Past `MAX_DISMISSED_REVIEW_PROMPTS` the oldest is
 * forgotten, which at worst shows one old prompt again.
 */
export function dismissReviewPrompt(envelope: PlanEnvelope, code: string): PlanEnvelope {
  if (isReviewPromptDismissed(envelope, code)) return envelope;
  const dismissed = [...envelope.dismissedReviewPrompts, code];
  return {
    ...envelope,
    dismissedReviewPrompts: dismissed.slice(-MAX_DISMISSED_REVIEW_PROMPTS),
  };
}
