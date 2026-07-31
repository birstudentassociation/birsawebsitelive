import Link from "next/link";
import clsx from "clsx";

export type NavListProps = {
  className?: string;
  children: React.ReactNode;
};

/**
 * Navigation link list: a single run of hairline-separated rows, each a
 * heading link over a short description. Use this wherever the job is "pick
 * where to go next". `Card` stays for listings that carry dates, tags or
 * images.
 *
 * The list is always one column. Width comes from the column it sits in, which
 * is `GridMain` on every page that uses it, so the rows keep a comfortable
 * measure without the list having to know anything about the page.
 */
export default function NavList({ className, children }: NavListProps) {
  return <ul className={clsx("border-line border-t", className)}>{children}</ul>;
}

export type NavListItemProps = {
  href: string;
  title: string;
  /** Small uppercase line above the title, for rows that need a category. */
  meta?: string;
  /** Heading level for the title. Pick the one that fits the page outline. */
  as?: "h2" | "h3" | "h4";
  /** A short preview of what sits behind the link, listed under the
   * description. Plain text only: these are a taste of the destination, not
   * links of their own, so the row keeps a single click target. */
  topics?: { label: string; items: string[] };
  /** A small muted line closing the row, for the kind of detail that trails
   * the content rather than labelling it: a last-updated date, a count. Use
   * `meta` instead for a category, which belongs above the title. */
  footnote?: string;
  children?: React.ReactNode;
};

/**
 * One row of a `NavList`. The title is the only link text, and it stretches
 * over the whole row so the entire row is clickable while the accessible name
 * stays just the title.
 */
export function NavListItem({
  href,
  title,
  meta,
  as: Heading = "h3",
  topics,
  footnote,
  children,
}: NavListItemProps) {
  return (
    <li className="border-line group relative border-b">
      <div className="flex items-start gap-4 py-5 pr-2">
        <div className="min-w-0 flex-1">
          {meta ? (
            <span className="text-muted mb-1 block text-xs font-semibold tracking-wide uppercase">
              {meta}
            </span>
          ) : null}
          <Heading className="font-display text-lg leading-snug">
            <Link
              href={href}
              className="text-brand-deep focus-highlight underline decoration-1 underline-offset-4 after:absolute after:inset-0 hover:decoration-[3px]"
            >
              {title}
            </Link>
          </Heading>
          {children ? <p className="text-muted mt-1 text-sm leading-relaxed">{children}</p> : null}
          {topics && topics.items.length > 0 ? (
            <>
              <p className="text-ink mt-2 text-sm font-semibold">{topics.label}</p>
              <ul className="text-muted mt-1 flex flex-col gap-1 text-sm">
                {topics.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}
          {footnote ? <p className="text-muted mt-2 text-xs">{footnote}</p> : null}
        </div>
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 16 16"
          className="text-muted mt-1.5 h-4 w-4 shrink-0 transition-transform duration-150 group-hover:translate-x-1"
        >
          <path
            d="M5 2l6 6-6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </li>
  );
}
