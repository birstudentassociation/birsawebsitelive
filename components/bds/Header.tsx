"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import type { Locale } from "@/lib/i18n";
import { getDictionary, localeHref } from "@/lib/i18n";
import Icon from "@/components/bds/Icon";
import { Text } from "@/components/bds/Type";
import LanguageToggle from "@/components/bds/LanguageToggle";
import ThemeToggle from "@/components/bds/ThemeToggle";

/**
 * BIRSA Design System: `Header` (REDESIGN-2.0 §3.2, §3.3, §3.5, §4.3,
 * navigation cluster).
 *
 * Site chrome, once per page.
 *
 * NAVIGATION IS CONTENT, NOT CODE (§3.3). "An editable site whose navigation
 * is not editable is not an editable site", and the CMS that will hold this
 * is gated (docs/DECISIONS-2.0.md gate 1, REDESIGN-2.0 §6.2). Until it
 * ships, `nav` is a typed PROP rather than a hardcoded array, and
 * `defaultPrimaryNav` below is the seam: it is the exact shape a Sanity
 * query will eventually return, derived from `docs/ROUTE-MAP-2.0.md`'s five
 * primary destinations (§3.2). Whoever wires the CMS replaces the default
 * value passed to `nav`, not this component, and not its rendering.
 *
 * WHY THE WHOLE FILE IS A CLIENT COMPONENT. 1.0 split this into
 * `components/Header.tsx` (server) and `components/HeaderNavClient.tsx`
 * (the mobile disclosure, client). This wave's brief owns exactly one file
 * here, so the split is not available; the interactive mobile disclosure
 * (aria-expanded/aria-controls, Escape, outside-press) has to live in the
 * same module as the rest of the header, and a "use client" directive is
 * file-scoped, not per-component. Next.js still server-renders a client
 * component's first paint, so this costs nothing for a no-JS visitor; it
 * only changes which file the interactivity lives in. Flagged in this
 * wave's report as a seam a later wave may want to split back out once it
 * owns a second file here.
 *
 * WORKS WITH JAVASCRIPT OFF (BUILD-BRIEF-2.0 §7). The mobile nav panel is
 * always in the DOM; its `hidden` attribute reflects `open`, and `open`
 * starts `true`. A reader with no JavaScript therefore sees the panel
 * expanded from first paint, with every link reachable, exactly the
 * govuk-frontend `header` component's own documented answer to "the toggle
 * cannot work without JS, so default to showing everything". Once this
 * component mounts, an effect immediately collapses the panel, because JS
 * is now running and the toggle button can reopen it. This is deliberate,
 * not a bug: without it, a no-JS visitor would see a `hidden` panel with no
 * way to un-hide it.
 */

export type NavLink = {
  /** Path relative to the locale root, e.g. "/do". Passed through `localeHref`. */
  href: string;
  label: { th: string; en: string };
};

/**
 * The five primary destinations from `docs/ROUTE-MAP-2.0.md` §3.2. This is
 * the default value of the `nav` prop, and therefore the seam the CMS
 * fills: a future edit here is "the CMS is not up yet", never "the copy
 * changed", because once Sanity exists this array stops being read at all.
 */
export const defaultPrimaryNav: NavLink[] = [
  { href: "/do", label: { en: "Do something", th: "ทำเรื่อง" } },
  { href: "/help", label: { en: "Get help", th: "ขอความช่วยเหลือ" } },
  { href: "/whats-on", label: { en: "What's on", th: "ข่าวและกิจกรรม" } },
  { href: "/studies", label: { en: "Your studies", th: "เรื่องเรียน" } },
  { href: "/about", label: { en: "About BIRSA", th: "เกี่ยวกับ BIRSA" } },
];

export type HeaderProps = {
  locale: Locale;
  /** Defaults to `defaultPrimaryNav`. See the file header note on why this is a prop. */
  nav?: NavLink[];
  /**
   * Optional search UI. `docs/ROUTE-MAP-2.0.md` keeps search a header
   * utility, but no `bds/` search component exists in
   * `components/bds/manifest.ts`'s navigation cluster to render one; this
   * slot lets whichever wave builds it compose the result in without
   * touching this file again.
   */
  searchSlot?: React.ReactNode;
};

function NavLinkList({
  locale,
  nav,
  pathname,
  variant,
}: {
  locale: Locale;
  nav: NavLink[];
  pathname: string;
  variant: "desktop" | "mobile";
}) {
  return (
    <ul className={variant === "desktop" ? "flex items-center gap-1" : "flex flex-col gap-1 p-2"}>
      {nav.map((item) => {
        const href = localeHref(locale, item.href);
        const current = pathname === href;
        return (
          <li key={item.href}>
            <Link
              href={href}
              aria-current={current ? "page" : undefined}
              className={
                variant === "desktop"
                  ? clsx(
                      "flex h-[var(--bds-header-height)] items-center border-b-2 px-3 font-semibold",
                      current
                        ? "border-brand text-brand-deep"
                        : "border-transparent text-ink hover:text-brand-deep"
                    )
                  : clsx(
                      "flex min-h-11 items-center rounded-md px-3 font-semibold",
                      current ? "bg-brand-tint text-brand-deep" : "text-ink hover:bg-sunken"
                    )
              }
            >
              <Text as="span" step="body">
                {item.label[locale]}
              </Text>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function Header({ locale, nav = defaultPrimaryNav, searchSlot }: HeaderProps) {
  const dict = getDictionary(locale);
  const pathname = usePathname();
  // Starts open: see the file header note on working with JavaScript off.
  const [open, setOpen] = useState(true);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // JS is running now, so the toggle can reopen this: collapse it.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 h-[var(--bds-header-height)] border-b border-line bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
      <div className="wrap flex h-full items-center justify-between gap-4 sm:gap-6">
        <Link
          href={localeHref(locale, "/")}
          aria-label={dict.a11y.logoHome}
          className="focus-halo flex shrink-0 items-center gap-2.5 rounded-md"
        >
          <Image src="/birsa-logo.png" alt="" width={36} height={36} className="h-9 w-9" priority />
          <span aria-hidden="true" className="hidden min-[400px]:inline">
            <Text as="span" step="heading-3" className="font-display">
              {dict.site.name}
            </Text>
          </span>
        </Link>

        {/* Always visible at lg+; hidden (display:none) below it, so it
            never collides with the mobile panel below in the a11y tree. */}
        <nav aria-label={dict.a11y.primaryNav} className="hidden lg:block">
          <NavLinkList locale={locale} nav={nav} pathname={pathname} variant="desktop" />
        </nav>

        <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-3">
          {searchSlot}
          <ThemeToggle
            neutralLabel={dict.a11y.theme}
            darkLabel={dict.a11y.themeDark}
            lightLabel={dict.a11y.themeLight}
          />
          <LanguageToggle locale={locale} label={dict.switchTo} ariaLabel={dict.switchToAria} />

          <div className="relative lg:hidden" ref={containerRef}>
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              aria-label={open ? dict.a11y.closeMenu : dict.a11y.openMenu}
              onClick={() => setOpen((value) => !value)}
              className="focus-halo flex h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-input-border px-3 font-semibold text-ink"
            >
              <Icon name={open ? "close" : "menu"} />
              <Text as="span" step="body-sm" className="hidden md:inline">
                {open ? dict.a11y.closeMenu : dict.a11y.openMenu}
              </Text>
            </button>

            {/* Always rendered: `hidden` mirrors `open`, so a no-JS visitor
                (where `open` never leaves its initial `true`) still reaches
                every link. See the file header note. */}
            <nav
              id={panelId}
              aria-label={dict.a11y.primaryNav}
              hidden={!open}
              className="absolute inset-x-0 top-full px-3 pb-3"
            >
              <div className="rounded-lg border border-line bg-surface shadow-lg">
                <NavLinkList locale={locale} nav={nav} pathname={pathname} variant="mobile" />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
