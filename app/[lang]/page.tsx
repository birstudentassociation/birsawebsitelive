import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { getEntries } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
import { todayInBangkok } from "@/lib/bangkok-today";
import { getTermStatus } from "@/lib/home/term-status";
import JsonLd from "@/components/JsonLd";
import Icon from "@/components/icons/Icon";
import DueSoon from "@/components/home/DueSoon";
import RightNow from "@/components/home/RightNow";
import PlanCard from "@/components/home/PlanCard";
import Shortcuts from "@/components/home/Shortcuts";
import LatestNews from "@/components/home/LatestNews";
import GetHelp from "@/components/home/GetHelp";
import AllTopics from "@/components/home/AllTopics";
import { homeEn } from "@/content/home/en";
import { homeTh } from "@/content/home/th";

export const revalidate = 3600;

const homeCopy = { en: homeEn, th: homeTh };

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
    title: dict.site.fullName,
    description: dict.site.description,
    path: "/",
  });
}

function formatToday(locale: Locale, todayKey: string): string {
  const date = new Date(`${todayKey}T00:00:00Z`);
  if (locale === "th") {
    return new Intl.DateTimeFormat("th-TH-u-ca-gregory", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "UTC",
    }).format(date);
  }
  const parts = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).formatToParts(date);
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${pick("weekday")} ${pick("day")} ${pick("month")}`;
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const copy = homeCopy[locale];
  const todayKey = todayInBangkok();
  const termStatus = getTermStatus(todayKey, locale);
  const news = getEntries("news", locale)
    .slice(0, 3)
    .map(({ slug, frontmatter }) => ({
      slug,
      title: frontmatter.title,
      date: frontmatter.date,
    }));

  return (
    <>
      <JsonLd data={websiteJsonLd(locale)} />
      <JsonLd data={organizationJsonLd(locale)} />
      <div className="wrap grid gap-4 py-6 sm:py-8 lg:grid-cols-12">
        <header className="grid gap-4 lg:col-span-12 lg:grid-cols-2 lg:items-end">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl">{copy.title}</h1>
            <p className="mt-2 text-lg">
              <strong>
                {formatToday(locale, todayKey)}
                {locale === "en" ? "." : null}
              </strong>
              {termStatus ? ` ${termStatus}` : null}
            </p>
          </div>
          <form
            role="search"
            action={localeHref(locale, "/search")}
            method="get"
            className="lg:w-full lg:max-w-md lg:justify-self-end"
          >
            <label htmlFor="home-search" className="block text-sm font-semibold">
              {copy.search.label}
            </label>
            <div className="mt-1 flex gap-2">
              <input
                id="home-search"
                type="search"
                name="q"
                autoComplete="off"
                className="focus-highlight h-12 min-w-0 flex-1 rounded-xl border-2 border-ink bg-surface px-3 text-ink"
              />
              <button
                type="submit"
                aria-label={copy.search.button}
                className="focus-highlight grid size-12 shrink-0 place-items-center rounded-xl bg-ink text-white"
              >
                <Icon name="arrow" className="h-5 w-5" />
              </button>
            </div>
          </form>
        </header>
        <DueSoon
          locale={locale}
          todayKey={todayKey}
          className="lg:col-span-7 lg:col-start-1 lg:row-span-3"
        />
        <RightNow locale={locale} className="lg:col-span-5 lg:col-start-8" />
        <PlanCard locale={locale} className="lg:col-span-5 lg:col-start-8" />
        <Shortcuts locale={locale} className="lg:col-span-5 lg:col-start-8" />
        <LatestNews locale={locale} items={news} className="lg:col-span-7 lg:col-start-1" />
        <GetHelp locale={locale} className="lg:col-span-5 lg:col-start-8" />
        <AllTopics locale={locale} className="lg:col-span-12" />
      </div>
    </>
  );
}
