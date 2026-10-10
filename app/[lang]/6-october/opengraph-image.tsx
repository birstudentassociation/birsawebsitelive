import { copy, hero } from "@/content/six-october";
import { isLocale, locales } from "@/lib/i18n";
import {
  OG_SIZE,
  renderCommemorationOgImage,
  renderSiteOgImage,
  shareImageMetadata,
} from "@/lib/og-image";

const alt = {
  en: "Students lie face down on the Thammasat football field under armed guard on 6 October 1976, with the Dome behind.",
  th: hero.alt.th,
};
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateImageMetadata({ params }: { params: Promise<{ lang?: string }> }) {
  const { lang = "" } = (await params) ?? {};
  return shareImageMetadata(alt[isLocale(lang) ? lang : "en"]);
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
