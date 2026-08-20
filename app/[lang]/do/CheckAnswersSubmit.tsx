"use client";

import { useActionState } from "react";

import Button from "@/components/bds/Button";
import ErrorSummary from "@/components/bds/ErrorSummary";
import { Stack } from "@/components/bds/Layout";
import type { CheckAnswersState } from "@/app/[lang]/do/actions";

/**
 * The submit control at the bottom of `CheckAnswers`
 * (`components/bds/CheckAnswers.tsx`'s own `children` slot: "Confirmation
 * mechanics are lib/services/intake.ts's job, not this component's"). A real
 * `<form action>` around a honeypot field (matching the equipment loan
 * wizard's own convention: a plain, visually hidden text input a bot fills
 * and a real visitor never sees) and the "confirm and send" button.
 */
export type CheckAnswersSubmitLabels = {
  confirmAndSend: string;
  sending: string;
  errorSummaryTitle: string;
  rateLimited: string;
  genericError: string;
};

export default function CheckAnswersSubmit({
  action,
  labels,
}: {
  action: (prevState: CheckAnswersState, formData: FormData) => Promise<CheckAnswersState>;
  labels: CheckAnswersSubmitLabels;
}) {
  const [state, formAction, isPending] = useActionState<CheckAnswersState, FormData>(action, {
    status: "idle",
  });

  const errorMessage =
    state.status === "rate-limited"
      ? labels.rateLimited
      : state.status === "error"
        ? labels.genericError
        : undefined;

  return (
    <form action={formAction}>
      <Stack gap="lg">
        {errorMessage ? (
          <ErrorSummary
            title={labels.errorSummaryTitle}
            errors={[{ id: "submit", message: errorMessage }]}
          />
        ) : null}
        {/* Honeypot, matching components/equipment/LoanRequestWizard.tsx's own
            convention: real visitors never see or fill this field. A bot
            that fills every field it can find trips it, and the action
            silently accepts and discards rather than revealing detection
            (matches submitLoanRequestCheck's own convention). */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="do-check-nickname">Leave this field empty</label>
          <input
            id="do-check-nickname"
            name="nickname"
            type="text"
            autoComplete="off"
            tabIndex={-1}
          />
        </div>
        <div>
          <Button type="submit" disabled={isPending}>
            {isPending ? labels.sending : labels.confirmAndSend}
          </Button>
        </div>
      </Stack>
    </form>
  );
}
