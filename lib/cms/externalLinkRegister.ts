/**
 * The external link register (REDESIGN-2.0 §3.6, §10).
 *
 * §3.6's whole argument for letting BIRSA stop republishing university and
 * TU-wide pages is that the alternative, BIRSA restating them, goes stale
 * silently and a student acts on the stale copy. Trading forty pages for
 * forty external links only pays off if the links are watched:
 *
 *   "External links are a registered content type, with the owning
 *   portfolio and the body they point at... The daily cron checks them and
 *   raises a dead or redirecting link to the owning portfolio."
 *
 * This file is the register's data model: the vocabulary of bodies BIRSA
 * signposts to, the entry shape, and a way to SEED entries from the links
 * already sitting in 1.0's content. Checking whether a registered entry
 * still resolves is `lib/cms/validation/linkIntegrity.ts`, which takes
 * entries from here (or from wherever Wave 3's schema ends up storing them)
 * and an injected `fetch`.
 *
 * WHY A STANDALONE TYPESCRIPT REGISTER RATHER THAN A SANITY DOCUMENT TYPE.
 * This wave owns the validation library, not `sanity/schemaTypes/`, and no
 * schema type for "external link" exists in this checkout yet (Waves 3B to
 * 3D, running in parallel, have not created one; see this wave's report for
 * the seam it needs). A register that only works once that schema type
 * ships is a register nobody can check today. `content/quick.ts` and
 * `content/committee.ts` already prove the pattern this repository uses
 * for "structured content an officer edits, that is not MDX and does not
 * need a database": a typed array in `content/`. `SEEDED_EXTERNAL_LINKS`
 * below is exactly that shape, and it is real, checkable data from the day
 * this file lands. If a later wave adds a matching Sanity document type,
 * that type can supply `ExternalLinkRegisterEntry` records the same shape
 * and the checker in `linkIntegrity.ts` does not change at all.
 */
import type { Locale } from "@/lib/i18n";
import type { PortfolioId } from "@/lib/portfolios";

/**
 * The institutional bodies §3.6 names as delegation targets, plus `other`
 * for anything genuinely outside that list (a source document, a partner
 * university, a news outlet cited in a Smart Answer).
 */
export const externalLinkBodies = [
  "tusu",
  "tusc",
  "registrar",
  "oia",
  "health-service",
  "faculty-office",
  "other",
] as const;

export type ExternalLinkBody = (typeof externalLinkBodies)[number];

export type ExternalLinkRegisterEntry = {
  /** Stable id, e.g. a slug. Used to de-duplicate and to name the entry in
   * cron output; never the URL or the page content. */
  id: string;
  url: string;
  /** The portfolio the daily cron raises a dead or redirecting link to. */
  owner: PortfolioId;
  body: ExternalLinkBody;
  /** What the link is called in the console alert, in both locales. */
  label: Record<Locale, string>;
  /** ISO datetime of the last cron check, or null before the first run. */
  lastCheckedAt: string | null;
};

/**
 * Domains known to belong to a §3.6 body, matched by substring. Deliberately
 * short and deliberately not claimed as exhaustive: a domain that does not
 * match falls into `"other"` rather than being guessed at, because a wrong
 * guess here assigns a link to the wrong portfolio, which is worse than an
 * officer assigning it by hand once.
 */
const BODY_DOMAIN_HINTS: Array<{ body: ExternalLinkBody; hints: string[] }> = [
  { body: "registrar", hints: ["reg.tu.ac.th"] },
  { body: "oia", hints: ["oia.tu.ac.th"] },
  { body: "faculty-office", hints: ["polsci.tu.ac.th"] },
  { body: "health-service", hints: ["med.tu.ac.th", "hospital.tu.ac.th"] },
  { body: "tusu", hints: ["tusu.tu.ac.th", "tusu.org"] },
  { body: "tusc", hints: ["tusc.tu.ac.th", "tusc.org"] },
];

function guessBody(url: string): ExternalLinkBody {
  const lower = url.toLowerCase();
  for (const { body, hints } of BODY_DOMAIN_HINTS) {
    if (hints.some((hint) => lower.includes(hint))) return body;
  }
  return "other";
}

/**
 * Hosts worth excluding from a seed pass: social platforms, form and
 * document sharing links, and BIRSA's own domains. None of these are the
 * "restating a university page" risk §3.6 is about, and treating an
 * Instagram post or a one-off Google Form as a link the cron must watch
 * forever produces noise an officer learns to ignore.
 */
const EXCLUDED_HOST_FRAGMENTS = [
  "instagram.com",
  "facebook.com",
  "tiktok.com",
  "youtube.com",
  "x.com",
  "linktr.ee",
  "forms.gle",
  "docs.google.com",
  "drive.google.com",
  "birsa.",
  "birpolsci.com",
];

const URL_PATTERN = /https?:\/\/[^\s"'<>)\]]+/g;

/**
 * Pure text scanner: every external URL in a string, excluding the hosts in
 * `EXCLUDED_HOST_FRAGMENTS`. Kept separate from the filesystem walk below so
 * it can be unit tested without touching disk.
 */
export function extractExternalUrls(text: string): string[] {
  const found = text.match(URL_PATTERN) ?? [];
  const kept = found.filter((url) => {
    const lower = url.toLowerCase();
    return !EXCLUDED_HOST_FRAGMENTS.some((fragment) => lower.includes(fragment));
  });
  return [...new Set(kept)];
}

export type ExternalLinkCandidate = {
  url: string;
  /** Repository-relative path the URL was found in, so an officer can find
   * the context. Never the surrounding text. */
  sourceFile: string;
  guessedBody: ExternalLinkBody;
};

/**
 * Turn a set of `{ file, text }` pairs into deduplicated register
 * candidates, answering the wave brief's question directly: yes, the
 * register can be seeded from existing 1.0 content, by scanning it for
 * external links exactly like this.
 *
 * Takes the file contents already read, rather than reading the filesystem
 * itself, so this stays a pure function the tests can call directly with
 * fixture strings; a caller wiring this to the real `content/` tree (a
 * one-off migration script, not part of the build or the tests) supplies
 * the pairs with `node:fs`.
 */
export function seedExternalLinkCandidates(
  files: Array<{ path: string; text: string }>
): ExternalLinkCandidate[] {
  const seen = new Map<string, ExternalLinkCandidate>();

  for (const file of files) {
    for (const url of extractExternalUrls(file.text)) {
      if (seen.has(url)) continue;
      seen.set(url, { url, sourceFile: file.path, guessedBody: guessBody(url) });
    }
  }

  return [...seen.values()];
}

/**
 * A small, real, checkable starting register. These entries are seeded from
 * `content/site.ts`, `content/student-life/en/handbook/about-bir.mdx`, and
 * `content/smart-answers/topics/*` (found by running
 * `seedExternalLinkCandidates` against this repository's own content; see
 * this wave's report for the exact command). `owner` is assigned to the
 * portfolio whose remit matches the body, which still needs a human check:
 * a machine can guess which institution a link belongs to, not which BIRSA
 * officer should notice when it breaks.
 */
export const SEEDED_EXTERNAL_LINKS: ExternalLinkRegisterEntry[] = [
  {
    id: "registrar-home",
    url: "https://www.reg.tu.ac.th",
    owner: "academic-affairs",
    body: "registrar",
    label: { en: "Thammasat Registrar", th: "สำนักทะเบียน มหาวิทยาลัยธรรมศาสตร์" },
    lastCheckedAt: null,
  },
  {
    id: "oia-home",
    url: "https://www.oia.tu.ac.th",
    owner: "foreign-students",
    body: "oia",
    label: { en: "Office of International Affairs", th: "กองวิเทศสัมพันธ์" },
    lastCheckedAt: null,
  },
  {
    id: "faculty-polsci-home",
    url: "https://polsci.tu.ac.th",
    owner: "academic-affairs",
    body: "faculty-office",
    label: {
      en: "Faculty of Political Science",
      th: "คณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์",
    },
    lastCheckedAt: null,
  },
];
