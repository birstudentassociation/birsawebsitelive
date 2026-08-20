import clsx from "clsx";

import { iconPaths, ICON_VIEW_BOX, type IconName } from "@/components/bds/icons";

export type { IconName };

/**
 * The BIRSA Design System icon (REDESIGN-2.0 §4.2, §11.4 media cluster).
 *
 * Renders one glyph from `components/bds/icons.ts`. This is the ONE place an
 * icon is drawn; a `bds/` component or a page that writes its own inline
 * `<svg>` has reintroduced the exact duplication this sprite exists to
 * remove (see the report accompanying this file for the inventory of where
 * every icon used to live).
 *
 * NO ICON EVER CARRIES MEANING ALONE. This is an existing house rule, not a
 * new one, and this component defaults to enforcing it: every icon renders
 * `aria-hidden="true"` and `focusable="false"` UNLESS `title` is passed (see
 * below). An icon on its own, even with `title`, is a weaker accessible name
 * than real text: prefer pairing the icon with visible text, or, when the
 * visible text genuinely cannot carry the label (an icon-only button, say),
 * with `VisuallyHidden` text next to it inside the same control. `title` on
 * `Icon` itself exists for the rare case neither of those is available to
 * you, and reaching for it is almost always the wrong answer here too.
 *
 * COLOUR: the icon always inherits `currentColor` for both fill and stroke.
 * It never takes a colour prop, so it is correct in both themes without a
 * dark-mode rule; set colour on an ancestor (or `className`) the way you
 * would for text.
 *
 * SIZE: width and height are `1em`, so the icon scales with `font-size`
 * exactly as a character would. An icon beside body text at `text-body` and
 * one beside a `text-heading-1` are different sizes automatically, with no
 * per-call-site size prop. Pass a `className` that sets `font-size` (or sits
 * on an ancestor that does) to size the icon; do not pass a fixed pixel
 * height, which is what every source `<svg>` this replaces did with `h-4
 * w-4`-style Tailwind classes and is exactly what stopped the icon
 * following the type scale.
 */
export type IconProps = {
  /** Which glyph to draw. Every key of `iconPaths` in `components/bds/icons.ts`. */
  name: IconName;
  className?: string;
  /**
   * Almost always the wrong prop. Passing `title` is the deliberate,
   * documented exception to "icons are decorative by default": it switches
   * the icon to `role="img"`, adds a `<title>` element, points
   * `aria-labelledby` at it, and drops `aria-hidden`, so the icon itself
   * becomes the accessible name of something. That is rarely what a page
   * needs, because it means an icon is now the sole carrier of meaning,
   * which is the house rule this component exists to protect. Reach for it
   * only when there is truly no adjacent text, visible or visually hidden,
   * that could carry the label instead.
   */
  title?: string;
};

/** Stroke width shared by every icon. 1.75 is the value the majority of the source icons already used. */
const STROKE_WIDTH = 1.75;

export default function Icon({ name, className, title }: IconProps) {
  const titleId = title ? `bds-icon-${name}-title` : undefined;

  return (
    <svg
      viewBox={ICON_VIEW_BOX}
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={clsx("inline-block shrink-0", className)}
      role={title ? "img" : undefined}
      aria-labelledby={title ? titleId : undefined}
      aria-hidden={title ? undefined : "true"}
      focusable="false"
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d={iconPaths[name]} />
    </svg>
  );
}
