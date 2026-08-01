"use client";

/**
 * One term's free elective credit count, on its own so it can report an
 * error: unlike the add/remove course forms (whose `<select>` only ever
 * offers values that are already valid, so a malformed submission means
 * tampering, not a mistake), this is a freely-typed number field, and a
 * student who enters something out of range deserves to be told, not
 * silently ignored. Mirrors the error-summary pattern every step form in
 * this journey uses (see `components/forms/QuestionStepForm.tsx`).
 */
import { useActionState } from "react";
import Button from "@/components/Button";
import ErrorSummary from "@/components/ErrorSummary";
import { PLAN_FIELD } from "@/lib/study-plan/plan";
import type { TermRef } from "@/content/curriculum";

export type TermFreeElectiveState = { status: "idle" | "invalid"; error?: string };

export const termFreeElectiveInitialState: TermFreeElectiveState = { status: "idle" };

export type TermFreeElectiveFormProps = {
  term: TermRef;
  /** The plan as it stands on arrival at this screen, carried like every other form here. */
  plan: string;
  freeElectiveCredits: number;
  action: (prevState: TermFreeElectiveState, formData: FormData) => Promise<TermFreeElectiveState>;
  label: string;
  updateLabel: string;
  errorSummaryTitle: string;
};

export default function TermFreeElectiveForm({
  term,
  plan,
  freeElectiveCredits,
  action,
  label,
  updateLabel,
  errorSummaryTitle,
}: TermFreeElectiveFormProps) {
  const [state, formAction, isPending] = useActionState(action, termFreeElectiveInitialState);
  const fieldId = `free-elective-${term.year}-${term.kind}`;
  const hasError = state.status === "invalid" && Boolean(state.error);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-3">
      <ErrorSummary
        title={errorSummaryTitle}
        errors={hasError ? [{ id: fieldId, message: state.error as string }] : []}
      />
      <input type="hidden" name={PLAN_FIELD} value={plan} />
      <input type="hidden" name="year" value={term.year} />
      <input type="hidden" name="kind" value={term.kind} />
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={fieldId} className="text-ink text-sm font-semibold">
            {label}
          </label>
          <input
            id={fieldId}
            name="freeElectiveCredits"
            type="number"
            min={0}
            max={21}
            defaultValue={freeElectiveCredits}
            aria-invalid={hasError ? "true" : undefined}
            className="focus-halo border-input-border bg-surface text-ink w-24 rounded-md border px-3.5 py-2.5 text-[0.95rem]"
          />
          {hasError ? (
            <p className="text-error flex items-center gap-1.5 text-sm font-medium">
              <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0">
                <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth={1.75} />
                <path d="M10 6.5v4.2" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
                <circle cx="10" cy="13.6" r="0.9" fill="currentColor" />
              </svg>
              {state.error}
            </p>
          ) : null}
        </div>
        <Button type="submit" variant="secondary" disabled={isPending}>
          {updateLabel}
        </Button>
      </div>
    </form>
  );
}
