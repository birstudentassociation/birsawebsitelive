import { isLocale, localeHref, type Locale } from "@/lib/i18n";

const STATIC_DIRECTORIES = new Set(["6-october", "committee", "emergency", "images"]);
const NON_LOCALE_ROUTES = new Set(["api"]);
const LOCALE_FILES = new Set(["calendar.ics"]);

function isStaticFile(segments: string[]): boolean {
  const last = segments[segments.length - 1] ?? "";
  if (!/\.[a-z0-9]+$/i.test(last)) return false;
  if (segments.length === 1) return !LOCALE_FILES.has(last);
  return STATIC_DIRECTORIES.has(segments[0] ?? "");
}

/**
 * Prefixes a root-relative MDX href with the page locale so links skip the
 * proxy's locale redirect. External URLs, anchors, `mailto:`, `tel:`, hrefs
 * that already carry a locale, static files and non-locale routes pass through.
 */
export function localiseMdxHref(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const pathname = href.split(/[?#]/)[0] ?? "";
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0] ?? "";
  if (isLocale(first) || NON_LOCALE_ROUTES.has(first)) return href;
  if (isStaticFile(segments)) return href;
  return pathname === "/" ? `/${locale}${href.slice(1)}` : localeHref(locale, href);
}
