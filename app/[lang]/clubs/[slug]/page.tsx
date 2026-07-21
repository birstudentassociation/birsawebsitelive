import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Tag from "@/components/Tag";
import ExternalLink from "@/components/ExternalLink";
import Email from "@/components/Email";
import { clubCategories, clubs, getClub } from "@/content/clubs/clubs";

export function generateStaticParams() {
  return locales.flatMap((lang) => clubs.map((club) => ({ lang, slug: club.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const club = getClub(slug);
  if (!club) return {};
  const content = club[locale];

  return buildMetadata({
    locale,
    title: content.name,
    description: content.tagline,
    path: `/clubs/${slug}`,
  });
}

const labels: Record<
  Locale,
  {
    clubs: string;
    meets: string;
    lead: string;
    howToJoin: string;
    contact: string;
    back: string;
    openToJoin: string;
    equipment: string;
    equipmentCta: string;
  }
> = {
  en: {
    clubs: "Clubs",
    meets: "Meets",
    lead: "Lead",
    howToJoin: "How to join",
    contact: "Contact",
    back: "Back to clubs",
    openToJoin: "Open to join",
    equipment: "Equipment",
    equipmentCta: "See what this club lends out",
  },
  th: {
    clubs: "ชมรม",
    meets: "นัดพบ",
    lead: "ผู้นำชมรม",
    howToJoin: "วิธีเข้าร่วม",
    contact: "ติดต่อ",
    back: "กลับไปหน้าชมรมทั้งหมด",
    openToJoin: "รับสมาชิกอยู่",
    equipment: "อุปกรณ์",
    equipmentCta: "ดูอุปกรณ์ที่ชมรมนี้ให้ยืม",
  },
};

export default async function ClubDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const club = getClub(slug);
  if (!club) notFound();

  const content = club[locale];
  const t = labels[locale];

  return (
    <>
      <PageHeader
        title={content.name}
        lede={content.tagline}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: t.clubs, href: "/clubs" },
              { label: content.name },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-8 py-10">
        <div className="flex flex-wrap items-center gap-2">
          <Tag>{clubCategories[club.category][locale]}</Tag>
          {club.join.open ? <Tag variant="forest">{t.openToJoin}</Tag> : null}
        </div>

        <div className="prose">
          {content.description.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <dl className="border-line grid grid-cols-1 gap-6 border-t pt-6 sm:grid-cols-2">
          {content.meets ? (
            <div>
              <dt className="text-ink text-sm font-semibold">{t.meets}</dt>
              <dd className="text-muted mt-1 text-sm">{content.meets}</dd>
            </div>
          ) : null}
          {content.lead ? (
            <div>
              <dt className="text-ink text-sm font-semibold">{t.lead}</dt>
              <dd className="text-muted mt-1 text-sm">{content.lead}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-ink text-sm font-semibold">{t.howToJoin}</dt>
            <dd className="text-muted mt-1 text-sm">{content.howToJoin}</dd>
          </div>
          {club.custodianSlug ? (
            <div>
              <dt className="text-ink text-sm font-semibold">{t.equipment}</dt>
              <dd className="mt-1 text-sm">
                <Link
                  href={localeHref(
                    locale,
                    `/information-services/equipment-loan/directory#${club.custodianSlug}`
                  )}
                  className="text-brand-deep hover:text-brand-dark font-semibold underline"
                >
                  {t.equipmentCta}
                </Link>
              </dd>
            </div>
          ) : null}
          {club.email || club.instagram ? (
            <div>
              <dt className="text-ink text-sm font-semibold">{t.contact}</dt>
              <dd className="mt-1 flex flex-col gap-1 text-sm">
                {club.email ? (
                  <Email address={club.email} className="text-brand-deep hover:text-brand-dark" />
                ) : null}
                {club.instagram ? (
                  <ExternalLink href={club.instagram} newTabLabel={dict.a11y.newTab}>
                    Instagram
                  </ExternalLink>
                ) : null}
              </dd>
            </div>
          ) : null}
        </dl>

        <Link
          href={localeHref(locale, "/clubs")}
          className="text-brand-deep hover:text-brand-dark text-sm font-semibold"
        >
          &larr; {t.back}
        </Link>
      </div>
    </>
  );
}
