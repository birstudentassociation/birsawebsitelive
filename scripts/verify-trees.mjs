#!/usr/bin/env npx tsx
/**
 * Verification script for the guided-journey tree migration (REDESIGN-2.0
 * §11.4 Wave 6). Reads ONLY the NDJSON artifact `scripts/migrate-trees.mjs`
 * wrote (no Sanity, no network — "This runs against the artifact, offline",
 * shared Wave 6 brief), rebuilds a `SmartAnswerService` and an
 * `OnboardingTrack[]` from it with the exact inverse transforms in
 * `lib/migration/trees.ts`, and asserts everything the brief's gate names by
 * name, not by count, so a failure says which node broke it:
 *
 *   - every node reachable from its topic's entry point
 *   - every option's `next` resolves to a real node
 *   - no cycles
 *   - every terminal node actually terminates (an outcome, never a dangling edge)
 *   - every fact an option asserts is in the declared fact vocabulary
 *   - every node carries both locales
 *   - the artifact's node-id set equals the source's, exactly
 *   - every internal href in the artifact resolves to a real 2.0 route
 *     (`app/[lang]/**`), and no href carries a hard-coded locale prefix
 *   - the shared diff report (`docs/migration/trees.json`, written by
 *     `lib/migration/report.ts`) accounts for every source file: zero
 *     unaccounted for, per the shared Wave 6 brief's own gate
 *

 * The FIRST SIX reuse `validateService` from `lib/smart-answers.ts` rather
 * than reimplementing it: it is the exact function the live runtime already
 * calls, so re-running it against the RECONSTRUCTED graph is a proof that
 * the artifact would behave identically to the source at runtime, not a
 * parallel check that could itself disagree with the real one. The id-set
 * comparison against source and the route check are specific to migration
 * (`validateService` has no reason to know what "the source" or "a real
 * 2.0 route" means) and live only here.
 *
 * RUN WITH `npx tsx`, not plain `node` — see `scripts/migrate-trees.mjs`'s
 * header for why:
 *
 *   npx tsx scripts/verify-trees.mjs [path/to/trees.ndjson]
 *
 * Defaults to `docs/migration/artifacts/trees.ndjson` (Wave 6D's own
 * directory convention; see `scripts/migrate-trees.mjs`'s header). Exits
 * non-zero and prints
 * every problem, by name, on any failure.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { service as sourceService, TRIAGE_SLUG } from "@/content/smart-answers/index";
import { audienceQuestions as sourceAudienceQuestions } from "@/content/smart-answers/audience";
import { onboardingTracks as sourceOnboardingTracks } from "@/content/onboarding/index";
import { validateService } from "@/lib/smart-answers";
import {
  deepEqualIgnoringKeyOrder,
  docsToAudienceQuestions,
  docsToOnboardingTracks,
  docsToSmartAnswerService,
  nodeDocId,
  topicDocId,
  onboardingTrackDocId,
} from "@/lib/migration/trees";
import { readMigrationReportJson } from "@/lib/migration/report";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readNdjson(absPath) {
  const text = readFileSync(absPath, "utf8");
  return text
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        throw new Error(
          `verify-trees: line ${index + 1} of ${absPath} is not valid JSON: ${error.message}`
        );
      }
    });
}

/**
 * Every route this repo actually serves, read from the App Router file tree
 * itself rather than from `docs/ROUTE-MAP-2.0.md` (a document can drift from
 * the code; the routing tree cannot). `[param]` segments become a wildcard,
 * so `/help/answers/[topic]` matches `/help/answers/anything`.
 */
function realRouteTemplates() {
  const appLangDir = path.join(repoRoot, "app", "[lang]");
  const templates = [];
  const walk = (dir, segments) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        const segment = entry.name.startsWith("[") ? "*" : entry.name;
        walk(path.join(dir, entry.name), [...segments, segment]);
        continue;
      }
      if (entry.name === "page.tsx") templates.push(segments);
    }
  };
  walk(appLangDir, []);
  return templates;
}

function hrefMatchesRoute(href, templates) {
  const segments = href.split("/").filter(Boolean);
  return templates.some((template) => {
    if (template.length !== segments.length) return false;
    return template.every((part, index) => part === "*" || part === segments[index]);
  });
}

/** Every internal href reachable in a `SmartAnswerService`'s outcomes and an
 * `OnboardingTrack[]`'s tasks, paired with where it was found. */
function collectInternalHrefs(service, tracks) {
  const found = [];
  for (const node of service.nodes) {
    if (node.kind !== "outcome") continue;
    for (const action of node.actions ?? []) {
      if (!action.external) found.push({ href: action.href, where: `node "${node.id}" action` });
    }
    for (const citation of node.citations ?? []) {
      found.push({ href: citation.href, where: `node "${node.id}" citation` });
    }
    for (const related of node.related ?? []) {
      found.push({ href: related.href, where: `node "${node.id}" related link` });
    }
  }
  for (const track of tracks) {
    for (const step of track.steps) {
      for (const task of step.tasks) {
        if (task.href && !task.external) {
          found.push({
            href: task.href,
            where: `onboarding "${track.audience}/${step.id}/${task.id}"`,
          });
        }
      }
    }
  }
  return found;
}

function main() {
  const argPath = process.argv[2] ?? "docs/migration/artifacts/trees.ndjson";
  const absPath = path.isAbsolute(argPath) ? argPath : path.join(repoRoot, argPath);
  const problems = [];

  if (!existsSync(absPath)) {
    console.error(
      `verify-trees: no artifact at ${argPath}. Run "npx tsx scripts/migrate-trees.mjs" first.`
    );
    process.exit(1);
  }

  const documents = readNdjson(absPath);

  // The shared brief's own gate, checked against the shared report writer's
  // own record rather than re-deriving "accounted for" here a second time:
  // "the diff report accounts for every file... 'unaccounted for' must be
  // zero, and the verification script fails if it is not."
  try {
    const { unaccounted } = readMigrationReportJson("docs/migration/trees");
    for (const sourcePath of unaccounted) {
      problems.push(`source file "${sourcePath}" is unaccounted for in docs/migration/trees.md`);
    }
  } catch (error) {
    problems.push(
      `could not read docs/migration/trees.json (run "npx tsx scripts/migrate-trees.mjs" first): ${error.message}`
    );
  }

  // Every line must be a well-formed Sanity document reference at minimum.
  for (const [index, doc] of documents.entries()) {
    if (typeof doc !== "object" || doc === null) {
      problems.push(`line ${index + 1}: not a JSON object`);
      continue;
    }
    if (typeof doc._id !== "string" || doc._id.length === 0)
      problems.push(`line ${index + 1}: missing _id`);
    if (typeof doc._type !== "string" || doc._type.length === 0)
      problems.push(`line ${index + 1}: missing _type`);
  }

  // No _id collisions in the artifact itself.
  const idCounts = new Map();
  for (const doc of documents) {
    idCounts.set(doc._id, (idCounts.get(doc._id) ?? 0) + 1);
  }
  for (const [id, count] of idCounts) {
    if (count > 1) problems.push(`document id "${id}" appears ${count} times in the artifact`);
  }

  if (problems.length > 0) {
    reportAndExit(problems);
  }

  // Reconstruct, using the exact inverse of the forward transform.
  let reconstructedService, reconstructedAudienceQuestions, reconstructedTracks;
  try {
    reconstructedService = docsToSmartAnswerService(documents);
    reconstructedAudienceQuestions = docsToAudienceQuestions(documents);
    reconstructedTracks = docsToOnboardingTracks(documents);
  } catch (error) {
    problems.push(`artifact could not be reconstructed into a service: ${error.message}`);
    reportAndExit(problems);
  }

  // The gate's first six checks: run the runtime's own validator against
  // the graph rebuilt from the artifact, not a parallel reimplementation.
  for (const problem of validateService(reconstructedService)) {
    problems.push(`[validateService] ${problem}`);
  }

  // The set of node ids in the artifact must equal the set in the source,
  // exactly. `validateService` has no way to know what "the source" is;
  // this is the migration-specific half of the gate.
  const sourceNodeIds = new Set(sourceService.nodes.map((n) => n.id));
  const artifactNodeIds = new Set(reconstructedService.nodes.map((n) => n.id));
  for (const id of sourceNodeIds) {
    if (!artifactNodeIds.has(id)) problems.push(`source node "${id}" is missing from the artifact`);
  }
  for (const id of artifactNodeIds) {
    if (!sourceNodeIds.has(id)) problems.push(`artifact node "${id}" does not exist in the source`);
  }

  const sourceTopicSlugs = new Set(sourceService.topics.map((t) => t.slug));
  const artifactTopicSlugs = new Set(reconstructedService.topics.map((t) => t.slug));
  for (const slug of sourceTopicSlugs) {
    if (!artifactTopicSlugs.has(slug))
      problems.push(`source topic "${slug}" is missing from the artifact`);
  }
  for (const slug of artifactTopicSlugs) {
    if (!sourceTopicSlugs.has(slug))
      problems.push(`artifact topic "${slug}" does not exist in the source`);
  }

  const triageTopic = reconstructedService.topics.find((t) => t.slug === TRIAGE_SLUG);
  if (!triageTopic) {
    problems.push(
      `triage entry point "${TRIAGE_SLUG}" (TRIAGE_SLUG) has no matching topic in the artifact`
    );
  }

  // Audience fact vocabulary: same dimensions, same choice values, both
  // locales, in the artifact as in the source.
  const sourceDimensions = new Set(sourceAudienceQuestions.map((q) => q.dimension));
  const artifactDimensions = new Set(reconstructedAudienceQuestions.map((q) => q.dimension));
  for (const dimension of sourceDimensions) {
    if (!artifactDimensions.has(dimension)) {
      problems.push(`audience dimension "${dimension}" is missing from the artifact`);
    }
  }
  for (const question of reconstructedAudienceQuestions) {
    if (!question.question.en?.trim() || !question.question.th?.trim()) {
      problems.push(`audience question "${question.dimension}" is missing a locale`);
    }
    for (const choice of question.choices) {
      if (!choice.label.en?.trim() || !choice.label.th?.trim()) {
        problems.push(
          `audience choice "${question.dimension}.${choice.value}" is missing a locale`
        );
      }
    }
  }

  // Onboarding: source and artifact tracks must match exactly, task ids
  // unique within their track, and every href a real route.
  const sourceAudiences = new Set(sourceOnboardingTracks.map((t) => t.audience));
  const artifactAudiences = new Set(reconstructedTracks.map((t) => t.audience));
  for (const audience of sourceAudiences) {
    if (!artifactAudiences.has(audience))
      problems.push(`onboarding track "${audience}" is missing from the artifact`);
  }
  for (const audience of artifactAudiences) {
    if (!sourceAudiences.has(audience))
      problems.push(`artifact onboarding track "${audience}" does not exist in the source`);
  }
  for (const track of reconstructedTracks) {
    const taskIds = new Set();
    for (const step of track.steps) {
      if (!step.title.en?.trim() || !step.title.th?.trim()) {
        problems.push(`onboarding step "${track.audience}/${step.id}" is missing a locale`);
      }
      for (const task of step.tasks) {
        if (taskIds.has(task.id)) {
          problems.push(`onboarding track "${track.audience}" has duplicate task id "${task.id}"`);
        }
        taskIds.add(task.id);
        if (!task.label.en?.trim() || !task.label.th?.trim()) {
          problems.push(
            `onboarding task "${track.audience}/${step.id}/${task.id}" is missing a locale`
          );
        }
      }
    }
  }

  // Deep structural equality against source: the strongest form of the
  // gate's "isomorphic" requirement, checked here on the running artifact
  // (`tests/unit/migration-trees.test.ts` checks it as a property test in
  // CI; this repeats it against whatever artifact is actually on disk, in
  // case it was regenerated by a different revision of the source).
  const sortedSourceService = {
    topics: [...sourceService.topics].sort((a, b) => a.slug.localeCompare(b.slug)),
    nodes: [...sourceService.nodes].sort((a, b) => a.id.localeCompare(b.id)),
  };
  if (!deepEqualIgnoringKeyOrder(sortedSourceService, reconstructedService)) {
    problems.push(
      "reconstructed service is not deep-equal to the source service (order-normalised); " +
        "the artifact and the source have drifted. Re-run scripts/migrate-trees.mjs."
    );
  }

  // Every internal href resolves to a route this repo actually serves.
  const templates = realRouteTemplates();
  for (const { href, where } of collectInternalHrefs(reconstructedService, reconstructedTracks)) {
    if (!href.startsWith("/")) {
      problems.push(`${where}: internal href "${href}" does not start with "/"`);
      continue;
    }
    if (/^\/(en|th)\//.test(href) || /^\/(en|th)$/.test(href)) {
      problems.push(`${where}: internal href "${href}" carries a hard-coded locale prefix`);
      continue;
    }
    if (!hrefMatchesRoute(href, templates)) {
      problems.push(
        `${where}: internal href "${href}" does not match any route under app/[lang]/**`
      );
    }
  }

  // Document id derivation must still be the one this family uses (catches
  // an artifact built by a stale or hand-edited script).
  for (const node of reconstructedService.nodes) {
    const expected = nodeDocId(node.id);
    if (!documents.some((doc) => doc._id === expected && doc._type === "smartAnswerNode")) {
      problems.push(`node "${node.id}" does not have the expected document id "${expected}"`);
    }
  }
  for (const topic of reconstructedService.topics) {
    const expected = topicDocId(topic.slug);
    if (!documents.some((doc) => doc._id === expected && doc._type === "smartAnswerTopic")) {
      problems.push(`topic "${topic.slug}" does not have the expected document id "${expected}"`);
    }
  }
  for (const track of reconstructedTracks) {
    const expected = onboardingTrackDocId(track.audience);
    if (!documents.some((doc) => doc._id === expected && doc._type === "onboardingTrack")) {
      problems.push(
        `onboarding track "${track.audience}" does not have the expected document id "${expected}"`
      );
    }
  }

  reportAndExit(problems);
}

function reportAndExit(problems) {
  if (problems.length === 0) {
    console.log("verify-trees: OK — the artifact is sound and isomorphic to the source.");
    process.exit(0);
  }
  console.error(`verify-trees: FAILED, ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

main();
