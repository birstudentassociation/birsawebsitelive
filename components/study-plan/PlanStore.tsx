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
 * The plan never reaches a BIRSA server. It is not in a cookie, which is
 * why it is here and not in `components/forms/draftCookie.ts`.
 */
import { useEffect } from "react";

const KEY = "birsa-study-plan";

export function readStoredPlan(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
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
 */
export default function PlanStore({ plan }: { plan: string }) {
  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, plan);
    } catch {
      // The plan just will not persist for this visit.
    }
  }, [plan]);

  return null;
}
