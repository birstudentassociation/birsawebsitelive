/**
 * English UI microcopy: the `console` namespace.
 *
 * Wave 4C (console lift). Officer-facing strings. WCAG 2.2 AA applies to these
 * exactly as it does to the public site (REDESIGN-2.0 §9).
 *
 * One namespace per domain, one file per namespace per locale, so parallel
 * agents never share a dictionary file (REDESIGN-2.0 §11.2). The English tree
 * is the shape; `content/dictionaries/th/console.ts` is annotated against
 * `typeof officerConsole`, so the compiler rejects a Thai file that is missing a key or
 * has invented one. Bilingual parity is a constraint, not a courtesy
 * (principle 14).
 *
 * English voice: plain, direct, neutral. Short sentences. Active verbs.
 * GOV.UK guidance register: state the fact, do not describe or soften it.
 * See docs/EDITING.md "Voice and language" for the full standard.
 */
export const officerConsole = {
  // Empty for now. The wave that owns this namespace fills it in.
  // Adding a key here means adding the same key to the other locale in the
  // same change; the compiler will not let you forget.
};
