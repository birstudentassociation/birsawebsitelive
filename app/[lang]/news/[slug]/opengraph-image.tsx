import { getEntries, getEntry } from "@/lib/content";
import { isLocale, locales } from "@/lib/i18n";
import { OG_SIZE, renderPageOgImage, renderSiteOgImage, shareImageMetadata } from "@/lib/og-image";
import { SITE_IMAGE_ALT } from "@/lib/seo";

export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getEntries("news", lang).map((entry) => ({ lang, slug: entry.slug }))
  );
}

const eyebrow = { en: "What's on", th: "ข่าวและกิจกรรม" };

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ lang?: string; slug?: string }>;
}) {
  const { lang = "", slug = "" } = (await params) ?? {};
  const locale = isLocale(lang) ? lang : "en";
  const entry = isLocale(lang) ? getEntry("news", lang, slug) : null;
  return shareImageMetadata(entry?.frontmatter.title ?? SITE_IMAGE_ALT[locale]);
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const entry = isLocale(lang) ? getEntry("news", lang, slug) : null;
  if (!isLocale(lang) || !entry) return renderSiteOgImage();
  return renderPageOgImage({ eyebrow: eyebrow[lang], title: entry.frontmatter.title });
}
