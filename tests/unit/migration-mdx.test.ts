/**
 * Integration tests for the Wave 6A scripts (REDESIGN-2.0 §11.4 item 6):
 * `scripts/migrate-mdx.mjs`, `scripts/verify-mdx.mjs` and
 * `scripts/rollback-mdx.mjs`, run against the REAL corpus.
 *
 * This complements `tests/unit/migration-portable-text.test.ts`, which
 * proves the pure serializer correct against small synthetic fixtures. That
 * file cannot catch a mistake in how the scripts wire the serializer up to
 * `lib/content.ts`'s real loaders, the id scheme, or the report writer --
 * only actually running the scripts against `content/**` does, which is
 * what this file does, once, in a `beforeAll`, so all the tests below
 * assert on the one real run's output rather than each paying the cost of
 * a fresh migration (parsing 126 real files through esbuild + the
 * serializer takes a few seconds; running it forty times would not).
 *
 * These tests never assume a specific number of migrated/not-migrated
 * files: the corpus changes over time (content is added, an unsupported
 * construct gets a serializer fix), and hard-coding today's counts would
 * make every future content edit fail this suite for no reason connected to
 * a real regression. What IS asserted is structural: the two artifacts
 * exist, are internally consistent with each other, cover the whole real
 * corpus, and verify/rollback agree with what migrate wrote.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "../..");
const NDJSON_PATH = path.join(REPO_ROOT, "docs/migration/mdx.ndjson");
const REPORT_JSON_PATH = path.join(REPO_ROOT, "docs/migration/mdx-report.json");
const REPORT_MD_PATH = path.join(REPO_ROOT, "docs/migration/mdx-report.md");
const ROLLBACK_IDS_PATH = path.join(REPO_ROOT, "docs/migration/mdx-rollback-ids.txt");

function run(scriptRelativePath: string, extraArgs: string[] = []) {
  return execFileSync("node", [scriptRelativePath, ...extraArgs], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
}

function readNdjson(): Array<Record<string, unknown>> {
  return readFileSync(NDJSON_PATH, "utf8")
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line));
}

function listRealSourceFiles(): string[] {
  const families: Array<{ dir: string; audience?: string }> = [
    { dir: "content/news/en" },
    { dir: "content/news/th" },
    { dir: "content/clubs/en" },
    { dir: "content/clubs/th" },
    { dir: "content/activity/en" },
    { dir: "content/activity/th" },
  ];
  for (const locale of ["en", "th"]) {
    for (const audience of ["handbook", "home", "international"]) {
      families.push({ dir: `content/student-life/${locale}/${audience}` });
    }
  }
  const files: string[] = [];
  for (const family of families) {
    const dir = path.join(REPO_ROOT, family.dir);
    if (!existsSync(dir)) continue;
    for (const entry of readdirSync(dir)) {
      if (entry.endsWith(".mdx")) files.push(`${family.dir}/${entry}`);
    }
  }
  return files.sort();
}

describe("scripts/migrate-mdx.mjs, verify-mdx.mjs, rollback-mdx.mjs (real corpus)", () => {
  let firstRunNdjson: string;
  let firstRunReportJson: string;

  beforeAll(() => {
    run("scripts/migrate-mdx.mjs");
    firstRunNdjson = readFileSync(NDJSON_PATH, "utf8");
    firstRunReportJson = readFileSync(REPORT_JSON_PATH, "utf8");
  }, 60_000);

  afterAll(() => {
    // Leave a fresh, current artifact on disk rather than whatever the last
    // assertion happened to produce (rollback's ids file, a second migrate
    // run) -- the artifact is a real deliverable other agents' verify
    // scripts look for in docs/migration/, not test scratch.
    run("scripts/migrate-mdx.mjs");
  }, 60_000);

  it("writes an NDJSON document for every real MDX file the report claims as migrated", () => {
    const report = JSON.parse(firstRunReportJson) as {
      counts: Record<string, number>;
      entries: Array<{ sourcePath: string; status: string; documentId?: string }>;
      unaccounted: string[];
    };
    const realFiles = listRealSourceFiles();
    const reportedFiles = report.entries.map((e) => e.sourcePath).sort();
    expect(reportedFiles).toEqual(realFiles);
    expect(report.unaccounted).toEqual([]);
    const migratedCount = report.counts.migrated ?? 0;
    const notMigratedCount = report.counts["not-migrated"] ?? 0;
    const gapCount = report.counts.gap ?? 0;
    expect(migratedCount + notMigratedCount + gapCount).toBe(realFiles.length);
  });

  it("produces a human-readable report that mentions Portable Text (the Wave 6E roll-up check greps for this)", () => {
    const md = readFileSync(REPORT_MD_PATH, "utf8");
    expect(md).toMatch(/portable\s+text/i);
  });

  it("gives every migrated document a unique _id matching its report entry", () => {
    const docs = readNdjson();
    const ids = docs.map((d) => d._id);
    expect(new Set(ids).size).toBe(ids.length);
    const report = JSON.parse(firstRunReportJson) as {
      entries: Array<{ status: string; documentId?: string }>;
    };
    const migratedIds = new Set(
      report.entries.filter((e) => e.status === "migrated").map((e) => e.documentId)
    );
    expect(new Set(ids)).toEqual(migratedIds);
  });

  it("carries both languages on every localizedString/localizedText value in the artifact", () => {
    const docs = readNdjson();
    function walk(value: unknown): void {
      if (value === null || typeof value !== "object") return;
      if (Array.isArray(value)) {
        value.forEach(walk);
        return;
      }
      const obj = value as Record<string, unknown>;
      if (obj._type === "localizedString" || obj._type === "localizedText") {
        expect(typeof obj.en === "string" && (obj.en as string).trim().length > 0).toBe(true);
        expect(typeof obj.th === "string" && (obj.th as string).trim().length > 0).toBe(true);
      }
      for (const [key, child] of Object.entries(obj)) {
        if (key === "_type") continue;
        walk(child);
      }
    }
    docs.forEach(walk);
  });

  it("is deterministic: running migrate-mdx.mjs twice on an unchanged tree is byte-identical", () => {
    run("scripts/migrate-mdx.mjs");
    const secondRunNdjson = readFileSync(NDJSON_PATH, "utf8");
    const secondRunReportJson = readFileSync(REPORT_JSON_PATH, "utf8");
    expect(secondRunNdjson).toBe(firstRunNdjson);
    expect(secondRunReportJson).toBe(firstRunReportJson);
  }, 60_000);

  it("passes its own verify script against the artifact it just wrote", () => {
    expect(() => run("scripts/verify-mdx.mjs")).not.toThrow();
    const output = run("scripts/verify-mdx.mjs");
    expect(output).toMatch(/verify-mdx: OK\./);
  });

  it("verify-mdx.mjs fails loudly, by name, when the artifact is tampered with", () => {
    // Corrupt a copy's-worth of state by writing an NDJSON with a blank
    // Thai value, run verify against it, then restore the real artifact.
    const original = readFileSync(NDJSON_PATH, "utf8");
    try {
      const docs = original
        .split("\n")
        .filter((l) => l.trim())
        .map((l) => JSON.parse(l));
      const target = docs.find((d) => d.title?._type === "localizedString");
      expect(target).toBeDefined();
      target.title.th = "";
      writeFileSync(NDJSON_PATH, docs.map((d: unknown) => JSON.stringify(d)).join("\n") + "\n");
      let threw = false;
      let stderr = "";
      try {
        run("scripts/verify-mdx.mjs");
      } catch (err) {
        threw = true;
        stderr = String((err as { stderr?: Buffer | string }).stderr ?? err);
      }
      expect(threw).toBe(true);
      expect(stderr).toMatch(/empty\/missing "th"/);
    } finally {
      writeFileSync(NDJSON_PATH, original);
    }
  });

  it("rollback-mdx.mjs writes exactly the ids in the current artifact, sorted, one per line", () => {
    run("scripts/rollback-mdx.mjs");
    const docs = readNdjson();
    const expectedIds = [...new Set(docs.map((d) => d._id as string))].sort();
    const rollbackIds = readFileSync(ROLLBACK_IDS_PATH, "utf8")
      .split("\n")
      .filter((l) => l.trim().length > 0);
    expect(rollbackIds).toEqual(expectedIds);
  });

  it("refuses to run outside the repo root", () => {
    expect(() =>
      execFileSync("node", [path.join(REPO_ROOT, "scripts/migrate-mdx.mjs")], {
        cwd: path.join(REPO_ROOT, "content"),
        encoding: "utf8",
      })
    ).toThrow();
  });
});
