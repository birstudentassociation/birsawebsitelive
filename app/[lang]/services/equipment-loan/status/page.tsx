import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import StepNav from "@/components/forms/StepNav";
import QuestionStepForm from "@/components/forms/QuestionStepForm";
import { buildWizardChromeLabels, formatStepOf } from "@/components/forms/wizardChromeCopy";
import type { StatusLookupLabels } from "@/components/equipment/StatusLookup";
import { getLoanStatusDraft, resetLoanStatusDraft, submitReferenceStep } from "./actions";
import { LOAN_STATUS_STEPS } from "./steps";

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

export const statusLookupLabels: Record<Locale, StatusLookupLabels> = {
  en: {
    referenceLabel: "Reference number",
    referenceHint: "The reference number you were given when you submitted the request, e.g. BIRSA-1234.",
    emailLabel: "TU email",
    emailHint: "The email address you used on the request.",
    submit: "Check status",
    submitting: "Checking…",
    errorSummaryTitle: "There is a problem",
    required: "required",
    errors: {
      referenceRequired: "Enter your reference number",
      emailRequired: "Enter your email address",
      emailInvalid: "Enter a valid email address",
    },
    notFoundTitle: "We could not find a matching request",
    notFoundBody:
      "Double-check the reference number and email address, and try again. If you're still having trouble, contact BIRSA directly.",
    rateLimitedTitle: "Too many attempts",
    rateLimitedBody: "Wait a moment and try again.",
    errorTitle: "Something went wrong",
    errorBody: "We could not check your request right now. Try again in a moment.",
    tryAgain: "Try again",
    resultTitle: "Loan request",
    statusLabel: "Status",
    itemLabel: "Item",
    datesLabel: "Pickup, return",
    statusLabels: {
      pending: "Pending",
      approved: "Approved",
      checked_out: "Checked out",
      overdue: "Overdue",
      returned: "Returned",
      rejected: "Rejected",
      cancelled: "Cancelled",
      no_show: "Not collected",
    },
    cancelButton: "Cancel this request",
    cancelConfirmTitle: "Cancel this loan request",
    cancelConfirmBody: "If you change your mind, you'll need to submit a new request.",
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
    cancelling: "Cancelling…",
    cancelledTitle: "Request cancelled",
    cancelledBody: "Your loan request has been cancelled.",
    cancelErrorTitle: "Could not cancel this request",
    cancelErrorBody: "Try again in a moment, or contact BIRSA if the problem continues.",
    newSearch: "Check another request",
  },
  th: {
    referenceLabel: "หมายเลขอ้างอิง",
    referenceHint: "หมายเลขอ้างอิงที่คุณได้รับเมื่อส่งคำขอ เช่น BIRSA-1234",
    emailLabel: "อีเมลมหาวิทยาลัยธรรมศาสตร์",
    emailHint: "อีเมลที่คุณใช้ตอนส่งคำขอ",
    submit: "ตรวจสอบสถานะ",
    submitting: "กำลังตรวจสอบ…",
    errorSummaryTitle: "พบข้อผิดพลาด",
    required: "จำเป็นต้องกรอก",
    errors: {
      referenceRequired: "กรุณากรอกหมายเลขอ้างอิง",
      emailRequired: "กรุณากรอกอีเมล",
      emailInvalid: "กรุณากรอกอีเมลให้ถูกต้อง",
    },
    notFoundTitle: "ไม่พบคำขอที่ตรงกัน",
    notFoundBody:
      "กรุณาตรวจสอบหมายเลขอ้างอิงและอีเมลอีกครั้ง แล้วลองใหม่ หากยังพบปัญหา กรุณาติดต่อ BIRSA โดยตรง",
    rateLimitedTitle: "ลองใหม่บ่อยเกินไป",
    rateLimitedBody: "กรุณารอสักครู่แล้วลองใหม่อีกครั้ง",
    errorTitle: "เกิดข้อผิดพลาด",
    errorBody: "ขณะนี้ไม่สามารถตรวจสอบคำขอของคุณได้ กรุณาลองใหม่อีกครั้งในอีกสักครู่",
    tryAgain: "ลองใหม่",
    resultTitle: "คำขอยืม",
    statusLabel: "สถานะ",
    itemLabel: "อุปกรณ์",
    datesLabel: "วันรับ, วันคืน",
    statusLabels: {
      pending: "รอดำเนินการ",
      approved: "อนุมัติแล้ว",
      checked_out: "รับอุปกรณ์แล้ว",
      overdue: "เกินกำหนดคืน",
      returned: "คืนแล้ว",
      rejected: "ปฏิเสธแล้ว",
      cancelled: "ยกเลิกแล้ว",
      no_show: "ไม่มารับอุปกรณ์",
    },
    cancelButton: "ยกเลิกคำขอนี้",
    cancelConfirmTitle: "ยืนยันการยกเลิกคำขอยืมนี้หรือไม่",
    cancelConfirmBody: "หากเปลี่ยนใจ คุณจะต้องส่งคำขอใหม่อีกครั้ง",
    confirmLabel: "ยืนยัน",
    cancelLabel: "ยกเลิก",
    cancelling: "กำลังยกเลิก…",
    cancelledTitle: "ยกเลิกคำขอแล้ว",
    cancelledBody: "คำขอยืมของคุณถูกยกเลิกแล้ว",
    cancelErrorTitle: "ไม่สามารถยกเลิกคำขอนี้ได้",
    cancelErrorBody: "กรุณาลองใหม่อีกครั้งในอีกสักครู่ หรือติดต่อ BIRSA หากยังพบปัญหา",
    newSearch: "ตรวจสอบคำขออื่น",
  },
};

export default async function EquipmentLoanStatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ reset?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = pageCopy[locale];
  const labels = statusLookupLabels[locale];
  const chrome = buildWizardChromeLabels(locale);
  const infoServicesLabel = dict.nav.find((n) => n.href === "/services")!.label;

  const { reset } = await searchParams;
  if (reset === "1") await resetLoanStatusDraft();
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
