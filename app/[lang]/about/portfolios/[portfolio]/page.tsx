import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, locales, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getPortfolio, portfolioIds, type PortfolioId } from "@/lib/portfolios";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import { Heading, Text } from "@/components/bds/Type";
import { Wrap } from "@/components/bds/Layout";
import PortfolioHolders from "@/components/about/PortfolioHolders";
import { getPortfolioHolders } from "@/app/[lang]/about/portfolioDirectory";

/**
 * `/about/portfolios/[portfolio]` (Wave 5, REDESIGN-2.0 §3.2, §7.2).
 *
 * One portfolio, its current holder(s), and how to reach it. `[portfolio]`
 * is validated against `lib/portfolios.ts`'s FROZEN `portfolioIds` before
 * anything else runs, so this route can never render a portfolio that does
 * not exist.
 *
 * No holder here carries anything beyond what
 * `components/about/CommitteeRoster.tsx` already publishes: a name, a
 * nickname, a role title, a portrait through `components/bds/Portrait`'s
 * placeholder-preserving lookup. No email is shown per holder, because
 * `content/committee.ts` (the real roster this page reads) carries none;
 * see this page's `noRoleEmail` copy for how that is stated honestly rather
 * than invented.
 */
function isPortfolioId(value: string): value is PortfolioId {
  return (portfolioIds as readonly string[]).includes(value);
}

export function generateStaticParams() {
  return locales.flatMap((lang) => portfolioIds.map((portfolio) => ({ lang, portfolio })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; portfolio: string }>;
}): Promise<Metadata> {
  const { lang, portfolio: portfolioParam } = await params;
  if (!isLocale(lang) || !isPortfolioId(portfolioParam)) return {};
  const dict = getDictionary(lang);
  const portfolio = getPortfolio(portfolioParam);
  return buildMetadata({
    locale: lang,
    title: `${portfolio.label[lang]}: ${dict.site.name}`,
    description: dict.about.portfolioDetail.holdersHeading,
    path: `/about/portfolios/${portfolioParam}`,
  });
}

export default async function AboutPortfolioDetailPage({
  params,
}: {
  params: Promise<{ lang: string; portfolio: string }>;
}) {
  const { lang, portfolio: portfolioParam } = await params;
  if (!isLocale(lang)) notFound();
  if (!isPortfolioId(portfolioParam)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.about.portfolioDetail;

  const portfolio = getPortfolio(portfolioParam);
  const holders = getPortfolioHolders(portfolioParam).map((member) => ({
    key: member.key,
    firstName: member[locale].firstName,
    lastName: member[locale].lastName,
    nickname: member[locale].nickname,
    title: member[locale].title,
  }));

  return (
    <>
      <PageHeader
        title={portfolio.label[locale]}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: dict.about.hub.title, href: "/about" },
              { label: dict.about.portfolios.title, href: "/about/portfolios" },
              { label: portfolio.label[locale] },
            ]}
          />
        }
        helpSlot={
          <Button href={localeHref(locale, "/about/portfolios")} variant="ghost">
            {t.backToPortfolios}
          </Button>
        }
      />
      <Wrap className="flex flex-col gap-10 py-10">
        <section className="flex flex-col gap-4">
          <Heading level={2}>{t.holdersHeading}</Heading>
          <PortfolioHolders
            holders={holders}
            locale={locale}
            singleHolderNote={t.singleHolderNote}
          />
        </section>

        <section className="flex flex-col gap-3">
          <Heading level={2}>{t.contactHeading}</Heading>
          <Text step="body">{t.noRoleEmail}</Text>
          <div>
            <Button href={localeHref(locale, "/contact")} variant="secondary">
              {t.generalContactCta}
            </Button>
          </div>
        </section>
      </Wrap>
    </>
  );
}
