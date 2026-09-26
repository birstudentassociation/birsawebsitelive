import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getLiveAlert } from "@/lib/emergency";
import { scenarioGroups, scenarioIds, scenarios } from "@/content/emergency/scenarios";
import { helpNumbers, landingSections, landingSources } from "@/content/emergency/landing";
import PageHeader from "@/components/PageHeader";
import ExternalLink from "@/components/ExternalLink";
import Notice from "@/components/Notice";
import AlertStatus from "@/components/emergency/AlertStatus";
import CallButtons from "@/components/emergency/CallButtons";
import GuideSection from "@/components/emergency/GuideSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang).emergencyPage;

  // Unindexed like every emergency route.
  return {
    ...buildMetadata({
      locale: lang,
      title: t.indexTitle,
      description: t.indexLede,
      path: "/emergency",
    }),
    robots: { index: false, follow: false },
  };
}

/**
 * Emergency index: the live alert if there is one, the national numbers, every
 * guide grouped by kind, and how to get official alerts and be ready.
 */
export default async function EmergencyIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.emergencyPage;
  const live = getLiveAlert();

  return (
    <>
      <PageHeader title={t.indexTitle} lede={t.indexLede} />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-10 py-10">
        {live ? (
          <AlertStatus
            locale={locale}
            live={live}
            t={t}
            showGuideLink
            updatesHref={localeHref(locale, `/emergency/${live.scenario.id}#live-updates`)}
          />
        ) : (
          <Notice variant="success" title={t.noAlertTitle}>
            <p>{t.noAlertBody}</p>
          </Notice>
        )}

        <section aria-labelledby="call-for-help" className="flex flex-col gap-3">
          <div>
            <h2 id="call-for-help" className="font-display text-2xl">
              {t.callForHelp}
            </h2>
            <p className="text-muted">{t.callForHelpLede}</p>
          </div>
          <CallButtons locale={locale} ids={helpNumbers} extLabel={t.ext} />
        </section>

        <section aria-labelledby="guides" className="flex flex-col gap-6">
          <h2 id="guides" className="font-display text-2xl">
            {t.guides}
          </h2>
          {scenarioGroups.map((group) => {
            const ids = scenarioIds.filter((id) => scenarios[id].group === group);
            if (ids.length === 0) return null;
            return (
              <div key={group} className="flex flex-col gap-3">
                <h3 className="font-semibold">{t.groups[group]}</h3>
                <ul className="flex flex-col divide-y divide-line border-y border-line">
                  {ids.map((id) => {
                    const c = scenarios[id][locale];
                    return (
                      <li key={id} className="py-3">
                        <Link
                          href={localeHref(locale, `/emergency/${id}`)}
                          className="font-medium text-brand-deep underline"
                        >
                          {c.title}
                        </Link>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{c.summary}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </section>

        {landingSections[locale].map((section) => (
          <GuideSection
            key={section.id}
            section={section}
            extLabel={t.ext}
            newTabLabel={dict.a11y.newTab}
          />
        ))}

        <footer className="flex flex-col gap-3 border-t border-line pt-6 text-sm leading-relaxed text-muted">
          <h2 className="font-semibold text-ink">{t.sources}</h2>
          <ul className="flex list-disc flex-col gap-1 pl-5">
            {landingSources.map((source) => (
              <li key={source.href}>
                <ExternalLink
                  href={source.href}
                  newTabLabel={dict.a11y.newTab}
                  className="underline hover:text-brand-deep"
                >
                  {source.label[locale]}
                </ExternalLink>
              </li>
            ))}
          </ul>
          <p>{t.disclaimer}</p>
        </footer>
      </div>
    </>
  );
}
