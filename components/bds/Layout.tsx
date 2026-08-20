import clsx from "clsx";

import type { SpaceToken } from "@/components/bds/tokens";

/**
 * Three-column page grid, after the GOV.UK grid: a 30px gutter, three equal
 * tracks from `md` up, and everything stacked below that.
 *
 * Content does not usually want three equal columns, it wants a wide reading
 * column and a narrower rail beside it, so `GridMain` spans two tracks and
 * `GridAside` takes the third. Building it out of thirds rather than hard
 * two-thirds/one-third widths keeps the real three-column system available for
 * anything that does want equal columns.
 *
 * This is the 2.0 home for the grid; the identical primitive at
 * `components/GridRow.tsx` stays in place until its callers migrate (Wave 5).
 * Use this one for anything new. For the page container that centres and
 * gutters the whole page, not just a row inside it, use `Wrap` below.
 */
export function GridRow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={clsx("grid gap-x-[30px] gap-y-10 md:grid-cols-3", className)}>{children}</div>
  );
}

/** The reading column: two of the three tracks. */
export function GridMain({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={clsx("min-w-0 md:col-span-2", className)}>{children}</div>;
}

/**
 * The rail beside `GridMain`: the remaining track. Optional. Leave it out and
 * the main column simply keeps its two-thirds width rather than stretching.
 */
export function GridAside({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={clsx("min-w-0 md:col-span-1", className)}>{children}</div>;
}

/**
 * The centred page container. Renders the `.wrap` class from
 * `app/globals.css`: a max width of `--wrap` (72rem), centred with
 * `margin-inline: auto`, and responsive inline padding. Use this for the
 * outer width of a page or a full-bleed section's content; it does not add
 * vertical rhythm. For the padding-block that separates one section of a
 * page from the next, use `Section`, not a `py-*` utility on this component.
 */
export function Wrap({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("wrap", className)}>{children}</div>;
}

/**
 * A page section carrying the vertical rhythm between sections. Renders the
 * `bds-section` class from `components/bds/tokens.css`, which sets
 * `padding-block: var(--space-section)`.
 *
 * This is the ONE place page section rhythm is set. A page that writes its
 * own `py-12 sm:py-16` (or any other `py-*`) on a section has reintroduced
 * the exact problem this component exists to fix (REDESIGN-2.0 §4.2): vertical
 * rhythm becomes something copy-pasted per page instead of something the
 * design system owns. If a section needs to render as a `<div>`, for example
 * because it cannot be a landmark at that point in the page, pass `as="div"`
 * rather than reaching for a different element and losing the rhythm.
 */
export function Section({
  as: Component = "section",
  className,
  children,
}: {
  as?: "section" | "div";
  className?: string;
  children: React.ReactNode;
}) {
  return <Component className={clsx("bds-section", className)}>{children}</Component>;
}

/**
 * Vertical flow with a gap from the frozen spacing scale
 * (`components/bds/tokens.ts`). Use this instead of a Tailwind `space-y-*` or
 * `gap-*` utility for stacking children with rhythm between them, because the
 * spacing scale here is CSS custom properties, not Tailwind theme values, and
 * a Tailwind spacing utility would silently drift from it.
 *
 * `gap` takes a `SpaceToken` (imported, not redefined here), so an invalid
 * token is a compile-time error rather than a silent fallback. Defaults to
 * `"md"`.
 */
export function Stack({
  gap = "md",
  as: Component = "div",
  className,
  children,
}: {
  gap?: SpaceToken;
  as?: "div" | "ul" | "ol";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Component className={clsx("flex flex-col", className)} style={{ gap: `var(--space-${gap})` }}>
      {children}
    </Component>
  );
}
