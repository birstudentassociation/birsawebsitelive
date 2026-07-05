import clsx from "clsx";

export type PageHeaderProps = {
  title: string;
  lede?: string;
  breadcrumbs?: React.ReactNode;
  /** Optional consistently-placed help/action slot (WCAG 3.2.6 consistent help). */
  helpSlot?: React.ReactNode;
  className?: string;
};

/**
 * Consistent page-opening band: optional breadcrumbs, a single `<h1>` in the
 * display font, optional muted lede, and an optional help/action slot. Used
 * at the top of every page so the opening pattern never changes.
 */
export default function PageHeader({
  title,
  lede,
  breadcrumbs,
  helpSlot,
  className,
}: PageHeaderProps) {
  return (
    <section className={clsx("border-line bg-cream border-b", className)}>
      <div className="wrap flex flex-col gap-4 py-10 sm:py-14">
        {breadcrumbs}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[var(--measure)]">
            <h1 className="font-display text-3xl sm:text-4xl">{title}</h1>
            {lede ? <p className="text-muted mt-3 text-lg">{lede}</p> : null}
          </div>
          {helpSlot ? <div className="shrink-0">{helpSlot}</div> : null}
        </div>
      </div>
    </section>
  );
}
