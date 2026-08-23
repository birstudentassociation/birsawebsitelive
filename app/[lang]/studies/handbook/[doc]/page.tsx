import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, locales, formatDate, type Locale } from "@/lib/i18n";
import { getGuideEntries, getGuideEntry } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Mdx } from "@/lib/mdx";
import { extractH2Toc } from "@/lib/toc";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import { Heading, Text } from "@/components/bds/Type";

/**
 * `/studies/handbook/[doc]` (ROUTE-MAP-2.0 "Wave 5D").
 *
 * Renders through `lib/mdx.tsx`'s `Mdx`, the pipeline every other 2.0 MDX
 * route in this wave's sibling waves already reuses (e.g.
 * `app/[lang]/whats-on/news/[slug]/page.tsx`), rather than a second
 * hand-rolled renderer: same headings, tables, links and accessibility
 * handling everywhere MDX appears on the site. `dict.a11y.table` names the
 * wide-table scroll region exactly as `Table` (`components/bds/Table.tsx`)
 * does elsewhere in this wave.
 */

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getGuideEntries(lang, "handbook").map((entry) => ({ lang, doc: entry.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; doc: string }>;
}): Promise<Metadata> {
  const { lang, doc: slug } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const entry = getGuideEntry(locale, "handbook", slug);
  if (!entry) return {};
  return buildMetadata({
    locale,
    title: entry.frontmatter.title,
    description: entry.frontmatter.summary,
    path: `/studies/handbook/${slug}`,
  });
}

export default async function HandbookDocPage({
  params,
}: {
  params: Promise<{ lang: string; doc: string }>;
}) {
  const { lang, doc: slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.handbookDoc;
  const indexTitle = dict.handbookIndex.title;
  const familyLabel = dict.studiesIndex.title;

  const entry = getGuideEntry(locale, "handbook", slug);
  if (!entry) notFound();

  const allEntries = getGuideEntries(locale, "handbook");
  const currentIndex = allEntries.findIndex((e) => e.slug === slug);
  const prevEntry = currentIndex > 0 ? allEntries[currentIndex - 1] : null;
  const nextEntry =
    currentIndex >= 0 && currentIndex < allEntries.length - 1 ? allEntries[currentIndex + 1] : null;

  const toc = extractH2Toc(entry.content);

  return (
    <>
      <PageHeader
        title={entry.frontmatter.title}
        lede={entry.frontmatter.summary}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: familyLabel, href: "/studies" },
              { label: indexTitle, href: "/studies/handbook" },
              { label: entry.frontmatter.title },
            ]}
          />
        }
        helpSlot={
          <Button href={localeHref(locale, "/help")} variant="ghost">
            {dict.actions.getHelp}
          </Button>
        }
      />
      <div className="wrap flex flex-col gap-8 py-10">
        {toc.length >= 2 ? (
          <nav aria-label={t.onThisPage} className="rounded-lg border border-line bg-sunken p-5">
            <Heading level={2} step="body-sm" className="tracking-wide text-muted uppercase">
              {t.onThisPage}
            </Heading>
            <ul className="mt-3 flex flex-col gap-2">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="focus-halo text-brand-deep underline underline-offset-2 hover:text-brand-dark"
                  >
                    <Text as="span" step="body-sm">
                      {item.label}
                    </Text>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <Text step="body-sm" className="text-muted">
          {t.updatedLabel} {formatDate(locale, entry.frontmatter.updated)}
        </Text>

        <Mdx
          source={entry.content}
          newTabLabel={dict.a11y.newTab}
          tableRegionLabel={dict.a11y.table}
          locale={locale}
        />

        {prevEntry || nextEntry ? (
          <nav
            aria-label={t.prevNextNav}
            className="grid grid-cols-1 gap-4 border-t border-line pt-8 sm:grid-cols-2"
          >
            <div>
              {prevEntry ? (
                <Link
                  href={localeHref(locale, `/studies/handbook/${prevEntry.slug}`)}
                  className="focus-halo flex h-full flex-col gap-1 rounded-lg border border-line bg-surface p-4 hover:border-brand"
                >
                  <Text as="span" step="body-sm" className="font-semibold text-muted uppercase">
                    &larr; {t.previous}
                  </Text>
                  <Text as="span" step="body" className="font-semibold text-ink">
                    {prevEntry.frontmatter.title}
                  </Text>
                </Link>
              ) : null}
            </div>
            <div>
              {nextEntry ? (
                <Link
                  href={localeHref(locale, `/studies/handbook/${nextEntry.slug}`)}
                  className="focus-halo flex h-full flex-col gap-1 rounded-lg border border-line bg-surface p-4 text-right hover:border-brand"
                >
                  <Text as="span" step="body-sm" className="font-semibold text-muted uppercase">
                    {t.next} &rarr;
                  </Text>
                  <Text as="span" step="body" className="font-semibold text-ink">
                    {nextEntry.frontmatter.title}
                  </Text>
                </Link>
              ) : null}
            </div>
          </nav>
        ) : null}

        <Link
          href={localeHref(locale, "/studies/handbook")}
          className="focus-halo font-semibold text-brand-deep underline underline-offset-2"
        >
          <Text as="span" step="body">
            &larr; {t.backToHandbook}
          </Text>
        </Link>
      </div>
    </>
  );
}
