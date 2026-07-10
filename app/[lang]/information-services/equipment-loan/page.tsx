import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { listItems, getItemAvailabilitySummary } from "@/lib/inventory/items";
import { listCategories } from "@/lib/inventory/categories";
import { isInventoryConfigured } from "@/lib/inventory/db";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Notice from "@/components/Notice";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "บริการยืมอุปกรณ์" : "Equipment loan service";
  const description =
    locale === "th"
      ? "ยืมอุปกรณ์ของ BIRSA ได้ฟรี ส่งคำขอออนไลน์ รอผลอนุมัติทางอีเมล แล้วมารับที่สำนักงาน BIRSA"
      : "Borrow BIRSA equipment for free. Request online, get approved by email, then collect it from the BIRSA office.";

  return buildMetadata({ locale, title, description, path: "/information-services/equipment-loan" });
}

const copy: Record<
  Locale,
  {
    title: string;
    lede: string;
    howItWorksTitle: string;
    steps: string[];
    notConfiguredTitle: string;
    notConfiguredBody: string;
    contactLink: string;
    availableLabel: (available: number, total: number) => string;
    unavailableLabel: string;
    maxLoanLabel: (days: number) => string;
    requestCta: string;
    unavailableCta: string;
    categoryLabel: string;
    allCategories: string;
    filterNav: string;
    clearFilters: string;
    noResults: string;
  }
> = {
  en: {
    title: "Equipment loan service",
    lede: "Borrow BIRSA equipment for your event or everyday need, free of charge.",
    howItWorksTitle: "How it works",
    steps: [
      "Pick an item below and fill in the online request form.",
      "BIRSA reviews your request and emails you the outcome.",
      "Once approved, collect the item in person from the BIRSA office.",
      "Return it by the date you agreed to, so it's ready for the next student.",
    ],
    notConfiguredTitle: "Online requests are still being set up",
    notConfiguredBody:
      "You can still see what's available below, but the online request form isn't ready yet. Please contact BIRSA directly to borrow an item.",
    contactLink: "Contact BIRSA",
    availableLabel: (available, total) => `Available (${available} of ${total})`,
    unavailableLabel: "On loan / unavailable",
    maxLoanLabel: (days) => `Borrow for up to ${days} day(s)`,
    requestCta: "Request to borrow",
    unavailableCta: "Currently unavailable",
    categoryLabel: "Category",
    allCategories: "All categories",
    filterNav: "Filter equipment",
    clearFilters: "Clear filters",
    noResults: "No equipment matched this category.",
  },
  th: {
    title: "บริการยืมอุปกรณ์",
    lede: "ยืมอุปกรณ์ของ BIRSA ไปใช้ในกิจกรรมหรือความจำเป็นในชีวิตประจำวันได้ฟรี",
    howItWorksTitle: "ขั้นตอนการยืม",
    steps: [
      "เลือกอุปกรณ์ที่ต้องการด้านล่างแล้วกรอกแบบฟอร์มคำขอออนไลน์",
      "BIRSA ตรวจสอบคำขอของคุณและแจ้งผลทางอีเมล",
      "เมื่อคำขอได้รับการอนุมัติ ให้มารับอุปกรณ์ที่สำนักงาน BIRSA ด้วยตนเอง",
      "คืนอุปกรณ์ตามวันที่ตกลงไว้ เพื่อให้เพื่อนนักศึกษาคนต่อไปยืมได้",
    ],
    notConfiguredTitle: "ระบบส่งคำขอออนไลน์กำลังอยู่ระหว่างการเตรียมการ",
    notConfiguredBody:
      "คุณยังดูรายการอุปกรณ์ด้านล่างได้ตามปกติ แต่แบบฟอร์มส่งคำขอออนไลน์ยังไม่พร้อมใช้งาน กรุณาติดต่อ BIRSA โดยตรงเพื่อขอยืมอุปกรณ์",
    contactLink: "ติดต่อ BIRSA",
    availableLabel: (available, total) => `พร้อมให้ยืม (${available} จาก ${total})`,
    unavailableLabel: "ถูกยืมอยู่ / ไม่พร้อมให้ยืม",
    maxLoanLabel: (days) => `ยืมได้สูงสุด ${days} วัน`,
    requestCta: "ขอยืมอุปกรณ์นี้",
    unavailableCta: "ไม่พร้อมให้ยืมในขณะนี้",
    categoryLabel: "หมวดหมู่",
    allCategories: "ทุกหมวดหมู่",
    filterNav: "ตัวกรองอุปกรณ์",
    clearFilters: "ล้างตัวกรอง",
    noResults: "ไม่พบอุปกรณ์ในหมวดหมู่นี้",
  },
};

function AvailableIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="text-success h-5 w-5 shrink-0">
      <path
        d="M4 10.5 8 14l8-8"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UnavailableIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="text-error h-5 w-5 shrink-0">
      <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth={2} />
      <path d="m7 7 6 6M13 7l-6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

export default async function EquipmentLoanPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];
  const configured = isInventoryConfigured();
  const { category: categorySlug } = await searchParams;

  const [allItems, categories] = await Promise.all([listItems(), listCategories()]);
  const categoriesById = new Map(categories.map((c) => [c.id, c]));

  // Only offer categories that actually have at least one (non-retired) item.
  const usedCategoryIds = new Set(allItems.map((item) => item.categoryId).filter((id): id is string => Boolean(id)));
  const availableCategories = categories.filter((c) => usedCategoryIds.has(c.id));

  const selectedCategory = categorySlug ? categories.find((c) => c.slug === categorySlug) : undefined;
  const filteredItems = selectedCategory
    ? allItems.filter((item) => item.categoryId === selectedCategory.id)
    : allItems;

  const items = await Promise.all(
    filteredItems.map(async (item) => ({
      item,
      availability: await getItemAvailabilitySummary(item),
    }))
  );

  function buildHref(nextCategorySlug: string | undefined): string {
    const params = new URLSearchParams();
    if (nextCategorySlug) params.set("category", nextCategorySlug);
    const qs = params.toString();
    return localeHref(locale, "/information-services/equipment-loan") + (qs ? `?${qs}` : "");
  }

  const filterTagBase =
    "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold transition-colors";
  const filterTagInactive = "border-line bg-surface text-ink hover:bg-sunken";
  const filterTagActive = "border-brand bg-brand text-white";

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
              { label: locale === "th" ? "ข้อมูลและบริการ" : "Information & services", href: "/information-services" },
              { label: t.title },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-10 py-10">
        <section className="border-line bg-sunken flex flex-col gap-3 rounded-lg border p-6 sm:p-8">
          <h2 className="font-display text-xl">{t.howItWorksTitle}</h2>
          <ol className="text-muted flex flex-col gap-2 text-sm leading-relaxed">
            {t.steps.map((step, index) => (
              <li key={index} className="flex gap-2">
                <span aria-hidden="true" className="text-ink font-semibold">
                  {index + 1}.
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {!configured ? (
          <Notice variant="info" title={t.notConfiguredTitle}>
            <p>
              {t.notConfiguredBody}{" "}
              <a
                href={localeHref(locale, "/contact")}
                className="text-brand-deep hover:text-brand-dark font-semibold underline"
              >
                {t.contactLink}
              </a>
              .
            </p>
          </Notice>
        ) : null}

        {availableCategories.length > 0 ? (
          <nav aria-label={t.filterNav} className="flex flex-col gap-4">
            <div>
              <p className="text-muted mb-2 text-sm font-semibold tracking-wide uppercase">{t.categoryLabel}</p>
              <ul className="flex flex-wrap gap-2">
                <li>
                  <a
                    href={buildHref(undefined)}
                    aria-current={!selectedCategory ? "true" : undefined}
                    className={`${filterTagBase} ${!selectedCategory ? filterTagActive : filterTagInactive}`}
                  >
                    {t.allCategories}
                  </a>
                </li>
                {availableCategories.map((c) => (
                  <li key={c.id}>
                    <a
                      href={buildHref(c.slug)}
                      aria-current={selectedCategory?.id === c.id ? "true" : undefined}
                      className={`${filterTagBase} ${selectedCategory?.id === c.id ? filterTagActive : filterTagInactive}`}
                    >
                      {c.name[locale]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {selectedCategory ? (
              <a
                href={buildHref(undefined)}
                className="text-brand-deep w-fit text-sm font-semibold hover:underline"
              >
                {t.clearFilters}
              </a>
            ) : null}
          </nav>
        ) : null}

        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ item, availability }) => {
              const isAvailable = availability.available > 0;
              const requestHref = localeHref(locale, `/information-services/equipment-loan/${item.key}/request`);
              const categoryName = item.categoryId ? categoriesById.get(item.categoryId)?.name[locale] : undefined;
              return (
                <Card key={item.key} className="gap-3 p-6">
                  {categoryName ? (
                    <span className="text-brand-deep bg-brand-tint w-fit rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                      {categoryName}
                    </span>
                  ) : null}
                  <h3 className="font-display text-ink text-lg leading-snug">{item.name[locale]}</h3>
                  <p className="text-muted text-sm leading-relaxed">{item.description[locale]}</p>

                  <div className="mt-1 flex items-center gap-2 text-sm font-semibold">
                    {isAvailable ? <AvailableIcon /> : <UnavailableIcon />}
                    <span className={isAvailable ? "text-success" : "text-error"}>
                      {isAvailable ? t.availableLabel(availability.available, availability.total) : t.unavailableLabel}
                    </span>
                  </div>

                  <dl className="text-muted mt-1 flex flex-col gap-1 text-sm">
                    <div>{t.maxLoanLabel(item.maxLoanDays)}</div>
                  </dl>

                  <div className="mt-2">
                    {isAvailable ? (
                      <Button href={requestHref}>{t.requestCta}</Button>
                    ) : (
                      <span
                        aria-disabled="true"
                        className="border-line text-muted inline-flex h-11 items-center justify-center rounded-lg border-[1.5px] px-5 text-[0.95rem] font-semibold"
                      >
                        {t.unavailableCta}
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-muted">{t.noResults}</p>
        )}
      </div>
    </>
  );
}
