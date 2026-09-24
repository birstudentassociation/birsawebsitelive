"use client";

import { useId } from "react";
import clsx from "clsx";
import ErrorMessage from "@/components/ErrorMessage";

type BaseProps = {
  label: string;
  hint?: string;
  /**
   * Id of a visible heading that already asks this question (usually the
   * page `<h1>`). The field is then named by that heading and renders no
   * `<label>` of its own, so the question is announced once.
   */
  labelledBy?: string;
  error?: string;
  /** Visible marker text for required fields, e.g. dict.actions.required. */
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
 * Optional fields are marked "(optional)"; required ones carry no marker.
 */
export default function Field({
  label,
  hint,
  labelledBy,
  error,
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
    "focus-halo w-full rounded-md border bg-surface px-3.5 py-2.5 text-ink placeholder:text-muted",
    error ? "border-error" : "border-input-border"
  );

  // Only optional fields are marked; mandatory ones never are (GOV.UK
  // Question pages).
  const marker =
    !required && optionalLabel ? (
      <span className="ml-1.5 font-normal text-muted">({optionalLabel})</span>
    ) : null;

  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      {labelledBy ? null : (
        <label htmlFor={fieldId} className="font-semibold text-ink">
          {label}
          {marker}
        </label>
      )}
      {hint ? (
        <p id={hintId} className="text-muted">
          {hint}
        </p>
      ) : null}
      {as === "textarea" ? (
        <textarea
          id={fieldId}
          name={name}
          aria-labelledby={labelledBy}
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
          aria-labelledby={labelledBy}
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
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          aria-invalid={error ? "true" : undefined}
          aria-required={required || undefined}
          className={clsx(sharedClasses, "h-11")}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error ? <ErrorMessage id={errorId}>{error}</ErrorMessage> : null}
    </div>
  );
}
