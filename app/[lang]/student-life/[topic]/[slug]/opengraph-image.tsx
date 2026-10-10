import { getGuideEntries, getGuideEntry, guideTopics, isGuideTopic } from "@/lib/content";
import { audienceLabels } from "@/content/student-life/labels";
import { studentLifeLabel, studentLifeTopics } from "@/content/student-life/topics";
import { formatGuideDate, isLocale, locales } from "@/lib/i18n";
import { OG_SIZE, renderCard, renderSiteOgImage } from "@/lib/og-image";

export const alt = "BIR student life guide";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    guideTopics.flatMap((topic) =>
      getGuideEntries(lang, topic).map((entry) => ({ lang, topic, slug: entry.slug }))
    )
  );
}

const checked = { en: "Checked", th: "ตรวจสอบเมื่อ" };

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string; topic: string; slug: string }>;
}) {
  const { lang, topic, slug } = await params;
  const entry = isLocale(lang) && isGuideTopic(topic) ? getGuideEntry(lang, topic, slug) : null;
  if (!isLocale(lang) || !isGuideTopic(topic) || !entry) return renderSiteOgImage();
  const { title, summary, audience, reviewed } = entry.frontmatter;
  return renderCard({
    locale: lang,
    eyebrow: `${studentLifeLabel[lang]} · ${studentLifeTopics[lang][topic].title}`,
    title,
    summary,
    meta: [`${checked[lang]} ${formatGuideDate(lang, reviewed)}`],
    badge:
      audience !== "all" ? { text: audienceLabels[lang][audience], tone: "forest" } : undefined,
  });
}
