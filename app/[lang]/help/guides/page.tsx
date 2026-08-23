import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import HelpPageShell from "@/components/help/HelpPageShell";
import NavList, { NavListItem } from "@/components/bds/NavList";

/**
 * `/help/guides` (ROUTE-MAP-2.0 Wave 5C `/help/guides/**`).
 *
 * Index for §3.6 signpost pages about things Thammasat or Tha Prachan
 * campus runs, not BIRSA. Currently one entry: the shuttle bus
 * (SCOPE-AUDIT-2.0 §3.2 SIGNPOST row, `home/shuttle-bus.mdx`).
 */

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const entries = [
  {
    slug: "shuttle-bus",
    title: { en: "Shuttle bus service", th: "รถรับส่งของมหาวิทยาลัย" },
    body: {
      en: "Thammasat's two free weekday shuttle lines from Tha Prachan, and where to find the live schedule.",
      th: "รถรับส่งฟรีสองสายของธรรมศาสตร์จากท่าพระจันทร์ในวันธรรมดา และจุดที่ดูตารางเวลาแบบเรียลไทม์",
    },
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.guidesIndex.title,
    description: dict.guidesIndex.lede,
    path: "/help/guides",
  });
}

export default async function GuidesIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);

  return (
    <HelpPageShell
      locale={locale}
      title={dict.guidesIndex.title}
      lede={dict.guidesIndex.lede}
      breadcrumbItems={[
        { label: dict.site.name, href: "/" },
        { label: dict.hub.title, href: "/help" },
        { label: dict.guidesIndex.title },
      ]}
    >
      <NavList>
        {entries.map((entry) => (
          <NavListItem
            key={entry.slug}
            href={localeHref(locale, `/help/guides/${entry.slug}`)}
            title={entry.title[locale]}
            level={2}
          >
            {entry.body[locale]}
          </NavListItem>
        ))}
      </NavList>
    </HelpPageShell>
  );
}
