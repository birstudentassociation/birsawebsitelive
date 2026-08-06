/**
 * The ranking engine: builds an inverted index over a locale's documents and
 * scores a reader's query against it.
 *
 * The old search filtered titles and summaries with `String.includes`, which
 * meant a page either contained the exact substring or did not exist. Three
 * things follow from replacing that with real ranking:
 *
 *   1. Every term the reader typed matters. A document matching two of two
 *      terms beats one matching one term very strongly, which is what makes
 *      multi-word queries ("borrow projector") behave the way readers expect.
 *   2. Where a term matched matters. A word in the title, or in an editor's
 *      curated keyword list, is a claim about what the page is; the same word
 *      in the body is only evidence that the page mentions it.
 *   3. Rare terms matter more than common ones. "BIRSA" appears on every
 *      page and should barely move the ranking; "projector" appears on one.
 *
 * The corpus is small (hundreds of documents), so the index is built in
 * memory on demand and cached per locale. There is no external search
 * service and no query logging.
 */
import type { FieldName, SearchDoc, SearchResult } from "@/lib/search/types";
import { bigrams, fold, tokenize, tokenSimilarity, type Token } from "@/lib/search/text";

/**
 * Field weights. Titles and curated keywords dominate deliberately: an
 * editor listing "wifi, internet, eduroam" on the IT page is telling us what
 * readers will type, and that should outrank a news post that happens to
 * mention wifi in passing.
 */
const FIELD_WEIGHTS: Record<FieldName, number> = {
  title: 10,
  keywords: 7,
  summary: 3.5,
  body: 1,
};

/**
 * Similarity below this is noise and is discarded before it can accumulate.
 * Set by measurement, not taste: at 0.4 a Thai bigram near-miss ("ร้านอาหาร"
 * against "อาหาร") scored just high enough to drag unrelated topics into the
 * results for a common word.
 */
const MIN_TERM_SIMILARITY = 0.55;

/** Cap on how many vocabulary terms one query term may expand to. */
const MAX_EXPANSIONS = 12;

/**
 * Results scoring below this fraction of the top result are not shown. A
 * ranked list is only useful if its tail is worth reading; without this,
 * a one-word query returned hundreds of documents that merely shared a
 * synonym with it.
 */
const RELATIVE_CUTOFF = 0.12;

/**
 * With more than one word typed, a document matching under half of them is
 * almost never what was meant, and it crowds out the ones that matched
 * everything.
 */
const MIN_COVERAGE = 0.5;

type Posting = {
  /** Index into `docs`. */
  doc: number;
  /** Highest field weight this term reaches in that document. */
  weight: number;
  field: FieldName;
};

type IndexedDoc = {
  doc: SearchDoc;
  foldedTitle: string;
  foldedKeywords: string;
  foldedSummary: string;
  foldedBody: string;
};

export type SearchIndex = {
  docs: IndexedDoc[];
  /** term -> the documents it appears in, with its best field weight there. */
  postings: Map<string, Posting[]>;
  /** All distinct terms. */
  vocabulary: string[];
  /** term -> inverse document frequency. */
  idf: Map<string, number>;
  /**
   * Character bigram -> the terms containing it. Comparing a query term
   * against all ten thousand index terms costs far more than a typeahead can
   * afford, and nearly all of it is wasted on terms sharing nothing with the
   * query. Anything that could match — a prefix, a typo, a Thai compound
   * containing the query or contained by it — shares at least one bigram, so
   * this narrows the comparison set to the few hundred worth scoring.
   *
   * Built on first use rather than at index time, so rendering the search
   * page with no query does not pay for it.
   */
  bigramIndex: Map<string, string[]> | null;
  /** Memoized expansions, keyed by script and term. */
  expansionCache: Map<string, Expansion[]>;
};

function fieldText(doc: SearchDoc, field: FieldName): string {
  switch (field) {
    case "title":
      return doc.title;
    case "keywords":
      return (doc.keywords ?? []).join(" ");
    case "summary":
      return doc.summary;
    case "body":
      return doc.body ?? "";
  }
}

/** Build the inverted index for a set of documents. */
export function buildIndex(docs: SearchDoc[]): SearchIndex {
  const postings = new Map<string, Posting[]>();
  const indexed: IndexedDoc[] = [];
  const documentFrequency = new Map<string, number>();

  docs.forEach((doc, docIndex) => {
    const seenInDoc = new Set<string>();
    // Track the best (term, field) pairing within this document so a word in
    // both the title and the body is recorded once, at title weight.
    const best = new Map<string, { weight: number; field: FieldName }>();

    for (const field of ["title", "keywords", "summary", "body"] as FieldName[]) {
      const weight = FIELD_WEIGHTS[field];
      for (const token of tokenize(fieldText(doc, field))) {
        const existing = best.get(token.value);
        if (!existing || existing.weight < weight) best.set(token.value, { weight, field });
        seenInDoc.add(token.value);
      }
    }

    for (const [term, { weight, field }] of best) {
      const list = postings.get(term);
      const posting: Posting = { doc: docIndex, weight, field };
      if (list) list.push(posting);
      else postings.set(term, [posting]);
    }
    for (const term of seenInDoc) {
      documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
    }

    indexed.push({
      doc,
      foldedTitle: fold(doc.title),
      foldedKeywords: fold((doc.keywords ?? []).join(" ")),
      foldedSummary: fold(doc.summary),
      foldedBody: fold(doc.body ?? ""),
    });
  });

  const total = Math.max(1, docs.length);
  const idf = new Map<string, number>();
  for (const [term, frequency] of documentFrequency) {
    // Standard smoothed IDF, floored so a term appearing everywhere still
    // counts for a little rather than zeroing a document's whole score.
    idf.set(term, Math.max(0.15, Math.log((total + 1) / (frequency + 0.5))));
  }

  return {
    docs: indexed,
    postings,
    vocabulary: [...postings.keys()],
    idf,
    bigramIndex: null,
    expansionCache: new Map(),
  };
}

function ensureBigramIndex(index: SearchIndex): Map<string, string[]> {
  if (index.bigramIndex) return index.bigramIndex;
  const built = new Map<string, string[]>();
  for (const term of index.vocabulary) {
    for (const gram of new Set(bigrams(term))) {
      const list = built.get(gram);
      if (list) list.push(term);
      else built.set(gram, [term]);
    }
  }
  index.bigramIndex = built;
  return built;
}

/** IDF for a term the index has never seen, e.g. a misspelling. */
function idfOf(index: SearchIndex, term: string): number {
  return index.idf.get(term) ?? Math.log(index.docs.length + 1);
}

type Expansion = { term: string; similarity: number };

/**
 * The terms worth comparing against a query term, drawn from the bigram
 * index. A one-character token has no bigrams and falls back to the whole
 * vocabulary, which is cheap because such tokens are rare and short.
 */
function candidateTerms(index: SearchIndex, token: Token): Iterable<string> {
  const grams = new Set(bigrams(token.value));
  if (grams.size === 0) return index.vocabulary;

  const bigramIndex = ensureBigramIndex(index);
  const candidates = new Set<string>();
  // The exact term may be shorter than any shared-bigram threshold would
  // admit, so it is always considered.
  if (index.postings.has(token.value)) candidates.add(token.value);
  for (const gram of grams) {
    for (const term of bigramIndex.get(gram) ?? []) candidates.add(term);
  }
  return candidates;
}

/**
 * Find the index terms a query term should match. An exact hit still expands,
 * because prefix matches ("club" -> "clubs") are usually wanted too; the
 * similarity score keeps them ranked below the exact form.
 */
function expand(index: SearchIndex, token: Token): Expansion[] {
  const key = `${token.script}:${token.value}`;
  const cached = index.expansionCache.get(key);
  if (cached) return cached;

  const out: Expansion[] = [];
  for (const term of candidateTerms(index, token)) {
    const similarity = tokenSimilarity(token, term);
    if (similarity >= MIN_TERM_SIMILARITY) out.push({ term, similarity });
  }
  out.sort((a, b) => b.similarity - a.similarity);

  const top = out.slice(0, MAX_EXPANSIONS);
  index.expansionCache.set(key, top);
  return top;
}

function recencyMultiplier(doc: SearchDoc, now: Date): number {
  if (!doc.date) return 1;
  const timestamp = Date.parse(doc.date);
  if (Number.isNaN(timestamp)) return 1;
  const days = (now.getTime() - timestamp) / 86_400_000;

  // An event that has not happened yet is usually the reason someone is
  // searching for it at all.
  if (doc.upcoming && days < 0) return days > -60 ? 1.35 : 1.15;
  if (days < 0) return 1.1;
  if (days <= 30) return 1.2;
  if (days <= 180) return 1.08;
  if (days <= 730) return 1;
  return 0.88;
}

export type QueryOptions = {
  /** Maximum results to return. */
  limit?: number;
  /** Injectable for deterministic tests of the recency boost. */
  now?: Date;
  /**
   * Alternative wordings per query term, keyed by the folded term: the
   * synonyms, translations and abbreviations from `lib/search/synonyms`.
   *
   * These are folded into the term that produced them rather than appended
   * to the query. If "wifi" expanded into three extra query terms, a document
   * matching only "wifi" would look like it had missed three quarters of what
   * the reader asked for, and coverage scoring would bury it. Treating them
   * as alternative spellings of one term keeps coverage honest.
   */
  expansions?: Map<string, string[]>;
};

/** Synonym matches are worth less than the word the reader actually typed. */
const EXPANSION_DAMPING = 0.6;

/**
 * Score every document against the query and return the ranked matches.
 * Query expansion (synonyms, intent) happens before this function is called;
 * `query` here is treated as literal reader text.
 */
export function search(
  index: SearchIndex,
  query: string,
  options: QueryOptions = {}
): SearchResult[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const now = options.now ?? new Date();
  const foldedQuery = fold(query);

  type Accumulator = {
    score: number;
    matchedTerms: Set<string>;
    covered: number;
    bestField: FieldName;
    bestSimilarity: number;
  };
  const accumulators = new Map<number, Accumulator>();

  // Total available weight, used to normalize scores into a comparable range
  // regardless of how many terms the reader typed.
  let idealScore = 0;

  for (const token of tokens) {
    const candidates = expand(index, token);

    // Synonyms enter as extra candidate terms for this same token, damped so
    // they can never outrank the reader's own wording. A synonym may be a
    // phrase ("military service") and may be in the other script, so it is
    // tokenized rather than compared as a single string.
    for (const alternative of options.expansions?.get(token.value) ?? []) {
      for (const alternativeToken of tokenize(alternative)) {
        for (const match of expand(index, alternativeToken)) {
          candidates.push({ term: match.term, similarity: match.similarity * EXPANSION_DAMPING });
        }
      }
    }

    idealScore += idfOf(index, token.value) * FIELD_WEIGHTS.title;
    if (candidates.length === 0) continue;

    // A query term contributes once per document: its best candidate there.
    const perDoc = new Map<number, { value: number; field: FieldName; similarity: number }>();
    for (const { term, similarity } of candidates) {
      const postings = index.postings.get(term);
      if (!postings) continue;
      const weightOfTerm = idfOf(index, term) * similarity;
      for (const posting of postings) {
        const value = weightOfTerm * posting.weight;
        const existing = perDoc.get(posting.doc);
        if (!existing || existing.value < value) {
          perDoc.set(posting.doc, { value, field: posting.field, similarity });
        }
      }
    }

    for (const [docIndex, hit] of perDoc) {
      const accumulator = accumulators.get(docIndex) ?? {
        score: 0,
        matchedTerms: new Set<string>(),
        covered: 0,
        bestField: hit.field,
        bestSimilarity: 0,
      };
      accumulator.score += hit.value;
      accumulator.covered += 1;
      accumulator.matchedTerms.add(token.value);
      if (hit.similarity > accumulator.bestSimilarity) {
        accumulator.bestSimilarity = hit.similarity;
        accumulator.bestField = hit.field;
      }
      accumulators.set(docIndex, accumulator);
    }
  }

  const results: SearchResult[] = [];

  for (const [docIndex, accumulator] of accumulators) {
    const indexed = index.docs[docIndex];
    if (!indexed) continue;
    const doc = indexed.doc;

    const coverage = accumulator.covered / tokens.length;
    if (tokens.length > 1 && coverage < MIN_COVERAGE) continue;
    // Missing terms are punished hard but not fatally: with two terms typed,
    // matching one scores about a quarter of matching both.
    let score = (accumulator.score / Math.max(1, idealScore)) * coverage * coverage;

    // Phrase and whole-title evidence. These are what make a reader typing a
    // page's name land on that page rather than on whatever mentions it most.
    if (indexed.foldedTitle === foldedQuery) score *= 3;
    else if (foldedQuery.length >= 3 && indexed.foldedTitle.includes(foldedQuery)) score *= 1.8;
    else if (foldedQuery.length >= 3 && indexed.foldedKeywords.includes(foldedQuery)) score *= 1.5;
    else if (foldedQuery.length >= 4 && indexed.foldedSummary.includes(foldedQuery)) score *= 1.2;

    if (doc.priority) score *= 1 + doc.priority * 0.8;
    score *= recencyMultiplier(doc, now);

    let reason: SearchResult["reason"] = "text";
    if (indexed.foldedTitle === foldedQuery) reason = "exact-title";
    else if (accumulator.bestField === "keywords") reason = "keyword";
    else if (accumulator.bestSimilarity < 0.7) reason = "fuzzy";
    else if (accumulator.bestSimilarity < 1) reason = "prefix";

    results.push({
      doc,
      score,
      coverage,
      matched: [...accumulator.matchedTerms],
      reason,
      snippet: buildSnippet(indexed, accumulator.matchedTerms),
    });
  }

  results.sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title));

  const top = results[0];
  const cutoff = top ? top.score * RELATIVE_CUTOFF : 0;
  const filtered = results.filter((result) => result.score >= cutoff);

  return typeof options.limit === "number" ? filtered.slice(0, options.limit) : filtered;
}

const SNIPPET_RADIUS = 90;

/**
 * Pull a readable extract from the body around the first matched term, so a
 * result can show why it matched instead of repeating its summary.
 */
function buildSnippet(indexed: IndexedDoc, matched: Set<string>): string | undefined {
  const body = indexed.doc.body;
  if (!body) return undefined;
  const folded = indexed.foldedBody;

  let position = -1;
  for (const term of matched) {
    const at = folded.indexOf(term);
    if (at !== -1 && (position === -1 || at < position)) position = at;
  }
  if (position === -1) return undefined;

  // The folded body and the original differ in length, so map by ratio and
  // then snap to the nearest space; an approximate window is fine here.
  const ratio = folded.length === 0 ? 0 : position / folded.length;
  const approximate = Math.floor(ratio * body.length);
  const start = Math.max(0, approximate - SNIPPET_RADIUS);
  const end = Math.min(body.length, approximate + SNIPPET_RADIUS);

  let extract = body.slice(start, end).replace(/\s+/g, " ").trim();
  if (start > 0) extract = `…${extract.replace(/^\S*\s/, "")}`;
  if (end < body.length) extract = `${extract.replace(/\s\S*$/, "")}…`;
  return extract.length > 20 ? extract : undefined;
}
