"use client";

import { useId } from "react";

import Fieldset from "@/components/bds/Fieldset";
import { Text } from "@/components/bds/Type";

/**
 * BIRSA Design System: `Radios` (REDESIGN-2.0 `components/bds/manifest.ts`,
 * forms cluster, split from `components/Field.tsx`).
 *
 * Pick exactly one from a set you can show. Use `Select` past about eight
 * options and only when the list is familiar, like a country. One checkbox
 * alone is a yes-or-no question and belongs in `Radios`, not `Checkboxes`:
 * this is what `lib/services/questionTypes.ts`'s `yes-no` question type
 * renders through.
 *
 * Renders its own `Fieldset`, so the hint and error sit on the group rather
 * than on any one radio (a group either passed validation or it did not; no
 * single option is "the invalid one"). Each option's own text is its
 * `<label>`, which extends the clickable area beyond the 20px input to a
 * 44px-tall row, meeting BUILD-BRIEF-2.0 section 7's target size floor
 * without a fixed-size input.
 */
export type RadiosOption = {
  value: string;
  label: string;
  /** A short line under the option, for a choice that needs one more sentence to tell apart from its neighbours. */
  hint?: string;
};

export type RadiosBaseProps = {
  name: string;
  legend: string;
  hint?: string;
  error?: string;
  options: RadiosOption[];
  required?: boolean;
  requiredLabel?: string;
  optionalLabel?: string;
  id?: string;
  className?: string;
};

/** Controlled: `value` and `onChange` together. */
export type RadiosControlled = RadiosBaseProps & {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: undefined;
};

/** Uncontrolled: an optional starting value, no `onChange` required, exactly what a no-JavaScript form needs. */
export type RadiosUncontrolled = RadiosBaseProps & {
  value?: undefined;
  onChange?: undefined;
  defaultValue?: string;
};

export type RadiosProps = RadiosControlled | RadiosUncontrolled;

export default function Radios(props: RadiosProps) {
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
            ? { checked: value === option.value, onChange: () => onChange(option.value) }
            : { defaultChecked: defaultValue === option.value };
        return (
          <div key={option.value} className="flex items-start gap-3">
            <input
              type="radio"
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
