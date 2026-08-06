/**
 * The public entry point for site search: everything the results page and the
 * suggestions API need, from one call.
 *
 * The index is built from the filesystem and from TypeScript content modules,
 * so this module is server-only. It is cached per locale for the lifetime of
 * the process, which on a serverless deployment means "per warm instance":
 * the first search after a cold start pays for the build, every later one
 * does not. Nothing here is written back to disk and no query is logged.
 */
import { localeHref, type Locale } from "@/lib/i18n";
import { buildIndex, search, type SearchIndex } from "@/lib/search/engine";
import { matchIntent, type BestBet } from "@/lib/search/intent";
import { staticPages } from "@/lib/search/pages";
import { sectionLabel, sectionOrder } from "@/lib/search/sections";
import { answerDocs } from "@/lib/search/sources/answers";
import { contentDocs } from "@/lib/search/sources/content";
import { referenceDocs } from "@/lib/search/sources/reference";
import { didYouMean, popularSearches } from "@/lib/search/suggest";
import { buildExpansions } from "@/lib/search/synonyms";
import { fold } from "@/lib/search/text";
import type { SearchDoc, SearchResult, SectionKey } from "@/lib/search/types";

/** Curated destination pages, converted into documents. */
function pageDocs(locale: Locale): SearchDoc[] {
  return staticPages.map((page) => ({
    id: page.id,
    locale,
    section: page.section,
    kind: page.kind,
    href: localeHref(locale, page.path),
    title: page.title[locale],
    summary: page.summary[locale],
    // Both languages' keywords go into every locale's index on purpose: a
    // student reading the Thai site still types "wifi", and one reading the
    // English site still types "หอพัก".
    keywords: [...page.keywords.en, ...page.keywords.th],
    priority: page.priority,
  }));
}

function corpus(locale: Locale): SearchDoc[] {
  return [
    ...pageDocs(locale),
    ...answerDocs(locale),
    ...contentDocs(locale),
    ...referenceDocs(locale),
  ];
}

const indexes = new Map<Locale, SearchIndex>();

export function getIndex(locale: Locale): SearchIndex {
  const cached = indexes.get(locale);
  if (cached) return cached;
  const built = buildIndex(corpus(locale));
  indexes.set(locale, built);
  return built;
}

export type SectionFacet = {
  key: SectionKey;
  label: string;
  count: number;
};

export type SearchResponse = {
  /** The query as typed, trimmed. */
  query: string;
  /** Whether the query was long enough to run at all. */
  ran: boolean;
  /** Results after the section filter, capped by `limit`. */
  results: SearchResult[];
  /** Total matches before the section filter and cap. */
  total: number;
  /** The active section filter, when one is applied. */
  section?: SectionKey;
  facets: SectionFacet[];
  bestBet?: BestBet;
  /** A corrected spelling, when the query looks mistyped and found little. */
  didYouMean?: string;
  /** Offered on the empty state and when nothing matched. */
  popular: string[];
};

/** Below this, a query is too short to say anything useful. */
export const MIN_QUERY_LENGTH = 2;

export type RunSearchOptions = {
  section?: SectionKey;
  limit?: number;
  now?: Date;
};

/**
 * Run a full search: ranking, synonym expansion, intent, facets and recovery
 * suggestions. Callers get everything at once because the page needs all of
 * it and the index is already in memory.
 */
export function runSearch(
  locale: Locale,
  rawQuery: string,
  options: RunSearchOptions = {}
): SearchResponse {
  const query = rawQuery.trim();
  const popular = popularSearches(locale);

  if (fold(query).length < MIN_QUERY_LENGTH) {
    return { query, ran: false, results: [], total: 0, facets: [], popular };
  }

  const index = getIndex(locale);
  const matches = search(index, query, {
    expansions: buildExpansions(query),
    now: options.now,
  });

  const counts = new Map<SectionKey, number>();
  for (const result of matches) {
    counts.set(result.doc.section, (counts.get(result.doc.section) ?? 0) + 1);
  }
  const facets: SectionFacet[] = sectionOrder
    .filter((key) => (counts.get(key) ?? 0) > 0)
    .map((key) => ({ key, label: sectionLabel(locale, key), count: counts.get(key) ?? 0 }));

  const filtered = options.section
    ? matches.filter((result) => result.doc.section === options.section)
    : matches;

  const limit = options.limit ?? 40;

  return {
    query,
    ran: true,
    results: filtered.slice(0, limit),
    total: matches.length,
    section: options.section,
    facets,
    bestBet: matchIntent(locale, query),
    // Only offered when ranking struggled: correcting a query that already
    // worked is noise, and worse, it implies the reader got it wrong.
    didYouMean: matches.length < 3 ? didYouMean(index, query) : undefined,
    popular,
  };
}

/**
 * Compact shape for the typeahead. Deliberately smaller than the full result:
 * a dropdown shows a line and a label, not a snippet.
 */
export type Suggestion = {
  title: string;
  href: string;
  section: SectionKey;
  sectionLabel: string;
};

export function suggest(locale: Locale, rawQuery: string, limit = 8): Suggestion[] {
  const response = runSearch(locale, rawQuery, { limit });
  return response.results.map((result) => ({
    title: result.doc.title,
    href: result.doc.href,
    section: result.doc.section,
    sectionLabel: sectionLabel(locale, result.doc.section),
  }));
}
