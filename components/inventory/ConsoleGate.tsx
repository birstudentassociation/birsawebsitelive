"use client";

/**
 * Client-side log-out control for the inventory console chrome. Deletes the
 * per-officer session cookie via the API, then reloads so every server
 * component in the tree (layout + page) re-reads the now-cleared cookie.
 *
 * Auth gating itself is done server-side, inline in each console page via
 * `getSessionOfficer()`. This component only handles ending a session.
 */
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/Button";
import type { Locale } from "@/lib/i18n";

export type LogoutButtonProps = {
  locale: Locale;
  className?: string;
};

const copy: Record<Locale, { logout: string; loggingOut: string }> = {
  en: { logout: "Log out", loggingOut: "Logging out..." },
  th: { logout: "ออกจากระบบ", loggingOut: "กำลังออกจากระบบ..." },
};

export function LogoutButton({ locale, className }: LogoutButtonProps) {
  const t = copy[locale];
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/officer/session", { method: "DELETE" });
    } catch {
      // Ignore: reloading still lands back at the login screen if the
      // cookie is stale or the request failed.
    } finally {
      window.location.reload();
    }
  }

  return (
    <>
      <Button
        variant="secondary"
        onClick={handleLogout}
        disabled={loggingOut}
        className={className}
      >
        {loggingOut ? t.loggingOut : t.logout}
      </Button>
      {/* Announced without moving focus (WCAG 4.1.3): the button's visible
          label already changes, but a page reload follows almost
          immediately, so screen reader users need this spoken proactively
          rather than relying on them re-reading the button. */}
      {loggingOut ? (
        <span role="status" className="sr-only">
          {t.loggingOut}
        </span>
      ) : null}
    </>
  );
}

export type ConsoleNavItem = {
  /** Fully resolved, locale-prefixed href, e.g. `/en/officer/inventory`. */
  href: string;
  label: string;
};

export type ConsoleNavProps = {
  ariaLabel: string;
  items: ConsoleNavItem[];
};

/**
 * Client wrapper around the console's primary nav links so the active item
 * can be marked `aria-current="page"` from `usePathname()`. The dashboard
 * link only matches exactly (every other console route also starts with
 * `/officer/inventory`); every other link also matches its own subpages
 * (e.g. an item detail page still highlights "Catalogue").
 */
export function ConsoleNav({ ariaLabel, items }: ConsoleNavProps) {
  const pathname = usePathname() ?? "";

  return (
    <nav aria-label={ariaLabel} className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
      {items.map((item) => {
        const isDashboard = !item.href.includes("/inventory/");
        const current = isDashboard
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={current ? "page" : undefined}
            className="font-medium text-white hover:underline"
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
