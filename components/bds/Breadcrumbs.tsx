import Link from "next/link";
import clsx from "clsx";

import type { Locale } from "@/lib/i18n";
import { localeHref } from "@/lib/i18n";
import Icon from "@/components/bds/Icon";
import { Text } from "@/components/bds/Type";

/**
 * BIRSA Design System: `Breadcrumbs` (REDESIGN-2.0 §3.5, §4.3, navigation
 * cluster).
 *
 * Where a page sits in the IA. Not a substitute for `BackLink` inside a
 * wizard: a breadcrumb says where you are in the site, a back link says how
 * to undo the last question, and a wizard step needs the second one.
 *
 * Carried over from 1.0's `components/Breadcrumbs.tsx`, rebuilt on `Icon`
 * and `Text` so it never emits a Tailwind font-size utility or an inline
 * `<svg>` outside the shared sprite (§4.2, defect D7).
 */
export type BreadcrumbItem = {
  label: string;
  /** Path relative to the locale root, e.g. "/help". Omit for the current page. */
  href?: string;
};

export type BreadcrumbsProps = {
  locale: Locale;
  items: BreadcrumbItem[];
  /** `dict.a11y.breadcrumb`: "Breadcrumb" (or its Thai equivalent). */
  label: string;
  className?: string;
  /** Recolour for placement on a dark/coloured band (e.g. an emergency hero). */
  onDark?: boolean;
};

export default function Breadcrumbs({ locale, items, label, className, onDark }: BreadcrumbsProps) {
  return (
    // data-breadcrumbs is a stable print-stylesheet hook (app/globals.css'
    // @media print block): aria-label is localized text, not a safe CSS
    // selector, and this component has no other identifying attribute.
    <nav aria-label={label} data-breadcrumbs className={className}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? (
                <Icon name="chevron-right" className={onDark ? "text-white/70" : "text-muted"} />
              ) : null}
              {isLast || !item.href ? (
                <span aria-current={isLast ? "page" : undefined}>
                  <Text
                    as="span"
                    step="body-sm"
                    className={clsx("font-medium", onDark ? "text-white" : "text-ink")}
                  >
                    {item.label}
                  </Text>
                </span>
              ) : (
                <Link
                  href={localeHref(locale, item.href)}
                  className={
                    onDark ? "text-white underline hover:text-white/80" : "hover:text-brand-deep"
                  }
                >
                  <Text as="span" step="body-sm" className={onDark ? undefined : "text-muted"}>
                    {item.label}
                  </Text>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
