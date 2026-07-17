/**
 * i18n plumbing: locales, dictionary lookup, and locale-aware link helpers.
 *
 * Slugs are identical across locales (English kebab-case acts as the shared
 * key); only titles/content differ. Every internal link must be built with
 * `localeHref` so the locale segment is never hand-rolled in a component.
 */
import { en } from "@/content/dictionaries/en";
import { th } from "@/content/dictionaries/th";

export type Locale = "th" | "en";

export const locales: Locale[] = ["th", "en"];

export const defaultLocale: Locale = "th";

export function isLocale(x: string): x is Locale {
  return (locales as string[]).includes(x);
}

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, th };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/**
 * Build an internal href prefixed with the given locale, e.g.
 * `localeHref("en", "/news")` -> `/en/news`. `path` should start with "/";
 * the bare root `"/"` becomes `/{locale}`.
 */
export function localeHref(locale: Locale, path: string): string {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}

/**
 * Swap the locale segment of a pathname while preserving the rest of the
 * path, used by the language toggle so it links to the same page in the
 * other language.
 */
export function swapLocalePath(pathname: string, to: Locale): string {
  const segments = pathname.split("/");
  // segments[0] is "" (leading slash), segments[1] is the current locale.
  if (segments.length > 1 && isLocale(segments[1] ?? "")) {
    segments[1] = to;
    return segments.join("/") || `/${to}`;
  }
  // No locale segment present (shouldn't normally happen post-middleware).
  return localeHref(to, pathname);
}

/**
 * Format an ISO date (YYYY-MM-DD or full ISO datetime) per-locale using the
 * Gregorian calendar (never Buddhist Era) with a long month.
 */
export function formatDate(locale: Locale, isoDate: string): string {
  const date = new Date(isoDate);
  const intlLocale = locale === "th" ? "th-TH-u-ca-gregory" : "en-GB";
  return new Intl.DateTimeFormat(intlLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    calendar: "gregory",
  }).format(date);
}
