#!/usr/bin/env npx tsx
/**
 * Rollback script for the guided-journey tree migration (REDESIGN-2.0 §11.4
 * Wave 6). There is no "undo the import" NDJSON for Sanity — deleting
 * documents is not something `sanity dataset import` does, and this
 * migration has no prior state to restore to (it is a first import, not an
 * update: nothing named `sa-node-*`, `sa-topic-*`, `sa-audience-*` or
 * `onboarding-track-*` exists in the dataset before this migration runs).
 * So "rollback" here means: enumerate exactly the document ids this
 * migration would create, so an operator can delete precisely those and
 * nothing else, even if the dataset has since gained unrelated documents.
 *
 * The id list is DERIVED, not hand-maintained: it calls the exact same
 * `buildSmartAnswerDocuments` / `buildOnboardingDocuments` functions
 * `scripts/migrate-trees.mjs` uses, so the rollback list can never name an
 * id the migration itself would not have created (or fail to name one it
 * did), by construction rather than by two lists being kept in sync by
 * hand.
 *
 * RUN WITH `npx tsx`, not plain `node` — see `scripts/migrate-trees.mjs`'s
 * header for why:
 *
 *   npx tsx scripts/rollback-trees.mjs [--out <path>]
 *
 * Writes a plain text file, one document id per line (default
 * `docs/migration/artifacts/trees-rollback-ids.txt`, matching Wave 6D's own
 * `docs/migration/artifacts/curriculum-rollback-ids.txt` convention). THE
 * OPERATOR STEP, once a real write token exists and the schema gap
 * `lib/migration/trees.ts` documents is closed:
 *
 *   sanity documents delete $(cat docs/migration/artifacts/trees-rollback-ids.txt) \
 *     --dataset <dataset>
 *
 * `sanity documents delete` accepts a space-separated list of ids on one
 * invocation; `xargs` is an alternative for a list too long for one command
 * line:
 *
 *   xargs sanity documents delete --dataset <dataset> < docs/migration/artifacts/trees-rollback-ids.txt
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { service, TRIAGE_SLUG } from "@/content/smart-answers/index";
import { audienceQuestions } from "@/content/smart-answers/audience";
import { onboardingTracks } from "@/content/onboarding/index";
import { buildOnboardingDocuments, buildSmartAnswerDocuments } from "@/lib/migration/trees";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  const args = { out: "docs/migration/artifacts/trees-rollback-ids.txt" };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--out") args.out = argv[++i];
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const documents = [
    ...buildSmartAnswerDocuments(service, audienceQuestions, TRIAGE_SLUG),
    ...buildOnboardingDocuments(onboardingTracks),
  ];

  const ids = documents.map((doc) => doc._id).sort();
  const outPath = path.isAbsolute(args.out) ? args.out : path.join(repoRoot, args.out);
  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(outPath, ids.join("\n") + "\n", "utf8");

  console.log(
    `rollback-trees: wrote ${ids.length} document ids to ${path.relative(repoRoot, outPath)}`
  );
  console.log("rollback-trees: operator command once a write token exists:");
  console.log(
    `  sanity documents delete $(cat ${path.relative(repoRoot, outPath)}) --dataset <dataset>`
  );
}

main();
