"use client";

import { usePathname } from "next/navigation";

import type { Locale } from "@/lib/i18n";
import { swapLocalePath } from "@/lib/i18n";
import Icon from "@/components/bds/Icon";
import { Text } from "@/components/bds/Type";

/**
 * BIRSA Design System: `LanguageToggle` (REDESIGN-2.0 §3.5, §4.3, navigation
 * cluster).
 *
 * A plain link to the same page in the other language. Never a dropdown,
 * and never a flag: a flag is a country, not a language, and Thai and
 * English are not spoken along a national border here (§4.3 usage rule).
 *
 * Carried over from 1.0's `components/LanguageToggle.tsx` unchanged in
 * behaviour: a real `<a>` (never a `<button>`) built with `swapLocalePath`,
 * so it keeps working with JavaScript off. The click handler is a
 * progressive enhancement only, setting the `NEXT_LOCALE` cookie so a later
 * unprefixed URL lands back on the language just chosen; navigation itself
 * never depends on it running.
 */
export type LanguageToggleProps = {
  locale: Locale;
  /** `dict.switchTo`: the label of the language you can switch TO (chrome namespace, read-only here). */
  label: string;
  /** `dict.switchToAria`. */
  ariaLabel: string;
  className?: string;
};

export default function LanguageToggle({ locale, label, ariaLabel, className }: LanguageToggleProps) {
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
      className={`focus-halo inline-flex h-11 items-center gap-1.5 rounded-full border border-input-border px-3 hover:bg-sunken sm:px-3.5 ${className ?? ""}`}
    >
      <Icon name="globe" />
      <span aria-hidden="true" className="sm:hidden">
        <Text as="span" step="body-sm">
          {shortLabel}
        </Text>
      </span>
      <Text as="span" step="body-sm" className="hidden sm:inline">
        {label}
      </Text>
    </a>
  );
}
