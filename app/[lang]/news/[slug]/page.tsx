import { getDictionary, isLocale, locales, localeHref, formatDate, type Locale } from "@/lib/i18n";
import { getEntries, getEntry, isArchivedEvent, isPastEvent } from "@/lib/content";
import { buildMetadata, fitDescription } from "@/lib/seo";
import { newsJsonLd } from "@/lib/structured-data";
import JsonLd from "@/components/JsonLd";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Tag from "@/components/Tag";
import ExternalLink from "@/components/ExternalLink";
import Notice from "@/components/Notice";
import { Mdx } from "@/lib/mdx";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getEntries("news", lang).map((entry) => ({ lang, slug: entry.slug }))
  );
}

export const dynamicParams = false;

/** Regenerated at least daily so an event is marked as past, then dropped from search, on time. */
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const entry = getEntry("news", lang, slug);
  if (!entry) return {};
  const metadata = buildMetadata({
    locale: lang,
    title: entry.frontmatter.title,
    description: entry.frontmatter.metaDescription ?? entry.frontmatter.summary,
    path: `/news/${slug}`,
    article: { publishedTime: entry.frontmatter.date, section: newsLabel[lang] },
  });
  return isArchivedEvent(entry.frontmatter)
    ? { ...metadata, robots: { index: false, follow: true } }
    : metadata;
}

const newsLabel = { en: "What's on", th: "ข่าวและกิจกรรม" };
const backLabel = { en: "Back to what's on", th: "กลับไปหน้าข่าวและกิจกรรม" };
const detailsLabel = { en: "Details", th: "รายละเอียด" };
const pastEvent = {
  en: {
    title: "This event has ended",
    before: "See what is coming up in the ",
    link: "BIR activity calendar",
    after: ".",
  },
  th: {
    title: "กิจกรรมนี้จบไปแล้ว",
    before: "ดูกิจกรรมที่กำลังจะมาถึงได้ใน",
    link: "ปฏิทินกิจกรรม BIR",
    after: "",
  },
};

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
      <JsonLd
        data={newsJsonLd(
          locale,
          slug,
          frontmatter,
          fitDescription(frontmatter.metaDescription ?? frontmatter.summary)
        )}
      />
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
          <Tag variant={isEvent ? "brand" : "neutral"}>
            {isEvent ? dict.meta.event : dict.meta.news}
          </Tag>
          <span className="text-sm text-muted">
            {dict.meta.published} {formatDate(locale, frontmatter.date)}
          </span>
        </div>

        {isPastEvent(frontmatter) ? (
          <Notice title={pastEvent[locale].title} className="mb-8 max-w-[var(--measure)]">
            {pastEvent[locale].before}
            <a
              href={localeHref(locale, "/news/activity-calendar")}
              className="font-semibold text-brand-deep underline"
            >
              {pastEvent[locale].link}
            </a>
            {pastEvent[locale].after}
          </Notice>
        ) : null}

        {isEvent && (frontmatter.start || frontmatter.location) ? (
          <dl className="mb-8 grid max-w-[var(--measure)] gap-3 rounded-lg border border-line bg-sunken p-5 sm:grid-cols-2">
            {frontmatter.start ? (
              <div>
                <dt className="text-sm font-semibold text-muted">{dict.meta.when}</dt>
                <dd className="text-ink">{formatDate(locale, frontmatter.start)}</dd>
              </div>
            ) : null}
            {frontmatter.location ? (
              <div>
                <dt className="text-sm font-semibold text-muted">{dict.meta.where}</dt>
                <dd className="text-ink">{frontmatter.location}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        <Mdx source={content} newTabLabel={dict.a11y.newTab} locale={locale} />

        {frontmatter.links && frontmatter.links.length > 0 ? (
          <div className="mt-8 max-w-[var(--measure)]">
            <h2 className="mb-3 font-display text-xl">{detailsLabel[locale]}</h2>
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
            href={localeHref(locale, "/news")}
            className="font-semibold text-brand-deep hover:underline"
          >
            &larr; {backLabel[locale]}
          </a>
        </p>
      </div>
    </>
  );
}
