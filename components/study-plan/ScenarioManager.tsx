"use client";

/**
 * The scenario switcher on the plan screen: the plans saved on this device,
 * with create-from-current, open, rename, delete and a link to compare any of
 * them with the current one.
 *
 * This is a JavaScript enhancement and says so on the page
 * (`copy.needsScript`): scenarios live in localStorage, which only a script
 * can read, and the server never sees any plan but the one in the address. The
 * plan on the page, the previews and the comparison all work without it,
 * because each is computed on the server from plans carried in the URL. With
 * JavaScript off this renders nothing, and so does the first client render, so
 * the markup never depends on storage.
 *
 * Opening a scenario makes it the active one in storage and then loads the
 * plan screen with that scenario's plan in the address, the same way every
 * other step carries a plan, so nothing else on the server changed. Storage
 * access is in try/catch via `PlanStore`'s helpers: if it is blocked, the
 * controls say so rather than pretending to have saved.
 */
import { useMemo, useState, useSyncExternalStore } from "react";
import Button from "@/components/Button";
import Field from "@/components/Field";
import {
  openPlanScreen,
  readStoredPlan,
  writeStoredEnvelope,
} from "@/components/study-plan/PlanStore";
import type { TermInsightCopy } from "@/components/study-plan/termInsightCopy";
import {
  MAX_SCENARIOS,
  PLAN_FIELD,
  deserialisePlan,
  parseStoredPlans,
  serialisePlan,
  type PlanEnvelope,
} from "@/lib/study-plan/plan";
import {
  COMPARE_FIELD,
  COMPARE_NAME_FIELD,
  addScenario,
  deleteScenario,
  renameScenario,
  switchScenario,
  uniqueScenarioName,
} from "@/lib/study-plan/scenarioStore";

export type ScenarioManagerProps = {
  copy: TermInsightCopy["scenarios"];
  /** The plan on screen, serialised: the current scenario's plan. */
  currentPlan: string;
  /** The localised plan screen path, e.g. "/en/services/study-plan/plan". */
  planHref: string;
};

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function getServerSnapshot(): string | null {
  return null;
}

export default function ScenarioManager({ copy, currentPlan, planHref }: ScenarioManagerProps) {
  const raw = useSyncExternalStore(subscribe, readStoredPlan, getServerSnapshot);
  const envelope = useMemo(() => parseStoredPlans(raw, copy.defaultName), [raw, copy.defaultName]);
  const [status, setStatus] = useState("");
  const [renaming, setRenaming] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  if (!envelope) return null;

  /** Stores the change, tells this tab's readers, and says what happened. */
  const commit = (next: PlanEnvelope | null): boolean => {
    if (!next) return false;
    if (!writeStoredEnvelope(next)) {
      setStatus(copy.couldNotSave);
      return false;
    }
    // The `storage` event only fires in other tabs, so this tab is told here.
    window.dispatchEvent(new Event("storage"));
    setStatus(copy.changedStatus);
    return true;
  };

  const open = (id: string) => {
    const target = envelope.plans.find((p) => p.id === id);
    if (!target || !commit(switchScenario(envelope, id))) return;
    openPlanScreen(planHref, serialisePlan(target.plan));
  };

  const compareHref = (id: string): string | null => {
    const other = envelope.plans.find((p) => p.id === id);
    if (!other) return null;
    return (
      `${planHref}?${PLAN_FIELD}=${encodeURIComponent(currentPlan)}` +
      `&${COMPARE_FIELD}=${encodeURIComponent(serialisePlan(other.plan))}` +
      `&${COMPARE_NAME_FIELD}=${encodeURIComponent(other.name)}#compare`
    );
  };

  const create = () => {
    const current = deserialisePlan(currentPlan);
    if (!current) return;
    const name = uniqueScenarioName(envelope, newName || copy.defaultName);
    if (commit(addScenario(envelope, name, current))) setNewName("");
  };

  const atLimit = envelope.plans.length >= MAX_SCENARIOS;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-lg">{copy.savedHeading}</h3>
      <ul className="flex flex-col gap-2">
        {envelope.plans.map((scenario) => {
          const isActive = scenario.id === envelope.active;
          const href = isActive ? null : compareHref(scenario.id);
          const forName = copy.forScenario.replace("{name}", scenario.name);
          return (
            <li
              key={scenario.id}
              className="flex flex-col gap-2 rounded-md border border-line bg-surface p-3 text-sm"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-semibold text-ink">{scenario.name}</span>
                {isActive ? (
                  <span className="rounded-full bg-brand-tint px-2.5 py-0.5 text-xs font-semibold text-brand-deep">
                    {copy.currentTag}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {isActive ? null : (
                  <button
                    type="button"
                    onClick={() => open(scenario.id)}
                    className="focus-halo inline-flex min-h-11 items-center font-semibold text-brand-deep hover:underline"
                  >
                    {copy.open}
                    <span className="sr-only"> {forName}</span>
                  </button>
                )}
                {href ? (
                  <a
                    href={href}
                    className="focus-halo inline-flex min-h-11 items-center font-semibold text-brand-deep hover:underline"
                  >
                    {copy.compareWithCurrent}
                    <span className="sr-only"> {forName}</span>
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    setRenaming(renaming === scenario.id ? null : scenario.id);
                    setConfirming(null);
                  }}
                  aria-expanded={renaming === scenario.id}
                  className="focus-halo inline-flex min-h-11 items-center font-semibold text-brand-deep hover:underline"
                >
                  {copy.rename}
                  <span className="sr-only"> {forName}</span>
                </button>
                {envelope.plans.length > 1 ? (
                  confirming === scenario.id ? (
                    <span className="inline-flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          commit(deleteScenario(envelope, scenario.id));
                          setConfirming(null);
                        }}
                        className="focus-halo inline-flex min-h-11 items-center font-semibold text-error hover:underline"
                      >
                        {copy.confirmDelete}
                        <span className="sr-only"> {forName}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirming(null)}
                        className="focus-halo inline-flex min-h-11 items-center font-semibold text-muted hover:underline"
                      >
                        {copy.cancel}
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setConfirming(scenario.id);
                        setRenaming(null);
                      }}
                      className="focus-halo inline-flex min-h-11 items-center font-semibold text-brand-deep hover:underline"
                    >
                      {copy.delete}
                      <span className="sr-only"> {forName}</span>
                    </button>
                  )
                ) : null}
              </div>
              {renaming === scenario.id ? (
                <form
                  className="flex flex-wrap items-end gap-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const value = new FormData(event.currentTarget).get("name");
                    if (commit(renameScenario(envelope, scenario.id, String(value ?? "")))) {
                      setRenaming(null);
                    }
                  }}
                >
                  <Field
                    label={copy.renameLabel}
                    name="name"
                    defaultValue={scenario.name}
                    maxLength={40}
                    className="min-w-0 flex-1"
                  />
                  <Button type="submit" variant="secondary">
                    {copy.save}
                  </Button>
                </form>
              ) : null}
            </li>
          );
        })}
      </ul>

      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (!atLimit) create();
        }}
      >
        <h3 className="font-display text-lg">{copy.newHeading}</h3>
        <Field
          label={copy.newLabel}
          name="newName"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          maxLength={40}
          disabled={atLimit}
        />
        {atLimit ? (
          <p className="text-sm text-muted">
            {copy.limitTemplate.replace("{n}", String(MAX_SCENARIOS))}
          </p>
        ) : null}
        <div>
          <Button type="submit" variant="secondary" disabled={atLimit}>
            {copy.newButton}
          </Button>
        </div>
      </form>

      <p role="status" className="min-h-5 text-sm text-muted">
        {status}
      </p>
    </div>
  );
}
