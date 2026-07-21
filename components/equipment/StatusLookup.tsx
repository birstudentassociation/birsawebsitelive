"use client";

/**
 * Public, no-login "check your loan" tool. A single-question-per-screen GDS
 * style form (reference + TU email) posts to /api/loans/lookup. A match
 * shows a status panel (pill + item + dates); a pending loan can be
 * cancelled in place via /api/loans/cancel, reusing the same reference and
 * email so the officer console never needs to be involved.
 */
import { useActionState, useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import clsx from "clsx";
import Field from "@/components/Field";
import ErrorSummary, { type ErrorSummaryItem } from "@/components/ErrorSummary";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import { loanLookupSchema } from "@/lib/validation";
import { formatDate, localeHref } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { LoanStatus } from "@/lib/inventory/types";
import {
  submitLoanLookup,
  type LoanLookupState,
} from "@/app/[lang]/information-services/equipment-loan/status/actions";

/** The lookup API returns either a plain string or a bilingual pair for the item name. */
type ApiItemName = string | { en: string; th: string } | null;

type LoanResult = {
  reference: string;
  status: LoanStatus;
  startDate: string;
  endDate: string;
  itemName: ApiItemName;
};

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
  cancelConfirm: string;
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
};

type LookupState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "not-found" }
  | { status: "rate-limited" }
  | { status: "error" }
  | { status: "success"; loan: LoanResult };

type CancelState =
  { status: "idle" } | { status: "pending" } | { status: "done" } | { status: "error" };

type FieldErrors = Partial<Record<"reference" | "email", string>>;

/** Tints mirror the officer console's StatusPill so the same status always reads the same colour everywhere. */
const statusTint: Record<LoanStatus, string> = {
  pending: "bg-warning-tint text-warning",
  approved: "bg-success-tint text-success",
  checked_out: "bg-info-tint text-info",
  overdue: "bg-error-tint text-error",
  returned: "bg-sunken text-muted",
  rejected: "bg-error-tint text-error",
  cancelled: "bg-sunken text-muted",
  no_show: "bg-sunken text-muted",
};

function resolveItemName(name: ApiItemName, locale: Locale): string | null {
  if (name == null) return null;
  if (typeof name === "string") return name;
  return name[locale] ?? name.en ?? null;
}

function StatusPill({ status, label }: { status: LoanStatus; label: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
        statusTint[status]
      )}
    >
      {label}
    </span>
  );
}

/**
 * Progressive-enhancement wrapper. Without JavaScript (and before hydration) it
 * renders a fallback that posts the lookup to a server action: email travels by
 * POST, never in the URL. Once JS loads it swaps to the interactive tool, which
 * additionally lets a pending request be cancelled in place.
 */
export default function StatusLookup(props: StatusLookupProps) {
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => setEnhanced(true), []);

  if (!enhanced) return <StatusLookupFallback {...props} />;
  return <InteractiveStatusLookup {...props} />;
}

function InteractiveStatusLookup({ locale, labels }: StatusLookupProps) {
  const formId = useId();
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<LookupState>({ status: "idle" });
  const [cancelState, setCancelState] = useState<CancelState>({ status: "idle" });

  const fieldIds = {
    reference: `${formId}-reference`,
    email: `${formId}-email`,
  };

  function resetSearch() {
    setState({ status: "idle" });
    setCancelState({ status: "idle" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = loanLookupSchema.safeParse({ reference, email, nickname });

    if (!result.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0];
        if (path === "reference") nextErrors.reference = labels.errors.referenceRequired;
        if (path === "email") {
          nextErrors.email =
            email.length === 0 ? labels.errors.emailRequired : labels.errors.emailInvalid;
        }
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setState({ status: "pending" });
    setCancelState({ status: "idle" });

    try {
      const response = await fetch("/api/loans/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (response.status === 429) {
        setState({ status: "rate-limited" });
        return;
      }

      const body = (await response.json()) as { ok: boolean; reason?: string; loan?: LoanResult };

      if (body.ok && body.loan) {
        setState({ status: "success", loan: body.loan });
      } else if (body.reason === "not-found") {
        setState({ status: "not-found" });
      } else if (body.reason === "rate-limited") {
        setState({ status: "rate-limited" });
      } else {
        setState({ status: "error" });
      }
    } catch {
      setState({ status: "error" });
    }
  }

  async function handleCancel() {
    if (state.status !== "success") return;
    // Confirm before the irreversible cancel, otherwise the student would have
    // to submit a whole new request (GDS error prevention).
    if (!window.confirm(labels.cancelConfirm)) return;

    setCancelState({ status: "pending" });

    try {
      const response = await fetch("/api/loans/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: state.loan.reference, email }),
      });

      if (response.status === 429) {
        setCancelState({ status: "error" });
        return;
      }

      const body = (await response.json()) as { ok: boolean };

      if (body.ok) {
        setCancelState({ status: "done" });
        setState({ status: "success", loan: { ...state.loan, status: "cancelled" } });
      } else {
        setCancelState({ status: "error" });
      }
    } catch {
      setCancelState({ status: "error" });
    }
  }

  const errorItems: ErrorSummaryItem[] = Object.entries(errors)
    .filter(([, message]) => Boolean(message))
    .map(([key, message]) => ({
      id: fieldIds[key as keyof typeof fieldIds],
      message: message as string,
    }));

  if (state.status === "success") {
    const { loan } = state;
    const itemName = resolveItemName(loan.itemName, locale);

    return (
      <div className="flex flex-col gap-6">
        <div
          role="status"
          aria-live="polite"
          className="border-line bg-surface flex flex-col gap-4 rounded-lg border p-6"
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

          {loan.status === "pending" && cancelState.status !== "done" ? (
            <div className="flex flex-col gap-2">
              {cancelState.status === "error" ? (
                <Notice variant="error" title={labels.cancelErrorTitle}>
                  <p>{labels.cancelErrorBody}</p>
                </Notice>
              ) : null}
              <div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={cancelState.status === "pending"}
                >
                  {cancelState.status === "pending" ? labels.cancelling : labels.cancelButton}
                </Button>
                {cancelState.status === "pending" ? (
                  <span role="status" className="sr-only">
                    {labels.cancelling}
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}

          {cancelState.status === "done" ? (
            <div role="status" aria-live="polite">
              <Notice variant="success" title={labels.cancelledTitle}>
                <p>{labels.cancelledBody}</p>
              </Notice>
            </div>
          ) : null}
        </div>

        <div>
          <Button type="button" variant="ghost" onClick={resetSearch}>
            {labels.newSearch}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
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

      {/* Honeypot: real visitors never see or fill this. Visually hidden,
          not display:none, so assistive tech that ignores CSS still gets an
          explicit instruction rather than a trap. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${formId}-nickname`}>Leave this field empty</label>
        <input
          id={`${formId}-nickname`}
          name="nickname"
          type="text"
          autoComplete="off"
          tabIndex={-1}
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
        />
      </div>

      <Field
        id={fieldIds.reference}
        name="reference"
        label={labels.referenceLabel}
        hint={labels.referenceHint}
        required
        requiredLabel={labels.required}
        value={reference}
        onChange={(event) => setReference(event.target.value)}
        error={errors.reference}
        autoComplete="off"
      />
      <Field
        id={fieldIds.email}
        name="email"
        type="email"
        label={labels.emailLabel}
        hint={labels.emailHint}
        required
        requiredLabel={labels.required}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={errors.email}
        autoComplete="email"
      />

      <div>
        <Button type="submit" disabled={state.status === "pending"}>
          {state.status === "pending" ? labels.submitting : labels.submit}
        </Button>
        {state.status === "pending" ? (
          <span role="status" className="sr-only">
            {labels.submitting}
          </span>
        ) : null}
      </div>
    </form>
  );
}

/**
 * No-JavaScript fallback: the lookup posts to a server action and the result is
 * shown server-rendered. Cancelling a pending request is a JS-only enhancement
 * (it needs a confirmation step), so it isn't offered here; the interactive tool
 * handles it once JS loads.
 */
function StatusLookupFallback({ locale, labels }: StatusLookupProps) {
  const formId = useId();
  const [state, formAction, isPending] = useActionState<LoanLookupState, FormData>(
    submitLoanLookup,
    { status: "idle" }
  );
  const resultRef = useRef<HTMLDivElement>(null);
  const statusHref = localeHref(locale, "/information-services/equipment-loan/status");

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
        </div>
        <div>
          <Button href={statusHref} variant="ghost">
            {labels.newSearch}
          </Button>
        </div>
      </div>
    );
  }

  const values = state.status === "invalid" ? state.values : undefined;
  const errors = state.status === "invalid" ? state.errors : undefined;
  const fieldIds = { reference: `${formId}-reference`, email: `${formId}-email` };

  const emailError = errors?.email
    ? errors.email === "invalid"
      ? labels.errors.emailInvalid
      : labels.errors.emailRequired
    : undefined;

  const errorItems: ErrorSummaryItem[] = [];
  if (errors?.reference) {
    errorItems.push({ id: fieldIds.reference, message: labels.errors.referenceRequired });
  }
  if (emailError) errorItems.push({ id: fieldIds.email, message: emailError });

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
        id={fieldIds.reference}
        name="reference"
        label={labels.referenceLabel}
        hint={labels.referenceHint}
        required
        requiredLabel={labels.required}
        defaultValue={values?.reference}
        error={errors?.reference ? labels.errors.referenceRequired : undefined}
        autoComplete="off"
      />
      <Field
        id={fieldIds.email}
        name="email"
        type="email"
        label={labels.emailLabel}
        hint={labels.emailHint}
        required
        requiredLabel={labels.required}
        defaultValue={values?.email}
        error={emailError}
        autoComplete="email"
      />

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? labels.submitting : labels.submit}
        </Button>
      </div>
    </form>
  );
}
