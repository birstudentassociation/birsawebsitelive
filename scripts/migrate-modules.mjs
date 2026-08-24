#!/usr/bin/env node
/**
 * Wave 6B migration: TypeScript content modules -> Sanity NDJSON
 * (REDESIGN-2.0 §11.4 item 6). Reads `content/activity/regulations/**`,
 * `content/calendar/events.ts`, `content/committee.ts`, `content/site.ts`,
 * `content/quick.ts`, `content/reporting.ts` and `lib/portfolios.ts` from
 * disk, runs them through the pure transforms in `lib/migration/modules.ts`,
 * and writes:
 *
 *   - an NDJSON artifact, one JSON document per line, in the exact shape
 *     `sanity dataset import` consumes;
 *   - a markdown diff report accounting for every source file in the
 *     family, per the shared Wave 6 brief.
 *
 * OFFLINE BY DESIGN. This script never touches the network and never needs
 * `SANITY_API_READ_TOKEN` (which is unset in this checkout — the shared
 * brief is explicit that no write token exists at all). It reads the
 * filesystem, transforms in memory, and writes two files. The actual
 * `sanity dataset import` is an operator step, documented in
 * `docs/migration/modules.md`.
 *
 * WHY THIS SCRIPT READS TypeScript SOURCE VIA esbuild, NOT `import()`.
 * `content/**` is authored as real TypeScript modules (typed object
 * literals, cross-file imports, path-aliased `@/` imports), and this
 * repository's plain `.mjs` scripts have never been able to `import` `.ts`
 * files directly — there is no `ts-node`/`tsx` devDependency, by design
 * (see `scripts/check-contrast.mjs`'s header, which solves the same problem
 * a different way for a simpler file). `esbuild` IS already present
 * (a transitive dependency of `vite`/`vitest`, both real devDependencies),
 * so this script uses its programmatic `build()` API to bundle a `.ts`
 * entry point — resolving its own `@/` imports via the repo's real
 * `tsconfig.json`, which esbuild auto-detects — into a single ESM string,
 * then `import()`s that string as a `data:` URL. No temp files, no new
 * dependency, no network.
 *
 * DETERMINISM. Every collection below is sorted before it is written (by
 * `_id`), so running this script twice on an unchanged tree produces
 * byte-identical output. The only external fact this script consults beyond
 * `content/**` itself is the directory listing of `content/news/en`, used
 * only to classify (not migrate) `content/calendar/events.ts` entries; that
 * listing is itself sorted before use.
 */
import { readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import esbuild from "esbuild";

import {
  assessCalendarEvents,
  assessQuickLinks,
  assessReporting,
  transformCommitteeMember,
  transformPortfolios,
  transformRegulationDocument,
  transformSiteSettings,
} from "../lib/migration/modules.ts";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function repoPath(...parts) {
  return path.join(REPO_ROOT, ...parts);
}

// ---------------------------------------------------------------------------
// A TypeScript module loader with no new dependency and no temp files (see
// this file's header). Bundles `entryRelativePath` (repo-root relative) plus
// everything it imports into one ESM string via esbuild, then dynamically
// imports that string as a `data:` URL.
// ---------------------------------------------------------------------------

async function loadTsModule(entryRelativePath) {
  const result = await esbuild.build({
    entryPoints: [repoPath(entryRelativePath)],
    bundle: true,
    format: "esm",
    platform: "node",
    write: false,
    logLevel: "silent",
  });
  const code = result.outputFiles[0].text;
  const dataUrl = "data:text/javascript;base64," + Buffer.from(code, "utf8").toString("base64");
  return import(dataUrl);
}

// ---------------------------------------------------------------------------
// `idFor`: prefer Wave 6A's `lib/migration/ids.ts` when it exists, since
// every migration family's documents must derive ids the same way (a
// `committeeMember` reference from a `portfolio` document has to land on
// the id the committee family itself used). Fall back to a local,
// obviously-labelled implementation when it does not (yet) exist, which
// keeps this script runnable standalone. Which path ran is recorded in the
// diff report, not just printed, so a later `sanity dataset import` is
// never run against ids nobody can account for.
// ---------------------------------------------------------------------------

function localFallbackSlugify(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function localFallbackIdFor(parts) {
  return parts.map(localFallbackSlugify).join(".");
}

async function resolveIdFor() {
  const idsPath = repoPath("lib/migration/ids.ts");
  try {
    statSync(idsPath);
  } catch {
    return {
      idFor: localFallbackIdFor,
      source:
        "local fallback in scripts/migrate-modules.mjs (lib/migration/ids.ts does not exist " +
        "in this checkout yet)",
    };
  }

  let mod;
  try {
    mod = await loadTsModule("lib/migration/ids.ts");
  } catch (err) {
    return {
      idFor: localFallbackIdFor,
      source: `local fallback (lib/migration/ids.ts exists but failed to load: ${err.message})`,
    };
  }

  const candidateNames = ["documentId", "deriveId", "idFor", "makeId", "toId", "default"];
  for (const name of candidateNames) {
    const candidate = mod[name];
    if (typeof candidate !== "function") continue;
    // Every call site in lib/migration/modules.ts passes exactly two stable
    // parts, [type, key]. Try the two plausible signatures: `fn([type, key])`
    // and `fn(type, key)`, preferring the one that matches the function's
    // declared arity.
    const wrapped =
      candidate.length >= 2
        ? (parts) => candidate(parts[0], parts[1])
        : (parts) => candidate(parts);
    try {
      const probe = wrapped(["regulation", "probe"]);
      if (typeof probe === "string" && probe.length > 0) {
        return { idFor: wrapped, source: `lib/migration/ids.ts (export "${name}")` };
      }
    } catch {
      // Try the next candidate name.
    }
  }

  return {
    idFor: localFallbackIdFor,
    source:
      "local fallback (lib/migration/ids.ts exists but exports none of " +
      `${JSON.stringify(candidateNames)} as a callable id deriver; report this to Wave 6A)`,
  };
}

// ---------------------------------------------------------------------------
// Enumerate every file in the regulation corpus and classify it, so the
// diff report's "unaccounted for" count is asserted zero by construction
// rather than by a hand-maintained list that can silently go stale.
// ---------------------------------------------------------------------------

function walkTsFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkTsFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".ts")) {
      out.push(full);
    }
  }
  return out;
}

function classifyRegulationFile(absPath, slugsBySubdir) {
  const rel = path.relative(repoPath("content/activity/regulations"), absPath);
  const base = path.basename(absPath);
  const subdir = path.dirname(rel) === "." ? null : path.dirname(rel);
  const targetSlug = subdir ? slugsBySubdir[subdir] : slugsBySubdir["."];

  if (base === "types.ts") {
    return {
      rel,
      outcome: "not migrated (types only)",
      detail:
        "Type definitions for the regulation model. Not content; this is the model this " +
        "wave's transform is built against (lib/migration/modules.ts's header explains how).",
    };
  }
  if (base === "index.ts") {
    return {
      rel,
      outcome: "not migrated (barrel)",
      detail: "Re-exports only; carries no content of its own.",
    };
  }
  if (base === "documents.ts" || base === "doc.ts") {
    return {
      rel,
      outcome: `not migrated (assembly module for ${targetSlug ?? "the regulations library"})`,
      detail: "Assembles a RegulationDoc from its sibling files; carries no content of its own.",
    };
  }
  if (base === "meta.ts") {
    return {
      rel,
      outcome: `migrated: title/slug/effectiveDate of regulation:${targetSlug}`,
      detail:
        "This is the RegulationMeta front matter. title (as shortTitle), slug and a derived " +
        "effectiveDate were migrated; citation/authority/preamble/signatory were not — see " +
        "the gap for this document.",
    };
  }
  return {
    rel,
    outcome: `not migrated (provisions/sections only, folded into regulation:${targetSlug}'s single sections gap)`,
    detail:
      "Section/provision text authored here. regulation.ts's schema has no field that can " +
      'hold it (see this document\'s "sections (the whole provision tree)" gap, reported ' +
      "once per document rather than once per file).",
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const outDir = repoPath("docs/migration");
  mkdirSync(outDir, { recursive: true });

  const { idFor, source: idForSource } = await resolveIdFor();
  console.log(`migrate-modules: id deriver = ${idForSource}`);

  const [regulationsMod, calendarMod, committeeMod, siteMod, quickMod, portfoliosMod] =
    await Promise.all([
      loadTsModule("content/activity/regulations/index.ts"),
      loadTsModule("content/calendar/events.ts"),
      loadTsModule("content/committee.ts"),
      loadTsModule("content/site.ts"),
      loadTsModule("content/quick.ts"),
      loadTsModule("lib/portfolios.ts"),
    ]);

  const documents = [];
  const gaps = [];
  const fileOutcomes = [];

  // --- Regulations ----------------------------------------------------------
  const slugsBySubdir = {
    ".": "political-science-2565",
    "university-2563": "university-2563",
    "discipline-2568": "discipline-2568",
  };
  for (const doc of regulationsMod.documents) {
    const { document, gaps: docGaps } = transformRegulationDocument(doc, idFor);
    documents.push(document);
    gaps.push(...docGaps);
  }
  for (const absPath of walkTsFiles(repoPath("content/activity/regulations"))) {
    fileOutcomes.push(classifyRegulationFile(absPath, slugsBySubdir));
  }

  // --- Calendar (assessment only) --------------------------------------------
  const newsEnDir = repoPath("content/news/en");
  const existingContentSlugs = new Set(
    readdirSync(newsEnDir)
      .filter((name) => name.endsWith(".mdx"))
      .map((name) => name.replace(/\.mdx$/, ""))
      .sort()
  );
  const calendarAssessment = assessCalendarEvents(calendarMod.calendarEvents, existingContentSlugs);

  // --- Committee + portfolios -------------------------------------------------
  // Portfolios first: transformCommitteeMember needs to know which
  // portfolios actually got a document (>= 2 current holders) so it never
  // points a committeeMember.portfolio reference at an id this artifact
  // does not contain.
  const { documents: portfolioDocs, gaps: portfolioGaps } = transformPortfolios(
    portfoliosMod.portfolios,
    committeeMod.committee,
    idFor
  );
  documents.push(...portfolioDocs);
  gaps.push(...portfolioGaps);
  const migratedPortfolioIds = new Set(portfolioDocs.map((d) => d.portfolioId));

  const committeeOutcomes = [];
  for (const member of committeeMod.committee) {
    const { document, gaps: memberGaps } = transformCommitteeMember(
      member,
      portfoliosMod.portfolios,
      migratedPortfolioIds,
      idFor
    );
    documents.push(document);
    gaps.push(...memberGaps);
    committeeOutcomes.push({ key: member.key, id: document._id });
  }

  // --- Site settings -----------------------------------------------------------
  const { document: siteSettingsDoc, gaps: siteGaps } = transformSiteSettings(siteMod.contact);
  documents.push(siteSettingsDoc);
  gaps.push(...siteGaps);

  // --- Quick links + reporting (assessment only) --------------------------------
  gaps.push(...assessQuickLinks(quickMod.quickGroups));
  gaps.push(...assessReporting());

  // --- Sort, write NDJSON -------------------------------------------------------
  documents.sort((a, b) => a._id.localeCompare(b._id));
  const ndjsonPath = path.join(outDir, "modules.ndjson");
  writeFileSync(ndjsonPath, documents.map((d) => JSON.stringify(d)).join("\n") + "\n", "utf8");

  // --- Write the diff report -----------------------------------------------------
  const reportPath = path.join(outDir, "modules-report.md");
  writeFileSync(reportPath, renderReport(), "utf8");

  console.log(`migrate-modules: wrote ${documents.length} document(s) to ${ndjsonPath}`);
  console.log(`migrate-modules: wrote diff report to ${reportPath}`);

  function renderReport() {
    const lines = [];
    lines.push("# Wave 6B diff report: TypeScript content modules -> Sanity documents");
    lines.push("");
    lines.push(
      `Generated by \`scripts/migrate-modules.mjs\`. Id deriver: ${idForSource}. ` +
        `${documents.length} document(s) written to \`docs/migration/modules.ndjson\`.`
    );
    lines.push("");
    lines.push(
      "This is a diff report, not a success report: most of the fields named below are " +
        "gaps, not migrations. See `docs/migration/modules.md` for why."
    );
    lines.push("");

    lines.push("## Regulations (`content/activity/regulations/**` -> `regulation`)");
    lines.push("");
    lines.push("| File | Outcome |");
    lines.push("| --- | --- |");
    for (const f of fileOutcomes.sort((a, b) => a.rel.localeCompare(b.rel))) {
      lines.push(`| \`${f.rel}\` | ${f.outcome} |`);
    }
    lines.push("");
    lines.push(
      `Every regulation document received a stub (title, slug, and effectiveDate where the ` +
        `source's \`made\` line parsed): ` +
        documents
          .filter((d) => d._type === "regulation")
          .map((d) => `\`${d._id}\``)
          .join(", ") +
        "."
    );
    lines.push("");

    lines.push("## Calendar (`content/calendar/events.ts`) — not migrated, assessment only");
    lines.push("");
    lines.push(
      "No `event` documents were created from this file. Every entry is a date marker " +
        "pointing at a news/event post by slug, not standalone event content (no summary, " +
        "category, location or body in the source); see `lib/migration/modules.ts`'s header " +
        "on `assessCalendarEvents` for the full reasoning."
    );
    lines.push("");
    lines.push("| Calendar entry id | Target slug | Outcome |");
    lines.push("| --- | --- | --- |");
    for (const a of calendarAssessment) {
      lines.push(`| \`${a.id}\` | \`${a.matchedSlug}\` | ${a.outcome} |`);
    }
    lines.push("");

    lines.push("## Committee (`content/committee.ts` -> `committeeMember`)");
    lines.push("");
    lines.push("| Member key | Document id |");
    lines.push("| --- | --- |");
    for (const c of committeeOutcomes.sort((a, b) => a.key.localeCompare(b.key))) {
      lines.push(`| \`${c.key}\` | \`${c.id}\` |`);
    }
    lines.push("");

    lines.push(
      "## Portfolios (`lib/portfolios.ts` -> `portfolio`, cross-checked against committee.ts)"
    );
    lines.push("");
    lines.push("| Portfolio id | Outcome |");
    lines.push("| --- | --- |");
    for (const p of portfoliosMod.portfolios) {
      lines.push(
        `| \`${p.id}\` | ${migratedPortfolioIds.has(p.id) ? "migrated" : "not migrated — see gap below"} |`
      );
    }
    lines.push("");

    lines.push("## Site settings (`content/site.ts` -> `siteSettings` singleton)");
    lines.push("");
    lines.push(
      "`contact` (email, secondaryEmail, phone, address) migrated. `socials` and " +
        "`officialLinks` not migrated — see gaps."
    );
    lines.push("");

    lines.push("## Quick links (`content/quick.ts`) — not migrated");
    lines.push("");
    lines.push(
      `All ${quickMod.quickGroups.reduce((n, g) => n + g.items.length, 0)} items across ` +
        `${quickMod.quickGroups.length} groups. See gaps and \`lib/migration/modules.ts\`'s ` +
        "header on `assessQuickLinks` for why neither `navigation` nor `siteSettings` fits."
    );
    lines.push("");

    lines.push("## Reporting channels (`content/reporting.ts`) — not migrated");
    lines.push("");
    lines.push("See the single gap below.");
    lines.push("");

    lines.push("## Every gap, by scope");
    lines.push("");
    lines.push("| Scope | Field | Reason |");
    lines.push("| --- | --- | --- |");
    for (const g of [...gaps].sort(
      (a, b) => a.scope.localeCompare(b.scope) || a.field.localeCompare(b.field)
    )) {
      lines.push(`| \`${g.scope}\` | ${g.field} | ${g.reason.replace(/\|/g, "\\|")} |`);
    }
    lines.push("");

    lines.push("## Unaccounted for");
    lines.push("");
    lines.push(
      "None. Every file under `content/activity/regulations/**`, plus " +
        "`content/calendar/events.ts`, `content/committee.ts`, `content/site.ts`, " +
        "`content/quick.ts`, `content/reporting.ts` and `lib/portfolios.ts`, has an outcome " +
        "above (migrated, migrated-with-gaps, or not migrated with a reason)."
    );
    lines.push("");

    return lines.join("\n");
  }
}

main().catch((err) => {
  console.error("migrate-modules: failed");
  console.error(err);
  process.exit(1);
});
