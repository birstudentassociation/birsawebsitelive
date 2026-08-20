"use client";

import { useId } from "react";
import clsx from "clsx";

import FormField, { fieldDescribedBy } from "@/components/bds/FormField";

/**
 * BIRSA Design System: `Select` (REDESIGN-2.0 `components/bds/manifest.ts`,
 * forms cluster, split from `components/Field.tsx`).
 *
 * A long, familiar list where the reader knows what they are looking for,
 * such as a country. Prefer `Radios`: a select hides its options and is poor
 * on a phone. Reach for this only past about eight options where the list is
 * genuinely familiar; a short or unfamiliar list belongs in `Radios`, which
 * shows every option at once.
 */
export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  /** Renders as a disabled, hidden first option so the reader must choose deliberately rather than accept a default. */
  placeholder?: string;
  required?: boolean;
  requiredLabel?: string;
  optionalLabel?: string;
  id?: string;
  className?: string;
} & Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "id" | "name" | "required" | "className" | "children"
>;

export default function Select({
  name,
  label,
  hint,
  error,
  options,
  placeholder,
  required,
  requiredLabel,
  optionalLabel,
  id,
  className,
  ...rest
}: SelectProps) {
  const autoId = useId();
  const fieldId = id ?? `${name}-${autoId}`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = fieldDescribedBy(hintId, errorId);

  return (
    <FormField
      id={fieldId}
      label={label}
      hint={hint}
      hintId={hintId}
      error={error}
      errorId={errorId}
      required={required}
      requiredLabel={requiredLabel}
      optionalLabel={optionalLabel}
      className={className}
    >
      <select
        id={fieldId}
        name={name}
        aria-describedby={describedBy}
        aria-invalid={error ? "true" : undefined}
        aria-required={required || undefined}
        className={clsx(
          "focus-halo text-body h-11 w-full rounded-md border bg-surface px-3.5 text-ink",
          error ? "border-error" : "border-input-border"
        )}
        {...rest}
      >
        {placeholder ? (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}
