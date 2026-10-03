import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { claimsGuides, getClaimsGuide } from "@/content/emergency/claims";
import { getScenario, hasScenario } from "@/content/emergency/scenarios";
import GuidePartPage from "@/components/emergency/GuidePartPage";

type Params = { lang: string; scenario: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(claimsGuides).map((scenario) => ({ scenario }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, scenario } = await params;
  const guide = getClaimsGuide(scenario);
  if (!isLocale(lang) || !guide) return {};
  return {
    ...buildMetadata({
      locale: lang,
      title: guide[lang].title,
      description: guide[lang].summary,
      path: `/emergency/${scenario}/${guide.slug}`,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function ClaimsGuidePage({ params }: { params: Promise<Params> }) {
  const { lang, scenario } = await params;
  const guide = getClaimsGuide(scenario);
  if (!isLocale(lang) || !guide || !hasScenario(scenario)) notFound();
  return <GuidePartPage locale={lang} scenario={getScenario(scenario)} guide={guide} index={0} />;
}
