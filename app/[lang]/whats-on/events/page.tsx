import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { getEntries } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import Pagination from "@/components/bds/Pagination";
import { Text } from "@/components/bds/Type";
import NewsCard from "@/components/whatson/NewsCard";

const PAGE_SIZE = 9;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return buildMetadata({
    locale: lang,
    title: `${dict.whatson.events.title}: ${dict.site.name}`,
    description: dict.whatson.events.lede,
    path: "/whats-on/events",
  });
}

/**
 * `/whats-on/events` (Wave 5, REDESIGN-2.0 §3.2): the events-only cut of the
 * same `content/news` entries `/whats-on/news` lists, for a reader who wants
 * only the things they can go along to. Uses `NewsCard`/`Pagination` exactly
 * as `/whats-on/news` does, so the two never drift in behaviour.
 */
export default async function WhatsOnEventsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.whatson.events;
  const { page: pageParam } = await searchParams;

  const events = getEntries("news", locale).filter((entry) => entry.frontmatter.type === "event");

  const totalPages = Math.max(1, Math.ceil(events.length / PAGE_SIZE));
  const requestedPage = Number(pageParam);
  const currentPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(Math.trunc(requestedPage), 1), totalPages)
    : 1;
  const pageEntries = events.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function hrefForPage(targetPage: number) {
    return targetPage > 1 ? `/whats-on/events?page=${targetPage}` : "/whats-on/events";
  }

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
              { label: dict.whatson.hub.title, href: "/whats-on" },
              { label: t.title },
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
        {pageEntries.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pageEntries.map((entry) => (
              <NewsCard
                key={entry.slug}
                locale={locale}
                slug={entry.slug}
                frontmatter={entry.frontmatter}
                labels={{
                  event: dict.meta.event,
                  news: dict.meta.news,
                  when: dict.meta.when,
                  where: dict.meta.where,
                }}
                headingLevel={2}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-start gap-3">
            <Text step="body" className="text-muted">
              {t.empty}
            </Text>
            <Button href={localeHref(locale, "/whats-on/news")} variant="secondary">
              {t.seeNews}
            </Button>
          </div>
        )}

        {totalPages > 1 ? (
          <Pagination
            locale={locale}
            currentPage={currentPage}
            totalPages={totalPages}
            hrefFor={hrefForPage}
            ariaLabel={dict.a11y.paginationNav}
            previousLabel={dict.a11y.paginationPrevious}
            nextLabel={dict.a11y.paginationNext}
            pageLabelTemplate={dict.a11y.paginationPage}
            previousPageLabelTemplate={dict.a11y.paginationPreviousPage}
            nextPageLabelTemplate={dict.a11y.paginationNextPage}
            currentPageLabel={dict.a11y.currentPage}
            className="mt-10"
          />
        ) : null}
      </div>
    </>
  );
}
