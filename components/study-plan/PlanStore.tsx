"use client";

/**
 * Mirrors the finished plan to localStorage so it survives closing the tab.
 *
 * Everything on the plan page already works without this: the plan travels
 * in a hidden field on every form post, so a visitor with JavaScript off
 * completes the whole journey and can print. This component only adds
 * persistence between visits, exactly like
 * `components/onboarding/StepTasksClient.tsx` does for the onboarding task
 * list. Storage access is wrapped in try/catch throughout: private browsing
 * or disabled storage must degrade to the no-JavaScript behaviour, never
 * break the page.
 *
 * What is stored is a versioned envelope of named plans (see `PlanEnvelope`
 * in lib/study-plan/plan.ts). The plan on screen is always saved as the active
 * scenario, replacing that scenario's plan, so a student who never opens the
 * scenario controls has one scenario and sees no difference. A value written
 * by an earlier visit (the bare serialised plan) is read as a one-scenario
 * envelope and rewritten in the new shape on the next save.
 *
 * The plan never reaches a BIRSA server. It is not in a cookie, which is
 * why it is here and not in `components/forms/draftCookie.ts`.
 */
import { useEffect } from "react";
import {
  DEFAULT_SCENARIO_NAME,
  PLAN_FIELD,
  deserialisePlan,
  envelopeOf,
  parseStoredPlans,
  serialiseEnvelope,
  type PlanEnvelope,
} from "@/lib/study-plan/plan";
import { setActivePlan } from "@/lib/study-plan/scenarioStore";

const KEY = "birsa-study-plan";

/** The raw stored value, whatever version wrote it. */
export function readStoredPlan(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/** The stored scenarios, with a version 1 plan migrated. Null when there is none or it is invalid. */
export function readStoredEnvelope(defaultName = DEFAULT_SCENARIO_NAME): PlanEnvelope | null {
  return parseStoredPlans(readStoredPlan(), defaultName);
}

/** Writes the scenarios. False when storage refused, so a caller can say so. */
export function writeStoredEnvelope(envelope: PlanEnvelope): boolean {
  try {
    window.localStorage.setItem(KEY, serialiseEnvelope(envelope));
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads the plan screen with a plan in the address, as every step of the
 * journey does. A full load, not a client navigation, so the server renders the
 * screen from the plan it is given and `PlanStore` then saves that plan as the
 * active scenario. The address is made absolute only because it is this site's
 * own page and `location.assign` should not be handed a relative one.
 */
export function openPlanScreen(planHref: string, serialisedPlan: string): void {
  const path = `${planHref}?${PLAN_FIELD}=${encodeURIComponent(serialisedPlan)}`;
  window.location.assign(new URL(path, window.location.origin).href);
}

export function clearStoredPlan(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Nothing to clear if storage was never available.
  }
}

/**
 * Renders nothing. It exists only for its effect, so it needs no `mounted`
 * hydration gate: there is no markup for the server and the client to
 * disagree about. `StepTasksClient` needs that gate because it renders
 * checkboxes; this does not.
 *
 * `defaultName` names the first scenario when nothing is stored yet, in the
 * page's language. A value that is not a valid plan is never written.
 */
export default function PlanStore({
  plan,
  defaultName = DEFAULT_SCENARIO_NAME,
}: {
  plan: string;
  defaultName?: string;
}) {
  useEffect(() => {
    const parsed = deserialisePlan(plan);
    if (!parsed) return;
    const stored = readStoredEnvelope(defaultName);
    const next = stored ? setActivePlan(stored, parsed) : envelopeOf(parsed, defaultName);
    writeStoredEnvelope(next);
  }, [plan, defaultName]);

  return null;
}
