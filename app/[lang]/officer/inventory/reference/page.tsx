import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import ReferenceManager from "@/components/inventory/ReferenceManager";
import { getSessionOfficer } from "@/lib/inventory/auth";
import { listCategories } from "@/lib/inventory/categories";
import { listLocations } from "@/lib/inventory/locations";

/**
 * Officer console: manage the shared reference data (categories, locations)
 * that items and units are tagged with. Never indexed. Auth gating happens
 * inline via `getSessionOfficer()`.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "ข้อมูลอ้างอิงครุภัณฑ์" : "Catalogue reference data";
  const description =
    locale === "th"
      ? "หน้าสำหรับเจ้าหน้าที่ BIRSA ใช้จัดการหมวดหมู่และสถานที่จัดเก็บครุภัณฑ์"
      : "Internal page for BIRSA officers to manage inventory categories and storage locations.";

  const metadata = buildMetadata({ locale, title, description, path: "/officer/inventory/reference" });
  return { ...metadata, robots: { index: false, follow: false } };
}

const gateCopy: Record<Locale, { title: string; body: string; cta: string }> = {
  en: {
    title: "Please sign in",
    body: "Please sign in on the console home to manage the inventory catalogue.",
    cta: "Go to console home",
  },
  th: {
    title: "กรุณาเข้าสู่ระบบ",
    body: "กรุณาเข้าสู่ระบบที่หน้าคอนโซลหลักเพื่อจัดการรายการครุภัณฑ์",
    cta: "ไปที่หน้าคอนโซลหลัก",
  },
};

const pageCopy: Record<Locale, { title: string; lede: string }> = {
  en: {
    title: "Catalogue reference data",
    lede: "Manage the categories and storage locations that items and units are tagged with.",
  },
  th: {
    title: "ข้อมูลอ้างอิงครุภัณฑ์",
    lede: "จัดการหมวดหมู่และสถานที่จัดเก็บที่ใช้ระบุรายการครุภัณฑ์และหน่วยย่อย",
  },
};

export default async function OfficerInventoryReferencePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);

  const officer = await getSessionOfficer();
  const g = gateCopy[locale];

  if (!officer) {
    return (
      <div className="wrap flex flex-col gap-6 py-10">
        <Notice variant="info" title={g.title}>
          {g.body}
        </Notice>
        <div>
          <Button href={localeHref(locale, "/officer/inventory")}>{g.cta}</Button>
        </div>
      </div>
    );
  }

  const [categories, locations] = await Promise.all([listCategories(), listLocations()]);

  const t = pageCopy[locale];

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
              { label: "BIRSA officer console", href: "/officer/inventory" },
              { label: t.title },
            ]}
          />
        }
      />
      <div className="wrap py-10">
        <ReferenceManager categories={categories} locations={locations} role={officer.role} locale={locale} />
      </div>
    </>
  );
}
