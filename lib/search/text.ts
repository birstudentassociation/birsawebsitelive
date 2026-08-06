/**
 * Bilingual (Thai/English) text handling for site search.
 *
 * Thai is the hard case. It is written without spaces between words, so the
 * usual "split on whitespace and compare words" approach finds nothing unless
 * the reader happens to type a run of characters that lines up with a word
 * boundary the writer also used. We therefore treat the two scripts
 * differently:
 *
 *   - Latin/digit runs become tokens, matched exactly, by prefix, or by a
 *     bounded edit distance so typos ("equpment") still find the page.
 *   - Thai runs stay whole and are matched as substrings, falling back to
 *     character-bigram overlap when the substring is not present, which is
 *     tolerant of a missing tone mark or a swapped vowel.
 *
 * Everything here is pure and dependency-free so it can run at build time,
 * on the server, and in the browser without change.
 */

/** Which script a token was written in, which decides how it is matched. */
export type TokenScript = "latin" | "thai" | "digit";

export type Token = {
  /** Folded token text, ready to compare against other folded tokens. */
  value: string;
  script: TokenScript;
};

const THAI_RANGE = /[฀-๿]/;
const THAI_DIGITS = /[๐-๙]/g;
/**
 * Thai tone marks and the "killer" mark. Dropping these gives a looser form
 * used only as a fallback comparison: readers routinely omit or mistype tone
 * marks, and the unmarked spelling is still unambiguous in practice.
 */
const THAI_TONE_MARKS = /[็-๎]/g;
/** Zero-width characters that get pasted in from PDFs and chat apps. */
const INVISIBLES = /[​-‍﻿­]/g;

/**
 * Fold text into its comparable form: lowercase, decomposed Latin accents
 * removed, Thai digits mapped to ASCII, invisible characters dropped, and
 * runs of punctuation/whitespace collapsed to single spaces.
 */
export function fold(input: string): string {
  return (
    input
      .normalize("NFD")
      // Strip Latin combining marks only. The Unicode combining-marks block
      // ̀-ͯ does not overlap Thai, whose vowels and tone marks are
      // meaning-bearing and must survive folding.
      .replace(/[̀-ͯ]/g, "")
      .normalize("NFC")
      .toLowerCase()
      .replace(INVISIBLES, "")
      .replace(THAI_DIGITS, (d) => String(d.charCodeAt(0) - 0x0e50))
      // Marks (\p{M}) must survive. Thai vowel signs and tone marks are
      // nonspacing marks, not letters, so a naive "letters and numbers only"
      // filter deletes them: "หอพัก" becomes "หอพ ก", which silently shreds
      // every Thai word in the index and in the query alike.
      .replace(/[^\p{L}\p{N}\p{M}]+/gu, " ")
      .trim()
  );
}

/**
 * Drop Thai tone marks from an already-folded string. Used as a second-chance
 * comparison, never as the primary index form.
 */
export function foldThaiLoose(input: string): string {
  return input.replace(THAI_TONE_MARKS, "");
}

function scriptOf(chunk: string): TokenScript {
  if (THAI_RANGE.test(chunk)) return "thai";
  if (/^\p{N}+$/u.test(chunk)) return "digit";
  return "latin";
}

/**
 * Split folded text into tokens. Thai runs are kept whole (see the module
 * comment); Latin and digit runs split on script boundaries so "bir2568" and
 * "รหัส123" both yield usable pieces.
 */
export function tokenize(input: string): Token[] {
  const folded = fold(input);
  if (!folded) return [];

  const tokens: Token[] = [];
  for (const chunk of folded.split(" ")) {
    if (!chunk) continue;
    // A single chunk can mix scripts, e.g. "wifiเน็ต" or "ปี2". Break it at
    // every script change so each piece is matched by the right strategy.
    const pieces = chunk.match(/[฀-๿]+|[0-9]+|[^฀-๿0-9]+/g) ?? [];
    for (const piece of pieces) {
      if (!piece) continue;
      const script = scriptOf(piece);
      // Single Latin letters carry almost no signal and match nearly
      // everything, so they are dropped. Single digits are kept ("year 1").
      if (script === "latin" && piece.length < 2) continue;
      tokens.push({ value: piece, script });
    }
  }
  return tokens;
}

/** Convenience wrapper returning just the token strings. */
export function tokenStrings(input: string): string[] {
  return tokenize(input).map((token) => token.value);
}

/**
 * Conservative English suffix stripper. It exists so "clubs" finds "club" and
 * "borrowing" finds "borrow"; it is deliberately not a full Porter stemmer,
 * because aggressive stemming produces confident-looking wrong matches that
 * are harder to explain to an editor than a missed one.
 */
export function stem(token: string): string {
  if (token.length < 5) return token;
  for (const suffix of ["ing", "ies", "ed", "es", "s"]) {
    if (!token.endsWith(suffix)) continue;
    const base = token.slice(0, -suffix.length);
    // A four-character floor keeps real words whose ending only looks like a
    // suffix: "news" must not become "new", nor "bus" become "bu".
    if (base.length < 4) continue;
    if (suffix === "ies") return `${base}y`;
    return base;
  }
  return token;
}

/** Overlapping character bigrams, used for fuzzy Thai comparison. */
export function bigrams(input: string): string[] {
  if (input.length < 2) return input ? [input] : [];
  const out: string[] = [];
  for (let i = 0; i < input.length - 1; i += 1) out.push(input.slice(i, i + 2));
  return out;
}

/** Dice coefficient over character bigrams: 1 identical, 0 nothing in common. */
export function bigramSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  const left = bigrams(a);
  const right = bigrams(b);
  if (left.length === 0 || right.length === 0) return 0;

  const pool = new Map<string, number>();
  for (const gram of left) pool.set(gram, (pool.get(gram) ?? 0) + 1);

  let shared = 0;
  for (const gram of right) {
    const available = pool.get(gram) ?? 0;
    if (available > 0) {
      pool.set(gram, available - 1);
      shared += 1;
    }
  }
  return (2 * shared) / (left.length + right.length);
}

/**
 * Levenshtein distance, abandoned as soon as it is known to exceed `max`.
 * Returns `null` when the distance is greater than `max`, which lets callers
 * skip the usual "compute then compare" work on obviously unrelated words.
 */
export function boundedEditDistance(a: string, b: string, max: number): number | null {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return null;
  if (a.length === 0) return b.length <= max ? b.length : null;
  if (b.length === 0) return a.length <= max ? a.length : null;

  let previous: number[] = Array.from({ length: b.length + 1 }, (_, i) => i);
  let current: number[] = new Array<number>(b.length + 1).fill(0);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    let rowMin = i;
    const aChar = a[i - 1];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = aChar === b[j - 1] ? 0 : 1;
      const value = Math.min(
        (current[j - 1] ?? 0) + 1,
        (previous[j] ?? 0) + 1,
        (previous[j - 1] ?? 0) + cost
      );
      current[j] = value;
      if (value < rowMin) rowMin = value;
    }
    if (rowMin > max) return null;
    const swap = previous;
    previous = current;
    current = swap;
  }

  const distance = previous[b.length] ?? Number.POSITIVE_INFINITY;
  return distance <= max ? distance : null;
}

/**
 * How many edits a token of a given length is allowed to be wrong by. Short
 * words get no slack ("bir" must not match "car"); longer words get more,
 * because that is where real typing errors happen.
 */
export function fuzzyBudget(length: number): number {
  if (length <= 4) return 0;
  if (length <= 7) return 1;
  return 2;
}

/**
 * Match quality of a query token against a single document token, from 0 (no
 * match) to 1 (exact). The graded scale is what lets ranking prefer a page
 * that matched the word as typed over one that merely matched a prefix or a
 * near-miss spelling.
 */
export function tokenSimilarity(query: Token, docToken: string): number {
  const value = query.value;
  if (value === docToken) return 1;

  if (query.script === "thai") {
    // Thai runs are compared as substrings first: readers type a fragment of
    // a compound and expect the compound back ("หอ" -> "หอพัก").
    //
    // The length floors matter more than they look. A two-character Thai
    // fragment occurs inside a large share of Thai words, so allowing it to
    // match anywhere in a token turns a common query into a match against
    // most of the corpus. A prefix is safer than an interior match, so it is
    // allowed one character earlier.
    if (value.length >= 2 && docToken.startsWith(value)) return 0.9;
    if (value.length >= 3 && docToken.includes(value)) return 0.8;
    // The reverse direction matters just as much: readers type a whole
    // unsegmented phrase ("ยืมของ") that contains an indexed term ("ยืม").
    // Scored below the forward case because the extra characters the reader
    // typed are evidence the match is only partial.
    if (docToken.length >= 3 && value.includes(docToken)) return 0.75;
    const loose = foldThaiLoose(value);
    const looseDoc = foldThaiLoose(docToken);
    if (loose !== value || looseDoc !== docToken) {
      if (looseDoc === loose) return 0.85;
      if (loose.length >= 3 && looseDoc.includes(loose)) return 0.72;
    }
    if (value.length >= 3) {
      const similarity = bigramSimilarity(value, docToken);
      if (similarity >= 0.6) return similarity * 0.7;
    }
    return 0;
  }

  if (query.script === "digit") return docToken.startsWith(value) ? 0.7 : 0;

  if (docToken.startsWith(value)) {
    // A prefix of a much longer word is weaker evidence than a prefix that
    // nearly spans it: "stud" -> "study" is a likelier intent than
    // "stud" -> "studentassociation".
    const ratio = value.length / docToken.length;
    return 0.72 + 0.16 * ratio;
  }

  const queryStem = stem(value);
  const docStem = stem(docToken);
  if (queryStem === docStem) return 0.86;
  if (docStem.startsWith(queryStem) && queryStem.length >= 3) return 0.7;

  const budget = fuzzyBudget(value.length);
  if (budget > 0) {
    const distance = boundedEditDistance(value, docToken, budget);
    if (distance !== null) return distance === 1 ? 0.6 : 0.42;
  }

  // Long query words that appear inside a longer document word, e.g.
  // "committee" inside "subcommittee".
  if (value.length >= 5 && docToken.includes(value)) return 0.55;

  return 0;
}
