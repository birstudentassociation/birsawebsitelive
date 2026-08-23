import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import Button from "@/components/bds/Button";
import PageHeader from "@/components/bds/PageHeader";
import StepNav from "@/components/forms/StepNav";
import QuestionStepForm from "@/components/forms/QuestionStepForm";
import { buildWizardChromeLabels, formatStepOf } from "@/components/forms/wizardChromeCopy";
import { buildContactWizardLabels } from "@/components/forms/contactWizardCopy";
import { getContactDraft, submitEmailStep } from "../actions";
import { CONTACT_STEPS } from "../steps";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const title = locale === "th" ? "ติดต่อ BIRSA" : "Contact BIRSA";
  return buildMetadata({ locale, title, description: title, path: "/contact/email" });
}

export default async function ContactEmailPage({
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
  const wizard = buildContactWizardLabels(locale);
  const { returnTo } = await searchParams;

  const draft = await getContactDraft();
  const backHref = localeHref(locale, returnTo === "check" ? "/contact/check" : "/contact/name");
  const progress =
    returnTo === "check"
      ? undefined
      : formatStepOf(chrome.stepOf, CONTACT_STEPS.indexOf("email") + 1, CONTACT_STEPS.length);

  return (
    <>
      <PageHeader
        title={wizard.emailHeading}
        helpSlot={
          <Button href={localeHref(locale, "/answers")} variant="secondary">
            {dict.actions.getHelp}
          </Button>
        }
      />
      <div className="wrap max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <StepNav backHref={backHref} backLabel={chrome.back} progressText={progress} />
          <QuestionStepForm
            action={submitEmailStep.bind(null, locale, returnTo)}
            initialState={{ status: "idle" }}
            errorSummaryTitle={dict.form.errorSummaryTitle}
            continueLabel={chrome.continueLabel}
            continuingLabel={chrome.continuing}
            field={{
              name: "email",
              type: "email",
              label: dict.form.email,
              hint: dict.form.emailHint,
              required: true,
              requiredLabel: dict.actions.required,
              defaultValue: draft.email,
              autoComplete: "email",
            }}
          />
        </div>
      </div>
    </>
  );
}
