import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import CustodiansManager from "@/components/inventory/CustodiansManager";
import { getSessionOfficer } from "@/lib/inventory/auth";
import { isInventoryConfigured } from "@/lib/inventory/db";
import { listCustodians } from "@/lib/inventory/custodians";

/**
 * Officer console: manage the custodian organisations (BIRSA + clubs) that
 * own catalogue items. Never indexed. Auth gating happens inline via
 * `getSessionOfficer()`, restricted to BIRSA/global admins.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "องค์กร/ชมรม CBEMS" : "Organisations: CBEMS";
  const description =
    locale === "th"
      ? "หน้าสำหรับผู้ดูแลระบบ BIRSA ใช้จัดการองค์กรและชมรมที่ดูแลรายการครุภัณฑ์"
      : "Internal page for BIRSA admins to manage the custodian organisations that own catalogue items.";

  const metadata = buildMetadata({
    locale,
    title,
    description,
    path: "/officer/inventory/custodians",
  });
  return { ...metadata, robots: { index: false, follow: false } };
}

type Copy = {
  title: string;
  lede: string;
  consoleHomeLabel: string;
  signInNeededTitle: string;
  signInNeededBody: string;
  signInLink: string;
  accessDeniedTitle: string;
  accessDeniedBody: string;
  dbNotConfiguredTitle: string;
  dbNotConfiguredBody: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    title: "Organisations",
    lede: "Manage the BIRSA and club custodian organisations that own catalogue items.",
    consoleHomeLabel: "CBEMS",
    signInNeededTitle: "Sign in",
    signInNeededBody: "Sign in on the console home to manage custodian organisations.",
    signInLink: "Go to console home",
    accessDeniedTitle: "You do not have access to this page.",
    accessDeniedBody: "Only BIRSA admins can manage custodian organisations.",
    dbNotConfiguredTitle: "The inventory database is not connected",
    dbNotConfiguredBody:
      "POSTGRES_URL is not configured, so there are no organisations to show yet.",
  },
  th: {
    title: "องค์กร/ชมรม",
    lede: "จัดการองค์กร BIRSA และชมรมต่าง ๆ ที่ดูแลรายการครุภัณฑ์",
    consoleHomeLabel: "CBEMS",
    signInNeededTitle: "กรุณาเข้าสู่ระบบ",
    signInNeededBody: "กรุณาเข้าสู่ระบบที่หน้าคอนโซลหลักเพื่อจัดการองค์กร/ชมรม",
    signInLink: "ไปที่หน้าคอนโซลหลัก",
    accessDeniedTitle: "คุณไม่มีสิทธิ์เข้าถึงหน้านี้",
    accessDeniedBody: "เฉพาะผู้ดูแลระบบ BIRSA เท่านั้นที่จัดการองค์กร/ชมรมได้",
    dbNotConfiguredTitle: "ยังไม่ได้เชื่อมต่อฐานข้อมูลครุภัณฑ์",
    dbNotConfiguredBody: "ยังไม่ได้ตั้งค่า POSTGRES_URL จึงยังไม่มีองค์กร/ชมรมให้แสดงในขณะนี้",
  },
};

export default async function OfficerInventoryCustodiansPage({
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

  if (!officer) {
    // The signed-out branch still needs its own h1: returning just a Notice
    // left the page with no top-level heading at all, so assistive tech had
    // nothing to announce it by and the heading order started at h2.
    return (
      <>
        <PageHeader title={t.title} />
        <div className="wrap flex flex-col gap-6 py-10">
          <Notice variant="info" title={t.signInNeededTitle}>
            {t.signInNeededBody}
          </Notice>
          <div>
            <Button href={localeHref(locale, "/officer/inventory")}>{t.signInLink}</Button>
          </div>
        </div>
      </>
    );
  }

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
              { label: t.consoleHomeLabel, href: "/officer/inventory" },
              { label: t.title },
            ]}
          />
        }
      />
      <div className="wrap py-10">
        {officer.role !== "admin" || officer.custodianId !== null ? (
          <Notice variant="warning" title={t.accessDeniedTitle}>
            {t.accessDeniedBody}
          </Notice>
        ) : !isInventoryConfigured() ? (
          <Notice variant="warning" title={t.dbNotConfiguredTitle}>
            {t.dbNotConfiguredBody}
          </Notice>
        ) : (
          <CustodiansManager
            locale={locale}
            custodians={await listCustodians({ includeInactive: true })}
          />
        )}
      </div>
    </>
  );
}
