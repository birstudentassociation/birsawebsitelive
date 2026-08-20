import clsx from "clsx";

import { Heading, Text } from "@/components/bds/Type";
import { Wrap } from "@/components/bds/Layout";

/**
 * BIRSA Design System: `PageHeader` (REDESIGN-2.0 §4.3, content cluster).
 *
 * Every page opens with this: optional breadcrumbs, a single `<h1>` in the
 * display step, an optional muted lede, and a help slot in the same place on
 * every page. That last piece is `helpSlot`, and it implements WCAG 3.2.6
 * consistent help.
 *
 * `helpSlot` IS A REQUIRED PROP, not optional, and that is a deliberate
 * change from 1.0. 1.0's `PageHeader` already carried an (optional) help
 * slot and got the pattern right, but because nothing forced a caller to
 * pass one, most pages simply passed nothing (BUILD-BRIEF-2.0 §7,
 * REDESIGN-2.0 §8 heuristic 10: "Good, and underused"). A convention that
 * is correct but optional is a convention every page can silently skip, and
 * in a site of this size most of them did. Making the prop required moves
 * the guarantee from documentation, which nobody re-reads once a page ships,
 * to the type checker, which every page must satisfy before it compiles.
 * `tests/unit/bds-content.test.tsx` pins this down for the tests that can
 * actually check it (that `helpSlot` renders where passed); the absence
 * case is enforced at compile time, not at runtime, so it is `PageHeader`'s
 * TypeScript signature itself, not a test, that stops a page from shipping
 * with no help slot at all.
 *
 * A page with genuinely nothing to offer as help still has to decide what
 * that looks like, for example a link to the general contact page, rather
 * than silently rendering nothing.
 */
export type PageHeaderProps = {
  title: string;
  /** A short, muted standfirst under the title. Not a substitute for the page's own body copy. */
  lede?: string;
  breadcrumbs?: React.ReactNode;
  /**
   * WCAG 3.2.6 consistent help, in the same place on every page. Usually a
   * `Button` (variant `ghost` or `secondary`) or a plain link to a help
   * page, contact route, or `Details` with a short answer inline. Mandatory:
   * see this component's TSDoc for why.
   */
  helpSlot: React.ReactNode;
  className?: string;
};

export default function PageHeader({
  title,
  lede,
  breadcrumbs,
  helpSlot,
  className,
}: PageHeaderProps) {
  return (
    <section className={clsx("border-b border-line bg-cream", className)}>
      <Wrap className="flex flex-col gap-4 py-10 sm:py-14">
        {breadcrumbs}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[var(--measure)]">
            <Heading level={1}>{title}</Heading>
            {lede ? (
              <Text step="body" className="mt-3 text-muted">
                {lede}
              </Text>
            ) : null}
          </div>
          <div className="shrink-0">{helpSlot}</div>
        </div>
      </Wrap>
    </section>
  );
}
