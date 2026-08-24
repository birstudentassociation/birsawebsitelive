/**
 * Property tests for the guided-journey tree migration (REDESIGN-2.0 §11.4
 * Wave 6C). "Write a property test that walks both the source tree and the
 * migrated tree and asserts they are isomorphic. Structural equality of the
 * graph is the only honest proof that a tree migration did not lose an
 * edge" — the wave brief's own words, and this file is exactly that: it
 * builds the real artifact from `lib/migration/trees.ts` against the real
 * `content/smart-answers/**` and `content/onboarding/**` modules (not a
 * fixture standing in for them), reconstructs a service and a track list
 * from that artifact with the exact inverse transforms, and asserts the
 * result is deep-equal to the source, not merely "also valid".
 *
 * `scripts/verify-trees.mjs` repeats the strongest of these checks against
 * whatever artifact is actually on disk (useful after a re-import, or when
 * checking a file someone else generated); this file is the one that runs
 * in CI on every change to either the source content or the transform.
 *
 * The "CLI argument handling" describe block below is a regression test for
 * a real bug this migration shipped and then caught by inspection, not by any
 * check: passing an ABSOLUTE `--report` path used to be joined a second time
 * onto `process.cwd()` inside `lib/migration/report.ts`'s `writeMigrationReport`
 * (which itself, correctly, resolves its own repo-relative `outBasePath`
 * argument against `process.cwd()`), producing a nested
 * `<repoRoot>/<repoRoot>/docs/migration/trees.md` and silently writing the
 * real report nowhere anyone would look. `scripts/migrate-trees.mjs` now
 * rejects an absolute `--report` outright instead of mis-joining it; this
 * spawns the actual script (not a reimplementation of its argument parsing)
 * so the regression is caught at the same layer the bug shipped in.
 */
import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { service, TRIAGE_SLUG } from "@/content/smart-answers/index";
import { audienceQuestions } from "@/content/smart-answers/audience";
import { onboardingTracks } from "@/content/onboarding/index";
import { validateService } from "@/lib/smart-answers";
import {
  buildOnboardingDocuments,
  buildSmartAnswerDocuments,
  deepEqualIgnoringKeyOrder,
  docsToAudienceQuestions,
  docsToOnboardingTracks,
  docsToSmartAnswerService,
  nodeDocId,
  onboardingTrackDocId,
  topicDocId,
} from "@/lib/migration/trees";

/** The source service, with its arrays sorted the same way
 * `buildSmartAnswerDocuments` sorts the artifact (by node id / topic slug),
 * since the migration guarantees identity, not authored array position —
 * see `lib/migration/trees.ts`'s `docsToSmartAnswerService` doc comment. */
function sortedSource() {
  return {
    topics: [...service.topics].sort((a, b) => a.slug.localeCompare(b.slug)),
    nodes: [...service.nodes].sort((a, b) => a.id.localeCompare(b.id)),
  };
}

describe("Smart Answers migration is isomorphic to the source", () => {
  const documents = buildSmartAnswerDocuments(service, audienceQuestions, TRIAGE_SLUG);
  const reconstructed = docsToSmartAnswerService(documents);

  it("round-trips to a graph deep-equal to the source (order-normalised)", () => {
    expect(deepEqualIgnoringKeyOrder(reconstructed, sortedSource())).toBe(true);
  });

  it("preserves the exact node id set: no addition, no loss", () => {
    const sourceIds = new Set(service.nodes.map((n) => n.id));
    const artifactIds = new Set(reconstructed.nodes.map((n) => n.id));
    expect(artifactIds).toEqual(sourceIds);
  });

  it("preserves the exact topic slug set", () => {
    const sourceSlugs = new Set(service.topics.map((t) => t.slug));
    const artifactSlugs = new Set(reconstructed.topics.map((t) => t.slug));
    expect(artifactSlugs).toEqual(sourceSlugs);
  });

  it("passes the runtime's own structural validator once reconstructed", () => {
    // This is the tree-integrity gate in full: reachability from every
    // topic, no dangling `next`, no cycle, every question keeping an
    // unconditional option, every fact within the declared vocabulary,
    // every outcome offering somewhere to go next, both locales present
    // everywhere. `validateService` (`lib/smart-answers.ts`) already checks
    // all of this; running it against the RECONSTRUCTED graph is what
    // proves the migration preserves it, not just that the source has it.
    expect(validateService(reconstructed)).toEqual([]);
  });

  it("gives every document a deterministic, namespaced id derived from its source id", () => {
    for (const node of service.nodes) {
      const doc = documents.find((d) => d._type === "smartAnswerNode" && d.sourceId === node.id);
      expect(doc).toBeDefined();
      expect(doc!._id).toBe(nodeDocId(node.id));
    }
    for (const topic of service.topics) {
      const doc = documents.find((d) => d._type === "smartAnswerTopic" && d.slug === topic.slug);
      expect(doc).toBeDefined();
      expect(doc!._id).toBe(topicDocId(topic.slug));
    }
  });

  it("has no _id collisions across the whole artifact", () => {
    const ids = documents.map((d) => d._id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("marks exactly the topic named by TRIAGE_SLUG as the triage entry point", () => {
    const triageDocs = documents.filter(
      (d) => d._type === "smartAnswerTopic" && d.isTriageEntry === true
    );
    expect(triageDocs).toHaveLength(1);
    expect(triageDocs[0]!.slug).toBe(TRIAGE_SLUG);
  });

  it("produces byte-identical NDJSON across two runs on an unchanged tree", () => {
    const first = buildSmartAnswerDocuments(service, audienceQuestions, TRIAGE_SLUG);
    const second = buildSmartAnswerDocuments(service, audienceQuestions, TRIAGE_SLUG);
    const firstText = first.map((doc) => JSON.stringify(doc)).join("\n");
    const secondText = second.map((doc) => JSON.stringify(doc)).join("\n");
    expect(secondText).toBe(firstText);
  });

  it("preserves every option's next edge as a resolvable reference", () => {
    const nodeIds = new Set(
      documents.filter((d) => d._type === "smartAnswerNode").map((d) => d._id)
    );
    for (const doc of documents) {
      if (doc._type !== "smartAnswerNode" || doc.kind !== "question") continue;
      for (const option of doc.options as { next: { _ref: string } }[]) {
        expect(nodeIds.has(option.next._ref)).toBe(true);
      }
    }
  });
});

describe("Smart Answers audience fact vocabulary migration round-trips", () => {
  const documents = buildSmartAnswerDocuments(service, audienceQuestions, TRIAGE_SLUG);
  const reconstructed = docsToAudienceQuestions(documents);

  it("is deep-equal to the source, in source (dimension) order", () => {
    expect(deepEqualIgnoringKeyOrder(reconstructed, audienceQuestions)).toBe(true);
  });
});

describe("onboarding track migration is isomorphic to the source", () => {
  const documents = buildOnboardingDocuments(onboardingTracks);
  const reconstructed = docsToOnboardingTracks(documents);

  it("round-trips to a graph deep-equal to the source (order-normalised by audience)", () => {
    const sortedSourceTracks = [...onboardingTracks].sort((a, b) =>
      a.audience.localeCompare(b.audience)
    );
    expect(deepEqualIgnoringKeyOrder(reconstructed, sortedSourceTracks)).toBe(true);
  });

  it("preserves the exact audience set", () => {
    const sourceAudiences = new Set(onboardingTracks.map((t) => t.audience));
    const artifactAudiences = new Set(reconstructed.map((t) => t.audience));
    expect(artifactAudiences).toEqual(sourceAudiences);
  });

  it("keeps every task id unique within its track", () => {
    for (const track of reconstructed) {
      const ids = track.steps.flatMap((step) => step.tasks.map((task) => task.id));
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("gives every track a deterministic id derived from its audience", () => {
    for (const track of onboardingTracks) {
      const doc = documents.find(
        (d) => d._type === "onboardingTrack" && d.audience === track.audience
      );
      expect(doc).toBeDefined();
      expect(doc!._id).toBe(onboardingTrackDocId(track.audience));
    }
  });

  it("produces byte-identical NDJSON across two runs on an unchanged tree", () => {
    const first = buildOnboardingDocuments(onboardingTracks);
    const second = buildOnboardingDocuments(onboardingTracks);
    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
  });
});

describe("deepEqualIgnoringKeyOrder", () => {
  it("treats key order as insignificant on objects", () => {
    expect(deepEqualIgnoringKeyOrder({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
  });

  it("treats element order as significant on arrays", () => {
    expect(deepEqualIgnoringKeyOrder([1, 2], [2, 1])).toBe(false);
  });

  it("catches a real difference nested inside an otherwise-identical tree", () => {
    const a = { topics: [{ slug: "x", nested: { keep: true } }] };
    const b = { topics: [{ slug: "x", nested: { keep: false } }] };
    expect(deepEqualIgnoringKeyOrder(a, b)).toBe(false);
  });
});

describe("scripts/migrate-trees.mjs CLI argument handling", () => {
  const repoRoot = path.resolve(__dirname, "..", "..");
  // The exact first path segment under the repo root's absolute path (e.g.
  // "home" for "/home/user/birsawebsitelive"), which is what the historical
  // bug wrote a stray copy of the whole repo path into
  // (`<repoRoot>/<firstSegment>/...`). Derived from `repoRoot` itself, not
  // hardcoded, so this test still means something if the checkout ever moves.
  const firstSegment = repoRoot.split(path.sep).filter(Boolean)[0]!;
  const strayDir = path.join(repoRoot, firstSegment);

  it("rejects an absolute --report path rather than silently double-joining it", () => {
    // Guard the guard: if a stray directory already exists for some other
    // reason, this test cannot tell "the bug reappeared" from "leftover
    // clutter", so refuse to run rather than give a false pass.
    expect(existsSync(strayDir)).toBe(false);

    const absoluteReportPath = path.join(repoRoot, "docs", "migration", "trees.md");
    let threw = false;
    try {
      execFileSync("npx", ["tsx", "scripts/migrate-trees.mjs", "--report", absoluteReportPath], {
        cwd: repoRoot,
        stdio: "pipe",
      });
    } catch (error) {
      threw = true;
      const stderr = String((error as { stderr?: Buffer | string }).stderr ?? "");
      expect(stderr).toContain("must be a repo-relative path");
    }
    expect(threw).toBe(true);

    // The actual regression: no nested "<repoRoot>/<firstSegment>/..." tree
    // was created as a side effect of the rejected call.
    expect(existsSync(strayDir)).toBe(false);
  });

  it("writes only where --out/--report point, using a scratch out path and the real docs/migration report path", () => {
    const scratchDir = mkdtempSync(path.join(tmpdir(), "migrate-trees-cli-test-"));
    const outPath = path.join(scratchDir, "trees.ndjson");
    const reportRelative = path.join("docs", "migration", "trees-cli-test.md");
    const reportAbsolute = path.join(repoRoot, reportRelative);

    try {
      execFileSync(
        "npx",
        ["tsx", "scripts/migrate-trees.mjs", "--out", outPath, "--report", reportRelative],
        {
          cwd: repoRoot,
          stdio: "pipe",
        }
      );
      expect(existsSync(outPath)).toBe(true);
      expect(existsSync(reportAbsolute)).toBe(true);
      expect(existsSync(strayDir)).toBe(false);
    } finally {
      rmSync(scratchDir, { recursive: true, force: true });
      rmSync(reportAbsolute, { force: true });
      rmSync(reportAbsolute.replace(/\.md$/, ".json"), { force: true });
    }
  });
});
