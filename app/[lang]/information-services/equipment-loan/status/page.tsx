import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import StatusLookup, { type StatusLookupLabels } from "@/components/equipment/StatusLookup";

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

  return buildMetadata({ locale, title, description, path: "/information-services/equipment-loan/status" });
}

const copy: Record<
  Locale,
  {
    title: string;
    lede: string;
    breadcrumbHub: string;
    breadcrumbCatalogue: string;
    breadcrumbStatus: string;
    labels: StatusLookupLabels;
  }
> = {
  en: {
    title: "Check a loan request",
    lede: "Enter your reference number and TU email to see where your equipment loan request stands.",
    breadcrumbHub: "Information & services",
    breadcrumbCatalogue: "Equipment loan service",
    breadcrumbStatus: "Check a request",
    labels: {
      referenceLabel: "Reference number",
      referenceHint: "The reference number you were given when you submitted the request, e.g. BIRSA-1234.",
      emailLabel: "TU email",
      emailHint: "The email address you used on the request.",
      submit: "Check status",
      submitting: "Checking...",
      errorSummaryTitle: "There is a problem",
      required: "required",
      errors: {
        referenceRequired: "Enter your reference number",
        emailRequired: "Enter your email address",
        emailInvalid: "Enter a valid email address",
      },
      notFoundTitle: "We couldn't find a matching request",
      notFoundBody:
        "Double-check the reference number and email address, and try again. If you're still having trouble, contact BIRSA directly.",
      rateLimitedTitle: "Too many attempts",
      rateLimitedBody: "Please wait a moment and try again.",
      errorTitle: "Something went wrong",
      errorBody: "We couldn't check your request right now. Please try again in a moment.",
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
      cancelling: "Cancelling...",
      cancelledTitle: "Request cancelled",
      cancelledBody: "Your loan request has been cancelled.",
      cancelErrorTitle: "Couldn't cancel this request",
      cancelErrorBody: "Please try again in a moment, or contact BIRSA if the problem continues.",
      newSearch: "Check another request",
    },
  },
  th: {
    title: "ตรวจสอบคำขอยืม",
    lede: "กรอกหมายเลขอ้างอิงและอีเมลมหาวิทยาลัยธรรมศาสตร์ของคุณเพื่อดูสถานะคำขอยืมอุปกรณ์",
    breadcrumbHub: "ข้อมูลและบริการ",
    breadcrumbCatalogue: "บริการยืมอุปกรณ์",
    breadcrumbStatus: "ตรวจสอบคำขอ",
    labels: {
      referenceLabel: "หมายเลขอ้างอิง",
      referenceHint: "หมายเลขอ้างอิงที่คุณได้รับเมื่อส่งคำขอ เช่น BIRSA-1234",
      emailLabel: "อีเมลมหาวิทยาลัยธรรมศาสตร์",
      emailHint: "อีเมลที่คุณใช้ตอนส่งคำขอ",
      submit: "ตรวจสอบสถานะ",
      submitting: "กำลังตรวจสอบ...",
      errorSummaryTitle: "พบข้อผิดพลาด",
      required: "จำเป็นต้องกรอก",
      errors: {
        referenceRequired: "กรุณากรอกหมายเลขอ้างอิง",
        emailRequired: "กรุณากรอกอีเมล",
        emailInvalid: "กรุณากรอกอีเมลให้ถูกต้อง",
      },
      notFoundTitle: "ไม่พบคำขอที่ตรงกัน",
      notFoundBody: "กรุณาตรวจสอบหมายเลขอ้างอิงและอีเมลอีกครั้ง แล้วลองใหม่ หากยังพบปัญหา กรุณาติดต่อ BIRSA โดยตรง",
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
      cancelling: "กำลังยกเลิก...",
      cancelledTitle: "ยกเลิกคำขอแล้ว",
      cancelledBody: "คำขอยืมของคุณถูกยกเลิกแล้ว",
      cancelErrorTitle: "ไม่สามารถยกเลิกคำขอนี้ได้",
      cancelErrorBody: "กรุณาลองใหม่อีกครั้งในอีกสักครู่ หรือติดต่อ BIRSA หากยังพบปัญหา",
      newSearch: "ตรวจสอบคำขออื่น",
    },
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
  const t = copy[locale];

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
              { label: t.breadcrumbHub, href: "/information-services" },
              { label: t.breadcrumbCatalogue, href: "/information-services/equipment-loan" },
              { label: t.breadcrumbStatus },
            ]}
          />
        }
      />
      <div className="wrap max-w-[var(--measure)] py-10">
        <StatusLookup locale={locale} labels={t.labels} />
      </div>
    </>
  );
}
