import Link from "next/link";
import clsx from "clsx";

import Tag from "@/components/bds/Tag";
import { Text } from "@/components/bds/Type";

/**
 * BIRSA Design System: `PhaseBanner` (REDESIGN-2.0
 * `components/bds/manifest.ts`, status cluster, new, GDS `phase-banner`).
 *
 * THE RULE THIS COMPONENT ENFORCES (manifest `usage`, REDESIGN-2.0 §4.5): an
 * area that has been rebuilt but is not yet trusted, carrying a feedback
 * link. §4.5 is explicit that "the banner's text and its on/off state are
 * editable, so removing it does not need a developer", which is why
 * EVERY piece of copy here, and whether it renders at all, is a prop rather
 * than anything baked into this component. This component owns no
 * dictionary namespace and holds no editorial judgement of its own: a page
 * carries a `PhaseBanner` with `active` sourced from wherever 2.0's
 * configuration for it lives (a Sanity singleton document, per §6.6), not
 * from a constant in code.
 *
 * `active={false}` renders NOTHING, not a hidden or collapsed banner: a
 * developer removing a phase from beta should not be needed, and a
 * screen-reader user should not have a banner in the accessibility tree
 * that a sighted person cannot see either.
 *
 * COLOUR: the phase word renders through `Tag` (`variant="brand"`), which
 * only uses `contrastPairs`-asserted pairings itself (see `Tag`'s own
 * TSDoc), so this component adds no new colour pairing of its own. The
 * banner's own background is `bg-sunken` with `text-ink`, the asserted
 * "body text in a well" pairing.
 *
 * ROLE: none. This is standing chrome present for the whole time an area is
 * in beta, not a fresh, page-level result: it is exactly the kind of
 * "standing information" `NotificationBanner`'s own usage rule excludes.
 *
 * TARGET SIZE: `feedbackLabel` renders as a link inline within a sentence,
 * which is the WCAG 2.5.8 "inline" exception to the 44px minimum target
 * (BUILD-BRIEF-2.0 §7); it is not a button-styled control.
 */

export type PhaseBannerProps = {
  /** Whether the banner renders at all. `false` renders nothing. */
  active: boolean;
  /** The phase word, e.g. "Beta" or "ทดลองใช้งาน". Caller-supplied. */
  phaseLabel: string;
  /** The explanatory sentence, e.g. "This is a new area of the site." Caller-supplied. */
  children: React.ReactNode;
  /** Where the feedback link goes. */
  feedbackHref: string;
  /** The feedback link's visible text, e.g. "Give feedback on this page". */
  feedbackLabel: string;
  className?: string;
};

export default function PhaseBanner({
  active,
  phaseLabel,
  children,
  feedbackHref,
  feedbackLabel,
  className,
}: PhaseBannerProps) {
  if (!active) return null;

  return (
    <div
      className={clsx(
        "flex flex-wrap items-center gap-3 border-b border-line bg-sunken px-4 py-3",
        className
      )}
    >
      <Tag variant="brand">{phaseLabel}</Tag>
      <Text step="body-sm" className="text-ink">
        {children}{" "}
        <Link href={feedbackHref} className="font-semibold underline">
          {feedbackLabel}
        </Link>
      </Text>
    </div>
  );
}
