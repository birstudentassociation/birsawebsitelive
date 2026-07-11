import type { Metadata } from "next";
import { notFound } from "next/navigation";
import clsx from "clsx";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import Notice from "@/components/Notice";
import Card, { CardTitle } from "@/components/Card";
import Button from "@/components/Button";
import OfficerLogin from "@/components/inventory/OfficerLogin";
import { getSessionOfficer, isInventoryAuthConfigured } from "@/lib/inventory/auth";
import { isInventoryConfigured } from "@/lib/inventory/db";
import { listLoans } from "@/lib/inventory/loans";
import { getLowStockItems } from "@/lib/inventory/consumables";
import type { LoanStatus } from "@/lib/inventory/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "แดชบอร์ด คอนโซลเจ้าหน้าที่" : "Dashboard: officer console";
  const description =
    locale === "th"
      ? "ภาพรวมการยืม-คืนและสต็อกครุภัณฑ์สำหรับเจ้าหน้าที่ BIRSA"
      : "Loan and stock overview for BIRSA officers.";

  const metadata = buildMetadata({ locale, title, description, path: "/officer/inventory" });
  return { ...metadata, robots: { index: false, follow: false } };
}

type Copy = {
  title: string;
  lede: string;
  authNotConfiguredTitle: string;
  authNotConfiguredBody: string;
  dbNotConfiguredTitle: string;
  dbNotConfiguredBody: string;
  needsAttentionTitle: string;
  pendingLabel: string;
  overdueLabel: string;
  statusBoardTitle: string;
  statusLabels: Record<LoanStatus, string>;
  lowStockTitle: string;
  lowStockEmpty: string;
  lowStockQty: (qty: number, threshold: number) => string;
  quickLinksTitle: string;
  catalogueLink: string;
  loansLink: string;
  borrowersLink: string;
  officersLink: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    title: "Dashboard",
    lede: "Overview of loans in flight and stock that needs attention.",
    authNotConfiguredTitle: "Officer accounts are not set up yet",
    authNotConfiguredBody:
      "OFFICER_SESSION_SECRET is not configured, so nobody can sign in to this console yet.",
    dbNotConfiguredTitle: "The inventory database is not connected",
    dbNotConfiguredBody: "POSTGRES_URL is not configured, so there is no data to show yet.",
    needsAttentionTitle: "Needs attention",
    pendingLabel: "Pending requests",
    overdueLabel: "Overdue loans",
    statusBoardTitle: "Loans by status",
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
    lowStockTitle: "Low stock",
    lowStockEmpty: "No consumables are low on stock.",
    lowStockQty: (qty, threshold) => `${qty} on hand (reorder at ${threshold})`,
    quickLinksTitle: "Quick links",
    catalogueLink: "Go to catalogue",
    loansLink: "Go to loans",
    borrowersLink: "Go to borrowers",
    officersLink: "Go to officers",
  },
  th: {
    title: "แดชบอร์ด",
    lede: "ภาพรวมคำขอยืมที่กำลังดำเนินการและสต็อกที่ต้องดูแล",
    authNotConfiguredTitle: "ยังไม่ได้ตั้งค่าบัญชีเจ้าหน้าที่",
    authNotConfiguredBody:
      "ยังไม่ได้ตั้งค่า OFFICER_SESSION_SECRET จึงยังไม่มีใครเข้าสู่ระบบคอนโซลนี้ได้",
    dbNotConfiguredTitle: "ยังไม่ได้เชื่อมต่อฐานข้อมูลครุภัณฑ์",
    dbNotConfiguredBody: "ยังไม่ได้ตั้งค่า POSTGRES_URL จึงยังไม่มีข้อมูลให้แสดงในขณะนี้",
    needsAttentionTitle: "ต้องดูแลด่วน",
    pendingLabel: "คำขอที่รอดำเนินการ",
    overdueLabel: "รายการเกินกำหนดคืน",
    statusBoardTitle: "จำนวนการยืมแยกตามสถานะ",
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
    lowStockTitle: "สต็อกใกล้หมด",
    lowStockEmpty: "ไม่มีวัสดุสิ้นเปลืองที่ใกล้หมดสต็อก",
    lowStockQty: (qty, threshold) => `เหลือ ${qty} ชิ้น (สั่งเพิ่มเมื่อถึง ${threshold})`,
    quickLinksTitle: "ลิงก์ด่วน",
    catalogueLink: "ไปที่รายการครุภัณฑ์",
    loansLink: "ไปที่การยืม-คืน",
    borrowersLink: "ไปที่ผู้ยืม",
    officersLink: "ไปที่เจ้าหน้าที่",
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

export default async function OfficerInventoryDashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];

  const officer = await getSessionOfficer();

  return (
    <>
      <PageHeader
        title={t.title}
        lede={t.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[{ label: dict.site.name, href: "/" }, { label: t.title }]}
          />
        }
      />
      <div className="wrap py-10">
        {!officer ? (
          <div className="flex flex-col gap-8">
            {!isInventoryAuthConfigured() ? (
              <Notice variant="warning" title={t.authNotConfiguredTitle}>
                {t.authNotConfiguredBody}
              </Notice>
            ) : null}
            <OfficerLogin locale={locale} />
          </div>
        ) : !isInventoryConfigured() ? (
          <Notice variant="warning" title={t.dbNotConfiguredTitle}>
            {t.dbNotConfiguredBody}
          </Notice>
        ) : (
          <DashboardBoards locale={locale} t={t} />
        )}
      </div>
    </>
  );
}

async function DashboardBoards({ locale, t }: { locale: Locale; t: Copy }) {
  const [loans, lowStock] = await Promise.all([listLoans(), getLowStockItems()]);

  const counts = new Map<LoanStatus, number>();
  for (const status of STATUS_ORDER) counts.set(status, 0);
  for (const loan of loans) {
    counts.set(loan.status, (counts.get(loan.status) ?? 0) + 1);
  }

  const pendingCount = counts.get("pending") ?? 0;
  const overdueCount = counts.get("overdue") ?? 0;

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="needs-attention-heading" className="flex flex-col gap-4">
        <h2 id="needs-attention-heading" className="font-display text-ink text-xl">
          {t.needsAttentionTitle}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <p className="text-muted text-sm font-semibold">{t.pendingLabel}</p>
            <p
              className={clsx(
                "font-display text-3xl",
                pendingCount > 0 ? "text-warning" : "text-ink"
              )}
            >
              {pendingCount}
            </p>
          </Card>
          <Card>
            <p className="text-muted text-sm font-semibold">{t.overdueLabel}</p>
            <p
              className={clsx(
                "font-display text-3xl",
                overdueCount > 0 ? "text-error" : "text-ink"
              )}
            >
              {overdueCount}
            </p>
          </Card>
        </div>
      </section>

      <section aria-labelledby="status-board-heading" className="flex flex-col gap-4">
        <h2 id="status-board-heading" className="font-display text-ink text-xl">
          {t.statusBoardTitle}
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATUS_ORDER.map((status) => (
            <Card key={status}>
              <p className="text-muted text-sm font-semibold">{t.statusLabels[status]}</p>
              <p className="font-display text-ink text-2xl">{counts.get(status) ?? 0}</p>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="low-stock-heading" className="flex flex-col gap-4">
        <h2 id="low-stock-heading" className="font-display text-ink text-xl">
          {t.lowStockTitle}
        </h2>
        {lowStock.length === 0 ? (
          <p className="text-muted text-sm">{t.lowStockEmpty}</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lowStock.map((item) => (
              <Card key={item.id}>
                <CardTitle as="h3">{item.name[locale]}</CardTitle>
                <p className="text-muted text-sm">
                  {t.lowStockQty(item.qtyOnHand ?? 0, item.reorderThreshold ?? 0)}
                </p>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="quick-links-heading" className="flex flex-col gap-4">
        <h2 id="quick-links-heading" className="font-display text-ink text-xl">
          {t.quickLinksTitle}
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" href={localeHref(locale, "/officer/inventory/items")}>
            {t.catalogueLink}
          </Button>
          <Button variant="secondary" href={localeHref(locale, "/officer/inventory/loans")}>
            {t.loansLink}
          </Button>
          <Button variant="secondary" href={localeHref(locale, "/officer/inventory/borrowers")}>
            {t.borrowersLink}
          </Button>
          <Button variant="secondary" href={localeHref(locale, "/officer/inventory/officers")}>
            {t.officersLink}
          </Button>
        </div>
      </section>
    </div>
  );
}
