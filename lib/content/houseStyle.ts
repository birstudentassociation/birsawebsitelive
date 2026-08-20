/**
 * BIRSA house style, as one implementation (REDESIGN-2.0 §10).
 *
 * FROZEN CONTRACT. Wave 0 owns this file.
 *
 * §10: "House style is validation too. The rule set lives in one
 * `lib/content/houseStyle.ts`, used by the Sanity validation, the build check
 * and any remaining git-authored content, so the three cannot disagree."
 *
 * That last clause is the whole design. Three implementations of one rule is
 * three rules, and the one an officer meets in the editor is the only one that
 * changes anybody's behaviour. Roadmap §4B asks for exactly this: "an inline
 * error next to the field, in the editor's own language, that they can fix
 * themselves in five seconds."
 *
 * So every check here is a pure function over a string, returning findings
 * with a bilingual message and a character offset. The Studio renders them
 * inline, the build check prints them, and the unit tests assert them, all
 * from this file.
 *
 * The rules come from `docs/NEWS-STYLE.md` and `docs/EDITING.md`, which are
 * the standard; this file is only their machine-readable form. Where the two
 * documents are stricter than GOV.UK, they win, and the reason is recorded
 * beside the rule rather than left to memory.
 *
 * WHAT THIS CANNOT DO, stated plainly because §13 lists it as a risk: the
 * parity assertion catches absence but not badness. Nothing here can tell
 * whether Thai copy reads as Thai or as translated English. Human review is
 * the control for that (§11.7), and no amount of validation replaces it.
 */
import type { Locale } from "@/lib/i18n";

export type HouseStyleRuleId =
  "em-dash" | "en-dash" | "colon" | "click-here" | "heading-title-case" | "heading-full-stop";

export type HouseStyleFinding = {
  rule: HouseStyleRuleId;
  /** Character offset into the checked string, so the editor can highlight it. */
  at: number;
  /** The offending text, for the message. */
  text: string;
  /** Shown next to the field, in the editor's own language. */
  message: Record<Locale, string>;
};

export type CheckOptions = {
  /**
   * Headings take two extra rules and forbid a trailing full stop. Body copy
   * takes neither, because a sentence in body copy is supposed to end.
   */
  isHeading?: boolean;
};

/** Clock times: `09:30`, `9:30`. The one place a colon is allowed in prose. */
const CLOCK_TIME = /\d{1,2}:\d{2}/g;
/** URLs, the other place. Matched loosely; the point is to skip the colon. */
const URL_LIKE = /\b[a-z][a-z0-9+.-]*:\/\/\S+|\bmailto:\S+/gi;

/**
 * Blank out the spans where a colon is legitimate, keeping the string the same
 * length so every offset reported afterwards still points at the right
 * character. Replacing with spaces rather than deleting is what makes the
 * offsets usable by the editor.
 */
function maskAllowedColons(text: string): string {
  let masked = text;
  for (const pattern of [URL_LIKE, CLOCK_TIME]) {
    masked = masked.replace(pattern, (match) => " ".repeat(match.length));
  }
  return masked;
}

function finding(
  rule: HouseStyleRuleId,
  at: number,
  text: string,
  en: string,
  th: string
): HouseStyleFinding {
  return { rule, at, text, message: { en, th } };
}

/**
 * Every house style problem in a string, in the order they appear.
 *
 * Returns all of them rather than the first, for the same reason
 * `validateServiceDefinition` does: an officer fixing one error at a time
 * across six round trips gives up.
 */
export function checkHouseStyle(text: string, options: CheckOptions = {}): HouseStyleFinding[] {
  const findings: HouseStyleFinding[] = [];

  // --- Dashes. A hard site rule, not a preference (NEWS-STYLE §2, EDITING).
  // The em dash had become the site's default connector, doing several
  // unrelated jobs at once. A full stop, a comma, or two sentences all say
  // what it was saying, and say which one they mean.
  for (const match of text.matchAll(/—/g)) {
    findings.push(
      finding(
        "em-dash",
        match.index,
        "—",
        "Do not use an em dash. Use a full stop, a comma, or two sentences.",
        "ห้ามใช้เครื่องหมาย em dash ให้ใช้จุด จุลภาค หรือแยกเป็นสองประโยคแทน"
      )
    );
  }
  for (const match of text.matchAll(/–/g)) {
    findings.push(
      finding(
        "en-dash",
        match.index,
        "–",
        'Do not use an en dash. For a range, write "10 to 14 August".',
        'ห้ามใช้เครื่องหมาย en dash หากเป็นช่วง ให้เขียนว่า "10 ถึง 14 สิงหาคม"'
      )
    );
  }

  // --- Colons. Stricter than GOV.UK, which permits one on a bullet lead-in.
  // NEWS-STYLE §2.6 records why: the colon had quietly become the site's
  // default connector, and a flat ban is easier to hold than a nuanced one.
  const masked = maskAllowedColons(text);
  for (const match of masked.matchAll(/:/g)) {
    findings.push(
      finding(
        "colon",
        match.index,
        ":",
        "Do not use a colon outside clock times and URLs. A full stop or a lead-in phrase does the job.",
        "ห้ามใช้เครื่องหมายทวิภาค ยกเว้นในเวลานาฬิกาและ URL ให้ใช้จุดหรือวลีนำแทน"
      )
    );
  }

  // --- Link text. WCAG 2.4.4 and 2.4.9 both, and a screen reader user
  // listing the links on a page hears "click here" five times.
  for (const match of text.matchAll(/\b(click here|read more|here)\b(?=\s*$|\s*[).,])/gi)) {
    if (match[1]!.toLowerCase() === "here" && match.index > 0) {
      // "here" alone is only a problem as link text, which the caller knows
      // and this function does not. Skip it unless the whole string is it.
      if (text.trim().toLowerCase() !== "here") continue;
    }
    findings.push(
      finding(
        "click-here",
        match.index,
        match[0]!,
        'Link text must say where it goes. Write "read the club rules", never "click here".',
        'ข้อความลิงก์ต้องบอกปลายทาง ให้เขียนว่า "อ่านระเบียบชมรม" ไม่ใช่ "คลิกที่นี่"'
      )
    );
  }

  if (options.isHeading) {
    // Sentence case except proper nouns (English only; Thai has no letter
    // case, so this rule cannot fire on Thai and correctly does not try).
    const words = [...text.matchAll(/\b[A-Z][a-z]{2,}/g)];
    // The first word of a heading is capitalised in sentence case too, so a
    // heading only fails when a LATER word is capitalised and is not a known
    // proper noun. Proper nouns are unknowable here, so this reports rather
    // than blocks: it is a hint in the editor, not a publish gate.
    for (const match of words.slice(1)) {
      if (PROPER_NOUNS.has(match[0]!)) continue;
      findings.push(
        finding(
          "heading-title-case",
          match.index,
          match[0]!,
          `Headings are sentence case. Check whether "${match[0]}" is a proper noun.`,
          `หัวข้อใช้ตัวพิมพ์แบบประโยค โปรดตรวจสอบว่า "${match[0]}" เป็นคำวิสามานยนามหรือไม่`
        )
      );
    }

    const trimmed = text.trimEnd();
    if (trimmed.endsWith(".")) {
      findings.push(
        finding(
          "heading-full-stop",
          trimmed.length - 1,
          ".",
          "A heading takes no full stop.",
          "หัวข้อไม่ต้องมีจุดปิดท้าย"
        )
      );
    }
  }

  return findings.sort((a, b) => a.at - b.at);
}

/**
 * Proper nouns that legitimately carry a capital mid-heading. Deliberately
 * short: a long list becomes a way to silence the rule rather than obey it,
 * and the rule is a hint anyway.
 */
const PROPER_NOUNS = new Set([
  "Bangkok",
  "Thai",
  "Thailand",
  "Thammasat",
  "Rangsit",
  "Prachan",
  "English",
  "Instagram",
  "Facebook",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
  "April",
  "June",
  "July",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

/**
 * The rules that BLOCK publication, as opposed to the ones that only warn.
 *
 * §6.5 step 3 blocks publishing on a house style violation, but a rule that
 * cannot tell a proper noun from a mistake must not be one of them, or the
 * first officer to write "Welcome week at Thammasat" is stuck with no way
 * forward and no developer to ask. A hint they can read and ignore is the
 * right shape for that rule; a block is the right shape for a dash.
 */
export const blockingRules: HouseStyleRuleId[] = ["em-dash", "en-dash", "colon", "click-here"];

export function blocksPublication(findings: HouseStyleFinding[]): boolean {
  return findings.some((f) => blockingRules.includes(f.rule));
}
