/**
 * The diff-report writer for content migration (REDESIGN-2.0 §11.4).
 *
 * SHARED CONTRACT. Owned and written by Wave 6A, read only by the other
 * three Wave 6 content migration agents. §11.4's gate is explicit: "the
 * diff report accounts for every file", and "'unaccounted for' must be
 * zero, and the verification script fails if it is not." That is a
 * property of the REPORT FORMAT, not of any one family's content, so it is
 * implemented once here rather than reinvented four times with four
 * subtly different notions of "accounted for".
 *
 * WHAT "ACCOUNTED FOR" MEANS HERE: every path in `allSourceFiles` (the
 * caller's own complete corpus listing — this module has no opinion on
 * globs) must appear in `entries` exactly once. A path in `allSourceFiles`
 * that never got an entry is "unaccounted" and is written into the report
 * under its own heading so it cannot be missed by skimming; `writeReport`
 * also returns the unaccounted list so the caller's migrate script can
 * decide whether to fail its own run on it (Wave 6A's `migrate-mdx.mjs`
 * does; see that file's header for why that decision belongs to the
 * migrate script and not to this one).
 *
 * TWO OUTPUT FILES, ONE CALL: `${outBasePath}.md` is the human-readable
 * report ("the diff report" §11.4 asks for, read by the operator).
 * `${outBasePath}.json` is the same data as structured JSON, written so a
 * verify script can assert on it without parsing markdown — regenerating
 * the count of "not-migrated" entries by grepping a table is exactly the
 * kind of drift-prone duplicate implementation `docs/CMS-SCHEMA-CONVENTIONS.md`
 * warns against elsewhere in this codebase.
 *
 * DETERMINISM: entries are sorted by `sourcePath` before either file is
 * written, regardless of the order the caller built them in, so two runs
 * over an unchanged tree produce byte-identical output (§11.4).
 *
 * SCOPE OF THIS CONTRACT: keep the exported shape stable once another agent
 * depends on it (see `ids.ts`'s header for the same rule, which applies
 * here for the same reason).
 */
import fs from "node:fs";
import path from "node:path";

export type MigrationStatus = "migrated" | "not-migrated" | "gap";

/**
 * One source file's outcome. `documentId` is required (and meaningful) only
 * for `"migrated"`; `reason` is required for `"not-migrated"` and `"gap"`
 * because REDESIGN-2.0 §11.4 asks for outcomes "by name", i.e. a human can
 * read why without cross-referencing anything else.
 *
 * `"gap"` vs `"not-migrated"`: both leave the source file untouched (Wave 6
 * never deletes 1.0 content) and both are reported by name, but they are
 * not the same finding. `"not-migrated"` is this migration's OWN inability
 * to represent something (an MDX construct the serializer refuses to guess
 * at, for instance) — a defect or a limit in the migration tooling or the
 * target schema. `"gap"` is a finding ABOUT THE SOURCE CONTENT ITSELF (its
 * required bilingual twin is missing, for instance) that would still be
 * true even with a perfect serializer. Keeping them distinct means a reader
 * of the report can tell "the tooling isn't there yet" from "the content
 * itself has a hole" without reading every reason string.
 */
export type MigrationEntry = {
  /** Repo-relative path, forward slashes, e.g. "content/news/en/foo.mdx". */
  sourcePath: string;
  status: MigrationStatus;
  /** The emitted Sanity `_id`. Required when status is "migrated". */
  documentId?: string;
  /** Why, in one sentence. Required when status is not "migrated". */
  reason?: string;
  /** Optional extra detail lines, e.g. one per section the serializer emitted. */
  notes?: string[];
};

export type MigrationReportCounts = Record<MigrationStatus, number> & { unaccounted: number };

export type WriteReportResult = {
  /** Source paths present in `allSourceFiles` with no matching entry. Must be empty for the gate to pass. */
  unaccounted: string[];
  counts: MigrationReportCounts;
};

function assertValidEntry(entry: MigrationEntry): void {
  if (entry.status === "migrated" && !entry.documentId) {
    throw new Error(
      `lib/migration/report.ts: entry for "${entry.sourcePath}" is "migrated" but carries no documentId.`
    );
  }
  if (entry.status !== "migrated" && !entry.reason) {
    throw new Error(
      `lib/migration/report.ts: entry for "${entry.sourcePath}" has status "${entry.status}" but no reason. ` +
        `§11.4 requires every non-migrated outcome to be named, not counted.`
    );
  }
}

function renderTableRow(entry: MigrationEntry): string {
  const idOrReason = entry.status === "migrated" ? (entry.documentId ?? "") : (entry.reason ?? "");
  const notes = entry.notes && entry.notes.length > 0 ? entry.notes.join("<br>") : "";
  return `| \`${entry.sourcePath}\` | ${entry.status} | ${idOrReason} | ${notes} |`;
}

function renderMarkdown(params: {
  title: string;
  intro?: string;
  entries: MigrationEntry[];
  unaccounted: string[];
  counts: MigrationReportCounts;
}): string {
  const { title, intro, entries, unaccounted, counts } = params;
  const lines: string[] = [];
  lines.push(`# ${title}`, "");
  if (intro) lines.push(intro, "");
  lines.push("## Summary", "");
  lines.push(`- Migrated: ${counts.migrated}`);
  lines.push(`- Not migrated: ${counts["not-migrated"]}`);
  lines.push(`- Gap: ${counts.gap}`);
  lines.push(`- Unaccounted for: ${counts.unaccounted}`);
  lines.push("");
  lines.push(
    counts.unaccounted === 0
      ? "Every source file in this family's corpus has an outcome below. Nothing is unaccounted for."
      : '**GATE FAILURE**: the files listed under "Unaccounted for" below have no migration outcome at all.'
  );
  lines.push("");
  lines.push("## Outcomes", "");
  lines.push("| Source | Status | Document id / reason | Notes |");
  lines.push("| --- | --- | --- | --- |");
  for (const entry of entries) {
    lines.push(renderTableRow(entry));
  }
  lines.push("");
  if (unaccounted.length > 0) {
    lines.push("## Unaccounted for", "");
    lines.push(
      "These source files exist in the corpus this migration owns but produced no migration " +
        "outcome. This must never happen; if it does, the migrate script has a bug."
    );
    lines.push("");
    for (const sourcePath of unaccounted) {
      lines.push(`- \`${sourcePath}\``);
    }
    lines.push("");
  }
  return lines.join("\n");
}

/**
 * Writes `${outBasePath}.md` and `${outBasePath}.json`, creating parent
 * directories as needed, and returns the unaccounted-for list plus a
 * summary count so the caller can decide what to do with either.
 *
 * `outBasePath` is repo-relative (e.g. `"docs/migration/mdx"`); this
 * function resolves it against `process.cwd()`, matching every other
 * filesystem entry point in this repo (`lib/content.ts`'s `CONTENT_ROOT`).
 */
export function writeMigrationReport(params: {
  outBasePath: string;
  title: string;
  intro?: string;
  allSourceFiles: string[];
  entries: MigrationEntry[];
}): WriteReportResult {
  const { outBasePath, title, intro, allSourceFiles, entries } = params;

  for (const entry of entries) assertValidEntry(entry);

  const bySourcePath = new Map<string, MigrationEntry>();
  for (const entry of entries) {
    if (bySourcePath.has(entry.sourcePath)) {
      throw new Error(
        `lib/migration/report.ts: "${entry.sourcePath}" has more than one migration entry. ` +
          "Each source file gets exactly one outcome."
      );
    }
    bySourcePath.set(entry.sourcePath, entry);
  }

  const sortedEntries = [...entries].sort((a, b) => a.sourcePath.localeCompare(b.sourcePath));
  const knownSet = new Set(allSourceFiles);
  const unaccounted = allSourceFiles
    .filter((sourcePath) => !bySourcePath.has(sourcePath))
    .sort((a, b) => a.localeCompare(b));

  // Entries for files this family does not claim to own are a bug in the
  // caller (an off-by-one glob, a typo'd path), surfaced immediately rather
  // than silently accepted into a report that would otherwise look clean.
  const unowned = entries.filter((entry) => !knownSet.has(entry.sourcePath));
  if (unowned.length > 0) {
    throw new Error(
      "lib/migration/report.ts: entries reference paths not present in allSourceFiles: " +
        unowned.map((e) => e.sourcePath).join(", ")
    );
  }

  const counts: MigrationReportCounts = {
    migrated: sortedEntries.filter((e) => e.status === "migrated").length,
    "not-migrated": sortedEntries.filter((e) => e.status === "not-migrated").length,
    gap: sortedEntries.filter((e) => e.status === "gap").length,
    unaccounted: unaccounted.length,
  };

  const markdown = renderMarkdown({ title, intro, entries: sortedEntries, unaccounted, counts });
  const jsonPayload = {
    title,
    counts,
    entries: sortedEntries,
    unaccounted,
  };

  const mdPath = path.join(process.cwd(), `${outBasePath}.md`);
  const jsonPath = path.join(process.cwd(), `${outBasePath}.json`);
  fs.mkdirSync(path.dirname(mdPath), { recursive: true });
  fs.writeFileSync(mdPath, markdown, "utf8");
  fs.writeFileSync(jsonPath, `${JSON.stringify(jsonPayload, null, 2)}\n`, "utf8");

  return { unaccounted, counts };
}

/**
 * Reads back a report's `.json` sidecar, for a verify script that checks a
 * migrate script's output without re-running the migration itself.
 */
export function readMigrationReportJson(outBasePath: string): {
  title: string;
  counts: MigrationReportCounts;
  entries: MigrationEntry[];
  unaccounted: string[];
} {
  const jsonPath = path.join(process.cwd(), `${outBasePath}.json`);
  const raw = fs.readFileSync(jsonPath, "utf8");
  return JSON.parse(raw);
}
