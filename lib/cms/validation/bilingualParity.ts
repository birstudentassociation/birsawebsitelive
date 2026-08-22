/**
 * Bilingual parity checking (REDESIGN-2.0 principle 14, §10, §6.5 step 3).
 *
 * "A document publishable in one locale only is a document that ships half
 * translated. Every reader facing field must exist in both." This file is
 * the one implementation of that rule, called by the Studio validation, the
 * nightly integrity cron (`app/api/cron/content-integrity/route.ts`), and
 * the tests, so the three cannot disagree (`docs/CMS-SCHEMA-CONVENTIONS.md`
 * §4).
 *
 * This library never touches Sanity itself. It is handed already extracted
 * field values and reports findings; the caller (a schema's custom
 * validation, or `lib/cms/validation/index.ts`'s generic document scanner)
 * is responsible for pulling the values out of whatever shape the document
 * actually has. That keeps this file usable by every schema domain without
 * this wave needing to read another wave's schema files.
 *
 * WHAT THIS DOES NOT DO. It cannot tell whether the Thai text actually says
 * the same thing as the English, only whether both slots are filled in.
 * Content correctness across languages is a human review question
 * (`docs/EDITING.md`: "write natively, never translate mechanically"); this
 * only catches the field that never got written at all.
 */
import type { Locale } from "@/lib/i18n";

/** A field's value in each locale. Either side may be absent. */
export type LocalizedText = Partial<Record<Locale, string | null | undefined>>;

export type ParityField = {
  /**
   * Where this field lives, in a form an officer can act on: `"title"`,
   * `"sections[2].heading"`, `"figure.alt"`. Never the field's own content,
   * only its location, so this never carries anything a reader wrote.
   */
  path: string;
  value: LocalizedText;
  /**
   * Set false for a field that is legitimately locale-specific (for example
   * a locale-only external link). Defaults to true: most reader-facing
   * fields on a bilingual site have no legitimate reason to exist in one
   * locale only (principle 14).
   */
  required?: boolean;
};

export type ParityFinding = {
  path: string;
  /** The locale that IS missing the field, not the one that has it. */
  locale: Locale;
  message: Record<Locale, string>;
};

const localeName: Record<Locale, string> = { en: "English", th: "ไทย" };

function isBlank(value: string | null | undefined): boolean {
  return value === undefined || value === null || value.trim() === "";
}

function findingFor(path: string, missingLocale: Locale): ParityFinding {
  return {
    path,
    locale: missingLocale,
    message: {
      en: `"${path}" is missing its ${localeName[missingLocale]} text. Add it before publishing.`,
      th: `ฟิลด์ "${path}" ยังไม่มีข้อความภาษา${localeName[missingLocale]} โปรดเพิ่มก่อนเผยแพร่`,
    },
  };
}

/**
 * Every parity problem across a document's fields, in the order given.
 *
 * A field with content in exactly one locale fails: the finding names the
 * PATH and the LOCALE that is missing, per the wave brief ("report WHICH
 * field is missing in WHICH locale, not just that something is wrong").
 *
 * A field blank in BOTH locales is deliberately not reported here. That is
 * a required-field problem ("nothing was written yet"), not a parity
 * problem ("one language was written and the other was not"), and
 * conflating the two would make the parity message lie about what is
 * actually wrong. A schema's own required-field validation catches the
 * both-blank case; `bilingualParityFindings` catches the one this file
 * exists for.
 */
export function checkBilingualParity(fields: ParityField[]): ParityFinding[] {
  const findings: ParityFinding[] = [];

  for (const field of fields) {
    if (field.required === false) continue;

    const missing = (["en", "th"] as const).filter((locale) => isBlank(field.value[locale]));
    if (missing.length !== 1) continue; // both present, or both blank: not a parity finding

    findings.push(findingFor(field.path, missing[0]!));
  }

  return findings;
}

/**
 * Bilingual parity is publish-blocking, always (principle 14, §10: "not a
 * review convention"). Unlike house style, there is no advisory tier here:
 * a field missing a locale is never a matter of editorial judgement.
 */
export function blocksPublication(findings: ParityFinding[]): boolean {
  return findings.length > 0;
}

/**
 * Group findings by locale, for a summary count ("3 fields missing Thai").
 * Used by the integrity cron, which reports counts rather than the findings
 * themselves (never document content).
 */
export function countByLocale(findings: ParityFinding[]): Record<Locale, number> {
  return {
    en: findings.filter((f) => f.locale === "en").length,
    th: findings.filter((f) => f.locale === "th").length,
  };
}
