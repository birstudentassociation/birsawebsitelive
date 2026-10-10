import { isLocale, locales } from "@/lib/i18n";
import { OG_SIZE, renderSiteOgImage } from "@/lib/og-image";

export const alt =
  "BIR Student Association, Politics and International Relations, Thammasat University";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Shared Open Graph image for every page under `/[lang]` (Next.js falls back
 * to this for any route that doesn't define its own).
 */
export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return renderSiteOgImage(isLocale(lang) ? lang : undefined);
}
