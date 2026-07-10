import type { Metadata } from "next";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Tag from "@/components/Tag";
import { getSessionOfficer } from "@/lib/inventory/auth";
import { isInventoryConfigured } from "@/lib/inventory/db";
import { getStatusCounts, getItemUtilisation } from "@/lib/inventory/reports";
import type { LoanStatus } from "@/lib/inventory/types";

/** Internal officer console page; never indexed. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "รายงาน เจ้าหน้าที่" : "Officer console: reports";
  const description =
    locale === "th"
      ? "สรุปสถานะการยืม-คืนและการใช้งานครุภัณฑ์ พร้อมส่งออกข้อมูลเป็น CSV"
      : "Loan status summary, item utilisation, and CSV exports for BIRSA officers.";

  const metadata = buildMetadata({ locale, title, description, path: "/officer/inventory/reports" });
  return { ...metadata, robots: { index: false, follow: false } };
}

type Copy = {
  title: string;
  lede: string;
  signInTitle: string;
  signInBody: string;
  signInCta: string;
  dbNotConfiguredTitle: string;
  dbNotConfiguredBody: string;
  statusSummaryTitle: string;
  statusLabels: Record<LoanStatus, string>;
  utilisationTitle: string;
  utilisationEmpty: string;
  itemHeader: string;
  keyHeader: string;
  totalLoansHeader: string;
  activeLoansHeader: string;
  unitCountHeader: string;
  exportsTitle: string;
  exportsLede: string;
  exportLoans: string;
  exportUnits: string;
  exportBorrowers: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    title: "Reports",
    lede: "Loan status at a glance, item utilisation, and CSV exports.",
    signInTitle: "Please sign in on the console home",
    signInBody: "You need an active officer session to view reports.",
    signInCta: "Go to console home",
    dbNotConfiguredTitle: "The inventory database is not connected",
    dbNotConfiguredBody: "POSTGRES_URL is not configured, so there is no report data to show yet.",
    statusSummaryTitle: "Loans by status",
    statusLabels: {
      pending: "Pending",
      approved: "Approved",
      checked_out: "Checked out",
      overdue: "Overdue",
      returned: "Returned",
      rejected: "Rejected",
      cancelled: "Cancelled",
      no_show: "No-show",
    },
    utilisationTitle: "Item utilisation",
    utilisationEmpty: "No items in the catalogue yet.",
    itemHeader: "Item",
    keyHeader: "Key",
    totalLoansHeader: "Total loans",
    activeLoansHeader: "Active loans",
    unitCountHeader: "Units",
    exportsTitle: "Export CSV",
    exportsLede: "Download the current data as a CSV file.",
    exportLoans: "Export loans",
    exportUnits: "Export units",
    exportBorrowers: "Export borrowers",
  },
  th: {
    title: "รายงาน",
    lede: "ภาพรวมสถานะการยืม-คืน การใช้งานครุภัณฑ์ และการส่งออกข้อมูลเป็น CSV",
    signInTitle: "กรุณาเข้าสู่ระบบที่หน้าแรกของคอนโซล",
    signInBody: "คุณต้องเข้าสู่ระบบเจ้าหน้าที่ก่อนจึงจะดูรายงานได้",
    signInCta: "ไปที่หน้าแรกคอนโซล",
    dbNotConfiguredTitle: "ยังไม่ได้เชื่อมต่อฐานข้อมูลครุภัณฑ์",
    dbNotConfiguredBody: "ยังไม่ได้ตั้งค่า POSTGRES_URL จึงยังไม่มีข้อมูลรายงานให้แสดงในขณะนี้",
    statusSummaryTitle: "จำนวนการยืมแยกตามสถานะ",
    statusLabels: {
      pending: "รอดำเนินการ",
      approved: "อนุมัติแล้ว",
      checked_out: "รับอุปกรณ์แล้ว",
      overdue: "เกินกำหนดคืน",
      returned: "คืนแล้ว",
      rejected: "ปฏิเสธแล้ว",
      cancelled: "ยกเลิกแล้ว",
      no_show: "ไม่มารับ",
    },
    utilisationTitle: "การใช้งานครุภัณฑ์แยกตามรายการ",
    utilisationEmpty: "ยังไม่มีรายการครุภัณฑ์ในระบบ",
    itemHeader: "รายการ",
    keyHeader: "รหัส",
    totalLoansHeader: "จำนวนการยืมทั้งหมด",
    activeLoansHeader: "การยืมที่ดำเนินการอยู่",
    unitCountHeader: "จำนวนชิ้น",
    exportsTitle: "ส่งออกข้อมูล CSV",
    exportsLede: "ดาวน์โหลดข้อมูลปัจจุบันเป็นไฟล์ CSV",
    exportLoans: "ส่งออกข้อมูลการยืม-คืน",
    exportUnits: "ส่งออกข้อมูลครุภัณฑ์",
    exportBorrowers: "ส่งออกข้อมูลผู้ยืม",
  },
};

const STATUS_ORDER: LoanStatus[] = [
  "pending",
  "approved",
  "checked_out",
  "overdue",
  "returned",
  "rejected",
  "cancelled",
  "no_show",
];

const EXPORT_LINK_CLASS =
  "focus-halo inline-flex h-11 items-center justify-center gap-2 rounded-lg border-[1.5px] border-ink px-5 text-[0.95rem] font-semibold text-ink transition-colors duration-150 hover:bg-sunken whitespace-nowrap";

export default async function OfficerReportsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return null;
  }
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];

  const officer = await getSessionOfficer();

  const breadcrumbs = (
    <Breadcrumbs
      locale={locale}
      label={dict.a11y.breadcrumb}
      items={[{ label: dict.site.name, href: "/" }, { label: t.title }]}
    />
  );

  if (!officer) {
    return (
      <>
        <PageHeader title={t.title} lede={t.lede} breadcrumbs={breadcrumbs} />
        <div className="wrap py-10">
          <Notice variant="info" title={t.signInTitle}>
            <p className="mb-3">{t.signInBody}</p>
            <Button href={localeHref(locale, "/officer/inventory")}>{t.signInCta}</Button>
          </Notice>
        </div>
      </>
    );
  }

  if (!isInventoryConfigured()) {
    return (
      <>
        <PageHeader title={t.title} lede={t.lede} breadcrumbs={breadcrumbs} />
        <div className="wrap py-10">
          <Notice variant="warning" title={t.dbNotConfiguredTitle}>
            {t.dbNotConfiguredBody}
          </Notice>
        </div>
      </>
    );
  }

  const [statusCounts, utilisation] = await Promise.all([getStatusCounts(), getItemUtilisation()]);
  const countsByStatus = new Map<LoanStatus, number>();
  for (const row of statusCounts) countsByStatus.set(row.status, row.count);

  return (
    <>
      <PageHeader title={t.title} lede={t.lede} breadcrumbs={breadcrumbs} />
      <div className="wrap flex flex-col gap-10 py-10">
        <section aria-labelledby="status-summary-heading" className="flex flex-col gap-4">
          <h2 id="status-summary-heading" className="font-display text-ink text-xl">
            {t.statusSummaryTitle}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATUS_ORDER.map((status) => (
              <Card key={status}>
                <p className="text-muted text-sm font-semibold">{t.statusLabels[status]}</p>
                <p className="font-display text-ink text-2xl">{countsByStatus.get(status) ?? 0}</p>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="utilisation-heading" className="flex flex-col gap-4">
          <h2 id="utilisation-heading" className="font-display text-ink text-xl">
            {t.utilisationTitle}
          </h2>
          {utilisation.length === 0 ? (
            <p className="text-muted text-sm">{t.utilisationEmpty}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="text-ink w-full text-left text-sm">
                <thead>
                  <tr className="border-line border-b">
                    <th scope="col" className="py-2 pr-4 font-semibold">
                      {t.itemHeader}
                    </th>
                    <th scope="col" className="py-2 pr-4 font-semibold">
                      {t.keyHeader}
                    </th>
                    <th scope="col" className="py-2 pr-4 font-semibold">
                      {t.totalLoansHeader}
                    </th>
                    <th scope="col" className="py-2 pr-4 font-semibold">
                      {t.activeLoansHeader}
                    </th>
                    <th scope="col" className="py-2 font-semibold">
                      {t.unitCountHeader}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {utilisation.map((row) => (
                    <tr key={row.itemId} className="border-line border-b last:border-0">
                      <td className="py-2 pr-4">{locale === "th" ? row.nameTh : row.nameEn}</td>
                      <td className="py-2 pr-4">
                        <Tag>{row.itemKey}</Tag>
                      </td>
                      <td className="py-2 pr-4">{row.totalLoans}</td>
                      <td className="py-2 pr-4">{row.activeLoans}</td>
                      <td className="py-2">{row.unitCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section aria-labelledby="exports-heading" className="flex flex-col gap-4">
          <h2 id="exports-heading" className="font-display text-ink text-xl">
            {t.exportsTitle}
          </h2>
          <p className="text-muted text-sm">{t.exportsLede}</p>
          <div className="flex flex-wrap gap-3">
            {/* Plain anchors: these hit an API route that streams a CSV file
                download, not a page. next/link would intercept them as client
                navigations and mishandle the non-HTML response. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/api/inventory/export?type=loans" className={EXPORT_LINK_CLASS} download>
              {t.exportLoans}
            </a>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/api/inventory/export?type=units" className={EXPORT_LINK_CLASS} download>
              {t.exportUnits}
            </a>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/api/inventory/export?type=borrowers" className={EXPORT_LINK_CLASS} download>
              {t.exportBorrowers}
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
