import clsx from "clsx";

import { Text } from "@/components/bds/Type";
import ErrorMessage from "@/components/bds/ErrorMessage";

/**
 * BIRSA Design System: `FormField` (REDESIGN-2.0 `components/bds/manifest.ts`,
 * forms cluster, split from `components/Field.tsx`).
 *
 * The shared label, hint, error and describedby wiring every named control in
 * this cluster sits in (`TextInput`, `Textarea`, `Select`, `FileUpload`,
 * `PasswordInput`). Never used alone: reach for the named control, which
 * renders through this. Grouped controls (`Radios`, `Checkboxes`, `DateInput`)
 * use `Fieldset` instead, since a `<label>` cannot wrap several controls the
 * way a `<legend>` can.
 *
 * WHAT THIS PRESERVES FROM 1.0's `Field.tsx` (BUILD-BRIEF-2.0 section 7,
 * "do not regress"): a real `<label htmlFor>`, never a placeholder standing
 * in for one; a hint linked by `aria-describedby`; an error linked by
 * `aria-describedby` alongside the hint, hint first; and a required/optional
 * marker as visible text, never an asterisk alone. The caller (the named
 * control) computes the ids and the `aria-describedby` value with
 * `fieldDescribedBy` below and puts them on the actual `<input>` itself; this
 * component only renders the label, hint paragraph and error message that
 * those ids point at.
 *
 * IDS AND `<Text>`: the hint and error need a real DOM id for
 * `aria-describedby` to target, and `Text` (`components/bds/Type.tsx`, a
 * frozen contract) does not forward arbitrary props such as `id`. So the id
 * lives on a bare wrapper element and `Text` sizes the content inside it,
 * the same split `NavList.tsx` uses for a `Link` that needs an `href` `Text`
 * cannot carry either.
 */

/** Joins hint/error/count ids into one `aria-describedby` value, hint first, dropping any that are absent. */
export function fieldDescribedBy(...ids: Array<string | undefined>): string | undefined {
  return ids.filter(Boolean).join(" ") || undefined;
}

export type FormFieldProps = {
  /** The id of the control this field wraps. The `<label>`'s `htmlFor` target. */
  id: string;
  label: string;
  hint?: string;
  /** Id to put on the hint paragraph. Required whenever `hint` is set, so `aria-describedby` has something to point at. */
  hintId?: string;
  error?: string;
  /** Id to put on the error message. Required whenever `error` is set. */
  errorId?: string;
  required?: boolean;
  /** Visible marker text for required fields, e.g. `dict.actions.required`. */
  requiredLabel?: string;
  /** Visible marker text for optional fields, e.g. `dict.actions.optional`. */
  optionalLabel?: string;
  className?: string;
  /** The control itself: an `<input>`, `<textarea>` or `<select>`. */
  children: React.ReactNode;
};

export default function FormField({
  id,
  label,
  hint,
  hintId,
  error,
  errorId,
  required,
  requiredLabel,
  optionalLabel,
  className,
  children,
}: FormFieldProps) {
  const marker = required ? requiredLabel : optionalLabel;

  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="flex flex-wrap items-baseline gap-1.5">
        <Text as="span" step="body-sm" className="font-semibold text-ink">
          {label}
        </Text>
        {marker ? (
          <Text as="span" step="body-sm" className="font-normal text-muted">
            ({marker})
          </Text>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId}>
          <Text as="span" step="body-sm" className="text-muted">
            {hint}
          </Text>
        </p>
      ) : null}
      {children}
      {error ? <ErrorMessage id={errorId}>{error}</ErrorMessage> : null}
    </div>
  );
}
