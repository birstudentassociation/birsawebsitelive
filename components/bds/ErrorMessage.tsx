import clsx from "clsx";

import Icon from "@/components/bds/Icon";
import { Text } from "@/components/bds/Type";

/**
 * BIRSA Design System: `ErrorMessage` (REDESIGN-2.0 `components/bds/manifest.ts`,
 * forms cluster, kept from `components/ErrorSummary.tsx`, which carried the
 * inline field error as inline markup inside `Field.tsx`).
 *
 * The inline message beside a field. Always paired with an `ErrorSummary` at
 * the top of the page (BUILD-BRIEF-2.0 section 7): the summary lets a
 * keyboard or screen reader user jump straight to a bad field, this message
 * confirms what is wrong once they get there. Every named control in this
 * cluster renders this when it has an `error`, wired to the control by
 * `aria-describedby` (see `FormField` and `Fieldset`), never on its own.
 *
 * The `id` prop exists so a caller (`FormField`, `Fieldset`) can attach the
 * id that `aria-describedby` targets. `Text` (`components/bds/Type.tsx`, a
 * frozen contract) does not forward arbitrary props such as `id`, so the id
 * sits on this component's own wrapping `<p>` and `Text` only sizes the
 * message text inside it.
 *
 * The circle-exclamation icon (`circle-alert`) is decorative: the word
 * "error" or the field's actual problem, spoken by `children`, carries the
 * meaning, never the icon alone.
 */
export type ErrorMessageProps = {
  id?: string;
  className?: string;
  children: React.ReactNode;
};

export default function ErrorMessage({ id, className, children }: ErrorMessageProps) {
  return (
    <p id={id} className={clsx("flex items-start gap-1.5 text-error", className)}>
      <Icon name="circle-alert" className="text-heading-3 mt-0.5 shrink-0" />
      <Text as="span" step="body-sm" className="font-medium">
        {children}
      </Text>
    </p>
  );
}
