/**
 * House style, applied across a document's bilingual fields
 * (REDESIGN-2.0 §10, §6.5 step 3, `docs/NEWS-STYLE.md`, `docs/EDITING.md`).
 *
 * The rule engine itself is `lib/content/houseStyle.ts` (Wave 0, frozen):
 * dashes, colons and "click here" are checked exactly once there, and this
 * file must never re-implement them, or the Studio, the build check and this
 * cron library could disagree, which is the one thing §10 says must not
 * happen. What this file adds is everything that engine cannot do because it
 * only sees one string at a time with no idea what document it came from:
 *
 *   - running it over every field of a document, with a path so an officer
 *     can find the field the finding is about
 *   - separating BLOCKING findings from ADVISORY ones, and saying which is
 *     which
 *   - a small number of additional GOV.UK checks that are mechanically
 *     checkable but that `lib/content/houseStyle.ts` does not attempt
 *
 * SEVERITY, AND WHY. `docs/NEWS-STYLE.md` and `docs/EDITING.md` state some
 * rules as absolute (no dash, no colon outside a clock time or a URL) and
 * others as house style that a reasonable officer sometimes has good reason
 * to deviate from (a title that reads better as one clause than as sentence
 * case, a sentence that runs to 28 words because splitting it would repeat
 * the subject awkwardly). Blocking the first kind is what principle 14 asks
 * for citizens; blocking the second kind is how officers learn to route
 * around the tool. So:
 *
 *   BLOCKING (from `lib/content/houseStyle.ts`'s own `blockingRules`):
 *     em dash, en dash, a colon outside a clock time or a URL, "click here"
 *     style link text.
 *
 *   ADVISORY, always, everywhere, including the checks added in this file:
 *     sentence case in headings, a trailing full stop on a heading, a
 *     sentence over the GOV.UK 25 word guideline, a GOV.UK "weak word"
 *     (`docs/NEWS-STYLE.md` §2.9), and a passive-voice HINT.
 *
 * The passive-voice hint is the clearest example of "be honest about the
 * limit of what a machine can check" from the wave brief. `is/are/was/were
 * + a word ending -ed` catches real passives ("Winners are picked by the
 * judges") and also catches plain adjectives ("the form is completed", "the
 * office is closed"), which are not errors at all. A tool that BLOCKED
 * publishing over that would teach officers to ignore it by the second
 * false positive, so this can only ever be advice, and the message says so.
 */
import type { Locale } from "@/lib/i18n";
import { blockingRules, checkHouseStyle, type HouseStyleRuleId } from "@/lib/content/houseStyle";
import type { LocalizedText } from "./bilingualParity";

export type HouseStyleFieldInput = {
  /** Where this field lives, e.g. `"title"`, `"sections[1].body"`. */
  path: string;
  /** Headings get two extra checks from the underlying engine. */
  isHeading?: boolean;
  value: LocalizedText;
};

export type ExtraRuleId = "long-sentence" | "weak-word" | "passive-voice-hint";

export type HouseStyleFinding = {
  path: string;
  locale: Locale;
  severity: "block" | "advice";
  rule: HouseStyleRuleId | ExtraRuleId;
  /** The offending text, kept short, never the whole field. */
  text: string;
  message: Record<Locale, string>;
};

const SENTENCE_WORD_CEILING = 25;

/**
 * `docs/NEWS-STYLE.md` §2.9: GOV.UK's list of words that sound like activity
 * and carry no information, filtered to the ones that turn up in
 * student-association copy. English only: these are English weasel words,
 * not a translation of a Thai equivalent, and applying an English word list
 * to Thai text would only ever produce noise.
 */
const WEAK_WORDS = [
  "deliver",
  "delivers",
  "delivering",
  "drive",
  "drives",
  "driving",
  "foster",
  "fosters",
  "fostering",
  "facilitate",
  "facilitates",
  "facilitating",
  "empower",
  "empowers",
  "empowering",
  "robust",
  "key",
  "overarching",
  "going forward",
  "utilise",
  "utilize",
  "utilises",
  "utilizes",
  "leverage",
  "leverages",
  "leveraging",
  "collaborate",
  "collaborates",
  "collaborating",
  "engage",
  "engages",
  "engaging",
  "strengthen",
  "strengthens",
  "strengthening",
  "transform",
  "transforms",
  "transforming",
  "tackle",
  "tackles",
  "tackling",
  "promote",
  "promotes",
  "promoting",
  "ensure",
  "ensures",
  "ensuring",
];

const weakWordPattern = new RegExp(`\\b(${WEAK_WORDS.join("|")})\\b`, "gi");

// is/are/was/were/been/being + a word ending "ed". An approximate signal
// for passive voice, not a parser: see the file header for why this can
// only ever be advice.
const PASSIVE_HINT = /\b(is|are|was|were|been|being)\s+(\w+ed)\b/gi;

function finding(
  path: string,
  locale: Locale,
  severity: "block" | "advice",
  rule: HouseStyleRuleId | ExtraRuleId,
  text: string,
  en: string,
  th: string
): HouseStyleFinding {
  return { path, locale, severity, rule, text, message: { en, th } };
}

/** English-only: the GOV.UK checks the underlying engine does not attempt. */
function checkEnglishExtras(path: string, text: string): HouseStyleFinding[] {
  const findings: HouseStyleFinding[] = [];

  for (const match of text.matchAll(weakWordPattern)) {
    findings.push(
      finding(
        path,
        "en",
        "advice",
        "weak-word",
        match[0]!,
        `"${match[0]}" sounds like activity but says little. Consider naming the actual thing that happens.`,
        `"${match[0]}" ฟังดูเหมือนมีกิจกรรมแต่ให้ข้อมูลน้อย ลองเขียนสิ่งที่เกิดขึ้นจริงแทน`
      )
    );
  }

  for (const match of text.matchAll(PASSIVE_HINT)) {
    findings.push(
      finding(
        path,
        "en",
        "advice",
        "passive-voice-hint",
        match[0]!,
        `"${match[0]}" may be passive voice. If a person or body does this, name them: "the judges pick winners", not "winners are picked". This is a hint, not a rule: some matches are just adjectives ("the form is completed") and are fine as written.`,
        `"${match[0]}" อาจเป็นประโยคที่ไม่ระบุผู้กระทำ หากมีผู้กระทำจริง ให้ระบุชื่อ ข้อความนี้เป็นเพียงคำแนะนำ ไม่ใช่กฎ บางกรณีเป็นเพียงคำคุณศัพท์และไม่ผิด`
      )
    );
  }

  // Sentences: split on a period followed by whitespace and a capital
  // letter or end of string, which is rough on purpose. A perfect sentence
  // splitter needs to know abbreviations, clock times and URLs; this only
  // needs to flag the OBVIOUS run-ons, so a rough split that never fires on
  // "etc." mid-sentence is safer than a precise one that mis-splits a URL.
  const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z])/);
  sentences.forEach((sentence, index) => {
    const wordCount = sentence.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > SENTENCE_WORD_CEILING) {
      findings.push(
        finding(
          path,
          "en",
          "advice",
          "long-sentence",
          // Every other rule's `text` is the matched token itself (a dash, a
          // weak word), never a slice of surrounding prose. A run-on
          // sentence has no single matched token, but locating it by a
          // content excerpt would put whatever the officer actually wrote,
          // personal data included, into this finding. "sentence 2 of 5"
          // locates it inside the field without quoting a single word of it.
          `sentence ${index + 1} of ${sentences.length}`,
          `This sentence runs to about ${wordCount} words. GOV.UK style asks for around 25. Consider splitting it.`,
          `ประโยคนี้ยาวประมาณ ${wordCount} คำ รูปแบบ GOV.UK แนะนำประมาณ 25 คำ ลองแยกเป็นสองประโยค`
        )
      );
    }
  });

  return findings;
}

/**
 * Run house style over every field of a document.
 *
 * Returns EVERY finding, blocking and advisory together, each carrying its
 * own severity, so a caller building a publish gate filters on `severity`
 * and a caller building an officer-facing hint panel shows everything.
 */
export function checkHouseStyleFields(fields: HouseStyleFieldInput[]): HouseStyleFinding[] {
  const findings: HouseStyleFinding[] = [];

  for (const field of fields) {
    for (const locale of ["en", "th"] as const) {
      const text = field.value[locale];
      if (text === undefined || text === null || text.trim() === "") continue;

      for (const f of checkHouseStyle(text, { isHeading: field.isHeading })) {
        const severity: "block" | "advice" = blockingRules.includes(f.rule) ? "block" : "advice";
        findings.push(
          finding(field.path, locale, severity, f.rule, f.text, f.message.en, f.message.th)
        );
      }

      if (locale === "en") {
        findings.push(...checkEnglishExtras(field.path, text));
      }
    }
  }

  return findings;
}

export function blocksPublication(findings: HouseStyleFinding[]): boolean {
  return findings.some((f) => f.severity === "block");
}

/** Findings an officer should see but that never stop a publish. */
export function advisoryFindings(findings: HouseStyleFinding[]): HouseStyleFinding[] {
  return findings.filter((f) => f.severity === "advice");
}
