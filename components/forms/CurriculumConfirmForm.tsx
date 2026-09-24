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
import type { QuestionStepState } from "./QuestionStepForm";
import ErrorMessage from "@/components/ErrorMessage";

export type CurriculumConfirmFormProps = {
  action: (prevState: QuestionStepState, formData: FormData) => Promise<QuestionStepState>;
  legend: string;
  /** Visible marker text for the required fieldset, e.g. dict.actions.required. */
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

        {hasError ? <ErrorMessage id={`${groupId}-error`}>{state.error}</ErrorMessage> : null}

        <div className="flex flex-col gap-3">
          <label
            htmlFor={`${groupId}-yes`}
            className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-input-border bg-surface p-4 focus-within:border-brand has-checked:border-brand has-checked:bg-brand-tint"
          >
            <input
              id={`${groupId}-yes`}
              type="radio"
              name="confirmed"
              value="yes"
              required
              className="focus-halo h-5 w-5 shrink-0 border-input-border accent-brand"
            />
            <span className="font-semibold text-ink">{yesLabel}</span>
          </label>
          <label
            htmlFor={`${groupId}-no`}
            className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-input-border bg-surface p-4 focus-within:border-brand has-checked:border-brand has-checked:bg-brand-tint"
          >
            <input
              id={`${groupId}-no`}
              type="radio"
              name="confirmed"
              value="no"
              required
              className="focus-halo h-5 w-5 shrink-0 border-input-border accent-brand"
            />
            <span className="font-semibold text-ink">{noLabel}</span>
          </label>
        </div>
      </fieldset>

      <div>
        <Button type="submit" pending={isPending}>
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
