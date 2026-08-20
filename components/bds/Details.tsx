import clsx from "clsx";

import Icon from "@/components/bds/Icon";
import { Text } from "@/components/bds/Type";

/**
 * BIRSA Design System: `Details` (REDESIGN-2.0 §4.3, content cluster).
 *
 * ONE disclosure of secondary detail: a single native `<details>` element
 * with a summary and a body. Use this for one aside a reader can choose to
 * open, such as "why we ask for this" beside a form field, or the technical
 * detail under a plain-language explanation.
 *
 * **Several of these in a row is `Accordion`, not a run of `Details`.** The
 * two components render almost the same markup, which is exactly why this
 * distinction has to be said explicitly in both TSDocs rather than left to
 * be inferred: reach for the wrong one and the difference disappears from
 * the page, then reappears as an inconsistency the next time someone builds
 * a third one either way. If a page is building a second `Details` next to
 * the first, stop and use `Accordion` instead.
 *
 * Needs no JavaScript: `<details>`/`<summary>` is natively keyboard operable
 * and disclosure works with scripting off, which is exactly what
 * BUILD-BRIEF-2.0 §7 asks for ("native `<details>`/`<summary>` for
 * disclosure wherever possible").
 */
export type DetailsProps = {
  summary: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Open by default. */
  defaultOpen?: boolean;
};

export default function Details({ summary, children, className, defaultOpen }: DetailsProps) {
  return (
    <details
      className={clsx("group rounded-lg border border-line bg-surface open:shadow-sm", className)}
      open={defaultOpen}
    >
      <summary className="focus-halo flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-4 py-3 font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
        <Text as="span" step="body">
          {summary}
        </Text>
        <Icon
          name="chevron-down"
          className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
        />
      </summary>
      <Text as="div" step="body-sm" className="border-t border-line px-4 py-3 text-ink">
        {children}
      </Text>
    </details>
  );
}
