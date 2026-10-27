import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { ADVISORY_FROM, ADVISORY_TO, advisoryCopy, bangkokForecast } from "@/content/advisory";
import { readingCopy } from "@/content/conditions/readings";
import {
  fetchTideTable,
  fetchWaterReadings,
  parseTideDays,
  type FewsRow,
  type TideDay,
} from "@/lib/conditions/sources/water";
import { fillTemplate, formatBangkokClock } from "@/lib/conditions/format";
import type { Reading, ReadingId } from "@/lib/conditions/types";
import Breadcrumbs from "@/components/Breadcrumbs";
import WarningText from "@/components/WarningText";
import PageHeader from "@/components/PageHeader";
import ExternalLink from "@/components/ExternalLink";
import ReadingRow from "@/components/conditions/ReadingRow";

export const revalidate = 300;

const LIVE_READINGS: ReadingId[] = ["tide", "riverPakKhlongTalat", "riverKrungThep"];

const THAIWATER_URL = "https://www.thaiwater.net/water/wl";

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
  return buildMetadata({
    locale: lang,
    title: advisoryCopy[lang].title,
    description: advisoryCopy[lang].metaDescription,
    path: "/advisory",
  });
}

function bangkokToday(now: Date): string {
  return new Date(now.getTime() + 7 * 3_600_000).toISOString().slice(0, 10);
}

function dayLabel(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default async function AdvisoryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = advisoryCopy[locale];
  const conditions = dict.conditionsPage;
  const newTabLabel = dict.a11y.newTab;

  const now = new Date();
  const [readings, tideRaw] = await Promise.all([
    fetchWaterReadings(now).catch(() => [] as Reading[]),
    fetchTideTable(),
  ]);
  const readingsById = new Map(readings.map((reading) => [reading.id, reading]));
  const live = LIVE_READINGS.flatMap((id) => {
    const reading = readingsById.get(id);
    return reading ? [reading] : [];
  });
  const days = tideRaw === null ? [] : parseTideDays(tideRaw, ADVISORY_FROM, ADVISORY_TO);
  const today = bangkokToday(now);
  const forecast = today <= bangkokForecast.date ? bangkokForecast.copy[locale] : null;

  return (
    <>
      <PageHeader
        title={t.title}
        lede={t.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[{ label: dict.site.name, href: "/" }, { label: t.breadcrumb }]}
          />
        }
      />
      <div className="wrap flex flex-col gap-10 py-10">
        <div className="max-w-[var(--measure)]">
          <WarningText locale={locale} title={t.noticeTitle}>
            {t.notice}
          </WarningText>
        </div>

        {forecast ? (
          <section
            aria-labelledby="forecast-heading"
            className="flex max-w-[var(--measure)] flex-col gap-3"
          >
            <h2 id="forecast-heading" className="font-display text-2xl">
              {forecast.heading}
            </h2>
            <p className="text-lg leading-relaxed font-semibold">{forecast.lede}</p>
            <p className="leading-relaxed">{forecast.comparison}</p>
            <p className="leading-relaxed">{forecast.districts}</p>
            <p className="leading-relaxed">{forecast.communitiesLede}</p>
            <ol className="flex list-decimal flex-col gap-1 pl-6 leading-relaxed">
              {forecast.communities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <p className="leading-relaxed">{forecast.seepage}</p>
            <p className="text-sm text-muted">{forecast.source}</p>
          </section>
        ) : null}

        <section
          aria-labelledby="live-heading"
          className="flex max-w-[var(--measure)] flex-col gap-3"
        >
          <div>
            <h2 id="live-heading" className="font-display text-2xl">
              {t.liveHeading}
            </h2>
            <p className="mt-1 text-muted">{t.liveLede}</p>
          </div>
          {live.length > 0 ? (
            <ul className="flex flex-col divide-y divide-line border-y border-line">
              {live.map((reading) => (
                <ReadingRow
                  key={reading.id}
                  locale={locale}
                  reading={reading}
                  label={readingCopy[reading.id].label[locale]}
                  threshold={readingCopy[reading.id].threshold[locale]}
                  now={now}
                  newTabLabel={newTabLabel}
                  t={conditions}
                />
              ))}
            </ul>
          ) : null}
          <p className="text-sm text-muted">
            {fillTemplate(t.checkedAt, { time: formatBangkokClock(now.toISOString()) })}
          </p>
          <p>
            <Link href={localeHref(locale, "/conditions")} className="text-brand-deep underline">
              {t.conditionsLink}
            </Link>
          </p>
        </section>

        <section aria-labelledby="tides-heading" className="flex flex-col gap-4">
          <div className="max-w-[var(--measure)]">
            <h2 id="tides-heading" className="font-display text-2xl">
              {t.tableHeading}
            </h2>
            <p className="mt-1 text-muted">{t.tableLede}</p>
          </div>
          {days.length > 0 ? (
            <TideTable days={days} today={today} locale={locale} t={t} />
          ) : (
            <p className="max-w-[var(--measure)]">
              {t.tableUnavailable}{" "}
              <ExternalLink
                href={THAIWATER_URL}
                newTabLabel={newTabLabel}
                className="text-brand-deep underline"
              >
                ThaiWater
              </ExternalLink>
            </p>
          )}
          <p className="text-sm text-muted">{t.tableSource}</p>
        </section>

        <div className="flex max-w-[var(--measure)] flex-col gap-10">
          <section aria-labelledby="areas-heading" className="flex flex-col gap-3">
            <h2 id="areas-heading" className="font-display text-2xl">
              {t.areasHeading}
            </h2>
            <p className="leading-relaxed">{t.areasLede}</p>
            <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed">
              {t.areas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="do-heading" className="flex flex-col gap-3">
            <h2 id="do-heading" className="font-display text-2xl">
              {t.doHeading}
            </h2>
            <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed">
              {t.do.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="help-heading" className="flex flex-col gap-3">
            <h2 id="help-heading" className="font-display text-2xl">
              {t.helpHeading}
            </h2>
            <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed">
              {t.help.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>
              <Link
                href={localeHref(locale, "/emergency/flooding")}
                className="text-brand-deep underline"
              >
                {t.floodGuideLink}
              </Link>
            </p>
          </section>

          <section aria-labelledby="about-heading" className="flex flex-col gap-3">
            <h2 id="about-heading" className="font-display text-2xl">
              {t.aboutHeading}
            </h2>
            {t.about.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}

function TideTable({
  days,
  today,
  locale,
  t,
}: {
  days: TideDay[];
  today: string;
  locale: Locale;
  t: (typeof advisoryCopy)[Locale];
}) {
  const tide = (row: FewsRow, peak: boolean) => (
    <li key={row.at} className={clsx(peak && "font-semibold")}>
      {formatBangkokClock(row.at)}
      {locale === "th" ? " น." : ""} ({row.value.toFixed(2)} {t.metres})
    </li>
  );

  return (
    <div
      role="region"
      aria-label={t.caption}
      tabIndex={0}
      className="max-w-full overflow-x-auto rounded-md border border-line bg-surface"
    >
      <table className="w-full min-w-[20rem] border-collapse text-left text-sm leading-relaxed">
        <caption className="px-3 py-2 text-left text-muted">{t.caption}</caption>
        <thead>
          <tr className="border-y border-line bg-sunken">
            <th scope="col" className="px-3 py-2 font-semibold">
              {t.columns.date}
            </th>
            <th scope="col" className="px-3 py-2 font-semibold">
              {t.columns.highs}
            </th>
            <th scope="col" className="px-3 py-2 font-semibold">
              {t.columns.lows}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {days.map((day) => {
            const isToday = day.date === today;
            const peak = Math.max(...day.highs.map((row) => row.value));
            return (
              <tr
                key={day.date}
                aria-current={isToday ? "date" : undefined}
                className={clsx(isToday && "bg-sunken")}
              >
                <th scope="row" className="px-3 py-2 align-top font-medium">
                  {dayLabel(day.date, locale)}
                  {isToday ? <span className="block text-muted">{t.today}</span> : null}
                </th>
                <td className="px-3 py-2 align-top">
                  <ul>{day.highs.map((row) => tide(row, row.value === peak))}</ul>
                </td>
                <td className="px-3 py-2 align-top">
                  <ul>{day.lows.map((row) => tide(row, false))}</ul>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
