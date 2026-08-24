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
 * The full seed (REDESIGN-2.0 §3.6: "external links are a registered
 * content type"; Wave 6E). Generated by `node scripts/seed-external-links.mjs`,
 * a deterministic sweep of every `content/**` file and every
 * `app/[lang]/**\/page.tsx`, deduplicated by URL and sorted by id (see that
 * script's file header for the full extraction and classification rules,
 * including why five specific unstable-host patterns the scope audit named
 * by name are pulled back in past this file's own `EXCLUDED_HOST_FRAGMENTS`
 * noise filter). Re-run that script whenever content changes and diff its
 * output against this array; `docs/migration/external-link-seed-report.md`,
 * written by the same run, lists which entries below are the audit's
 * flagged unstable links and which entries have a label that fell back to a
 * bare hostname because no locale's own source text linked the URL with
 * visible anchor text (a gap for an officer or Wave 7 to fill with a real
 * label, never invented or machine-translated here).
 *
 * Three entries (`oia-tu-ac-th`, `polsci-tu-ac-th`, `reg-tu-ac-th`) keep
 * hand-written labels from this file's original three-entry placeholder
 * seed rather than the sweep's hostname fallback, because a human already
 * reviewed and wrote a proper bilingual label for each and the sweep has no
 * way to know that from the `.ts` source alone. Every other entry's label
 * is exactly what the sweep produced.
 *
 * `owner` is assigned to the portfolio whose remit matches the `body`
 * (`BODY_TO_PORTFOLIO` in the seeding script), which still needs a human
 * check: a machine can guess which institution a link belongs to, not which
 * BIRSA officer should notice when it breaks. `other`-bodied links (the
 * majority: course review staff profile pages, one-off event forms, source
 * documents cited in Smart Answers, and the audit's flagged unstable links)
 * default to `secretariat`, BIRSA's general point of contact, pending that
 * same human review.
 */
export const SEEDED_EXTERNAL_LINKS: ExternalLinkRegisterEntry[] = [
  {
    id: "aka-ms-mfasetup",
    url: "https://aka.ms/mfasetup",
    owner: "secretariat",
    body: "other",
    label: { en: "aka.ms", th: "aka.ms" },
    lastCheckedAt: null,
  },
  {
    id: "booking-library-tu-ac-th",
    url: "https://booking.library.tu.ac.th",
    owner: "secretariat",
    body: "other",
    label: { en: "booking.library.tu.ac.th", th: "booking.library.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "docs-google-com-spreadsheets-d-1njoqvregi3ja7-xjys1rae8hwuww4vz5ls56-d8ydnq-edit",
    url: "https://docs.google.com/spreadsheets/d/1nJOQvregi3ja7_xJYs1RAe8HWuWW4vZ5ls56_D8YdNQ/edit?usp=sharing",
    owner: "secretariat",
    body: "other",
    label: { en: "docs.google.com", th: "docs.google.com" },
    lastCheckedAt: null,
  },
  {
    id: "drive-google-com-file-d-1-88fsuuc4vrkaao-wqytyrolafm6qge9-view",
    url: "https://drive.google.com/file/d/1-88fSuUc4VrKAAO-wQytYRoLaFM6qge9/view?usp=sharing",
    owner: "secretariat",
    body: "other",
    label: { en: "drive.google.com", th: "drive.google.com" },
    lastCheckedAt: null,
  },
  {
    id: "facebook-com-permalink-php",
    url: "https://www.facebook.com/permalink.php?story_fbid=1139583574836463&id=100063544931301&locale=th_TH",
    owner: "secretariat",
    body: "other",
    label: { en: "www.facebook.com", th: "www.facebook.com" },
    lastCheckedAt: null,
  },
  {
    id: "forms-gle-jk4sk2aghrvna4hj7",
    url: "https://forms.gle/Jk4Sk2agHRvna4hJ7",
    owner: "secretariat",
    body: "other",
    label: { en: "online form", th: "แบบฟอร์มออนไลน์" },
    lastCheckedAt: null,
  },
  {
    id: "forms-gle-kbgmpzxt4to6nn9k6",
    url: "https://forms.gle/kbgMpZXt4To6NN9K6",
    owner: "secretariat",
    body: "other",
    label: { en: "online form", th: "แบบฟอร์มออนไลน์" },
    lastCheckedAt: null,
  },
  {
    id: "forms-gle-m5oyslm3wsu9c8cq7",
    url: "https://forms.gle/M5oysLm3wSu9c8CQ7",
    owner: "secretariat",
    body: "other",
    label: { en: "Secured Internship Form", th: "Secured Internship Form" },
    lastCheckedAt: null,
  },
  {
    id: "forms-gle-uzhan9qiwb3mgdcu9",
    url: "https://forms.gle/UzhAN9qiWb3mGdCu9",
    owner: "secretariat",
    body: "other",
    label: { en: "Internship Request Form", th: "Internship Request Form" },
    lastCheckedAt: null,
  },
  {
    id: "google-com",
    url: "https://www.google.com",
    owner: "secretariat",
    body: "other",
    label: { en: "www.google.com", th: "www.google.com" },
    lastCheckedAt: null,
  },
  {
    id: "happy-relationflip-com-registeruniversity",
    url: "https://happy.relationflip.com/registerUniversity",
    owner: "secretariat",
    body: "other",
    label: {
      en: "happy.relationflip.com/registerUniversity",
      th: "happy.relationflip.com/registerUniversity",
    },
    lastCheckedAt: null,
  },
  {
    id: "ict-tu-ac-th",
    url: "https://ict.tu.ac.th",
    owner: "secretariat",
    body: "other",
    label: { en: "ict.tu.ac.th", th: "ict.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "ict-tu-ac-th-index-php-th-it-ict-personnel-information-system-tu-application-store",
    url: "https://ict.tu.ac.th/index.php/th/it-ict/personnel-information-system/tu-application-store",
    owner: "secretariat",
    body: "other",
    label: { en: "ict.tu.ac.th", th: "ict.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "ilaw-or-th",
    url: "https://ilaw.or.th",
    owner: "secretariat",
    body: "other",
    label: { en: "ilaw.or.th", th: "ilaw.or.th" },
    lastCheckedAt: null,
  },
  {
    id: "image-makewebcdn-com-makeweb-0-fausajslu-document-68-2025-pdf",
    url: "https://image.makewebcdn.com/makeweb/0/fAusajSlU/Document/68_2025.pdf?v=202405291424",
    owner: "secretariat",
    body: "other",
    label: { en: "image.makewebcdn.com", th: "image.makewebcdn.com" },
    lastCheckedAt: null,
  },
  {
    id: "image-makewebcdn-com-makeweb-0-fausajslu-document-eva1-v2026-pdf",
    url: "https://image.makewebcdn.com/makeweb/0/fAusajSlU/Document/Eva1_V2026.pdf",
    owner: "secretariat",
    body: "other",
    label: { en: "PDF", th: "PDF" },
    lastCheckedAt: null,
  },
  {
    id: "image-makewebcdn-com-makeweb-0-fausajslu-document-eva2-v2026-pdf",
    url: "https://image.makewebcdn.com/makeweb/0/fAusajSlU/Document/Eva2_V2026.pdf",
    owner: "secretariat",
    body: "other",
    label: { en: "PDF", th: "PDF" },
    lastCheckedAt: null,
  },
  {
    id: "image-makewebcdn-com-makeweb-0-fausajslu-document-f2-docx",
    url: "https://image.makewebcdn.com/makeweb/0/fAusajSlU/Document/F2_%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B8%9F%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%A1%E0%B8%95%E0%B8%AD%E0%B8%9A%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B9%80%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%9D%E0%B8%B6%E0%B8%81%E0%B8%87%E0%B8%B2%E0%B8%99.docx",
    owner: "secretariat",
    body: "other",
    label: { en: "Word", th: "Word" },
    lastCheckedAt: null,
  },
  {
    id: "image-makewebcdn-com-makeweb-0-fausajslu-document-f2-pdf",
    url: "https://image.makewebcdn.com/makeweb/0/fAusajSlU/Document/F2_%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B8%9F%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%A1%E0%B8%95%E0%B8%AD%E0%B8%9A%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B9%80%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%9D%E0%B8%B6%E0%B8%81%E0%B8%87%E0%B8%B2%E0%B8%99.pdf",
    owner: "secretariat",
    body: "other",
    label: { en: "PDF", th: "PDF" },
    lastCheckedAt: null,
  },
  {
    id: "image-makewebeasy-net-makeweb-0-fausajslu-document-bir-2561-pdf",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/BIR_%E0%B8%A1%E0%B8%84%E0%B8%AD_2561.pdf?v=202012190947",
    owner: "secretariat",
    body: "other",
    label: { en: "image.makewebeasy.net", th: "image.makewebeasy.net" },
    lastCheckedAt: null,
  },
  {
    id: "image-makewebeasy-net-makeweb-0-fausajslu-document-bir-64-pdf",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/BIR_64.pdf?v=202305101549",
    owner: "secretariat",
    body: "other",
    label: { en: "image.makewebeasy.net", th: "image.makewebeasy.net" },
    lastCheckedAt: null,
  },
  {
    id: "image-makewebeasy-net-makeweb-0-fausajslu-document-bir-64-rev66-pdf",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/BIR_64_rev66.pdf?v=202305101549",
    owner: "secretariat",
    body: "other",
    label: { en: "image.makewebeasy.net", th: "image.makewebeasy.net" },
    lastCheckedAt: null,
  },
  {
    id: "image-makewebeasy-net-makeweb-0-fausajslu-document-bir-curr2018-coursedescription-pdf",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/BIR_Curr2018_CourseDescription.pdf",
    owner: "secretariat",
    body: "other",
    label: { en: "image.makewebeasy.net", th: "image.makewebeasy.net" },
    lastCheckedAt: null,
  },
  {
    id: "image-makewebeasy-net-makeweb-0-fausajslu-document-bir-doubledegree-64-pdf",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/BIR_DoubleDegree_64.pdf?v=202012190947",
    owner: "secretariat",
    body: "other",
    label: { en: "image.makewebeasy.net", th: "image.makewebeasy.net" },
    lastCheckedAt: null,
  },
  {
    id: "image-makewebeasy-net-makeweb-0-fausajslu-document-handbook2021-onlineedition-1-pdf",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/Handbook2021_OnlineEdition_1.pdf?v=202012190947",
    owner: "secretariat",
    body: "other",
    label: { en: "image.makewebeasy.net", th: "image.makewebeasy.net" },
    lastCheckedAt: null,
  },
  {
    id: "image-makewebeasy-net-makeweb-0-fausajslu-document-outline-bir-curr-2018-pdf",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/Outline_BIR_Curr_2018.pdf",
    owner: "secretariat",
    body: "other",
    label: { en: "image.makewebeasy.net", th: "image.makewebeasy.net" },
    lastCheckedAt: null,
  },
  {
    id: "image-makewebeasy-net-makeweb-0-fausajslu-document-sample-study-plan-pdf",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/Sample_Study_Plan.pdf",
    owner: "secretariat",
    body: "other",
    label: { en: "image.makewebeasy.net", th: "image.makewebeasy.net" },
    lastCheckedAt: null,
  },
  {
    id: "library-tu-ac-th",
    url: "https://library.tu.ac.th",
    owner: "secretariat",
    body: "other",
    label: { en: "library.tu.ac.th", th: "library.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "library-tu-ac-th-2",
    url: "https://www.library.tu.ac.th",
    owner: "secretariat",
    body: "other",
    label: { en: "www.library.tu.ac.th", th: "www.library.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "litu-tu-ac-th-testing-tu-get",
    url: "https://litu.tu.ac.th/testing/tu-get/",
    owner: "secretariat",
    body: "other",
    label: { en: "litu.tu.ac.th/testing/tu-get", th: "litu.tu.ac.th/testing/tu-get" },
    lastCheckedAt: null,
  },
  {
    id: "md-go-th",
    url: "https://www.md.go.th",
    owner: "secretariat",
    body: "other",
    label: { en: "www.md.go.th", th: "www.md.go.th" },
    lastCheckedAt: null,
  },
  {
    id: "oia-tu-ac-th",
    url: "https://www.oia.tu.ac.th",
    owner: "foreign-students",
    body: "oia",
    label: { en: "Office of International Affairs", th: "กองวิเทศสัมพันธ์" },
    lastCheckedAt: null,
  },
  {
    id: "online-fliphtml5-com-hpjjz-upyn",
    url: "https://online.fliphtml5.com/hpjjz/upyn/",
    owner: "secretariat",
    body: "other",
    label: {
      en: "Thammasat University Student Union, Tha Prachan",
      th: "องค์การนักศึกษามหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์",
    },
    lastCheckedAt: null,
  },
  {
    id: "page-line-me-pib5088f",
    url: "https://page.line.me/pib5088f",
    owner: "secretariat",
    body: "other",
    label: { en: "page.line.me", th: "page.line.me" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th",
    url: "https://polsci.tu.ac.th",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "Faculty of Political Science", th: "คณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-2",
    url: "https://www.polsci.tu.ac.th",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "www.polsci.tu.ac.th", th: "www.polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-assoc-prof-dr-chanintira-na-thalang",
    url: "https://polsci.tu.ac.th/en/team/assoc-prof-dr-chanintira-na-thalang/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-assoc-prof-dr-charles-edward-morgan-thame",
    url: "https://polsci.tu.ac.th/en/team/assoc-prof-dr-charles-edward-morgan-thame/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-assoc-prof-dr-gamolporn-sonsri",
    url: "https://polsci.tu.ac.th/en/team/assoc-prof-dr-gamolporn-sonsri/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-assoc-prof-dr-jittipat",
    url: "https://polsci.tu.ac.th/en/team/assoc-prof-dr-jittipat/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-assoc-prof-dr-m-l-pinitbhand-paribatra",
    url: "https://polsci.tu.ac.th/en/team/assoc-prof-dr-m-l-pinitbhand-paribatra/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-assoc-prof-dr-puli-fuwongcharoen",
    url: "https://polsci.tu.ac.th/en/team/assoc-prof-dr-puli-fuwongcharoen/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-assoc-prof-dr-sikarn-lssarachaiyos",
    url: "https://polsci.tu.ac.th/en/team/assoc-prof-dr-sikarn-lssarachaiyos/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-assoc-prof-dr-sunida-aroonpipat",
    url: "https://polsci.tu.ac.th/en/team/assoc-prof-dr-sunida-aroonpipat/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-assoc-prof-dr-sunisa-chorkaew",
    url: "https://polsci.tu.ac.th/en/team/assoc-prof-dr-sunisa-chorkaew/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-assoc-prof-dr-wasan-luangprapat",
    url: "https://polsci.tu.ac.th/en/team/assoc-prof-dr-wasan-luangprapat/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-asst-prof-dr-ajirapa-pienkhuntod",
    url: "https://polsci.tu.ac.th/en/team/asst-prof-dr-ajirapa-pienkhuntod/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-asst-prof-dr-peera-charoenvattananukul",
    url: "https://polsci.tu.ac.th/en/team/asst-prof-dr-peera-charoenvattananukul/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-asst-prof-dr-prapimphan-chiengkul",
    url: "https://polsci.tu.ac.th/en/team/asst-prof-dr-prapimphan-chiengkul/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-dr-fuadi-pitsuwan",
    url: "https://polsci.tu.ac.th/en/team/dr-fuadi-pitsuwan/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-dr-joseph-lee",
    url: "https://polsci.tu.ac.th/en/team/dr-joseph-lee/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-dr-pongkwan-sawasdipakdi",
    url: "https://polsci.tu.ac.th/en/team/dr-pongkwan-sawasdipakdi/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-dr-siremorn-asvapromtada",
    url: "https://polsci.tu.ac.th/en/team/dr-siremorn-asvapromtada/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-dr-wasin-punthong",
    url: "https://polsci.tu.ac.th/en/team/dr-wasin-punthong/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-iain-cowie",
    url: "https://polsci.tu.ac.th/en/team/iain-cowie/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-prof-dr-amporn-tamronglak",
    url: "https://polsci.tu.ac.th/en/team/prof-dr-amporn-tamronglak/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-prof-dr-attakrit-patchimnan",
    url: "https://polsci.tu.ac.th/en/team/prof-dr-attakrit-patchimnan/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-prof-dr-chalidaporn-songsamphan",
    url: "https://polsci.tu.ac.th/en/team/prof-dr-chalidaporn-songsamphan/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-prof-dr-jaran-maluleem",
    url: "https://polsci.tu.ac.th/en/team/prof-dr-jaran-maluleem/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-prof-dr-kitti-prasirtsuk",
    url: "https://polsci.tu.ac.th/en/team/prof-dr-kitti-prasirtsuk/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-r-chayanit-poonyarat",
    url: "https://polsci.tu.ac.th/en/team/r-chayanit-poonyarat/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-en-team-rebecca-anne-goncharoff-2",
    url: "https://polsci.tu.ac.th/en/team/rebecca-anne-goncharoff-2/",
    owner: "academic-affairs",
    body: "faculty-office",
    label: { en: "polsci.tu.ac.th", th: "polsci.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "polsci-tu-ac-th-oia-polsci",
    url: "http://www.polsci.tu.ac.th/oia.polsci",
    owner: "academic-affairs",
    body: "faculty-office",
    label: {
      en: "http://www.polsci.tu.ac.th/oia.polsci",
      th: "http://www.polsci.tu.ac.th/oia.polsci",
    },
    lastCheckedAt: null,
  },
  {
    id: "reg-tu-ac-th",
    url: "https://www.reg.tu.ac.th",
    owner: "academic-affairs",
    body: "registrar",
    label: { en: "Thammasat Registrar", th: "สำนักทะเบียน มหาวิทยาลัยธรรมศาสตร์" },
    lastCheckedAt: null,
  },
  {
    id: "reg-tu-ac-th-2",
    url: "https://www.reg.tu.ac.th/",
    owner: "academic-affairs",
    body: "registrar",
    label: { en: "www.reg.tu.ac.th", th: "www.reg.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "sa-tu-ac-th-oth-satu-booking-menu-booking",
    url: "https://sa.tu.ac.th/oth/SATU_booking/MENU_booking/",
    owner: "secretariat",
    body: "other",
    label: { en: "SATU booking system", th: "ระบบจองห้อง SATU" },
    lastCheckedAt: null,
  },
  {
    id: "satu-colorpack-net-index-php-th-student-services-accident-insurance",
    url: "http://satu.colorpack.net/index.php/th/student-services/accident-insurance",
    owner: "secretariat",
    body: "other",
    label: { en: "satu.colorpack.net", th: "satu.colorpack.net" },
    lastCheckedAt: null,
  },
  {
    id: "support-microsoft-com-en-us-account-billing-download-and-install-the-microsoft-authenticator-app-351498fc-850a-45da-b7b6-27e523b8702a",
    url: "https://support.microsoft.com/en-us/account-billing/download-and-install-the-microsoft-authenticator-app-351498fc-850a-45da-b7b6-27e523b8702a",
    owner: "secretariat",
    body: "other",
    label: { en: "support.microsoft.com", th: "support.microsoft.com" },
    lastCheckedAt: null,
  },
  {
    id: "thaipbs-or-th-news-content-509403",
    url: "https://www.thaipbs.or.th/news/content/509403",
    owner: "secretariat",
    body: "other",
    label: { en: "www.thaipbs.or.th", th: "www.thaipbs.or.th" },
    lastCheckedAt: null,
  },
  {
    id: "tlhr2014-com",
    url: "https://tlhr2014.com",
    owner: "secretariat",
    body: "other",
    label: { en: "tlhr2014.com", th: "tlhr2014.com" },
    lastCheckedAt: null,
  },
  {
    id: "tu-ac-th",
    url: "https://tu.ac.th",
    owner: "secretariat",
    body: "other",
    label: { en: "tu.ac.th", th: "tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "tu-ac-th-2",
    url: "https://www.tu.ac.th",
    owner: "secretariat",
    body: "other",
    label: { en: "www.tu.ac.th", th: "www.tu.ac.th" },
    lastCheckedAt: null,
  },
  {
    id: "userservice-library-tu-ac-th-u-services",
    url: "https://userservice.library.tu.ac.th/u-services/",
    owner: "secretariat",
    body: "other",
    label: {
      en: "userservice.library.tu.ac.th/u-services",
      th: "userservice.library.tu.ac.th/u-services",
    },
    lastCheckedAt: null,
  },
  {
    id: "wapi-reg-tu-ac-th-uploads-content--69-pdf",
    url: "https://wapi.reg.tu.ac.th/uploads/content/%E0%B8%9B%E0%B8%8F%E0%B8%B4%E0%B8%97%E0%B8%B4%E0%B8%99%20%E0%B8%9B.%E0%B8%95%E0%B8%A3%E0%B8%B5%20%E0%B9%82%E0%B8%84%E0%B8%A3%E0%B8%87%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%9B%E0%B8%81%E0%B8%95%E0%B8%B4%2069.pdf",
    owner: "academic-affairs",
    body: "registrar",
    label: { en: "wapi.reg.tu.ac.th", th: "wapi.reg.tu.ac.th" },
    lastCheckedAt: null,
  },
];
