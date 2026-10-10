import { getEntries, getEntry, isPastEvent } from "@/lib/content";
import { formatDate, getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { OG_SIZE, renderCard, renderSiteOgImage, type CardAside } from "@/lib/og-image";

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
const ended = { en: "Event ended", th: "กิจกรรมจบแล้ว" };

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

function intl(locale: Locale, options: Intl.DateTimeFormatOptions, iso: string) {
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH-u-ca-gregory" : "en-GB", {
    ...options,
    timeZone: DATE_ONLY.test(iso) ? "UTC" : "Asia/Bangkok",
  }).format(new Date(iso));
}

function dateTile(locale: Locale, iso: string): CardAside {
  return {
    kind: "date",
    month: intl(locale, { month: "short" }, iso),
    day: intl(locale, { day: "numeric" }, iso),
    weekday: intl(locale, { weekday: "long" }, iso),
  };
}

function eventWhen(locale: Locale, start: string, end?: string): string {
  const date = formatDate(locale, start);
  if (end && formatDate(locale, end) !== date) {
    return locale === "th"
      ? `${date} ถึง ${formatDate(locale, end)}`
      : `${date} to ${formatDate(locale, end)}`;
  }
  if (DATE_ONLY.test(start)) return date;
  const time = (iso: string) => intl(locale, { hour: "2-digit", minute: "2-digit" }, iso);
  const range = end ? `${time(start)} ${locale === "th" ? "ถึง" : "to"} ${time(end)}` : time(start);
  return locale === "th" ? `${range} น.` : range;
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const entry = isLocale(lang) ? getEntry("news", lang, slug) : null;
  if (!isLocale(lang) || !entry) return renderSiteOgImage();
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
