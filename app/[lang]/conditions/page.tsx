import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getLiveAlert } from "@/lib/emergency";
import { getConditionsSnapshot } from "@/lib/conditions/snapshot";
import { buildNextHours, fillTemplate, formatBangkokClock } from "@/lib/conditions/format";
import type { Reading, ReadingId } from "@/lib/conditions/types";
import { cardTitles, levelLabels } from "@/content/conditions/rules";
import { readingCopy, readingSections } from "@/content/conditions/readings";
import PageHeader from "@/components/PageHeader";
import ExternalLink from "@/components/ExternalLink";
import AlertStatus from "@/components/emergency/AlertStatus";
import VerdictCard from "@/components/conditions/VerdictCard";
import ReadingRow from "@/components/conditions/ReadingRow";
import NextHours from "@/components/conditions/NextHours";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang).conditionsPage;

  return buildMetadata({
    locale: lang,
    title: t.title,
    description: t.metaDescription,
    path: "/conditions",
  });
}

const officialSources = [
  { id: "tmd", href: "https://www.tmd.go.th/en" },
  { id: "bma", href: "https://weather.bangkok.go.th/" },
  { id: "thaiwater", href: "https://www.thaiwater.net/water/wl" },
  { id: "air4thai", href: "https://air4thai.pcd.go.th/" },
  { id: "express", href: "https://www.facebook.com/chaophrayaexpressboat" },
  { id: "traffy", href: "https://traffy.in.th/" },
] as const;

export default async function ConditionsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.conditionsPage;
  const newTabLabel = dict.a11y.newTab;

  const snapshot = await getConditionsSnapshot();
  const now = new Date(snapshot.generatedAt);
  const live = getLiveAlert();
  const readingsById = new Map<ReadingId, Reading>(
    snapshot.readings.map((reading) => [reading.id, reading])
  );
  const hourRows = buildNextHours(snapshot.readings, now);

  return (
    <>
      <PageHeader title={t.title} lede={t.lede} />
      <div className="wrap flex flex-col gap-12 py-10">
        {live ? (
          <div className="max-w-[var(--measure)]">
            <AlertStatus
              locale={locale}
              live={live}
              t={dict.emergencyPage}
              showGuideLink
              updatesHref={localeHref(locale, `/emergency/${live.scenario.id}#live-updates`)}
            />
          </div>
        ) : null}

        <section aria-labelledby="checks-heading" className="flex flex-col gap-4">
          <h2 id="checks-heading" className="font-display text-2xl">
            {t.checksHeading}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {snapshot.cards.map((verdict) => (
              <VerdictCard
                key={verdict.card}
                locale={locale}
                verdict={verdict}
                title={cardTitles[verdict.card][locale]}
                levelLabel={levelLabels[verdict.level][locale]}
                uncheckedLabels={verdict.unchecked.map((id) => readingCopy[id].label[locale])}
                t={t}
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="next-hours-heading" className="flex flex-col gap-4">
          <h2 id="next-hours-heading" className="font-display text-2xl">
            {t.nextHoursHeading}
          </h2>
          <NextHours rows={hourRows} t={t} />
        </section>

        <section aria-labelledby="readings-heading" className="flex flex-col gap-6">
          <div className="max-w-[var(--measure)]">
            <h2 id="readings-heading" className="font-display text-2xl">
              {t.readingsHeading}
            </h2>
            <p className="mt-1 text-muted">{t.readingsLede}</p>
          </div>
          {readingSections.map((section) => {
            const rows = section.readings.flatMap((id) => {
              const reading = readingsById.get(id);
              return reading ? [reading] : [];
            });
            if (rows.length === 0) return null;
            return (
              <div key={section.id} className="flex max-w-[var(--measure)] flex-col gap-1">
                <h3 className="font-display text-xl">{section.heading[locale]}</h3>
                <ul className="flex flex-col divide-y divide-line border-y border-line">
                  {rows.map((reading) => (
                    <ReadingRow
                      key={reading.id}
                      locale={locale}
                      reading={reading}
                      label={readingCopy[reading.id].label[locale]}
                      threshold={readingCopy[reading.id].threshold[locale]}
                      now={now}
                      newTabLabel={newTabLabel}
                      t={t}
                    />
                  ))}
                </ul>
              </div>
            );
          })}
        </section>

        <section
          aria-labelledby="official-sources-heading"
          className="flex max-w-[var(--measure)] flex-col gap-3"
        >
          <div>
            <h2 id="official-sources-heading" className="font-display text-2xl">
              {t.sourcesHeading}
            </h2>
            <p className="mt-1 text-muted">{t.sourcesLede}</p>
          </div>
          <ul className="flex flex-col gap-2">
            {officialSources.map((source) => (
              <li key={source.id}>
                <ExternalLink
                  href={source.href}
                  newTabLabel={newTabLabel}
                  className="text-brand-deep underline"
                >
                  {t.sourceLinks[source.id]}
                </ExternalLink>
              </li>
            ))}
            <li>
              <Link
                href={localeHref(locale, "/conditions/canals")}
                className="text-brand-deep underline"
              >
                {t.sourceLinks.canals}
              </Link>
            </li>
            <li>
              <Link href={localeHref(locale, "/emergency")} className="text-brand-deep underline">
                {t.sourceLinks.emergency}
              </Link>
            </li>
          </ul>
        </section>

        <footer className="flex max-w-[var(--measure)] flex-col gap-3 border-t border-line pt-6 text-sm text-muted">
          <p className="font-semibold text-ink">
            {fillTemplate(t.updatedAt, { time: formatBangkokClock(snapshot.generatedAt) })}
          </p>
          <p>{t.disclaimer}</p>
          <h2 className="font-semibold text-ink">{t.attributionHeading}</h2>
          <ul className="flex list-disc flex-col gap-1 pl-5">
            {t.attributions.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </footer>
      </div>
    </>
  );
}
