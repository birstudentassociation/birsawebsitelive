import type { Metadata } from "next";
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
import Button from "@/components/Button";
import { service } from "@/content/smart-answers";
import { getTopic } from "@/lib/smart-answers";
import { informationTopicCopy } from "@/content/information/topics";

const TOPIC = "applying-to-bir";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const CHECK_SLUG = "admission-round";

const copy: Record<Locale, { start: string; guidesHeading: string; checked: string }> = {
  en: { start: "Start now", guidesHeading: "All guides on applying", checked: "Last checked" },
  th: { start: "เริ่มเลย", guidesHeading: "คู่มือการสมัครทั้งหมด", checked: "ตรวจสอบล่าสุด" },
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
  const check = getTopic(service, CHECK_SLUG);
  if (!check) notFound();
  const topicCopy = informationTopicCopy[locale][TOPIC];
  const guides = getInformationGuideEntries(locale, TOPIC).filter(
    (entry) => !entry.frontmatter.placeholder
  );

  return (
    <>
      <PageHeader
        title={topicCopy.title}
        lede={topicCopy.lede}
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
        <section
          aria-labelledby="applying-check"
          className="flex max-w-[var(--measure)] flex-col gap-4"
        >
          <h2 id="applying-check" className="font-display text-2xl">
            {check.title[locale]}
          </h2>
          <p className="leading-relaxed text-ink">{check.lede[locale]}</p>
          <div>
            <Button href={localeHref(locale, check.path)}>{t.start}</Button>
          </div>
        </section>

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
