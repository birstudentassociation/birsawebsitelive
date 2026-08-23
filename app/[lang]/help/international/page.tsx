import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import HelpPageShell from "@/components/help/HelpPageShell";
import NavList, { NavListItem } from "@/components/bds/NavList";

/**
 * `/help/international` (ROUTE-MAP-2.0 Wave 5C `/help/international/**`).
 *
 * Index for the three SIGNPOST rows in SCOPE-AUDIT-2.0 §3.3: visa and
 * immigration, healthcare and insurance, banking and money. All three name
 * TU International Affairs, or another TU-wide body, as owner.
 */

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const entries = [
  {
    slug: "visa-and-immigration",
    title: { en: "Visa and immigration", th: "วีซ่าและการตรวจคนเข้าเมือง" },
    body: {
      en: "The 90 day report and re-entry permits, in outline, and who to ask for the current process.",
      th: "การรายงานตัว 90 วันและใบอนุญาตกลับเข้าประเทศโดยสรุป พร้อมหน่วยงานที่ควรสอบถามขั้นตอนล่าสุด",
    },
  },
  {
    slug: "healthcare-and-insurance",
    title: { en: "Healthcare and insurance", th: "การรักษาพยาบาลและประกันสุขภาพ" },
    body: {
      en: "Whether health insurance is required, and where to confirm the current requirement.",
      th: "ประกันสุขภาพจำเป็นหรือไม่ และควรตรวจสอบข้อกำหนดล่าสุดที่ไหน",
    },
  },
  {
    slug: "banking-and-money",
    title: { en: "Banking and money", th: "ธนาคารและการเงิน" },
    body: {
      en: "Opening a Thai bank account and what documents to expect.",
      th: "การเปิดบัญชีธนาคารไทยและเอกสารที่มักต้องใช้",
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
    title: dict.internationalIndex.title,
    description: dict.internationalIndex.lede,
    path: "/help/international",
  });
}

export default async function InternationalIndexPage({
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
      title={dict.internationalIndex.title}
      lede={dict.internationalIndex.lede}
      breadcrumbItems={[
        { label: dict.site.name, href: "/" },
        { label: dict.hub.title, href: "/help" },
        { label: dict.internationalIndex.title },
      ]}
    >
      <NavList>
        {entries.map((entry) => (
          <NavListItem
            key={entry.slug}
            href={localeHref(locale, `/help/international/${entry.slug}`)}
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
