import Link from "next/link";
import clsx from "clsx";

import Icon from "@/components/bds/Icon";
import { Heading, Text, type HeadingLevel } from "@/components/bds/Type";

/**
 * BIRSA Design System: `NavList` (REDESIGN-2.0 §4.3, content cluster).
 *
 * Navigation link list: a single run of hairline-separated rows, each a
 * heading link over a short description. **Use this wherever the job is
 * "pick where to go next". `Card` stays for listings that carry dates, tags
 * or images.**
 *
 * That sentence is carried over verbatim from 1.0's `components/NavList.tsx`:
 * REDESIGN-2.0 §4.1 names it as the template every other `usage` rule in
 * `components/bds/manifest.ts` should read like, so it is repeated here
 * rather than reworded.
 *
 * The list is always one column. Width comes from the column it sits in,
 * which is `GridMain` on every page that uses it, so the rows keep a
 * comfortable measure without the list having to know anything about the
 * page.
 */
export type NavListProps = {
  className?: string;
  children: React.ReactNode;
};

export default function NavList({ className, children }: NavListProps) {
  return <ul className={clsx("border-t border-line", className)}>{children}</ul>;
}

export type NavListItemProps = {
  href: string;
  title: string;
  /** Small label above the title, for rows that need a category. */
  meta?: string;
  /** Heading level for the title. Pick the one that fits the page outline. */
  level?: HeadingLevel;
  /**
   * A short preview of what sits behind the link, listed under the
   * description. Plain text only: these are a taste of the destination, not
   * links of their own, so the row keeps a single click target.
   */
  topics?: { label: string; items: string[] };
  /**
   * A small muted line closing the row, for the kind of detail that trails
   * the content rather than labelling it: a last-updated date, a count. Use
   * `meta` instead for a category, which belongs above the title.
   */
  footnote?: string;
  children?: React.ReactNode;
};

/**
 * One row of a `NavList`. The title is the only link text, and it stretches
 * over the whole row so the entire row is clickable while the accessible
 * name stays just the title.
 */
export function NavListItem({
  href,
  title,
  meta,
  level = 3,
  topics,
  footnote,
  children,
}: NavListItemProps) {
  return (
    <li className="group relative border-b border-line">
      <div className="flex items-start gap-4 py-5 pr-2">
        <div className="min-w-0 flex-1">
          {meta ? (
            <Text
              as="span"
              step="body-sm"
              className="mb-1 block font-semibold text-muted uppercase"
            >
              {meta}
            </Text>
          ) : null}
          <Heading level={level} step="heading-3">
            <Link
              href={href}
              className="focus-highlight text-brand-deep underline decoration-1 underline-offset-4 after:absolute after:inset-0 hover:decoration-[3px]"
            >
              {title}
            </Link>
          </Heading>
          {children ? (
            <Text step="body-sm" className="mt-1 text-muted">
              {children}
            </Text>
          ) : null}
          {topics && topics.items.length > 0 ? (
            <>
              <Text step="body-sm" className="mt-2 font-semibold text-ink">
                {topics.label}
              </Text>
              <ul className="mt-1 flex flex-col gap-1">
                {topics.items.map((item) => (
                  <Text as="li" step="body-sm" key={item} className="text-muted">
                    {item}
                  </Text>
                ))}
              </ul>
            </>
          ) : null}
          {footnote ? (
            <Text step="body-sm" className="mt-2 text-muted">
              {footnote}
            </Text>
          ) : null}
        </div>
        <Icon
          name="chevron-right"
          className="mt-1.5 shrink-0 text-muted transition-transform duration-150 group-hover:translate-x-1"
        />
      </div>
    </li>
  );
}
