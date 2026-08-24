#!/usr/bin/env npx tsx
/**
 * Migration script for the guided-journey tree family (REDESIGN-2.0 §11.4
 * Wave 6, Smart Answers + onboarding tracks). Reads `content/smart-answers/**`
 * and `content/onboarding/**` from the filesystem via a normal TypeScript
 * `import` (nothing here talks to the network or to Sanity), transforms them
 * with the pure functions in `lib/migration/trees.ts`, and writes two
 * artifacts:
 *
 *   1. An NDJSON file, one JSON document per line, in the exact shape
 *      `sanity dataset import` consumes (`_id` + `_type` on every line).
 *      THIS IS A DRAFT ARTIFACT, not a ready-to-import one: see
 *      `lib/migration/trees.ts`'s file header and `docs/migration/trees.md`
 *      for the schema gap it is provisional against (no Sanity document type
 *      for a Smart Answers node or topic exists yet).
 *   2. `docs/migration/trees.md` + `.json`, the diff report the shared Wave 6
 *      brief requires, written through `lib/migration/report.ts` (Wave 6A's
 *      shared writer, not reimplemented here — see that file's own header
 *      for why "unaccounted for" is a property of the report FORMAT rather
 *      than of any one family). A full source-id -> document-id trail for
 *      every topic, node, audience question and onboarding track is
 *      appended to the `.md` after the shared writer's own table, since
 *      that format is one row per SOURCE FILE and this family's files each
 *      produce many documents.
 *

 * ARTIFACT LOCATION: `docs/migration/artifacts/trees.ndjson`, matching Wave
 * 6D's own convention (`docs/migration/artifacts/curriculum.ndjson`) rather
 * than a fourth one of this family's own invention. An earlier revision of
 * this script wrote to a `migration-output/` directory at the repo root;
 * that directory is gone, and every path below is relative to
 * `docs/migration/` for exactly the reason 6D's own layout already
 * establishes: generated migration output lives inside `docs/migration/`,
 * not scattered at the repo root where it reads as accidental droppings.
 *
 * RUN WITH `npx tsx`, NOT PLAIN `node`. `scripts/seed-external-links.mjs`
 * documents a house pattern of regex-parsing TypeScript source specifically
 * to avoid needing a TS runtime, on the stated grounds that "this repository
 * has no tsx/ts-node runtime". That claim does not hold today: `tsx@4.23.12`
 * is a real, lockfile-pinned transitive dependency (of the `vitest`
 * toolchain) already present after a plain `npm ci`, not an incidental leftover
 * (`package-lock.json` pins it; confirmed by running scripted TS imports
 * with it while building this migration). Regex-parsing was the right call
 * for that script's flat constant array; it would be actively dangerous here
 * — Smart Answers' `Condition`/`OutcomeBlock`/option trees are deeply
 * nested, mutually recursive TypeScript object literals, and a regex
 * extractor confident enough to reconstruct them correctly would be a
 * hand-rolled parser wearing a regex costume. This agent's report flags the
 * inconsistency for the orchestrator; until reconciled, run every script in
 * this family through `tsx`:
 *
 *   npx tsx scripts/migrate-trees.mjs [--out <path>] [--report <path>]
 *
 * Defaults: `--out docs/migration/artifacts/trees.ndjson`,
 * `--report docs/migration/trees.md`. Both are generated artifacts (shared
 * brief: "do not commit the generated NDJSON itself... commit the script
 * that regenerates it"); whether `docs/migration/artifacts/` as a whole is
 * gitignored or deliberately committed is a decision across all four Wave 6
 * content-migration agents (6B and 6D write into the same directory), not
 * one this family can make alone, and `.gitignore` is outside this agent's
 * owned paths in any case — see the report for this follow-up.
 */
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { service, TRIAGE_SLUG } from "@/content/smart-answers/index";
import { audienceQuestions } from "@/content/smart-answers/audience";
import { triage } from "@/content/smart-answers/topics/triage";
import { contact } from "@/content/smart-answers/topics/contact";
import { activities } from "@/content/smart-answers/topics/activities";
import { study } from "@/content/smart-answers/topics/study";
import { living } from "@/content/smart-answers/topics/living";
import { wellbeing } from "@/content/smart-answers/topics/wellbeing";
import { onboardingTracks } from "@/content/onboarding/index";
import { homeTrack } from "@/content/onboarding/home";
import { internationalTrack } from "@/content/onboarding/international";
import { validateService } from "@/lib/smart-answers";
import {
  buildOnboardingDocuments,
  buildSmartAnswerDocuments,
  nodeDocId,
  topicDocId,
  onboardingTrackDocId,
} from "@/lib/migration/trees";
import { writeMigrationReport } from "@/lib/migration/report";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  const args = { out: "docs/migration/artifacts/trees.ndjson", report: "docs/migration/trees.md" };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--out") args.out = argv[++i];
    else if (argv[i] === "--report") args.report = argv[++i];
  }
  return args;
}

function writeNdjson(absPath, documents) {
  mkdirSync(path.dirname(absPath), { recursive: true });
  const lines = documents.map((doc) => JSON.stringify(doc));
  writeFileSync(absPath, lines.join("\n") + "\n", "utf8");
}

/**
 * One `MigrationEntry` (`lib/migration/report.ts`) per source file in this
 * family. The shared writer is per-source-FILE, one entry each; this family
 * does not fit that 1:1 (a single topic file produces many topic AND node
 * documents), so `documentId` below carries a short summary string rather
 * than one literal id, and the full per-item trail is appended to the `.md`
 * separately (see `idTrailMarkdown`). That is a known mismatch between this
 * family's shape and the shared report's assumption, named here rather than
 * worked around by forking the writer.
 */
function buildEntries({ documents }) {
  const audienceDocs = documents.filter((d) => d._type === "smartAnswerAudienceQuestion");

  const entries = [
    {
      sourcePath: "content/smart-answers/types.ts",
      status: "not-migrated",
      reason:
        "Defines the TypeScript types this migration mirrors field for field " +
        "(Bi, Condition, SmartAnswerOption, ...). Produces no document of its own.",
    },
    {
      sourcePath: "content/smart-answers/audience.ts",
      status: "migrated",
      documentId: audienceDocs.map((d) => d._id).join(", "),
      notes: [
        "The fact vocabulary every Condition in the graph is checked against " +
          "(smartAnswerAudienceQuestion x3).",
      ],
    },
    {
      sourcePath: "content/smart-answers/index.ts",
      status: "not-migrated",
      reason:
        "Assembles the 6 topic fragments (reflected in this script's own imports, not a " +
        "separate document) and exports TRIAGE_SLUG, topicGroupList and uiCopy.",
      notes: [
        "TRIAGE_SLUG is preserved as the isTriageEntry flag on the matching topic document " +
          "(see lib/migration/trees.ts).",
        "topicGroupList (5 group titles/ledes) and uiCopy (this feature's UI chrome strings) " +
          "are deliberately not migrated as documents: template chrome, not addressable " +
          "content, the same distinction content/dictionaries already draws sitewide.",
      ],
    },
  ];

  const topicFiles = [
    ["content/smart-answers/topics/triage.ts", triage],
    ["content/smart-answers/topics/contact.ts", contact],
    ["content/smart-answers/topics/activities.ts", activities],
    ["content/smart-answers/topics/study.ts", study],
    ["content/smart-answers/topics/living.ts", living],
    ["content/smart-answers/topics/wellbeing.ts", wellbeing],
  ];
  for (const [sourcePath, fragment] of topicFiles) {
    entries.push({
      sourcePath,
      status: "migrated",
      documentId: fragment.topics.map((t) => topicDocId(t.slug)).join(", "),
      notes: [
        `${fragment.topics.length} topic(s), ${fragment.nodes.length} node(s). Full id trail below.`,
      ],
    });
  }

  entries.push(
    {
      sourcePath: "content/onboarding/types.ts",
      status: "not-migrated",
      reason:
        "Defines the TypeScript types this migration mirrors field for field. Produces no document of its own.",
    },
    {
      sourcePath: "content/onboarding/index.ts",
      status: "not-migrated",
      reason:
        "Assembles the 2 track fragments (reflected in this script's own imports) and exports " +
        "onboardingUiCopy, this feature's UI chrome, deliberately not migrated as a document " +
        "for the same reason as content/smart-answers/index.ts's uiCopy.",
    }
  );

  const onboardingFiles = [
    ["content/onboarding/home.ts", homeTrack],
    ["content/onboarding/international.ts", internationalTrack],
  ];
  for (const [sourcePath, track] of onboardingFiles) {
    const stepCount = track.steps.length;
    const taskCount = track.steps.reduce((sum, step) => sum + step.tasks.length, 0);
    entries.push({
      sourcePath,
      status: "migrated",
      documentId: onboardingTrackDocId(track.audience),
      notes: [`1 track, ${stepCount} step(s), ${taskCount} task(s).`],
    });
  }

  return entries;
}

/**
 * Appended after the shared writer's own table: the full source-id ->
 * document-id trail, one row per topic/node/track, since the shared report
 * format tops out at one row per source FILE and this family's files each
 * produce many documents.
 */
function idTrailMarkdown({ onboardingFragments }) {
  const lines = [];
  lines.push("## Full id trail (Wave 6C addendum)");
  lines.push("");
  lines.push(
    "Every source id and the document id it became, one row per topic / node / onboarding " +
      "track — the granularity the table above cannot show at one row per source file. " +
      "`scripts/verify-trees.mjs` re-derives every one of these independently rather than " +
      "trusting this listing."
  );
  lines.push("");
  lines.push("### Topics");
  lines.push("");
  lines.push("| slug | group | document id |");
  lines.push("| --- | --- | --- |");
  for (const topic of [...service.topics].sort((a, b) => a.slug.localeCompare(b.slug))) {
    lines.push(`| \`${topic.slug}\` | ${topic.group} | \`${topicDocId(topic.slug)}\` |`);
  }
  lines.push("");
  lines.push("### Nodes");
  lines.push("");
  lines.push("| source id | kind | document id |");
  lines.push("| --- | --- | --- |");
  for (const node of [...service.nodes].sort((a, b) => a.id.localeCompare(b.id))) {
    lines.push(`| \`${node.id}\` | ${node.kind} | \`${nodeDocId(node.id)}\` |`);
  }
  lines.push("");
  lines.push("### Onboarding tracks");
  lines.push("");
  lines.push("| audience | steps | tasks | document id |");
  lines.push("| --- | --- | --- | --- |");
  for (const track of onboardingFragments) {
    const stepCount = track.steps.length;
    const taskCount = track.steps.reduce((sum, step) => sum + step.tasks.length, 0);
    lines.push(
      `| \`${track.audience}\` | ${stepCount} | ${taskCount} | \`${onboardingTrackDocId(track.audience)}\` |`
    );
  }
  lines.push("");
  lines.push(
    "**The schema gap.** No Sanity document type for a Smart Answers node, topic or an " +
      "onboarding track exists in `sanity/schemaTypes/**` today; the ids above are provisional. " +
      "See `lib/migration/trees.ts`'s file header and this agent's final report."
  );
  lines.push("");
  return lines.join("\n");
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  // Defensive: refuse to migrate a source tree that is not already sound.
  // `validateService` is the exact function the runtime relies on
  // (`lib/smart-answers.ts`); if the source itself is broken, migrating it
  // faithfully would just move the breakage into the artifact.
  const sourceProblems = validateService(service);
  if (sourceProblems.length > 0) {
    console.error("migrate-trees: refusing to migrate, the source service is not sound:");
    for (const problem of sourceProblems) console.error(`  - ${problem}`);
    process.exit(1);
  }

  const smartAnswerDocuments = buildSmartAnswerDocuments(service, audienceQuestions, TRIAGE_SLUG);
  const onboardingDocuments = buildOnboardingDocuments(onboardingTracks);
  const documents = [...smartAnswerDocuments, ...onboardingDocuments];

  // Determinism + no-id-collision check before anything is written: a
  // collision here means two different source items derived the same `_id`,
  // which `sanity dataset import` would silently resolve by last-write-wins.
  const seen = new Map();
  for (const doc of documents) {
    const prior = seen.get(doc._id);
    if (prior) {
      console.error(
        `migrate-trees: document id collision "${doc._id}" between ${prior} and ${doc._type}`
      );
      process.exit(1);
    }
    seen.set(doc._id, doc._type);
  }

  const outPath = path.isAbsolute(args.out) ? args.out : path.join(repoRoot, args.out);
  if (!args.report.endsWith(".md") || path.isAbsolute(args.report)) {
    console.error(
      `migrate-trees: --report must be a repo-relative path ending in .md (matching ` +
        `lib/migration/report.ts's own contract), got "${args.report}"`
    );
    process.exit(1);
  }
  // `writeMigrationReport` (lib/migration/report.ts) resolves its
  // `outBasePath` against `process.cwd()`, matching `lib/content.ts`'s own
  // convention — so this stays REPO-RELATIVE rather than pre-joined with
  // `repoRoot`, and this script only works run from the repo root (as its
  // own header instructs). Joining an already-absolute path onto
  // `process.cwd()` here would silently nest the two together into a
  // broken path, which is exactly what happened before this comment was
  // added: caught by inspecting the actual output, not by any check, which
  // is itself worth naming in this agent's report.
  const reportBasePath = args.report.slice(0, -".md".length);
  const reportPath = path.join(process.cwd(), args.report);

  writeNdjson(outPath, documents);

  // The shared writer (lib/migration/report.ts, Wave 6A) owns the
  // per-source-file table and the "unaccounted for" gate; this family's own
  // per-item id trail is appended after it, not folded into it (see
  // `buildEntries`'s doc comment for why the shapes do not match 1:1).
  const allSourceFiles = [
    "content/smart-answers/types.ts",
    "content/smart-answers/audience.ts",
    "content/smart-answers/index.ts",
    "content/smart-answers/topics/triage.ts",
    "content/smart-answers/topics/contact.ts",
    "content/smart-answers/topics/activities.ts",
    "content/smart-answers/topics/study.ts",
    "content/smart-answers/topics/living.ts",
    "content/smart-answers/topics/wellbeing.ts",
    "content/onboarding/types.ts",
    "content/onboarding/index.ts",
    "content/onboarding/home.ts",
    "content/onboarding/international.ts",
  ];
  const { unaccounted, counts } = writeMigrationReport({
    outBasePath: reportBasePath,
    title: "Guided-journey tree migration: diff report",
    intro:
      "Wave 6C, REDESIGN-2.0 §11.4. Generated by `scripts/migrate-trees.mjs`; regenerate " +
      "rather than editing by hand. Covers Smart Answers (`content/smart-answers/**`) and " +
      "onboarding tracks (`content/onboarding/**`). Read `lib/migration/trees.ts`'s file " +
      "header before trusting the emitted document shapes at face value: no Sanity document " +
      "type for a Smart Answers node, topic or onboarding track exists yet, so this is a " +
      "provisional, faithful mirror of the source, not a ready-to-import payload.",
    allSourceFiles,
    entries: buildEntries({ documents }),
  });
  if (unaccounted.length > 0) {
    // The shared writer already names them in the .md; fail loudly here too,
    // since a migrate script producing an unaccounted-for file is a bug the
    // shared brief says the verify script must also catch.
    console.error(`migrate-trees: ${unaccounted.length} source file(s) unaccounted for:`);
    for (const sourcePath of unaccounted) console.error(`  - ${sourcePath}`);
    process.exit(1);
  }

  appendFileSync(
    reportPath,
    idTrailMarkdown({ onboardingFragments: [homeTrack, internationalTrack] }),
    "utf8"
  );

  console.log(
    `migrate-trees: wrote ${documents.length} documents to ${path.relative(repoRoot, outPath)}`
  );
  console.log(
    `migrate-trees: wrote diff report to ${path.relative(repoRoot, reportPath)} ` +
      `(migrated ${counts.migrated}, not-migrated ${counts["not-migrated"]}, gap ${counts.gap})`
  );
}

main();
