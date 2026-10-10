"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import clsx from "clsx";
import Field from "@/components/Field";
import ErrorSummary, { type ErrorSummaryItem } from "@/components/ErrorSummary";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import CollectionNotice from "@/components/forms/CollectionNotice";
import { fillTemplate } from "@/components/course-review/constants";
import { reviewFormCopy } from "@/components/course-review/reviewFormCopy";
import type { ReviewFormState } from "@/app/[lang]/student-life/course-reviews/[code]/review/actions";
import { WORKLOAD_BANDS } from "@/lib/course-review/workload";
import type { ReviewField } from "@/lib/course-review/submit";
import { COURSE_REVIEW_LIMITS } from "@/lib/validation";
import type { Locale } from "@/lib/i18n";

export type ReviewFormProps = {
  locale: Locale;
  /** The course the review is for, e.g. "PI280". Posted as a hidden field. */
  code: string;
  /** Terms the form offers, newest first, with labels already in the reader's language. */
  terms: { value: string; label: string }[];
  /** The course's instructors, with labels already in the reader's language. "Someone else" is added here. */
  instructors: { value: string; label: string }[];
  /** The value of the "someone else" option. */
  otherInstructor: string;
  action: (prevState: ReviewFormState, formData: FormData) => Promise<ReviewFormState>;
};

const initialState: ReviewFormState = { status: "idle" };

const TIP_NUMBERS = [1, 2, 3] as const;

/**
 * The course review form: term, instructor, workload in words with an optional
 * hours-a-week band, assessment, up to three tips and an optional quote.
 * Posts to the `submitReviewAction` server action, so it works with HTML alone
 * (a plain form POST re-renders the page with the result, and a successful one
 * redirects to the confirmation page); `useActionState` progressively enhances
 * it with an inline error summary and focus management, exactly like
 * components/feedback/FeedbackForm.tsx.
 *
 * Asks for no name, student ID or email address. The honeypot field and the
 * server-side rate limit are the bot check.
 */
export default function ReviewForm({
  locale,
  code,
  terms,
  instructors,
  otherInstructor,
  action,
}: ReviewFormProps) {
  const t = reviewFormCopy[locale];
  const formId = useId();
  const [state, formAction, isPending] = useActionState(action, initialState);
  const resultRef = useRef<HTMLDivElement>(null);

  // On a terminal (non-retryable) state, the top notice becomes the first
  // thing on the page worth announcing; move focus there so keyboard and
  // screen-reader users aren't left on a stale submit button (2.4.3).
  useEffect(() => {
    if (
      state.status === "not-configured" ||
      state.status === "error" ||
      state.status === "rate-limited"
    ) {
      resultRef.current?.focus();
    }
  }, [state.status]);

  const ids = {
    term: `${formId}-term`,
    instructor: `${formId}-instructor`,
    workload: `${formId}-workload`,
    workloadBand: `${formId}-band-${WORKLOAD_BANDS[0]}`,
    assessment: `${formId}-assessment`,
    tips: `${formId}-tip1`,
    quote: `${formId}-quote`,
  } satisfies Record<ReviewField, string>;

  const values = state.status === "idle" ? undefined : state.values;
  const errors = state.status === "invalid" ? state.errors : undefined;

  const limits: Record<ReviewField, number> = {
    term: 0,
    instructor: 0,
    workload: COURSE_REVIEW_LIMITS.workload,
    workloadBand: 0,
    assessment: COURSE_REVIEW_LIMITS.assessment,
    tips: COURSE_REVIEW_LIMITS.tip,
    quote: COURSE_REVIEW_LIMITS.quote,
  };
  const messageFor = (field: ReviewField): string | undefined => {
    const errorCode = errors?.[field];
    if (!errorCode) return undefined;
    const template = t.errors[field][errorCode];
    return template ? fillTemplate(template, { max: limits[field] }) : t.errorBody;
  };

  const errorItems: ErrorSummaryItem[] = (Object.keys(ids) as ReviewField[])
    .map((field) => ({ id: ids[field], message: messageFor(field) }))
    .filter((item): item is ErrorSummaryItem => Boolean(item.message));

  const termOptions = [{ value: "", label: t.termPlaceholder }, ...terms];
  // With no named instructors the only honest answer is "someone else", so
  // there is nothing to choose and no placeholder to show.
  const instructorOptions = [
    ...(instructors.length > 0 ? [{ value: "", label: t.instructorPlaceholder }] : []),
    ...instructors,
    { value: otherInstructor, label: t.instructorOther },
  ];
  const instructorDefault = values?.instructor ?? (instructors.length === 0 ? otherInstructor : "");

  const statusNotice =
    state.status === "not-configured"
      ? { variant: "warning" as const, title: t.notConfiguredTitle, body: t.notConfiguredBody }
      : state.status === "rate-limited"
        ? { variant: "warning" as const, title: t.rateLimitedTitle, body: t.rateLimitedBody }
        : state.status === "error"
          ? { variant: "error" as const, title: t.errorTitle, body: t.errorBody }
          : null;

  return (
    <form action={formAction} noValidate className="flex flex-col gap-7">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="code" value={code} />

      <ErrorSummary title={t.errorSummaryTitle} errors={errorItems} />

      {statusNotice ? (
        <div ref={resultRef} tabIndex={-1} className="focus-halo">
          <Notice variant={statusNotice.variant} title={statusNotice.title}>
            {statusNotice.body}
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

      <Field
        id={ids.term}
        name="term"
        as="select"
        label={t.termLabel}
        hint={t.termHint}
        requiredLabel={t.requiredLabel}
        required
        options={termOptions}
        defaultValue={values?.term ?? ""}
        error={messageFor("term")}
      />

      <Field
        id={ids.instructor}
        name="instructor"
        as="select"
        label={t.instructorLabel}
        hint={t.instructorHint}
        requiredLabel={t.requiredLabel}
        required
        options={instructorOptions}
        defaultValue={instructorDefault}
        error={messageFor("instructor")}
      />

      <Field
        id={ids.workload}
        name="workload"
        as="textarea"
        label={t.workloadLabel}
        hint={`${t.workloadHint} ${fillTemplate(t.charactersHint, { max: COURSE_REVIEW_LIMITS.workload })}`}
        requiredLabel={t.requiredLabel}
        required
        defaultValue={values?.workload}
        error={messageFor("workload")}
        rows={5}
        maxLength={COURSE_REVIEW_LIMITS.workload}
      />

      <fieldset
        className="flex flex-col gap-3"
        aria-describedby={errors?.workloadBand ? `${ids.workloadBand}-error` : undefined}
      >
        <legend className="text-sm font-semibold text-ink">
          {t.bandLegend}
          <span className="ml-1.5 font-normal text-muted">({t.optionalLabel})</span>
        </legend>
        <p className="text-sm text-muted">{t.bandHint}</p>
        {errors?.workloadBand ? (
          <p id={`${ids.workloadBand}-error`} className="text-sm font-medium text-error">
            {messageFor("workloadBand")}
          </p>
        ) : null}
        <div className="flex flex-col gap-3">
          {[...WORKLOAD_BANDS, "" as const].map((band) => (
            <label
              key={band || "none"}
              htmlFor={band ? `${formId}-band-${band}` : `${formId}-band-none`}
              className={clsx(
                "border-input-border bg-surface has-checked:border-brand has-checked:bg-brand-tint",
                "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border p-4 focus-within:border-brand"
              )}
            >
              <input
                id={band ? `${formId}-band-${band}` : `${formId}-band-none`}
                type="radio"
                name="workloadBand"
                value={band}
                defaultChecked={(values?.workloadBand ?? "") === band}
                className="focus-halo h-5 w-5 shrink-0 border-input-border accent-brand"
              />
              <span className="font-semibold text-ink">
                {band ? t.bandLabels[band] : t.bandNone}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field
        id={ids.assessment}
        name="assessment"
        as="textarea"
        label={t.assessmentLabel}
        hint={`${t.assessmentHint} ${fillTemplate(t.charactersHint, { max: COURSE_REVIEW_LIMITS.assessment })}`}
        requiredLabel={t.requiredLabel}
        required
        defaultValue={values?.assessment}
        error={messageFor("assessment")}
        rows={5}
        maxLength={COURSE_REVIEW_LIMITS.assessment}
      />

      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-semibold text-ink">
          {t.tipsLegend}
          <span className="ml-1.5 font-normal text-muted">({t.optionalLabel})</span>
        </legend>
        <p className="text-sm text-muted">{t.tipsHint}</p>
        {TIP_NUMBERS.map((n) => (
          <Field
            key={n}
            id={`${formId}-tip${n}`}
            name={`tip${n}`}
            label={fillTemplate(t.tipLabel, { n })}
            defaultValue={values?.tips[n - 1]}
            error={n === 1 ? messageFor("tips") : undefined}
            maxLength={COURSE_REVIEW_LIMITS.tip}
          />
        ))}
      </fieldset>

      <Field
        id={ids.quote}
        name="quote"
        as="textarea"
        label={t.quoteLabel}
        hint={`${t.quoteHint} ${fillTemplate(t.charactersHint, { max: COURSE_REVIEW_LIMITS.quote })}`}
        optionalLabel={t.optionalLabel}
        defaultValue={values?.quote}
        error={messageFor("quote")}
        rows={3}
        maxLength={COURSE_REVIEW_LIMITS.quote}
      />

      <div className="flex flex-col gap-1.5">
        <p className="text-sm text-muted">{t.privacyWarning}</p>
        <CollectionNotice activityId="course-review" locale={locale} />
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
