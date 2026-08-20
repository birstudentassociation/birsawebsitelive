"use client";

import { useId } from "react";
import clsx from "clsx";

import FormField, { fieldDescribedBy } from "@/components/bds/FormField";

/**
 * BIRSA Design System: `FileUpload` (REDESIGN-2.0 `components/bds/manifest.ts`,
 * forms cluster, generalised from `components/inventory/PhotoUpload.tsx`).
 *
 * A file the reader has to supply, such as a reimbursement receipt. Always
 * into Vercel Blob, never into the CMS (REDESIGN-2.0 section 6.3), and
 * always under a retention path: this component only renders the native
 * picker, and the caller (a service's server action, per
 * `lib/services/questionTypes.ts`'s `file-upload` question type) owns where
 * the bytes end up.
 *
 * Deliberately a plain `<input type="file">`, unlike `PhotoUpload.tsx`,
 * which uploaded immediately on selection through a client `fetch` call.
 * That flow needs JavaScript; this one does not; the file is simply part of
 * the form's own submission (BUILD-BRIEF-2.0 section 7, "everything works
 * with JavaScript off"). A page that wants an immediate preview or
 * upload-on-select can still layer that on top with its own client code,
 * but the system component itself makes no such requirement.
 */
export type FileUploadProps = {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  /** MIME types or extensions the browser should filter to, e.g. `"image/jpeg,image/png,application/pdf"`. Advisory only; the server must still check type and size. */
  accept?: string;
  multiple?: boolean;
  required?: boolean;
  requiredLabel?: string;
  optionalLabel?: string;
  id?: string;
  className?: string;
};

export default function FileUpload({
  name,
  label,
  hint,
  error,
  accept,
  multiple,
  required,
  requiredLabel,
  optionalLabel,
  id,
  className,
}: FileUploadProps) {
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
        type="file"
        accept={accept}
        multiple={multiple}
        aria-describedby={describedBy}
        aria-invalid={error ? "true" : undefined}
        aria-required={required || undefined}
        className={clsx(
          "focus-halo text-body min-h-11 w-full rounded-md border bg-surface px-3.5 py-2.5 text-ink",
          "file:mr-3 file:rounded-md file:border-0 file:bg-sunken file:px-3 file:py-1.5 file:font-semibold file:text-ink",
          error ? "border-error" : "border-input-border"
        )}
      />
    </FormField>
  );
}
