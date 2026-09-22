import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getCuratedCourses, getLunchDirections, parseState } from "@/lib/openhouse";
import { COPY, OPEN_HOUSE, t } from "@/content/openhouse/copy";
import OpenHouseExperience from "./OpenHouseExperience";
import "./openhouse.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return buildMetadata({
    locale: lang,
    title: `${t(COPY.event, lang)} · ${dict.site.name}`,
    description: t(COPY.sub, lang),
    path: "/openhouse",
  });
}

/** Where we are relative to Open House, in the Bangkok timezone. */
function openHousePhase(): "pre" | "event" | "post" {
  const bangkok = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  if (bangkok === OPEN_HOUSE.dateISO) return "event";
  return bangkok < OPEN_HOUSE.dateISO ? "pre" : "post";
}

export default async function OpenHousePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const state = parseState(await searchParams);

  return (
    <OpenHouseExperience
      locale={locale}
      courses={getCuratedCourses()}
      lunchDirections={getLunchDirections()}
      initial={state}
      phase={openHousePhase()}
    />
  );
}
