import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata, stepTitle } from "@/lib/seo";
import PageHeader, { PAGE_HEADING_ID } from "@/components/PageHeader";
import QuestionStepForm from "@/components/forms/QuestionStepForm";
import { buildWizardChromeLabels, formatStepOf } from "@/components/forms/wizardChromeCopy";
import { buildRightsWizardLabels } from "@/components/forms/rightsWizardCopy";
import { getRightsDraft, submitEmailStep } from "../actions";
import { RIGHTS_STEPS } from "../steps";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const journey =
    locale === "th" ? "คำร้องขอใช้สิทธิของเจ้าของข้อมูลส่วนบุคคล" : "Ask about your data";
  const title = stepTitle(buildRightsWizardLabels(locale).emailHeading, journey);
  return buildMetadata({ locale, title, description: journey, path: "/privacy/your-data/email" });
}

export default async function RightsEmailPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const chrome = buildWizardChromeLabels(locale);
  const wizard = buildRightsWizardLabels(locale);
  const { returnTo } = await searchParams;

  const draft = await getRightsDraft();
  const backHref = localeHref(
    locale,
    returnTo === "check" ? "/privacy/your-data/check" : "/privacy/your-data/name"
  );
  const progress =
    returnTo === "check"
      ? undefined
      : formatStepOf(chrome.stepOf, RIGHTS_STEPS.indexOf("email") + 1, RIGHTS_STEPS.length);

  return (
    <>
      <PageHeader
        title={wizard.emailHeading}
        backHref={backHref}
        backLabel={chrome.back}
        caption={progress}
      />
      <div className="wrap max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <QuestionStepForm
            action={submitEmailStep.bind(null, locale, returnTo)}
            initialState={{ status: "idle" }}
            errorSummaryTitle={dict.form.errorSummaryTitle}
            continueLabel={chrome.continueLabel}
            continuingLabel={chrome.continuing}
            field={{
              labelledBy: PAGE_HEADING_ID,
              name: "email",
              type: "email",
              label: dict.form.email,
              hint: dict.form.emailHint,
              required: true,
              defaultValue: draft.email,
              autoComplete: "email",
            }}
          />
        </div>
      </div>
    </>
  );
}
