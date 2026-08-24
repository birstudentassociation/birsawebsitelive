/**
 * Deterministic Sanity `_id` and array `_key` derivation for content
 * migration (REDESIGN-2.0 §11.4, `docs/migration/mdx.md`).
 *
 * SHARED CONTRACT. This file is owned and written by Wave 6A (the MDX to
 * Portable Text agent) and READ ONLY by the other three Wave 6 content
 * migration agents (TS content modules, Smart Answers trees, curriculum).
 * All four write a migrate/verify/rollback triple against the same
 * requirement — "running the migration script twice on an unchanged tree
 * produces a byte-identical artifact" — and that guarantee only holds if
 * every agent derives a given source item's id the same deterministic way.
 * Four independent id schemes would each be individually deterministic and
 * collectively unauditable: nothing would catch two agents' documents
 * colliding on the same `_id` in the combined NDJSON. One shared function
 * used by all four is what makes `assertNoDuplicateIds` meaningful across
 * the whole migration, not just within one family.
 *
 * WHY NOT `Date.now()`, `crypto.randomUUID()`, OR ARRAY INDEX: any of those
 * would make the id depend on *when* or *in what order* the script ran
 * rather than on the source content, which breaks re-running the same
 * migration twice (the determinism gate) and breaks re-running it after an
 * unrelated file was added or removed elsewhere in the corpus (id stability
 * across incremental content changes). `documentId` and `arrayKey` below are
 * pure string functions of their inputs, nothing else.
 *
 * SCOPE OF THIS CONTRACT: keep the exported surface small and stable. It is
 * safe to ADD a new function here if a future family needs one. It is not
 * safe to change the SHAPE of `documentId` or `arrayKey` once another agent
 * has started calling them — that is a breaking change to code you cannot
 * see running concurrently. If one of these functions is wrong for your
 * family, STOP and say so in your report rather than editing it to fit.
 */

/**
 * The character class every id segment (a document type name, a slug, an
 * audience, a locale, or any other component passed to the functions below)
 * must already satisfy. Segments are not sanitized here — silently mangling
 * an unexpected character would make two different source slugs collide on
 * the same id without either agent noticing, which is worse than refusing
 * to run. Callers sanitize (or validate) their own slugs before calling in,
 * matching `lib/i18n.ts`'s existing rule that "English kebab-case is the
 * shared key" for content slugs.
 */
const ID_SEGMENT = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;

function assertSegment(label: string, value: string): void {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(
      `lib/migration/ids.ts: ${label} must be a non-empty string, got ${JSON.stringify(value)}.`
    );
  }
  if (!ID_SEGMENT.test(value)) {
    throw new Error(
      `lib/migration/ids.ts: "${value}" is not a valid ${label}. Segments must be lowercase ` +
        `ascii letters, digits, hyphens or underscores (matching ${ID_SEGMENT}), with no leading, ` +
        `trailing or doubled separator. Sanitize or reject the source slug before calling in; ` +
        `do not loosen this pattern to make a bad value pass.`
    );
  }
}

/**
 * The Sanity `_id` for a top-level document, derived only from its schema
 * type name and a stable key (typically the content's own slug, or a slug
 * composed with a disambiguating prefix such as an audience). Same inputs,
 * same id, on every run, forever — that is the entire contract.
 *
 * Composing a multi-part key (e.g. a student-life guide's `audience` plus
 * its slug, since the three audiences are siblings that can reuse a
 * filename) is the caller's job: pass the already-joined key, e.g.
 * `documentId("guide", "home-shuttle-bus")`. Joining happens outside this
 * function so the join character and part order stay visible at the call
 * site rather than buried in a shared function every family must reread to
 * understand.
 */
export function documentId(docType: string, key: string): string {
  assertSegment("document type", docType);
  assertSegment("document key", key);
  return `${docType}-${key}`;
}

/**
 * The Sanity `_key` for one member of an array field (every array member in
 * Sanity's content lake needs one, and the Studio and GROQ both use it to
 * identify a specific item for editing and patching). Built by joining
 * already-valid segments that together are stable across re-runs: typically
 * the parent block's own key or index token plus a short discriminator, e.g.
 * `arrayKey("body", "3", "row", "2")` for the second row of the third body
 * block. Positional (index-based) segments are fine here specifically
 * because they come from one source file's own fixed, re-parsed-identically
 * document order, not from a mutable collection whose order could vary
 * between runs (the case §11.4 warns against is array order that could
 * *shift*, e.g. an unordered `fs.readdirSync` result or a Set's iteration
 * order — a single MDX file's block sequence does not shift).
 */
export function arrayKey(...parts: string[]): string {
  if (parts.length === 0) {
    throw new Error("lib/migration/ids.ts: arrayKey requires at least one part.");
  }
  parts.forEach((part, index) => assertSegment(`arrayKey part [${index}]`, part));
  return parts.join("-");
}

/**
 * Throws, naming every id that appears more than once, rather than
 * returning a boolean or a count: REDESIGN-2.0 §11.4 says the verification
 * script must "print what is wrong, by name, not a count", and a thrown
 * error with the actual colliding ids in its message is the one form of
 * this check that satisfies that rule wherever it is called from (a script
 * that lets the error propagate, or a test that asserts on `.toThrow`).
 *
 * `context` is a short label for the error message only (e.g. "newsArticle
 * documents", "club social-link keys") so a collision across two different
 * families' calls to this function is still easy to place.
 */
export function assertNoDuplicateIds(ids: string[], context = "documents"): void {
  const seen = new Map<string, number>();
  for (const id of ids) {
    seen.set(id, (seen.get(id) ?? 0) + 1);
  }
  const duplicates = [...seen.entries()]
    .filter(([, count]) => count > 1)
    .map(([id]) => id)
    .sort();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate ${context} id(s): ${duplicates.join(", ")}`);
  }
}
