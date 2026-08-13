import type { Metadata } from "next";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import { getSessionOfficer } from "@/lib/inventory/auth";
import { listBorrowers, countActiveLoans } from "@/lib/inventory/borrowers";
import BorrowersManager from "@/components/inventory/BorrowersManager";

/** Internal officer console page; never indexed. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "รายชื่อผู้ยืม เจ้าหน้าที่" : "Officer console: borrowers";
  const description =
    locale === "th"
      ? "หน้าสำหรับเจ้าหน้าที่ BIRSA ใช้ค้นหาและจัดการข้อมูลผู้ยืมครุภัณฑ์"
      : "Internal page for BIRSA officers to search and manage equipment borrowers.";

  const metadata = buildMetadata({
    locale,
    title,
    description,
    path: "/officer/inventory/borrowers",
  });
  return { ...metadata, robots: { index: false, follow: false } };
}

type Copy = {
  title: string;
  lede: string;
  signInTitle: string;
  signInBody: string;
  signInCta: string;
  noAccessTitle: string;
  noAccessBody: string;
  scopedNoticeTitle: string;
  scopedNoticeBody: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    title: "Borrowers",
    lede: "Search borrowers, review their loan history, and manage blocklisting.",
    signInTitle: "Sign in on the console home",
    signInBody: "You need an active officer session to view borrowers.",
    signInCta: "Go to console home",
    noAccessTitle: "You do not have access to this page",
    noAccessBody: "Only admins and loan officers can view and manage borrowers.",
    scopedNoticeTitle: "Borrower records are held by BIRSA officers",
    scopedNoticeBody:
      "Your club's items are managed from the Catalogue. Borrower details belong to the central loan process, so they are only visible to BIRSA officers.",
  },
  th: {
    title: "ผู้ยืม",
    lede: "ค้นหาผู้ยืม ดูประวัติการยืม และจัดการรายชื่อที่ถูกระงับสิทธิ์",
    signInTitle: "กรุณาเข้าสู่ระบบที่หน้าแรกของคอนโซล",
    signInBody: "คุณต้องเข้าสู่ระบบเจ้าหน้าที่ก่อนจึงจะดูรายชื่อผู้ยืมได้",
    signInCta: "ไปที่หน้าแรกคอนโซล",
    noAccessTitle: "คุณไม่มีสิทธิ์เข้าถึงหน้านี้",
    noAccessBody: "เฉพาะผู้ดูแลระบบและเจ้าหน้าที่จัดการการยืมเท่านั้นที่ดูและจัดการผู้ยืมได้",
    scopedNoticeTitle: "ข้อมูลผู้ยืมอยู่ในความดูแลของเจ้าหน้าที่ BIRSA",
    scopedNoticeBody:
      "รายการของชมรมคุณจัดการได้ที่หน้ารายการครุภัณฑ์ ข้อมูลผู้ยืมเป็นส่วนหนึ่งของกระบวนการยืมส่วนกลาง จึงเปิดให้เฉพาะเจ้าหน้าที่ BIRSA เท่านั้น",
  },
};

export default async function OfficerBorrowersPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ search?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return null;
  }
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];
  const { search } = await searchParams;

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

  if (officer.role !== "admin" && officer.role !== "loan_officer") {
    return (
      <>
        <PageHeader title={t.title} lede={t.lede} breadcrumbs={breadcrumbs} />
        <div className="wrap py-10">
          <Notice variant="warning" title={t.noAccessTitle}>
            {t.noAccessBody}
          </Notice>
        </div>
      </>
    );
  }

  // Borrower records are BIRSA-global, like the loans queue they come from:
  // a club-scoped officer manages their own items from the catalogue and has
  // no loan workflow, so they never need this directory of student PII.
  if (officer.custodianId !== null) {
    return (
      <>
        <PageHeader title={t.title} lede={t.lede} breadcrumbs={breadcrumbs} />
        <div className="wrap py-10">
          <Notice variant="info" title={t.scopedNoticeTitle}>
            {t.scopedNoticeBody}
          </Notice>
        </div>
      </>
    );
  }

  const borrowers = await listBorrowers({ search });
  const activeCounts = await Promise.all(
    borrowers.map((borrower) => countActiveLoans(borrower.id))
  );
  const activeCountsById: Record<string, number> = {};
  borrowers.forEach((borrower, index) => {
    activeCountsById[borrower.id] = activeCounts[index] ?? 0;
  });

  return (
    <>
      <PageHeader title={t.title} lede={t.lede} breadcrumbs={breadcrumbs} />
      <div className="wrap py-10">
        <BorrowersManager
          locale={locale}
          role={officer.role}
          borrowers={borrowers}
          activeCountsById={activeCountsById}
          initialSearch={search ?? ""}
        />
      </div>
    </>
  );
}
