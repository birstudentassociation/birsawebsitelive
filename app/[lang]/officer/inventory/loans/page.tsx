import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import { getSessionOfficer } from "@/lib/inventory/auth";
import { listLoans } from "@/lib/inventory/loans";
import { getItem } from "@/lib/inventory/items";
import { getBorrower } from "@/lib/inventory/borrowers";
import { getAvailableUnitsForRange } from "@/lib/inventory/units";
import type { Item, Borrower, Unit, LoanStatus } from "@/lib/inventory/types";
import LoanQueue from "@/components/inventory/LoanQueue";

/** Internal officer console page; never indexed. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "คิวคำขอยืม เจ้าหน้าที่" : "Officer console: loans queue";
  const description =
    locale === "th"
      ? "หน้าสำหรับเจ้าหน้าที่ BIRSA ใช้พิจารณา รับคืน และติดตามคำขอยืมครุภัณฑ์"
      : "Internal page for BIRSA officers to decide, check out, and check in equipment loans.";

  const metadata = buildMetadata({ locale, title, description, path: "/officer/inventory/loans" });
  return { ...metadata, robots: { index: false, follow: false } };
}

const FILTERABLE_STATUSES: LoanStatus[] = [
  "pending",
  "approved",
  "checked_out",
  "overdue",
  "returned",
  "rejected",
  "cancelled",
];

function isLoanStatus(value: string): value is LoanStatus {
  return (FILTERABLE_STATUSES as string[]).includes(value) || value === "no_show";
}

type Copy = {
  title: string;
  lede: string;
  signInTitle: string;
  signInBody: string;
  signInCta: string;
  filterAll: string;
  statusLabels: Record<LoanStatus, string>;
};

const copy: Record<Locale, Copy> = {
  en: {
    title: "Loans queue",
    lede: "Decide pending requests, hand off approved units, and record returns.",
    signInTitle: "Please sign in on the console home",
    signInBody: "You need an active officer session to view the loans queue.",
    signInCta: "Go to console home",
    filterAll: "All",
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
  },
  th: {
    title: "คิวคำขอยืม",
    lede: "พิจารณาคำขอที่รอดำเนินการ ส่งมอบครุภัณฑ์ที่อนุมัติแล้ว และบันทึกการคืน",
    signInTitle: "กรุณาเข้าสู่ระบบที่หน้าแรกของคอนโซล",
    signInBody: "คุณต้องเข้าสู่ระบบเจ้าหน้าที่ก่อนจึงจะดูคิวคำขอยืมได้",
    signInCta: "ไปที่หน้าแรกคอนโซล",
    filterAll: "ทั้งหมด",
    statusLabels: {
      pending: "รอดำเนินการ",
      approved: "อนุมัติแล้ว",
      checked_out: "ยืมออกแล้ว",
      overdue: "เกินกำหนดคืน",
      returned: "คืนแล้ว",
      rejected: "ปฏิเสธแล้ว",
      cancelled: "ยกเลิกแล้ว",
      no_show: "ไม่มารับ",
    },
  },
};

export default async function OfficerLoansQueuePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return null;
  }
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];
  const { status: statusParam } = await searchParams;
  const statusFilter = statusParam && isLoanStatus(statusParam) ? statusParam : undefined;

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

  const loans = await listLoans(statusFilter ? { status: statusFilter } : undefined);

  const itemIds = Array.from(new Set(loans.map((loan) => loan.itemId)));
  const borrowerIds = Array.from(new Set(loans.map((loan) => loan.borrowerId)));

  const [items, borrowers] = await Promise.all([
    Promise.all(itemIds.map((id) => getItem(id))),
    Promise.all(borrowerIds.map((id) => getBorrower(id))),
  ]);

  const itemsById: Record<string, Item> = {};
  for (const item of items) {
    if (item) itemsById[item.id] = item;
  }
  const borrowersById: Record<string, Borrower> = {};
  for (const borrower of borrowers) {
    if (borrower) borrowersById[borrower.id] = borrower;
  }

  const pendingLoans = loans.filter((loan) => loan.status === "pending");
  const availableUnitsByLoan: Record<string, Unit[]> = {};
  await Promise.all(
    pendingLoans.map(async (loan) => {
      availableUnitsByLoan[loan.id] = await getAvailableUnitsForRange(loan.itemId, loan.startDate, loan.endDate);
    })
  );

  return (
    <>
      <PageHeader title={t.title} lede={t.lede} breadcrumbs={breadcrumbs} />
      <div className="wrap flex flex-col gap-6 py-10">
        <nav aria-label={t.filterAll} className="flex flex-wrap gap-2">
          <Link
            href={localeHref(locale, "/officer/inventory/loans")}
            className={clsx(
              "rounded-full px-3.5 py-1.5 text-sm font-semibold",
              !statusFilter ? "bg-brand text-white" : "bg-sunken text-ink hover:bg-sunken/70"
            )}
          >
            {t.filterAll}
          </Link>
          {FILTERABLE_STATUSES.map((status) => (
            <Link
              key={status}
              href={localeHref(locale, `/officer/inventory/loans?status=${status}`)}
              className={clsx(
                "rounded-full px-3.5 py-1.5 text-sm font-semibold",
                statusFilter === status ? "bg-brand text-white" : "bg-sunken text-ink hover:bg-sunken/70"
              )}
            >
              {t.statusLabels[status]}
            </Link>
          ))}
        </nav>

        <LoanQueue
          locale={locale}
          loans={loans}
          itemsById={itemsById}
          borrowersById={borrowersById}
          availableUnitsByLoan={availableUnitsByLoan}
          role={officer.role}
          groupByStatus={!statusFilter}
        />
      </div>
    </>
  );
}
