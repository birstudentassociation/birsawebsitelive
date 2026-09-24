import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getItemByKey } from "@/lib/inventory/items";
import { buildLoanWizardLabels } from "@/components/equipment/loanWizardCopy";
import ConfirmationPage from "@/components/forms/ConfirmationPage";

type Params = Promise<{ lang: string; item: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, item: itemKey } = await params;
  if (!isLocale(lang)) return {};
  const item = await getItemByKey(itemKey);
  if (!item) return {};
  const labels = buildLoanWizardLabels(lang, item);
  const metadata = buildMetadata({
    locale: lang,
    title: `${labels.confirmation.title} | ${item.name[lang]}`,
    description: labels.confirmation.keepReference,
    path: `/services/equipment-loan/${itemKey}/request/sent`,
  });
  return { ...metadata, robots: { index: false, follow: false } };
}

/**
 * The reference arrives in the query string, so the page can be bookmarked
 * as a receipt. It is not a secret: checking a request needs the reference
 * and the email address together.
 */
export default async function LoanRequestSentPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { lang, item: itemKey } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const item = await getItemByKey(itemKey);
  if (!item) notFound();
  const labels = buildLoanWizardLabels(locale, item);
  const { ref } = await searchParams;
  const reference = typeof ref === "string" && /^[A-Z0-9-]{4,32}$/.test(ref) ? ref : "";

  return (
    <ConfirmationPage
      locale={locale}
      title={labels.confirmation.title}
      reference={{ label: labels.confirmation.referenceLabel, value: reference }}
      next={[
        ...(reference ? [labels.confirmation.keepReference] : []),
        ...labels.confirmation.nextSteps,
      ]}
      links={[
        {
          href: localeHref(locale, "/services/equipment-loan/status"),
          label: labels.confirmation.checkStatus,
        },
        {
          href: localeHref(locale, "/services/equipment-loan"),
          label: labels.confirmation.backToCatalogue,
        },
      ]}
      sourcePath={localeHref(locale, `/services/equipment-loan/${itemKey}/request/sent`)}
    />
  );
}
