import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getSessionOfficer } from "@/lib/inventory/auth";
import { getCustodian } from "@/lib/inventory/custodians";
import { ConsoleNav, LogoutButton } from "@/components/inventory/ConsoleGate";

/**
 * Force dynamic rendering for the entire officer console subtree. These pages
 * read the session cookie and live database rows, but `getSessionOfficer()`
 * short-circuits before touching `cookies()` when the database is unconfigured
 * (as it is during `next build`). Without this, Next would prerender the pages
 * as a logged-out, empty shell and serve that stale HTML in production instead
 * of rendering per request. Inherited by all nested officer routes.
 */
export const dynamic = "force-dynamic";

/**
 * Console shell for the inventory management suite. Never indexed: reachable
 * only by officers who know the URL and have an account. Auth gating happens
 * per-page (via `getSessionOfficer()`), not here, so `{children}` is always
 * rendered; this layout only supplies the header/nav chrome around it.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "คอนโซลเจ้าหน้าที่ CBEMS" : "CBEMS officer console";
  const description =
    locale === "th"
      ? "CBEMS ระบบจัดการครุภัณฑ์กลางของ BIR สำหรับเจ้าหน้าที่ใช้จัดการครุภัณฑ์และการยืม-คืน"
      : "CBEMS: the Central BIR Equipment Management System console for officers to manage inventory and loans.";

  const metadata = buildMetadata({ locale, title, description, path: "/officer/inventory" });
  return { ...metadata, robots: { index: false, follow: false } };
}

type NavCopy = {
  consoleName: string;
  /** aria-label for the primary console nav, distinct from the page's
   * breadcrumb trail, which uses `dict.a11y.breadcrumb`. */
  navLabel: string;
  dashboard: string;
  catalogue: string;
  loans: string;
  borrowers: string;
  reports: string;
  officers: string;
  organisations: string;
  /** Label for the scope-indicator pill shown to club custodians. */
  viewingLabel: string;
};

const navCopy: Record<Locale, NavCopy> = {
  en: {
    consoleName: "CBEMS",
    navLabel: "Officer console navigation",
    dashboard: "Dashboard",
    catalogue: "Catalogue",
    loans: "Loans",
    borrowers: "Borrowers",
    reports: "Reports",
    officers: "Officers",
    organisations: "Organisations",
    viewingLabel: "Viewing:",
  },
  th: {
    consoleName: "CBEMS (ระบบจัดการครุภัณฑ์กลาง BIR)",
    navLabel: "เมนูนำทางคอนโซลเจ้าหน้าที่",
    dashboard: "แดชบอร์ด",
    catalogue: "รายการครุภัณฑ์",
    loans: "การยืม-คืน",
    borrowers: "ผู้ยืม",
    reports: "รายงาน",
    officers: "เจ้าหน้าที่",
    organisations: "องค์กร/ชมรม",
    viewingLabel: "กำลังดู:",
  },
};

export default async function OfficerInventoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const t = navCopy[locale];

  const officer = await getSessionOfficer();

  // Club custodians only see their own club's data; BIRSA/global officers
  // (custodianId === null) manage the organisation directory itself.
  const isGlobalOfficer = !!officer && officer.custodianId === null;

  let scopeName: string | null = null;
  if (officer && officer.custodianId) {
    const custodian = await getCustodian(officer.custodianId);
    scopeName = custodian ? custodian.name[locale] : null;
  }

  const navItems = [
    { href: "/officer/inventory", label: t.dashboard },
    { href: "/officer/inventory/items", label: t.catalogue },
    { href: "/officer/inventory/loans", label: t.loans },
    { href: "/officer/inventory/borrowers", label: t.borrowers },
    { href: "/officer/inventory/reports", label: t.reports },
    { href: "/officer/inventory/officers", label: t.officers },
    ...(isGlobalOfficer ? [{ href: "/officer/inventory/custodians", label: t.organisations }] : []),
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-brand text-white">
        <div className="wrap flex flex-wrap items-center justify-between gap-4 py-4">
          <Link
            href={localeHref(locale, "/officer/inventory")}
            className="font-display text-lg font-semibold text-white"
          >
            {t.consoleName}
          </Link>

          {officer ? (
            <ConsoleNav
              ariaLabel={t.navLabel}
              items={navItems.map((item) => ({
                href: localeHref(locale, item.href),
                label: item.label,
              }))}
            />
          ) : null}

          {officer ? (
            <div className="flex items-center gap-3">
              {scopeName ? (
                <span className="rounded-full border border-white/40 bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                  {t.viewingLabel} {scopeName}
                </span>
              ) : null}
              <span className="text-sm opacity-90">{officer.name}</span>
              <LogoutButton locale={locale} className="border-white text-white hover:bg-white/10" />
            </div>
          ) : null}
        </div>
      </header>

      <div className="flex-1">{children}</div>
    </div>
  );
}
