/**
 * Shared metadata builder: canonical URL + hreflang alternates (th/en/
 * x-default) and baseline Open Graph fields. Every page should build its
 * `Metadata` through this so SEO plumbing stays consistent.
 *
 * Titles and descriptions are fitted to what search results display, per the
 * GOV.UK SEO best practice guide: titles no longer than 60 characters and
 * descriptions no longer than 160, cut at a sentence or word boundary rather
 * than mid-word.
 */
import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";

export const SITE_NAME = "BIRSA";
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 160;
export const DESCRIPTION_MIN = 70;

const BRAND_SUFFIX = ` | ${SITE_NAME}`;
const ELLIPSIS = "…";

const OG_LOCALES: Record<Locale, string> = {
  th: "th_TH",
  en: "en_GB",
};

export const SITE_IMAGE_ALT: Record<Locale, string> = {
  en: "BIR Student Association, Politics and International Relations, Thammasat University",
  th: "สโมสรนักศึกษาการเมืองและการระหว่างประเทศ มหาวิทยาลัยธรรมศาสตร์",
};

const SHARE_IMAGE_SIZE = { width: 1200, height: 630 };

const OWN_SHARE_IMAGE_PATHS = [
  /^\/(6-october|advisory)$/,
  /^\/emergency\/[^/]+$/,
  /^\/news\/[^/]+$/,
  /^\/student-life\/course-reviews\/[^/]+$/,
];

/** Whether the segment at `path` has its own opengraph-image and twitter-image files. */
export function hasOwnShareImage(path: string): boolean {
  return OWN_SHARE_IMAGE_PATHS.some((pattern) => pattern.test(path));
}

export type ArticleMetadata = {
  /** ISO date or date-time the article was first published. */
  publishedTime: string;
  modifiedTime?: string;
  section?: string;
};

export type BuildMetadataOptions = {
  locale: Locale;
  /** The page's own title, without the site name. */
  title: string;
  description: string;
  /** Path relative to the locale root, e.g. "/news" (no locale prefix). */
  path: string;
  /** Marks the page as an Open Graph article (news posts). */
  article?: ArticleMetadata;
};

/** Absolute URL for `path` under a given locale, e.g. `/en/news`. */
export function absoluteUrl(locale: Locale, path: string): string {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}/${locale}${normalized}`;
}

/** Word boundaries that are safe to cut at, including inside unspaced Thai. */
function wordBoundaries(text: string): number[] {
  const segmenter = new Intl.Segmenter(/[฀-๿]/.test(text) ? "th" : "en", {
    granularity: "word",
  });
  return [...segmenter.segment(text)].map((s) => s.index).filter((i) => i > 0);
}

/** Cuts `text` at the last word boundary that leaves room for an ellipsis. */
function cutAtWord(text: string, max: number): string {
  const limit = max - ELLIPSIS.length;
  const lastSpace = text.lastIndexOf(" ", limit);
  const cut =
    lastSpace >= limit * 0.6
      ? lastSpace
      : wordBoundaries(text)
          .filter((i) => i <= limit)
          .pop();
  const head = text.slice(0, cut ?? limit).replace(/[\s,;:.]+$/u, "");
  return `${head}${ELLIPSIS}`;
}

/**
 * The full `<title>`: the page title followed by the site name when both fit
 * in 60 characters, the page title alone when only it fits, otherwise the
 * page title cut at a word boundary. The site name is never repeated.
 */
export function fitTitle(title: string, max = TITLE_MAX): string {
  const clean = title.trim();
  if (clean.includes(SITE_NAME)) {
    return clean.length <= max ? clean : cutAtWord(clean, max);
  }
  if (clean.length + BRAND_SUFFIX.length <= max) return `${clean}${BRAND_SUFFIX}`;
  if (clean.length <= max) return clean;
  return cutAtWord(clean, max);
}

/**
 * A description of at most 160 characters. Keeps whole sentences where the
 * first ones fit and carry enough on their own; otherwise cuts at a word.
 */
export function fitDescription(description: string, max = DESCRIPTION_MAX): string {
  const clean = description.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;

  const end = [...clean.matchAll(/[.!?](?=\s)/g)]
    .map((m) => m.index + 1)
    .filter((i) => i <= max && i >= DESCRIPTION_MIN)
    .pop();
  return end === undefined ? cutAtWord(clean, max) : clean.slice(0, end);
}

export function buildMetadata({
  locale,
  title,
  description,
  path,
  article,
}: BuildMetadataOptions): Metadata {
  const languages: Record<string, string> = { "x-default": absoluteUrl("th", path) };
  for (const loc of locales) {
    languages[loc] = absoluteUrl(loc, path);
  }

  const fullTitle = fitTitle(title);
  const socialTitle = title.trim();
  const fittedDescription = fitDescription(description);
  const url = absoluteUrl(locale, path);
  const own = hasOwnShareImage(path);
  const shareImage = (name: "opengraph-image" | "twitter-image") => ({
    url: `${own ? url : absoluteUrl(locale, "/")}/${name}`,
    ...SHARE_IMAGE_SIZE,
    alt: own ? socialTitle : SITE_IMAGE_ALT[locale],
  });

  return {
    title: { absolute: fullTitle },
    description: fittedDescription,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title: socialTitle,
      description: fittedDescription,
      siteName: SITE_NAME,
      locale: OG_LOCALES[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
      url,
      images: [shareImage("opengraph-image")],
      ...(article
        ? {
            type: "article" as const,
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            section: article.section,
          }
        : { type: "website" as const }),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: fittedDescription,
      images: [shareImage("twitter-image")],
    },
  };
}
