"use client";

import { useActionState } from "react";
import Field from "@/components/Field";
import ErrorSummary from "@/components/ErrorSummary";
import Button from "@/components/Button";

/** Minimal shape every single-question step action must return. */
export type QuestionStepState = {
  status: "idle" | "invalid";
  error?: string;
};

export type QuestionStepFieldProps = {
  name: string;
  label: string;
  hint?: string;
  as?: "input" | "textarea" | "select";
  type?: string;
  required?: boolean;
  requiredLabel?: string;
  optionalLabel?: string;
  options?: { value: string; label: string }[];
  autoComplete?: string;
  defaultValue?: string;
  rows?: number;
  min?: string;
  max?: string;
};

export type QuestionStepFormProps = {
  action: (prevState: QuestionStepState, formData: FormData) => Promise<QuestionStepState>;
  initialState: QuestionStepState;
  field: QuestionStepFieldProps;
  errorSummaryTitle: string;
  continueLabel: string;
  continuingLabel?: string;
  /** Extra hidden inputs, e.g. a `returnTo=check` marker for "change" links. */
  hiddenFields?: Record<string, string>;
};

/**
 * One question, one field, one continue button. Posts to a server action
 * (`useActionState` progressively enhances it; a plain POST without
 * JavaScript re-renders this same page with the error, exactly like the
 * site's other server-action forms). On success the action itself redirects
 * to the next step or back to check-answers, so this component never needs
 * to manage which step is showing: that lives in the URL.
 */
export default function QuestionStepForm({
  action,
  initialState,
  field,
  errorSummaryTitle,
  continueLabel,
  continuingLabel,
  hiddenFields,
}: QuestionStepFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const fieldId = `step-${field.name}`;
  const hasError = state.status === "invalid" && Boolean(state.error);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      <ErrorSummary
        title={errorSummaryTitle}
        errors={hasError ? [{ id: fieldId, message: state.error as string }] : []}
      />
      {hiddenFields
        ? Object.entries(hiddenFields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))
        : null}
      <Field
        id={fieldId}
        name={field.name}
        as={field.as}
        type={field.type}
        label={field.label}
        className="sr-only-label"
        hint={field.hint}
        required={field.required}
        requiredLabel={field.requiredLabel}
        optionalLabel={field.optionalLabel}
        options={field.options}
        defaultValue={field.defaultValue}
        error={hasError ? state.error : undefined}
        autoComplete={field.autoComplete}
        rows={field.rows}
        min={field.min}
        max={field.max}
        autoFocus
      />
      <div>
        <Button type="submit" disabled={isPending}>
          {isPending && continuingLabel ? continuingLabel : continueLabel}
        </Button>
      </div>
    </form>
  );
}
