"use client";

import { useId } from "react";
import clsx from "clsx";

import FormField, { fieldDescribedBy } from "@/components/bds/FormField";

/**
 * BIRSA Design System: `PasswordInput` (REDESIGN-2.0 `components/bds/manifest.ts`,
 * forms cluster, kept from `components/inventory/OfficerLogin.tsx`).
 *
 * Officer login only, per the manifest usage rule. Already correct for WCAG
 * 3.3.8 accessible authentication in 1.0, and this component keeps every
 * part of that exactly: a real `type="password"` field, `autoComplete`
 * defaulting to `"current-password"`, no paste blocking (no `onPaste`
 * handler anywhere in this file, deliberately), and no CAPTCHA. Do not add
 * one, and do not add anything (a copy-prevention handler, a strength meter
 * that blocks submission) that would turn this back into a memory test.
 *
 * No show or hide toggle either: `OfficerLogin.tsx`, the component this
 * generalises, does not have one, and BUILD-BRIEF-2.0's instruction is to
 * keep 3.3.8 compliance "exactly as `OfficerLogin.tsx` has it" rather than
 * to add to it.
 */
export type PasswordInputProps = {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  requiredLabel?: string;
  optionalLabel?: string;
  id?: string;
  className?: string;
  autoComplete?: "current-password" | "new-password";
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function PasswordInput({
  name,
  label,
  hint,
  error,
  required,
  requiredLabel,
  optionalLabel,
  id,
  className,
  autoComplete = "current-password",
  value,
  defaultValue,
  onChange,
}: PasswordInputProps) {
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
        type="password"
        autoComplete={autoComplete}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        aria-describedby={describedBy}
        aria-invalid={error ? "true" : undefined}
        aria-required={required || undefined}
        className={clsx(
          "focus-halo text-body h-11 w-full rounded-md border bg-surface px-3.5 text-ink",
          error ? "border-error" : "border-input-border"
        )}
      />
    </FormField>
  );
}
