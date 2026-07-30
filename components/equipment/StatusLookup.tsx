"use client";

/**
 * Second (and final) question of the public, no-login "check your loan"
 * journey: the TU email, which also triggers the lookup (a status check has
 * nothing to "confirm" first, so unlike the create-a-record journeys there
 * is no separate check-answers step). Posts to the `submitLookupStep`
 * server action, so it works without JavaScript; `useActionState`
 * progressively enhances it with an inline result and focus management. A
 * pending loan can be cancelled via a link to a dedicated confirm page
 * (`/status/cancel`), not a client dialog, so cancellation also works
 * without JavaScript.
 */
import { useActionState, useEffect, useId, useRef } from "react";
import Field from "@/components/Field";
import ErrorSummary, { type ErrorSummaryItem } from "@/components/ErrorSummary";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import StatusPill from "@/components/inventory/StatusPill";
import { formatDate, localeHref } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { LoanStatus } from "@/lib/inventory/types";
import type { LookupState } from "@/app/[lang]/services/equipment-loan/status/actions";

/** The lookup result's item name is either a plain string or a bilingual pair. */
type ApiItemName = string | { en: string; th: string } | null;

export type StatusLookupLabels = {
  referenceLabel: string;
  referenceHint: string;
  emailLabel: string;
  emailHint: string;
  submit: string;
  submitting: string;
  errorSummaryTitle: string;
  required: string;
  errors: {
    referenceRequired: string;
    emailRequired: string;
    emailInvalid: string;
  };
  notFoundTitle: string;
  notFoundBody: string;
  rateLimitedTitle: string;
  rateLimitedBody: string;
  errorTitle: string;
  errorBody: string;
  tryAgain: string;
  resultTitle: string;
  statusLabel: string;
  itemLabel: string;
  datesLabel: string;
  statusLabels: Record<LoanStatus, string>;
  cancelButton: string;
  cancelConfirmTitle: string;
  cancelConfirmBody: string;
  confirmLabel: string;
  cancelLabel: string;
  cancelling: string;
  cancelledTitle: string;
  cancelledBody: string;
  cancelErrorTitle: string;
  cancelErrorBody: string;
  newSearch: string;
};

export type StatusLookupProps = {
  locale: Locale;
  labels: StatusLookupLabels;
  action: (prevState: LookupState, formData: FormData) => Promise<LookupState>;
  defaultEmail?: string;
};

function resolveItemName(name: ApiItemName, locale: Locale): string | null {
  if (name == null) return null;
  if (typeof name === "string") return name;
  return name[locale] ?? name.en ?? null;
}

const initialState: LookupState = { status: "idle" };

export default function StatusLookup({ locale, labels, action, defaultEmail }: StatusLookupProps) {
  const formId = useId();
  const [state, formAction, isPending] = useActionState(action, initialState);
  const resultRef = useRef<HTMLDivElement>(null);
  const statusHref = localeHref(locale, "/services/equipment-loan/status");
  const newSearchHref = `${statusHref}?reset=1`;
  const cancelHref = localeHref(locale, "/services/equipment-loan/status/cancel");

  useEffect(() => {
    if (state.status === "success") resultRef.current?.focus();
  }, [state.status]);

  if (state.status === "success") {
    const { loan } = state;
    const itemName = resolveItemName(loan.itemName, locale);
    return (
      <div className="flex flex-col gap-6">
        <div
          ref={resultRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="border-line bg-surface focus-halo flex flex-col gap-4 rounded-lg border p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-muted text-sm font-semibold">{labels.resultTitle}</p>
              <p className="font-display text-ink text-xl">{loan.reference}</p>
            </div>
            <StatusPill status={loan.status} label={labels.statusLabels[loan.status]} />
          </div>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            {itemName ? (
              <div>
                <dt className="text-muted font-semibold">{labels.itemLabel}</dt>
                <dd className="text-ink">{itemName}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-muted font-semibold">{labels.datesLabel}</dt>
              <dd className="text-ink">
                {formatDate(locale, loan.startDate)} &rarr; {formatDate(locale, loan.endDate)}
              </dd>
            </div>
          </dl>
          {loan.status === "pending" ? (
            <div>
              <Button href={cancelHref} variant="secondary">
                {labels.cancelButton}
              </Button>
            </div>
          ) : null}
        </div>
        <div>
          <Button href={newSearchHref} variant="ghost">
            {labels.newSearch}
          </Button>
        </div>
      </div>
    );
  }

  const hasFieldError = state.status === "invalid";
  const errorItems: ErrorSummaryItem[] = hasFieldError
    ? [{ id: `${formId}-email`, message: state.error }]
    : [];

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <ErrorSummary title={labels.errorSummaryTitle} errors={errorItems} />

      <div aria-live="polite">
        {state.status === "not-found" ? (
          <Notice variant="info" title={labels.notFoundTitle}>
            <p>{labels.notFoundBody}</p>
          </Notice>
        ) : null}
        {state.status === "rate-limited" ? (
          <Notice variant="warning" title={labels.rateLimitedTitle}>
            <p>{labels.rateLimitedBody}</p>
          </Notice>
        ) : null}
        {state.status === "error" ? (
          <Notice variant="error" title={labels.errorTitle}>
            <p>{labels.errorBody}</p>
          </Notice>
        ) : null}
      </div>

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

      <Field
        id={`${formId}-email`}
        name="email"
        type="email"
        label={labels.emailLabel}
        className="sr-only-label"
        hint={labels.emailHint}
        required
        requiredLabel={labels.required}
        defaultValue={defaultEmail}
        error={hasFieldError ? state.error : undefined}
        autoComplete="email"
        autoFocus
      />

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? labels.submitting : labels.submit}
        </Button>
        {isPending ? (
          <span role="status" className="sr-only">
            {labels.submitting}
          </span>
        ) : null}
      </div>
    </form>
  );
}
