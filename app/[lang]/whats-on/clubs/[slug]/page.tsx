import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, locales, localeHref, type Locale } from "@/lib/i18n";
import { getClubEntries, getClubEntry } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Mdx } from "@/lib/mdx";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import ExternalLink from "@/components/bds/ExternalLink";
import Email from "@/components/bds/Email";
import Tag from "@/components/bds/Tag";
import { Text } from "@/components/bds/Type";
import { clubCategories } from "@/content/clubs/clubs";

/**
 * `/whats-on/clubs/[slug]` (Wave 5, REDESIGN-2.0 SS3.2, SS3.6).
 *
 * A single BIR club. Rebuilt from `app/[lang]/clubs/[slug]/page.tsx` (1.0,
 * not owned by this wave and not edited) on the bds `Type`/`Tag`/`Button`
 * components rather than raw Tailwind font-size utilities.
 */
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
  const dict = getDictionary(locale);

  return buildMetadata({
    locale,
    title: `${entry.frontmatter.title}: ${dict.site.name}`,
    description: entry.frontmatter.tagline,
    path: `/whats-on/clubs/${slug}`,
  });
}

export default async function WhatsOnClubDetailPage({
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
  const t = dict.whatson.clubDetail;
  const tClubs = dict.whatson.clubs;

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
              { label: dict.whatson.hub.title, href: "/whats-on" },
              { label: t.clubsLabel, href: "/whats-on/clubs" },
              { label: frontmatter.title },
            ]}
          />
        }
        helpSlot={
          <Button href={localeHref(locale, "/contact")} variant="ghost">
            {dict.actions.contactUs}
          </Button>
        }
      />
      <div className="wrap flex flex-col gap-8 py-10">
        <div className="flex flex-wrap items-center gap-2">
          <Tag>{clubCategories[frontmatter.category][locale]}</Tag>
          {frontmatter.joinOpen ? <Tag variant="success">{tClubs.openToJoin}</Tag> : null}
        </div>

        <Mdx
          source={entry.content}
          newTabLabel={dict.a11y.newTab}
          tableRegionLabel={dict.a11y.table}
          locale={locale}
        />

        <dl className="grid grid-cols-1 gap-6 border-t border-line pt-6 sm:grid-cols-2">
          {frontmatter.meets ? (
            <div>
              <Text as="dt" step="body-sm" className="font-semibold text-ink">
                {t.meets}
              </Text>
              <Text as="dd" step="body-sm" className="mt-1 text-muted">
                {frontmatter.meets}
              </Text>
            </div>
          ) : null}
          {frontmatter.where ? (
            <div>
              <Text as="dt" step="body-sm" className="font-semibold text-ink">
                {t.where}
              </Text>
              <Text as="dd" step="body-sm" className="mt-1 text-muted">
                {frontmatter.where}
              </Text>
            </div>
          ) : null}
          {frontmatter.lead ? (
            <div>
              <Text as="dt" step="body-sm" className="font-semibold text-ink">
                {t.lead}
              </Text>
              <Text as="dd" step="body-sm" className="mt-1 text-muted">
                {frontmatter.lead}
              </Text>
            </div>
          ) : null}
          {frontmatter.custodian ? (
            <div>
              <Text as="dt" step="body-sm" className="font-semibold text-ink">
                {t.equipment}
              </Text>
              <Text as="dd" step="body-sm" className="mt-1">
                <a
                  href={localeHref(
                    locale,
                    `/services/equipment-loan/directory#${frontmatter.custodian}`
                  )}
                  className="font-semibold text-brand-deep underline hover:text-brand-dark"
                >
                  {t.equipmentCta}
                </a>
              </Text>
            </div>
          ) : null}
          {frontmatter.links && frontmatter.links.length > 0 ? (
            <div>
              <Text as="dt" step="body-sm" className="font-semibold text-ink">
                {t.contact}
              </Text>
              <Text as="dd" step="body-sm" className="mt-1 flex flex-col gap-1">
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
              </Text>
            </div>
          ) : null}
        </dl>

        <p>
          <a
            href={localeHref(locale, "/whats-on/clubs")}
            className="font-semibold text-brand-deep hover:underline"
          >
            <Text as="span" step="body">
              &larr; {t.back}
            </Text>
          </a>
        </p>
      </div>
    </>
  );
}
