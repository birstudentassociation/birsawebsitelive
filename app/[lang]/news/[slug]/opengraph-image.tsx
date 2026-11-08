import { getEntries, getEntry, isPastEvent } from "@/lib/content";
import { formatDate, getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { CAREER_EXHIBITION_SLUG, renderCareerExhibitionOgImage } from "@/lib/og-career-exhibition";
import { OG_SIZE, renderCard, renderSiteOgImage, type CardAside } from "@/lib/og-image";
import { eventDateIntl, eventWhen } from "@/lib/event-when";

export const alt = "BIR Student Association news";
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 86400;

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getEntries("news", lang).map((entry) => ({ lang, slug: entry.slug }))
  );
}

const eyebrow = { en: "What's on", th: "ข่าวและกิจกรรม" };
const ended = { en: "Event ended", th: "กิจกรรมสิ้นสุดแล้ว" };

function dateTile(locale: Locale, iso: string): CardAside {
  return {
    kind: "date",
    month: eventDateIntl(locale, { month: "short" }, iso),
    day: eventDateIntl(locale, { day: "numeric" }, iso),
    weekday: eventDateIntl(locale, { weekday: "long" }, iso),
  };
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const entry = isLocale(lang) ? getEntry("news", lang, slug) : null;
  if (!isLocale(lang) || !entry) return renderSiteOgImage();
  if (slug === CAREER_EXHIBITION_SLUG) return renderCareerExhibitionOgImage(lang);
  const { title, summary, type, start, end, location, date, updated } = entry.frontmatter;
  const meta = getDictionary(lang).meta;

  if (type === "event" && start) {
    return renderCard({
      locale: lang,
      eyebrow: `${eyebrow[lang]} · ${meta.event}`,
      title,
      summary,
      meta: [eventWhen(lang, start, end), ...(location ? [location] : [])],
      badge: isPastEvent(entry.frontmatter) ? { text: ended[lang], tone: "ink" } : undefined,
      aside: dateTile(lang, start),
    });
  }

  return renderCard({
    locale: lang,
    eyebrow: `${eyebrow[lang]} · ${type === "event" ? meta.event : meta.news}`,
    title,
    summary,
    meta: [
      updated && updated !== date
        ? `${meta.updated} ${formatDate(lang, updated)}`
        : formatDate(lang, date),
    ],
  });
}
