"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import Email from "@/components/Email";
import Field from "@/components/Field";
import SummaryRow from "@/components/forms/SummaryRow";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import type { ContactDraft, CheckState } from "@/app/[lang]/contact/actions";
import type { FeedbackState } from "@/app/[lang]/feedback/actions";
import type { Dictionary, Locale } from "@/lib/i18n";
import { localeHref } from "@/lib/i18n";
import { contactCategoryLabel, type ContactCategory } from "@/components/forms/contactWizardCopy";

export type ContactCheckFormProps = {
  locale: Locale;
  dict: Dictionary;
  draft: ContactDraft;
  action: (prevState: CheckState, formData: FormData) => Promise<CheckState>;
  feedbackAction: (prevState: FeedbackState, formData: FormData) => Promise<FeedbackState>;
  categoryLabel: string;
  subjectLabel: string;
  messageLabel: string;
  nameLabel: string;
  emailLabel: string;
  changeLabel: string;
  submitLabel: string;
  submittingLabel: string;
};

const initialState: CheckState = { status: "idle" };

/**
 * Final "check your answers" step of the contact journey: lists every
 * answer collected across the previous steps (each with a "change" link
 * that re-enters that step and returns here), then submits via the
 * `submitContactCheck` server action. Posts with a plain form so it works
 * without JavaScript; `useActionState` progressively enhances it with an
 * inline result and focus management, same pattern as every other form on
 * the site.
 */
export default function ContactForm({
  locale,
  dict,
  draft,
  action,
  feedbackAction,
  categoryLabel,
  subjectLabel,
  messageLabel,
  nameLabel,
  emailLabel,
  changeLabel,
  submitLabel,
  submittingLabel,
}: ContactCheckFormProps) {
  const formId = useId();
  const [state, formAction, isPending] = useActionState(action, initialState);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "success" || state.status === "fallback") {
      resultRef.current?.focus();
    }
  }, [state.status]);

  function buildDraftText(d: ContactDraft): string {
    const catLabel = d.category ? contactCategoryLabel(locale, d.category as ContactCategory) : "";
    return [
      `${dict.form.yourName}: ${d.name ?? ""}`,
      `${dict.form.email}: ${d.email ?? ""}`,
      `${dict.form.category}: ${catLabel}`,
      `${dict.form.subject}: ${d.subject ?? ""}`,
      "",
      d.message ?? "",
    ].join("\n");
  }

  if (state.status === "success") {
    // The journey is finished here, which is exactly where the Service Manual
    // expects a satisfaction prompt ("you must allow users to tell you what
    // they think of your service once they've finished using it").
    return (
      <div className="flex flex-col gap-8">
        <div
          ref={resultRef}
          tabIndex={-1}
          role="status"
          className="focus-halo rounded-lg border-l-4 border-success bg-success-tint p-6 text-ink"
        >
          <p className="font-semibold">{dict.form.successTitle}</p>
          <p className="mt-1 text-sm">{dict.form.successBody}</p>
        </div>
        <FeedbackForm
          locale={locale}
          sourcePath={localeHref(locale, "/contact")}
          action={feedbackAction}
        />
      </div>
    );
  }

  if (state.status === "fallback") {
    return (
      <div className="flex flex-col gap-4">
        <div
          ref={resultRef}
          tabIndex={-1}
          role="status"
          className="focus-halo rounded-lg border-l-4 border-warning bg-warning-tint p-6 text-ink"
        >
          <p className="font-semibold">{dict.form.fallbackTitle}</p>
          <p className="mt-1 text-sm">
            {dict.form.fallbackBody}{" "}
            <Email
              address="birsa@tu.ac.th"
              className="font-medium text-brand-deep hover:text-brand-dark"
            />{" "}
            /{" "}
            <Email
              address="birstudentassociation@gmail.com"
              className="font-medium text-brand-deep hover:text-brand-dark"
            />
          </p>
        </div>
        <Field
          as="textarea"
          name="draft"
          label={dict.form.message}
          value={buildDraftText(state.draft)}
          readOnly
          rows={8}
        />
      </div>
    );
  }

  // The category step lives at the journey's entry URL (/contact), not
  // /contact/category, so it needs its own href rather than the generic
  // step-name pattern the other four fields use.
  const categoryHref = localeHref(locale, "/contact?returnTo=check");
  const stepHref = (step: string) => localeHref(locale, `/contact/${step}?returnTo=check`);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      {state.status === "error" ? <Notice variant="error">{dict.form.genericError}</Notice> : null}

      <dl className="divide-y divide-line rounded-lg border border-line">
        <SummaryRow
          label={categoryLabel}
          value={
            draft.category ? contactCategoryLabel(locale, draft.category as ContactCategory) : ""
          }
          changeHref={categoryHref}
          changeLabel={changeLabel}
        />
        <SummaryRow
          label={subjectLabel}
          value={draft.subject ?? ""}
          changeHref={stepHref("subject")}
          changeLabel={changeLabel}
        />
        <SummaryRow
          label={messageLabel}
          value={draft.message ?? ""}
          changeHref={stepHref("message")}
          changeLabel={changeLabel}
        />
        <SummaryRow
          label={nameLabel}
          value={draft.name ?? ""}
          changeHref={stepHref("name")}
          changeLabel={changeLabel}
        />
        <SummaryRow
          label={emailLabel}
          value={draft.email ?? ""}
          changeHref={stepHref("email")}
          changeLabel={changeLabel}
        />
      </dl>

      <p className="text-sm text-muted">{dict.form.privacyNote}</p>

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
        />
      </div>

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? submittingLabel : submitLabel}
        </Button>
        {isPending ? (
          <span role="status" className="sr-only">
            {submittingLabel}
          </span>
        ) : null}
      </div>
    </form>
  );
}
