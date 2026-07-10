import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import { getSessionOfficer } from "@/lib/inventory/auth";
import { getBorrower, countActiveLoans } from "@/lib/inventory/borrowers";
import { listLoans } from "@/lib/inventory/loans";
import { getItem } from "@/lib/inventory/items";
import type { Item } from "@/lib/inventory/types";
import BorrowerDetail from "@/components/inventory/BorrowerDetail";

/** Internal officer console page; never indexed. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "รายละเอียดผู้ยืม เจ้าหน้าที่" : "Officer console: borrower detail";
  const description =
    locale === "th"
      ? "หน้าสำหรับเจ้าหน้าที่ BIRSA ใช้ดูประวัติและจัดการผู้ยืมรายบุคคล"
      : "Internal page for BIRSA officers to review and manage a single borrower.";

  const metadata = buildMetadata({ locale, title, description, path: "/officer/inventory/borrowers" });
  return { ...metadata, robots: { index: false, follow: false } };
}

type Copy = {
  title: string;
  signInTitle: string;
  signInBody: string;
  signInCta: string;
  noAccessTitle: string;
  noAccessBody: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    title: "Borrower detail",
    signInTitle: "Please sign in on the console home",
    signInBody: "You need an active officer session to view this borrower.",
    signInCta: "Go to console home",
    noAccessTitle: "You don't have access to this page",
    noAccessBody: "Only admins and loan officers can view and manage borrowers.",
  },
  th: {
    title: "รายละเอียดผู้ยืม",
    signInTitle: "กรุณาเข้าสู่ระบบที่หน้าแรกของคอนโซล",
    signInBody: "คุณต้องเข้าสู่ระบบเจ้าหน้าที่ก่อนจึงจะดูผู้ยืมรายนี้ได้",
    signInCta: "ไปที่หน้าแรกคอนโซล",
    noAccessTitle: "คุณไม่มีสิทธิ์เข้าถึงหน้านี้",
    noAccessBody: "เฉพาะผู้ดูแลระบบและเจ้าหน้าที่จัดการการยืมเท่านั้นที่ดูและจัดการผู้ยืมได้",
  },
};

export default async function OfficerBorrowerDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
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
      items={[
        { label: dict.site.name, href: "/" },
        { label: t.title, href: "/officer/inventory/borrowers" },
        { label: t.title },
      ]}
    />
  );

  if (!officer) {
    return (
      <>
        <PageHeader title={t.title} breadcrumbs={breadcrumbs} />
        <div className="wrap py-10">
          <Notice variant="info" title={t.signInTitle}>
            <p className="mb-3">{t.signInBody}</p>
            <Button href={localeHref(locale, "/officer/inventory")}>{t.signInCta}</Button>
          </Notice>
        </div>
      </>
    );
  }

  if (officer.role !== "admin" && officer.role !== "loan_officer") {
    return (
      <>
        <PageHeader title={t.title} breadcrumbs={breadcrumbs} />
        <div className="wrap py-10">
          <Notice variant="warning" title={t.noAccessTitle}>
            {t.noAccessBody}
          </Notice>
        </div>
      </>
    );
  }

  const borrower = await getBorrower(id);
  if (!borrower) {
    notFound();
  }

  const [loans, activeCount] = await Promise.all([listLoans({ borrowerId: id }), countActiveLoans(id)]);

  const itemIds = Array.from(new Set(loans.map((loan) => loan.itemId)));
  const items = await Promise.all(itemIds.map((itemId) => getItem(itemId)));
  const itemsById: Record<string, Item> = {};
  for (const item of items) {
    if (item) itemsById[item.id] = item;
  }

  return (
    <>
      <PageHeader title={borrower.name} lede={borrower.tuStudentId} breadcrumbs={breadcrumbs} />
      <div className="wrap py-10">
        <BorrowerDetail
          locale={locale}
          borrower={borrower}
          loans={loans}
          itemsById={itemsById}
          activeCount={activeCount}
          role={officer.role}
        />
      </div>
    </>
  );
}
