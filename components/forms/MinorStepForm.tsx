"use client";

/**
 * "Which minor are you taking?": a fieldset of radio options, one per
 * `Minor`, each showing the minor's name and its three required courses so a
 * student can recognise theirs on sight. Modelled on `RightsWhatForm.tsx`,
 * which solves the same problem for `content/privacy/register.ts`'s
 * `DataRight` list.
 *
 * There is deliberately no "not sure" option here. Every minor course is
 * pooled under the catalogue category `"minor"`; only pairing it with a
 * chosen minor tells the service whether a course is one of the 9 required
 * credits, one of the 6 electives within the minor, or one of the 6
 * electives from another minor (`resolveMinorCategory`). Skipping this
 * question would leave 21 credits silently uncounted.
 */
import { useActionState, useId } from "react";
import Button from "@/components/Button";
import ErrorSummary from "@/components/ErrorSummary";
import type { Minor } from "@/content/curriculum";
import type { Locale } from "@/lib/i18n";
import type { QuestionStepState } from "./QuestionStepForm";

export type MinorStepFormProps = {
  locale: Locale;
  minors: Minor[];
  /** Course code to title, for the required-courses line under each minor. */
  courseTitles: Map<string, string>;
  defaultValue?: string;
  action: (prevState: QuestionStepState, formData: FormData) => Promise<QuestionStepState>;
  legend: string;
  requiredCoursesLabel: string;
  requiredLabel: string;
  errorSummaryTitle: string;
  continueLabel: string;
  continuingLabel: string;
};

const initialState: QuestionStepState = { status: "idle" };

export default function MinorStepForm({
  locale,
  minors,
  courseTitles,
  defaultValue,
  action,
  legend,
  requiredCoursesLabel,
  requiredLabel,
  errorSummaryTitle,
  continueLabel,
  continuingLabel,
}: MinorStepFormProps) {
  const formId = useId();
  const [state, formAction, isPending] = useActionState(action, initialState);
  const groupId = `${formId}-minor`;
  const hasError = state.status === "invalid" && Boolean(state.error);
  const firstOptionId = `${groupId}-${minors[0]?.id ?? "option"}`;

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      <ErrorSummary
        title={errorSummaryTitle}
        errors={hasError ? [{ id: firstOptionId, message: state.error as string }] : []}
      />

      <fieldset
        className="flex flex-col gap-4"
        aria-describedby={hasError ? `${groupId}-error` : undefined}
      >
        <legend className="sr-only">
          {legend} ({requiredLabel})
        </legend>

        {hasError ? (
          <p id={`${groupId}-error`} className="text-error flex items-center gap-1.5 text-sm font-medium">
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0">
              <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth={1.75} />
              <path d="M10 6.5v4.2" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
              <circle cx="10" cy="13.6" r="0.9" fill="currentColor" />
            </svg>
            {state.error}
          </p>
        ) : null}

        <div className="flex flex-col gap-3">
          {minors.map((minor) => (
            <label
              key={minor.id}
              htmlFor={`${groupId}-${minor.id}`}
              className="border-input-border bg-surface has-checked:border-brand has-checked:bg-brand-tint focus-within:border-brand flex cursor-pointer items-start gap-3 rounded-lg border p-4"
            >
              <input
                id={`${groupId}-${minor.id}`}
                type="radio"
                name="minor"
                value={minor.id}
                required
                defaultChecked={defaultValue === minor.id}
                className="focus-halo border-input-border accent-brand mt-0.5 h-5 w-5 shrink-0"
              />
              <span className="flex flex-col gap-1">
                <span className="text-ink font-semibold">{minor.name[locale]}</span>
                <span className="text-muted text-sm">
                  {requiredCoursesLabel}:{" "}
                  {minor.required
                    .map((code) => `${code}${courseTitles.has(code) ? ` ${courseTitles.get(code)}` : ""}`)
                    .join(", ")}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

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
