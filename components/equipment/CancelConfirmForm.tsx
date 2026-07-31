"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import { localeHref, type Locale } from "@/lib/i18n";
import type { StatusLookupLabels } from "@/components/equipment/StatusLookup";
import type { CancelState } from "@/app/[lang]/services/equipment-loan/status/actions";

/** Clears the status-lookup draft cookie and returns to the start of the journey. */
type ResetAction = (formData: FormData) => Promise<void>;

export type CancelConfirmFormProps = {
  locale: Locale;
  labels: StatusLookupLabels;
  reference: string;
  action: (prevState: CancelState, formData: FormData) => Promise<CancelState>;
  resetAction: ResetAction;
};

const initialState: CancelState = { status: "idle" };

/**
 * "Are you sure?" page for cancelling a pending loan request. Previously
 * this confirmation only existed as a client-side `confirm()` dialog, so
 * cancelling required JavaScript; this page makes it a real, separate step
 * (GOV.UK error-prevention pattern for an irreversible action), reachable
 * and completable with JavaScript off. Reads the reference and email to
 * cancel from the status-lookup draft cookie, not from the URL, so no
 * personal data ever appears in a query string.
 */
export default function CancelConfirmForm({
  locale,
  labels,
  reference,
  action,
  resetAction,
}: CancelConfirmFormProps) {
  const formId = useId();
  const [state, formAction, isPending] = useActionState(action, initialState);
  const resultRef = useRef<HTMLDivElement>(null);
  const emailStepHref = localeHref(locale, "/services/equipment-loan/status/email");

  useEffect(() => {
    if (state.status === "done" || state.status === "not-found" || state.status === "error") {
      resultRef.current?.focus();
    }
  }, [state.status]);

  if (state.status === "done") {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        className="border-success bg-success-tint text-ink focus-halo rounded-lg border-l-4 p-6"
      >
        <p className="font-semibold">{labels.cancelledTitle}</p>
        <p className="mt-1 text-sm">{labels.cancelledBody}</p>
        <form action={resetAction} className="mt-4">
          <Button type="submit" variant="secondary">
            {labels.newSearch}
          </Button>
        </form>
      </div>
    );
  }

  if (state.status === "not-found") {
    return (
      <div ref={resultRef} tabIndex={-1} className="focus-halo">
        <Notice variant="info" title={labels.notFoundTitle}>
          <p>{labels.notFoundBody}</p>
        </Notice>
        <form action={resetAction} className="mt-4">
          <Button type="submit" variant="secondary">
            {labels.newSearch}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      {state.status === "error" || state.status === "rate-limited" ? (
        <div ref={resultRef} tabIndex={-1} className="focus-halo">
          <Notice variant="error" title={labels.cancelErrorTitle}>
            <p>{labels.cancelErrorBody}</p>
          </Notice>
        </div>
      ) : null}

      <p className="text-muted">
        {labels.cancelConfirmBody} <span className="font-mono">{reference}</span>
      </p>

      {/* Honeypot: real visitors never see or fill this. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${formId}-nickname`}>Leave this field empty</label>
        <input
          id={`${formId}-nickname`}
          name="nickname"
          type="text"
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="danger" disabled={isPending}>
          {isPending ? labels.cancelling : labels.confirmLabel}
        </Button>
        <Button href={emailStepHref} variant="secondary">
          {labels.cancelLabel}
        </Button>
      </div>
    </form>
  );
}
