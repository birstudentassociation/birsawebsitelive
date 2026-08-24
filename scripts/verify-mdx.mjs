#!/usr/bin/env node
/**
 * Wave 6A verification: asserts the shared Wave 6 brief's gate against
 * `docs/migration/mdx.ndjson` and `docs/migration/mdx-report.{md,json}`,
 * entirely offline (REDESIGN-2.0 §11.4 item 6).
 *
 * Reads only the artifacts `scripts/migrate-mdx.mjs` writes, plus the one
 * frozen contract needed to check link validity (`lib/redirects.ts` --
 * stable, checked-in, not "content/**", so consulting it here does not
 * reintroduce a dependency on re-reading the corpus). This never touches
 * `content/**` itself: verification checks that what was WRITTEN is
 * internally consistent and matches what the report CLAIMS, which
 * `tests/unit/migration-portable-text.test.ts` already covers from the
 * other direction (does the pure serializer produce the right shape from a
 * given source).
 *
 * Checks, each named in the brief:
 *   1. Every source file the report claims to own has exactly one outcome
 *      (the report's own "unaccounted for" must be empty).
 *   2. No document `_id` collides (lib/migration/ids.ts's own
 *      `assertNoDuplicateIds`, called against the NDJSON's own ids).
 *   3. Bilingual pairing: every `localizedString`/`localizedText` object
 *      anywhere in the NDJSON carries a non-empty `en` AND a non-empty
 *      `th`. A source file reported as a "gap" for a missing locale twin is
 *      not itself a failure here (it correctly produced no document); a
 *      document that got EMITTED with one language blank is.
 *   4. No required field is empty on any document (`title`, `slug.current`,
 *      and each document type's own required fields per
 *      `sanity/schemaTypes/documents/*.ts`).
 *   5. Every internal link (`markDef` with `href` starting with `/`)
 *      resolves inside a real 2.0 route family (`lib/redirects.ts`'s
 *      `routeFamilies2_0`), the same check `lib/migration/portableText.ts`'s
 *      `defaultLinkResolver` makes at migrate time -- run again here so a
 *      regression in either script's resolver is still caught.
 *   6. Every "migrated" report entry's `documentId` exists in the NDJSON
 *      exactly once, and every NDJSON document has a corresponding
 *      "migrated" report entry (the two artifacts cannot silently diverge).
 *
 * Prints every failure by name, never a bare count (REDESIGN-2.0 §11.4).
 * Exits non-zero if any check fails.
 */
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import esbuild from "esbuild";
import os from "node:os";
import { writeFileSync as writeTempFile, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

if (process.cwd() !== REPO_ROOT) {
  console.error(`verify-mdx: must be run from the repo root (${REPO_ROOT}), not ${process.cwd()}.`);
  process.exit(1);
}

function repoPath(...parts) {
  for (const part of parts) {
    if (path.isAbsolute(part)) {
      throw new Error(
        `verify-mdx: repoPath() received an absolute path segment "${part}"; pass relative segments only.`
      );
    }
  }
  return path.join(REPO_ROOT, ...parts);
}

async function loadTsModule(entryRelativePath) {
  const result = await esbuild.build({
    entryPoints: [repoPath(entryRelativePath)],
    bundle: true,
    format: "cjs",
    platform: "node",
    write: false,
    logLevel: "silent",
  });
  const code = result.outputFiles[0].text;
  const tempFile = path.join(
    os.tmpdir(),
    `verify-mdx-${path.basename(entryRelativePath, ".ts")}-${process.pid}-${Date.now()}.cjs`
  );
  writeTempFile(tempFile, code, "utf8");
  try {
    return await import(pathToFileURL(tempFile).href);
  } finally {
    rmSync(tempFile, { force: true });
  }
}

const NDJSON_PATH = repoPath("docs/migration/mdx.ndjson");
const REPORT_JSON_PATH = repoPath("docs/migration/mdx-report.json");
const REPORT_MD_PATH = repoPath("docs/migration/mdx-report.md");

const failures = [];
function fail(message) {
  failures.push(message);
}

function readNdjson(filePath) {
  const text = readFileSync(filePath, "utf8");
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  return lines.map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (err) {
      fail(`mdx.ndjson line ${index + 1}: not valid JSON (${err.message})`);
      return null;
    }
  });
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/** Walks a document (or any nested value) and yields every object that looks like a `localizedString`/`localizedText`, with a path string for error messages. */
function* findLocalizedObjects(value, pathLabel) {
  if (value === null || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++)
      yield* findLocalizedObjects(value[i], `${pathLabel}[${i}]`);
    return;
  }
  if (value._type === "localizedString" || value._type === "localizedText") {
    yield { pathLabel, value };
  }
  for (const [key, child] of Object.entries(value)) {
    if (key === "_type") continue;
    yield* findLocalizedObjects(child, `${pathLabel}.${key}`);
  }
}

/** Walks a document and yields every `{_type: "link", href}` markDef. */
function* findLinkHrefs(value, pathLabel) {
  if (value === null || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) yield* findLinkHrefs(value[i], `${pathLabel}[${i}]`);
    return;
  }
  if (value._type === "link" && typeof value.href === "string") {
    yield { pathLabel, href: value.href };
  }
  for (const [key, child] of Object.entries(value)) {
    if (key === "_type") continue;
    yield* findLinkHrefs(child, `${pathLabel}.${key}`);
  }
}

const REQUIRED_FIELDS_BY_TYPE = {
  newsArticle: ["title", "slug", "summary", "category", "date", "body", "lifecycle"],
  event: ["title", "slug", "summary", "category", "date", "location", "start", "body", "lifecycle"],
  club: ["title", "slug", "tagline", "category", "order", "body", "lifecycle"],
  page: ["title", "slug", "body", "lifecycle"],
  guide: ["title", "slug", "summary", "audience", "order", "body", "lifecycle"],
};

async function main() {
  let ndjsonRaw;
  try {
    ndjsonRaw = readFileSync(NDJSON_PATH, "utf8");
  } catch (err) {
    console.error(`verify-mdx: could not read ${NDJSON_PATH}: ${err.message}`);
    console.error("Run `node scripts/migrate-mdx.mjs` first.");
    process.exit(1);
  }
  void ndjsonRaw;
  const docs = readNdjson(NDJSON_PATH);

  let reportJson;
  try {
    reportJson = JSON.parse(readFileSync(REPORT_JSON_PATH, "utf8"));
  } catch (err) {
    console.error(`verify-mdx: could not read/parse ${REPORT_JSON_PATH}: ${err.message}`);
    console.error("Run `node scripts/migrate-mdx.mjs` first.");
    process.exit(1);
  }
  try {
    statSync(REPORT_MD_PATH);
  } catch {
    fail(`${REPORT_MD_PATH} does not exist (the human-readable half of the diff report).`);
  }

  console.log("Check 1/6: the diff report accounts for every file (unaccounted for is zero)...");
  if (reportJson.unaccounted.length > 0) {
    for (const p of reportJson.unaccounted) fail(`unaccounted for: ${p}`);
  }

  console.log("Check 2/6: no document _id collides...");
  const idsSeen = new Map();
  for (const doc of docs) {
    if (!doc) continue;
    if (!isNonEmptyString(doc._id)) {
      fail(`a document is missing _id: ${JSON.stringify(doc).slice(0, 120)}`);
      continue;
    }
    idsSeen.set(doc._id, (idsSeen.get(doc._id) ?? 0) + 1);
  }
  for (const [id, count] of idsSeen) {
    if (count > 1) fail(`duplicate _id "${id}" (${count} documents)`);
  }

  console.log("Check 3/6: bilingual pairing on every localizedString/localizedText value...");
  for (const doc of docs) {
    if (!doc) continue;
    for (const { pathLabel, value } of findLocalizedObjects(doc, doc._id)) {
      if (!isNonEmptyString(value.en))
        fail(`${pathLabel}: localized value has an empty/missing "en".`);
      if (!isNonEmptyString(value.th))
        fail(`${pathLabel}: localized value has an empty/missing "th".`);
    }
  }

  console.log("Check 4/6: no required field is empty...");
  for (const doc of docs) {
    if (!doc) continue;
    const required = REQUIRED_FIELDS_BY_TYPE[doc._type];
    if (!required) {
      fail(
        `${doc._id}: unrecognised _type "${doc._type}" (add it to REQUIRED_FIELDS_BY_TYPE in this script).`
      );
      continue;
    }
    for (const field of required) {
      const value = doc[field];
      const empty =
        value === undefined ||
        value === null ||
        (Array.isArray(value) && value.length === 0) ||
        (field === "slug" && !isNonEmptyString(value?.current));
      if (empty) fail(`${doc._id}: required field "${field}" is missing or empty.`);
    }
  }

  console.log("Check 5/6: every internal link resolves inside a real 2.0 route family...");
  let routeFamilies2_0 = [];
  try {
    const redirects = await loadTsModule("lib/redirects.ts");
    routeFamilies2_0 = redirects.routeFamilies2_0;
  } catch (err) {
    fail(`could not load lib/redirects.ts to check link validity: ${err.message}`);
  }
  if (routeFamilies2_0.length > 0) {
    for (const doc of docs) {
      if (!doc) continue;
      for (const { pathLabel, href } of findLinkHrefs(doc, doc._id)) {
        if (/^(https?:|mailto:)/i.test(href)) continue;
        if (!href.startsWith("/")) continue;
        const localeMatch = /^\/(en|th)(\/.*|)$/.exec(href);
        const pathNoLocale = localeMatch ? localeMatch[2] || "/" : href;
        const ok =
          pathNoLocale === "/" ||
          routeFamilies2_0.some(
            (family) => pathNoLocale === family || pathNoLocale.startsWith(`${family}/`)
          );
        if (!ok) {
          fail(
            `${pathLabel}: internal link "${href}" does not resolve inside any 2.0 route family.`
          );
        }
      }
    }
  }

  console.log(
    "Check 6/6: the NDJSON and the report agree on exactly which documents were migrated..."
  );
  const migratedEntries = reportJson.entries.filter((e) => e.status === "migrated");
  const reportedIds = new Set(migratedEntries.map((e) => e.documentId));
  const ndjsonIds = new Set(docs.filter(Boolean).map((d) => d._id));
  for (const id of reportedIds) {
    if (!ndjsonIds.has(id))
      fail(`report claims documentId "${id}" was migrated, but it is not in mdx.ndjson.`);
  }
  for (const id of ndjsonIds) {
    if (!reportedIds.has(id))
      fail(`mdx.ndjson contains "${id}", but no report entry claims it as migrated.`);
  }

  console.log("");
  if (failures.length > 0) {
    console.error(`verify-mdx: FAILED with ${failures.length} problem(s):\n`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log(
    `verify-mdx: OK. ${docs.filter(Boolean).length} document(s) verified against the diff report.`
  );
}

main().catch((err) => {
  console.error("verify-mdx: fatal error:", err);
  process.exit(1);
});
