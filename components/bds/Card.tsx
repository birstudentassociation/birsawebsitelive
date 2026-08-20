import Link from "next/link";
import clsx from "clsx";

import { Heading, type HeadingLevel } from "@/components/bds/Type";

/**
 * BIRSA Design System: `Card` (REDESIGN-2.0 §4.3, content cluster).
 *
 * A listing item carrying dates, tags or images. When the job is only "pick
 * where to go next", use `NavList` instead: that split is the fix for D4
 * (§8 heuristic 4), where 1.0 had four kinds of box with overlapping jobs
 * and no rule for which to reach for.
 *
 * The whole card surface is clickable through a stretched link on
 * `CardTitle`: pass the same `href` to both `Card` and `CardTitle`, and the
 * accessible name for the entire clickable area becomes the title text,
 * never a bare "Read more" repeated once per card, which is meaningless
 * read out of context by a screen reader's link list.
 */
export type CardProps = {
  /**
   * When provided, pass the same `href` to a `CardTitle` inside this card so
   * its stretched link makes the whole card clickable: the title text
   * becomes the accessible name for the entire clickable area.
   */
  href?: string;
  className?: string;
  children: React.ReactNode;
};

export default function Card({ href, className, children }: CardProps) {
  return (
    <div
      className={clsx(
        "group relative flex flex-col gap-2 rounded-lg border border-line bg-surface p-5 shadow-sm transition-shadow duration-150",
        href && "hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}

export type CardTitleProps = {
  href?: string;
  children: React.ReactNode;
  className?: string;
  /** Heading level. Pick the one that fits the page outline. */
  level?: HeadingLevel;
};

/**
 * Title for use inside `Card`. When `href` matches the card's `href`, this
 * renders the stretched link (`after:absolute after:inset-0`), so the whole
 * card is clickable while the accessible name stays just the title text.
 */
export function CardTitle({ href, children, className, level = 3 }: CardTitleProps) {
  return (
    <Heading level={level} step="heading-3" className={clsx("text-ink", className)}>
      {href ? (
        <Link href={href} className="after:absolute after:inset-0 hover:underline">
          {children}
        </Link>
      ) : (
        children
      )}
    </Heading>
  );
}

export type CardMetaProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * A muted meta line inside a `Card`: a date, a category, a location. Sits
 * below `CardTitle`. This is the kind of content that separates `Card` from
 * `NavList` in the first place, so a `Card` without one is usually a sign
 * the listing should be a `NavList` instead.
 */
export function CardMeta({ children, className }: CardMetaProps) {
  return (
    <div className={clsx("flex flex-wrap items-center gap-x-3 gap-y-1", className)}>{children}</div>
  );
}
