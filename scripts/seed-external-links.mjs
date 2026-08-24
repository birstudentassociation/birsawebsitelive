/**
 * Deterministic seeder for `SEEDED_EXTERNAL_LINKS` in
 * `lib/cms/externalLinkRegister.ts` (REDESIGN-2.0 §3.6, §10; Wave 6E).
 *
 * WHY THIS SCRIPT EXISTS RATHER THAN A HAND-EDITED ARRAY. §3.6's whole
 * argument for letting BIRSA stop republishing university and TU-wide pages
 * is that the alternative goes stale silently. That argument only holds if
 * the register that feeds the daily link-integrity cron is complete, not a
 * hand-picked sample. Four entries, which is what `SEEDED_EXTERNAL_LINKS`
 * held before this wave, is a placeholder, not a register. This script reads
 * the actual 1.0/2.0 corpus and regenerates the seed, so running it twice on
 * an unchanged tree produces byte-identical output (a golden-file test in
 * `tests/unit/external-link-register.test.ts` asserts this) and so a new
 * external link added to content shows up here the next time this runs,
 * rather than only when someone remembers to hand-edit the array.
 *
 * WHY A PLAIN .mjs SCRIPT PARSING TypeScript SOURCE, RATHER THAN IMPORTING
 * `lib/cms/externalLinkRegister.ts` DIRECTLY. This repository has no
 * `tsx`/`ts-node` runtime and this script has no build step of its own, so a
 * `.mjs` file cannot `import` a `.ts` module directly. `scripts/
 * check-contrast.mjs` already establishes the house pattern for this exact
 * problem: read the TypeScript file's own source text and pull the
 * constants out of it with small, targeted regexes, rather than either
 * duplicating the constants by hand (which drifts) or adding a TypeScript
 * runtime just for one script. This file does the same thing for
 * `URL_PATTERN`, `EXCLUDED_HOST_FRAGMENTS` and `BODY_DOMAIN_HINTS`, all of
 * which are frozen (Wave 6E owns only the `SEEDED_EXTERNAL_LINKS` array, per
 * the wave brief, "do not change... the domain helpers"). Parsing the real
 * file means this script cannot silently drift from the register's own
 * rules; a change to those constants is picked up automatically the next
 * time this script runs.
 *
 * WHY THE DEFAULT EXCLUSION LIST IS DELIBERATELY OVERRIDDEN FOR FIVE HOST
 * PATTERNS. `EXCLUDED_HOST_FRAGMENTS` in the register file excludes
 * `forms.gle`, `docs.google.com` and `drive.google.com` as noise: a
 * one-off sign-up form is not the "BIRSA republishing a university page"
 * risk §3.6 is about. That reasoning is right for the general case, and this
 * script leaves it alone for everything else the corpus links to. But the
 * Wave 6E brief is explicit, by name, that this seeding pass must register
 * the specific links the scope audit (`docs/SCOPE-AUDIT-2.0.md` §3.1, §4
 * findings 5 and the internship row) already flagged as failing the "stable
 * enough to link to" gate test: the two internship Google Forms and two
 * evaluation PDFs on a third-party CDN in `handbook/internship.mdx`, and the
 * military-service Google Drive file, Google Sheet and Facebook permalink in
 * `/services/university-services` (now also `/help/university-services`).
 * An unstable link is exactly the kind the daily cron exists to catch, so
 * leaving these out of the register because they happen to also match a
 * general-purpose noise filter would defeat the audit's own point. This
 * script therefore applies one additional, narrow allowlist,
 * `AUDIT_FLAGGED_UNSTABLE_HOSTS`, that pulls specific host fragments back in
 * before the general exclusion list is applied. It is deliberately narrow:
 * it does not blanket re-include `docs.google.com` or `drive.google.com`
 * generally (a Google Form for an unrelated event RSVP is still noise), it
 * has "narrow" going by a small, explicit list of the ones the audit
 * named. General social contact links (Instagram, TikTok, X, Facebook page
 * links, Linktree) stay excluded, matching the register's own reasoning:
 * they are contact channels, not restated content.
 *
 * WHY LABELS ARE EXTRACTED, NEVER TRANSLATED OR INVENTED. The wave brief:
 * "Take the label from the link's own anchor text in the source where there
 * is one, in both locales. Where there is not... that is a gap you report
 * — do not invent a Thai label, and do not machine translate one." This
 * script extracts a label only from markdown link syntax
 * (`[label](https://...)`) found in the SAME locale's own MDX file as the
 * URL, which is the one place in this corpus a link's own author-written
 * label reliably sits next to the URL itself. Where a locale's file does not
 * link the URL with visible text (a bare URL, a URL used only as an
 * `href` attribute in a non-MDX source file, or a URL that only one
 * locale's file contains), the label for that locale falls back to the
 * URL's bare hostname. A hostname is not a translation and not invented
 * copy, so this satisfies the register's type (`Record<Locale, string>`,
 * both keys required) without ever putting words in anyone's mouth. Every
 * entry whose EN or TH label fell back to a hostname is listed in the
 * "LABEL GAPS" section of the generated report, `docs/migration/
 * external-link-seed-report.md`, for an officer or Wave 7 to fill in with a
 * real label — this script does not decide what that label should say.
 *
 * WHY OWNER PORTFOLIOS ARE ASSIGNED BY BODY, NOT GUESSED PER LINK. §10 and
 * §3.6 tie the owning portfolio to who would actually notice the link
 * breaking, which is a property of the INSTITUTIONAL BODY the link belongs
 * to, not of the individual URL. `lib/portfolios.ts` is the frozen closed
 * vocabulary of portfolios; `BODY_TO_PORTFOLIO` below maps each
 * `ExternalLinkBody` to the portfolio whose remit matches it, following the
 * same reasoning the register file's own doc comment states ("owner is
 * assigned to the portfolio whose remit matches the body"). `other` maps to
 * `secretariat`, BIRSA's general point of contact, since nothing in
 * `lib/portfolios.ts` owns "outside link with no clear body" more
 * specifically, and a link with no owner at all is a link the cron finds
 * and nobody is told about.
 *
 * USAGE
 *
 *   node scripts/seed-external-links.mjs
 *
 * Prints the regenerated `SEEDED_EXTERNAL_LINKS` array body (TypeScript
 * source, ready to paste into `lib/cms/externalLinkRegister.ts`) to stdout,
 * and writes the human-readable seeding report to
 * `docs/migration/external-link-seed-report.md`. This script does not edit
 * `lib/cms/externalLinkRegister.ts` itself: the seed in that file was
 * generated by running this script and reviewing its report once, by hand,
 * per the register file's own note that a machine can guess which
 * institution a link belongs to but not which officer should be notified
 * when it breaks. Re-run this script and diff its output against the
 * committed array whenever content changes; a diff that is not a pure
 * addition or a URL going away is worth a human looking at.
 */
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// ---------------------------------------------------------------------------
// Step 1: parse the frozen constants out of the register file's own source,
// rather than re-declaring them here (see file header, "WHY A PLAIN .mjs
// SCRIPT").
// ---------------------------------------------------------------------------

function parseRegisterConstants() {
  const src = readFileSync(path.join(REPO_ROOT, "lib/cms/externalLinkRegister.ts"), "utf8");

  // Parsed with `new RegExp(source, flags)` rather than `eval`, so this
  // script never evaluates arbitrary source text even though the file it
  // reads is repo-owned and trusted.
  const urlPatternMatch = src.match(/const URL_PATTERN = \/(.*)\/([a-z]*);/);
  if (!urlPatternMatch) {
    throw new Error(
      "seed-external-links: could not find URL_PATTERN in lib/cms/externalLinkRegister.ts. " +
        "The register file's shape has changed; update this script's parser to match."
    );
  }
  const urlPattern = new RegExp(urlPatternMatch[1], urlPatternMatch[2]);

  const excludedBlockMatch = src.match(/const EXCLUDED_HOST_FRAGMENTS = \[([\s\S]*?)\];/);
  if (!excludedBlockMatch) {
    throw new Error(
      "seed-external-links: could not find EXCLUDED_HOST_FRAGMENTS in lib/cms/externalLinkRegister.ts."
    );
  }
  const excludedHostFragments = [...excludedBlockMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);

  const hintsBlockMatch = src.match(/const BODY_DOMAIN_HINTS: Array<[^>]+> = \[([\s\S]*?)\n\];/);
  if (!hintsBlockMatch) {
    throw new Error(
      "seed-external-links: could not find BODY_DOMAIN_HINTS in lib/cms/externalLinkRegister.ts."
    );
  }
  const bodyDomainHints = [];
  const hintEntryPattern = /\{\s*body:\s*"([^"]+)",\s*hints:\s*\[([^\]]+)\]\s*\}/g;
  let hintMatch;
  while ((hintMatch = hintEntryPattern.exec(hintsBlockMatch[1])) !== null) {
    const [, body, hintsRaw] = hintMatch;
    const hints = [...hintsRaw.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    bodyDomainHints.push({ body, hints });
  }

  const bodiesMatch = src.match(/export const externalLinkBodies = \[([\s\S]*?)\] as const;/);
  const externalLinkBodies = bodiesMatch
    ? [...bodiesMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
    : [];

  return { urlPattern, excludedHostFragments, bodyDomainHints, externalLinkBodies };
}

// The audit-flagged exception list. See file header for why these five host
// fragments are deliberately let through the general exclusion filter.
// Kept narrow and named per source, not "all Google links": a Google Form
// for an unrelated event RSVP is still exactly the noise the register's own
// exclusion list exists to filter out.
const AUDIT_FLAGGED_UNSTABLE_HOSTS = [
  // handbook/internship.mdx: Internship Request Form, Secured Internship
  // Form, first/final evaluation online forms.
  "forms.gle/UzhAN9qiWb3mGdCu9",
  "forms.gle/M5oysLm3wSu9c8CQ7",
  "forms.gle/Jk4Sk2agHRvna4hJ7",
  "forms.gle/kbgMpZXt4To6NN9K6",
  // handbook/internship.mdx: first/final evaluation PDFs and the acceptance
  // form PDF/Word, all on the third-party CDN the audit named directly.
  "image.makewebcdn.com",
  // /services/university-services and /help/university-services (its 2.0
  // destination, and /help/welfare which also carries the same permalink):
  // military-service documents on Google Drive and a Google Sheet, and the
  // Facebook permalink used as the approved-list announcement.
  "drive.google.com/file/d/1-88fSuUc4VrKAAO-wQytYRoLaFM6qge9",
  "docs.google.com/spreadsheets/d/1nJOQvregi3ja7_xJYs1RAe8HWuWW4vZ5ls56_D8YdNQ",
  "facebook.com/permalink.php",
];

function isAuditFlaggedUnstable(url) {
  return AUDIT_FLAGGED_UNSTABLE_HOSTS.some((fragment) => url.includes(fragment));
}

// ---------------------------------------------------------------------------
// Step 2: walk the corpus. `content/**` in full (every locale, every family:
// this is a wave-level register, not just the §3.6 families), plus every
// `app/[lang]/**/page.tsx` (2.0 pages can carry signpost links of their own,
// as `/services/university-services` and `/help/university-services` do).
// ---------------------------------------------------------------------------

function walk(dir, predicate, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full, predicate, out);
    } else if (predicate(entry)) {
      out.push(full);
    }
  }
  return out;
}

function relPath(absPath) {
  return path.relative(REPO_ROOT, absPath).split(path.sep).join("/");
}

function localeOfPath(relativePath) {
  if (relativePath.startsWith("content/")) {
    const match = relativePath.match(/^content\/[^/]+\/(en|th)\//);
    if (match) return match[1];
  }
  return null;
}

// ---------------------------------------------------------------------------
// Step 3: extract URLs with the register's own pattern, classify each with
// the register's own body/domain hints, and where a URL appears inside an
// MDX markdown link, capture that locale's own anchor text as its label.
// ---------------------------------------------------------------------------

function guessBody(url, bodyDomainHints) {
  const lower = url.toLowerCase();
  for (const { body, hints } of bodyDomainHints) {
    if (hints.some((hint) => lower.includes(hint))) return body;
  }
  return "other";
}

function hostnameOf(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

/**
 * `[label text](https://example.com/path)`, tolerant of the label
 * containing nested `[...]` (footnote-style citations do not occur in this
 * corpus, so a non-greedy match to the first `]` is sufficient) but not of
 * parentheses inside the URL itself breaking the match — none of this
 * corpus's URLs contain unescaped parentheses, verified by inspection while
 * writing this script.
 */
function findMarkdownLabel(text, url) {
  const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`\\[([^\\]]+)\\]\\(${escaped}\\)`);
  const match = text.match(pattern);
  if (!match) return null;
  // A label can wrap across a source line inside prose (an MDX `<Notice>`
  // body, for instance), which a `[^\]]` character class happily spans since
  // it matches newlines too. Collapse that back to single spaces so the
  // label is one clean line, not a string containing a raw `\n` that would
  // break the generated TypeScript literal.
  return match[1].replace(/\s+/g, " ").trim();
}

function extractCandidates() {
  const { urlPattern, excludedHostFragments, bodyDomainHints } = parseRegisterConstants();

  const contentFiles = walk(path.join(REPO_ROOT, "content"), (name) =>
    /\.(mdx|ts|tsx)$/.test(name)
  );
  const appFiles = walk(path.join(REPO_ROOT, "app"), (name) => /page\.tsx$/.test(name));

  // url -> accumulated record
  const byUrl = new Map();

  for (const absPath of [...contentFiles, ...appFiles]) {
    const rel = relPath(absPath);
    const text = readFileSync(absPath, "utf8");
    const locale = localeOfPath(rel);

    const found = text.match(urlPattern) ?? [];
    for (const rawUrl of found) {
      // Strip common trailing punctuation a sentence can leave stuck to a
      // URL matched mid-prose (a period ending a sentence, a comma).
      const url = rawUrl.replace(/[).,;:]+$/, "");
      const lower = url.toLowerCase();

      const excluded = excludedHostFragments.some((fragment) => lower.includes(fragment));
      if (excluded && !isAuditFlaggedUnstable(url)) continue;
      if (lower.includes("birsa.") || lower.includes("birpolsci.com")) continue;

      let record = byUrl.get(url);
      if (!record) {
        record = {
          url,
          body: guessBody(url, bodyDomainHints),
          sourceFiles: new Set(),
          labels: {},
          flaggedUnstable: isAuditFlaggedUnstable(url),
        };
        byUrl.set(url, record);
      }
      record.sourceFiles.add(rel);
      if (isAuditFlaggedUnstable(url)) record.flaggedUnstable = true;

      if (locale && !record.labels[locale]) {
        const label = findMarkdownLabel(text, rawUrl) ?? findMarkdownLabel(text, url);
        if (label) record.labels[locale] = label;
      }
    }
  }

  return [...byUrl.values()].sort((a, b) => a.url.localeCompare(b.url));
}

// ---------------------------------------------------------------------------
// Step 4: turn extracted candidates into register entries: a stable id, an
// owning portfolio, and both locale labels (falling back to the hostname
// where no anchor text was found, per the file header's "WHY LABELS" note).
// ---------------------------------------------------------------------------

const BODY_TO_PORTFOLIO = {
  registrar: "academic-affairs",
  oia: "foreign-students",
  "faculty-office": "academic-affairs",
  "health-service": "rights-and-welfare",
  tusu: "student-activities",
  tusc: "student-activities",
  other: "secretariat",
};

function slugFromUrl(url) {
  const { hostname, pathname } = new URL(url);
  const host = hostname.replace(/^www\./, "").replace(/\./g, "-");
  // Decode percent-escapes before slugifying: a Thai filename URL-encoded in
  // the source (a registrar PDF, say) otherwise turns into a wall of hex
  // bytes that is unique but unreadable in cron output and review diffs. A
  // decode failure (a malformed escape) falls back to the raw pathname
  // rather than throwing, since a slightly odd but present id beats a
  // seeding run that crashes on one bad URL.
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    decodedPath = pathname;
  }
  const pathSlug = decodedPath
    .replace(/\/$/, "")
    .split("/")
    .filter(Boolean)
    .join("-")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return pathSlug ? `${host}-${pathSlug}` : host;
}

function buildEntries(candidates) {
  const idCounts = new Map();
  const entries = [];
  const labelGaps = [];

  for (const candidate of candidates) {
    let id = slugFromUrl(candidate.url);
    // De-duplicate ids deterministically (sorted input makes this stable
    // across runs) rather than by insertion order alone, in case two
    // distinct URLs on the same host and path-shape ever collide.
    if (idCounts.has(id)) {
      const n = idCounts.get(id) + 1;
      idCounts.set(id, n);
      id = `${id}-${n}`;
    } else {
      idCounts.set(id, 1);
    }

    const hostname = hostnameOf(candidate.url);
    const enLabel = candidate.labels.en ?? null;
    const thLabel = candidate.labels.th ?? null;

    if (!enLabel || !thLabel) {
      labelGaps.push({
        url: candidate.url,
        missing: [!enLabel ? "en" : null, !thLabel ? "th" : null].filter(Boolean),
        sourceFiles: [...candidate.sourceFiles].sort(),
      });
    }

    entries.push({
      id,
      url: candidate.url,
      owner: BODY_TO_PORTFOLIO[candidate.body] ?? "secretariat",
      body: candidate.body,
      label: { en: enLabel ?? hostname, th: thLabel ?? hostname },
      lastCheckedAt: null,
      // Not part of the emitted register type; used only to build the
      // report below.
      _sourceFiles: [...candidate.sourceFiles].sort(),
      _flaggedUnstable: candidate.flaggedUnstable,
    });
  }

  // Sort by id for a deterministic, reviewable diff (the wave brief's
  // determinism requirement: "sort every collection you emit, by a
  // documented key").
  entries.sort((a, b) => a.id.localeCompare(b.id));
  labelGaps.sort((a, b) => a.url.localeCompare(b.url));

  return { entries, labelGaps };
}

function tsLiteralFor(entry) {
  const escape = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return [
    "  {",
    `    id: "${entry.id}",`,
    `    url: "${entry.url}",`,
    `    owner: "${entry.owner}",`,
    `    body: "${entry.body}",`,
    `    label: { en: "${escape(entry.label.en)}", th: "${escape(entry.label.th)}" },`,
    `    lastCheckedAt: null,`,
    "  },",
  ].join("\n");
}

function main() {
  const candidates = extractCandidates();
  const { entries, labelGaps } = buildEntries(candidates);

  const tsBody = entries.map(tsLiteralFor).join("\n");
  process.stdout.write(tsBody + "\n");

  const reportLines = [
    "# External link seed report",
    "",
    "Generated by `scripts/seed-external-links.mjs` (Wave 6E,",
    "REDESIGN-2.0 §3.6/§10). Regenerate by re-running the script; do not",
    "hand-edit this file.",
    "",
    `Total external links found and registered: ${entries.length}.`,
    "",
    '## Links flagged by the audit as failing the "stable enough to link to" gate test',
    "",
    "docs/SCOPE-AUDIT-2.0.md §3.1 and §4 finding 5 name these as the ones",
    "most likely to break first: Google Forms, a Google Drive file, a Google",
    "Sheet, a Facebook permalink, and PDFs on a third-party CDN",
    "(`image.makewebcdn.com`). Registered anyway, per the wave brief, so the",
    "daily cron catches the break rather than a student.",
    "",
  ];
  const flagged = entries.filter((e) => e._flaggedUnstable);
  for (const e of flagged) {
    reportLines.push(`- \`${e.id}\` — ${e.url}`);
    reportLines.push(`  - found in: ${e._sourceFiles.join(", ")}`);
  }

  reportLines.push("", "## Label gaps", "");
  reportLines.push(
    "Per the wave brief: a label is taken only from the link's own anchor",
    "text in the source, in each locale. Where a locale's own file does not",
    "link the URL with visible text, this seeder falls back to the URL's",
    "bare hostname rather than inventing or translating a label. Every entry",
    "below needs a human-written label in the locale listed before an",
    "officer or Wave 7 should treat its `label` field as finished copy.",
    ""
  );
  if (labelGaps.length === 0) {
    reportLines.push("None. Every registered link had anchor text in both locales.");
  } else {
    for (const gap of labelGaps) {
      reportLines.push(`- ${gap.url} — missing: ${gap.missing.join(", ")}`);
      reportLines.push(`  - found in: ${gap.sourceFiles.join(", ")}`);
    }
  }

  reportLines.push("", "## Full entry list, by owning portfolio", "");
  const byOwner = new Map();
  for (const e of entries) {
    if (!byOwner.has(e.owner)) byOwner.set(e.owner, []);
    byOwner.get(e.owner).push(e);
  }
  for (const owner of [...byOwner.keys()].sort()) {
    reportLines.push(`### ${owner}`, "");
    for (const e of byOwner.get(owner)) {
      reportLines.push(`- \`${e.id}\` (${e.body}) — ${e.url}`);
    }
    reportLines.push("");
  }

  const outDir = path.join(REPO_ROOT, "docs/migration");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, "external-link-seed-report.md"), reportLines.join("\n") + "\n");
}

main();
