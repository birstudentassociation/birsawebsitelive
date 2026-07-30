import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { getClubEntries, getClubEntry } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Mdx } from "@/lib/mdx";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Tag from "@/components/Tag";
import ExternalLink from "@/components/ExternalLink";
import Email from "@/components/Email";
import { clubCategories } from "@/content/clubs/clubs";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getClubEntries(lang).map((entry) => ({ lang, slug: entry.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const entry = getClubEntry(locale, slug);
  if (!entry) return {};

  return buildMetadata({
    locale,
    title: entry.frontmatter.title,
    description: entry.frontmatter.tagline,
    path: `/clubs/${slug}`,
  });
}

const labels: Record<
  Locale,
  {
    clubs: string;
    meets: string;
    where: string;
    lead: string;
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
    where: "Where",
    lead: "Lead",
    contact: "Contact",
    back: "Back to clubs",
    openToJoin: "Open to join",
    equipment: "Equipment",
    equipmentCta: "See what this club lends out",
  },
  th: {
    clubs: "ชมรม",
    meets: "นัดพบ",
    where: "สถานที่",
    lead: "ผู้นำชมรม",
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
  const entry = getClubEntry(locale, slug);
  if (!entry) notFound();

  const { frontmatter } = entry;
  const t = labels[locale];

  return (
    <>
      <PageHeader
        title={frontmatter.title}
        lede={frontmatter.tagline}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: t.clubs, href: "/clubs" },
              { label: frontmatter.title },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-8 py-10">
        <div className="flex flex-wrap items-center gap-2">
          <Tag>{clubCategories[frontmatter.category][locale]}</Tag>
          {frontmatter.joinOpen ? <Tag variant="forest">{t.openToJoin}</Tag> : null}
        </div>

        <Mdx
          source={entry.content}
          newTabLabel={dict.a11y.newTab}
          tableRegionLabel={dict.a11y.table}
          locale={locale}
        />

        <dl className="border-line grid grid-cols-1 gap-6 border-t pt-6 sm:grid-cols-2">
          {frontmatter.meets ? (
            <div>
              <dt className="text-ink text-sm font-semibold">{t.meets}</dt>
              <dd className="text-muted mt-1 text-sm">{frontmatter.meets}</dd>
            </div>
          ) : null}
          {frontmatter.where ? (
            <div>
              <dt className="text-ink text-sm font-semibold">{t.where}</dt>
              <dd className="text-muted mt-1 text-sm">{frontmatter.where}</dd>
            </div>
          ) : null}
          {frontmatter.lead ? (
            <div>
              <dt className="text-ink text-sm font-semibold">{t.lead}</dt>
              <dd className="text-muted mt-1 text-sm">{frontmatter.lead}</dd>
            </div>
          ) : null}
          {frontmatter.custodian ? (
            <div>
              <dt className="text-ink text-sm font-semibold">{t.equipment}</dt>
              <dd className="mt-1 text-sm">
                <Link
                  href={localeHref(
                    locale,
                    `/services/equipment-loan/directory#${frontmatter.custodian}`
                  )}
                  className="text-brand-deep hover:text-brand-dark font-semibold underline"
                >
                  {t.equipmentCta}
                </Link>
              </dd>
            </div>
          ) : null}
          {frontmatter.links && frontmatter.links.length > 0 ? (
            <div>
              <dt className="text-ink text-sm font-semibold">{t.contact}</dt>
              <dd className="mt-1 flex flex-col gap-1 text-sm">
                {frontmatter.links.map((link) =>
                  link.href.startsWith("mailto:") ? (
                    <Email
                      key={link.href}
                      address={link.href.slice("mailto:".length)}
                      className="text-brand-deep hover:text-brand-dark"
                    />
                  ) : (
                    <ExternalLink key={link.href} href={link.href} newTabLabel={dict.a11y.newTab}>
                      {link.label}
                    </ExternalLink>
                  )
                )}
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
