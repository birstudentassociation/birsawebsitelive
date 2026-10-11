"use client";

/**
 * The opt-in form for sending planned electives to Academic Affairs.
 *
 * It shows the student exactly what would be sent, a curriculum and a list of
 * course and term pairs, and nothing else, before they tick the box and press
 * send. The hidden fields carry that same list and the curriculum id; the
 * plan itself is not in the form, so a request has no cohort, minor or passed
 * courses in it. Posts to `submitElectiveDemand`, so it works with HTML alone
 * (a plain POST re-renders the plan screen with the result, and `permalink`
 * brings the reader back to this section); `useActionState` layers the inline
 * result and focus management on top.
 *
 * The soft limit lives in `demandMarker.ts`: once a send succeeds the browser
 * remembers the term and offers no second send until it changes. With
 * JavaScript off there is no memory, and only the server's rate limit applies.
 */
import { useActionState, useEffect, useId, useRef, useSyncExternalStore } from "react";
import Button from "@/components/Button";
import Notice from "@/components/Notice";
import CollectionNotice from "@/components/forms/CollectionNotice";
import type { PlanOutreachCopy } from "@/components/study-plan/planOutreachCopy";
import {
  markDemandShared,
  parseDemandMarker,
  readDemandMarker,
  subscribeToDemandMarker,
} from "@/components/study-plan/demandMarker";
import type { DemandFormState } from "@/app/[lang]/services/study-plan/share-actions";
import { DEMAND_FIELDS } from "@/lib/elective-demand/payload";
import type { Locale } from "@/lib/i18n";

export type ElectiveDemandFormProps = {
  locale: Locale;
  copy: PlanOutreachCopy["demand"];
  action: (prevState: DemandFormState, formData: FormData) => Promise<DemandFormState>;
  /** Where a form post goes when JavaScript has not loaded: this plan screen, at this section. */
  permalink: string;
  versionId: string;
  versionLabel: string;
  /** The entries as the form field carries them, e.g. `PI380@2569-1`. */
  entriesValue: string;
  /** The same entries, with the term in words, for the student to read. */
  entries: { code: string; termLabel: string }[];
  /** The current academic term as a key, which the soft limit is counted per. */
  windowKey: string;
  windowLabel: string;
  /** How many students it takes before a course page says anything. */
  threshold: number;
};

const initialState: DemandFormState = { status: "idle" };

function fill(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template
  );
}

function getServerSnapshot(): string | null {
  return null;
}

export default function ElectiveDemandForm({
  locale,
  copy,
  action,
  permalink,
  versionId,
  versionLabel,
  entriesValue,
  entries,
  windowKey,
  windowLabel,
  threshold,
}: ElectiveDemandFormProps) {
  const formId = useId();
  const [state, formAction, isPending] = useActionState(action, initialState, permalink);
  const resultRef = useRef<HTMLDivElement>(null);
  const marker = useSyncExternalStore(subscribeToDemandMarker, readDemandMarker, getServerSnapshot);
  const alreadyShared = parseDemandMarker(marker).includes(windowKey);

  // Remember the send so this browser offers no second one this term.
  useEffect(() => {
    if (state.status === "shared") markDemandShared(windowKey);
  }, [state.status, windowKey]);

  useEffect(() => {
    if (state.status !== "idle" && state.status !== "shared") resultRef.current?.focus();
  }, [state.status]);

  if (entries.length === 0) {
    return <p className="text-sm text-muted">{copy.none}</p>;
  }

  if (state.status === "shared") {
    return (
      <Notice variant="success">
        <p role="status">{copy.shared}</p>
      </Notice>
    );
  }

  if (alreadyShared) {
    return (
      <Notice variant="info">
        <p role="status">{fill(copy.alreadyShared, { term: windowLabel })}</p>
      </Notice>
    );
  }

  const error = state.status === "idle" ? null : copy.errors[state.status];

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <input type="hidden" name={DEMAND_FIELDS.version} value={versionId} />
      <input type="hidden" name={DEMAND_FIELDS.entries} value={entriesValue} />

      {error ? (
        <div ref={resultRef} tabIndex={-1} role="alert" className="focus-halo">
          <Notice variant="error" title={copy.errorSummaryTitle}>
            {error}
          </Notice>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <h4 className="text-base font-semibold text-ink">{copy.sentHeading}</h4>
        <ul className="flex flex-col gap-1 text-sm text-ink">
          <li>{fill(copy.versionTemplate, { version: versionLabel })}</li>
          {entries.map((entry) => (
            <li key={`${entry.code}-${entry.termLabel}`}>
              {fill(copy.entryTemplate, { code: entry.code, term: entry.termLabel })}
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">{copy.notSent}</p>
        <p className="text-sm text-muted">{fill(copy.usedFor, { n: String(threshold) })}</p>
        <p className="text-sm text-muted">{copy.limitNote}</p>
      </div>

      {/* Honeypot: real visitors never see or fill this field. Visually
          hidden, not display:none, so assistive tech that ignores CSS still
          gets an explicit instruction rather than a trap. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${formId}-nickname`}>Leave this field empty</label>
        <input
          id={`${formId}-nickname`}
          name={DEMAND_FIELDS.honeypot}
          type="text"
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      <label
        htmlFor={`${formId}-agree`}
        className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-input-border bg-surface p-4 focus-within:border-brand has-checked:border-brand has-checked:bg-brand-tint"
      >
        <input
          id={`${formId}-agree`}
          type="checkbox"
          name={DEMAND_FIELDS.agree}
          value="yes"
          className="focus-halo h-5 w-5 shrink-0 border-input-border accent-brand"
        />
        <span className="font-semibold text-ink">{copy.checkboxLabel}</span>
      </label>

      <CollectionNotice activityId="elective-demand" locale={locale} />

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? copy.submitting : copy.submit}
        </Button>
        {isPending ? (
          <span role="status" className="sr-only">
            {copy.submitting}
          </span>
        ) : null}
      </div>
    </form>
  );
}
