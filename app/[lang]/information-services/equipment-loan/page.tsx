import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { listItems, getItemAvailabilitySummary } from "@/lib/inventory/items";
import { listCategories } from "@/lib/inventory/categories";
import { listCustodians } from "@/lib/inventory/custodians";
import { isInventoryConfigured } from "@/lib/inventory/db";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Notice from "@/components/Notice";
import Tag from "@/components/Tag";
import Email from "@/components/Email";
import ExternalLink from "@/components/ExternalLink";

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

  return buildMetadata({
    locale,
    title,
    description,
    path: "/information-services/equipment-loan",
  });
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
    ownerLabel: string;
    allOwners: string;
    directoryNoticeTitle: string;
    directoryNoticeBody: string;
    directoryLinkCta: string;
    clubBorrowLine: (clubName: string) => string;
    contactLabel: string;
    instagramLabel: string;
    noContactBody: string;
    viewInDirectory: string;
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
      "You can still see what's available below, but the online request form is not ready yet. Contact BIRSA directly to borrow an item.",
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
    ownerLabel: "Owner",
    allOwners: "All owners",
    directoryNoticeTitle: "Looking for club equipment?",
    directoryNoticeBody:
      "Some equipment is managed by clubs and borrowed directly from them. See the club equipment directory.",
    directoryLinkCta: "Open the club equipment directory",
    clubBorrowLine: (clubName) => `Borrow this from ${clubName} directly.`,
    contactLabel: "Contact",
    instagramLabel: "Instagram",
    noContactBody: "See the club equipment directory for how to reach this club.",
    viewInDirectory: "View in the club directory",
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
    ownerLabel: "เจ้าของ",
    allOwners: "ทุกเจ้าของ",
    directoryNoticeTitle: "ตามหาอุปกรณ์ของชมรมอยู่หรือเปล่า",
    directoryNoticeBody:
      "อุปกรณ์บางรายการดูแลโดยชมรมและต้องยืมโดยตรงจากชมรมนั้น ๆ ดูได้ที่ทำเนียบอุปกรณ์ของชมรม",
    directoryLinkCta: "เปิดทำเนียบอุปกรณ์ของชมรม",
    clubBorrowLine: (clubName) => `ยืมอุปกรณ์นี้ได้โดยตรงจาก${clubName}`,
    contactLabel: "ติดต่อ",
    instagramLabel: "Instagram",
    noContactBody: "ดูวิธีติดต่อชมรมนี้ได้ที่ทำเนียบอุปกรณ์ของชมรม",
    viewInDirectory: "ดูในทำเนียบอุปกรณ์ของชมรม",
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

/** Normalise a free-text Instagram field (full URL, "@handle", or bare handle) into a link href. */
function instagramHref(value: string): string {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const handle = trimmed.replace(/^@/, "");
  return `https://www.instagram.com/${handle}`;
}

export default async function EquipmentLoanPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string; owner?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];
  const configured = isInventoryConfigured();
  const { category: categorySlug, owner: ownerSlug } = await searchParams;

  const [allItems, categories, custodians] = await Promise.all([
    listItems(),
    listCategories(),
    listCustodians(),
  ]);
  const categoriesById = new Map(categories.map((c) => [c.id, c]));
  const custodiansById = new Map(custodians.map((c) => [c.id, c]));

  // Only offer categories/owners that actually have at least one (non-retired) listed item.
  const usedCategoryIds = new Set(
    allItems.map((item) => item.categoryId).filter((id): id is string => Boolean(id))
  );
  const availableCategories = categories.filter((c) => usedCategoryIds.has(c.id));

  const usedCustodianIds = new Set(
    allItems.map((item) => item.custodianId).filter((id): id is string => Boolean(id))
  );
  const availableOwners = custodians.filter((c) => usedCustodianIds.has(c.id));

  const selectedCategory = categorySlug
    ? categories.find((c) => c.slug === categorySlug)
    : undefined;
  const selectedOwner = ownerSlug ? custodians.find((c) => c.slug === ownerSlug) : undefined;

  const filteredItems = allItems.filter((item) => {
    if (selectedCategory && item.categoryId !== selectedCategory.id) return false;
    if (selectedOwner && item.custodianId !== selectedOwner.id) return false;
    return true;
  });

  const items = await Promise.all(
    filteredItems.map(async (item) => ({
      item,
      availability: await getItemAvailabilitySummary(item),
    }))
  );

  function buildHref(next: { category?: string | undefined; owner?: string | undefined }): string {
    const params = new URLSearchParams();
    const nextCategory = "category" in next ? next.category : categorySlug;
    const nextOwner = "owner" in next ? next.owner : ownerSlug;
    if (nextCategory) params.set("category", nextCategory);
    if (nextOwner) params.set("owner", nextOwner);
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
              {
                label: locale === "th" ? "ข้อมูลและบริการ" : "Information and services",
                href: "/information-services",
              },
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

        <Notice variant="info" title={t.directoryNoticeTitle}>
          <p>
            {t.directoryNoticeBody}{" "}
            <a
              href={localeHref(locale, "/information-services/equipment-loan/directory")}
              className="text-brand-deep hover:text-brand-dark font-semibold underline"
            >
              {t.directoryLinkCta}
            </a>
            .
          </p>
        </Notice>

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
              <p className="text-muted mb-2 text-sm font-semibold tracking-wide uppercase">
                {t.categoryLabel}
              </p>
              <ul className="flex flex-wrap gap-2">
                <li>
                  <a
                    href={buildHref({ category: undefined })}
                    aria-current={!selectedCategory ? "page" : undefined}
                    className={`${filterTagBase} ${!selectedCategory ? filterTagActive : filterTagInactive}`}
                  >
                    {t.allCategories}
                  </a>
                </li>
                {availableCategories.map((c) => (
                  <li key={c.id}>
                    <a
                      href={buildHref({ category: c.slug })}
                      aria-current={selectedCategory?.id === c.id ? "page" : undefined}
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
                href={buildHref({ category: undefined })}
                className="text-brand-deep w-fit text-sm font-semibold hover:underline"
              >
                {t.clearFilters}
              </a>
            ) : null}
          </nav>
        ) : null}

        {availableOwners.length > 0 ? (
          <nav aria-label={t.ownerLabel} className="flex flex-col gap-4">
            <div>
              <p className="text-muted mb-2 text-sm font-semibold tracking-wide uppercase">
                {t.ownerLabel}
              </p>
              <ul className="flex flex-wrap gap-2">
                <li>
                  <a
                    href={buildHref({ owner: undefined })}
                    aria-current={!selectedOwner ? "page" : undefined}
                    className={`${filterTagBase} ${!selectedOwner ? filterTagActive : filterTagInactive}`}
                  >
                    {t.allOwners}
                  </a>
                </li>
                {availableOwners.map((c) => (
                  <li key={c.id}>
                    <a
                      href={buildHref({ owner: c.slug })}
                      aria-current={selectedOwner?.id === c.id ? "page" : undefined}
                      className={`${filterTagBase} ${selectedOwner?.id === c.id ? filterTagActive : filterTagInactive}`}
                    >
                      {c.name[locale]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {selectedOwner ? (
              <a
                href={buildHref({ owner: undefined })}
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
              const requestHref = localeHref(
                locale,
                `/information-services/equipment-loan/${item.key}/request`
              );
              const categoryName = item.categoryId
                ? categoriesById.get(item.categoryId)?.name[locale]
                : undefined;
              const custodian = custodiansById.get(item.custodianId);
              const directoryHref = custodian
                ? localeHref(
                    locale,
                    `/information-services/equipment-loan/directory#${custodian.slug}`
                  )
                : localeHref(locale, "/information-services/equipment-loan/directory");
              return (
                <Card key={item.key} className="gap-3 p-6">
                  {item.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.photoUrl}
                      alt={item.name[locale]}
                      loading="lazy"
                      className="border-line max-h-48 w-full rounded-lg border object-cover"
                    />
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    {categoryName ? (
                      <span className="text-brand-deep bg-brand-tint w-fit rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                        {categoryName}
                      </span>
                    ) : null}
                    {custodian ? <Tag variant="forest">{custodian.name[locale]}</Tag> : null}
                  </div>
                  <h3 className="font-display text-ink text-lg leading-snug">
                    {item.name[locale]}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">{item.description[locale]}</p>

                  {item.onlineLoanable ? (
                    <>
                      <div className="mt-1 flex items-center gap-2 text-sm font-semibold">
                        {isAvailable ? <AvailableIcon /> : <UnavailableIcon />}
                        <span className={isAvailable ? "text-success" : "text-error"}>
                          {isAvailable
                            ? t.availableLabel(availability.available, availability.total)
                            : t.unavailableLabel}
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
                    </>
                  ) : (
                    <div className="mt-1 flex flex-col gap-2 text-sm">
                      <p className="text-muted leading-relaxed">
                        {custodian ? t.clubBorrowLine(custodian.name[locale]) : t.noContactBody}
                      </p>
                      {custodian?.borrowNote[locale] ? (
                        <p className="text-muted leading-relaxed">{custodian.borrowNote[locale]}</p>
                      ) : null}
                      <div>
                        <Button href={directoryHref} variant="secondary">
                          {t.viewInDirectory}
                        </Button>
                      </div>
                      {custodian?.contactEmail ||
                      custodian?.contactInstagram ||
                      custodian?.contactOther ? (
                        <dl className="flex flex-col gap-1">
                          {custodian.contactEmail ? (
                            <div className="flex flex-wrap items-baseline gap-1">
                              <dt className="text-ink font-semibold">{t.contactLabel}:</dt>
                              <dd>
                                <Email
                                  address={custodian.contactEmail}
                                  className="text-brand-deep hover:text-brand-dark font-semibold underline"
                                />
                              </dd>
                            </div>
                          ) : null}
                          {custodian.contactInstagram ? (
                            <div className="flex flex-wrap items-baseline gap-1">
                              <dt className="text-ink font-semibold">{t.instagramLabel}:</dt>
                              <dd>
                                <ExternalLink
                                  href={instagramHref(custodian.contactInstagram)}
                                  newTabLabel={dict.a11y.newTab}
                                  className="text-brand-deep hover:text-brand-dark font-semibold underline"
                                >
                                  {custodian.contactInstagram}
                                </ExternalLink>
                              </dd>
                            </div>
                          ) : null}
                          {custodian.contactOther ? (
                            <div className="flex flex-wrap items-baseline gap-1">
                              <dt className="text-ink font-semibold">{t.contactLabel}:</dt>
                              <dd className="text-muted">{custodian.contactOther}</dd>
                            </div>
                          ) : null}
                        </dl>
                      ) : (
                        <p className="text-muted leading-relaxed">{t.noContactBody}</p>
                      )}
                    </div>
                  )}
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
