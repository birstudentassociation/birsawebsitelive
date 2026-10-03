import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { claimsGuides, getClaimsGuide, guidePartPath } from "@/content/emergency/claims";
import { getScenario, hasScenario } from "@/content/emergency/scenarios";
import GuidePartPage from "@/components/emergency/GuidePartPage";

type Params = { lang: string; scenario: string; part: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.entries(claimsGuides).flatMap(([scenario, guide]) =>
    guide!.en.parts.slice(1).map((part) => ({ scenario, part: part.slug }))
  );
}

function partIndex(scenario: string, part: string) {
  const guide = getClaimsGuide(scenario);
  const index = guide ? guide.en.parts.findIndex((p) => p.slug === part) : -1;
  return guide && index > 0 ? { guide, index } : null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, scenario, part } = await params;
  const found = partIndex(scenario, part);
  if (!isLocale(lang) || !found) return {};
  const c = found.guide[lang];
  return {
    ...buildMetadata({
      locale: lang,
      title: `${c.parts[found.index]!.title}, ${c.title}`,
      description: c.summary,
      path: guidePartPath(scenario, found.guide, found.index),
    }),
    robots: { index: false, follow: false },
  };
}

export default async function ClaimsGuidePartPage({ params }: { params: Promise<Params> }) {
  const { lang, scenario, part } = await params;
  const found = partIndex(scenario, part);
  if (!isLocale(lang) || !found || !hasScenario(scenario)) notFound();
  return (
    <GuidePartPage
      locale={lang}
      scenario={getScenario(scenario)}
      guide={found.guide}
      index={found.index}
    />
  );
}
