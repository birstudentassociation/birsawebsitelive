import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localeHref } from "@/lib/i18n";

export type BreadcrumbItem = {
  label: string;
  /** Path relative to the locale root, e.g. "/news". Omit for the current page. */
  href?: string;
};

export type BreadcrumbsProps = {
  locale: Locale;
  items: BreadcrumbItem[];
  /** dict.a11y.breadcrumb */
  label: string;
  className?: string;
};

/** Chevron separator, decorative only. */
function Chevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="text-muted h-3.5 w-3.5 shrink-0">
      <path
        d="m7.5 4.5 5 5.5-5 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Breadcrumbs({ locale, items, label, className }: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className={className}>
      <ol className="text-muted flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? <Chevron /> : null}
              {isLast || !item.href ? (
                <span aria-current={isLast ? "page" : undefined} className="text-ink font-medium">
                  {item.label}
                </span>
              ) : (
                <Link href={localeHref(locale, item.href)} className="hover:text-brand-deep">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
