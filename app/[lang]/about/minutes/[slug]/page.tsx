import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, formatDate, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import SummaryList from "@/components/bds/SummaryList";
import { Wrap } from "@/components/bds/Layout";
import MinutesSummary from "@/components/about/MinutesSummary";
import { getPublishedMinutesBySlug } from "@/app/[lang]/about/cms";

/**
 * `/about/minutes/[slug]` (Wave 5, REDESIGN-2.0 §3.2, DECISIONS-2.0.md's
 * minutes redaction model). See `components/about/MinutesSummary.tsx` for
 * how the withheld items are presented, and what this page deliberately
 * never says about them.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  const minutes = await getPublishedMinutesBySlug(slug);
  if (!minutes) return {};
  return buildMetadata({
    locale: lang,
    title: `${minutes.title}: ${dict.about.minutesIndex.title}: ${dict.site.name}`,
    description: dict.about.minutesDetail.publicSummaryHeading,
    path: `/about/minutes/${slug}`,
  });
}

export default async function AboutMinutesDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.about.minutesDetail;

  const minutes = await getPublishedMinutesBySlug(slug);
  if (!minutes) notFound();

  return (
    <>
      <PageHeader
        title={minutes.title}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: dict.about.hub.title, href: "/about" },
              { label: dict.about.minutesIndex.title, href: "/about/minutes" },
              { label: minutes.title },
            ]}
          />
        }
        helpSlot={
          <Button href={localeHref(locale, "/about/minutes")} variant="ghost">
            {t.backToMinutes}
          </Button>
        }
      />
      <Wrap className="flex flex-col gap-8 py-10">
        <SummaryList
          rows={[
            {
              id: "meeting-date",
              label: t.meetingDateLabel,
              value: formatDate(locale, minutes.meetingDate),
            },
          ]}
        />
        <MinutesSummary
          publicSummary={minutes.publicSummary[locale]}
          redactedItems={minutes.redactedItems}
          copy={{
            publicSummaryHeading: t.publicSummaryHeading,
            withheldHeading: t.withheldHeading,
            withheldIntro: t.withheldIntro,
            withheldItemLabel: t.withheldItemLabel,
            withheldItemColumn: t.withheldItemColumn,
            withheldCategoryColumn: t.withheldCategoryColumn,
            categories: t.categories,
          }}
        />
      </Wrap>
    </>
  );
}
