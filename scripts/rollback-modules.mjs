#!/usr/bin/env node
/**
 * Wave 6B rollback: derives the undo for `docs/migration/modules.ndjson`
 * from the artifact's own `_id` list (REDESIGN-2.0 §11.4 item 6).
 *
 * Reads no source content and no separate id derivation: the ids to delete
 * are exactly the `_id`s the migration script already wrote, so this cannot
 * drift from what was actually imported the way a second, independent id
 * computation could. Writes `docs/migration/modules-rollback-ids.txt` (one
 * id per line, sorted, for `xargs`) and prints the exact `sanity documents
 * delete` command for the operator to run after confirming the import
 * should be undone.
 *
 * This script does not call the Sanity API. There is no write token in this
 * checkout (the shared brief is explicit about this), and even with one,
 * deleting documents is exactly the kind of irreversible action this
 * migration family does not get to decide to run — an operator runs the
 * printed command by hand, having read it first.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NDJSON_PATH = path.join(REPO_ROOT, "docs/migration/modules.ndjson");
const IDS_OUT_PATH = path.join(REPO_ROOT, "docs/migration/modules-rollback-ids.txt");

function main() {
  let text;
  try {
    text = readFileSync(NDJSON_PATH, "utf8");
  } catch (err) {
    console.error(`rollback-modules: could not read ${NDJSON_PATH}: ${err.message}`);
    console.error("Run `node scripts/migrate-modules.mjs` first.");
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
      "rollback-modules: modules.ndjson contains duplicate _id values; refusing to write a " +
        "rollback list until `node scripts/verify-modules.mjs` passes (it fails loudly on " +
        "this exact condition)."
    );
    process.exit(1);
  }

  writeFileSync(IDS_OUT_PATH, uniqueSortedIds.join("\n") + "\n", "utf8");

  console.log(`rollback-modules: wrote ${uniqueSortedIds.length} id(s) to ${IDS_OUT_PATH}`);
  console.log("");
  console.log("Operator command (after `sanity dataset import`, to undo this import):");
  console.log("");
  console.log(`  sanity documents delete ${uniqueSortedIds.join(" ")}`);
  console.log("");
  console.log("Or, from the id list file:");
  console.log("");
  console.log(`  xargs sanity documents delete < ${path.relative(REPO_ROOT, IDS_OUT_PATH)}`);
}

main();
