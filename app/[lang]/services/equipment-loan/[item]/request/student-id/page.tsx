import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata, stepTitle } from "@/lib/seo";
import { getItemByKey } from "@/lib/inventory/items";
import { buildLoanWizardLabels } from "@/components/equipment/loanWizardCopy";
import PageHeader, { PAGE_HEADING_ID } from "@/components/PageHeader";
import QuestionStepForm from "@/components/forms/QuestionStepForm";
import CollectionNotice from "@/components/forms/CollectionNotice";
import { formatStepOf } from "@/components/forms/wizardChromeCopy";
import { getLoanDraft, submitStudentIdStep } from "../actions";
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
    title: stepTitle(buildLoanWizardLabels(locale, item).studentId.question, item.name[locale]),
    description: item.name[locale],
    path: `/services/equipment-loan/${itemKey}/request/student-id`,
  });
}

export default async function LoanRequestStudentIdPage({
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
  const backHref = localeHref(locale, returnTo === "check" ? `${base}/check` : `${base}/name`);
  const progress =
    returnTo === "check"
      ? undefined
      : formatStepOf(labels.common.stepOf, LOAN_STEPS.indexOf("studentId") + 1, LOAN_STEPS.length);

  return (
    <>
      <PageHeader
        title={labels.studentId.question}
        backHref={backHref}
        backLabel={labels.common.back}
        caption={progress}
      />
      <div className="wrap max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <QuestionStepForm
            action={submitStudentIdStep.bind(null, locale, itemKey, returnTo, labels)}
            initialState={{ status: "idle" }}
            errorSummaryTitle={labels.common.errorSummaryTitle}
            continueLabel={labels.common.continueLabel}
            continuingLabel={labels.common.continuing}
            field={{
              labelledBy: PAGE_HEADING_ID,
              name: "studentId",
              label: labels.studentId.question,
              hint: labels.studentId.hint,
              required: true,
              defaultValue: draft.studentId,
              autoComplete: "off",
            }}
          />
          <CollectionNotice activityId="equipment-loan" locale={locale} />
        </div>
      </div>
    </>
  );
}
