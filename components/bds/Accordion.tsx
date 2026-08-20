import clsx from "clsx";

import Icon from "@/components/bds/Icon";
import { Text } from "@/components/bds/Type";

/**
 * BIRSA Design System: `Accordion` (REDESIGN-2.0 §4.3, content cluster).
 *
 * Question and answer pairs the reader skims: several disclosures, one
 * after another, such as an FAQ list. **One disclosure on its own is
 * `Details`, not a one-item `Accordion`.** See the matching note on
 * `Details`' TSDoc; the two are named separately in
 * `components/bds/manifest.ts` precisely so they do not collapse into one
 * component that has to guess which job it is doing.
 *
 * Never for content the reader needs all of: a disclosure hides its body by
 * default, so it is wrong for anything the reader cannot afford to miss,
 * such as a warning or a step of a form.
 *
 * Rebuilt on native `<details>`/`<summary>`, one per item, each independently
 * open or closed. BUILD-BRIEF-2.0 §7 asks for native disclosure "wherever
 * possible", and 1.0's JS-driven accordion is exactly the case this fixes:
 * the native element gives full keyboard operability (`Tab` to the summary,
 * `Enter` or `Space` to toggle) and correct behaviour with scripting off, for
 * free, with no `onClick` handler and no ARIA state to keep in sync by hand.
 * There is deliberately no "open all" control, because that control has no
 * meaning without JavaScript and this component promises to work without it.
 */
export type AccordionItem = {
  /** Stable key for the item, also used as the `<details>` key in the list. */
  id: string;
  summary: React.ReactNode;
  children: React.ReactNode;
  /** Open by default. */
  defaultOpen?: boolean;
};

export type AccordionProps = {
  items: AccordionItem[];
  className?: string;
};

export default function Accordion({ items, className }: AccordionProps) {
  return (
    <div
      className={clsx("divide-y divide-line rounded-lg border border-line bg-surface", className)}
    >
      {items.map((item) => (
        <details
          key={item.id}
          className="group first:rounded-t-lg last:rounded-b-lg open:bg-sunken/40"
          open={item.defaultOpen}
        >
          <summary className="focus-halo flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
            <Text as="span" step="body">
              {item.summary}
            </Text>
            <Icon
              name="chevron-down"
              className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <Text as="div" step="body-sm" className="border-t border-line px-4 py-3 text-ink">
            {item.children}
          </Text>
        </details>
      ))}
    </div>
  );
}
