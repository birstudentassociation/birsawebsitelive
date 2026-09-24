"use client";

import { usePathname } from "next/navigation";
import { locales, swapLocalePath, type Locale } from "@/lib/i18n";

export type LanguageNavProps = {
  locale: Locale;
  /** dict.a11y.languageNav, in the page's language. */
  label: string;
  /** Each language's name in that language: { en: "English", th: "ไทย" }. */
  names: Record<Locale, string>;
  /** dict.switchToAria: hidden text, written in the language being switched to. */
  switchLabel: string;
};

/**
 * Language navigation, after the GOV.UK Language navigation component: both
 * languages listed by their own names, each tagged with its `lang` so it is
 * pronounced correctly, the current one marked, and the landmark labelled in
 * the page's language. The link to the other language carries hidden text
 * written in that language ("Change the language to English").
 *
 * Plain `<a>` links, so switching works with JavaScript off. With JavaScript,
 * the click handler carries the query string and hash across, so nobody
 * loses their place or anything they entered in the address bar, and
 * remembers the choice in the `NEXT_LOCALE` cookie for unprefixed URLs such
 * as `/`.
 */
export default function LanguageNav({ locale, label, names, switchLabel }: LanguageNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={label}>
      <ul className="flex items-center gap-1">
        {locales.map((target) => {
          const name = names[target];
          if (target === locale) {
            return (
              <li key={target}>
                <span
                  lang={target}
                  aria-current="true"
                  className="inline-flex h-11 items-center border-b-2 border-brand px-2 font-semibold text-ink"
                >
                  {name}
                </span>
              </li>
            );
          }
          const href = swapLocalePath(pathname, target);
          return (
            <li key={target}>
              <a
                href={href}
                hrefLang={target}
                lang={target}
                onClick={(event) => {
                  event.currentTarget.href = `${href}${window.location.search}${window.location.hash}`;
                  const oneYear = 60 * 60 * 24 * 365;
                  document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=${oneYear}; SameSite=Lax`;
                }}
                className="inline-flex h-11 items-center px-2 font-semibold text-brand-deep underline underline-offset-4 hover:text-brand-dark"
              >
                <span className="sr-only">{switchLabel}</span>
                <span aria-hidden="true">{name}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
