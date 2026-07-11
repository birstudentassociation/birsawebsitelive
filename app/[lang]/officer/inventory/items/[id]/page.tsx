import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import ItemDetail from "@/components/inventory/ItemDetail";
import { getSessionOfficer } from "@/lib/inventory/auth";
import { getItem, getItemAvailabilitySummary } from "@/lib/inventory/items";
import { listUnits } from "@/lib/inventory/units";
import { listAdjustments } from "@/lib/inventory/consumables";
import { listCategories } from "@/lib/inventory/categories";
import { listLocations } from "@/lib/inventory/locations";

/**
 * Officer console: single item detail, editing, unit management (for
 * asset-tracked items), maintenance actions, and stock adjustment (for
 * consumables). Never indexed. Auth gating happens inline via
 * `getSessionOfficer()`.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const item = await getItem(id);
  const title = item ? item.name[locale] : locale === "th" ? "รายละเอียดครุภัณฑ์" : "Item detail";
  const description =
    locale === "th"
      ? "หน้าสำหรับเจ้าหน้าที่ BIRSA ใช้ดูและจัดการรายละเอียดครุภัณฑ์แต่ละรายการ"
      : "Internal page for BIRSA officers to view and manage a single inventory item.";

  const metadata = buildMetadata({
    locale,
    title,
    description,
    path: `/officer/inventory/items/${id}`,
  });
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

export default async function OfficerInventoryItemDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
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

  const item = await getItem(id);
  if (!item) notFound();

  const [units, categories, locations, availability, adjustments] = await Promise.all([
    listUnits({ itemId: id }),
    listCategories(),
    listLocations(),
    getItemAvailabilitySummary(item),
    item.trackingMode === "consumable" ? listAdjustments(id) : Promise.resolve([]),
  ]);

  return (
    <>
      <PageHeader
        title={item.name[locale]}
        lede={item.key}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: "BIRSA officer console", href: "/officer/inventory" },
              { label: "Catalogue", href: "/officer/inventory/items" },
              { label: item.name[locale] },
            ]}
          />
        }
      />
      <div className="wrap py-10">
        <ItemDetail
          item={item}
          units={units}
          categories={categories}
          locations={locations}
          role={officer.role}
          locale={locale}
          adjustments={adjustments}
          availability={availability}
        />
      </div>
    </>
  );
}
