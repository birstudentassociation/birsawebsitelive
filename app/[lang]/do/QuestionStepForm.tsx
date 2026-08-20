"use client";

import { useActionState } from "react";

import Button from "@/components/bds/Button";
import ErrorSummary from "@/components/bds/ErrorSummary";
import TextInput from "@/components/bds/TextInput";
import Textarea from "@/components/bds/Textarea";
import CharacterCount, { type CharacterCountLabels } from "@/components/bds/CharacterCount";
import Radios from "@/components/bds/Radios";
import Checkboxes from "@/components/bds/Checkboxes";
import DateInput from "@/components/bds/DateInput";
import DateRangeInput from "@/components/bds/DateRangeInput";
import FileUpload from "@/components/bds/FileUpload";
import { Stack } from "@/components/bds/Layout";
import type { Locale } from "@/lib/i18n";
import type { Question } from "@/lib/services/questionTypes";
import { splitDateRange, type AnswerValue } from "@/lib/services/validate";
import type { QuestionStepState } from "@/app/[lang]/do/actions";

/**
 * Renders ONE question, through the Wave 2 `bds/` form components, driven
 * entirely by `question.type` (`lib/services/questionTypes.ts`). This is the
 * one place in the chassis that maps a question type to a component; adding
 * a twelfth question type means adding a `case` here, which is exactly the
 * "new question type is code" boundary that file's own header describes,
 * not something this component decides on its own.
 *
 * A REAL FORM, NOT A CLIENT VALIDATION LAYER. `useActionState` still renders
 * a genuine `<form action>` (BUILD-BRIEF-2.0 §7): with JavaScript off, a
 * submit is an ordinary POST to the bound server action and the page
 * receives the redirect or the error exactly as `action()` returns it; with
 * JavaScript on, the same server action runs without a full navigation and
 * `isPending` drives the button's `continuing` label. Every field this
 * component renders comes from `components/bds/`, so the accessibility
 * wiring (labels, hints, `aria-describedby`, the error/summary pairing) is
 * inherited, not reimplemented.
 */
export type QuestionStepFormLabels = {
  continueLabel: string;
  continuing: string;
  errorSummaryTitle: string;
  required: string;
  optional: string;
  field: { day: string; month: string; year: string; from: string; to: string };
  yes: string;
  no: string;
  characterCount: CharacterCountLabels;
};

export type QuestionStepFormProps = {
  action: (prevState: QuestionStepState, formData: FormData) => Promise<QuestionStepState>;
  question: Question;
  locale: Locale;
  defaultValue?: AnswerValue;
  labels: QuestionStepFormLabels;
};

function splitIso(iso: string | undefined): { day?: string; month?: string; year?: string } {
  if (!iso) return {};
  const [year, month, day] = iso.split("-");
  return { day, month, year };
}

export default function QuestionStepForm({
  action,
  question,
  locale,
  defaultValue,
  labels,
}: QuestionStepFormProps) {
  const [state, formAction, isPending] = useActionState<QuestionStepState, FormData>(action, {
    status: "idle",
  });

  const error = state.status === "invalid" ? state.error : undefined;
  const errors = error ? [{ id: question.id, message: error }] : [];

  return (
    <form action={formAction} noValidate>
      <Stack gap="lg">
        <ErrorSummary title={labels.errorSummaryTitle} errors={errors} />
        {renderField(question, locale, defaultValue, error, labels)}
        <div>
          <Button type="submit" disabled={isPending}>
            {isPending ? labels.continuing : labels.continueLabel}
          </Button>
        </div>
      </Stack>
    </form>
  );
}

function renderField(
  question: Question,
  locale: Locale,
  defaultValue: AnswerValue | undefined,
  error: string | undefined,
  labels: QuestionStepFormLabels
) {
  const common = {
    name: question.id,
    id: question.id,
    label: question.label[locale],
    hint: question.hint?.[locale],
    error,
    required: question.required,
    requiredLabel: labels.required,
    optionalLabel: labels.optional,
  };

  const single = typeof defaultValue === "string" ? defaultValue : undefined;

  switch (question.type) {
    case "short-text":
    case "student-id":
      return <TextInput {...common} type="text" defaultValue={single} />;

    case "email":
      return <TextInput {...common} type="email" defaultValue={single} autoComplete="email" />;

    case "phone":
      return <TextInput {...common} type="tel" defaultValue={single} autoComplete="tel" />;

    case "long-text":
      // §6.7's own words for this type: "Length, with a character count
      // component." `CharacterCount` only when there is a limit worth
      // showing (its own usage rule: a counter nobody will ever reach is
      // noise), matching `Textarea`'s file header on the same split.
      return question.maxLength ? (
        <CharacterCount
          {...common}
          defaultValue={single}
          maxLength={question.maxLength}
          labels={labels.characterCount}
        />
      ) : (
        <Textarea {...common} defaultValue={single} />
      );

    case "date":
      return (
        <DateInput
          name={question.id}
          id={question.id}
          legend={question.label[locale]}
          hint={question.hint?.[locale]}
          error={error}
          required={question.required}
          requiredLabel={labels.required}
          optionalLabel={labels.optional}
          labels={labels.field}
          defaultValue={splitIso(single)}
        />
      );

    case "date-range": {
      const range = single ? splitDateRange(single) : null;
      return (
        <DateRangeInput
          name={question.id}
          id={question.id}
          fromLegend={`${question.label[locale]} (${labels.field.from})`}
          toLegend={`${question.label[locale]} (${labels.field.to})`}
          hint={question.hint?.[locale]}
          fromError={error}
          required={question.required}
          requiredLabel={labels.required}
          optionalLabel={labels.optional}
          labels={labels.field}
          fromDefaultValue={splitIso(range?.from)}
          toDefaultValue={splitIso(range?.to)}
        />
      );
    }

    case "choose-one":
      return (
        <Radios
          name={question.id}
          id={question.id}
          legend={question.label[locale]}
          hint={question.hint?.[locale]}
          error={error}
          required={question.required}
          requiredLabel={labels.required}
          optionalLabel={labels.optional}
          options={(question.options ?? []).map((o) => ({
            value: o.value,
            label: o.label[locale],
          }))}
          defaultValue={single}
        />
      );

    case "yes-no":
      return (
        <Radios
          name={question.id}
          id={question.id}
          legend={question.label[locale]}
          hint={question.hint?.[locale]}
          error={error}
          required={question.required}
          requiredLabel={labels.required}
          optionalLabel={labels.optional}
          options={[
            { value: "yes", label: labels.yes },
            { value: "no", label: labels.no },
          ]}
          defaultValue={single}
        />
      );

    case "choose-several":
      return (
        <Checkboxes
          name={question.id}
          id={question.id}
          legend={question.label[locale]}
          hint={question.hint?.[locale]}
          error={error}
          required={question.required}
          requiredLabel={labels.required}
          optionalLabel={labels.optional}
          options={(question.options ?? []).map((o) => ({
            value: o.value,
            label: o.label[locale],
          }))}
          defaultValue={Array.isArray(defaultValue) ? defaultValue : undefined}
        />
      );

    case "file-upload":
      return (
        <FileUpload
          name={question.id}
          id={question.id}
          label={question.label[locale]}
          hint={question.hint?.[locale]}
          error={error}
          required={question.required}
          requiredLabel={labels.required}
          optionalLabel={labels.optional}
        />
      );

    default:
      return null;
  }
}
