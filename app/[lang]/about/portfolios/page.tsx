import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, pluralize, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import NavList, { NavListItem } from "@/components/bds/NavList";
import { Wrap } from "@/components/bds/Layout";
import { listPortfoliosWithHolders } from "@/app/[lang]/about/portfolioDirectory";

/**
 * `/about/portfolios` (Wave 5, REDESIGN-2.0 §3.2, §7.2).
 *
 * Every standing portfolio, and how many committee members currently hold
 * it. The count itself is the point: it is what surfaces §7.2's two person
 * rule at a glance, before a reader even opens a portfolio's own page.
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
    title: `${dict.about.portfolios.title}: ${dict.site.name}`,
    description: dict.about.portfolios.lede,
    path: "/about/portfolios",
  });
}

export default async function AboutPortfoliosPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.about.portfolios;

  const entries = listPortfoliosWithHolders();

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
      <Wrap className="py-10">
        <NavList>
          {entries.map(({ portfolio, holders }) => (
            <NavListItem
              key={portfolio.id}
              href={localeHref(locale, `/about/portfolios/${portfolio.id}`)}
              title={portfolio.label[locale]}
              level={2}
              footnote={pluralize(holders.length, {
                one: t.holderCount.one,
                other: t.holderCount.other.replace("{n}", String(holders.length)),
              })}
            />
          ))}
        </NavList>
      </Wrap>
    </>
  );
}
