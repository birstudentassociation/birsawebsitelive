import { getEntries, getEntry } from "@/lib/content";
import { formatDate, getDictionary, isLocale, locales } from "@/lib/i18n";
import { OG_SIZE, renderCard, renderSiteOgImage } from "@/lib/og-image";

export const alt = "BIR Student Association activity";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getEntries("activity", lang).map((entry) => ({ lang, slug: entry.slug }))
  );
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const entry = isLocale(lang) ? getEntry("activity", lang, slug) : null;
  if (!isLocale(lang) || !entry) return renderSiteOgImage();
  const dict = getDictionary(lang);
  const { title, summary, updated } = entry.frontmatter;
  return renderCard({
    locale: lang,
    eyebrow: dict.nav.find((item) => item.href === "/activity")?.label ?? "BIRSA",
    title,
    summary,
    meta: updated ? [`${dict.meta.updated} ${formatDate(lang, updated)}`] : [],
  });
}
