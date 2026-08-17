import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getItemByKey } from "@/lib/inventory/items";
import { buildLoanWizardLabels } from "@/components/equipment/loanWizardCopy";
import PageHeader from "@/components/PageHeader";
import StepNav from "@/components/forms/StepNav";
import DatesStepForm from "@/components/equipment/DatesStepForm";
import { formatStepOf } from "@/components/forms/wizardChromeCopy";
import { getLoanDraft, submitDatesStep } from "../actions";
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
    path: `/services/equipment-loan/${itemKey}/request/dates`,
  });
}

function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default async function LoanRequestDatesPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; item: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { lang, item: itemKey } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const item = await getItemByKey(itemKey);
  if (!item || item.isRetired) notFound();
  const labels = buildLoanWizardLabels(locale, item);
  const { returnTo } = await searchParams;

  const draft = await getLoanDraft(itemKey);
  const base = `/services/equipment-loan/${itemKey}/request`;
  const backHref = localeHref(locale, returnTo === "check" ? `${base}/check` : `${base}/phone`);
  const progress =
    returnTo === "check"
      ? undefined
      : formatStepOf(labels.common.stepOf, LOAN_STEPS.indexOf("dates") + 1, LOAN_STEPS.length);

  return (
    <>
      <PageHeader title={labels.dates.title} />
      <div className="wrap max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <StepNav backHref={backHref} backLabel={labels.common.back} progressText={progress} />
          <DatesStepForm
            action={submitDatesStep.bind(null, locale, itemKey, returnTo, labels, item.maxLoanDays)}
            labels={labels}
            defaultStartDate={draft.startDate}
            defaultEndDate={draft.endDate}
            minStartDate={todayISO()}
            maxLoanDays={item.maxLoanDays}
          />
        </div>
      </div>
    </>
  );
}
