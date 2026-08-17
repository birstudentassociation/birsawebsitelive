"use client";

/**
 * "Check what we have assumed": a checkbox per assumed-passed course, grouped
 * by term, all checked by default, plus one number input for free elective
 * credits. Ticking forty boxes to build a plan from scratch is miserable, so
 * this screen assumes the student followed the recommended plan up to where
 * they say they are and asks them to correct it, which is normally two or
 * three unchecks rather than forty ticks.
 *
 * Free elective credits get their own field rather than checkboxes because a
 * free elective may be any Thammasat University course: there is no
 * catalogue entry to tick, only a count to confirm.
 */
import { useActionState } from "react";
import Button from "@/components/Button";
import ErrorSummary from "@/components/ErrorSummary";
import { PLAN_FIELD } from "@/lib/study-plan/plan";
import type { QuestionStepState } from "./QuestionStepForm";

export type AssumedCourseGroup = {
  termLabel: string;
  courses: { code: string; title: string }[];
};

export type AssumedStepFormProps = {
  action: (prevState: QuestionStepState, formData: FormData) => Promise<QuestionStepState>;
  /** The plan as it stood on arrival at this step, carried forward in a hidden field. */
  plan: string;
  groups: AssumedCourseGroup[];
  freeElectiveLabel: string;
  freeElectiveHint: string;
  freeElectiveDefault: number;
  errorSummaryTitle: string;
  continueLabel: string;
  continuingLabel: string;
};

const initialState: QuestionStepState = { status: "idle" };

export default function AssumedStepForm({
  action,
  plan,
  groups,
  freeElectiveLabel,
  freeElectiveHint,
  freeElectiveDefault,
  errorSummaryTitle,
  continueLabel,
  continuingLabel,
}: AssumedStepFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const hasError = state.status === "invalid" && Boolean(state.error);
  const freeElectiveFieldId = "free-elective-credits";

  return (
    <form action={formAction} noValidate className="flex flex-col gap-8">
      <ErrorSummary
        title={errorSummaryTitle}
        errors={hasError ? [{ id: freeElectiveFieldId, message: state.error as string }] : []}
      />
      <input type="hidden" name={PLAN_FIELD} value={plan} />

      <div className="flex flex-col gap-6">
        {groups.map((group) => (
          <fieldset key={group.termLabel}>
            {/* The heading already states the term visually; wrapping it in
                <legend> (as app/[lang]/answers/you/page.tsx does) is what
                actually announces the grouping to screen reader users, who
                otherwise lose which term a checkbox belongs to as soon as
                they move past its heading. */}
            <legend>
              <h2 className="font-display text-lg">{group.termLabel}</h2>
            </legend>
            <div className="flex flex-col gap-2">
              {group.courses.map((course) => (
                <label
                  key={course.code}
                  className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-input-border bg-surface p-3 has-checked:border-brand has-checked:bg-brand-tint"
                >
                  <input
                    type="checkbox"
                    name="passed"
                    value={course.code}
                    defaultChecked
                    className="focus-halo h-5 w-5 shrink-0 border-input-border accent-brand"
                  />
                  <span className="text-sm text-ink">
                    <span className="font-semibold">{course.code}</span>
                    {course.title ? ` ${course.title}` : ""}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={freeElectiveFieldId} className="text-sm font-semibold text-ink">
          {freeElectiveLabel}
        </label>
        <p className="text-sm text-muted">{freeElectiveHint}</p>
        <input
          id={freeElectiveFieldId}
          name="freeElectiveCreditsPassed"
          type="number"
          min={0}
          max={60}
          defaultValue={freeElectiveDefault}
          aria-invalid={hasError ? "true" : undefined}
          className="focus-halo w-32 rounded-md border border-input-border bg-surface px-3.5 py-2.5 text-[0.95rem] text-ink"
        />
        {hasError ? (
          <p className="flex items-center gap-1.5 text-sm font-medium text-error">
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
            {state.error}
          </p>
        ) : null}
      </div>

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? continuingLabel : continueLabel}
        </Button>
        {isPending ? (
          <span role="status" className="sr-only">
            {continuingLabel}
          </span>
        ) : null}
      </div>
    </form>
  );
}
