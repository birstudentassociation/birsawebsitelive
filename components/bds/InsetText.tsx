import clsx from "clsx";

import { Text } from "@/components/bds/Type";

/**
 * BIRSA Design System: `InsetText` (REDESIGN-2.0 `components/bds/manifest.ts`,
 * status cluster, split from `components/Notice.tsx`).
 *
 * THE RULE THIS COMPONENT ENFORCES (manifest `usage`): a quoted or
 * emphasised ASIDE, set apart from the surrounding prose only to draw the
 * eye, with no info/success/warning/error meaning attached to it at all. It
 * is NOT a status message: for that, reach for `Notice` (inline), for a
 * page-level result reach for `NotificationBanner`, and for a consequence
 * the reader must not miss reach for `WarningText`. Re-adding a `variant`
 * prop here is exactly the four-boxes-with-no-rule defect this split fixes.
 *
 * ROLE: none. Static content in the reader's normal reading order, not a
 * status update.
 *
 * COLOUR: the left rule is `border-line-strong`, the token
 * `components/bds/tokens.ts` documents as decorative-only precisely because
 * it carries no meaning and so is exempt from a contrast minimum ("If a
 * future component uses it to convey state, that component is the bug, not
 * this list"). `InsetText` is that intended decorative use: the border
 * marks where the aside starts and ends, it does not tell the reader
 * anything a colourblind reader would miss. Body text is `text-ink`, the
 * asserted pairing for body copy on the page background.
 */

export type InsetTextProps = {
  /**
   * The rendered element. Defaults to `div`. Use `blockquote` when the
   * content is an actual quotation, which keeps the semantics correct for
   * assistive technology without changing how it looks.
   */
  as?: "div" | "blockquote";
  className?: string;
  children: React.ReactNode;
};

export default function InsetText({ as = "div", className, children }: InsetTextProps) {
  const Component = as;
  return (
    <Component className={clsx("border-l-4 border-line-strong py-1 pl-4 text-ink", className)}>
      <Text as="div" step="body">
        {children}
      </Text>
    </Component>
  );
}
