#!/usr/bin/env node
/**
 * Wave 6B verification: asserts the shared Wave 6 brief's gate against
 * `docs/migration/modules.ndjson` and `docs/migration/modules-report.md`,
 * entirely offline (REDESIGN-2.0 §11.4 item 6).
 *
 * This script reads only the two artifacts `scripts/migrate-modules.mjs`
 * writes; it never re-reads `content/**`, never touches the network, and
 * never needs a Sanity token. That is deliberate: verification checks that
 * what was WRITTEN is internally consistent and matches what the report
 * CLAIMS, which is a different (and cheaper, and re-runnable-by-anyone)
 * question than "does this match the source", already covered by
 * `tests/unit/migration-modules.test.ts` running the same pure transforms
 * the migration script calls.
 *
 * Prints every failure by name (never a bare count — REDESIGN-2.0 §11.4:
 * "print what is wrong, by name, not a count") and exits non-zero if any
 * check fails.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NDJSON_PATH = path.join(REPO_ROOT, "docs/migration/modules.ndjson");
const REPORT_PATH = path.join(REPO_ROOT, "docs/migration/modules-report.md");

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
      fail(`modules.ndjson line ${index + 1}: not valid JSON (${err.message})`);
      return null;
    }
  });
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function checkLocalizedString(doc, fieldPath, value) {
  if (!value || typeof value !== "object") {
    fail(`${doc._id}: ${fieldPath} is missing or not an object`);
    return;
  }
  if (!isNonEmptyString(value.en)) fail(`${doc._id}: ${fieldPath}.en is empty`);
  if (!isNonEmptyString(value.th)) fail(`${doc._id}: ${fieldPath}.th is empty`);
}

function main() {
  let documents;
  try {
    documents = readNdjson(NDJSON_PATH).filter(Boolean);
  } catch (err) {
    console.error(`verify-modules: could not read ${NDJSON_PATH}: ${err.message}`);
    console.error("Run `node scripts/migrate-modules.mjs` first.");
    process.exit(1);
  }

  let report;
  try {
    report = readFileSync(REPORT_PATH, "utf8");
  } catch (err) {
    console.error(`verify-modules: could not read ${REPORT_PATH}: ${err.message}`);
    process.exit(1);
  }

  // --- No id collides -------------------------------------------------------
  const idCounts = new Map();
  for (const doc of documents) {
    if (!isNonEmptyString(doc._id)) {
      fail(`a document has no _id: ${JSON.stringify(doc).slice(0, 120)}`);
      continue;
    }
    idCounts.set(doc._id, (idCounts.get(doc._id) ?? 0) + 1);
  }
  for (const [id, count] of idCounts) {
    if (count > 1) fail(`duplicate _id "${id}" appears ${count} times`);
  }

  // --- Every document has a real _type -----------------------------------
  const KNOWN_TYPES = new Set(["regulation", "committeeMember", "portfolio", "siteSettings"]);
  for (const doc of documents) {
    if (!KNOWN_TYPES.has(doc._type)) {
      fail(`${doc._id ?? "(no id)"}: unrecognised _type "${doc._type}"`);
    }
  }

  const byType = (type) => documents.filter((d) => d._type === type);

  // --- regulation ------------------------------------------------------------
  for (const doc of byType("regulation")) {
    checkLocalizedString(doc, "title", doc.title);
    if (!isNonEmptyString(doc.slug?.current)) fail(`${doc._id}: slug.current is empty`);
    if (doc.effectiveDate !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(doc.effectiveDate)) {
      fail(`${doc._id}: effectiveDate "${doc.effectiveDate}" is not YYYY-MM-DD`);
    }
  }

  // --- committeeMember ---------------------------------------------------------
  const committeeIds = new Set(byType("committeeMember").map((d) => d._id));
  for (const doc of byType("committeeMember")) {
    checkLocalizedString(doc, "firstName", doc.firstName);
    checkLocalizedString(doc, "lastName", doc.lastName);
    checkLocalizedString(doc, "nickname", doc.nickname);
    checkLocalizedString(doc, "role", doc.role);
    if (!isNonEmptyString(doc.slug?.current)) fail(`${doc._id}: slug.current is empty`);
    if (doc.group !== "officer" && doc.group !== "assistant") {
      fail(`${doc._id}: group "${doc.group}" is neither "officer" nor "assistant"`);
    }
    if (doc.lifecycle?.status !== "draft") {
      fail(`${doc._id}: lifecycle.status is "${doc.lifecycle?.status}", expected "draft"`);
    }
  }

  // --- portfolio: holder/secondHolder present, distinct, and resolve ------------
  const portfolioIds = new Set(byType("portfolio").map((d) => d._id));
  for (const doc of byType("portfolio")) {
    if (!isNonEmptyString(doc.portfolioId)) fail(`${doc._id}: portfolioId is empty`);
    const holderRef = doc.holder?._ref;
    const secondRef = doc.secondHolder?._ref;
    if (!isNonEmptyString(holderRef)) fail(`${doc._id}: holder._ref is missing`);
    if (!isNonEmptyString(secondRef)) fail(`${doc._id}: secondHolder._ref is missing`);
    if (holderRef && secondRef && holderRef === secondRef) {
      fail(`${doc._id}: holder and secondHolder are the same document (${holderRef})`);
    }
    for (const [label, r] of [
      ["holder", holderRef],
      ["secondHolder", secondRef],
    ]) {
      if (r && !committeeIds.has(r)) {
        fail(
          `${doc._id}: ${label} references "${r}", which is not a committeeMember in this artifact`
        );
      }
    }
    for (const additional of doc.additionalHolders ?? []) {
      if (!committeeIds.has(additional._ref)) {
        fail(
          `${doc._id}: additionalHolders references "${additional._ref}", which is not a ` +
            `committeeMember in this artifact`
        );
      }
    }
  }

  // --- committeeMember.portfolio, when present, must resolve -----------------------
  for (const doc of byType("committeeMember")) {
    const portfolioRef = doc.portfolio?._ref;
    if (portfolioRef && !portfolioIds.has(portfolioRef)) {
      fail(
        `${doc._id}: portfolio references "${portfolioRef}", which is not a portfolio in ` +
          `this artifact (a dangling reference)`
      );
    }
  }

  // --- siteSettings: exactly one, fixed id, contact.email present -----------------
  const siteSettingsDocs = byType("siteSettings");
  if (siteSettingsDocs.length !== 1) {
    fail(`expected exactly one siteSettings document, found ${siteSettingsDocs.length}`);
  } else {
    const doc = siteSettingsDocs[0];
    if (doc._id !== "siteSettings") {
      fail(`siteSettings document has _id "${doc._id}", expected the fixed id "siteSettings"`);
    }
    if (!isNonEmptyString(doc.contact?.email)) {
      fail(`${doc._id}: contact.email is empty`);
    }
  }

  // --- The report itself claims zero unaccounted files -----------------------------
  const unaccountedSection = report.split("## Unaccounted for")[1] ?? "";
  if (!/none\./i.test(unaccountedSection)) {
    fail(
      'modules-report.md\'s "Unaccounted for" section does not say "None." — the gate requires ' +
        "zero unaccounted source files"
    );
  }

  // --- Report and artifact agree on document count -----------------------------
  const countMatch = /(\d+) document\(s\) written/.exec(report);
  if (countMatch && Number(countMatch[1]) !== documents.length) {
    fail(
      `modules-report.md claims ${countMatch[1]} document(s), but modules.ndjson contains ` +
        `${documents.length}`
    );
  }

  // --- Summary ---------------------------------------------------------------------
  if (failures.length > 0) {
    console.error(`verify-modules: ${failures.length} failure(s):`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }

  console.log(
    `verify-modules: OK — ${documents.length} document(s), ` +
      `${byType("regulation").length} regulation, ${byType("committeeMember").length} committeeMember, ` +
      `${byType("portfolio").length} portfolio, ${byType("siteSettings").length} siteSettings.`
  );
}

main();
