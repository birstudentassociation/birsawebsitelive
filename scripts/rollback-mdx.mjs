#!/usr/bin/env node
/**
 * Wave 6A rollback: derives the undo for `docs/migration/mdx.ndjson` from
 * the artifact's own `_id` list (REDESIGN-2.0 §11.4 item 6).
 *
 * Reads no source content and no separate id derivation: the ids to delete
 * are exactly the `_id`s the migration script already wrote, so this cannot
 * drift from what was actually imported the way a second, independent id
 * computation could (`scripts/rollback-modules.mjs` does the same thing for
 * the same reason; see its header). Writes
 * `docs/migration/mdx-rollback-ids.txt` (one id per line, sorted, for
 * `xargs`) and prints the exact `sanity documents delete` command for the
 * operator to run after confirming the import should be undone.
 *
 * This script does not call the Sanity API. There is no write token in this
 * checkout (the shared brief is explicit about this), and even with one,
 * deleting documents is exactly the kind of irreversible action this
 * migration family does not get to decide to run on its own -- an operator
 * runs the printed command by hand, having read it first.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

if (process.cwd() !== REPO_ROOT) {
  console.error(
    `rollback-mdx: must be run from the repo root (${REPO_ROOT}), not ${process.cwd()}.`
  );
  process.exit(1);
}

function repoPath(...parts) {
  for (const part of parts) {
    if (path.isAbsolute(part)) {
      throw new Error(
        `rollback-mdx: repoPath() received an absolute path segment "${part}"; pass relative segments only.`
      );
    }
  }
  return path.join(REPO_ROOT, ...parts);
}

const NDJSON_PATH = repoPath("docs/migration/mdx.ndjson");
const IDS_OUT_PATH = repoPath("docs/migration/mdx-rollback-ids.txt");

function main() {
  let text;
  try {
    text = readFileSync(NDJSON_PATH, "utf8");
  } catch (err) {
    console.error(`rollback-mdx: could not read ${NDJSON_PATH}: ${err.message}`);
    console.error("Run `node scripts/migrate-mdx.mjs` first.");
    process.exit(1);
  }

  const ids = text
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line)._id)
    .filter((id) => typeof id === "string" && id.length > 0);

  const uniqueSortedIds = [...new Set(ids)].sort();

  if (uniqueSortedIds.length !== ids.length) {
    console.error(
      "rollback-mdx: mdx.ndjson contains duplicate _id values; refusing to write a rollback list until " +
        "`node scripts/verify-mdx.mjs` passes (it fails loudly on this exact condition)."
    );
    process.exit(1);
  }

  writeFileSync(IDS_OUT_PATH, uniqueSortedIds.join("\n") + "\n", "utf8");

  console.log(`rollback-mdx: wrote ${uniqueSortedIds.length} id(s) to ${IDS_OUT_PATH}`);
  console.log("");
  console.log("To undo this migration, an operator with a Sanity write token runs:");
  console.log("");
  console.log(`  xargs sanity documents delete < ${path.relative(REPO_ROOT, IDS_OUT_PATH)}`);
  console.log("");
  console.log(
    "That deletes every document this family's migration wrote and nothing else -- it never touches a " +
      "document created by hand in the Studio or by another Wave 6 family's import, because the id list " +
      "above is exactly (and only) what scripts/migrate-mdx.mjs's last successful run produced."
  );
}

main();
