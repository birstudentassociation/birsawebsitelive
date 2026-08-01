"use client";

import { useActionState, useId } from "react";
import Button from "@/components/Button";
import ErrorSummary from "@/components/ErrorSummary";
import type { DataRight } from "@/content/privacy/register";
import type { Locale } from "@/lib/i18n";
import type { QuestionStepState } from "@/components/forms/QuestionStepForm";

export type RightsWhatFormProps = {
  locale: Locale;
  rights: DataRight[];
  defaultValue?: string;
  action: (prevState: QuestionStepState, formData: FormData) => Promise<QuestionStepState>;
  legend: string;
  requiredLabel: string;
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
  requiredLabel,
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
        <legend className="sr-only">
          {legend} ({requiredLabel})
        </legend>

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
          {rights.map((right) => (
            <label
              key={right.id}
              htmlFor={`${groupId}-${right.id}`}
              className="border-input-border bg-surface has-checked:border-brand has-checked:bg-brand-tint focus-within:border-brand flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border p-4"
            >
              <input
                id={`${groupId}-${right.id}`}
                type="radio"
                name="right"
                value={right.id}
                required
                defaultChecked={defaultValue === right.id}
                className="focus-halo border-input-border accent-brand mt-0.5 h-5 w-5 shrink-0"
              />
              <span className="flex flex-col gap-0.5">
                <span className="text-ink font-semibold">{right.name[locale]}</span>
                <span className="text-muted text-sm">{right.description[locale]}</span>
              </span>
            </label>
          ))}
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
