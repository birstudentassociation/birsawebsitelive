import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import StepNav from "@/components/forms/StepNav";
import QuestionStepForm from "@/components/forms/QuestionStepForm";
import { buildWizardChromeLabels, formatStepOf } from "@/components/forms/wizardChromeCopy";
import { buildStartClubWizardLabels } from "@/components/forms/startClubWizardCopy";
import { getStartClubDraft, submitStartClubEmailStep } from "../actions";
import { START_CLUB_STEPS } from "../steps";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const title = locale === "th" ? "เริ่มชมรมใหม่" : "Start a club";
  return buildMetadata({ locale, title, description: title, path: "/clubs/start/email" });
}

export default async function StartClubEmailPage({
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
  const wizard = buildStartClubWizardLabels(locale);
  const { returnTo } = await searchParams;

  const draft = await getStartClubDraft();
  const backHref = localeHref(
    locale,
    returnTo === "check" ? "/clubs/start/check" : "/clubs/start/name"
  );
  const progress =
    returnTo === "check"
      ? undefined
      : formatStepOf(chrome.stepOf, START_CLUB_STEPS.indexOf("email") + 1, START_CLUB_STEPS.length);

  return (
    <>
      <PageHeader title={wizard.emailHeading} />
      <div className="wrap max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <StepNav backHref={backHref} backLabel={chrome.back} progressText={progress} />
          <QuestionStepForm
            action={submitStartClubEmailStep.bind(null, locale, returnTo)}
            initialState={{ status: "idle" }}
            errorSummaryTitle={wizard.errorSummaryTitle}
            continueLabel={chrome.continueLabel}
            continuingLabel={chrome.continuing}
            field={{
              name: "email",
              type: "email",
              label: wizard.fieldLabels.email,
              hint: wizard.emailHint,
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
