import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getItemByKey } from "@/lib/inventory/items";
import { buildLoanWizardLabels } from "@/components/equipment/loanWizardCopy";
import PageHeader from "@/components/PageHeader";
import StepNav from "@/components/forms/StepNav";
import QuestionStepForm from "@/components/forms/QuestionStepForm";
import { formatStepOf } from "@/components/forms/wizardChromeCopy";
import { getLoanDraft, submitReasonStep } from "../actions";
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
    path: `/services/equipment-loan/${itemKey}/request/reason`,
  });
}

export default async function LoanRequestReasonPage({
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
  const backHref = localeHref(locale, returnTo === "check" ? `${base}/check` : `${base}/dates`);
  const progress = returnTo === "check"
    ? undefined
    : formatStepOf(labels.common.stepOf, LOAN_STEPS.indexOf("reason") + 1, LOAN_STEPS.length);

  return (
    <>
      <PageHeader title={labels.reason.question} />
      <div className="wrap max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <StepNav backHref={backHref} backLabel={labels.common.back} progressText={progress} />
          <QuestionStepForm
            action={submitReasonStep.bind(null, locale, itemKey, returnTo, labels)}
            initialState={{ status: "idle" }}
            errorSummaryTitle={labels.common.errorSummaryTitle}
            continueLabel={labels.common.continueLabel}
            continuingLabel={labels.common.continuing}
            field={{
              name: "reason",
              as: "textarea",
              label: labels.reason.question,
              hint: labels.reason.hint,
              optionalLabel: labels.common.optional,
              defaultValue: draft.reason,
              rows: 6,
            }}
          />
          <p className="text-muted text-sm">{labels.reason.optionalNote}</p>
        </div>
      </div>
    </>
  );
}
