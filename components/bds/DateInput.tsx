"use client";

import { useId } from "react";
import clsx from "clsx";

import Fieldset from "@/components/bds/Fieldset";
import { Text } from "@/components/bds/Type";

/**
 * BIRSA Design System: `DateInput` (REDESIGN-2.0 `components/bds/manifest.ts`,
 * forms cluster, generalised from `components/equipment/DatesStepForm.tsx`).
 *
 * One date the reader already knows, as three separate fields: day, month,
 * year. Never a date picker, per the manifest usage rule: a picker is worse
 * for a date somebody already knows, like a birthday, than three small
 * numeric boxes they can type straight into. This is a deliberate change
 * from 1.0's `DatesStepForm.tsx`, which used a native `type="date"` control;
 * REDESIGN-2.0 section 4.3b reads the GDS `dates` pattern and the day, month,
 * year layout is what it recommends. `lib/services/questionTypes.ts`'s
 * `date` question type renders through this.
 *
 * Renders its own `Fieldset`: the hint, error and `aria-invalid` describe
 * the group of three fields together, not any one of them, matching how
 * `Radios` and `Checkboxes` treat their own groups.
 */
export type DateInputLabels = {
  day: string;
  month: string;
  year: string;
};

export type DateInputValue = {
  day?: string;
  month?: string;
  year?: string;
};

export type DateInputProps = {
  /** Base name. Produces `${name}-day`, `${name}-month`, `${name}-year` field names. */
  name: string;
  legend: string;
  hint?: string;
  error?: string;
  labels: DateInputLabels;
  defaultValue?: DateInputValue;
  required?: boolean;
  requiredLabel?: string;
  optionalLabel?: string;
  id?: string;
  className?: string;
};

const parts = [
  { key: "day" as const, width: "w-16", digits: 2 },
  { key: "month" as const, width: "w-16", digits: 2 },
  { key: "year" as const, width: "w-24", digits: 4 },
];

export default function DateInput({
  name,
  legend,
  hint,
  error,
  labels,
  defaultValue,
  required,
  requiredLabel,
  optionalLabel,
  id,
  className,
}: DateInputProps) {
  const autoId = useId();
  const groupId = id ?? `${name}-${autoId}`;

  return (
    <Fieldset
      id={groupId}
      legend={legend}
      hint={hint}
      error={error}
      required={required}
      requiredLabel={requiredLabel}
      optionalLabel={optionalLabel}
      className={className}
    >
      <div className="flex gap-4">
        {parts.map((part) => {
          const partId = `${groupId}-${part.key}`;
          return (
            <div key={part.key} className="flex flex-col gap-1.5">
              <label htmlFor={partId}>
                <Text as="span" step="body-sm" className="font-semibold text-ink">
                  {labels[part.key]}
                </Text>
              </label>
              <input
                id={partId}
                name={`${name}-${part.key}`}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={part.digits}
                defaultValue={defaultValue?.[part.key]}
                aria-invalid={error ? "true" : undefined}
                className={clsx(
                  "focus-halo text-body h-11 rounded-md border bg-surface px-3 text-center text-ink",
                  part.width,
                  error ? "border-error" : "border-input-border"
                )}
              />
            </div>
          );
        })}
      </div>
    </Fieldset>
  );
}
