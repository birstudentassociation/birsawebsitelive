import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import StepNav from "@/components/forms/StepNav";
import ContactForm from "@/components/forms/ContactForm";
import { buildWizardChromeLabels, formatStepOf } from "@/components/forms/wizardChromeCopy";
import { buildContactWizardLabels } from "@/components/forms/contactWizardCopy";
import { getContactDraft, submitContactCheck } from "../actions";
import { submitFeedbackAction } from "@/app/[lang]/feedback/actions";
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
  return buildMetadata({ locale, title, description: title, path: "/contact/check" });
}

export default async function ContactCheckPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const chrome = buildWizardChromeLabels(locale);
  const wizard = buildContactWizardLabels(locale);
  const draft = await getContactDraft();
  const progress = formatStepOf(chrome.stepOf, CONTACT_STEPS.indexOf("check") + 1, CONTACT_STEPS.length);

  return (
    <>
      <PageHeader title={wizard.checkTitle} />
      <div className="wrap max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <StepNav
            backHref={localeHref(locale, "/contact/email")}
            backLabel={chrome.back}
            progressText={progress}
          />
          <ContactForm
            locale={locale}
            dict={dict}
            draft={draft}
            action={submitContactCheck.bind(null, locale)}
            feedbackAction={submitFeedbackAction}
            categoryLabel={wizard.checkCategoryLabel}
            subjectLabel={wizard.checkSubjectLabel}
            messageLabel={wizard.checkMessageLabel}
            nameLabel={wizard.checkNameLabel}
            emailLabel={wizard.checkEmailLabel}
            changeLabel={chrome.change}
            submitLabel={dict.form.send}
            submittingLabel={dict.form.sending}
          />
        </div>
      </div>
    </>
  );
}
