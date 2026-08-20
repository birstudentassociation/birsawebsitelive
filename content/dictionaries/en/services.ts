/**
 * English UI microcopy: the `services` namespace.
 *
 * Wave 4 (service chassis). Chassis chrome: start pages, question pages, check
 * answers, confirmation panels, status lookup and the officer queue (REDESIGN-2.0 §5).
 *
 * One namespace per domain, one file per namespace per locale, so parallel
 * agents never share a dictionary file (REDESIGN-2.0 §11.2). The English tree
 * is the shape; `content/dictionaries/th/services.ts` is annotated against
 * `typeof services`, so the compiler rejects a Thai file that is missing a key or
 * has invented one. Bilingual parity is a constraint, not a courtesy
 * (principle 14).
 *
 * English voice: plain, direct, neutral. Short sentences. Active verbs.
 * GOV.UK guidance register: state the fact, do not describe or soften it.
 * See docs/EDITING.md "Voice and language" for the full standard.
 */
export const services = {
  // Empty for now. The wave that owns this namespace fills it in.
  // Adding a key here means adding the same key to the other locale in the
  // same change; the compiler will not let you forget.
};
