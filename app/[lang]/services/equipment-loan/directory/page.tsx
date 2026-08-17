import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { listCustodians } from "@/lib/inventory/custodians";
import { listItems, getItemAvailabilitySummary } from "@/lib/inventory/items";
import { isInventoryConfigured } from "@/lib/inventory/db";
import type { Custodian, Item } from "@/lib/inventory/types";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import Email from "@/components/Email";
import ExternalLink from "@/components/ExternalLink";
import { getClubEntries } from "@/lib/content";

/**
 * Live club inventory and per-item availability, which change as loans are made
 * and are unavailable at build time (no database). Render per request so the
 * directory reflects current data instead of a stale build-time snapshot.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "ทำเนียบอุปกรณ์ของชมรม" : "Club equipment directory";
  const description =
    locale === "th"
      ? "ดูว่าชมรมไหนมีอุปกรณ์อะไรบ้าง และติดต่อชมรมโดยตรงเพื่อขอยืม"
      : "See what equipment each club has and contact the club directly to borrow it.";

  return buildMetadata({
    locale,
    title,
    description,
    path: "/services/equipment-loan/directory",
  });
}

const copy: Record<
  Locale,
  {
    title: string;
    lede: string;
    jumpNavLabel: string;
    notConfiguredTitle: string;
    notConfiguredBody: string;
    contactLink: string;
    noClubsTitle: string;
    noClubsBody: string;
    noItemsLine: string;
    availableHint: string;
    unavailableHint: string;
    contactHeading: string;
    instagramLabel: string;
    backCta: string;
    itemsHeading: string;
    clubPageCta: string;
  }
> = {
  en: {
    title: "Club equipment directory",
    lede: "Some equipment is managed directly by clubs rather than through BIRSA's online request system. Find your club below to see what it has and how to reach them.",
    jumpNavLabel: "Jump to a club",
    notConfiguredTitle: "This directory is still being set up",
    notConfiguredBody:
      "Club equipment listings are not available online yet. Contact BIRSA for help reaching a club.",
    contactLink: "Contact BIRSA",
    noClubsTitle: "No clubs listed yet",
    noClubsBody: "BIRSA has not published any club equipment listings yet. Check back soon.",
    noItemsLine: "No items listed yet.",
    availableHint: "Available",
    unavailableHint: "Currently out",
    contactHeading: "Contact",
    instagramLabel: "Instagram",
    backCta: "Back to the equipment loan service",
    itemsHeading: "Items",
    clubPageCta: "View this club's page",
  },
  th: {
    title: "ทำเนียบอุปกรณ์ของชมรม",
    lede: "อุปกรณ์บางรายการดูแลโดยชมรมโดยตรง ไม่ได้อยู่ในระบบส่งคำขอออนไลน์ของ BIRSA ค้นหาชมรมของคุณด้านล่างเพื่อดูว่ามีอุปกรณ์อะไรบ้างและติดต่อได้อย่างไร",
    jumpNavLabel: "ไปที่ชมรม",
    notConfiguredTitle: "ทำเนียบนี้กำลังอยู่ระหว่างการเตรียมการ",
    notConfiguredBody:
      "ข้อมูลอุปกรณ์ของชมรมยังไม่พร้อมใช้งานออนไลน์ กรุณาติดต่อ BIRSA เพื่อขอความช่วยเหลือในการติดต่อชมรม",
    contactLink: "ติดต่อ BIRSA",
    noClubsTitle: "ยังไม่มีรายชื่อชมรม",
    noClubsBody: "BIRSA ยังไม่ได้เผยแพร่รายการอุปกรณ์ของชมรม กรุณาตรวจสอบใหม่อีกครั้งเร็ว ๆ นี้",
    noItemsLine: "ยังไม่มีรายการอุปกรณ์",
    availableHint: "พร้อมให้ยืม",
    unavailableHint: "ถูกยืมอยู่",
    contactHeading: "ติดต่อ",
    instagramLabel: "Instagram",
    backCta: "กลับไปหน้าบริการยืมอุปกรณ์",
    itemsHeading: "รายการอุปกรณ์",
    clubPageCta: "ดูหน้าของชมรมนี้",
  },
};

function AvailableIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-success">
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
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-error">
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

export default async function EquipmentLoanDirectoryPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];
  const configured = isInventoryConfigured();

  const custodians = await listCustodians();
  const clubs = custodians.filter((c) => c.kind === "club");
  const clubsContent = getClubEntries(locale);

  const clubItems = new Map<
    string,
    { item: Item; availability: { total: number; available: number } }[]
  >();
  if (clubs.length > 0) {
    await Promise.all(
      clubs.map(async (club) => {
        const items = await listItems({ custodianId: club.id });
        const withAvailability = await Promise.all(
          items.map(async (item) => ({
            item,
            availability: await getItemAvailabilitySummary(item),
          }))
        );
        clubItems.set(club.id, withAvailability);
      })
    );
  }

  const infoServicesLabel = dict.nav.find((n) => n.href === "/services")!.label;
  const equipmentLoanLabel = locale === "th" ? "บริการยืมอุปกรณ์" : "Equipment loan service";

  const breadcrumbs = (
    <Breadcrumbs
      locale={locale}
      label={dict.a11y.breadcrumb}
      items={[
        { label: dict.site.name, href: "/" },
        { label: infoServicesLabel, href: "/services" },
        { label: equipmentLoanLabel, href: "/services/equipment-loan" },
        { label: t.title },
      ]}
    />
  );

  if (!configured || clubs.length === 0) {
    return (
      <>
        <PageHeader title={t.title} lede={t.lede} breadcrumbs={breadcrumbs} />
        <div className="wrap flex flex-col gap-6 py-10">
          <Notice variant="info" title={!configured ? t.notConfiguredTitle : t.noClubsTitle}>
            <p>
              {!configured ? t.notConfiguredBody : t.noClubsBody}{" "}
              {!configured ? (
                <>
                  <a
                    href={localeHref(locale, "/contact")}
                    className="font-semibold text-brand-deep underline hover:text-brand-dark"
                  >
                    {t.contactLink}
                  </a>
                  .
                </>
              ) : null}
            </p>
          </Notice>
          <a
            href={localeHref(locale, "/services/equipment-loan")}
            className="w-fit text-sm font-semibold text-brand-deep hover:underline"
          >
            &larr; {t.backCta}
          </a>
        </div>
      </>
    );
  }

  function renderContact(club: Custodian) {
    const hasContact = club.contactEmail || club.contactInstagram || club.contactOther;
    if (!hasContact && !club.borrowNote[locale]) return null;
    return (
      <div className="flex flex-col gap-2 text-sm">
        {club.borrowNote[locale] ? (
          <p className="leading-relaxed text-muted">{club.borrowNote[locale]}</p>
        ) : null}
        {hasContact ? (
          <dl className="flex flex-col gap-1">
            {club.contactName[locale] ? (
              <div className="flex flex-wrap items-baseline gap-1">
                <dt className="font-semibold text-ink">{t.contactHeading}:</dt>
                <dd className="text-muted">{club.contactName[locale]}</dd>
              </div>
            ) : null}
            {club.contactEmail ? (
              <div className="flex flex-wrap items-baseline gap-1">
                <dt className="font-semibold text-ink">Email:</dt>
                <dd>
                  <Email
                    address={club.contactEmail}
                    className="font-semibold text-brand-deep underline hover:text-brand-dark"
                  />
                </dd>
              </div>
            ) : null}
            {club.contactInstagram ? (
              <div className="flex flex-wrap items-baseline gap-1">
                <dt className="font-semibold text-ink">{t.instagramLabel}:</dt>
                <dd>
                  <ExternalLink
                    href={instagramHref(club.contactInstagram)}
                    newTabLabel={dict.a11y.newTab}
                    className="font-semibold text-brand-deep underline hover:text-brand-dark"
                  >
                    {club.contactInstagram}
                  </ExternalLink>
                </dd>
              </div>
            ) : null}
            {club.contactOther ? (
              <div className="flex flex-wrap items-baseline gap-1">
                <dt className="font-semibold text-ink">{t.contactHeading}:</dt>
                <dd className="text-muted">{club.contactOther}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <PageHeader title={t.title} lede={t.lede} breadcrumbs={breadcrumbs} />
      <div className="wrap flex flex-col gap-10 py-10">
        <nav aria-label={t.jumpNavLabel} className="rounded-lg border border-line bg-sunken p-6">
          <p className="mb-2 text-sm font-semibold tracking-wide text-muted uppercase">
            {t.jumpNavLabel}
          </p>
          <ul className="flex flex-wrap gap-2">
            {clubs.map((club) => (
              <li key={club.id}>
                <a
                  href={`#${club.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-line bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:bg-cream"
                >
                  {club.name[locale]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-10">
          {clubs.map((club) => {
            const items = clubItems.get(club.id) ?? [];
            const contact = renderContact(club);
            // Club slugs and custodian slugs are independent data sources;
            // this link only appears when a club has explicitly opted in by
            // setting `custodian` in its MDX frontmatter to match this custodian.
            const linkedClub = clubsContent.find((c) => c.frontmatter.custodian === club.slug);
            return (
              <section
                key={club.id}
                id={club.slug}
                aria-labelledby={`${club.slug}-heading`}
                className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-6 sm:p-8"
              >
                <h2 id={`${club.slug}-heading`} className="font-display text-2xl">
                  {club.name[locale]}
                </h2>

                {items.length > 0 ? (
                  <div>
                    <p className="mb-2 text-sm font-semibold tracking-wide text-muted uppercase">
                      {t.itemsHeading}
                    </p>
                    <ul className="flex flex-col gap-3">
                      {items.map(({ item, availability }) => {
                        const isAvailable = availability.available > 0;
                        return (
                          <li
                            key={item.id}
                            className="border-t border-line pt-3 first:border-t-0 first:pt-0"
                          >
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <span className="font-semibold text-ink">{item.name[locale]}</span>
                              <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                                {isAvailable ? <AvailableIcon /> : <UnavailableIcon />}
                                <span className={isAvailable ? "text-success" : "text-error"}>
                                  {isAvailable ? t.availableHint : t.unavailableHint}
                                </span>
                              </span>
                            </div>
                            {item.description[locale] ? (
                              <p className="mt-1 text-sm leading-relaxed text-muted">
                                {item.description[locale]}
                              </p>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-muted">{t.noItemsLine}</p>
                )}

                {contact}

                {linkedClub ? (
                  <a
                    href={localeHref(locale, `/clubs/${linkedClub.slug}`)}
                    className="w-fit text-sm font-semibold text-brand-deep hover:underline"
                  >
                    {t.clubPageCta} &rarr;
                  </a>
                ) : null}
              </section>
            );
          })}
        </div>

        <a
          href={localeHref(locale, "/services/equipment-loan")}
          className="w-fit text-sm font-semibold text-brand-deep hover:underline"
        >
          &larr; {t.backCta}
        </a>
      </div>
    </>
  );
}
