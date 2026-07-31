import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import StepNav from "@/components/forms/StepNav";
import QuestionStepForm from "@/components/forms/QuestionStepForm";
import { buildWizardChromeLabels, formatStepOf } from "@/components/forms/wizardChromeCopy";
import { getLoanStatusDraft, submitReferenceStep } from "./actions";
import { LOAN_STATUS_STEPS } from "./steps";
import { statusLookupLabels } from "./statusLookupCopy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "ตรวจสอบคำขอยืม" : "Check a loan request";
  const description =
    locale === "th"
      ? "ตรวจสอบสถานะคำขอยืมอุปกรณ์ของ BIRSA ด้วยหมายเลขอ้างอิงและอีเมล พร้อมยกเลิกคำขอที่ยังรอดำเนินการได้"
      : "Check the status of a BIRSA equipment loan request with your reference number and email, and cancel a pending request if you need to.";

  return buildMetadata({
    locale,
    title,
    description,
    path: "/services/equipment-loan/status",
  });
}

const pageCopy: Record<Locale, { title: string; lede: string; breadcrumbCatalogue: string; breadcrumbStatus: string }> = {
  en: {
    title: "Check a loan request",
    lede: "Answer two short questions to see where your equipment loan request stands.",
    breadcrumbCatalogue: "Equipment loan service",
    breadcrumbStatus: "Check a request",
  },
  th: {
    title: "ตรวจสอบคำขอยืม",
    lede: "ตอบคำถามสั้น ๆ สองข้อเพื่อดูสถานะคำขอยืมอุปกรณ์ของคุณ",
    breadcrumbCatalogue: "บริการยืมอุปกรณ์",
    breadcrumbStatus: "ตรวจสอบคำขอ",
  },
};

export default async function EquipmentLoanStatusPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = pageCopy[locale];
  const labels = statusLookupLabels[locale];
  const chrome = buildWizardChromeLabels(locale);
  const infoServicesLabel = dict.nav.find((n) => n.href === "/services")!.label;

  const draft = await getLoanStatusDraft();
  const progress = formatStepOf(
    chrome.stepOf,
    LOAN_STATUS_STEPS.indexOf("reference") + 1,
    LOAN_STATUS_STEPS.length
  );

  return (
    <>
      <PageHeader
        title={t.title}
        lede={t.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: infoServicesLabel, href: "/services" },
              { label: t.breadcrumbCatalogue, href: "/services/equipment-loan" },
              { label: t.breadcrumbStatus },
            ]}
          />
        }
      />
      <div className="wrap max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <StepNav backLabel={chrome.back} progressText={progress} />
          <h2 className="font-display text-2xl sm:text-3xl">{labels.referenceLabel}</h2>
          <QuestionStepForm
            action={submitReferenceStep.bind(null, locale, labels)}
            initialState={{ status: "idle" }}
            errorSummaryTitle={labels.errorSummaryTitle}
            continueLabel={chrome.continueLabel}
            continuingLabel={chrome.continuing}
            field={{
              name: "reference",
              label: labels.referenceLabel,
              hint: labels.referenceHint,
              required: true,
              requiredLabel: labels.required,
              defaultValue: draft.reference,
              autoComplete: "off",
            }}
          />
        </div>
      </div>
    </>
  );
}
