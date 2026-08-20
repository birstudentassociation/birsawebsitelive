"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { localeHref, type Locale } from "@/lib/i18n";
import { Text } from "@/components/bds/Type";
import { Wrap } from "@/components/bds/Layout";

/**
 * BIRSA Design System: `PageFeedback` (REDESIGN-2.0 §4.3, content cluster).
 *
 * Every page, shown just above the footer: a GOV.UK-style "report a problem
 * with this page" prompt. One of the three data sources REDESIGN-2.0 §2
 * principle 3 permits for finding out what to fix next, alongside search
 * queries and the top-tasks data already named in §8.2.
 *
 * NEVER on a welfare, reporting or rights page. Those pages exist because a
 * student is already in a difficult moment, and REDESIGN-2.0 §4.4's
 * `ExitThisPage` exists for the same pages precisely because being observed
 * is a real risk there. A feedback prompt asking "is there a problem with
 * this page" beneath a harassment report form sends the opposite signal
 * from the one the page is trying to send, and the fact that this is a
 * plain link that records nothing on its own does not change how it reads
 * to the student.
 *
 * A plain link, not a client-side submit: it works with JavaScript off
 * (BUILD-BRIEF-2.0 §7) and never collects anything itself. It points at the
 * contact page with the "problem" category pre-selected and the current
 * path attached, so a report is attributable to the page it came from
 * without this component holding any state of its own.
 *
 * `prompt` and `report` are `dict.feedback.prompt` / `dict.feedback.report`
 * (the `chrome` namespace this cluster owns), passed as props rather than
 * read from `getDictionary` inside this component, the same pattern
 * `ExternalLink`'s `newTabLabel` uses: it keeps the component's own props
 * the single place its copy comes from, and it means `locale` is the only
 * dictionary-shaped decision this component makes for itself.
 *
 * Client component only because of `usePathname`; there is no other
 * interactivity, and the rendered link is a real `<a>` throughout.
 */
export type PageFeedbackProps = {
  locale: Locale;
  /** `dict.feedback.prompt`: e.g. "Is there a problem with this page?" */
  prompt: string;
  /** `dict.feedback.report`: the visible link text, e.g. "Report a problem with this page". */
  report: string;
  className?: string;
};

export default function PageFeedback({ locale, prompt, report, className }: PageFeedbackProps) {
  const pathname = usePathname();
  const href = `${localeHref(locale, "/contact")}?category=problem&from=${encodeURIComponent(pathname)}`;

  return (
    <section aria-label={prompt} className={clsx("border-t border-line", className)}>
      <Wrap className="py-6">
        <Text step="body-sm" className="text-muted">
          {prompt}{" "}
          <Link
            href={href}
            className="focus-halo font-semibold text-brand-deep underline hover:text-brand-dark"
          >
            {report}
          </Link>
        </Text>
      </Wrap>
    </section>
  );
}
