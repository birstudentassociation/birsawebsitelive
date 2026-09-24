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
import ErrorMessage from "@/components/ErrorMessage";

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
          <label htmlFor={fieldId} className="font-semibold text-ink">
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
            className="focus-halo w-24 rounded-md border border-input-border bg-surface px-3.5 py-2.5 text-ink"
          />
          {hasError ? <ErrorMessage>{state.error}</ErrorMessage> : null}
        </div>
        <Button type="submit" variant="secondary" pending={isPending}>
          {updateLabel}
        </Button>
      </div>
    </form>
  );
}
