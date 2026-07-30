import clsx from "clsx";

/**
 * Three-column page grid, after the GOV.UK grid: a 30px gutter, three equal
 * tracks from `md` up, and everything stacked below that.
 *
 * Content does not usually want three equal columns, it wants a wide reading
 * column and a narrower rail beside it, so `GridMain` spans two tracks and
 * `GridAside` takes the third. Building it out of thirds rather than hard
 * two-thirds/one-third widths keeps the real three-column system available for
 * anything that does want equal columns.
 */
export default function GridRow({
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
