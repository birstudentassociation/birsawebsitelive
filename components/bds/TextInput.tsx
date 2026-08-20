"use client";

import { useId } from "react";
import clsx from "clsx";

import FormField, { fieldDescribedBy } from "@/components/bds/FormField";

/**
 * BIRSA Design System: `TextInput` (REDESIGN-2.0 `components/bds/manifest.ts`,
 * forms cluster, split from `components/Field.tsx`).
 *
 * One short answer on a line: a name, an email address, a student ID, a
 * phone number. Use `Textarea` past a sentence, and wrap it in
 * `CharacterCount` when there is a length limit worth showing. This is the
 * `short-text`, `email`, `phone` and `student-id` question types in
 * `lib/services/questionTypes.ts`, the `type` prop choosing which.
 *
 * `"use client"` because it needs `useId` for a stable fallback id when the
 * caller does not supply one, following `components/Field.tsx`'s existing,
 * correct approach. The rendered markup needs no JavaScript to work: the
 * `<input>` posts as part of the form whether or not the client script has
 * run (BUILD-BRIEF-2.0 section 7).
 */
export type TextInputProps = {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  /** Visible marker text for required fields, e.g. `dict.actions.required`. */
  requiredLabel?: string;
  /** Visible marker text for optional fields, e.g. `dict.actions.optional`. */
  optionalLabel?: string;
  id?: string;
  className?: string;
  /** Narrows the keyboard and validation the browser offers. Defaults to `"text"`. */
  type?: "text" | "email" | "tel" | "search" | "url";
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "id" | "name" | "required" | "className" | "type"
>;

export default function TextInput({
  name,
  label,
  hint,
  error,
  required,
  requiredLabel,
  optionalLabel,
  id,
  className,
  type = "text",
  ...rest
}: TextInputProps) {
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
      <input
        id={fieldId}
        name={name}
        type={type}
        aria-describedby={describedBy}
        aria-invalid={error ? "true" : undefined}
        aria-required={required || undefined}
        className={clsx(
          "focus-halo text-body h-11 w-full rounded-md border bg-surface px-3.5 text-ink placeholder:text-muted",
          error ? "border-error" : "border-input-border"
        )}
        {...rest}
      />
    </FormField>
  );
}
