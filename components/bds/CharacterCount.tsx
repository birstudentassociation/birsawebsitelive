"use client";

import { useEffect, useId, useState } from "react";
import clsx from "clsx";

import { fieldDescribedBy } from "@/components/bds/FormField";
import ErrorMessage from "@/components/bds/ErrorMessage";
import { Text } from "@/components/bds/Type";

/**
 * BIRSA Design System: `CharacterCount` (REDESIGN-2.0 `components/bds/manifest.ts`,
 * forms cluster, new).
 *
 * A length limit the reader needs to see as they type: the presentation
 * behind `lib/services/questionTypes.ts`'s `long-text` validation, "length
 * with a character count component". Not for limits so generous nobody
 * reaches them, per the manifest usage rule: a counter nobody will ever run
 * out of is noise, use plain `Textarea` instead.
 *
 * MUST DEGRADE TO A PLAIN STATIC HINT WITH NO JAVASCRIPT (BUILD-BRIEF-2.0
 * section 7). Before hydration, and forever if the client script never
 * runs, this renders `labels.hint` (the static "you can enter up to N
 * characters" line) as an ordinary hint paragraph. Only after mount does it
 * switch to a live count that updates on every keystroke, following the
 * same enhanced/fallback split `components/inventory/OfficerLogin.tsx`
 * already uses correctly. The mounted state is tracked with the `enhanced`
 * flag below; `tests/unit/bds-forms.test.tsx` asserts the pre-hydration
 * output directly with `renderToStaticMarkup`, which is what a browser with
 * JavaScript disabled actually receives.
 *
 * TEMPLATES, NOT FUNCTIONS: like every other `bds/` component, this one
 * takes copy as props rather than reading a dictionary itself (see
 * `ExternalLink.tsx`'s note on staying dictionary-free so components remain
 * server-safe and easy to test). Because the count is a number that changes
 * live, a plain string cannot carry it, so `labels` holds small templates
 * with `{max}` / `{count}` placeholders instead of a full sentence, and this
 * component does the substitution. English needs the one/other split
 * because English pluralises ("1 character" vs "2 characters"); Thai does
 * not, so `content/dictionaries/th/forms.ts` can (and does) give both keys
 * nearly identical text.
 */
export type CharacterCountLabels = {
  /** Static hint shown before hydration and with no length yet typed, `{max}` replaced with the limit. */
  hint: string;
  /** Remaining count is exactly 1. */
  remainingOne: string;
  /** Remaining count is anything else, `{count}` replaced with the number. */
  remainingOther: string;
  /** Over the limit by exactly 1. */
  overOne: string;
  /** Over the limit by anything else, `{count}` replaced with the number. */
  overOther: string;
};

export type CharacterCountProps = {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  requiredLabel?: string;
  optionalLabel?: string;
  id?: string;
  className?: string;
  maxLength: number;
  labels: CharacterCountLabels;
  defaultValue?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
};

function fill(template: string, token: string, replacement: string): string {
  return template.replace(token, replacement);
}

export default function CharacterCount({
  name,
  label,
  hint,
  error,
  required,
  requiredLabel,
  optionalLabel,
  id,
  className,
  maxLength,
  labels,
  defaultValue,
  value,
  onChange,
  rows = 5,
}: CharacterCountProps) {
  const autoId = useId();
  const fieldId = id ?? `${name}-${autoId}`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const countId = `${fieldId}-count`;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = fieldDescribedBy(hintId, countId, errorId);

  const [enhanced, setEnhanced] = useState(false);
  const [length, setLength] = useState(() => (value ?? defaultValue ?? "").length);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- the enhanced/fallback split every progressively-enhanced control in this cluster uses; see the file header note.
  useEffect(() => setEnhanced(true), []);

  const remaining = maxLength - length;
  const overLimit = remaining < 0;
  const staticHint = fill(labels.hint, "{max}", String(maxLength));
  const liveText = overLimit
    ? fill(
        Math.abs(remaining) === 1 ? labels.overOne : labels.overOther,
        "{count}",
        String(Math.abs(remaining))
      )
    : fill(
        remaining === 1 ? labels.remainingOne : labels.remainingOther,
        "{count}",
        String(remaining)
      );
  const countText = enhanced ? liveText : staticHint;

  const marker = required ? requiredLabel : optionalLabel;

  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <label htmlFor={fieldId} className="flex flex-wrap items-baseline gap-1.5">
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
      <textarea
        id={fieldId}
        name={name}
        rows={rows}
        aria-describedby={describedBy}
        aria-invalid={error || overLimit ? "true" : undefined}
        aria-required={required || undefined}
        value={value}
        defaultValue={defaultValue}
        onChange={(event) => {
          setLength(event.target.value.length);
          onChange?.(event);
        }}
        className={clsx(
          "focus-halo text-body min-h-32 w-full resize-y rounded-md border bg-surface px-3.5 py-2.5 text-ink placeholder:text-muted",
          error || overLimit ? "border-error" : "border-input-border"
        )}
      />
      <p id={countId} role="status" className={overLimit && enhanced ? "text-error" : "text-muted"}>
        <Text as="span" step="body-sm">
          {countText}
        </Text>
      </p>
      {error ? <ErrorMessage id={errorId}>{error}</ErrorMessage> : null}
    </div>
  );
}
