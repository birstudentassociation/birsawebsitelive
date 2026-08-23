import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import { Text } from "@/components/bds/Type";
import { Wrap } from "@/components/bds/Layout";

/**
 * `/about/this-year` (Wave 5, REDESIGN-2.0 §3.2).
 *
 * Deliberately not an essay. BIRSA does not maintain a separate "our plans
 * for the year" document that this page could faithfully render, and
 * writing one here would be inventing an institutional fact this brief
 * forbids. Instead this page says, honestly, that the record of the year is
 * the minutes and decisions themselves, and links straight to both.
 */
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
    title: `${dict.about.thisYear.title}: ${dict.site.name}`,
    description: dict.about.thisYear.lede,
    path: "/about/this-year",
  });
}

export default async function AboutThisYearPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.about.thisYear;

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
              { label: dict.about.hub.title, href: "/about" },
              { label: t.title },
            ]}
          />
        }
        helpSlot={
          <Button href={localeHref(locale, "/contact")} variant="ghost">
            {dict.actions.contactUs}
          </Button>
        }
      />
      <Wrap className="flex flex-col gap-4 py-10">
        <Text step="body">{t.body}</Text>
        <div className="flex flex-wrap gap-3">
          <Button href={localeHref(locale, "/about/decisions")} variant="secondary">
            {t.decisionsCta}
          </Button>
          <Button href={localeHref(locale, "/about/minutes")} variant="secondary">
            {t.minutesCta}
          </Button>
        </div>
      </Wrap>
    </>
  );
}
