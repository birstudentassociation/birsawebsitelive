import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary, localeHref } from "@/lib/i18n";
import Button from "@/components/Button";
import LanguageNav from "@/components/LanguageNav";
import ThemeToggle from "@/components/ThemeToggle";
import HeaderNavClient, { DesktopNavItem } from "@/components/HeaderNavClient";
import HeaderSearch from "@/components/search/HeaderSearch";

export type HeaderProps = {
  locale: Locale;
};

/**
 * Site header in two rows, after the GOV.UK Generic header and Service
 * navigation pattern. The brand row carries only identity and the language
 * choice; the navigation row carries the sections and the site-wide tools
 * (search, theme, Quick actions). On small screens the sections move into the
 * menu disclosure.
 *
 * Sticky only on screens at least 32rem tall. Shorter viewports (a phone in
 * landscape, or any screen at 300 to 400% zoom) get a header that scrolls
 * away, because a sticky bar there takes a large share of the screen and can
 * cover the focused control (WCAG 2.4.11 Focus not obscured).
 */
export default function Header({ locale }: HeaderProps) {
  const dict = getDictionary(locale);
  const names = { en: getDictionary("en").langLabel, th: getDictionary("th").langLabel };

  return (
    <header className="relative z-40 border-b border-line bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80 [@media(min-height:32rem)]:sticky [@media(min-height:32rem)]:top-0">
      <div className="wrap flex h-14 items-center justify-between gap-4">
        <Link
          href={localeHref(locale, "/")}
          aria-label={dict.a11y.logoHome}
          className="focus-halo flex shrink-0 items-center gap-2.5 rounded-md"
        >
          <Image src="/birsa-logo.png" alt="" width={36} height={36} className="h-9 w-9" priority />
          <span aria-hidden="true" className="font-display text-lg font-semibold text-ink">
            {dict.site.name}
          </span>
        </Link>
        <LanguageNav
          locale={locale}
          label={dict.a11y.languageNav}
          names={names}
          switchLabel={dict.switchToAria}
        />
      </div>

      <div className="border-t border-line">
        <div className="wrap flex h-14 items-center justify-between gap-3">
          <nav aria-label={dict.a11y.primaryNav} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {dict.nav.map((item) => (
                <li key={item.href}>
                  <DesktopNavItem
                    href={localeHref(locale, item.href)}
                    className="flex h-14 items-center border-b-2 border-transparent px-3 font-semibold whitespace-nowrap text-ink hover:text-brand-deep"
                    activeClassName="!border-brand !text-brand-deep"
                  >
                    {item.label}
                  </DesktopNavItem>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:gap-3">
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
            <HeaderNavClient
              locale={locale}
              items={dict.nav}
              ctaItem={dict.headerCta}
              openLabel={dict.a11y.openMenu}
              closeLabel={dict.a11y.closeMenu}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
