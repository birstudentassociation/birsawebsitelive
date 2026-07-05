/**
 * Shared metadata builder: canonical URL + hreflang alternates (th/en/
 * x-default) and baseline Open Graph fields. Every page should build its
 * `Metadata` through this so SEO plumbing stays consistent.
 */
import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const OG_LOCALES: Record<Locale, string> = {
  th: "th_TH",
  en: "en_GB",
};

export type BuildMetadataOptions = {
  locale: Locale;
  title: string;
  description: string;
  /** Path relative to the locale root, e.g. "/news" (no locale prefix). */
  path: string;
};

/** Absolute URL for `path` under a given locale, e.g. `/en/news`. */
function absoluteUrl(locale: Locale, path: string): string {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}/${locale}${normalized}`;
}

export function buildMetadata({
  locale,
  title,
  description,
  path,
}: BuildMetadataOptions): Metadata {
  const languages: Record<string, string> = { "x-default": absoluteUrl("th", path) };
  for (const loc of locales) {
    languages[loc] = absoluteUrl(loc, path);
  }

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(locale, path),
      languages,
    },
    openGraph: {
      title,
      description,
      siteName: "BIRSA",
      locale: OG_LOCALES[locale],
      url: absoluteUrl(locale, path),
      type: "website",
    },
  };
}
