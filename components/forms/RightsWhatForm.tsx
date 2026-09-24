"use client";

import { useActionState, useId } from "react";
import Button from "@/components/Button";
import ErrorSummary from "@/components/ErrorSummary";
import type { DataRight } from "@/content/privacy/register";
import type { Locale } from "@/lib/i18n";
import type { QuestionStepState } from "@/components/forms/QuestionStepForm";
import ErrorMessage from "@/components/ErrorMessage";

export type RightsWhatFormProps = {
  locale: Locale;
  rights: DataRight[];
  defaultValue?: string;
  action: (prevState: QuestionStepState, formData: FormData) => Promise<QuestionStepState>;
  legend: string;
  errorSummaryTitle: string;
  continueLabel: string;
  continuingLabel: string;
};

const initialState: QuestionStepState = { status: "idle" };

/**
 * The `/privacy/your-data/what` step: a fieldset of radio options, one per
 * `DataRight` from `content/privacy/register.ts`, each showing the right's
 * name and description. Not built on `components/forms/QuestionStepForm.tsx`
 * because that component's shared `Field` only renders a single
 * input/textarea/select, not a radio group; the fieldset/legend/error
 * pattern here otherwise matches it exactly (same action shape, same
 * `useActionState` progressive enhancement, same error-summary/inline-error
 * pairing), so it degrades identically without JavaScript.
 */
export default function RightsWhatForm({
  locale,
  rights,
  defaultValue,
  action,
  legend,
  errorSummaryTitle,
  continueLabel,
  continuingLabel,
}: RightsWhatFormProps) {
  const formId = useId();
  const [state, formAction, isPending] = useActionState(action, initialState);
  const groupId = `${formId}-right`;
  const hasError = state.status === "invalid" && Boolean(state.error);
  const firstOptionId = `${groupId}-${rights[0]?.id ?? "option"}`;

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      <ErrorSummary
        title={errorSummaryTitle}
        errors={hasError ? [{ id: firstOptionId, message: state.error as string }] : []}
      />

      <fieldset
        className="flex flex-col gap-4"
        aria-describedby={hasError ? `${groupId}-error` : undefined}
      >
        <legend className="sr-only">{legend}</legend>

        {hasError ? <ErrorMessage id={`${groupId}-error`}>{state.error}</ErrorMessage> : null}

        <div className="flex flex-col gap-3">
          {rights.map((right) => (
            <label
              key={right.id}
              htmlFor={`${groupId}-${right.id}`}
              className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border border-input-border bg-surface p-4 focus-within:border-brand has-checked:border-brand has-checked:bg-brand-tint"
            >
              <input
                id={`${groupId}-${right.id}`}
                type="radio"
                name="right"
                value={right.id}
                required
                defaultChecked={defaultValue === right.id}
                className="focus-halo mt-0.5 h-5 w-5 shrink-0 border-input-border accent-brand"
              />
              <span className="flex flex-col gap-0.5">
                <span className="font-semibold text-ink">{right.name[locale]}</span>
                <span className="text-muted">{right.description[locale]}</span>
              </span>
            </label>
          ))}
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
