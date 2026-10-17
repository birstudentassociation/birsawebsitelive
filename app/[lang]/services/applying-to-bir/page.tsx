import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDictionary,
  isLocale,
  formatGuideDate,
  localeHref,
  locales,
  type Locale,
} from "@/lib/i18n";
import { getInformationGuideEntries } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import NavList, { NavListItem } from "@/components/NavList";
import StepByStep from "@/components/onboarding/StepByStep";
import Notice from "@/components/Notice";
import { onboardingUiCopy } from "@/content/onboarding";
import { informationTopicCopy } from "@/content/information/topics";
import { applyingLede, applyingSteps } from "@/content/information/applying-to-bir/steps";

const TOPIC = "applying-to-bir";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const copy: Record<Locale, { guidesHeading: string; checked: string }> = {
  en: { guidesHeading: "All guides on applying", checked: "Last checked" },
  th: { guidesHeading: "คู่มือการสมัครทั้งหมด", checked: "ตรวจสอบล่าสุด" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  return buildMetadata({
    locale,
    title: informationTopicCopy[locale][TOPIC].title,
    description: informationTopicCopy[locale][TOPIC].lede,
    path: `/services/${TOPIC}`,
  });
}

export default async function ApplyingToBirPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const infoServicesLabel = dict.nav.find((n) => n.href === "/services")!.label;
  const t = copy[locale];
  const ui = onboardingUiCopy[locale];
  const topicCopy = informationTopicCopy[locale][TOPIC];
  const guides = getInformationGuideEntries(locale, TOPIC).filter(
    (entry) => !entry.frontmatter.placeholder
  );

  return (
    <>
      <PageHeader
        title={topicCopy.title}
        lede={applyingLede[locale]}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: infoServicesLabel, href: "/services" },
              { label: topicCopy.title },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-12 py-10">
        <div className="flex max-w-[var(--measure)] flex-col gap-8">
          <StepByStep
            locale={locale}
            storageKey="birsa-onboarding-applying-to-bir"
            idPrefix="applying"
            steps={applyingSteps.map((step) => ({
              id: step.id,
              title: step.title[locale],
              blurb: step.blurb?.[locale],
              connector: step.connector,
              tasks: step.tasks.map((task) => ({
                id: task.id,
                label: task.label[locale],
                hint: task.hint?.[locale],
                href: task.href,
                external: task.external,
              })),
            }))}
          />

          <Notice variant="info" title={ui.track.privacyTitle}>
            <p>{ui.track.privacyBody}</p>
            <p className="mt-2">
              <Link
                href={localeHref(locale, "/privacy")}
                className="font-semibold text-brand-deep underline hover:text-brand-dark"
              >
                {ui.track.privacyLinkLabel}
              </Link>
            </p>
          </Notice>
        </div>

        <section aria-labelledby="applying-guides" className="flex flex-col gap-4">
          <h2 id="applying-guides" className="font-display text-2xl">
            {t.guidesHeading}
          </h2>
          <NavList>
            {guides.map((entry) => (
              <NavListItem
                key={entry.slug}
                href={localeHref(locale, `/services/${TOPIC}/${entry.slug}`)}
                title={entry.frontmatter.title}
                as="h3"
                footnote={`${t.checked} ${formatGuideDate(locale, entry.frontmatter.reviewed)}`}
              >
                {entry.frontmatter.summary}
              </NavListItem>
            ))}
          </NavList>
        </section>
      </div>
    </>
  );
}
