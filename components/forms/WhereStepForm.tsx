"use client";

/**
 * "Which year and semester are you in now?": two selects on one page. Not
 * built on `QuestionStepForm` because that component's shared `Field`
 * renders exactly one input; the year and the semester are read together by
 * `submitWhereStep` (a `TermRef` is meaningless with only one half of it), so
 * splitting them across two pages would cost a step for no benefit. The
 * fieldset-free layout, error-summary/inline-error pairing and
 * `useActionState` progressive enhancement otherwise match
 * `QuestionStepForm` exactly, so this degrades identically without
 * JavaScript.
 */
import { useActionState } from "react";
import Field from "@/components/Field";
import Button from "@/components/Button";
import ErrorSummary from "@/components/ErrorSummary";
import type { QuestionStepState } from "./QuestionStepForm";

export type WhereStepFormProps = {
  action: (prevState: QuestionStepState, formData: FormData) => Promise<QuestionStepState>;
  yearLabel: string;
  yearOptions: { value: string; label: string }[];
  termLabel: string;
  termOptions: { value: string; label: string }[];
  requiredLabel: string;
  defaultYear?: string;
  defaultKind?: string;
  errorSummaryTitle: string;
  continueLabel: string;
  continuingLabel: string;
};

const initialState: QuestionStepState = { status: "idle" };

export default function WhereStepForm({
  action,
  yearLabel,
  yearOptions,
  termLabel,
  termOptions,
  requiredLabel,
  defaultYear,
  defaultKind,
  errorSummaryTitle,
  continueLabel,
  continuingLabel,
}: WhereStepFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const hasError = state.status === "invalid" && Boolean(state.error);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      <ErrorSummary
        title={errorSummaryTitle}
        errors={hasError ? [{ id: "step-year", message: state.error as string }] : []}
      />
      <Field
        id="step-year"
        name="year"
        as="select"
        label={yearLabel}
        required
        requiredLabel={requiredLabel}
        options={yearOptions}
        defaultValue={defaultYear}
        error={hasError ? state.error : undefined}
      />
      <Field
        id="step-kind"
        name="kind"
        as="select"
        label={termLabel}
        required
        requiredLabel={requiredLabel}
        options={termOptions}
        defaultValue={defaultKind}
      />
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
