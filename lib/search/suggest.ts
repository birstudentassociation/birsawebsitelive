/**
 * What to offer when the results are thin or the query was mistyped.
 *
 * A search that returns nothing should still move the reader forward. Three
 * things do that: correcting an obvious misspelling, showing what other
 * people search for, and naming the sections of the site they could browse
 * instead. All three are cheap; an empty page with "no results" is not.
 */
import type { Locale } from "@/lib/i18n";
import type { SearchIndex } from "@/lib/search/engine";
import { boundedEditDistance, bigramSimilarity, fold, tokenize } from "@/lib/search/text";

/**
 * Searches offered on the empty state and when nothing matched. These are the
 * questions BIRSA is actually asked, phrased as a student would type them.
 */
const popular: Record<Locale, string[]> = {
  en: [
    "borrow a projector",
    "course reviews",
    "how many credits to graduate",
    "join a club",
    "shuttle bus",
    "military service postponement",
    "who do I contact",
    "places to eat",
  ],
  th: [
    "ยืมโปรเจคเตอร์",
    "รีวิววิชา",
    "จบต้องกี่หน่วยกิต",
    "สมัครชมรม",
    "รถรับส่ง",
    "ผ่อนผันทหาร",
    "ติดต่อใคร",
    "ร้านอาหารใกล้ ๆ",
  ],
};

export function popularSearches(locale: Locale): string[] {
  return popular[locale];
}

/** Terms this common are ordinary words, not the misspelling we are hunting. */
const MIN_CORRECTION_FREQUENCY = 2;

/**
 * Suggest a corrected spelling, or nothing when the query looks fine.
 *
 * Only terms the index has never seen are candidates for correction: if a
 * word exists in the corpus it is a real word, however odd it looks, and
 * "did you mean" would be wrong to second-guess it.
 */
export function didYouMean(index: SearchIndex, query: string): string | undefined {
  const tokens = tokenize(query);
  if (tokens.length === 0) return undefined;

  let changed = false;
  const corrected: string[] = [];

  for (const token of tokens) {
    if (index.postings.has(token.value) || token.script === "digit") {
      corrected.push(token.value);
      continue;
    }

    let best: { term: string; score: number } | undefined;
    for (const term of index.vocabulary) {
      const postings = index.postings.get(term);
      if (!postings || postings.length < MIN_CORRECTION_FREQUENCY) continue;

      if (token.script === "thai") {
        if (term.length < 3) continue;
        const similarity = bigramSimilarity(token.value, term);
        if (similarity >= 0.7 && (!best || similarity > best.score)) {
          best = { term, score: similarity };
        }
        continue;
      }

      // A short word can be one edit from many unrelated words, so corrections
      // are only offered from five characters up.
      if (token.value.length < 5) continue;
      const distance = boundedEditDistance(token.value, term, 2);
      if (distance === null || distance === 0) continue;
      const score = 1 - distance / 10;
      if (!best || score > best.score) best = { term, score };
    }

    if (best) {
      corrected.push(best.term);
      changed = true;
    } else {
      corrected.push(token.value);
    }
  }

  if (!changed) return undefined;
  const suggestion = corrected.join(" ");
  return fold(suggestion) === fold(query) ? undefined : suggestion;
}
