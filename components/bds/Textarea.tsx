"use client";

import { useId } from "react";
import clsx from "clsx";

import FormField, { fieldDescribedBy } from "@/components/bds/FormField";

/**
 * BIRSA Design System: `Textarea` (REDESIGN-2.0 `components/bds/manifest.ts`,
 * forms cluster, split from `components/Field.tsx`).
 *
 * More than a sentence: the `long-text` question type in
 * `lib/services/questionTypes.ts`. Wrap in `CharacterCount` wherever a
 * length limit applies; this component alone has no counter, so use it only
 * when the limit is generous enough that nobody will reach it (a `CharacterCount`
 * shown with nothing to count down is noise, per its own usage rule).
 */
export type TextareaProps = {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  requiredLabel?: string;
  optionalLabel?: string;
  id?: string;
  className?: string;
  rows?: number;
} & Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "id" | "name" | "required" | "className" | "rows"
>;

export default function Textarea({
  name,
  label,
  hint,
  error,
  required,
  requiredLabel,
  optionalLabel,
  id,
  className,
  rows = 5,
  ...rest
}: TextareaProps) {
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
      <textarea
        id={fieldId}
        name={name}
        rows={rows}
        aria-describedby={describedBy}
        aria-invalid={error ? "true" : undefined}
        aria-required={required || undefined}
        className={clsx(
          "focus-halo text-body min-h-32 w-full resize-y rounded-md border bg-surface px-3.5 py-2.5 text-ink placeholder:text-muted",
          error ? "border-error" : "border-input-border"
        )}
        {...rest}
      />
    </FormField>
  );
}
