/**
 * Tests for content/privacy/register.ts, the single register that the privacy
 * notice, the cookies page and the section 39 processing record all render
 * from.
 *
 * These are consistency tests rather than behaviour tests, and they exist
 * because of what the compliance audit actually found: the previous privacy
 * notice told readers the site set "one functional cookie, NEXT_LOCALE" when
 * it set six. That was wrong in a way any reader could check for themselves
 * in their own browser, and nothing in the codebase would ever have caught
 * it, because prose in a page component has nothing to disagree with.
 *
 * Now it does. The register is the one place these facts live, so the useful
 * thing to assert is that the register still matches the code: every cookie
 * the app sets is documented, every processor an activity names exists, and
 * the retention period the notice promises is the same number the purge job
 * enforces.
 */
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  RETENTION_YEARS,
  RIGHTS_RESPONSE_DAYS,
  BREACH_NOTIFICATION_HOURS,
  activities,
  processors,
  cookieRecords,
  browserStorage,
  dataRights,
  activityById,
  processorById,
} from "@/content/privacy/register";
import { locales } from "@/lib/i18n";

const REPO_ROOT = join(__dirname, "..", "..");

/** Directories worth scanning for cookie names. Excludes node_modules, build output and the tests themselves. */
const SOURCE_DIRS = ["app", "components", "lib", "proxy.ts"];

function collectSourceFiles(relativePath: string): string[] {
  const absolute = join(REPO_ROOT, relativePath);
  const stats = statSync(absolute);
  if (stats.isFile()) return [absolute];

  const found: string[] = [];
  for (const entry of readdirSync(absolute, { withFileTypes: true })) {
    const child = join(relativePath, entry.name);
    if (entry.isDirectory()) {
      found.push(...collectSourceFiles(child));
    } else if (/\.tsx?$/.test(entry.name)) {
      found.push(join(REPO_ROOT, child));
    }
  }
  return found;
}

function readAllSource(): string {
  return SOURCE_DIRS.flatMap(collectSourceFiles)
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");
}

describe("privacy register", () => {
  it("keeps the promised retention period and the enforced one as one number", () => {
    // lib/privacy/retention.ts imports this same constant, so a change here
    // changes what the purge job deletes as well as what the notice says.
    // The assertion is that BIRSA's decision is still two years.
    expect(RETENTION_YEARS).toBe(2);
  });

  it("states the statutory deadlines the Act sets", () => {
    expect(RIGHTS_RESPONSE_DAYS).toBe(30); // s.30 paragraph 4
    expect(BREACH_NOTIFICATION_HOURS).toBe(72); // s.37(4)
  });

  it("documents every cookie the app actually sets", () => {
    // The defect this guards against: a new form journey adds a draft cookie
    // and nobody updates the notice, so the cookies page understates what is
    // on the reader's device. Any cookie name matching the site's naming
    // conventions must appear in `cookieRecords`.
    const source = readAllSource();
    const documented = new Set(cookieRecords.map((record) => record.name));

    const found = new Set<string>();
    for (const match of source.matchAll(/["'`](birsa_[a-z0-9_]+|NEXT_LOCALE)["'`]/g)) {
      found.add(match[1]!);
    }

    // Sanity check that the scan found anything at all: an empty result would
    // make this test pass vacuously forever.
    expect(found.size).toBeGreaterThan(0);

    const undocumented = [...found].filter((name) => !documented.has(name));
    expect(undocumented).toEqual([]);
  });

  it("documents every browser storage key the app actually writes", () => {
    const source = readAllSource();
    const found = new Set<string>();
    for (const match of source.matchAll(/["'`](birsa-[a-z0-9-]+)["'`]/g)) {
      found.add(match[1]!);
    }

    expect(found.size).toBeGreaterThan(0);

    // `birsa-onboarding-*` is documented as a wildcard because there is one
    // key per onboarding track, so match on prefix rather than exact string.
    const prefixes = browserStorage.map((entry) => entry.key.replace(/\*$/, ""));
    const undocumented = [...found].filter(
      (key) => !prefixes.some((prefix) => key === prefix || key.startsWith(prefix))
    );
    expect(undocumented).toEqual([]);
  });

  it("documents the study plan localStorage key", () => {
    const entry = browserStorage.find((k) => k.key === "birsa-study-plan");
    expect(entry).toBeDefined();
    expect(entry?.purpose.en.trim().length).toBeGreaterThan(0);
    expect(entry?.purpose.th.trim().length).toBeGreaterThan(0);
  });

  it("resolves every processor an activity names", () => {
    // s.23(4) requires the notice to name the categories of recipient. A
    // dangling id would render as a blank recipient rather than fail loudly.
    for (const activity of activities) {
      for (const id of activity.recipients) {
        expect(processorById(id), `activity "${activity.id}" names unknown processor "${id}"`).toBeDefined();
      }
    }
  });

  it("gives every activity a lawful basis that is not consent", () => {
    // The design moved the whole site off consent onto s.24(3) and s.24(5),
    // which is what removes the s.20 guardian requirement for the many
    // students who are under twenty. If an activity ever reverts to consent,
    // that analysis has to be redone, so fail here and force the conversation.
    for (const activity of activities) {
      expect(["24(3)", "24(5)"]).toContain(activity.basis.section);
    }
  });

  it("has no duplicate ids", () => {
    const ids = [
      ...activities.map((a) => a.id),
      ...processors.map((p) => p.id),
      ...dataRights.map((r) => r.id),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("looks activities up by id", () => {
    expect(activityById("equipment-loan")?.basis.section).toBe("24(3)");
    expect(activityById("does-not-exist")).toBeUndefined();
  });

  it("covers all eight rights the Act gives a data subject", () => {
    expect(dataRights.map((right) => right.id).sort()).toEqual(
      ["access", "complain", "correct", "delete", "object", "portability", "restrict", "withdraw"].sort()
    );
  });

  it("translates every reader-facing string into both locales", () => {
    // A half-translated notice is a compliance problem, not just a polish
    // problem: a Thai reader is entitled to the same s.23 information.
    const texts: Record<string, string>[] = [];
    for (const activity of activities) {
      texts.push(activity.name, activity.purpose, activity.ifYouDoNot, activity.basis.label);
      texts.push(...activity.collects);
      if (activity.retentionNote) texts.push(activity.retentionNote);
    }
    for (const processor of processors) texts.push(processor.role, processor.country, processor.receives);
    for (const record of cookieRecords) texts.push(record.purpose, record.expires);
    for (const entry of browserStorage) texts.push(entry.purpose);
    for (const right of dataRights) texts.push(right.name, right.description);

    for (const text of texts) {
      for (const locale of locales) {
        expect(text[locale]?.trim() ?? "").not.toBe("");
      }
      // Catches the common failure where a Thai string was left as the
      // English one during a rushed edit.
      expect(text.th).not.toBe(text.en);
    }
  });

  it("uses no em dashes, in either language", () => {
    // Site-wide writing rule. Easy to reintroduce by hand, so assert it.
    const raw = readFileSync(join(REPO_ROOT, "content", "privacy", "register.ts"), "utf8");
    expect(raw).not.toContain("—");
  });
});
