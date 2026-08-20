import clsx from "clsx";

import Icon from "@/components/bds/Icon";
import { Text } from "@/components/bds/Type";

/**
 * BIRSA Design System: `WarningText` (REDESIGN-2.0 `components/bds/manifest.ts`,
 * status cluster, split from `components/Notice.tsx`).
 *
 * THE RULE THIS COMPONENT ENFORCES (manifest `usage`): a CONSEQUENCE the
 * reader must not miss, carrying the exclamation icon. It is not a callout
 * box (`Notice`), not a page-level result (`NotificationBanner`), and not a
 * quoted aside (`InsetText`). RESERVE IT: a page of warnings warns nobody, so
 * use it for the one or two consequences that genuinely change what the
 * reader should do next, for example "you cannot change your answers after
 * this page" or "this cannot be undone", not for routine guidance.
 *
 * ROLE: none, deliberately, matching `Notice`. This is static content
 * present in the reader's normal reading order when the page renders, not a
 * live update, so a live-region role would be noise rather than help.
 * `role="status"`/`role="alert"` are reserved for `NotificationBanner`,
 * which really does announce a fresh, page-level result.
 *
 * COLOUR: `components/bds/tokens.ts`'s `contrastPairs` asserts `warning` as
 * a text colour only against `warning-tint`, and this component
 * deliberately renders on the page's plain background (no tint box: that is
 * what visually separates it from `Notice`, matching the GDS warning-text
 * pattern of an icon and bold text with no surrounding fill). So only the
 * short label word and the icon, both decorative reinforcement rather than
 * the sentence itself, use `text-warning`; the actual warning sentence
 * (`children`, the part a reader must read in full) renders in `text-ink`,
 * which IS asserted on the page background. This is the same limit 1.0's
 * `components/Field.tsx` and its siblings already live with for inline
 * `text-error` messages on a plain background, a combination this repo
 * ships today without it being in `contrastPairs`. Reported in the Wave 2
 * status cluster report as a contract gap worth Wave 0 either asserting or
 * correcting; not invented fresh here, only formalised.
 *
 * MEANING NEVER TRAVELS ON COLOUR ALONE: `label` is a required visible word
 * (not hidden), the icon is `aria-hidden` per `Icon`'s default, and the
 * warning colour only ever touches the label and the icon, never the
 * sentence that carries the actual information.
 */

export type WarningTextProps = {
  /**
   * The visible warning word, for example "Warning" or "คำเตือน". Required
   * and always rendered, never hidden: this is what keeps the warning
   * legible without colour. Caller-supplied text: this component owns no
   * dictionary namespace.
   */
  label: string;
  className?: string;
  children: React.ReactNode;
};

export default function WarningText({ label, className, children }: WarningTextProps) {
  return (
    <div className={clsx("flex items-start gap-3", className)}>
      <Icon name="warning-triangle" className="text-heading-1 shrink-0 text-warning" />
      <Text step="body" className="min-w-0 flex-1 text-ink">
        <span className="font-bold text-warning">{label}</span> {children}
      </Text>
    </div>
  );
}
