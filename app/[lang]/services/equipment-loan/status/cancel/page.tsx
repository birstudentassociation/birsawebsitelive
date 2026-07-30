import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import StepNav from "@/components/forms/StepNav";
import { buildWizardChromeLabels } from "@/components/forms/wizardChromeCopy";
import { getLoanStatusDraft, submitCancelConfirm } from "../actions";
import { statusLookupLabels } from "../page";
import CancelConfirmForm from "@/components/equipment/CancelConfirmForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const title = locale === "th" ? "ยกเลิกคำขอยืม" : "Cancel this loan request";
  return buildMetadata({
    locale,
    title,
    description: title,
    path: "/services/equipment-loan/status/cancel",
  });
}

export default async function LoanStatusCancelPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const labels = statusLookupLabels[locale];
  const chrome = buildWizardChromeLabels(locale);

  const draft = await getLoanStatusDraft();
  const emailStepHref = localeHref(locale, "/services/equipment-loan/status/email");
  if (!draft.reference || !draft.email) {
    redirect(emailStepHref);
  }

  return (
    <>
      <PageHeader title={labels.cancelConfirmTitle} />
      <div className="wrap max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <StepNav backHref={emailStepHref} backLabel={chrome.back} />
          <CancelConfirmForm
            locale={locale}
            labels={labels}
            reference={draft.reference}
            action={submitCancelConfirm}
          />
        </div>
      </div>
    </>
  );
}
