import Link from "next/link";
import clsx from "clsx";

/**
 * Id of the page's `<h1>`. A one-question page points its field at it with
 * `aria-labelledby`, so the heading is the label and the question is read
 * once (GOV.UK "label as page heading").
 */
export const PAGE_HEADING_ID = "page-heading";

export type PageHeaderProps = {
  title: string;
  lede?: string;
  breadcrumbs?: React.ReactNode;
  /** Back link for a page inside a journey. GOV.UK puts it first, before the heading. Never with breadcrumbs. */
  backHref?: string;
  backLabel?: string;
  /** Small text above the heading, such as "Step 2 of 6" or the section name. */
  caption?: string;
  /** Optional consistently-placed help/action slot (WCAG 3.2.6 consistent help). */
  helpSlot?: React.ReactNode;
  className?: string;
};

/**
 * Consistent page-opening band: optional back link (journeys) or breadcrumbs
 * (content), an optional caption, a single `<h1>` in the display font,
 * optional muted lede, and an optional help/action slot. Used
 * at the top of every page so the opening pattern never changes.
 */
export default function PageHeader({
  title,
  lede,
  breadcrumbs,
  backHref,
  backLabel,
  caption,
  helpSlot,
  className,
}: PageHeaderProps) {
  return (
    <section className={clsx("border-b border-line bg-cream", className)}>
      <div className="wrap flex flex-col gap-4 py-10 sm:py-14">
        {backHref && backLabel ? (
          <Link
            href={backHref}
            className="inline-flex w-fit items-center gap-1.5 font-medium text-ink underline underline-offset-4 hover:text-brand-deep"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5 shrink-0">
              <path
                d="M12.5 4.5 7 10l5.5 5.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {backLabel}
          </Link>
        ) : null}
        {breadcrumbs}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[var(--measure)]">
            {caption ? <p className="mb-2 text-muted">{caption}</p> : null}
            <h1 id={PAGE_HEADING_ID} className="font-display text-3xl sm:text-4xl">
              {title}
            </h1>
            {lede ? <p className="mt-3 text-lg text-muted">{lede}</p> : null}
          </div>
          {helpSlot ? <div className="shrink-0">{helpSlot}</div> : null}
        </div>
      </div>
    </section>
  );
}
