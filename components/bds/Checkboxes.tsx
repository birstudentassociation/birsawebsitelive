"use client";

import { useId } from "react";

import Fieldset from "@/components/bds/Fieldset";
import { Text } from "@/components/bds/Type";

/**
 * BIRSA Design System: `Checkboxes` (REDESIGN-2.0 `components/bds/manifest.ts`,
 * forms cluster, split from `components/Field.tsx`).
 *
 * Pick any number, including none: `lib/services/questionTypes.ts`'s
 * `choose-several` question type. One checkbox alone is a yes-or-no question:
 * use `Radios` for that instead of a single checkbox standing in for it.
 *
 * Every option shares `name`, so a plain HTML form submits them as repeated
 * fields under one name and `formData.getAll(name)` reads the selection with
 * no JavaScript involved. Renders its own `Fieldset`, for the same reason
 * `Radios` does: the hint, error and `aria-invalid` describe the group.
 */
export type CheckboxesOption = {
  value: string;
  label: string;
  hint?: string;
};

export type CheckboxesBaseProps = {
  name: string;
  legend: string;
  hint?: string;
  error?: string;
  options: CheckboxesOption[];
  required?: boolean;
  requiredLabel?: string;
  optionalLabel?: string;
  id?: string;
  className?: string;
};

/** Controlled: `value` and `onChange` together. */
export type CheckboxesControlled = CheckboxesBaseProps & {
  value: string[];
  onChange: (values: string[]) => void;
  defaultValue?: undefined;
};

/** Uncontrolled: an optional starting selection, no `onChange` required, exactly what a no-JavaScript form needs. */
export type CheckboxesUncontrolled = CheckboxesBaseProps & {
  value?: undefined;
  onChange?: undefined;
  defaultValue?: string[];
};

export type CheckboxesProps = CheckboxesControlled | CheckboxesUncontrolled;

function toggled(current: string[], value: string): string[] {
  return current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
}

export default function Checkboxes(props: CheckboxesProps) {
  const {
    name,
    legend,
    hint,
    error,
    options,
    value,
    defaultValue,
    onChange,
    required,
    requiredLabel,
    optionalLabel,
    id,
    className,
  } = props;

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
      {options.map((option, index) => {
        const optionId = `${groupId}-${index}`;
        const controlledProps =
          value !== undefined
            ? {
                checked: value.includes(option.value),
                onChange: () => onChange(toggled(value, option.value)),
              }
            : { defaultChecked: defaultValue?.includes(option.value) };
        return (
          <div key={option.value} className="flex items-start gap-3">
            <input
              type="checkbox"
              id={optionId}
              name={name}
              value={option.value}
              className="focus-halo mt-2.5 h-5 w-5 shrink-0 accent-brand"
              {...controlledProps}
            />
            <label
              htmlFor={optionId}
              className="flex min-h-11 flex-col justify-center gap-0.5 py-1.5"
            >
              <Text as="span" step="body">
                {option.label}
              </Text>
              {option.hint ? (
                <Text as="span" step="body-sm" className="text-muted">
                  {option.hint}
                </Text>
              ) : null}
            </label>
          </div>
        );
      })}
    </Fieldset>
  );
}
