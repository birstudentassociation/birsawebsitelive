import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import OfficerLogin from "@/components/equipment/OfficerLogin";
import OfficerQueue from "@/components/equipment/OfficerQueue";
import { OFFICER_COOKIE, isOfficerAuthConfigured, verifySessionToken } from "@/lib/officer-session";
import { isLoanBackendConfigured, listLoanRequests } from "@/lib/equipment-loan";

/**
 * Internal officer dashboard for the Equipment Loan Service. Never indexed:
 * it's reachable only by officers who know the URL and passcode, and has no
 * inbound links from the public site.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title =
    locale === "th" ? "แดชบอร์ดเจ้าหน้าที่ คำขอยืมอุปกรณ์" : "Officer dashboard: equipment loan requests";
  const description =
    locale === "th"
      ? "หน้าสำหรับเจ้าหน้าที่ BIRSA ใช้ตรวจสอบและพิจารณาคำขอยืมอุปกรณ์"
      : "Internal page for BIRSA officers to review and decide on equipment loan requests.";

  const metadata = buildMetadata({ locale, title, description, path: "/officer/equipment-loan" });
  return { ...metadata, robots: { index: false, follow: false } };
}

type Copy = {
  title: string;
  lede: string;
  authNotConfiguredTitle: string;
  authNotConfiguredBody: string;
  dbNotConfiguredTitle: string;
  dbNotConfiguredBody: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    title: "Equipment loan requests",
    lede: "Review pending requests and record a decision. Students are emailed the outcome automatically.",
    authNotConfiguredTitle: "Officer access is not set up yet",
    authNotConfiguredBody:
      "OFFICER_PASSCODE and OFFICER_SESSION_SECRET are not configured, so nobody can sign in to this dashboard yet.",
    dbNotConfiguredTitle: "The loan database is not connected",
    dbNotConfiguredBody: "POSTGRES_URL is not configured, so there are no loan requests to show yet.",
  },
  th: {
    title: "คำขอยืมอุปกรณ์",
    lede: "ตรวจสอบคำขอที่รอดำเนินการและบันทึกผลการพิจารณา ระบบจะส่งอีเมลแจ้งผลให้นักศึกษาโดยอัตโนมัติ",
    authNotConfiguredTitle: "ยังไม่ได้ตั้งค่าการเข้าสู่ระบบสำหรับเจ้าหน้าที่",
    authNotConfiguredBody:
      "ยังไม่ได้ตั้งค่า OFFICER_PASSCODE และ OFFICER_SESSION_SECRET จึงยังไม่มีใครเข้าสู่ระบบแดชบอร์ดนี้ได้",
    dbNotConfiguredTitle: "ยังไม่ได้เชื่อมต่อฐานข้อมูลคำขอยืม",
    dbNotConfiguredBody: "ยังไม่ได้ตั้งค่า POSTGRES_URL จึงยังไม่มีคำขอยืมอุปกรณ์ให้แสดงในขณะนี้",
  },
};

export default async function OfficerEquipmentLoanPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];

  const cookieStore = await cookies();
  const authed = verifySessionToken(cookieStore.get(OFFICER_COOKIE)?.value);
  const dbConfigured = isLoanBackendConfigured();
  const rows = authed && dbConfigured ? await listLoanRequests() : [];

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
        {!authed ? (
          <div className="flex flex-col gap-8">
            {!isOfficerAuthConfigured() ? (
              <Notice variant="warning" title={t.authNotConfiguredTitle}>
                {t.authNotConfiguredBody}
              </Notice>
            ) : null}
            <OfficerLogin locale={locale} />
          </div>
        ) : !dbConfigured ? (
          <Notice variant="warning" title={t.dbNotConfiguredTitle}>
            {t.dbNotConfiguredBody}
          </Notice>
        ) : (
          <OfficerQueue locale={locale} rows={rows} />
        )}
      </div>
    </>
  );
}
