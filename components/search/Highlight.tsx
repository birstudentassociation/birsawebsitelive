/**
 * Wraps case-insensitive matches of `terms` inside `text` in `<mark>`.
 *
 * `terms` come from `SearchResult.matched`, i.e. folded query tokens (see
 * `lib/search/text.ts`): lowercase, accents stripped, punctuation collapsed.
 * Matching them back against the original, unfolded `text` with a
 * case-insensitive regex still finds the reader's words in the vast majority
 * of cases, because folding rarely changes anything a real BIRSA page's
 * prose would contain (no combining accents, no exotic punctuation inside a
 * word). It is a best-effort highlight, not a re-run of the search engine.
 *
 * Thai has no word boundaries in normal writing, so terms are matched as
 * plain substrings for every script alike; adding `\b` would simply make Thai
 * matches never fire.
 */

/** Above this length, highlighting stops paying attention: a snippet is
 * already trimmed short by the engine, so a text this long is body copy
 * rendered whole, and scanning it term-by-term is not worth the cost. */
const MAX_TEXT_LENGTH = 600;

/** At most this many distinct terms are turned into `<mark>` boundaries. */
const MAX_TERMS = 8;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export type HighlightProps = {
  text: string;
  /** Folded query terms to mark, e.g. `result.matched`. */
  terms: string[];
};

/** Renders `text` with `terms` wrapped in `<mark>`, case-insensitively. */
export default function Highlight({ text, terms }: HighlightProps) {
  const usableTerms = terms
    .map((term) => term.trim())
    .filter((term) => term.length > 0)
    .slice(0, MAX_TERMS);

  if (usableTerms.length === 0 || text.length > MAX_TEXT_LENGTH) {
    return <>{text}</>;
  }

  // Longest first, so a longer term ("equipment") is not shadowed by a
  // shorter one it contains ("equip") splitting the match early.
  const sorted = [...new Set(usableTerms)].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${sorted.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(pattern);

  if (parts.length === 1) return <>{text}</>;

  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <mark key={index} className="bg-warning-tint text-ink rounded-sm">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}
