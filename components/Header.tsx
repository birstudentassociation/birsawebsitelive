import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary, localeHref } from "@/lib/i18n";
import Button from "@/components/Button";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import HeaderNavClient, { DesktopNavItem } from "@/components/HeaderNavClient";
import HeaderSearch from "@/components/search/HeaderSearch";

export type HeaderProps = {
  locale: Locale;
};

/**
 * Site header: cream surface, bottom hairline, sticky top. Logo + wordmark,
 * primary nav (plain links; current page gets `aria-current` + red
 * underline as a hydrated enhancement), a prominent "Quick actions" CTA,
 * the language toggle, and the mobile disclosure menu.
 */
export default function Header({ locale }: HeaderProps) {
  const dict = getDictionary(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
      <div className="wrap flex h-16 items-center justify-between gap-4 sm:gap-6">
        <Link
          href={localeHref(locale, "/")}
          aria-label={dict.a11y.logoHome}
          className="focus-halo flex shrink-0 items-center gap-2.5 rounded-md"
        >
          <Image src="/birsa-logo.png" alt="" width={36} height={36} className="h-9 w-9" priority />
          {/* Wordmark hides on narrow screens so the header reflows at 320px
              with room to spare in the 360-400px band; the link's aria-label
              always carries the name. */}
          <span
            aria-hidden="true"
            className="hidden font-display text-lg font-semibold text-ink min-[400px]:inline"
          >
            {dict.site.name}
          </span>
        </Link>

        <nav aria-label={dict.a11y.primaryNav} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {dict.nav.map((item) => (
              <li key={item.href}>
                <DesktopNavItem
                  href={localeHref(locale, item.href)}
                  className="flex h-16 items-center border-b-2 border-transparent px-3 text-[0.95rem] font-semibold text-ink hover:text-brand-deep"
                  activeClassName="!border-brand !text-brand-deep"
                >
                  {item.label}
                </DesktopNavItem>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-3">
          <HeaderSearch
            locale={locale}
            href={localeHref(locale, "/search")}
            label={dict.actions.search}
            closeLabel={dict.a11y.closeSearch}
            searchLabel={dict.actions.searchPlaceholder}
            placeholder={dict.actions.searchPlaceholder}
            submitLabel={dict.actions.search}
          />
          <ThemeToggle
            neutralLabel={dict.a11y.theme}
            darkLabel={dict.a11y.themeDark}
            lightLabel={dict.a11y.themeLight}
          />
          {/* Wrapper handles the responsive hiding: Button's own display
              utility would win a class-level `hidden` conflict. */}
          <div className="hidden sm:block">
            <Button href={localeHref(locale, dict.headerCta.href)} variant="secondary">
              {dict.headerCta.label}
            </Button>
          </div>
          <LanguageToggle locale={locale} label={dict.switchTo} ariaLabel={dict.switchToAria} />
          <HeaderNavClient
            locale={locale}
            items={dict.nav}
            ctaItem={dict.headerCta}
            openLabel={dict.a11y.openMenu}
            closeLabel={dict.a11y.closeMenu}
          />
        </div>
      </div>
    </header>
  );
}
