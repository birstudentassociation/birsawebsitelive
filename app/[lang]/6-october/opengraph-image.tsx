import { copy } from "@/content/six-october";
import { isLocale, locales } from "@/lib/i18n";
import { OG_SIZE, renderCommemorationOgImage, renderSiteOgImage } from "@/lib/og-image";

export const alt =
  "Students lie face down on the Thammasat football field under armed guard on 6 October 1976, with the Dome behind.";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return renderSiteOgImage();
  const t = copy[lang];
  return renderCommemorationOgImage({
    photo: "6-october/og-field.jpg",
    eyebrow: t.eyebrow,
    title: t.title,
    closing: t.closing,
  });
}
