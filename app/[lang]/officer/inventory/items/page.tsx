import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import ItemsManager from "@/components/inventory/ItemsManager";
import { getSessionOfficer } from "@/lib/inventory/auth";
import { listItems } from "@/lib/inventory/items";
import { listCategories } from "@/lib/inventory/categories";
import { listLocations } from "@/lib/inventory/locations";

/**
 * Officer console: full item catalogue with search/filter and item creation.
 * Never indexed: reachable only by signed-in officers. Auth gating happens
 * inline here (per `getSessionOfficer()`), matching the console layout's
 * convention of always rendering `{children}` and letting each page decide.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "รายการครุภัณฑ์ทั้งหมด" : "Item catalogue";
  const description =
    locale === "th"
      ? "หน้าสำหรับเจ้าหน้าที่ BIRSA ใช้ค้นหา จัดการ และเพิ่มรายการครุภัณฑ์"
      : "Internal page for BIRSA officers to search, manage, and add inventory items.";

  const metadata = buildMetadata({ locale, title, description, path: "/officer/inventory/items" });
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
    title: "Item catalogue",
    lede: "Search, filter, and manage every item in the inventory. Add new items here and open any item for full detail.",
  },
  th: {
    title: "รายการครุภัณฑ์ทั้งหมด",
    lede: "ค้นหา กรอง และจัดการรายการครุภัณฑ์ทั้งหมด เพิ่มรายการใหม่ได้ที่นี่ หรือเปิดดูรายละเอียดของแต่ละรายการ",
  },
};

export default async function OfficerInventoryItemsPage({
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

  const [items, categories, locations] = await Promise.all([
    listItems({ includeRetired: true }),
    listCategories(),
    listLocations(),
  ]);

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
        <ItemsManager items={items} categories={categories} locations={locations} role={officer.role} locale={locale} />
      </div>
    </>
  );
}
