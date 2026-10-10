import { advisoryCopy } from "@/content/advisory";
import { isLocale, locales } from "@/lib/i18n";
import { OG_SIZE, renderEmergencyOgImage, renderSiteOgImage } from "@/lib/og-image";

const dates = {
  en: "Online classes on 12 and 14 to 16 October 2026",
  th: "เรียนออนไลน์วันที่ 12 และ 14 ถึง 16 ตุลาคม 2569",
};

export const alt = "Thammasat classes move online for the World Bank and IMF meetings";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return renderSiteOgImage();
  const t = advisoryCopy[lang];
  return renderEmergencyOgImage({
    tone: "red",
    eyebrow: t.breadcrumb,
    headline: t.title,
    context: dates[lang],
  });
}
