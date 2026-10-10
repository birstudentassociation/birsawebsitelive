import { isLocale } from "@/lib/i18n";
import { OG_SIZE, renderSiteOgImage, shareImageMetadata } from "@/lib/og-image";
import { SITE_IMAGE_ALT } from "@/lib/seo";

export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateImageMetadata({ params }: { params: Promise<{ lang?: string }> }) {
  const { lang = "" } = (await params) ?? {};
  return shareImageMetadata(SITE_IMAGE_ALT[isLocale(lang) ? lang : "en"]);
}

/**
 * Shared Open Graph image for every page under `/[lang]` (Next.js falls back
 * to this for any route that doesn't define its own).
 */
export default function OpengraphImage() {
  return renderSiteOgImage();
}
