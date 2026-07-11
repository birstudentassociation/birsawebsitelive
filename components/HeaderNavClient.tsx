"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { localeHref } from "@/lib/i18n";

export type NavItem = { href: string; label: string };

export type HeaderNavClientProps = {
  locale: Locale;
  items: NavItem[];
  /** The header's CTA (e.g. "Quick actions"), repeated here since the CTA
   * button in `Header.tsx` is hidden on narrow screens — this keeps it
   * reachable from the mobile menu too. */
  ctaItem: NavItem;
  /** dict.a11y.openMenu */
  openLabel: string;
  /** dict.a11y.closeMenu */
  closeLabel: string;
};

/**
 * Mobile menu disclosure: toggle button + collapsible panel duplicate of the
 * nav for small screens, closing itself whenever the route changes. Desktop
 * nav links live in `Header.tsx` as plain server-rendered `<Link>`s that
 * work with no JS at all; this file's `DesktopNavItem` named export only
 * layers on the `aria-current`/underline indicator as a progressive
 * enhancement once hydrated — it never gates navigation behind JS.
 */
export default function HeaderNavClient({
  locale,
  items,
  ctaItem,
  openLabel,
  closeLabel,
}: HeaderNavClientProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While open: Escape closes and returns focus to the toggle (2.4.3 focus
  // order); a pointer press outside the menu closes it. It stays a disclosure,
  // not a modal, so focus is not trapped.
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
    <div className="lg:hidden" ref={containerRef}>
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((value) => !value)}
        className="focus-halo border-line-strong text-ink flex h-11 min-w-11 items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 shrink-0">
          {open ? (
            <path
              d="m5 5 10 10M15 5 5 15"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M3 5.5h14M3 10h14M3 14.5h14"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
            />
          )}
        </svg>
        {/* Text hides on the narrowest screens (icon-only, aria-label above
            keeps the name) so the header reflows at 320px. */}
        <span className="hidden min-[400px]:inline">{open ? closeLabel : openLabel}</span>
      </button>

      {open ? (
        /* Full-width dropdown below the (sticky, i.e. positioned) header —
           absolutely positioned so it never stretches the header row. */
        <nav id={panelId} aria-label={openLabel} className="absolute inset-x-0 top-full px-3 pb-3">
          <ul className="border-line bg-surface flex flex-col gap-1 rounded-lg border p-2 shadow-lg">
            <li>
              <Link
                href={localeHref(locale, ctaItem.href)}
                className="border-ink flex min-h-11 items-center justify-center rounded-md border-[1.5px] px-3 py-2 text-sm font-semibold"
              >
                {ctaItem.label}
              </Link>
            </li>
            {items.map((item) => {
              const href = localeHref(locale, item.href);
              const current = pathname === href;
              return (
                <li key={item.href}>
                  <Link
                    href={href}
                    aria-current={current ? "page" : undefined}
                    className={`flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-semibold ${
                      current ? "bg-brand-tint text-brand-deep" : "text-ink hover:bg-sunken"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}

export type DesktopNavItemProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
};

/**
 * A single desktop nav link that marks itself `aria-current="page"` (with a
 * red underline via `activeClassName`) when its href matches the current
 * route. The link itself renders via `next/link` regardless of JS/hydration
 * state, so navigation never depends on this component running — only the
 * current-page indicator is a progressive enhancement.
 */
export function DesktopNavItem({
  href,
  children,
  className,
  activeClassName,
}: DesktopNavItemProps) {
  const pathname = usePathname();
  const current = pathname === href;

  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`${className ?? ""} ${current ? (activeClassName ?? "") : ""}`.trim()}
    >
      {children}
    </Link>
  );
}
