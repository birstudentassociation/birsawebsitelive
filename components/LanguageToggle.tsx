"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { swapLocalePath } from "@/lib/i18n";

export type LanguageToggleProps = {
  locale: Locale;
  /** dict.switchTo: label of the language you can switch TO. */
  label: string;
  /** dict.switchToAria */
  ariaLabel: string;
};

/**
 * Plain `<a>` (not a button) linking to the same page with the locale
 * segment swapped, so the toggle still works with JavaScript disabled: the
 * navigation never depends on the cookie being set.
 *
 * The proxy no longer runs on locale-prefixed paths (see `proxy.ts`),
 * so it can't persist `NEXT_LOCALE` on the way through any more. Instead the
 * click handler below sets the cookie itself, client-side, as a progressive
 * enhancement, using the same attributes the proxy used to. Without this,
 * a visitor who switches language would land on the new locale for this one
 * page but get redirected back to their old locale the next time they hit an
 * unprefixed URL such as `/`.
 */
export default function LanguageToggle({ locale, label, ariaLabel }: LanguageToggleProps) {
  const pathname = usePathname();
  const target: Locale = locale === "th" ? "en" : "th";
  const href = swapLocalePath(pathname, target);
  // Compact label for narrow screens so the header reflows down to 320px
  // (WCAG 1.4.10) without dropping the toggle. aria-label stays descriptive.
  const shortLabel = target === "en" ? "EN" : "ไทย";

  return (
    <a
      href={href}
      hrefLang={target}
      aria-label={ariaLabel}
      onClick={() => {
        const oneYear = 60 * 60 * 24 * 365;
        document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=${oneYear}; SameSite=Lax`;
      }}
      className="focus-halo inline-flex h-11 items-center gap-1.5 rounded-full border border-line-strong px-3 text-sm font-semibold text-ink hover:bg-sunken sm:px-3.5"
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
      <span aria-hidden="true" className="sm:hidden">
        {shortLabel}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}
