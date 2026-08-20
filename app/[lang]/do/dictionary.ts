/**
 * Typed accessor for the `do` namespace (REDESIGN-2.0 §5.2, §6.7).
 *
 * Wave 4A reported that `content/dictionaries/{en,th}/index.ts` did not
 * compose this namespace, and built this accessor rather than editing a
 * frozen contract it did not own. That was the right call, and the gap is now
 * closed: the orchestrator wired `...doNamespace` into both index files at
 * the wave boundary, and `tests/unit/dictionary-namespaces.test.ts` asserts
 * its bilingual key parity along with every other namespace.
 *
 * So `getDictionary(locale).do` now returns exactly what this returns. This
 * accessor is kept only because six route files already call it and churning
 * them buys nothing; either route is correct, and a later wave touching those
 * files can drop it.
 */
import type { Locale } from "@/lib/i18n";
import { doNamespace as en } from "@/content/dictionaries/en/do";
import { doNamespace as th } from "@/content/dictionaries/th/do";

const dictionaries: Record<Locale, typeof en> = { en, th };

export function getDoDictionary(locale: Locale): typeof en {
  return dictionaries[locale];
}
