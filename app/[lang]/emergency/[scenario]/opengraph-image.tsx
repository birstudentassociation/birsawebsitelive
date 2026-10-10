import { getScenario, hasScenario, scenarioIds } from "@/content/emergency/scenarios";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { alertBanner, getLiveAlert } from "@/lib/emergency";
import { OG_SIZE, renderEmergencyOgImage, renderSiteOgImage } from "@/lib/og-image";

export const alt = "BIR Student Association emergency guidance";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.flatMap((lang) => scenarioIds.map((scenario) => ({ lang, scenario })));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string; scenario: string }>;
}) {
  const { lang, scenario } = await params;
  if (!isLocale(lang) || !hasScenario(scenario)) return renderSiteOgImage();
  const s = getScenario(scenario);
  const t = getDictionary(lang).emergencyPage;
  const live = getLiveAlert();
  const isLive = live?.scenario.id === s.id;
  return renderEmergencyOgImage({
    tone: s.hero,
    eyebrow: isLive ? t.liveAlert : t.breadcrumb,
    headline: isLive && live ? alertBanner(live, lang) : s[lang].title,
    context: isLive ? s[lang].title : undefined,
  });
}
