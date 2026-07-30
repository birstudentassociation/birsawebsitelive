import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getItemByKey } from "@/lib/inventory/items";
import { buildLoanWizardLabels } from "@/components/equipment/loanWizardCopy";
import PageHeader from "@/components/PageHeader";
import StepNav from "@/components/forms/StepNav";
import LoanRequestWizard from "@/components/equipment/LoanRequestWizard";
import { formatStepOf } from "@/components/forms/wizardChromeCopy";
import { getLoanDraft, submitLoanRequestCheck } from "../actions";
import { LOAN_STEPS } from "../steps";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; item: string }>;
}): Promise<Metadata> {
  const { lang, item: itemKey } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const item = await getItemByKey(itemKey);
  if (!item) return {};
  return buildMetadata({
    locale,
    title: item.name[locale],
    description: item.name[locale],
    path: `/services/equipment-loan/${itemKey}/request/check`,
  });
}

export default async function LoanRequestCheckPage({
  params,
}: {
  params: Promise<{ lang: string; item: string }>;
}) {
  const { lang, item: itemKey } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const item = await getItemByKey(itemKey);
  if (!item || item.isRetired) notFound();
  const labels = buildLoanWizardLabels(locale, item);
  const draft = await getLoanDraft(itemKey);
  const base = `/services/equipment-loan/${itemKey}/request`;
  const progress = formatStepOf(labels.common.stepOf, LOAN_STEPS.indexOf("check") + 1, LOAN_STEPS.length);

  return (
    <>
      <PageHeader title={labels.check.title} />
      <div className="wrap max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <StepNav
            backHref={localeHref(locale, `${base}/reason`)}
            backLabel={labels.common.back}
            progressText={progress}
          />
          <LoanRequestWizard
            item={item}
            locale={locale}
            labels={labels}
            draft={draft}
            action={submitLoanRequestCheck.bind(null, locale, item.key)}
          />
        </div>
      </div>
    </>
  );
}
