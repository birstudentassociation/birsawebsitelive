"use client";

/**
 * The plan saved on this device, for client islands that offer something
 * because it exists: "Continue your plan", the course page's "Your plan" panel
 * and the catalogue's "with my plan" filters.
 *
 * Reads through `readStoredPlan`, which wraps the storage access in try/catch,
 * so private browsing or blocked storage simply means no plan. Server renders
 * and the first client render both see no plan (the server snapshot), so the
 * markup the server sends never depends on storage and nothing can mismatch
 * on hydration. The stored string is untrusted: it is only used if it passes
 * `deserialisePlan`'s validation, and the string handed back for building
 * links is re-serialised from the validated plan rather than passed through.
 */
import { useMemo, useSyncExternalStore } from "react";
import { readStoredPlan } from "@/components/study-plan/PlanStore";
import { deserialisePlan, serialisePlan, type StudyPlan } from "@/lib/study-plan/plan";

export type StoredPlan = { plan: StudyPlan; serialised: string };

function subscribe(onChange: () => void): () => void {
  // Another tab saving or deleting the plan should update this one.
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function getServerSnapshot(): string | null {
  return null;
}

/** The valid stored plan, or null when there is none, it is invalid, or storage is unavailable. */
export function useStoredPlan(): StoredPlan | null {
  const raw = useSyncExternalStore(subscribe, readStoredPlan, getServerSnapshot);
  return useMemo(() => {
    if (!raw) return null;
    const plan = deserialisePlan(raw);
    return plan ? { plan, serialised: serialisePlan(plan) } : null;
  }, [raw]);
}
