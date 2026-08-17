import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import StepNav from "@/components/forms/StepNav";
import StatusLookup from "@/components/equipment/StatusLookup";
import CollectionNotice from "@/components/forms/CollectionNotice";
import { buildWizardChromeLabels, formatStepOf } from "@/components/forms/wizardChromeCopy";
import { getLoanStatusDraft, resetLoanStatusDraft, submitLookupStep } from "../actions";
import { LOAN_STATUS_STEPS } from "../steps";
import { statusLookupLabels } from "../statusLookupCopy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const title = locale === "th" ? "ตรวจสอบคำขอยืม" : "Check a loan request";
  return buildMetadata({
    locale,
    title,
    description: title,
    path: "/services/equipment-loan/status/email",
  });
}

export default async function LoanStatusEmailPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const labels = statusLookupLabels[locale];
  const chrome = buildWizardChromeLabels(locale);

  const draft = await getLoanStatusDraft();
  if (!draft.reference) {
    redirect(localeHref(locale, "/services/equipment-loan/status"));
  }
  const progress = formatStepOf(
    chrome.stepOf,
    LOAN_STATUS_STEPS.indexOf("email") + 1,
    LOAN_STATUS_STEPS.length
  );

  return (
    <>
      <PageHeader title={labels.emailLabel} />
      <div className="wrap max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <StepNav
            backHref={localeHref(locale, "/services/equipment-loan/status")}
            backLabel={chrome.back}
            progressText={progress}
          />
          <StatusLookup
            locale={locale}
            labels={labels}
            action={submitLookupStep.bind(null, labels)}
            resetAction={resetLoanStatusDraft.bind(null, locale)}
            defaultEmail={draft.email}
          />
          <CollectionNotice activityId="loan-status" locale={locale} />
        </div>
      </div>
    </>
  );
}
