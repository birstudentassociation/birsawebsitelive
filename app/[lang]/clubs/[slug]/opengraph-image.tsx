import { clubCategories } from "@/content/clubs/clubs";
import { getClubEntries, getClubEntry } from "@/lib/content";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { OG_SIZE, renderCard, renderSiteOgImage } from "@/lib/og-image";

export const alt = "BIR student club";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getClubEntries(lang).map((entry) => ({ lang, slug: entry.slug }))
  );
}

const openToJoin = { en: "Open to join", th: "รับสมาชิกอยู่" };

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const entry = isLocale(lang) ? getClubEntry(lang, slug) : null;
  if (!isLocale(lang) || !entry) return renderSiteOgImage();
  const { title, tagline, category, joinOpen, meets, where } = entry.frontmatter;
  const clubs = getDictionary(lang).nav.find((item) => item.href === "/clubs")?.label;
  return renderCard({
    locale: lang,
    eyebrow: [clubs, clubCategories[category][lang]].filter(Boolean).join(" · "),
    title,
    summary: tagline,
    meta: [meets, where].filter((fact): fact is string => Boolean(fact)),
    badge: joinOpen ? { text: openToJoin[lang], tone: "forest" } : undefined,
  });
}
