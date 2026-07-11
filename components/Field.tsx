"use client";

import { useId } from "react";
import clsx from "clsx";

type BaseProps = {
  label: string;
  hint?: string;
  error?: string;
  /** Visible marker text for required fields, e.g. dict.actions.required. */
  requiredLabel?: string;
  /** Visible marker text for optional fields, e.g. dict.actions.optional. */
  optionalLabel?: string;
  required?: boolean;
  className?: string;
  id?: string;
  name: string;
};

type InputAs = "input" | "textarea" | "select";

type FieldProps = BaseProps & {
  as?: InputAs;
  /** Options for `as="select"`. */
  options?: { value: string; label: string }[];
} & Omit<
    React.InputHTMLAttributes<HTMLInputElement> &
      React.TextareaHTMLAttributes<HTMLTextAreaElement> &
      React.SelectHTMLAttributes<HTMLSelectElement>,
    "id" | "name" | "required" | "className"
  >;

/**
 * Client-safe form field: label, optional hint, optional inline error, and
 * an input/textarea/select rendered per the `as` prop. Sets
 * `aria-describedby` (hint + error ids) and `aria-invalid` automatically.
 * Required/optional are marked with visible text, not just an asterisk.
 */
export default function Field({
  label,
  hint,
  error,
  requiredLabel,
  optionalLabel,
  required,
  className,
  id,
  name,
  as = "input",
  options,
  ...rest
}: FieldProps) {
  const autoId = useId();
  const fieldId = id ?? `${name}-${autoId}`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const sharedClasses = clsx(
    "focus-halo w-full rounded-md border bg-surface px-3.5 py-2.5 text-[0.95rem] text-ink placeholder:text-muted",
    error ? "border-error" : "border-input-border"
  );

  const marker = required
    ? requiredLabel && <span className="text-muted ml-1.5 font-normal">({requiredLabel})</span>
    : optionalLabel && <span className="text-muted ml-1.5 font-normal">({optionalLabel})</span>;

  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <label htmlFor={fieldId} className="text-ink text-sm font-semibold">
        {label}
        {marker}
      </label>
      {hint ? (
        <p id={hintId} className="text-muted text-sm">
          {hint}
        </p>
      ) : null}
      {as === "textarea" ? (
        <textarea
          id={fieldId}
          name={name}
          aria-describedby={describedBy}
          aria-invalid={error ? "true" : undefined}
          aria-required={required || undefined}
          className={clsx(sharedClasses, "min-h-32 resize-y")}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : as === "select" ? (
        <select
          id={fieldId}
          name={name}
          aria-describedby={describedBy}
          aria-invalid={error ? "true" : undefined}
          aria-required={required || undefined}
          className={clsx(sharedClasses, "h-11")}
          {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={fieldId}
          name={name}
          aria-describedby={describedBy}
          aria-invalid={error ? "true" : undefined}
          aria-required={required || undefined}
          className={clsx(sharedClasses, "h-11")}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error ? (
        <p id={errorId} className="text-error flex items-center gap-1.5 text-sm font-medium">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0">
            <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth={1.75} />
            <path d="M10 6.5v4.2" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
            <circle cx="10" cy="13.6" r="0.9" fill="currentColor" />
          </svg>
          {error}
        </p>
      ) : null}
    </div>
  );
}
