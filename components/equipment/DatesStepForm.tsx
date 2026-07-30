"use client";

import { useActionState } from "react";
import Field from "@/components/Field";
import ErrorSummary, { type ErrorSummaryItem } from "@/components/ErrorSummary";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import type { DatesStepState } from "@/app/[lang]/services/equipment-loan/[item]/request/actions";
import type { LoanWizardLabels } from "@/components/equipment/loanWizardCopy";

export type DatesStepFormProps = {
  action: (prevState: DatesStepState, formData: FormData) => Promise<DatesStepState>;
  labels: LoanWizardLabels;
  defaultStartDate?: string;
  defaultEndDate?: string;
  minStartDate: string;
  maxLoanDays: number;
};

const initialState: DatesStepState = { status: "idle" };

function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * The collection/return date range: two inputs that together answer one
 * question ("when do you need to borrow it"), matching how the previous
 * client wizard treated the same pair. Submitting validates both dates and
 * checks live availability for that range server-side in the same action
 * (previously a separate client `fetch` step); on success the action
 * redirects to the next question, so there is nothing further to render here
 * for that case.
 */
export default function DatesStepForm({
  action,
  labels,
  defaultStartDate,
  defaultEndDate,
  minStartDate,
  maxLoanDays,
}: DatesStepFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  const errors = state.status === "invalid" ? state.errors : {};
  const errorItems: ErrorSummaryItem[] = [];
  if (errors.startDate) errorItems.push({ id: "step-startDate", message: errors.startDate });
  if (errors.endDate) errorItems.push({ id: "step-endDate", message: errors.endDate });

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      <ErrorSummary title={labels.common.errorSummaryTitle} errors={errorItems} />

      <Field
        id="step-startDate"
        name="startDate"
        type="date"
        label={labels.dates.startQuestion}
        hint={labels.dates.startHint}
        required
        requiredLabel={labels.common.required}
        defaultValue={defaultStartDate}
        error={errors.startDate}
        min={minStartDate}
        autoFocus
      />
      <Field
        id="step-endDate"
        name="endDate"
        type="date"
        label={labels.dates.endQuestion}
        hint={labels.dates.endHint}
        required
        requiredLabel={labels.common.required}
        defaultValue={defaultEndDate}
        error={errors.endDate}
        min={defaultStartDate || minStartDate}
        max={defaultStartDate ? addDaysISO(defaultStartDate, maxLoanDays) : undefined}
      />

      {state.status === "unavailable" ? (
        <Notice variant="warning" title={labels.dates.noneFreeTitle}>
          <p role="status">{labels.dates.noneFreeBody}</p>
        </Notice>
      ) : null}
      {state.status === "check-error" ? (
        <Notice variant="error" title={labels.dates.checkErrorTitle}>
          <p role="status">{labels.dates.checkErrorBody}</p>
        </Notice>
      ) : null}

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? labels.dates.checking : labels.common.continueLabel}
        </Button>
        <span role="status" aria-live="polite" className="sr-only">
          {isPending ? labels.dates.checking : ""}
        </span>
      </div>
    </form>
  );
}
