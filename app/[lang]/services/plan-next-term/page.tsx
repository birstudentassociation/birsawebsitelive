import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import PageHeader from "@/components/PageHeader";
import StepByStep from "@/components/onboarding/StepByStep";
import { onboardingUiCopy } from "@/content/onboarding";
import { NEXT_TERM_PATH, keyDateRows, nextTermCopy, nextTermSteps } from "@/content/next-term";
import { todayInBangkok } from "@/lib/bangkok-today";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { getJourneyPhase, getNextTermJourney } from "@/lib/next-term";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

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
  const copy = nextTermCopy[lang];
  const journey = getNextTermJourney(todayInBangkok());
  return buildMetadata({
    locale: lang,
    title: copy.title,
    description: journey ? copy.lede(journey) : copy.noJourneyBody,
    path: NEXT_TERM_PATH,
  });
}

export default async function PlanNextTermPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const copy = nextTermCopy[locale];
  const todayKey = todayInBangkok();
  const journey = getNextTermJourney(todayKey);
  const ui = onboardingUiCopy[locale];

  return (
    <>
      <PageHeader
        title={copy.title}
        lede={journey ? copy.lede(journey) : undefined}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: copy.breadcrumb, href: "/services" },
              { label: copy.title },
            ]}
          />
        }
      />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-8 py-10">
        {journey ? (
          <>
            <section
              aria-labelledby="key-dates-heading"
              className="rounded-2xl border border-line bg-surface p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="key-dates-heading" className="font-display text-xl">
                  {copy.keyDatesHeading}
                </h2>
                <span className="rounded-full bg-study-tint px-3 py-1 text-sm font-semibold text-study">
                  {copy.phase(getJourneyPhase(journey, todayKey))}
                </span>
              </div>
              <dl className="mt-3 divide-y divide-line">
                {keyDateRows(locale, journey).map((row) => (
                  <div
                    key={row.label}
                    className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-4"
                  >
                    <dt className="font-semibold">{row.label}</dt>
                    <dd className="text-muted">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <StepByStep
              locale={locale}
              storageKey={`birsa-next-term-${journey.termKey}`}
              idPrefix="next-term"
              steps={nextTermSteps(locale, journey)}
            />

            <Notice locale={locale} variant="info" title={ui.track.privacyTitle}>
              <p>{ui.track.privacyBody}</p>
            </Notice>
          </>
        ) : (
          <Notice locale={locale} variant="info" title={copy.noJourneyTitle}>
            <p>{copy.noJourneyBody}</p>
          </Notice>
        )}

        <Link
          href={localeHref(locale, "/dates")}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-deep hover:text-brand-dark"
        >
          {copy.allDates}
        </Link>
      </div>
    </>
  );
}
