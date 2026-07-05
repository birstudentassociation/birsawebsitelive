import { getDictionary, isLocale, locales, localeHref, formatDate, type Locale } from "@/lib/i18n";
import { getEntries, getEntry } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Tag from "@/components/Tag";
import ExternalLink from "@/components/ExternalLink";
import { Mdx } from "@/lib/mdx";

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
    title: `${entry.frontmatter.title} — ${dict.site.name}`,
    description: entry.frontmatter.summary,
    path: `/news/${slug}`,
  });
}

const newsLabel = { en: "What's on", th: "ข่าวและกิจกรรม" };
const backLabel = { en: "Back to what's on", th: "กลับไปหน้าข่าวและกิจกรรม" };
const detailsLabel = { en: "Details", th: "รายละเอียด" };

export default async function NewsDetailPage({
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
              { label: newsLabel[locale], href: "/news" },
              { label: frontmatter.title },
            ]}
          />
        }
      />
      <div className="wrap py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Tag variant={isEvent ? "brand" : "neutral"}>{isEvent ? dict.meta.event : dict.meta.news}</Tag>
          <span className="text-muted text-sm">
            {dict.meta.published} {formatDate(locale, frontmatter.date)}
          </span>
        </div>

        {isEvent && (frontmatter.start || frontmatter.location) ? (
          <dl className="border-line bg-sunken mb-8 grid max-w-[var(--measure)] gap-3 rounded-lg border p-5 sm:grid-cols-2">
            {frontmatter.start ? (
              <div>
                <dt className="text-muted text-sm font-semibold">{dict.meta.when}</dt>
                <dd className="text-ink">{formatDate(locale, frontmatter.start)}</dd>
              </div>
            ) : null}
            {frontmatter.location ? (
              <div>
                <dt className="text-muted text-sm font-semibold">{dict.meta.where}</dt>
                <dd className="text-ink">{frontmatter.location}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        <Mdx source={content} newTabLabel={dict.a11y.newTab} />

        {frontmatter.links && frontmatter.links.length > 0 ? (
          <div className="mt-8 max-w-[var(--measure)]">
            <h2 className="font-display mb-3 text-xl">{detailsLabel[locale]}</h2>
            <ul className="flex flex-col gap-2">
              {frontmatter.links.map((link) => (
                <li key={link.href}>
                  <ExternalLink href={link.href} newTabLabel={dict.a11y.newTab} className="text-brand-deep font-semibold">
                    {link.label}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="mt-10">
          <a href={localeHref(locale, "/news")} className="text-brand-deep font-semibold hover:underline">
            &larr; {backLabel[locale]}
          </a>
        </p>
      </div>
    </>
  );
}
