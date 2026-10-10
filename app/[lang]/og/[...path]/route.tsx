import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { alertBanner, getLiveAlert } from "@/lib/emergency";
import { renderCard, renderEmergencyOgImage } from "@/lib/og-image";
import { hasOwnShareImage } from "@/lib/seo";
import { getSharePage, sharePages, shareSection } from "@/lib/share-pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    sharePages
      .filter((page) => !hasOwnShareImage(page.path))
      .map((page) => ({ lang, path: page.path.split("/").filter(Boolean) }))
  );
}

/** The share card for a page in `sharePages`. Only listed paths render. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lang: string; path: string[] }> }
) {
  const { lang, path } = await params;
  const page = getSharePage(`/${path.join("/")}`);
  if (!isLocale(lang) || !page) notFound();

  const live = getLiveAlert();
  if (page.path === "/emergency" && live) {
    const t = getDictionary(lang).emergencyPage;
    return renderEmergencyOgImage({
      locale: lang,
      tone: live.scenario.hero,
      eyebrow: t.liveAlert,
      headline: alertBanner(live, lang),
      context: live.scenario[lang].title,
    });
  }

  return renderCard({
    locale: lang,
    eyebrow: shareSection(page, lang),
    title: page.title[lang],
    summary: page.summary[lang],
  });
}
