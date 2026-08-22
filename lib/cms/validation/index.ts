/**
 * The validation library's public surface (REDESIGN-2.0 §10, §3.6, §6.5).
 *
 * Each concern lives in its own file, per `docs/CMS-SCHEMA-CONVENTIONS.md`
 * §1's "one file per domain": `bilingualParity`, `houseStyle`,
 * `linkIntegrity`, `staleness`. Several of those files export a
 * `blocksPublication` with a different signature, so this barrel re-exports
 * each as a namespace rather than flattening with `export *`, which would
 * silently collide.
 *
 * This file also holds the one piece of genuinely generic code in the
 * library: a scanner that finds every bilingual field in an arbitrary
 * document WITHOUT knowing that document's schema. It exists because this
 * wave owns no schema files (`sanity/schemaTypes/` belongs to Waves 3B to
 * 3D) and cannot know a document's exact field names, but `docs/CMS-SCHEMA-
 * CONVENTIONS.md` §3 and `components/bds/imageContract.ts`'s own `alt: {
 * en: string; th: string }` shape both confirm the site's one convention
 * for a bilingual field: an object carrying `en` and `th` keys, side by
 * side, on one document. Walking a document for that shape is schema
 * agnostic by construction: it works against whatever field names Waves 3B
 * to 3D chose, because it never needs to know them in advance.
 */
import type { Locale } from "@/lib/i18n";
import { checkBilingualParity, blocksPublication as parityBlocks } from "./bilingualParity";
import type { ParityField, ParityFinding } from "./bilingualParity";
import { checkHouseStyleFields, blocksPublication as houseStyleBlocks } from "./houseStyle";
import type { HouseStyleFinding } from "./houseStyle";

export * as bilingualParity from "./bilingualParity";
export * as houseStyle from "./houseStyle";
export * as linkIntegrity from "./linkIntegrity";
export * as staleness from "./staleness";

export type { ParityField, ParityFinding, LocalizedText } from "./bilingualParity";
export type { HouseStyleFieldInput, HouseStyleFinding } from "./houseStyle";
export type {
  InternalLinkCheck,
  InternalLinkFinding,
  LinkResolver,
  ExternalLinkFinding,
  FetchLike,
} from "./linkIntegrity";
export type { StalenessSubject, StalenessReportEntry } from "./staleness";

// ---------------------------------------------------------------------------
// The generic bilingual-field scanner
// ---------------------------------------------------------------------------

const IGNORED_KEYS = new Set([
  "_type",
  "_key",
  "_id",
  "_rev",
  "_createdAt",
  "_updatedAt",
  "_ref",
  "_weak",
  "_strengthenOnPublish",
]);

const MAX_SCAN_DEPTH = 12;

/**
 * Best-effort plain text extraction. Handles the two shapes a field under
 * `en`/`th` actually takes on this site: a plain string (titles, summaries,
 * alt text, labels), or a Sanity Portable Text array (rich text bodies),
 * from which the visible text of each block's spans is joined. Anything
 * else (a number, a nested object with no text of its own) is not a text
 * field and returns `undefined`, which the caller treats as "not a
 * bilingual text field" rather than as "blank".
 */
function toPlainText(value: unknown): string | null | undefined {
  if (value === undefined || value === null) return value;
  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    const isPortableText = value.every(
      (block) => typeof block === "object" && block !== null && "children" in (block as object)
    );
    if (!isPortableText || value.length === 0) return undefined;

    return value
      .map((block) => {
        const children = (block as { children?: unknown }).children;
        if (!Array.isArray(children)) return "";
        return children
          .map((span) => {
            const text = (span as { text?: unknown } | null)?.text;
            return typeof text === "string" ? text : "";
          })
          .join("");
      })
      .join("\n")
      .trim();
  }

  return undefined;
}

/**
 * Walk an arbitrary Sanity document (or any plain object) and return every
 * field shaped like `{ en, th, ... }`, as `ParityField`s ready for
 * `bilingualParity.checkBilingualParity` and, after converting to
 * `HouseStyleFieldInput`, `houseStyle.checkHouseStyleFields`.
 *
 * Recursion stops at a localized field once found: a `{ en, th }` object is
 * a leaf for this purpose even if `en`/`th` are themselves objects (rare,
 * but nothing here assumes it cannot happen), because there is no further
 * bilingual pairing to find inside one locale's own value.
 */
export function extractLocalizedFields(value: unknown, path = "", depth = 0): ParityField[] {
  if (depth > MAX_SCAN_DEPTH || value === null || typeof value !== "object") return [];

  if (Array.isArray(value)) {
    return value.flatMap((item, i) => extractLocalizedFields(item, `${path}[${i}]`, depth + 1));
  }

  const obj = value as Record<string, unknown>;
  const hasLocaleKeys = "en" in obj || "th" in obj;

  if (hasLocaleKeys) {
    const en = toPlainText(obj.en);
    const th = toPlainText(obj.th);
    if (en !== undefined || th !== undefined) {
      return [{ path: path || "(root)", value: { en, th } }];
    }
  }

  const results: ParityField[] = [];
  for (const [key, v] of Object.entries(obj)) {
    if (IGNORED_KEYS.has(key)) continue;
    results.push(...extractLocalizedFields(v, path ? `${path}.${key}` : key, depth + 1));
  }
  return results;
}

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------

export type DocumentValidationResult = {
  parity: ParityFinding[];
  houseStyle: HouseStyleFinding[];
  blocksPublication: boolean;
};

/**
 * Run bilingual parity and house style over every bilingual field of an
 * arbitrary document, using the generic scanner above. This is the function
 * the integrity cron calls per document: one call, no schema-specific code
 * needed on either side.
 *
 * `isHeadingPath` lets a caller who DOES know the schema mark specific paths
 * as headings, to get the two extra heading checks from
 * `lib/content/houseStyle.ts`. Omit it and every field is checked as body
 * copy, which under-checks headings slightly rather than over-blocking one
 * that happens to start with a capital letter.
 */
export function validateBilingualDocument(
  doc: unknown,
  isHeadingPath: (path: string) => boolean = () => false
): DocumentValidationResult {
  const fields = extractLocalizedFields(doc);

  const parity = checkBilingualParity(fields);
  const houseStyleFindings = checkHouseStyleFields(
    fields.map((f) => ({ path: f.path, value: f.value, isHeading: isHeadingPath(f.path) }))
  );

  return {
    parity,
    houseStyle: houseStyleFindings,
    blocksPublication: parityBlocks(parity) || houseStyleBlocks(houseStyleFindings),
  };
}

/** Never surfaced directly, kept for callers that only need the locale type. */
export type { Locale };
