/**
 * Sitemap: enumerates every route in both locales. Slugs are derived from
 * the same content loaders the pages themselves use (`lib/content.ts` and
 * `content/clubs/clubs.ts`) — never hardcoded — so the sitemap can't drift
 * out of sync with what actually gets built.
 */
import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/lib/i18n";
import { getEntries, getGuideEntries, type GuideAudience } from "@/lib/content";
import { clubs } from "@/content/clubs/clubs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const guideAudiences: GuideAudience[] = ["home", "international"];

function url(locale: Locale, path: string): string {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}/${locale}${normalized}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const staticPaths = [
      "/",
      "/quick",
      "/news",
      "/services",
      "/services/contact",
      "/clubs",
      "/clubs/start",
      "/student-life",
      "/about",
      "/standards",
      "/privacy",
    ];

    for (const path of staticPaths) {
      entries.push({ url: url(locale, path) });
    }

    for (const entry of getEntries("news", locale)) {
      entries.push({ url: url(locale, `/news/${entry.slug}`) });
    }

    for (const entry of getEntries("services", locale)) {
      entries.push({ url: url(locale, `/services/${entry.slug}`) });
    }

    for (const entry of getEntries("about", locale)) {
      entries.push({ url: url(locale, `/about/${entry.slug}`) });
    }

    for (const audience of guideAudiences) {
      entries.push({ url: url(locale, `/student-life/${audience}`) });
      for (const entry of getGuideEntries(locale, audience)) {
        entries.push({ url: url(locale, `/student-life/${audience}/${entry.slug}`) });
      }
    }

    for (const club of clubs) {
      entries.push({ url: url(locale, `/clubs/${club.slug}`) });
    }
  }

  return entries;
}
