import { Fragment } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { alertBanner, getLiveAlert } from "@/lib/emergency";
import { getScenario, hasScenario, scenarioIds } from "@/content/emergency/scenarios";
import EmergencyHero from "@/components/EmergencyHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ExternalLink from "@/components/ExternalLink";
import Notice from "@/components/Notice";
import AlertStatus from "@/components/emergency/AlertStatus";
import LiveUpdates from "@/components/emergency/LiveUpdates";
import CallButtons from "@/components/emergency/CallButtons";
import ContactList from "@/components/emergency/ContactList";
import GuideSection from "@/components/emergency/GuideSection";

type Params = { lang: string; scenario: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return scenarioIds.map((scenario) => ({ scenario }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, scenario } = await params;
  if (!isLocale(lang) || !hasScenario(scenario)) return {};
  const c = getScenario(scenario)[lang];
  const live = getLiveAlert();
  // A shared link leads with the live alert, then what the guide covers.
  const description =
    live?.scenario.id === scenario ? `${alertBanner(live, lang)} ${c.summary}` : c.summary;

  // Unindexed: these pages should be found through the site and its banner
  // during an incident, never ranked in search on their own.
  return {
    ...buildMetadata({
      locale: lang,
      title: c.title,
      description,
      path: `/emergency/${scenario}`,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function EmergencyScenarioPage({ params }: { params: Promise<Params> }) {
  const { lang, scenario } = await params;
  if (!isLocale(lang) || !hasScenario(scenario)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.emergencyPage;
  const s = getScenario(scenario);
  const c = s[locale];
  const live = getLiveAlert();
  const isLive = live?.scenario.id === s.id;
  const hasUpdates = isLive && live && (live.alert.updates?.length ?? 0) > 0;
  const anchor = c.sections.findIndex((section) => section.id === live?.alert.updatesAfter);
  const updatesAfter = hasUpdates ? (anchor === -1 ? c.sections.length - 1 : anchor) : -2;

  return (
    <>
      <EmergencyHero
        tone={s.hero}
        title={c.title}
        lede={c.summary}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            onDark
            items={[{ label: t.breadcrumb, href: "/emergency" }, { label: c.title }]}
          />
        }
      />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-10 py-10">
        {isLive && live ? (
          <AlertStatus locale={locale} live={live} t={t} updatesHref="#live-updates" />
        ) : (
          <Notice title={t.notLiveTitle}>
            <p>
              {t.notLiveBody}{" "}
              <Link href={localeHref(locale, "/emergency")} className="underline">
                {t.seeAll}
              </Link>
            </p>
          </Notice>
        )}

        <section
          aria-labelledby="do-this-now"
          className="flex flex-col gap-4 rounded-lg border-2 border-ink bg-surface p-5"
        >
          <h2 id="do-this-now" className="font-display text-2xl">
            {t.doThisNow}
          </h2>
          <ol className="flex list-decimal flex-col gap-3 pl-6 text-lg leading-relaxed text-ink">
            {c.now.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="call" className="flex flex-col gap-3">
          <h2 id="call" className="font-display text-2xl">
            {t.call}
          </h2>
          <CallButtons locale={locale} ids={s.keyContacts} extLabel={t.ext} />
        </section>

        <nav aria-labelledby="on-this-page" className="flex flex-col gap-2">
          <h2 id="on-this-page" className="text-sm font-semibold text-muted">
            {t.onThisPage}
          </h2>
          <ul className="flex flex-col gap-1">
            {c.sections.map((section, i) => (
              <Fragment key={section.id}>
                <li>
                  <a href={`#${section.id}`} className="text-brand-deep underline">
                    {section.heading}
                  </a>
                </li>
                {i === updatesAfter ? (
                  <li>
                    <a href="#live-updates" className="text-brand-deep underline">
                      {t.liveUpdates}
                    </a>
                  </li>
                ) : null}
              </Fragment>
            ))}
            <li>
              <a href="#contacts" className="text-brand-deep underline">
                {t.contacts}
              </a>
            </li>
          </ul>
        </nav>

        {c.sections.map((section, i) => (
          <Fragment key={section.id}>
            <GuideSection
              section={section}
              locale={locale}
              districtLabels={{ ...t.districtFinder, newTab: dict.a11y.newTab }}
              extLabel={t.ext}
              newTabLabel={dict.a11y.newTab}
            />
            {i === updatesAfter && live ? (
              <LiveUpdates locale={locale} alert={live.alert} t={t} />
            ) : null}
          </Fragment>
        ))}

        <section
          id="contacts"
          aria-labelledby="contacts-heading"
          className="flex scroll-mt-24 flex-col gap-4"
        >
          <h2 id="contacts-heading" className="font-display text-2xl">
            {t.contacts}
          </h2>
          <ContactList
            locale={locale}
            ids={[...s.keyContacts, ...s.moreContacts]}
            extLabel={t.ext}
            newTabLabel={dict.a11y.newTab}
          />
        </section>

        <footer className="flex flex-col gap-3 border-t border-line pt-6 text-sm leading-relaxed text-muted">
          <h2 className="font-semibold text-ink">{t.sources}</h2>
          <ul className="flex list-disc flex-col gap-1 pl-5">
            {s.sources.map((source) => (
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
          <p>
            {t.reviewed} {formatDate(locale, s.reviewed)}
          </p>
          <p>{t.disclaimer}</p>
        </footer>
      </div>
    </>
  );
}
