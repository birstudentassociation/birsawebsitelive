import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { fillTemplate, formatBangkokDateTime } from "@/lib/conditions/format";
import {
  aboveWarning,
  BMA_CANAL_PAGE,
  countByStatus,
  getCanalSnapshot,
  nearestStations,
  STATUS_ORDER,
  type CanalStatus,
} from "@/lib/conditions/sources/canals";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import ExternalLink from "@/components/ExternalLink";
import CanalTable from "@/components/conditions/CanalTable";

export const revalidate = 600;

const NEAREST_COUNT = 8;

const tileClass: Record<CanalStatus, string> = {
  critical: "text-error",
  warning: "text-warning",
  normal: "text-success",
  low: "text-ink",
  noData: "text-muted",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang).canalsPage;

  return buildMetadata({
    locale: lang,
    title: t.title,
    description: t.metaDescription,
    path: "/conditions/canals",
  });
}

export default async function CanalsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.canalsPage;
  const newTabLabel = dict.a11y.newTab;

  const snapshot = await getCanalSnapshot();
  const stations = snapshot?.stations ?? [];
  const collator = new Intl.Collator(locale === "th" ? "th" : "en-GB");
  const sorted = [...stations].sort((a, b) => collator.compare(a.name[locale], b.name[locale]));
  const counts = countByStatus(stations);
  const alerts = aboveWarning(stations);
  const bmaLink = (
    <ExternalLink
      href={BMA_CANAL_PAGE}
      newTabLabel={newTabLabel}
      className="text-brand-deep underline"
    >
      {t.bmaLink}
    </ExternalLink>
  );

  return (
    <>
      <PageHeader
        title={t.title}
        lede={t.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: dict.conditionsPage.breadcrumb, href: "/conditions" },
              { label: t.breadcrumb },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-12 py-10">
        {snapshot === null ? (
          <div className="flex max-w-[var(--measure)] flex-col gap-3">
            <p>{t.unavailable}</p>
            <p>{bmaLink}</p>
          </div>
        ) : (
          <>
            <section aria-labelledby="summary-heading" className="flex flex-col gap-4">
              <h2 id="summary-heading" className="font-display text-2xl">
                {t.summaryHeading}
              </h2>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {STATUS_ORDER.map((status) => (
                  <li key={status} className="rounded-md border border-line bg-surface p-4">
                    <p className={`font-display text-3xl tabular-nums ${tileClass[status]}`}>
                      {counts[status]}
                    </p>
                    <p className="text-sm text-muted">{t.status[status]}</p>
                  </li>
                ))}
              </ul>
              <p className="max-w-[var(--measure)] text-sm text-muted">{t.statusHelp}</p>
            </section>

            <section aria-labelledby="nearest-heading" className="flex flex-col gap-4">
              <div>
                <h2 id="nearest-heading" className="font-display text-2xl">
                  {t.nearestHeading}
                </h2>
                <p className="mt-1 text-muted">
                  {fillTemplate(t.nearestLede, { count: String(NEAREST_COUNT) })}
                </p>
              </div>
              <CanalTable
                locale={locale}
                caption={t.nearestHeading}
                stations={nearestStations(stations, NEAREST_COUNT)}
                showDistance
                t={t}
              />
            </section>

            <section aria-labelledby="alert-heading" className="flex flex-col gap-4">
              <h2 id="alert-heading" className="font-display text-2xl">
                {t.alertHeading}
              </h2>
              {alerts.length === 0 ? (
                <p className="text-muted">{t.alertNone}</p>
              ) : (
                <CanalTable
                  locale={locale}
                  caption={t.alertHeading}
                  stations={alerts}
                  showDistance
                  t={t}
                />
              )}
            </section>

            <section aria-labelledby="all-heading" className="flex flex-col gap-4">
              <div>
                <h2 id="all-heading" className="font-display text-2xl">
                  {t.allHeading}
                </h2>
                <p className="mt-1 text-muted">{t.allLede}</p>
              </div>
              <CanalTable locale={locale} caption={t.allHeading} stations={sorted} t={t} />
            </section>
          </>
        )}

        <footer className="flex max-w-[var(--measure)] flex-col gap-3 border-t border-line pt-6 text-sm text-muted">
          {snapshot?.observedAt ? (
            <p className="font-semibold text-ink">
              {fillTemplate(t.updatedAt, {
                time: formatBangkokDateTime(snapshot.observedAt, locale),
              })}
            </p>
          ) : null}
          <p>{t.disclaimer}</p>
          <p>{t.attribution}</p>
          {snapshot === null ? null : <p>{bmaLink}</p>}
        </footer>
      </div>
    </>
  );
}
