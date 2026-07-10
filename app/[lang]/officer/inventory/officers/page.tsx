import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import OfficersManager from "@/components/inventory/OfficersManager";
import { getSessionOfficer } from "@/lib/inventory/auth";
import { isInventoryConfigured } from "@/lib/inventory/db";
import { listOfficers } from "@/lib/inventory/officers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "เจ้าหน้าที่ คอนโซลเจ้าหน้าที่" : "Officers: officer console";
  const description =
    locale === "th"
      ? "จัดการบัญชีเจ้าหน้าที่ที่เข้าถึงคอนโซลจัดการครุภัณฑ์"
      : "Manage officer accounts with access to the inventory console.";

  const metadata = buildMetadata({ locale, title, description, path: "/officer/inventory/officers" });
  return { ...metadata, robots: { index: false, follow: false } };
}

type Copy = {
  title: string;
  lede: string;
  signInNeededTitle: string;
  signInNeededBody: string;
  signInLink: string;
  adminsOnlyTitle: string;
  adminsOnlyBody: string;
  dbNotConfiguredTitle: string;
  dbNotConfiguredBody: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    title: "Officers",
    lede: "Manage who can sign in to the inventory console and what they can do.",
    signInNeededTitle: "Please sign in on the console home",
    signInNeededBody: "You need an active officer session to manage officer accounts.",
    signInLink: "Go to console home",
    adminsOnlyTitle: "Admins only",
    adminsOnlyBody: "Only officers with the admin role can manage officer accounts.",
    dbNotConfiguredTitle: "The inventory database is not connected",
    dbNotConfiguredBody: "POSTGRES_URL is not configured, so there are no officer accounts to show yet.",
  },
  th: {
    title: "เจ้าหน้าที่",
    lede: "จัดการสิทธิ์การเข้าสู่ระบบคอนโซลจัดการครุภัณฑ์และบทบาทของเจ้าหน้าที่",
    signInNeededTitle: "กรุณาเข้าสู่ระบบที่หน้าแรกของคอนโซล",
    signInNeededBody: "คุณต้องมีเซสชันเจ้าหน้าที่ที่ใช้งานอยู่จึงจะจัดการบัญชีเจ้าหน้าที่ได้",
    signInLink: "ไปที่หน้าแรกของคอนโซล",
    adminsOnlyTitle: "สำหรับผู้ดูแลระบบเท่านั้น",
    adminsOnlyBody: "เฉพาะเจ้าหน้าที่ที่มีบทบาทผู้ดูแลระบบเท่านั้นที่จัดการบัญชีเจ้าหน้าที่ได้",
    dbNotConfiguredTitle: "ยังไม่ได้เชื่อมต่อฐานข้อมูลครุภัณฑ์",
    dbNotConfiguredBody: "ยังไม่ได้ตั้งค่า POSTGRES_URL จึงยังไม่มีบัญชีเจ้าหน้าที่ให้แสดงในขณะนี้",
  },
};

export default async function OfficerInventoryOfficersPage({
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
            items={[
              { label: dict.site.name, href: "/" },
              { label: "Officer console", href: "/officer/inventory" },
              { label: t.title },
            ]}
          />
        }
      />
      <div className="wrap py-10">
        {!officer ? (
          <div className="flex flex-col gap-6">
            <Notice variant="info" title={t.signInNeededTitle}>
              {t.signInNeededBody}
            </Notice>
            <div>
              <Button href={localeHref(locale, "/officer/inventory")}>{t.signInLink}</Button>
            </div>
          </div>
        ) : officer.role !== "admin" ? (
          <Notice variant="warning" title={t.adminsOnlyTitle}>
            {t.adminsOnlyBody}
          </Notice>
        ) : !isInventoryConfigured() ? (
          <Notice variant="warning" title={t.dbNotConfiguredTitle}>
            {t.dbNotConfiguredBody}
          </Notice>
        ) : (
          <OfficersManager locale={locale} officers={await listOfficers()} />
        )}
      </div>
    </>
  );
}
