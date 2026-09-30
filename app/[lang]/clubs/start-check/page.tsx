import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { getTopic, toAnswerIds } from "@/lib/smart-answers";
import { service } from "@/content/smart-answers";
import CheckFlow from "@/components/checks/CheckFlow";
import { checkMetadata } from "@/components/checks/checkMetadata";

/** Reads `searchParams`, so it renders per request; every state is still a plain GET URL. */
const SLUG = "club-readiness";

type PageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ a?: string | string[] }>;
};

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const topic = getTopic(service, SLUG);
  if (!topic) return {};
  const { a } = await searchParams;
  return checkMetadata(locale, topic, a);
}

export default async function CheckPage({ params, searchParams }: PageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const topic = getTopic(service, SLUG);
  if (!topic) notFound();
  const { a } = await searchParams;

  return (
    <CheckFlow
      locale={locale}
      topic={topic}
      answerIds={toAnswerIds(a)}
      dict={getDictionary(locale)}
    />
  );
}
