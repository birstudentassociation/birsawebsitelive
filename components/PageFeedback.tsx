"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeHref, type Locale } from "@/lib/i18n";

export type PageFeedbackProps = {
  locale: Locale;
  prompt: string;
  report: string;
};

/**
 * GOV.UK-style "report a problem with this page" prompt, shown site-wide just
 * above the footer. It's a plain link (works without JavaScript) to the contact
 * page, pre-selecting the "problem" category and carrying the current path so a
 * report is attributable to the page it came from. Wrapped in a labelled
 * `<section>` so the content sits inside a landmark region.
 */
export default function PageFeedback({ locale, prompt, report }: PageFeedbackProps) {
  const pathname = usePathname();
  const href = `${localeHref(locale, "/contact")}?category=problem&from=${encodeURIComponent(pathname)}`;

  return (
    <section aria-label={prompt} className="border-t border-line">
      <div className="wrap py-6">
        <p className="text-sm text-muted">
          {prompt}{" "}
          <Link
            href={href}
            className="font-semibold text-brand-deep underline hover:text-brand-dark"
          >
            {report}
          </Link>
        </p>
      </div>
    </section>
  );
}
