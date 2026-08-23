import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getPortfolio } from "@/lib/portfolios";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import { Text } from "@/components/bds/Type";
import { Wrap } from "@/components/bds/Layout";
import BudgetTable from "@/components/about/BudgetTable";
import { listPublishedBudgetEntries } from "@/app/[lang]/about/cms";

/**
 * `/about/budget` (Wave 5, REDESIGN-2.0 §3.2, Decision 2). "What the
 * committee spent this semester's budget on" landed here directly. See
 * `components/about/BudgetTable.tsx` for how the total is computed rather
 * than typed.
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
    title: `${dict.about.budget.title}: ${dict.site.name}`,
    description: dict.about.budget.lede,
    path: "/about/budget",
  });
}

export default async function AboutBudgetPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.about.budget;

  const records = await listPublishedBudgetEntries();

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
        {records.length === 0 ? (
          <Text step="body" className="text-muted">
            {t.empty}
          </Text>
        ) : (
          <BudgetTable
            locale={locale}
            entries={records.map((record) => ({
              id: record.id,
              description: record.description[locale],
              amount: record.amount,
              direction: record.direction,
              entryDate: record.entryDate,
              portfolioLabel: getPortfolio(record.portfolioId).label[locale],
            }))}
            copy={{
              tableCaption: t.tableCaption,
              dateHeader: t.dateHeader,
              descriptionHeader: t.descriptionHeader,
              portfolioHeader: t.portfolioHeader,
              directionHeader: t.directionHeader,
              amountHeader: t.amountHeader,
              direction: t.direction,
              totalsHeading: t.totalsHeading,
              totalIncomeLabel: t.totalIncomeLabel,
              totalExpenseLabel: t.totalExpenseLabel,
              netLabel: t.netLabel,
            }}
          />
        )}
      </Wrap>
    </>
  );
}
