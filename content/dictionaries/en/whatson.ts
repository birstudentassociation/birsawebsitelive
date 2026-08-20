/**
 * English UI microcopy: the `whatson` namespace.
 *
 * Wave 5 (/whats-on). News, events, the calendar, clubs and sport fixtures
 * (REDESIGN-2.0 §3.2).
 *
 * One namespace per domain, one file per namespace per locale, so parallel
 * agents never share a dictionary file (REDESIGN-2.0 §11.2). The English tree
 * is the shape; `content/dictionaries/th/whatson.ts` is annotated against
 * `typeof whatson`, so the compiler rejects a Thai file that is missing a key or
 * has invented one. Bilingual parity is a constraint, not a courtesy
 * (principle 14).
 *
 * English voice: plain, direct, neutral. Short sentences. Active verbs.
 * GOV.UK guidance register: state the fact, do not describe or soften it.
 * See docs/EDITING.md "Voice and language" for the full standard.
 */
export const whatson = {
  // Empty for now. The wave that owns this namespace fills it in.
  // Adding a key here means adding the same key to the other locale in the
  // same change; the compiler will not let you forget.
};
