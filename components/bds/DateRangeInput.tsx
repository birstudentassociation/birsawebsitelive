"use client";

import clsx from "clsx";

import DateInput, { type DateInputLabels, type DateInputValue } from "@/components/bds/DateInput";
import { Stack } from "@/components/bds/Layout";
import { Text } from "@/components/bds/Type";

/**
 * BIRSA Design System: `DateRangeInput` (REDESIGN-2.0 `components/bds/manifest.ts`,
 * forms cluster, generalised from `components/equipment/DatesStepForm.tsx`).
 *
 * A from-and-to pair. Carries the loan date logic: the collection and return
 * dates in `lib/services/questionTypes.ts`'s `date-range` question type
 * render through this. Anything else needing two unrelated dates uses two
 * separate `DateInput`s rather than this component, which exists
 * specifically for a pair that answers one question ("when do you need it").
 *
 * The actual range validation (return not before collection, not in the
 * past, within the maximum loan length) is business logic that belongs to
 * the equipment loan service, not to this system component: this renders
 * the two `DateInput` groups and their own errors, and leaves the
 * cross-field check to the caller, exactly as `DatesStepForm.tsx` already
 * validated the pair server-side rather than in the field itself.
 */
export type DateRangeInputProps = {
  /** Base name. Produces `${name}-from-*` and `${name}-to-*` field names. */
  name: string;
  fromLegend: string;
  toLegend: string;
  /** Shown once, above both date groups, for guidance that applies to the whole range. */
  hint?: string;
  fromError?: string;
  toError?: string;
  labels: DateInputLabels;
  fromDefaultValue?: DateInputValue;
  toDefaultValue?: DateInputValue;
  required?: boolean;
  requiredLabel?: string;
  optionalLabel?: string;
  id?: string;
  className?: string;
};

export default function DateRangeInput({
  name,
  fromLegend,
  toLegend,
  hint,
  fromError,
  toError,
  labels,
  fromDefaultValue,
  toDefaultValue,
  required,
  requiredLabel,
  optionalLabel,
  id,
  className,
}: DateRangeInputProps) {
  const baseId = id ?? name;
  const hintId = hint ? `${baseId}-hint` : undefined;

  return (
    <div role="group" aria-describedby={hintId} className={clsx("flex flex-col gap-4", className)}>
      {hint ? (
        <p id={hintId}>
          <Text as="span" step="body-sm" className="text-muted">
            {hint}
          </Text>
        </p>
      ) : null}
      <Stack gap="lg">
        <DateInput
          id={`${baseId}-from`}
          name={`${name}-from`}
          legend={fromLegend}
          error={fromError}
          labels={labels}
          defaultValue={fromDefaultValue}
          required={required}
          requiredLabel={requiredLabel}
          optionalLabel={optionalLabel}
        />
        <DateInput
          id={`${baseId}-to`}
          name={`${name}-to`}
          legend={toLegend}
          error={toError}
          labels={labels}
          defaultValue={toDefaultValue}
          required={required}
          requiredLabel={requiredLabel}
          optionalLabel={optionalLabel}
        />
      </Stack>
    </div>
  );
}
