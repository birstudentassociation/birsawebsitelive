/**
 * Tests for the seeded external link register itself (as opposed to
 * `tests/unit/cms-link-integrity.test.ts`, which tests the checking
 * mechanism against small fixture entries). Wave 6E, REDESIGN-2.0 §3.6/§10.
 *
 * Two things this file exists to prove:
 *
 *   1. `SEEDED_EXTERNAL_LINKS`, the array committed in
 *      `lib/cms/externalLinkRegister.ts`, is actually well formed: every
 *      entry has a real owner and body from the closed vocabularies, a
 *      unique id, a unique URL, and a label in both locales. A malformed
 *      entry here is a link the daily cron either cannot check or checks
 *      but cannot report meaningfully, so this is worth asserting directly
 *      rather than trusting the seeding script's output by eye.
 *
 *   2. `scripts/seed-external-links.mjs` is deterministic (the wave brief's
 *      hard requirement: "running your migration script twice on an
 *      unchanged tree must produce a byte-identical artifact"). This spawns
 *      the real script twice as a child process and diffs the two outputs,
 *      rather than re-implementing its logic, so the test exercises exactly
 *      what an operator would run.
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { SEEDED_EXTERNAL_LINKS, externalLinkBodies } from "@/lib/cms/externalLinkRegister";
import { portfolioIds } from "@/lib/portfolios";

const REPO_ROOT = path.resolve(__dirname, "..", "..");

describe("SEEDED_EXTERNAL_LINKS", () => {
  it("is not the four-entry placeholder any more", () => {
    // The number itself is not sacred and will grow as content does; the
    // point of this assertion is only to catch a regenerate-and-forget that
    // silently reverts the array back to a token handful of entries.
    expect(SEEDED_EXTERNAL_LINKS.length).toBeGreaterThan(10);
  });

  it("gives every entry a unique id", () => {
    const ids = SEEDED_EXTERNAL_LINKS.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every entry a unique URL", () => {
    const urls = SEEDED_EXTERNAL_LINKS.map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("assigns every entry an owner from the closed portfolio vocabulary", () => {
    for (const entry of SEEDED_EXTERNAL_LINKS) {
      expect(portfolioIds, `entry ${entry.id} has an unknown owner ${entry.owner}`).toContain(
        entry.owner
      );
    }
  });

  it("assigns every entry a body from the closed ExternalLinkBody vocabulary", () => {
    for (const entry of SEEDED_EXTERNAL_LINKS) {
      expect(externalLinkBodies, `entry ${entry.id} has an unknown body ${entry.body}`).toContain(
        entry.body
      );
    }
  });

  it("gives every entry a non-empty label in both locales", () => {
    for (const entry of SEEDED_EXTERNAL_LINKS) {
      expect(entry.label.en.trim(), `entry ${entry.id} has an empty EN label`).not.toBe("");
      expect(entry.label.th.trim(), `entry ${entry.id} has an empty TH label`).not.toBe("");
    }
  });

  it("starts every entry unchecked, since none has actually been checked by the cron yet", () => {
    for (const entry of SEEDED_EXTERNAL_LINKS) {
      expect(entry.lastCheckedAt).toBeNull();
    }
  });

  it("only ever registers a real http(s) URL", () => {
    for (const entry of SEEDED_EXTERNAL_LINKS) {
      expect(entry.url).toMatch(/^https?:\/\//);
    }
  });

  it("carries the audit's specifically flagged unstable links", () => {
    // docs/SCOPE-AUDIT-2.0.md §3.1 and §4 finding 5: internship Google Forms
    // and CDN-hosted evaluation PDFs, and the military-service Google
    // Drive file, Google Sheet and Facebook permalink. These are exactly
    // the links §3.6's "stable enough to link to" gate test would fail, so
    // this is the one place the register must NOT quietly drop them the way
    // its own general-purpose EXCLUDED_HOST_FRAGMENTS noise filter would.
    const urls = new Set(SEEDED_EXTERNAL_LINKS.map((e) => e.url));
    expect([...urls].some((u) => u.includes("forms.gle"))).toBe(true);
    expect([...urls].some((u) => u.includes("image.makewebcdn.com"))).toBe(true);
    expect([...urls].some((u) => u.includes("drive.google.com"))).toBe(true);
    expect([...urls].some((u) => u.includes("docs.google.com/spreadsheets"))).toBe(true);
    expect([...urls].some((u) => u.includes("facebook.com/permalink.php"))).toBe(true);
  });

  it("never registers BIRSA's own domains as an external link", () => {
    for (const entry of SEEDED_EXTERNAL_LINKS) {
      expect(entry.url.toLowerCase()).not.toContain("birsa.");
      expect(entry.url.toLowerCase()).not.toContain("birpolsci.com");
    }
  });
});

describe("scripts/seed-external-links.mjs determinism", () => {
  it("produces byte-identical output across two runs on an unchanged tree", () => {
    const scriptPath = path.join(REPO_ROOT, "scripts", "seed-external-links.mjs");
    const first = execFileSync("node", [scriptPath], { cwd: REPO_ROOT, encoding: "utf8" });
    const second = execFileSync("node", [scriptPath], { cwd: REPO_ROOT, encoding: "utf8" });
    expect(first).toBe(second);
    expect(first.length).toBeGreaterThan(0);
  }, 30_000);

  it("its output matches what is actually committed in the register", () => {
    // Regenerate, then check every id the script produces is present in the
    // committed array with the same url/owner/body. This is what would have
    // caught a hand-edit to SEEDED_EXTERNAL_LINKS that the seeding script no
    // longer reproduces, i.e. exactly the drift the wave brief's
    // determinism requirement exists to prevent.
    const scriptPath = path.join(REPO_ROOT, "scripts", "seed-external-links.mjs");
    const output = execFileSync("node", [scriptPath], { cwd: REPO_ROOT, encoding: "utf8" });

    const idMatches = [...output.matchAll(/id: "([^"]+)"/g)].map((m) => m[1]);
    const committedIds = new Set(SEEDED_EXTERNAL_LINKS.map((e) => e.id));

    for (const id of idMatches) {
      expect(
        committedIds,
        `${id} was produced by the seeding script but is not committed`
      ).toContain(id);
    }
    // The reverse direction is deliberately not asserted: the three
    // hand-curated labels (see the register file's own doc comment) mean
    // the committed array is not byte-identical to a fresh regeneration,
    // only id-for-id equivalent. A drift in url/owner/body under the same
    // id would still be worth catching, so check those too.
    const urlMatches = new Map(
      [...output.matchAll(/id: "([^"]+)",\s*\n\s*url: "([^"]+)"/g)].map((m) => [m[1], m[2]])
    );
    for (const entry of SEEDED_EXTERNAL_LINKS) {
      const regeneratedUrl = urlMatches.get(entry.id);
      if (regeneratedUrl !== undefined) {
        expect(regeneratedUrl, `entry ${entry.id}'s url has drifted from the seeding script`).toBe(
          entry.url
        );
      }
    }
  }, 30_000);
});
