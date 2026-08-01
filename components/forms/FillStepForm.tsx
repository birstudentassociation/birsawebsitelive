"use client";

/**
 * One `<select>` per placeholder slot from the recommended plan ("Minor
 * required course 1", "Elective course in concentration (Area Studies Group)
 * 2"), each offering the courses that actually fit the slot plus an "I have
 * not taken this yet" option with an empty value. Roughly a third of the
 * published plan is slots rather than named courses, and only the student
 * knows what filled each one.
 *
 * Every select can legitimately be left on "not taken yet", so this form has
 * no field-level validation to fail; it still uses the same
 * `useActionState` shape as the rest of the journey so it degrades
 * identically without JavaScript and shares the same button/pending styling.
 */
import { useActionState } from "react";
import Field from "@/components/Field";
import Button from "@/components/Button";
import ErrorSummary from "@/components/ErrorSummary";
import { PLAN_FIELD } from "@/lib/study-plan/plan";
import type { QuestionStepState } from "./QuestionStepForm";

export type FillSlot = {
  id: string;
  label: string;
  options: { value: string; label: string }[];
};

export type FillStepFormProps = {
  action: (prevState: QuestionStepState, formData: FormData) => Promise<QuestionStepState>;
  /** The plan as it stood on arrival at this step, carried forward in a hidden field. */
  plan: string;
  slots: FillSlot[];
  errorSummaryTitle: string;
  continueLabel: string;
  continuingLabel: string;
};

const initialState: QuestionStepState = { status: "idle" };

export default function FillStepForm({
  action,
  plan,
  slots,
  errorSummaryTitle,
  continueLabel,
  continuingLabel,
}: FillStepFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const hasError = state.status === "invalid" && Boolean(state.error);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      <ErrorSummary
        title={errorSummaryTitle}
        errors={hasError ? [{ id: `slot-${slots[0]?.id ?? ""}`, message: state.error as string }] : []}
      />
      <input type="hidden" name={PLAN_FIELD} value={plan} />

      {slots.map((slot) => (
        <Field
          key={slot.id}
          id={`slot-${slot.id}`}
          name={`slot-${slot.id}`}
          as="select"
          label={slot.label}
          options={slot.options}
        />
      ))}

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
