import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import Button from "@/components/bds/Button";
import { Wrap } from "@/components/bds/Layout";
import PageHeader from "@/components/bds/PageHeader";
import StepNav from "@/components/forms/StepNav";
import RightsWhatForm from "@/components/forms/RightsWhatForm";
import { buildWizardChromeLabels, formatStepOf } from "@/components/forms/wizardChromeCopy";
import { buildRightsWizardLabels } from "@/components/forms/rightsWizardCopy";
import { getRightsDraft, submitWhatStep } from "../actions";
import { RIGHTS_STEPS } from "../steps";
import { dataRights } from "@/content/privacy/register";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const title =
    locale === "th" ? "คำร้องขอใช้สิทธิของเจ้าของข้อมูลส่วนบุคคล" : "Ask about your data";
  return buildMetadata({ locale, title, description: title, path: "/privacy/your-data/what" });
}

export default async function RightsWhatPage({
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
    returnTo === "check" ? "/privacy/your-data/check" : "/privacy/your-data"
  );
  const progress =
    returnTo === "check"
      ? undefined
      : formatStepOf(chrome.stepOf, RIGHTS_STEPS.indexOf("what") + 1, RIGHTS_STEPS.length);

  return (
    <>
      <PageHeader
        title={wizard.whatHeading}
        helpSlot={
          <Button href={localeHref(locale, "/contact")} variant="secondary">
            {dict.actions.contactUs}
          </Button>
        }
      />
      <Wrap className="max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <StepNav backHref={backHref} backLabel={chrome.back} progressText={progress} />
          <RightsWhatForm
            locale={locale}
            rights={dataRights}
            defaultValue={draft.right}
            action={submitWhatStep.bind(null, locale, returnTo)}
            legend={wizard.whatLegend}
            requiredLabel={dict.actions.required}
            errorSummaryTitle={dict.form.errorSummaryTitle}
            continueLabel={chrome.continueLabel}
            continuingLabel={chrome.continuing}
          />
        </div>
      </Wrap>
    </>
  );
}
