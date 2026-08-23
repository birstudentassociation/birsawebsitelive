import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { getEntries } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import Pagination from "@/components/bds/Pagination";
import ExternalLink from "@/components/bds/ExternalLink";
import { Text } from "@/components/bds/Type";
import NewsCard from "@/components/whatson/NewsCard";
import { socials } from "@/content/site";

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
    title: `${dict.whatson.news.title}: ${dict.site.name}`,
    description: dict.whatson.news.lede,
    path: "/whats-on/news",
  });
}

export default async function WhatsOnNewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ type?: string; category?: string; page?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.whatson.news;
  const { type, category, page: pageParam } = await searchParams;

  const allEntries = getEntries("news", locale);
  const categories = Array.from(new Set(allEntries.map((e) => e.frontmatter.category))).sort();

  const filtered = allEntries.filter((entry) => {
    if (type && entry.frontmatter.type !== type) return false;
    if (category && entry.frontmatter.category !== category) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const requestedPage = Number(pageParam);
  const currentPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(Math.trunc(requestedPage), 1), totalPages)
    : 1;
  const pageEntries = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const hasFilter = Boolean(type || category);

  function buildFilterHref(next: { type?: string; category?: string }) {
    const params = new URLSearchParams();
    const nextType = "type" in next ? next.type : type;
    const nextCategory = "category" in next ? next.category : category;
    if (nextType) params.set("type", nextType);
    if (nextCategory) params.set("category", nextCategory);
    const qs = params.toString();
    return "/whats-on/news" + (qs ? `?${qs}` : "");
  }

  function hrefForPage(targetPage: number) {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (category) params.set("category", category);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return "/whats-on/news" + (qs ? `?${qs}` : "");
  }

  const instagram = socials.find((s) => s.id === "instagram")!;
  const facebook = socials.find((s) => s.id === "facebook")!;

  const filterTagBase = "inline-flex min-h-11 items-center rounded-full border px-4 transition-colors";
  const filterTagInactive = "border-line bg-surface text-ink hover:bg-sunken";
  const filterTagActive = "border-brand bg-brand text-white";

  return (
    <>
      <PageHeader
        title={t.title}
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
        <Text step="body" className="mb-8 max-w-[var(--measure)] text-muted">
          {t.followUsPrefix}{" "}
          <ExternalLink
            href={instagram.href}
            newTabLabel={dict.a11y.newTab}
            className="font-semibold text-brand-deep"
          >
            Instagram
          </ExternalLink>{" "}
          {t.and}{" "}
          <ExternalLink
            href={facebook.href}
            newTabLabel={dict.a11y.newTab}
            className="font-semibold text-brand-deep"
          >
            Facebook
          </ExternalLink>
          .
        </Text>

        <nav aria-label={t.filterNav} className="mb-6 flex flex-col gap-4">
          <div>
            <Text step="body-sm" className="mb-2 font-semibold text-muted uppercase">
              {t.typeLabel}
            </Text>
            <ul className="flex flex-wrap gap-2">
              <li>
                <a
                  href={localeHref(locale, buildFilterHref({ type: undefined }))}
                  aria-current={!type ? "true" : undefined}
                  className={`${filterTagBase} ${!type ? filterTagActive : filterTagInactive}`}
                >
                  <Text as="span" step="body-sm" className="font-semibold">
                    {t.allTypes}
                  </Text>
                </a>
              </li>
              <li>
                <a
                  href={localeHref(locale, buildFilterHref({ type: "news" }))}
                  aria-current={type === "news" ? "true" : undefined}
                  className={`${filterTagBase} ${type === "news" ? filterTagActive : filterTagInactive}`}
                >
                  <Text as="span" step="body-sm" className="font-semibold">
                    {t.newsType}
                  </Text>
                </a>
              </li>
              <li>
                <a
                  href={localeHref(locale, buildFilterHref({ type: "event" }))}
                  aria-current={type === "event" ? "true" : undefined}
                  className={`${filterTagBase} ${type === "event" ? filterTagActive : filterTagInactive}`}
                >
                  <Text as="span" step="body-sm" className="font-semibold">
                    {t.eventType}
                  </Text>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <Text step="body-sm" className="mb-2 font-semibold text-muted uppercase">
              {t.categoryLabel}
            </Text>
            <ul className="flex flex-wrap gap-2">
              <li>
                <a
                  href={localeHref(locale, buildFilterHref({ category: undefined }))}
                  aria-current={!category ? "true" : undefined}
                  className={`${filterTagBase} ${!category ? filterTagActive : filterTagInactive}`}
                >
                  <Text as="span" step="body-sm" className="font-semibold">
                    {t.allCategories}
                  </Text>
                </a>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <a
                    href={localeHref(locale, buildFilterHref({ category: c }))}
                    aria-current={category === c ? "true" : undefined}
                    className={`${filterTagBase} ${category === c ? filterTagActive : filterTagInactive}`}
                  >
                    <Text as="span" step="body-sm" className="font-semibold">
                      {t.categories[c] ?? c}
                    </Text>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {hasFilter ? (
            <a
              href={localeHref(locale, "/whats-on/news")}
              className="w-fit font-semibold text-brand-deep hover:underline"
            >
              <Text as="span" step="body-sm">
                {dict.actions.clearFilters}
              </Text>
            </a>
          ) : null}
        </nav>

        <p role="status" className="mb-6">
          <Text as="span" step="body-sm" className="text-muted">
            {dict.actions.showing} {filtered.length}{" "}
            {filtered.length === 1 ? dict.actions.result : dict.actions.results}
          </Text>
        </p>

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
          <Text step="body" className="text-muted">
            {dict.actions.noResults}
          </Text>
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
