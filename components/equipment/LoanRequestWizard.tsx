"use client";

import { useActionState, useEffect, useRef, useId } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import SummaryRow from "@/components/forms/SummaryRow";
import ResultPanel from "@/components/forms/ResultPanel";
import { localeHref, type Locale } from "@/lib/i18n";
import type { LoanWizardItem, LoanWizardLabels } from "@/components/equipment/loanWizardCopy";
import type {
  LoanDraft,
  CheckState,
} from "@/app/[lang]/services/equipment-loan/[item]/request/actions";

export type LoanRequestWizardProps = {
  item: LoanWizardItem;
  locale: Locale;
  labels: LoanWizardLabels;
  draft: LoanDraft;
  action: (prevState: CheckState, formData: FormData) => Promise<CheckState>;
};

const initialState: CheckState = { status: "idle" };

/**
 * Final "check your answers" step of the equipment loan request journey.
 * Lists every answer collected across the previous one-question-per-page
 * steps, each with a "change" link that re-enters that step and returns
 * here, then submits via the `submitLoanRequestCheck` server action. Posts
 * with a plain form, so it works without JavaScript; `useActionState`
 * progressively enhances it with an inline result and focus management.
 * Every terminal state the previous client-side wizard could reach
 * (availability lost between steps, the blocklist, too many open requests,
 * the online service not being configured, rate limiting, and a generic
 * failure) is preserved here, alongside the success reference number.
 */
export default function LoanRequestWizard({ item, locale, labels, draft, action }: LoanRequestWizardProps) {
  const formId = useId();
  const [state, formAction, isPending] = useActionState(action, initialState);
  const confirmationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "success") confirmationRef.current?.focus();
  }, [state.status]);

  const catalogueHref = localeHref(locale, "/services/equipment-loan");
  const contactHref = localeHref(locale, "/contact");
  const requestHref = localeHref(
    locale,
    `/services/equipment-loan/${item.key}/request`
  );

  if (state.status === "unavailable") {
    return (
      <ResultPanel
        variant="warning"
        title={labels.results.unavailableTitle}
        body={<p>{labels.results.unavailableBody}</p>}
        actionHref={catalogueHref}
        actionLabel={labels.results.backToCatalogue}
      />
    );
  }

  if (state.status === "blocklisted") {
    return (
      <ResultPanel
        variant="error"
        title={labels.results.blocklistedTitle}
        body={<p>{labels.results.blocklistedBody}</p>}
        actionHref={contactHref}
        actionLabel={labels.results.contactLink}
      />
    );
  }

  if (state.status === "limit-exceeded") {
    return (
      <ResultPanel
        variant="warning"
        title={labels.results.limitExceededTitle}
        body={<p>{labels.results.limitExceededBody}</p>}
        actionHref={contactHref}
        actionLabel={labels.results.contactLink}
      />
    );
  }

  if (state.status === "not-configured") {
    return (
      <ResultPanel
        variant="info"
        title={labels.results.notConfiguredTitle}
        body={
          <p>
            {labels.results.notConfiguredBody}{" "}
            <Link
              href={contactHref}
              className="text-brand-deep hover:text-brand-dark font-semibold underline"
            >
              {labels.results.contactLink}
            </Link>
            .
          </p>
        }
        actionHref={catalogueHref}
        actionLabel={labels.results.backToCatalogue}
      />
    );
  }

  if (state.status === "rate-limited") {
    return (
      <ResultPanel
        variant="warning"
        title={labels.results.rateLimitedTitle}
        body={<p>{labels.results.rateLimitedBody}</p>}
        retryHref={requestHref}
        retryLabel={labels.results.tryAgain}
      />
    );
  }

  if (state.status === "error") {
    return (
      <ResultPanel
        variant="error"
        title={labels.results.errorTitle}
        body={<p>{labels.results.errorBody}</p>}
        retryHref={requestHref}
        retryLabel={labels.results.tryAgain}
      />
    );
  }

  if (state.status === "success") {
    return (
      <div className="flex flex-col gap-6">
        <div
          ref={confirmationRef}
          tabIndex={-1}
          role="status"
          className="border-success bg-success-tint text-ink focus-halo rounded-lg border-l-4 p-6"
        >
          <p className="font-display text-xl">{labels.confirmation.title}</p>
          {state.reference ? (
            <p className="mt-3 text-sm">
              <span className="font-semibold">{labels.confirmation.referenceLabel}: </span>
              <span className="font-mono text-base">{state.reference}</span>
            </p>
          ) : null}
        </div>
        <div>
          <h2 className="font-display text-lg">{labels.confirmation.nextStepsTitle}</h2>
          <ul className="text-muted mt-3 flex flex-col gap-2 text-sm leading-relaxed">
            {labels.confirmation.nextSteps.map((next, index) => (
              <li key={index} className="flex gap-2">
                <span aria-hidden="true">{index + 1}.</span>
                <span>{next}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Button href={catalogueHref} variant="secondary">
            {labels.confirmation.backToCatalogue}
          </Button>
        </div>
      </div>
    );
  }

  const stepHref = (step: string) =>
    localeHref(
      locale,
      `/services/equipment-loan/${item.key}/request/${step}?returnTo=check`
    );

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      <dl className="border-line divide-line divide-y rounded-lg border">
        <SummaryRow label={labels.check.itemLabel} value={item.name[locale]} />
        <SummaryRow
          label={labels.check.nameLabel}
          value={draft.studentName ?? ""}
          changeHref={stepHref("name")}
          changeLabel={labels.common.change}
        />
        <SummaryRow
          label={labels.check.studentIdLabel}
          value={draft.studentId ?? ""}
          changeHref={stepHref("student-id")}
          changeLabel={labels.common.change}
        />
        <SummaryRow
          label={labels.check.emailLabel}
          value={draft.studentEmail ?? ""}
          changeHref={stepHref("email")}
          changeLabel={labels.common.change}
        />
        <SummaryRow
          label={labels.check.phoneLabel}
          value={draft.phone?.trim() || labels.check.phoneEmpty}
          changeHref={stepHref("phone")}
          changeLabel={labels.common.change}
        />
        <SummaryRow
          label={labels.check.startDateLabel}
          value={draft.startDate ?? ""}
          changeHref={stepHref("dates")}
          changeLabel={labels.common.change}
        />
        <SummaryRow
          label={labels.check.endDateLabel}
          value={draft.endDate ?? ""}
          changeHref={stepHref("dates")}
          changeLabel={labels.common.change}
        />
        <SummaryRow
          label={labels.check.reasonLabel}
          value={draft.reason?.trim() || labels.check.reasonEmpty}
          changeHref={stepHref("reason")}
          changeLabel={labels.common.change}
        />
      </dl>

      {/* Honeypot: real visitors never see or fill this field. */}
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

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? labels.check.submitting : labels.check.submit}
        </Button>
        <span role="status" aria-live="polite" className="sr-only">
          {isPending ? labels.check.submitting : ""}
        </span>
      </div>
    </form>
  );
}
