#!/usr/bin/env node
/**
 * Verification script for the curriculum / course-review family
 * (REDESIGN-2.0 §11.4 item 6, Wave 6D). Runs entirely offline against the
 * NDJSON artifact scripts/migrate-curriculum.mjs wrote — no Sanity token,
 * no network call, matching the shared Wave 6 brief's hard constraint.
 *
 * Two passes:
 *
 *   1. Artifact validity — reparses the NDJSON, checks every line is valid
 *      JSON with `_id` and `_type`, splits documents by type, and re-runs
 *      every check in lib/migration/curriculum.ts's `runAllChecks` against
 *      them (id uniqueness, bilingual parity, credit arithmetic,
 *      prerequisite resolution and cycles, cohort uniqueness, course-review
 *      cross-references). This validates the artifact exactly as an
 *      operator would receive it, independent of the source tree.
 *   1a. Two independent id-uniqueness checks — this module's own
 *       (lib/migration/curriculum.ts's checkIdUniqueness, inside
 *       runAllChecks) and Wave 6A's shared lib/migration/ids.ts
 *       (assertNoDuplicateIds) — and the diff report's own unaccounted-for
 *       count, read back from docs/migration/curriculum.json.
 *   2. Freshness — rebuilds the documents directly from
 *      `content/curriculum/**` / `content/course-review/courses.ts` and
 *      diffs them against what the artifact actually contains. This is the
 *      one pass that does read the filesystem source again (not the
 *      network): it is what catches an artifact that was generated before
 *      the last content edit and never regenerated.
 *
 * On any failure this prints exactly what is wrong, by name, and exits 1 —
 * never a bare count, per the shared brief.
 *
 * USAGE
 *
 *   npx tsx scripts/verify-curriculum.mjs [--artifact <path>]
 *
 * `--artifact` defaults to docs/migration/artifacts/curriculum.ndjson, the
 * same default scripts/migrate-curriculum.mjs writes to.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  buildCurriculumVersionDocuments,
  buildCourseReviewDocuments,
  runAllChecks,
} from "../lib/migration/curriculum.ts";
import { assertNoDuplicateIds } from "../lib/migration/ids.ts";
import { readMigrationReportJson } from "../lib/migration/report.ts";

function parseArgs(argv) {
  const out = { artifact: "docs/migration/artifacts/curriculum.ndjson" };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--artifact" && argv[i + 1]) {
      out.artifact = argv[i + 1];
      i++;
    }
  }
  return out;
}

function readNdjson(filePath) {
  const text = readFileSync(filePath, "utf8");
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  const docs = [];
  const issues = [];
  lines.forEach((line, i) => {
    let parsed;
    try {
      parsed = JSON.parse(line);
    } catch (err) {
      issues.push(
        `line ${i + 1}: not valid JSON (${err instanceof Error ? err.message : String(err)})`
      );
      return;
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      issues.push(`line ${i + 1}: document is not a JSON object`);
      return;
    }
    if (typeof parsed._id !== "string" || parsed._id.length === 0) {
      issues.push(`line ${i + 1}: missing or empty _id`);
    }
    if (typeof parsed._type !== "string" || parsed._type.length === 0) {
      issues.push(`line ${i + 1}: missing or empty _type`);
    }
    docs.push(parsed);
  });
  return { docs, issues };
}

function main() {
  const { artifact } = parseArgs(process.argv.slice(2));
  const repoRoot = path.resolve(import.meta.dirname, "..");
  const artifactPath = path.resolve(repoRoot, artifact);

  try {
    readFileSync(artifactPath, "utf8");
  } catch {
    console.error(`verify-curriculum: cannot read artifact at ${artifactPath}.`);
    console.error("Run scripts/migrate-curriculum.mjs first.");
    process.exitCode = 1;
    return;
  }

  const { docs, issues: parseIssues } = readNdjson(artifactPath);

  const versionDocs = docs.filter((d) => d._type === "curriculumVersion");
  const courseDocs = docs.filter((d) => d._type === "courseReview");
  const otherDocs = docs.filter(
    (d) => d._type !== "curriculumVersion" && d._type !== "courseReview"
  );

  const structuralIssues = [...parseIssues];
  for (const doc of otherDocs) {
    structuralIssues.push(
      `${doc._id ?? "(no _id)"}: unexpected _type "${doc._type}" in the curriculum artifact`
    );
  }

  const validityIssues = runAllChecks(versionDocs, courseDocs);

  // Cross-check id uniqueness through Wave 6A's shared
  // lib/migration/ids.ts, independent of this module's own
  // checkIdUniqueness (lib/migration/curriculum.ts): two different pieces
  // of code agreeing "no duplicate ids" is a stronger guarantee than one
  // piece of code checking itself.
  const idCrossCheckIssues = [];
  try {
    assertNoDuplicateIds(
      [...versionDocs, ...courseDocs].map((d) => d._id),
      "curriculum and course-review documents"
    );
  } catch (err) {
    idCrossCheckIssues.push(
      `lib/migration/ids.ts assertNoDuplicateIds: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  // The diff report's own "unaccounted for" count, read back from the .json
  // sidecar scripts/migrate-curriculum.mjs wrote (via the shared
  // writeMigrationReport), rather than recomputed here — this is the one
  // check that is specifically about the report being right, not about the
  // NDJSON artifact.
  const reportIssues = [];
  try {
    const report = readMigrationReportJson("docs/migration/curriculum");
    if (report.unaccounted.length > 0) {
      reportIssues.push(
        `docs/migration/curriculum.json reports ${report.unaccounted.length} unaccounted-for file(s): ${report.unaccounted.join(", ")}`
      );
    }
  } catch (err) {
    reportIssues.push(
      `could not read docs/migration/curriculum.json: ${err instanceof Error ? err.message : String(err)}. Run scripts/migrate-curriculum.mjs first.`
    );
  }

  const freshVersionDocs = buildCurriculumVersionDocuments();
  const freshCourseDocs = buildCourseReviewDocuments();
  const freshnessIssues = [];
  const freshById = new Map([...freshVersionDocs, ...freshCourseDocs].map((d) => [d._id, d]));
  const artifactById = new Map([...versionDocs, ...courseDocs].map((d) => [d._id, d]));
  for (const [id, freshDoc] of freshById) {
    const artifactDoc = artifactById.get(id);
    if (!artifactDoc) {
      freshnessIssues.push(
        `${id}: exists in the current source tree but is missing from the artifact (stale artifact — rerun migrate)`
      );
      continue;
    }
    if (JSON.stringify(artifactDoc) !== JSON.stringify(freshDoc)) {
      freshnessIssues.push(
        `${id}: differs from what the current source tree would produce (stale artifact — rerun migrate)`
      );
    }
  }
  for (const id of artifactById.keys()) {
    if (!freshById.has(id)) {
      freshnessIssues.push(
        `${id}: present in the artifact but no longer produced by the current source tree (rerun migrate, or this id should be rolled back)`
      );
    }
  }

  const allIssues = [
    ...structuralIssues,
    ...validityIssues,
    ...idCrossCheckIssues,
    ...reportIssues,
    ...freshnessIssues,
  ];

  if (allIssues.length === 0) {
    console.log(
      `verify-curriculum: OK. ${versionDocs.length} curriculumVersion, ${courseDocs.length} courseReview documents, 0 issues.`
    );
    return;
  }

  console.error(`verify-curriculum: FAILED with ${allIssues.length} issue(s):`);
  for (const issue of allIssues) console.error(`  - ${issue}`);
  process.exitCode = 1;
}

main();
