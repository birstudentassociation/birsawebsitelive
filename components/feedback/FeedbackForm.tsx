"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import clsx from "clsx";
import Field from "@/components/Field";
import ErrorSummary, { type ErrorSummaryItem } from "@/components/ErrorSummary";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import CollectionNotice from "@/components/forms/CollectionNotice";
import type { FeedbackState } from "@/app/[lang]/feedback/actions";
import { feedbackCopy, RATING_ORDER } from "@/components/feedback/feedbackCopy";
import type { Locale } from "@/lib/i18n";

export type FeedbackFormProps = {
  locale: Locale;
  /**
   * The page or journey this feedback is about, e.g. "/en/answers/registration/outcome"
   * or "/en/contact/sent". Stored as-is (query strings and fragments are
   * stripped server-side); never render this back to the reader as part of
   * a URL or page title (Service Manual: don't put user-identifying detail
   * in a URL or H1 - not a risk here since it's a fixed page path, but the
   * value must still never be attacker-controlled free text).
   */
  sourcePath: string;
  /** Overrides the default fieldset legend, e.g. "What did you think of getting an answer?" */
  heading?: string;
  action: (prevState: FeedbackState, formData: FormData) => Promise<FeedbackState>;
};

const initialState: FeedbackState = { status: "idle" };

/**
 * GOV.UK-style satisfaction feedback form: five ordered radio options plus an
 * optional comment. Posts to the `submitFeedbackAction` server action, so it
 * works with HTML alone (a plain form POST re-renders this page with the
 * result); `useActionState` progressively enhances it with an inline error
 * summary and focus management, exactly like components/forms/ContactForm.tsx.
 *
 * Unlike components/equipment/LoanRequestWizard.tsx, there is no separate
 * "enhanced" gate here: this is a single-page form (no multi-step wizard UI to
 * swap in once JS loads), so the same markup already works before and after
 * hydration, and `useActionState`'s form is itself the no-JS fallback.
 *
 * On success the action redirects to `/[lang]/feedback/sent`, so this
 * component never needs to render a "success" state itself.
 */
export default function FeedbackForm({ locale, sourcePath, heading, action }: FeedbackFormProps) {
  const t = feedbackCopy[locale];
  const formId = useId();
  const [state, formAction, isPending] = useActionState(action, initialState);
  const resultRef = useRef<HTMLDivElement>(null);

  // On a terminal (non-retryable) state, the top notice becomes the first
  // thing on the page worth announcing; move focus there so keyboard and
  // screen-reader users aren't left on a stale submit button (2.4.3).
  useEffect(() => {
    if (state.status === "not-configured" || state.status === "error") {
      resultRef.current?.focus();
    }
  }, [state.status]);

  const fieldIds = {
    rating: `${formId}-rating`,
    comment: `${formId}-comment`,
  };

  const values = state.status === "invalid" ? state.values : undefined;
  const errors = state.status === "invalid" ? state.errors : undefined;

  const errorItems: ErrorSummaryItem[] = Object.entries(errors ?? {})
    .filter(([, message]) => Boolean(message))
    .map(([key, message]) => ({
      id: key === "rating" ? `${fieldIds.rating}-very_satisfied` : fieldIds.comment,
      message: message as string,
    }));

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="path" value={sourcePath} />

      <ErrorSummary title={t.errorSummaryTitle} errors={errorItems} />

      {state.status === "not-configured" ? (
        <div ref={resultRef} tabIndex={-1} className="focus-halo">
          <Notice variant="warning" title={t.notConfiguredTitle}>
            {t.notConfiguredBody}
          </Notice>
        </div>
      ) : null}

      {state.status === "error" ? (
        <div ref={resultRef} tabIndex={-1} className="focus-halo">
          <Notice variant="error" title={t.errorTitle}>
            {t.errorBody}
          </Notice>
        </div>
      ) : null}

      {/* Honeypot: real visitors never see or fill this field. Visually
          hidden, not display:none, so assistive tech that ignores CSS still
          gets an explicit instruction rather than a trap. */}
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

      <fieldset
        className="flex flex-col gap-4"
        aria-describedby={errors?.rating ? `${fieldIds.rating}-error` : undefined}
      >
        <legend className="font-display text-xl text-ink">
          {heading ?? t.defaultHeading}
          <span className="ml-1.5 text-sm font-normal text-muted">({t.requiredLabel})</span>
        </legend>
        <p className="sr-only">{t.ratingGroupLabel}</p>

        {errors?.rating ? (
          <p
            id={`${fieldIds.rating}-error`}
            className="flex items-center gap-1.5 text-sm font-medium text-error"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0">
              <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth={1.75} />
              <path
                d="M10 6.5v4.2"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
              />
              <circle cx="10" cy="13.6" r="0.9" fill="currentColor" />
            </svg>
            {errors.rating}
          </p>
        ) : null}

        <div className="flex flex-col gap-3">
          {RATING_ORDER.map((rating) => (
            <label
              key={rating}
              htmlFor={`${fieldIds.rating}-${rating}`}
              className={clsx(
                "border-input-border bg-surface has-checked:border-brand has-checked:bg-brand-tint",
                "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border p-4 focus-within:border-brand"
              )}
            >
              <input
                id={`${fieldIds.rating}-${rating}`}
                type="radio"
                name="rating"
                value={rating}
                required
                defaultChecked={values?.rating === rating}
                className="focus-halo h-5 w-5 shrink-0 border-input-border accent-brand"
              />
              <span className="font-semibold text-ink">{t.ratingLabels[rating]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <Field
          id={fieldIds.comment}
          name="comment"
          as="textarea"
          label={t.commentLabel}
          hint={t.commentHint}
          optionalLabel={t.optionalLabel}
          defaultValue={values?.comment}
          error={errors?.comment}
          rows={5}
          maxLength={1200}
        />
        <p className="text-sm text-muted">{t.privacyWarning}</p>
        <CollectionNotice activityId="feedback" locale={locale} />
      </div>

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? t.submitting : t.submit}
        </Button>
        {isPending ? (
          <span role="status" className="sr-only">
            {t.submitting}
          </span>
        ) : null}
      </div>
    </form>
  );
}
