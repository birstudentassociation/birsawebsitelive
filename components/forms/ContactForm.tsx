"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import Field from "@/components/Field";
import ErrorSummary, { type ErrorSummaryItem } from "@/components/ErrorSummary";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import Email from "@/components/Email";
import { submitContact, type ContactState } from "@/app/[lang]/contact/actions";
import type { Dictionary, Locale } from "@/lib/i18n";

export type ContactFormProps = {
  locale: Locale;
  dict: Dictionary;
  /** Preselected category, e.g. from `?category=` search param. */
  initialCategory?: string;
  /** Prefilled subject, e.g. from the "report a problem with this page" link. */
  initialSubject?: string;
};

const CATEGORY_VALUES = ["question", "suggestion", "problem", "other"] as const;

function categoryLabel(locale: Locale, value: (typeof CATEGORY_VALUES)[number]): string {
  const labels: Record<(typeof CATEGORY_VALUES)[number], string> = {
    question: locale === "th" ? "คำถามทั่วไป" : "A question",
    suggestion: locale === "th" ? "ข้อเสนอแนะ" : "A suggestion",
    problem: locale === "th" ? "แจ้งปัญหา" : "A problem to report",
    other: locale === "th" ? "เรื่องอื่น ๆ" : "Something else",
  };
  return labels[value];
}

const initialState: ContactState = { status: "idle" };

/**
 * Contact BIRSA form. Posts to the `submitContact` server action, so it works
 * with HTML alone (a plain form POST re-renders the page with the result);
 * `useActionState` progressively enhances it with an inline error summary,
 * focus management, and a pending state: no full reload when JS is available.
 * Inputs are uncontrolled (`defaultValue` + `name`) so the no-JS path carries
 * values through `FormData`; on a validation error the server echoes them back.
 */
export default function ContactForm({
  locale,
  dict,
  initialCategory,
  initialSubject,
}: ContactFormProps) {
  const formId = useId();
  const [state, formAction, isPending] = useActionState(submitContact, initialState);
  const resultRef = useRef<HTMLDivElement>(null);

  // On success/fallback the form (and the focused submit button) unmounts, so
  // move focus to the result message, otherwise focus falls back to <body>
  // and keyboard users lose their place (2.4.3).
  useEffect(() => {
    if (state.status === "success" || state.status === "fallback") {
      resultRef.current?.focus();
    }
  }, [state.status]);

  const fieldIds = {
    name: `${formId}-name`,
    email: `${formId}-email`,
    category: `${formId}-category`,
    subject: `${formId}-subject`,
    message: `${formId}-message`,
  };

  const values = state.values;

  function buildDraft(): string {
    const v = state.values;
    if (!v) return "";
    const catLabel = categoryLabel(locale, v.category as (typeof CATEGORY_VALUES)[number]);
    return [
      `${dict.form.yourName}: ${v.name}`,
      `${dict.form.email}: ${v.email}`,
      `${dict.form.category}: ${catLabel}`,
      `${dict.form.subject}: ${v.subject}`,
      "",
      v.message,
    ].join("\n");
  }

  if (state.status === "success") {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        className="border-success bg-success-tint text-ink focus-halo rounded-lg border-l-4 p-6"
      >
        <p className="font-semibold">{dict.form.successTitle}</p>
        <p className="mt-1 text-sm">{dict.form.successBody}</p>
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
          className="border-warning bg-warning-tint text-ink focus-halo rounded-lg border-l-4 p-6"
        >
          <p className="font-semibold">{dict.form.fallbackTitle}</p>
          <p className="mt-1 text-sm">
            {dict.form.fallbackBody}{" "}
            <Email
              address="birsa@tu.ac.th"
              className="text-brand-deep hover:text-brand-dark font-medium"
            />
          </p>
        </div>
        <Field as="textarea" name="draft" label={dict.form.message} value={buildDraft()} readOnly rows={8} />
      </div>
    );
  }

  const errorItems: ErrorSummaryItem[] = Object.entries(state.errors ?? {})
    .filter(([, message]) => Boolean(message))
    .map(([key, message]) => ({ id: fieldIds[key as keyof typeof fieldIds], message: message as string }));

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <input type="hidden" name="locale" value={locale} />
      <ErrorSummary title={dict.form.errorSummaryTitle} errors={errorItems} />

      {state.status === "error" ? <Notice variant="error">{dict.form.genericError}</Notice> : null}

      {/* Honeypot: real visitors never see or fill this. Visually hidden,
          not display:none, so assistive tech that ignores CSS still gets an
          explicit instruction rather than a trap. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${formId}-nickname`}>Leave this field empty</label>
        <input id={`${formId}-nickname`} name="nickname" type="text" autoComplete="off" tabIndex={-1} />
      </div>

      <Field
        id={fieldIds.name}
        name="name"
        label={dict.form.yourName}
        required
        requiredLabel={dict.actions.required}
        defaultValue={values?.name}
        error={state.errors?.name}
        autoComplete="name"
      />
      <Field
        id={fieldIds.email}
        name="email"
        type="email"
        label={dict.form.email}
        hint={dict.form.emailHint}
        required
        requiredLabel={dict.actions.required}
        defaultValue={values?.email}
        error={state.errors?.email}
        autoComplete="email"
      />
      <Field
        id={fieldIds.category}
        name="category"
        as="select"
        label={dict.form.category}
        required
        requiredLabel={dict.actions.required}
        defaultValue={values?.category ?? initialCategory ?? "question"}
        error={state.errors?.category}
        options={CATEGORY_VALUES.map((value) => ({ value, label: categoryLabel(locale, value) }))}
      />
      <Field
        id={fieldIds.subject}
        name="subject"
        label={dict.form.subject}
        required
        requiredLabel={dict.actions.required}
        defaultValue={values?.subject ?? initialSubject}
        error={state.errors?.subject}
      />
      <Field
        id={fieldIds.message}
        name="message"
        as="textarea"
        label={dict.form.message}
        required
        requiredLabel={dict.actions.required}
        defaultValue={values?.message}
        error={state.errors?.message}
      />

      <p className="text-muted text-sm">{dict.form.privacyNote}</p>

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? dict.form.sending : dict.form.send}
        </Button>
        {isPending ? (
          <span role="status" className="sr-only">
            {dict.form.sending}
          </span>
        ) : null}
      </div>
    </form>
  );
}
