import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, locales, localeHref, formatDate, type Locale } from "@/lib/i18n";
import { getEntries, getEntry } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Mdx } from "@/lib/mdx";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import ExternalLink from "@/components/bds/ExternalLink";
import Tag from "@/components/bds/Tag";
import { Heading, Text } from "@/components/bds/Type";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getEntries("news", lang).map((entry) => ({ lang, slug: entry.slug }))
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  const entry = getEntry("news", lang, slug);
  if (!entry) return {};
  return buildMetadata({
    locale: lang,
    title: `${entry.frontmatter.title}: ${dict.site.name}`,
    description: entry.frontmatter.summary,
    path: `/whats-on/news/${slug}`,
  });
}

export default async function WhatsOnNewsArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const entry = getEntry("news", locale, slug);
  if (!entry) notFound();

  const { frontmatter, content } = entry;
  const isEvent = frontmatter.type === "event";

  return (
    <>
      <PageHeader
        title={frontmatter.title}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: dict.whatson.hub.title, href: "/whats-on" },
              { label: dict.whatson.news.title, href: "/whats-on/news" },
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
      <div className="wrap py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Tag variant={isEvent ? "brand" : "neutral"}>
            {isEvent ? dict.meta.event : dict.meta.news}
          </Tag>
          <Text as="span" step="body-sm" className="text-muted">
            {dict.meta.published} {formatDate(locale, frontmatter.date)}
          </Text>
        </div>

        {isEvent && (frontmatter.start || frontmatter.location) ? (
          <dl className="mb-8 grid max-w-[var(--measure)] gap-3 rounded-lg border border-line bg-sunken p-5 sm:grid-cols-2">
            {frontmatter.start ? (
              <div>
                <Text as="dt" step="body-sm" className="font-semibold text-muted">
                  {dict.meta.when}
                </Text>
                <Text as="dd" step="body" className="text-ink">
                  {formatDate(locale, frontmatter.start)}
                </Text>
              </div>
            ) : null}
            {frontmatter.location ? (
              <div>
                <Text as="dt" step="body-sm" className="font-semibold text-muted">
                  {dict.meta.where}
                </Text>
                <Text as="dd" step="body" className="text-ink">
                  {frontmatter.location}
                </Text>
              </div>
            ) : null}
          </dl>
        ) : null}

        <Mdx
          source={content}
          newTabLabel={dict.a11y.newTab}
          tableRegionLabel={dict.a11y.table}
          locale={locale}
        />

        {frontmatter.links && frontmatter.links.length > 0 ? (
          <div className="mt-8 max-w-[var(--measure)]">
            <Heading level={2} step="heading-2" className="mb-3">
              {dict.whatson.article.detailsHeading}
            </Heading>
            <ul className="flex flex-col gap-2">
              {frontmatter.links.map((link) => (
                <li key={link.href}>
                  <ExternalLink
                    href={link.href}
                    newTabLabel={dict.a11y.newTab}
                    className="font-semibold text-brand-deep"
                  >
                    {link.label}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="mt-10">
          <a
            href={localeHref(locale, "/whats-on/news")}
            className="font-semibold text-brand-deep hover:underline"
          >
            <Text as="span" step="body">
              &larr; {dict.whatson.article.backToNews}
            </Text>
          </a>
        </p>
      </div>
    </>
  );
}
