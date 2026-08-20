import clsx from "clsx";

import { fieldDescribedBy } from "@/components/bds/FormField";
import ErrorMessage from "@/components/bds/ErrorMessage";
import { Text, type TypeStep } from "@/components/bds/Type";

/**
 * BIRSA Design System: `Fieldset` (REDESIGN-2.0 `components/bds/manifest.ts`,
 * forms cluster, new, formalising markup that was inline in 1.0).
 *
 * Groups controls that answer one question together, with a `<legend>` as
 * the question. `Radios` and `Checkboxes` render their own fieldset through
 * this component; reach for it directly only when grouping several separate
 * controls (for example a from-and-to pair, as `DateInput` and
 * `DateRangeInput` do) under one legend, hint and error.
 *
 * The hint and error are linked to the group with `aria-describedby` on the
 * `<fieldset>` itself, hint first when both are present, following the same
 * GDS convention `Radios` and `Checkboxes` need: a `<fieldset>` has no single
 * `<input>` for `aria-describedby` to sit on, so it sits on the group. For
 * the same reason `aria-invalid` sits on the `<fieldset>` rather than on
 * every control inside it: the group, not any one control, is what failed
 * validation.
 */
export type FieldsetProps = {
  /** Base id for this group. Derives `${id}-hint` and `${id}-error`. */
  id: string;
  legend: string;
  /** Which type scale step the legend renders at. Defaults to `heading-3`; pass a bigger step when the legend is the only question on the page (the GDS `question-pages` pattern). */
  legendStep?: TypeStep;
  hint?: string;
  error?: string;
  required?: boolean;
  requiredLabel?: string;
  optionalLabel?: string;
  className?: string;
  children: React.ReactNode;
};

export default function Fieldset({
  id,
  legend,
  legendStep = "heading-3",
  hint,
  error,
  required,
  requiredLabel,
  optionalLabel,
  className,
  children,
}: FieldsetProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = fieldDescribedBy(hintId, errorId);
  const marker = required ? requiredLabel : optionalLabel;

  return (
    <fieldset
      aria-describedby={describedBy}
      aria-invalid={error ? "true" : undefined}
      className={clsx("m-0 flex flex-col gap-3 border-0 p-0", className)}
    >
      <legend className="mb-1 flex flex-wrap items-baseline gap-1.5 p-0">
        <Text as="span" step={legendStep} className="font-semibold text-ink">
          {legend}
        </Text>
        {marker ? (
          <Text as="span" step="body-sm" className="font-normal text-muted">
            ({marker})
          </Text>
        ) : null}
      </legend>
      {hint ? (
        <p id={hintId}>
          <Text as="span" step="body-sm" className="text-muted">
            {hint}
          </Text>
        </p>
      ) : null}
      <div className="flex flex-col gap-3">{children}</div>
      {error ? <ErrorMessage id={errorId}>{error}</ErrorMessage> : null}
    </fieldset>
  );
}
