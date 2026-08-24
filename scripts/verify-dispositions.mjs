/**
 * Offline verification for the §3.6 disposition ledger (Wave 6E,
 * REDESIGN-2.0 §3.6, §10, §11.4).
 *
 * WHAT THIS SCRIPT CHECKS, AND WHY EACH CHECK IS SHAPED THE WAY IT IS.
 *
 *   1. THE SITEWIDE REDIRECT GATE ("every 1.0 path in the sitemap either
 *      still exists in 2.0 or resolves through lib/redirects.ts to a path
 *      that does"). This exact gate is already implemented, offline, and
 *      exhaustively, by the frozen Wave 0 test `tests/unit/redirects.test.ts`
 *      (it walks `app/sitemap()`, the same loader the real pages use, so it
 *      cannot drift from what actually ships). Re-deriving that logic here
 *      in a second, parallel implementation is exactly the kind of
 *      duplication that goes stale first — this repository's own house rule
 *      (`docs/EDITING.md`, applied to code by `docs/BUILD-BRIEF-2.0.md`).
 *      This script instead runs that test directly (`vitest run`, no
 *      network involved) and treats a non-zero exit as a verification
 *      failure. This is still "offline": vitest reads the filesystem and
 *      the loaders, nothing more.
 *
 *   2. EVERY ABSORB SOURCE HAS A REDIRECT RULE AND A DESTINATION PAGE THAT
 *      EXISTS. Parses `lib/redirects.ts`'s `redirectRules` array directly
 *      out of its own source text (the same house pattern
 *      `scripts/check-contrast.mjs` and `scripts/seed-external-links.mjs`
 *      both use for a frozen TypeScript file with no build step available
 *      to a plain `.mjs` script), finds the six rules whose `why` field
 *      cites "ABSORB", and asserts a `page.tsx` exists on disk at each
 *      rule's `to` path under every locale-parameterised `app/[lang]`
 *      route.
 *
 *   3. EVERY REGISTERED EXTERNAL LINK HAS AN OWNER, A BODY AND BOTH LOCALE
 *      LABELS. Imports `SEEDED_EXTERNAL_LINKS`... except this is a `.mjs`
 *      script with no TypeScript runtime, so instead it parses the
 *      committed array out of `lib/cms/externalLinkRegister.ts`'s own
 *      source text (same reasoning as check 2), and separately parses
 *      `portfolioIds` from `lib/portfolios.ts` and `externalLinkBodies`
 *      from the register file, so an entry's `owner`/`body` are checked
 *      against the REAL closed vocabularies, not a hand-copied list that
 *      could drift from them.
 *
 *   4. NO CONTENT ITEM IS UNACCOUNTED FOR IN THE LEDGER. Walks
 *      `content/student-life/{en,th}/**`, `content/emergency/scenarios/`
 *      and the `/services/university-services` page directly off the
 *      filesystem, and asserts every one of those paths is named somewhere
 *      in `docs/migration/dispositions.md`. This is a substring check, not
 *      a parser: the ledger is prose with tables, and a strict parser would
 *      be pickier about the ledger's exact formatting than about whether the
 *      information is actually there. A file this script cannot find named
 *      anywhere in the ledger is exactly what "unaccounted for" means, and
 *      it fails loudly, by path.
 *
 *   5. THE WAVE-LEVEL ROLL-UP. Wave 6E's own report is one of five. This
 *      checks that `docs/migration/` contains a report for each of the
 *      other four families the wave brief names (§11.4: "MDX to Portable
 *      Text; TypeScript content modules to documents; Smart Answers trees;
 *      curriculum"), using a keyword match against each report's own
 *      content rather than a guessed filename, since nothing in the shared
 *      brief fixes what the other four agents must call their files. A
 *      missing family fails LOUDLY AND BY NAME, per this wave's brief
 *      ("write your script so it fails loudly and by name on the missing
 *      family rather than skipping it silently"), rather than being
 *      swallowed into a single generic count.
 *
 * USAGE
 *
 *   node scripts/verify-dispositions.mjs
 *
 * Exits 0 and prints a summary when every check passes. Exits 1 and prints
 * every specific failure, by name, when any check does not — never a bare
 * count. Run this after any of the six §3.6 destination pages change, after
 * `lib/redirects.ts` or `lib/cms/externalLinkRegister.ts` change, or before
 * treating this wave as closed.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const failures = [];
function fail(check, detail) {
  failures.push(`[${check}] ${detail}`);
}

function readRepoFile(relPath) {
  return readFileSync(path.join(REPO_ROOT, relPath), "utf8");
}

// ---------------------------------------------------------------------------
// Check 1: the sitewide redirect gate, delegated to the frozen Wave 0 test.
// ---------------------------------------------------------------------------

function checkSitewideRedirectGate() {
  console.log("Check 1/5: the sitewide redirect gate (tests/unit/redirects.test.ts)...");
  try {
    execFileSync("npx", ["vitest", "run", "tests/unit/redirects.test.ts"], {
      cwd: REPO_ROOT,
      stdio: "pipe",
    });
    console.log("  OK: every 1.0 path in the sitemap resolves, per the frozen redirect test.");
  } catch (err) {
    const stdout = err.stdout ? err.stdout.toString() : "";
    const stderr = err.stderr ? err.stderr.toString() : "";
    const output = stdout + stderr || String(err);
    fail(
      "sitewide-redirect-gate",
      "tests/unit/redirects.test.ts did not pass. This is the gate that proves every " +
        "1.0 path either still exists in 2.0 or resolves through lib/redirects.ts to one " +
        "that does; a failure here is a stranded URL somewhere in the whole site, not just " +
        "this wave's six rules. Full output:\n" +
        output
          .split("\n")
          .map((line) => `      ${line}`)
          .join("\n")
    );
  }
}

// ---------------------------------------------------------------------------
// Check 2: every ABSORB redirect rule has a destination page on disk.
// ---------------------------------------------------------------------------

function parseAbsorbRedirectRules() {
  const src = readRepoFile("lib/redirects.ts");
  const ruleBlockPattern =
    /\{\s*from:\s*"([^"]+)",\s*to:\s*"([^"]+)",\s*subtree:\s*(true|false),\s*why:\s*"([^"]*(?:\\.[^"]*)*)",?\s*\}/g;
  const rules = [];
  let match;
  while ((match = ruleBlockPattern.exec(src)) !== null) {
    const [, from, to, , why] = match;
    rules.push({ from, to, why });
  }
  return rules.filter((r) => r.why.includes("ABSORB"));
}

/**
 * Every route in this app is `app/[lang]<path>/page.tsx`; a dynamic segment
 * in `path` (there are none among the six ABSORB destinations, but this
 * stays general) is matched by checking each bracketed directory candidate
 * rather than assuming a literal directory name exists.
 */
function appPageExistsForPath(twoDotOhPath) {
  const segments = twoDotOhPath.split("/").filter(Boolean);
  let dir = path.join(REPO_ROOT, "app", "[lang]");
  for (const segment of segments) {
    const literal = path.join(dir, segment);
    if (existsSync(literal) && statSync(literal).isDirectory()) {
      dir = literal;
      continue;
    }
    // Fall back to any dynamic-segment directory (`[slug]`, `[code]`, ...)
    // at this level, since a destination path can end in one.
    const dynamic = existsSync(dir)
      ? readdirSync(dir).find(
          (name) =>
            name.startsWith("[") &&
            name.endsWith("]") &&
            statSync(path.join(dir, name)).isDirectory()
        )
      : undefined;
    if (dynamic) {
      dir = path.join(dir, dynamic);
      continue;
    }
    return false;
  }
  return existsSync(path.join(dir, "page.tsx"));
}

function checkAbsorbDestinationsExist() {
  console.log("Check 2/5: every ABSORB redirect rule has a destination page on disk...");
  const rules = parseAbsorbRedirectRules();

  if (rules.length !== 6) {
    fail(
      "absorb-rule-count",
      `Expected exactly 6 ABSORB redirect rules in lib/redirects.ts (SCOPE-AUDIT-2.0 §2), ` +
        `found ${rules.length}. Either a rule's "why" no longer says ABSORB, or the frozen ` +
        `file itself changed shape. lib/redirects.ts is frozen and this wave may not edit it, ` +
        `so this needs a human, not a fix here.`
    );
  }

  for (const rule of rules) {
    if (!appPageExistsForPath(rule.to)) {
      fail(
        "absorb-destination-missing",
        `${rule.from} -> ${rule.to}: no page.tsx found under app/[lang]${rule.to}. ` +
          `The redirect rule exists but Wave 5's destination page does not (or moved).`
      );
    } else {
      console.log(`  OK: ${rule.from} -> ${rule.to} (destination page exists)`);
    }
  }
}

// ---------------------------------------------------------------------------
// Check 3: every registered external link has a real owner, body and both
// locale labels.
// ---------------------------------------------------------------------------

function parsePortfolioIds() {
  const src = readRepoFile("lib/portfolios.ts");
  const match = src.match(/export type PortfolioId =\s*([\s\S]*?);/);
  if (!match)
    throw new Error("verify-dispositions: could not find PortfolioId in lib/portfolios.ts");
  return [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

function parseExternalLinkBodies() {
  const src = readRepoFile("lib/cms/externalLinkRegister.ts");
  const match = src.match(/export const externalLinkBodies = \[([\s\S]*?)\] as const;/);
  if (!match)
    throw new Error(
      "verify-dispositions: could not find externalLinkBodies in lib/cms/externalLinkRegister.ts"
    );
  return [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

function parseSeededExternalLinks() {
  const src = readRepoFile("lib/cms/externalLinkRegister.ts");
  const arrayMatch = src.match(
    /export const SEEDED_EXTERNAL_LINKS: ExternalLinkRegisterEntry\[\] = \[([\s\S]*)\n\];\s*$/
  );
  if (!arrayMatch)
    throw new Error(
      "verify-dispositions: could not find SEEDED_EXTERNAL_LINKS in lib/cms/externalLinkRegister.ts"
    );
  const body = arrayMatch[1];
  // `,?` before the closing `}` on both the label object and (implicitly, via
  // the loop picking up the next entry regardless) the entry object: Prettier
  // wraps a `label: { en: "...", th: "..." }` whose line would run past its
  // print width onto three lines with a trailing comma after `th`, which a
  // pattern written against the single-line form otherwise fails to match —
  // exactly the four entries with the longest labels in a first draft of
  // this script silently vanished, until this had to be sorted out.
  const entryPattern =
    /id:\s*"([^"]+)",\s*url:\s*"([^"]+)",\s*owner:\s*"([^"]+)",\s*body:\s*"([^"]+)",\s*label:\s*\{\s*en:\s*"((?:[^"\\]|\\.)*)",\s*th:\s*"((?:[^"\\]|\\.)*)",?\s*\}/g;
  const entries = [];
  let match;
  while ((match = entryPattern.exec(body)) !== null) {
    const [, id, url, owner, bodyName, labelEn, labelTh] = match;
    entries.push({ id, url, owner, body: bodyName, labelEn, labelTh });
  }
  return entries;
}

function checkExternalLinkRegister() {
  console.log("Check 3/5: every registered external link has an owner, a body and both labels...");
  const portfolioIds = new Set(parsePortfolioIds());
  const externalLinkBodies = new Set(parseExternalLinkBodies());
  const entries = parseSeededExternalLinks();

  if (entries.length === 0) {
    fail(
      "external-link-register-empty",
      "Parsed zero entries out of SEEDED_EXTERNAL_LINKS. Either the register regressed to " +
        "empty, or this script's parser no longer matches the array's shape (check the regex " +
        "in parseSeededExternalLinks against the current file by hand)."
    );
    return;
  }

  const seenIds = new Set();
  const seenUrls = new Set();

  for (const entry of entries) {
    if (seenIds.has(entry.id)) fail("external-link-duplicate-id", entry.id);
    seenIds.add(entry.id);

    if (seenUrls.has(entry.url)) fail("external-link-duplicate-url", entry.url);
    seenUrls.add(entry.url);

    if (!portfolioIds.has(entry.owner)) {
      fail(
        "external-link-unknown-owner",
        `${entry.id}: owner "${entry.owner}" is not in lib/portfolios.ts's PortfolioId union.`
      );
    }
    if (!externalLinkBodies.has(entry.body)) {
      fail(
        "external-link-unknown-body",
        `${entry.id}: body "${entry.body}" is not in externalLinkBodies.`
      );
    }
    if (!entry.labelEn.trim()) {
      fail("external-link-missing-label", `${entry.id}: empty EN label.`);
    }
    if (!entry.labelTh.trim()) {
      fail("external-link-missing-label", `${entry.id}: empty TH label.`);
    }
    if (!/^https?:\/\//.test(entry.url)) {
      fail("external-link-bad-url", `${entry.id}: "${entry.url}" is not an http(s) URL.`);
    }
  }

  console.log(
    `  Checked ${entries.length} registered links; ` +
      `${failures.filter((f) => f.startsWith("[external-link")).length} problem(s) found.`
  );
}

// ---------------------------------------------------------------------------
// Check 4: every §3.6 content item is named somewhere in the ledger.
// ---------------------------------------------------------------------------

function collectSection36ContentItems() {
  const items = [];
  const studentLifeRoot = path.join(REPO_ROOT, "content/student-life");
  for (const locale of ["en", "th"]) {
    for (const track of ["handbook", "home", "international"]) {
      const dir = path.join(studentLifeRoot, locale, track);
      if (!existsSync(dir)) continue;
      for (const file of readdirSync(dir)
        .filter((f) => f.endsWith(".mdx"))
        .sort()) {
        items.push({
          path: `content/student-life/${locale}/${track}/${file}`,
          // The ledger is organised by slug (the EN/TH twin share a name),
          // so that is what has to appear in it for either locale's file to
          // count as accounted for.
          needle: file.replace(/\.mdx$/, ""),
        });
      }
    }
  }
  const scenariosDir = path.join(REPO_ROOT, "content/emergency/scenarios");
  for (const file of readdirSync(scenariosDir)
    .filter((f) => f.endsWith(".ts"))
    .sort()) {
    items.push({ path: `content/emergency/scenarios/${file}`, needle: file });
  }
  items.push({
    path: "app/[lang]/services/university-services/page.tsx",
    needle: "university-services",
  });
  return items;
}

function checkLedgerAccountsForEveryFile() {
  console.log("Check 4/5: every §3.6 content item is named in docs/migration/dispositions.md...");
  const ledgerPath = path.join(REPO_ROOT, "docs/migration/dispositions.md");
  if (!existsSync(ledgerPath)) {
    fail("ledger-missing", "docs/migration/dispositions.md does not exist.");
    return;
  }
  const ledger = readFileSync(ledgerPath, "utf8");
  const items = collectSection36ContentItems();

  let unaccounted = 0;
  for (const item of items) {
    if (!ledger.includes(item.needle)) {
      fail("ledger-unaccounted-file", `${item.path} (looked for "${item.needle}")`);
      unaccounted += 1;
    }
  }
  console.log(`  Checked ${items.length} §3.6 content items; ${unaccounted} unaccounted for.`);
}

// ---------------------------------------------------------------------------
// Check 5: the wave-level roll-up. Every other Wave 6 family's own diff
// report is present in docs/migration/, matched by keyword since filenames
// are not standardised across agents.
// ---------------------------------------------------------------------------

const OTHER_WAVE_6_FAMILIES = [
  {
    label: "MDX to Portable Text (Wave 6A)",
    // A required space between "portable" and "text" is deliberate: other
    // families' reports legitimately mention Sanity's `portableText` field
    // type (a camelCase schema field name, zero characters between the two
    // words) in passing without being this family's own report. Only the
    // two-word phrase, as this family would actually title itself, counts.
    matchesContent: (text) => /portable\s+text/i.test(text),
  },
  {
    label: "TypeScript content modules to documents (Wave 6B)",
    matchesContent: (text) => /content module/i.test(text),
  },
  {
    label: "Smart Answers trees (Wave 6C)",
    matchesContent: (text) => /smart answers|guided-journey tree/i.test(text),
  },
  {
    label: "Curriculum (Wave 6D)",
    matchesContent: (text) => /curriculum/i.test(text),
  },
];

// This wave's own reports, excluded from the "other families" search so
// this wave never reports itself as one of the four it is rolling up.
const OWN_REPORT_FILENAMES = new Set(["external-link-seed-report.md", "dispositions.md"]);

function checkWaveRollup() {
  console.log("Check 5/5: the other four Wave 6 families each have a diff report...");
  const migrationDir = path.join(REPO_ROOT, "docs/migration");
  const reportFiles = existsSync(migrationDir)
    ? readdirSync(migrationDir).filter((f) => f.endsWith(".md") && !OWN_REPORT_FILENAMES.has(f))
    : [];

  const reportTexts = reportFiles.map((f) => readFileSync(path.join(migrationDir, f), "utf8"));

  for (const family of OTHER_WAVE_6_FAMILIES) {
    const found = reportTexts.some((text) => family.matchesContent(text));
    if (!found) {
      fail(
        "wave-rollup-missing-family",
        `${family.label}: no report matching this family was found in docs/migration/. ` +
          `This is not this wave's fault, but the whole-site gate ("the diff report accounts ` +
          `for every file") cannot be certified until it lands. Re-run this script once it does.`
      );
    } else {
      console.log(`  OK: found a report for ${family.label}.`);
    }
  }
}

// ---------------------------------------------------------------------------

console.log("Verifying the §3.6 disposition ledger (Wave 6E)...\n");

checkSitewideRedirectGate();
checkAbsorbDestinationsExist();
checkExternalLinkRegister();
checkLedgerAccountsForEveryFile();
checkWaveRollup();

console.log("");
if (failures.length > 0) {
  console.error(`FAILED: ${failures.length} problem(s):\n`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
} else {
  console.log("All checks passed.");
  process.exit(0);
}
