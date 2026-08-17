import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import StepNav from "@/components/forms/StepNav";
import StartClubForm from "@/components/forms/StartClubForm";
import { buildWizardChromeLabels, formatStepOf } from "@/components/forms/wizardChromeCopy";
import { buildStartClubWizardLabels } from "@/components/forms/startClubWizardCopy";
import { getStartClubDraft, submitStartClubCheck } from "../actions";
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
  return buildMetadata({ locale, title, description: title, path: "/clubs/start/check" });
}

export default async function StartClubCheckPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const chrome = buildWizardChromeLabels(locale);
  const wizard = buildStartClubWizardLabels(locale);
  const draft = await getStartClubDraft();
  const progress = formatStepOf(
    chrome.stepOf,
    START_CLUB_STEPS.indexOf("check") + 1,
    START_CLUB_STEPS.length
  );

  return (
    <>
      <PageHeader title={wizard.checkTitle} />
      <div className="wrap max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <StepNav
            backHref={localeHref(locale, "/clubs/start/email")}
            backLabel={chrome.back}
            progressText={progress}
          />
          <StartClubForm
            locale={locale}
            dict={dict}
            draft={draft}
            action={submitStartClubCheck.bind(null, locale)}
          />
        </div>
      </div>
    </>
  );
}
