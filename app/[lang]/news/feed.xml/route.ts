/**
 * RSS 2.0 feed of news and events, one per locale: /th/news/feed.xml and
 * /en/news/feed.xml. Built from the same loaders as `app/sitemap.ts`, so it
 * lists what is actually published. Prerendered and regenerated daily so
 * events drop out of the feed once archived. The folder name is a static
 * segment, so it wins over `news/[slug]`, and the dot in the path keeps
 * `proxy.ts` from seeing it.
 */
import { getEntries, isArchivedEvent } from "@/lib/content";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";

export const dynamic = "force-static";
export const revalidate = 86400;
export const dynamicParams = false;

/** How many recent items the feed carries. */
const FEED_LIMIT = 50;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const CHANNEL_TITLE: Record<Locale, string> = {
  en: "BIRSA news and events",
  th: "ข่าวและกิจกรรม BIRSA",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RFC 822 date at midnight Bangkok time for a `YYYY-MM-DD` date. */
function rfc822(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number) as [number, number, number];
  const weekday = DAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  const dd = String(day).padStart(2, "0");
  return `${weekday}, ${dd} ${MONTHS[month - 1]} ${year} 00:00:00 +0700`;
}

function buildFeed(locale: Locale): string {
  const dict = getDictionary(locale);
  const link = `${SITE_URL}/${locale}/news`;
  const self = `${link}/feed.xml`;
  const items = getEntries("news", locale)
    .filter((post) => !post.frontmatter.placeholder && !isArchivedEvent(post.frontmatter))
    .slice(0, FEED_LIMIT);

  const itemXml = items.map((post) => {
    const url = `${link}/${post.slug}`;
    return [
      "    <item>",
      `      <title>${escapeXml(post.frontmatter.title)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `      <pubDate>${rfc822(post.frontmatter.date)}</pubDate>`,
      `      <description>${escapeXml(post.frontmatter.summary)}</description>`,
      `      <category>${escapeXml(post.frontmatter.category)}</category>`,
      "    </item>",
    ].join("\n");
  });

  const newest = items[0]?.frontmatter;
  const lastBuild = newest ? rfc822(newest.updated ?? newest.date) : undefined;

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(CHANNEL_TITLE[locale])}</title>`,
    `    <link>${escapeXml(link)}</link>`,
    `    <description>${escapeXml(dict.site.description)}</description>`,
    `    <language>${locale}</language>`,
    ...(lastBuild ? [`    <lastBuildDate>${lastBuild}</lastBuildDate>`] : []),
    `    <atom:link href="${escapeXml(self)}" rel="self" type="application/rss+xml" />`,
    ...itemXml,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lang: string }> }
): Promise<Response> {
  const { lang } = await params;
  if (!isLocale(lang)) return new Response("Not found", { status: 404 });
  return new Response(buildFeed(lang), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
