import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, formatDate, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getPortfolio } from "@/lib/portfolios";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import { Wrap } from "@/components/bds/Layout";
import DecisionSummary from "@/components/about/DecisionSummary";
import { getPublishedDecisionBySlug } from "@/app/[lang]/about/cms";

/**
 * `/about/decisions/[slug]` (Wave 5, REDESIGN-2.0 §3.2). See
 * `components/about/DecisionSummary.tsx` for the one known gap in the
 * frozen `decision` schema this page renders around (`summary` has no
 * per-locale wrapper).
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  const decision = await getPublishedDecisionBySlug(slug);
  if (!decision) return {};
  return buildMetadata({
    locale: lang,
    title: `${decision.title}: ${dict.about.decisionsIndex.title}: ${dict.site.name}`,
    description: dict.about.decisionDetail.summaryHeading,
    path: `/about/decisions/${slug}`,
  });
}

export default async function AboutDecisionDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.about.decisionDetail;

  const decision = await getPublishedDecisionBySlug(slug);
  if (!decision) notFound();

  const portfolio = getPortfolio(decision.portfolioId);

  return (
    <>
      <PageHeader
        title={decision.title}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: dict.about.hub.title, href: "/about" },
              { label: dict.about.decisionsIndex.title, href: "/about/decisions" },
              { label: decision.title },
            ]}
          />
        }
        helpSlot={
          <Button href={localeHref(locale, "/about/decisions")} variant="ghost">
            {t.backToDecisions}
          </Button>
        }
      />
      <Wrap className="py-10">
        <DecisionSummary
          decisionDateFormatted={formatDate(locale, decision.decisionDate)}
          portfolioLabel={portfolio.label[locale]}
          meetingTitle={decision.meeting?.title}
          meetingHref={
            decision.meeting ? localeHref(locale, `/about/minutes/${decision.meeting.slug}`) : undefined
          }
          summary={decision.summary}
          whatChanged={decision.whatChanged[locale]}
          copy={{
            dateLabel: t.dateLabel,
            portfolioLabel: t.portfolioLabel,
            meetingLabel: t.meetingLabel,
            summaryHeading: t.summaryHeading,
            whatChangedHeading: t.whatChangedHeading,
          }}
        />
      </Wrap>
    </>
  );
}
