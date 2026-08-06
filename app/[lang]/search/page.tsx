import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { runSearch } from "@/lib/search/query";
import { sectionLabel, sectionOrder } from "@/lib/search/sections";
import type { SectionKey } from "@/lib/search/types";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import SearchBox from "@/components/search/SearchBox";
import BestBetCard from "@/components/search/BestBetCard";
import ResultList from "@/components/search/ResultList";

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

const pillBase = "inline-flex h-11 items-center rounded-full px-4 text-sm font-semibold";
const pillActive = "border-2 border-ink bg-ink text-cream";
const pillInactive = "border-line-strong text-ink hover:bg-sunken border";

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
      />
      <div className="wrap flex flex-col gap-8 py-10">
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
          <div className="flex flex-col gap-6">
            <p role="status" className="text-muted text-sm">
              {t.minChars}
            </p>
            <PopularChips locale={locale} terms={response.popular} heading={t.popularHeading} />
            <BrowseSections locale={locale} heading={t.browseHeading} />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {response.bestBet ? <BestBetCard bestBet={response.bestBet} /> : null}

            {response.didYouMean ? (
              <p className="text-ink text-sm">
                {t.didYouMeanPrefix}{" "}
                <Link
                  href={searchQueryHref(locale, response.didYouMean)}
                  className="text-brand-deep font-semibold underline"
                >
                  {response.didYouMean}
                </Link>
                {t.didYouMeanSuffix}
              </p>
            ) : null}

            <p role="status" className="text-muted text-sm">
              {capped
                ? t.showingOf(resultCount, matchedInView)
                : `${dict.actions.showing} ${resultCount} ${
                    resultCount === 1 ? dict.actions.result : dict.actions.results
                  }`}
              {response.section ? ` ${t.inSection(sectionLabel(locale, response.section))}` : ""}
            </p>

            {response.facets.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                <li>
                  <Link
                    href={searchQueryHref(locale, response.query)}
                    aria-current={!response.section ? "true" : undefined}
                    className={`${pillBase} ${!response.section ? pillActive : pillInactive}`}
                  >
                    {t.allChip} ({response.total})
                  </Link>
                </li>
                {response.facets.map((facet) => {
                  const active = response.section === facet.key;
                  return (
                    <li key={facet.key}>
                      <Link
                        href={searchQueryHref(locale, response.query, facet.key)}
                        aria-current={active ? "true" : undefined}
                        className={`${pillBase} ${active ? pillActive : pillInactive}`}
                      >
                        {facet.label} ({facet.count})
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}

            {resultCount === 0 ? (
              <div className="flex flex-col gap-6">
                <Notice variant="info">{dict.actions.noResults}</Notice>
                <PopularChips locale={locale} terms={response.popular} heading={t.popularHeading} />
                <BrowseSections locale={locale} heading={t.browseHeading} />
              </div>
            ) : (
              <ResultList results={response.results} locale={locale} />
            )}
          </div>
        )}
      </div>
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
    <div className="flex flex-col gap-3">
      <h2 className="font-display text-lg">{heading}</h2>
      <ul className="flex flex-wrap gap-2">
        {terms.map((term) => (
          <li key={term}>
            <Link href={searchQueryHref(locale, term)} className={`${pillBase} ${pillInactive}`}>
              {term}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BrowseSections({ locale, heading }: { locale: Locale; heading: string }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-display text-lg">{heading}</h2>
      <ul className="flex flex-wrap gap-2">
        {browseSections.map(({ key, path }) => (
          <li key={key}>
            <Link href={localeHref(locale, path)} className={`${pillBase} ${pillInactive}`}>
              {sectionLabel(locale, key)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
