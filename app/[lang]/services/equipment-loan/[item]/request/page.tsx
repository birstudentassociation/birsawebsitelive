import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getItemByKey, getItemAvailabilitySummary } from "@/lib/inventory/items";
import { buildLoanWizardLabels } from "@/components/equipment/loanWizardCopy";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import Button from "@/components/Button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; item: string }>;
}): Promise<Metadata> {
  const { lang, item: itemKey } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const item = await getItemByKey(itemKey);
  if (!item || item.isRetired) return {};

  const title =
    locale === "th"
      ? `ขอยืม${item.name.th}`
      : `Request to borrow the ${item.name.en.toLowerCase()}`;
  const description =
    locale === "th"
      ? `กรอกแบบฟอร์มออนไลน์เพื่อขอยืม${item.name.th}จาก BIRSA`
      : `Fill in the online form to request to borrow the ${item.name.en.toLowerCase()} from BIRSA.`;

  return buildMetadata({
    locale,
    title,
    description,
    path: `/services/equipment-loan/${item.key}/request`,
  });
}

const copy: Record<
  Locale,
  {
    unavailableTitle: string;
    unavailableBody: string;
    backToCatalogue: string;
    breadcrumbCatalogue: string;
    breadcrumbRequest: string;
  }
> = {
  en: {
    unavailableTitle: "This item is currently on loan",
    unavailableBody:
      "There are no units of this item available to borrow right now. Check back later, or contact BIRSA if it's urgent.",
    backToCatalogue: "Back to the equipment list",
    breadcrumbCatalogue: "Equipment loan service",
    breadcrumbRequest: "Request",
  },
  th: {
    unavailableTitle: "อุปกรณ์นี้ถูกยืมอยู่ในขณะนี้",
    unavailableBody:
      "ขณะนี้ไม่มีอุปกรณ์ชิ้นนี้ว่างให้ยืม ลองกลับมาตรวจสอบใหม่ภายหลัง หรือติดต่อ BIRSA หากเร่งด่วน",
    backToCatalogue: "กลับไปหน้ารายการอุปกรณ์",
    breadcrumbCatalogue: "บริการยืมอุปกรณ์",
    breadcrumbRequest: "ส่งคำขอ",
  },
};

export default async function EquipmentLoanRequestPage({
  params,
}: {
  params: Promise<{ lang: string; item: string }>;
}) {
  const { lang, item: itemKey } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];

  const item = await getItemByKey(itemKey);
  if (!item || item.isRetired) notFound();

  const availability = await getItemAvailabilitySummary(item);
  const catalogueHref = localeHref(locale, "/services/equipment-loan");
  const infoServicesLabel = dict.nav.find((n) => n.href === "/services")!.label;

  const breadcrumbs = (
    <Breadcrumbs
      locale={locale}
      label={dict.a11y.breadcrumb}
      items={[
        { label: dict.site.name, href: "/" },
        { label: infoServicesLabel, href: "/services" },
        { label: t.breadcrumbCatalogue, href: "/services/equipment-loan" },
        { label: t.breadcrumbRequest },
      ]}
    />
  );

  if (availability.available <= 0) {
    return (
      <>
        <PageHeader title={item.name[locale]} breadcrumbs={breadcrumbs} />
        <div className="wrap flex max-w-[var(--measure)] flex-col gap-6 py-10">
          <Notice variant="warning" title={t.unavailableTitle}>
            <p>{t.unavailableBody}</p>
          </Notice>
          <div>
            <Button href={catalogueHref} variant="secondary">
              {t.backToCatalogue}
            </Button>
          </div>
        </div>
      </>
    );
  }

  const labels = buildLoanWizardLabels(locale, item);
  const nameStepHref = localeHref(locale, `/services/equipment-loan/${item.key}/request/name`);

  return (
    <>
      <PageHeader title={item.name[locale]} breadcrumbs={breadcrumbs} />
      <div className="wrap max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-2xl sm:text-3xl">{labels.start.title}</h2>
          <p className="text-muted">{labels.start.intro}</p>
          <div className="rounded-lg border border-line bg-sunken p-5">
            <h2 className="text-base font-semibold text-ink">{labels.start.needTitle}</h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
              {labels.start.needItems.map((need) => (
                <li key={need}>{need}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-line bg-sunken p-5">
            <h2 className="text-base font-semibold text-ink">{labels.start.termsTitle}</h2>
            <p className="mt-2 text-sm text-muted">{labels.start.termsBody}</p>
          </div>
          <div>
            <Button href={nameStepHref}>{labels.start.cta}</Button>
          </div>
        </div>
      </div>
    </>
  );
}
