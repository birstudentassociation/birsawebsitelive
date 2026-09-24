import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n";
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
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const base = buildMetadata({
    locale: lang,
    title: t(COPY.event, lang),
    description: t(COPY.sub, lang),
    path: "/openhouse",
  });

  // A shared day unfurls as that day's card. Only validated, closed-set
  // choices reach the image URL; the optional name never does.
  const state = parseState(await searchParams);
  const query = new URLSearchParams({ lang });
  for (const [k, v] of Object.entries(state)) if (v) query.set(k, v);
  const image = {
    url: `/api/openhouse-card?${query.toString()}`,
    width: 1200,
    height: 630,
    alt: t(COPY.daySubtitle, lang),
  };
  return {
    ...base,
    openGraph: { ...base.openGraph, images: [image] },
    twitter: { ...base.twitter, images: [image.url] },
  };
}

type Phase = "pre" | "event" | "post";
const PHASES: Phase[] = ["pre", "event", "post"];
const isPhase = (v: unknown): v is Phase => PHASES.includes(v as Phase);

/**
 * Where we are relative to Open House, in the Bangkok timezone.
 * `OPEN_HOUSE_PHASE` pins it (for example to open event mode early on the
 * day), and outside production `?phase=` previews any state.
 */
function openHousePhase(preview: unknown): Phase {
  if (process.env.VERCEL_ENV !== "production" && isPhase(preview)) return preview;
  if (isPhase(process.env.OPEN_HOUSE_PHASE)) return process.env.OPEN_HOUSE_PHASE;
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
  const query = await searchParams;
  const state = parseState(query);

  return (
    <OpenHouseExperience
      locale={locale}
      courses={getCuratedCourses()}
      lunchDirections={getLunchDirections()}
      initial={state}
      phase={openHousePhase(query.phase)}
    />
  );
}
