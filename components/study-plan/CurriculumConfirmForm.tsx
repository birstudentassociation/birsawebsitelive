"use client";

/**
 * The version gate's yes/no question: "Is this your curriculum?". Not built
 * on `components/forms/QuestionStepForm.tsx` because that component's shared
 * `Field` only renders a single input/textarea/select, not a radio group;
 * the fieldset/legend/error pattern here otherwise matches it exactly (same
 * action shape, same `useActionState` progressive enhancement), so it
 * degrades identically without JavaScript. Modelled on
 * `components/forms/RightsWhatForm.tsx`, which solves the same problem.
 */
import { useActionState, useId } from "react";
import Button from "@/components/Button";
import ErrorSummary from "@/components/ErrorSummary";
import type { QuestionStepState } from "@/components/forms/QuestionStepForm";

export type CurriculumConfirmFormProps = {
  action: (prevState: QuestionStepState, formData: FormData) => Promise<QuestionStepState>;
  legend: string;
  yesLabel: string;
  noLabel: string;
  errorSummaryTitle: string;
  continueLabel: string;
  continuingLabel: string;
};

const initialState: QuestionStepState = { status: "idle" };

export default function CurriculumConfirmForm({
  action,
  legend,
  yesLabel,
  noLabel,
  errorSummaryTitle,
  continueLabel,
  continuingLabel,
}: CurriculumConfirmFormProps) {
  const formId = useId();
  const [state, formAction, isPending] = useActionState(action, initialState);
  const groupId = `${formId}-confirmed`;
  const hasError = state.status === "invalid" && Boolean(state.error);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      <ErrorSummary
        title={errorSummaryTitle}
        errors={hasError ? [{ id: `${groupId}-yes`, message: state.error as string }] : []}
      />

      <fieldset
        className="flex flex-col gap-4"
        aria-describedby={hasError ? `${groupId}-error` : undefined}
      >
        <legend className="sr-only">{legend}</legend>

        {hasError ? (
          <p id={`${groupId}-error`} className="text-error flex items-center gap-1.5 text-sm font-medium">
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0">
              <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth={1.75} />
              <path d="M10 6.5v4.2" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
              <circle cx="10" cy="13.6" r="0.9" fill="currentColor" />
            </svg>
            {state.error}
          </p>
        ) : null}

        <div className="flex flex-col gap-3">
          <label
            htmlFor={`${groupId}-yes`}
            className="border-input-border bg-surface has-checked:border-brand has-checked:bg-brand-tint focus-within:border-brand flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border p-4"
          >
            <input
              id={`${groupId}-yes`}
              type="radio"
              name="confirmed"
              value="yes"
              required
              className="focus-halo border-input-border accent-brand h-5 w-5 shrink-0"
            />
            <span className="text-ink font-semibold">{yesLabel}</span>
          </label>
          <label
            htmlFor={`${groupId}-no`}
            className="border-input-border bg-surface has-checked:border-brand has-checked:bg-brand-tint focus-within:border-brand flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border p-4"
          >
            <input
              id={`${groupId}-no`}
              type="radio"
              name="confirmed"
              value="no"
              required
              className="focus-halo border-input-border accent-brand h-5 w-5 shrink-0"
            />
            <span className="text-ink font-semibold">{noLabel}</span>
          </label>
        </div>
      </fieldset>

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? continuingLabel : continueLabel}
        </Button>
        {isPending ? (
          <span role="status" className="sr-only">
            {continuingLabel}
          </span>
        ) : null}
      </div>
    </form>
  );
}
