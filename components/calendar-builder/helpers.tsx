import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import type { CategoryId } from "@/lib/calendar-builder/selection";
import type { Plural } from "@/content/calendar-builder/types";

/** Replaces `{name}` placeholders. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in vars ? String(vars[key]) : whole
  );
}

/** Picks the `one` or `other` form for a count and fills in `{n}`. */
export function plural(forms: Plural, n: number): string {
  return fill(n === 1 ? forms.one : forms.other, { n });
}

/** Renders `**bold**` spans, used for menu names inside guide steps. */
export function Marked({ text }: { text: string }): ReactNode {
  const parts = text.split("**");
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <strong key={index} className="font-semibold">
            {part}
          </strong>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

const intlLocale = (locale: Locale) => (locale === "th" ? "th-TH-u-ca-gregory" : "en-GB");

/** "Mon 14 Dec" for a `YYYY-MM-DD` key. */
export function shortDate(locale: Locale, key: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${key}T00:00:00Z`));
}

/** "December 2026" for a `YYYY-MM-DD` key. */
export function monthLabel(locale: Locale, key: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${key}T00:00:00Z`));
}

/** Icon shapes on a 20x20 grid, so a category never relies on colour alone. */
const SHAPES: Record<CategoryId, ReactNode> = {
  birsa: (
    <path d="M10 2.2 12.35 7.7 18.3 8.3 13.8 12.3 15.1 18.1 10 15 4.9 18.1 6.2 12.3 1.7 8.3 7.65 7.7Z" />
  ),
  holidays: (
    <>
      <path d="M2.5 7.2 10 2.5l7.5 4.7" />
      <path d="M3.3 7.6h13.4V16H3.3Z" />
      <path d="M5.8 7.6V16M9.9 7.6V16M14 7.6V16" />
      <path d="M2.5 16h15" />
    </>
  ),
  registration: (
    <>
      <path d="M5 3.5h10v13H5Z" />
      <path d="M7.5 7.5h5M7.5 10.5h5M7.5 13.5h3" />
    </>
  ),
  classes: (
    <>
      <circle cx="10" cy="10" r="7.2" />
      <path d="M10 5.8V10l3 2" />
    </>
  ),
};

export function CategoryIcon({ id, className }: { id: CategoryId; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={className ?? "h-4 w-4 shrink-0"}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {SHAPES[id]}
    </svg>
  );
}
