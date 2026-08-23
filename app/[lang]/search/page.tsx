import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { runSearch } from "@/lib/search/query";
import { sectionLabel, sectionOrder } from "@/lib/search/sections";
import type { SectionKey } from "@/lib/search/types";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import { Wrap, Stack } from "@/components/bds/Layout";
import Notice from "@/components/bds/Notice";
import PageHeader from "@/components/bds/PageHeader";
import { Heading, Text } from "@/components/bds/Type";
import SearchBox from "@/components/search/SearchBox";
import BestBetCard from "@/components/search/BestBetCard";
import ResultList from "@/components/search/ResultList";

/**
 * `/search` (ROUTE-MAP-2.0 Wave 5F).
 *
 * A plain `<form method="GET">` submitted server-side: `runSearch` reads
 * `searchParams` and renders results in the same request, so the whole page
 * works with JavaScript off. `components/search/SearchBox` only ever adds a
 * typeahead panel on top of that baseline; it never intercepts the submit
 * in a way that would leave a no-JS reader stuck. Every result names its
 * destination up front (a section `Tag`, then the title as the link itself)
 * rather than requiring a click to find out where it goes.
 *
 * Thai is written with no spaces between words, so `lib/search/text.ts`
 * (read only; not owned by this wave) deliberately does not tokenise Thai
 * on whitespace: Thai runs are matched as substrings and prefixes, with a
 * character-bigram fallback for a missing tone mark or a partial word. That
 * is the correct answer to the no-spaces problem and this page does not
 * regress it.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "ค้นหา" : "Search";
  const description =
    locale === "th"
      ? "ค้นหาคำตอบแบบนำทาง บริการ ชมรม ข่าว และคู่มือชีวิตนักศึกษาในเว็บไซต์ BIRSA"
      : "Search guided answers, services, clubs, news and the student-life guide on the BIRSA site.";

  return {
    ...buildMetadata({ locale, title, description, path: "/search" }),
    // `buildMetadata` has no `robots` option (checked lib/seo.ts): a results
    // page is per-query, near-duplicate of itself for every search term, and
    // has nothing an external index should rank; `follow` still lets crawlers
    // reach the destination pages the results link to.
    robots: { index: false, follow: true },
  };
}

const copy: Record<
  Locale,
  {
    title: string;
    lede: string;
    minChars: string;
    popularHeading: string;
    browseHeading: string;
    allChip: string;
    didYouMeanPrefix: string;
    didYouMeanSuffix: string;
    inSection: (label: string) => string;
    showingOf: (shown: number, total: number) => string;
  }
> = {
  en: {
    title: "Search",
    lede: "Search guided answers, services, clubs, news and the student-life guide.",
    minChars: "Type at least 2 characters to search.",
    popularHeading: "Popular searches",
    browseHeading: "Or browse a section",
    allChip: "All",
    didYouMeanPrefix: "Did you mean",
    didYouMeanSuffix: "?",
    inSection: (label) => `in ${label}`,
    showingOf: (shown, total) => `Showing the first ${shown} of ${total} results`,
  },
  th: {
    title: "ค้นหา",
    lede: "ค้นหาคำตอบแบบนำทาง บริการ ชมรม ข่าว และคู่มือชีวิตนักศึกษา",
    minChars: "พิมพ์อย่างน้อย 2 ตัวอักษรเพื่อค้นหา",
    popularHeading: "คำค้นหายอดนิยม",
    browseHeading: "หรือเลือกดูตามหมวดหมู่",
    allChip: "ทั้งหมด",
    didYouMeanPrefix: "หมายถึง",
    didYouMeanSuffix: "?",
    inSection: (label) => `ในหมวด ${label}`,
    showingOf: (shown, total) => `แสดง ${shown} รายการแรก จากทั้งหมด ${total} รายการ`,
  },
};

/** The handful of top-level sections offered as "somewhere to go" on the
 * empty and zero-result states — entry points, not every `SectionKey`. */
const browseSections: { key: SectionKey; path: string }[] = [
  { key: "answers", path: "/answers" },
  { key: "services", path: "/services" },
  { key: "student-life", path: "/student-life" },
  { key: "clubs", path: "/clubs" },
  { key: "news", path: "/news" },
];

function searchQueryHref(locale: Locale, query: string, section?: SectionKey): string {
  const params = new URLSearchParams({ q: query });
  if (section) params.set("section", section);
  return `${localeHref(locale, "/search")}?${params.toString()}`;
}

const pillBase = "inline-flex h-11 items-center rounded-full px-4 font-semibold";
const pillActive = "border-2 border-ink bg-ink text-cream";
const pillInactive = "border-input-border text-ink hover:bg-sunken border";

function Pill({
  href,
  active,
  current,
  children,
}: {
  href: string;
  active: boolean;
  current?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={current ? "true" : undefined}
      className={`${pillBase} ${active ? pillActive : pillInactive}`}
    >
      <Text as="span" step="body-sm">
        {children}
      </Text>
    </Link>
  );
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string; section?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];

  const { q, section: sectionParam } = await searchParams;
  const query = q ?? "";
  // Unknown section values are ignored rather than 404ing: a stale or
  // hand-edited `?section=` should fall back to "all sections", not break
  // the page.
  const section: SectionKey | undefined =
    sectionParam && (sectionOrder as string[]).includes(sectionParam)
      ? (sectionParam as SectionKey)
      : undefined;

  const response = runSearch(locale, query, { section });
  const resultCount = response.results.length;
  // How many matched the active view, which is the facet's count when a
  // section filter is on and the overall total when it is not. Results are
  // capped for page weight, so the count line has to say when it is showing
  // only the first slice rather than claiming that is all there was.
  const matchedInView = response.section
    ? (response.facets.find((facet) => facet.key === response.section)?.count ?? resultCount)
    : response.total;
  const capped = resultCount < matchedInView;

  return (
    <>
      <PageHeader
        title={t.title}
        lede={t.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[{ label: dict.site.name, href: "/" }, { label: t.title }]}
          />
        }
        helpSlot={
          <Button href={localeHref(locale, "/contact")} variant="secondary">
            {dict.actions.contactUs}
          </Button>
        }
      />
      <Wrap className="flex flex-col gap-8 py-10">
        <SearchBox
          locale={locale}
          defaultValue={response.query}
          labelText={dict.actions.searchPlaceholder}
          placeholder={dict.actions.searchPlaceholder}
          submitLabel={dict.actions.search}
          action={localeHref(locale, "/search")}
          id="search-q"
        />

        {!response.ran ? (
          <Stack gap="lg">
            <p role="status">
              <Text as="span" step="body-sm" className="text-muted">
                {t.minChars}
              </Text>
            </p>
            <PopularChips locale={locale} terms={response.popular} heading={t.popularHeading} />
            <BrowseSections locale={locale} heading={t.browseHeading} />
          </Stack>
        ) : (
          <Stack gap="lg">
            {response.bestBet ? <BestBetCard bestBet={response.bestBet} /> : null}

            {response.didYouMean ? (
              <Text as="p" step="body-sm" className="text-ink">
                {t.didYouMeanPrefix}{" "}
                <Link
                  href={searchQueryHref(locale, response.didYouMean)}
                  className="font-semibold text-brand-deep underline"
                >
                  {response.didYouMean}
                </Link>
                {t.didYouMeanSuffix}
              </Text>
            ) : null}

            <p role="status">
              <Text as="span" step="body-sm" className="text-muted">
                {capped
                  ? t.showingOf(resultCount, matchedInView)
                  : `${dict.actions.showing} ${resultCount} ${
                      resultCount === 1 ? dict.actions.result : dict.actions.results
                    }`}
                {response.section ? ` ${t.inSection(sectionLabel(locale, response.section))}` : ""}
              </Text>
            </p>

            {response.facets.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                <li>
                  <Pill
                    href={searchQueryHref(locale, response.query)}
                    active={!response.section}
                    current={!response.section}
                  >
                    {t.allChip} ({response.total})
                  </Pill>
                </li>
                {response.facets.map((facet) => {
                  const active = response.section === facet.key;
                  return (
                    <li key={facet.key}>
                      <Pill
                        href={searchQueryHref(locale, response.query, facet.key)}
                        active={active}
                        current={active}
                      >
                        {facet.label} ({facet.count})
                      </Pill>
                    </li>
                  );
                })}
              </ul>
            ) : null}

            {resultCount === 0 ? (
              <Stack gap="lg">
                <Notice variant="info">{dict.actions.noResults}</Notice>
                <PopularChips locale={locale} terms={response.popular} heading={t.popularHeading} />
                <BrowseSections locale={locale} heading={t.browseHeading} />
              </Stack>
            ) : (
              <ResultList results={response.results} locale={locale} />
            )}
          </Stack>
        )}
      </Wrap>
    </>
  );
}

function PopularChips({
  locale,
  terms,
  heading,
}: {
  locale: Locale;
  terms: string[];
  heading: string;
}) {
  if (terms.length === 0) return null;
  return (
    <Stack gap="sm">
      <Heading level={2} step="heading-2">
        {heading}
      </Heading>
      <ul className="flex flex-wrap gap-2">
        {terms.map((term) => (
          <li key={term}>
            <Pill href={searchQueryHref(locale, term)} active={false}>
              {term}
            </Pill>
          </li>
        ))}
      </ul>
    </Stack>
  );
}

function BrowseSections({ locale, heading }: { locale: Locale; heading: string }) {
  return (
    <Stack gap="sm">
      <Heading level={2} step="heading-2">
        {heading}
      </Heading>
      <ul className="flex flex-wrap gap-2">
        {browseSections.map(({ key, path }) => (
          <li key={key}>
            <Pill href={localeHref(locale, path)} active={false}>
              {sectionLabel(locale, key)}
            </Pill>
          </li>
        ))}
      </ul>
    </Stack>
  );
}
