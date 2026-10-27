import { advisoryCopy } from "@/content/advisory";
import { isLocale, locales } from "@/lib/i18n";
import { OG_SIZE, renderEmergencyOgImage, renderSiteOgImage } from "@/lib/og-image";

export const alt = "High tides on the Chao Phraya from 27 October to 5 November 2026";
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
    locale: lang,
    tone: "blue",
    eyebrow: t.breadcrumb,
    headline: t.title,
    context: t.ogContext,
  });
}
