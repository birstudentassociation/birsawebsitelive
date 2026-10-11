"use client";

/**
 * "Keep this as a scenario", under the minor switch and term away previews.
 *
 * The previews themselves are computed on the server from the plan in the
 * address, so they work with JavaScript off. Keeping one needs the device's
 * storage, so this is an enhancement: it renders nothing until the page has
 * hydrated and a saved plan exists to add to (the first client render matches
 * the server's, so there is no mismatch). It adds the previewed plan as a new
 * scenario, makes it the active one, and opens the plan screen on it, the same
 * way opening any scenario does.
 */
import { useState, useSyncExternalStore } from "react";
import Button from "@/components/Button";
import {
  openPlanScreen,
  readStoredEnvelope,
  writeStoredEnvelope,
} from "@/components/study-plan/PlanStore";
import type { TermInsightCopy } from "@/components/study-plan/termInsightCopy";
import { MAX_SCENARIOS, deserialisePlan } from "@/lib/study-plan/plan";
import { addScenario, uniqueScenarioName } from "@/lib/study-plan/scenarioStore";

export type SaveScenarioButtonProps = {
  /** The previewed plan, serialised. */
  plan: string;
  /** The name the new scenario starts with, already in the page's language. */
  name: string;
  label: string;
  copy: Pick<TermInsightCopy["scenarios"], "couldNotSave" | "limitTemplate" | "defaultName">;
  planHref: string;
};

const noop = () => () => {};

export default function SaveScenarioButton({
  plan,
  name,
  label,
  copy,
  planHref,
}: SaveScenarioButtonProps) {
  // False on the server and on the first client render, true after hydration.
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false
  );
  const [message, setMessage] = useState("");
  if (!mounted) return null;

  const keep = () => {
    const parsed = deserialisePlan(plan);
    const envelope = readStoredEnvelope(copy.defaultName);
    if (!parsed || !envelope) {
      setMessage(copy.couldNotSave);
      return;
    }
    if (envelope.plans.length >= MAX_SCENARIOS) {
      setMessage(copy.limitTemplate.replace("{n}", String(MAX_SCENARIOS)));
      return;
    }
    const next = addScenario(envelope, uniqueScenarioName(envelope, name), parsed);
    if (!next || !writeStoredEnvelope(next)) {
      setMessage(copy.couldNotSave);
      return;
    }
    openPlanScreen(planHref, plan);
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <Button type="button" variant="secondary" onClick={keep}>
          {label}
        </Button>
      </div>
      <p role="status" className="text-sm text-muted">
        {message}
      </p>
    </div>
  );
}
