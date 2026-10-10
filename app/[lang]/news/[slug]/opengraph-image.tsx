import { getEntries, getEntry } from "@/lib/content";
import { isLocale, locales } from "@/lib/i18n";
import { OG_SIZE, renderPageOgImage, renderSiteOgImage } from "@/lib/og-image";

export const alt = "BIR Student Association news";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getEntries("news", lang).map((entry) => ({ lang, slug: entry.slug }))
  );
}

const eyebrow = { en: "What's on", th: "ข่าวและกิจกรรม" };

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
