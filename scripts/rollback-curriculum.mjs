#!/usr/bin/env node
/**
 * Rollback script for the curriculum / course-review family (REDESIGN-2.0
 * §11.4 item 6, Wave 6D).
 *
 * Rollback here means "undo exactly what scripts/migrate-curriculum.mjs
 * imported" — nothing more, nothing less. It never reads the NDJSON
 * artifact (which could have been hand-edited or be stale); it derives the
 * same document ids the migration would produce, straight from
 * `curriculumVersionDocId` / `courseReviewDocId` in
 * lib/migration/curriculum.ts, the same functions the migration itself
 * calls. That is the shared brief's requirement in full: "derived from the
 * same id derivation as the migration so it cannot drift" — there is
 * exactly one place these ids come from, and this script and the migration
 * both call it.
 *
 * This prints the ids and the exact operator command; it does not call any
 * Sanity API itself (no write token exists in this checkout, and the
 * shared brief forbids inventing one).
 *
 * USAGE
 *
 *   npx tsx scripts/rollback-curriculum.mjs [--out <path>]
 *
 * Writes a newline-delimited list of every document id this family's
 * migration would have created (`--out`, default
 * docs/migration/artifacts/curriculum-rollback-ids.txt) and prints the
 * operator command that deletes them.
 *
 * OPERATOR COMMAND
 *
 *   npx sanity documents delete $(cat docs/migration/artifacts/curriculum-rollback-ids.txt) \
 *     --dataset <dataset>
 *
 * This deletes only documents this family's migration could have created —
 * every id is namespaced `curriculum-version-*` / `course-review-*` (see
 * lib/migration/curriculum.ts's id functions) — so it cannot reach a
 * document another family's migration created, even by accident.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  buildCurriculumVersionDocuments,
  buildCourseReviewDocuments,
} from "../lib/migration/curriculum.ts";

function parseArgs(argv) {
  const out = { out: "docs/migration/artifacts/curriculum-rollback-ids.txt" };
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

  // Same source, same functions, same ids the migration produced. Rollback
  // does not need the artifact file to exist at all — only the id
  // derivation, which is pure and depends on nothing but the currently
  // checked-out content/curriculum and content/course-review trees.
  const ids = [
    ...buildCurriculumVersionDocuments().map((d) => d._id),
    ...buildCourseReviewDocuments().map((d) => d._id),
  ].sort();

  const idsPath = path.resolve(repoRoot, out);
  mkdirSync(path.dirname(idsPath), { recursive: true });
  writeFileSync(idsPath, ids.join("\n") + "\n", "utf8");

  console.log(
    `rollback-curriculum: wrote ${ids.length} document id(s) to ${path.relative(repoRoot, idsPath)}`
  );
  console.log("");
  console.log(
    "Operator command (requires a Sanity write token; run interactively, review the list first):"
  );
  console.log("");
  console.log(
    `  npx sanity documents delete $(cat ${path.relative(repoRoot, idsPath)}) --dataset <dataset>`
  );
  console.log("");
  console.log(
    "Every id is namespaced curriculum-version-* or course-review-*, so this cannot delete a document another family's migration created."
  );
}

main();
