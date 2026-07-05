"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { swapLocalePath } from "@/lib/i18n";

export type LanguageToggleProps = {
  locale: Locale;
  /** dict.switchTo — label of the language you can switch TO. */
  label: string;
  /** dict.switchToAria */
  ariaLabel: string;
};

/**
 * Plain `<a>` (not a button) linking to the same page with the locale
 * segment swapped. Sets nothing itself — the middleware persists the
 * `NEXT_LOCALE` cookie once the link is followed.
 */
export default function LanguageToggle({ locale, label, ariaLabel }: LanguageToggleProps) {
  const pathname = usePathname();
  const target: Locale = locale === "th" ? "en" : "th";
  const href = swapLocalePath(pathname, target);

  return (
    <a
      href={href}
      hrefLang={target}
      aria-label={ariaLabel}
      className="focus-halo border-line-strong text-ink hover:bg-sunken inline-flex h-11 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold"
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0">
        <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth={1.5} />
        <path
          d="M2 10h16M10 2c2.2 2.2 3.4 5 3.4 8s-1.2 5.8-3.4 8c-2.2-2.2-3.4-5-3.4-8S7.8 4.2 10 2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        />
      </svg>
      {label}
    </a>
  );
}
