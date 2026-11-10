"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "@/components/icons/Icon";
import { localeHref, type Locale } from "@/lib/i18n";

export type MobileTabBarLabels = {
  label: string;
  today: string;
  dates: string;
  services: string;
  help: string;
};

export type MobileTabBarProps = {
  locale: Locale;
  labels: MobileTabBarLabels;
};

type Tab = { path: string; icon: IconName; label: string; exact: boolean };

export default function MobileTabBar({ locale, labels }: MobileTabBarProps) {
  const pathname = usePathname() ?? "";
  const tabs: Tab[] = [
    { path: "/", icon: "home", label: labels.today, exact: true },
    { path: "/dates", icon: "calendar", label: labels.dates, exact: false },
    { path: "/services", icon: "grid", label: labels.services, exact: false },
    { path: "/contact", icon: "help", label: labels.help, exact: false },
  ];

  return (
    <nav
      aria-label={labels.label}
      className="mobile-tab-bar border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="flex">
        {tabs.map((tab) => {
          const href = localeHref(locale, tab.path);
          const current = tab.exact
            ? pathname === href || pathname === `${href}/`
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={tab.path} className="w-1/4">
              <Link
                href={href}
                aria-current={current ? "page" : undefined}
                className={`focus-halo relative flex min-h-[3.25rem] flex-col items-center justify-center gap-1 px-1 py-1.5 text-[0.74rem] leading-tight font-medium ${
                  current ? "text-brand-deep" : "text-muted"
                }`}
              >
                {current ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-4 top-0 h-[3px] rounded-b-full bg-brand-deep"
                  />
                ) : null}
                <Icon name={tab.icon} className="h-[22px] w-[22px]" />
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
