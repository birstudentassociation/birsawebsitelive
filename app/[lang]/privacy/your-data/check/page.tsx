import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import StepNav from "@/components/forms/StepNav";
import RightsCheckForm from "@/components/forms/RightsCheckForm";
import { buildWizardChromeLabels, formatStepOf } from "@/components/forms/wizardChromeCopy";
import { buildRightsWizardLabels } from "@/components/forms/rightsWizardCopy";
import { getRightsDraft, submitRightsCheck } from "../actions";
import { RIGHTS_STEPS } from "../steps";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const wizard = buildRightsWizardLabels(locale);
  return buildMetadata({
    locale,
    title: wizard.checkTitle,
    description: wizard.checkTitle,
    path: "/privacy/your-data/check",
  });
}

export default async function RightsCheckPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const chrome = buildWizardChromeLabels(locale);
  const wizard = buildRightsWizardLabels(locale);
  const draft = await getRightsDraft();
  const progress = formatStepOf(chrome.stepOf, RIGHTS_STEPS.indexOf("check") + 1, RIGHTS_STEPS.length);

  return (
    <>
      <PageHeader title={wizard.checkTitle} />
      <div className="wrap max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <StepNav
            backHref={localeHref(locale, "/privacy/your-data/details")}
            backLabel={chrome.back}
            progressText={progress}
          />
          <RightsCheckForm
            locale={locale}
            dict={dict}
            draft={draft}
            action={submitRightsCheck.bind(null, locale)}
          />
        </div>
      </div>
    </>
  );
}
