import { getInformationGuideEntries, getInformationGuideEntry } from "@/lib/content";
import { audienceLabels } from "@/content/student-life/labels";
import { informationTopicCopy } from "@/content/information/topics";
import { formatGuideDate, isLocale, locales } from "@/lib/i18n";
import { OG_SIZE, renderCard, renderSiteOgImage } from "@/lib/og-image";

const TOPIC = "applying-to-bir";

export const alt = "BIR information guide";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getInformationGuideEntries(lang, TOPIC).map((entry) => ({ lang, slug: entry.slug }))
  );
}

const checked = { en: "Checked", th: "ตรวจสอบเมื่อ" };

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const entry = isLocale(lang) ? getInformationGuideEntry(lang, TOPIC, slug) : null;
  if (!isLocale(lang) || !entry) return renderSiteOgImage();
  const { title, summary, audience, reviewed } = entry.frontmatter;
  return renderCard({
    locale: lang,
    eyebrow: informationTopicCopy[lang][TOPIC].title,
    title,
    summary,
    meta: [`${checked[lang]} ${formatGuideDate(lang, reviewed)}`],
    badge:
      audience !== "all" ? { text: audienceLabels[lang][audience], tone: "forest" } : undefined,
  });
}
