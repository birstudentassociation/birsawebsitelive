import clsx from "clsx";

import Icon from "@/components/bds/Icon";
import { Heading, Text, type HeadingLevel } from "@/components/bds/Type";

/**
 * BIRSA Design System: `Panel` (REDESIGN-2.0 `components/bds/manifest.ts`,
 * status cluster, kept from `components/forms/ResultPanel.tsx`, GDS `panel`).
 *
 * THE RULE THIS COMPONENT ENFORCES (manifest `usage`, §8 heuristic 6): the
 * confirmation at the end of a service, carrying the reference number. ONE
 * per page, and the reference is the LARGEST thing on it, deliberately,
 * because the status lookup will ask a student for it later and there are
 * no accounts to fall back on (REDESIGN-2.0 §8 heuristic 6: "the
 * confirmation panel says explicitly to save the reference"). `reference`
 * renders at `text-display-1`, one step above `title`'s `text-heading-1`
 * and two above `referenceLabel`'s `text-body`, so the size relationship
 * holds by construction rather than by each caller remembering to make it
 * big.
 *
 * NOTE ON SCOPE: 1.0's `ResultPanel.tsx` did a different job, wrapping
 * `Notice` plus retry/action buttons for a form journey's NON-success
 * outcomes (rate-limited, not configured, blocklisted). That is not what
 * the manifest asks `Panel` to be in 2.0: the manifest's usage rule is the
 * success confirmation carrying a reference number, matching the GDS
 * `panel` component. The old `ResultPanel` non-success behaviour has no
 * replacement in this wave; its callers move in Wave 5 and whichever
 * component they need for a non-success outcome (most likely
 * `NotificationBanner` with `variant="error"`, or `InterruptionPage` in the
 * service cluster) is a decision for whoever migrates those call sites, not
 * this component.
 *
 * `components/bds/ConfirmationPanel` (service cluster, another agent) wraps
 * this with the "what happens next" copy and the service standard; `Panel`
 * itself is only the box.
 *
 * ROLE: none here. `Panel` is a plain confirmation box, not a live update;
 * whichever component actually announces "your submission succeeded" as a
 * fresh, page-level result (`NotificationBanner`, or the service cluster's
 * `ConfirmationPanel`) is where a role belongs, not this reusable shell that
 * always renders as part of the same page load.
 *
 * COLOUR: text colour is `text-success` throughout, set once on the
 * wrapper and inherited by every child rather than repeated, on
 * `bg-success-tint`, exactly the pairing `contrastPairs` asserts ("success
 * notice"). Colour never carries the confirmation's meaning alone: the
 * heading, the label and the reference number are all real, visible text.
 */

export type PanelProps = {
  /**
   * Heading level for `title`, `h1` through `h4`. Defaults to 1: a
   * confirmation panel is normally the page's main heading. Pass a lower
   * level if the caller's page template already renders its own `h1`
   * elsewhere.
   */
  level?: HeadingLevel;
  /** The confirmation heading, for example "Application complete". Caller-supplied: this component owns no dictionary namespace. */
  title: string;
  /** The label above the reference, for example "Your reference number". */
  referenceLabel: string;
  /** The reference number itself. Rendered as the largest text on the panel. */
  reference: string;
  className?: string;
};

export default function Panel({
  level = 1,
  title,
  referenceLabel,
  reference,
  className,
}: PanelProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-3 rounded-lg border-2 border-success bg-success-tint p-8 text-center text-success",
        className
      )}
    >
      <Icon name="check" className="text-display-1" />
      <Heading level={level} step="heading-1">
        {title}
      </Heading>
      <Text step="body">{referenceLabel}</Text>
      <Text as="p" step="display-1" className="font-bold break-words">
        {reference}
      </Text>
    </div>
  );
}
