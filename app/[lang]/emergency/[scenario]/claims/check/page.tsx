import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getClaimsGuide } from "@/content/emergency/claims";
import { checkerCopy } from "@/content/emergency/claims/checker";
import { getScenario, hasScenario } from "@/content/emergency/scenarios";
import { parseAnswers } from "@/lib/claims-check";
import ClaimsChecker from "@/components/emergency/ClaimsChecker";

/** Reads `searchParams`, so it renders per request; every state is still a plain GET URL. */
type PageProps = {
  params: Promise<{ lang: string; scenario: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, scenario } = await params;
  const guide = getClaimsGuide(scenario);
  if (!isLocale(lang) || !guide) return {};
  return {
    ...buildMetadata({
      locale: lang,
      title: checkerCopy[lang].title,
      description: checkerCopy[lang].lede,
      path: `/emergency/${scenario}/${guide.slug}/check`,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function ClaimsCheckPage({ params, searchParams }: PageProps) {
  const { lang, scenario } = await params;
  const guide = getClaimsGuide(scenario);
  if (!isLocale(lang) || !guide || !hasScenario(scenario)) notFound();
  const query = await searchParams;
  const submitted = typeof query.s === "string" ? query.s : undefined;
  return (
    <ClaimsChecker
      locale={lang}
      scenario={getScenario(scenario)}
      guide={guide}
      answers={parseAnswers(query)}
      submitted={submitted}
    />
  );
}
