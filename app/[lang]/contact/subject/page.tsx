import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import StepNav from "@/components/forms/StepNav";
import QuestionStepForm from "@/components/forms/QuestionStepForm";
import { buildWizardChromeLabels, formatStepOf } from "@/components/forms/wizardChromeCopy";
import { buildContactWizardLabels } from "@/components/forms/contactWizardCopy";
import { getContactDraft, submitSubjectStep } from "../actions";
import { CONTACT_STEPS } from "../steps";

const harassmentNoteCopy: Record<Locale, { text: string; cta: string }> = {
  en: {
    text: "If this is about harassment or bullying, you do not need to fill in the rest of this form.",
    cta: "Go straight to the direct reporting channels",
  },
  th: {
    text: "หากเรื่องนี้เกี่ยวข้องกับการคุกคามหรือการกลั่นแกล้ง ไม่จำเป็นต้องกรอกแบบฟอร์มนี้ต่อ",
    cta: "ไปที่ช่องทางแจ้งเหตุโดยตรง",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const title = locale === "th" ? "ติดต่อ BIRSA" : "Contact BIRSA";
  return buildMetadata({ locale, title, description: title, path: "/contact/subject" });
}

export default async function ContactSubjectPage({
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
  const backHref = localeHref(locale, returnTo === "check" ? "/contact/check" : "/contact");
  const progress =
    returnTo === "check"
      ? undefined
      : formatStepOf(chrome.stepOf, CONTACT_STEPS.indexOf("subject") + 1, CONTACT_STEPS.length);
  const harassmentNote = harassmentNoteCopy[locale];

  return (
    <>
      <PageHeader title={wizard.subjectHeading} />
      <div className="wrap max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <StepNav backHref={backHref} backLabel={chrome.back} progressText={progress} />
          {draft.category === "problem" ? (
            <p className="rounded-md border-l-4 border-error bg-error-tint p-4 text-sm text-ink">
              {harassmentNote.text}{" "}
              <a
                href={`${localeHref(locale, "/contact")}#report-harassment`}
                className="font-semibold underline"
              >
                {harassmentNote.cta}
              </a>
            </p>
          ) : null}
          <QuestionStepForm
            action={submitSubjectStep.bind(null, locale, returnTo)}
            initialState={{ status: "idle" }}
            errorSummaryTitle={dict.form.errorSummaryTitle}
            continueLabel={returnTo === "check" ? chrome.continueLabel : chrome.continueLabel}
            continuingLabel={chrome.continuing}
            field={{
              name: "subject",
              label: dict.form.subject,
              required: true,
              requiredLabel: dict.actions.required,
              defaultValue: draft.subject,
            }}
          />
        </div>
      </div>
    </>
  );
}
