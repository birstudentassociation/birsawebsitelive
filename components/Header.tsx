import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary, localeHref } from "@/lib/i18n";
import Button from "@/components/Button";
import LanguageToggle from "@/components/LanguageToggle";
import HeaderNavClient, { DesktopNavItem } from "@/components/HeaderNavClient";

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
    <header className="border-line bg-cream/95 supports-[backdrop-filter]:bg-cream/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4 sm:gap-6">
        <Link
          href={localeHref(locale, "/")}
          aria-label={dict.a11y.logoHome}
          className="focus-halo flex shrink-0 items-center gap-2.5 rounded-md"
        >
          <Image src="/birsa-logo.png" alt="" width={36} height={36} className="h-9 w-9" priority />
          {/* Wordmark hides on the narrowest screens so the header reflows
              at 320px; the link's aria-label always carries the name. */}
          <span
            aria-hidden="true"
            className="font-display text-ink hidden text-lg font-semibold min-[360px]:inline"
          >
            {dict.site.name}
          </span>
        </Link>

        <nav aria-label={dict.a11y.primaryNav} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {dict.nav.map((item) => (
              <li key={item.href}>
                <DesktopNavItem
                  href={localeHref(locale, item.href)}
                  className="text-ink hover:text-brand-deep flex h-16 items-center border-b-2 border-transparent px-3 text-[0.95rem] font-semibold"
                  activeClassName="!border-brand !text-brand-deep"
                >
                  {item.label}
                </DesktopNavItem>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-3">
          <Link
            href={localeHref(locale, "/search")}
            aria-label={dict.actions.search}
            className="focus-halo border-line-strong text-ink hover:bg-sunken flex h-11 w-11 shrink-0 items-center justify-center rounded-full border"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4.5 w-4.5 shrink-0">
              <circle cx="9" cy="9" r="6.25" fill="none" stroke="currentColor" strokeWidth={1.75} />
              <path d="m17 17-3.7-3.7" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
            </svg>
          </Link>
          {/* Wrapper handles the responsive hiding — Button's own display
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
