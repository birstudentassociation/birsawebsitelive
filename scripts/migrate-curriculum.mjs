#!/usr/bin/env node
/**
 * Migration script for the curriculum / course-review family
 * (REDESIGN-2.0 §11.4 item 6, Wave 6D). See lib/migration/curriculum.ts for
 * why this family migrates and what document shape it targets, and
 * docs/migration/curriculum.md (which this script generates) for the full
 * write-up.
 *
 * This script never touches the network. It reads `content/curriculum/**`
 * and `content/course-review/courses.ts` from the filesystem (via ordinary
 * TypeScript imports), transforms them, and writes two files:
 *
 *   1. An NDJSON artifact in the exact format `sanity dataset import`
 *      consumes — one JSON document per line, each with `_id` and `_type`.
 *      This is the deliverable; the actual import is an operator step (see
 *      "OPERATOR COMMANDS" below).
 *   2. docs/migration/curriculum.md (plus a .json sidecar, via Wave 6A's
 *      shared lib/migration/report.ts) — the diff report: the disposition
 *      argument, every source file's outcome, and the full document index.
 *
 * Both outputs are deterministic: running this script twice against an
 * unchanged tree produces byte-identical files (see
 * tests/unit/migration-curriculum.test.ts, which asserts this directly).
 *
 * USAGE
 *
 *   npx tsx scripts/migrate-curriculum.mjs [--out <path>]
 *
 * `tsx` is required because this repo's content modules are TypeScript with
 * extensionless relative imports (moduleResolution: "bundler"), which plain
 * Node cannot resolve on its own. `tsx` is already an installed dependency
 * of this repo (transitively, via vite/vitest) — this script does not add
 * one. `--out` defaults to docs/migration/artifacts/curriculum.ndjson.
 *
 * OPERATOR COMMANDS (once a curriculumVersion / courseReview schema exists —
 * see the "no schema yet" gap in docs/migration/curriculum.md; this command
 * has nothing to import into until then)
 *
 *   npx sanity dataset import docs/migration/artifacts/curriculum.ndjson <dataset> \
 *     --replace
 *
 * `--replace` is safe here specifically because every `_id` this script
 * emits is deterministic (curriculum-version-<versionId>,
 * course-review-<code>) and namespaced to this family: re-running the import
 * after a content change replaces exactly the same documents, nothing else
 * in the dataset.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  buildCurriculumVersionDocuments,
  buildCourseReviewDocuments,
  writeCurriculumMigrationReport,
  runAllChecks,
} from "../lib/migration/curriculum.ts";

function parseArgs(argv) {
  const out = { out: "docs/migration/artifacts/curriculum.ndjson" };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--out" && argv[i + 1]) {
      out.out = argv[i + 1];
      i++;
    }
  }
  return out;
}

function main() {
  const { out } = parseArgs(process.argv.slice(2));
  const repoRoot = path.resolve(import.meta.dirname, "..");

  const versionDocs = buildCurriculumVersionDocuments();
  const courseDocs = buildCourseReviewDocuments();
  const allDocs = [...versionDocs, ...courseDocs];

  // A pre-flight run of every verification check, so a broken migration
  // never produces an artifact that looks clean and only fails later, in
  // the operator's hands, at `sanity dataset import` time.
  const issues = runAllChecks(versionDocs, courseDocs);
  if (issues.length > 0) {
    console.error(
      `migrate-curriculum: ${issues.length} issue(s) found before writing the artifact:`
    );
    for (const issue of issues) console.error(`  - ${issue}`);
    console.error("Refusing to write a migration artifact from data that fails its own checks.");
    process.exitCode = 1;
    return;
  }

  const ndjsonPath = path.resolve(repoRoot, out);
  mkdirSync(path.dirname(ndjsonPath), { recursive: true });
  const ndjson = allDocs.map((doc) => JSON.stringify(doc)).join("\n") + "\n";
  writeFileSync(ndjsonPath, ndjson, "utf8");

  // writeCurriculumMigrationReport calls lib/migration/report.ts's shared
  // writeMigrationReport, which writes both docs/migration/curriculum.md
  // (the human-readable diff report) and docs/migration/curriculum.json
  // (the same data, structured, so the verify script can read it without
  // parsing markdown) and returns the unaccounted-for list the shared
  // brief's gate cares about.
  const { unaccounted, counts } = writeCurriculumMigrationReport(versionDocs, courseDocs);

  console.log(
    `migrate-curriculum: wrote ${allDocs.length} documents to ${path.relative(repoRoot, ndjsonPath)}`
  );
  console.log(`  - ${versionDocs.length} curriculumVersion documents`);
  console.log(`  - ${courseDocs.length} courseReview documents`);
  console.log(
    `migrate-curriculum: wrote the diff report to docs/migration/curriculum.md ` +
      `(migrated: ${counts.migrated}, not-migrated: ${counts["not-migrated"]}, unaccounted: ${unaccounted.length})`
  );
  if (unaccounted.length > 0) {
    console.error("migrate-curriculum: unaccounted-for files, this must be zero:");
    for (const file of unaccounted) console.error(`  - ${file}`);
    process.exitCode = 1;
  }
}

main();
