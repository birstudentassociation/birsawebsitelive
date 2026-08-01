/**
 * The service may ship uncertain curriculum data; it may never ship it
 * silently. An earlier design gated selection on faculty sign-off; that gate
 * was removed on purpose, and this file is what replaced it. Every version
 * that borrows data or carries a student-facing contradiction must say so, in
 * both languages, on every screen a student actually sees it on.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CURRICULUM_VERSIONS, inferredParts, disclosures } from "@/content/curriculum";

const ROOT = process.cwd();

function read(relative: string): string {
  return fs.readFileSync(path.join(ROOT, relative), "utf8");
}

describe("uncertain curriculum data is disclosed, never silent", () => {
  it("gives every inferred part a reason in both locales", () => {
    for (const version of Object.values(CURRICULUM_VERSIONS)) {
      for (const derivation of inferredParts(version)) {
        if (derivation.kind !== "inferred") throw new Error("unreachable");
        expect(derivation.reason.en.trim().length, version.id).toBeGreaterThan(20);
        expect(derivation.reason.th.trim().length, version.id).toBeGreaterThan(20);
      }
    }
  });

  it("gives every student-facing contradiction copy in both locales", () => {
    for (const version of Object.values(CURRICULUM_VERSIONS)) {
      for (const c of disclosures(version)) {
        expect(c.disclosure?.en.trim().length, `${version.id}/${c.id}`).toBeGreaterThan(20);
        expect(c.disclosure?.th.trim().length, `${version.id}/${c.id}`).toBeGreaterThan(20);
      }
    }
  });

  // This is a source-text check, not a rendered-DOM check: it greps the page
  // file for the literal string "InferenceNotice" rather than mounting the
  // component. That is a crude way to catch a deleted notice, but it is the
  // cheapest one available here (no test harness in this repo renders a
  // Server Component page with cookies and searchParams), and crude still
  // beats nothing: a future edit that removes the import or the JSX usage
  // trips this the moment it lands, before it ever reaches a student.
  it("renders the inference notice on the confirm, plan and print screens", () => {
    for (const page of [
      "app/[lang]/services/study-plan/curriculum/page.tsx",
      "app/[lang]/services/study-plan/plan/page.tsx",
      "app/[lang]/services/study-plan/plan/print/page.tsx",
    ]) {
      expect(read(page), `${page} must render InferenceNotice`).toContain("InferenceNotice");
    }
  });

  it("records every version's sources so a maintainer can get back to the page", () => {
    for (const version of Object.values(CURRICULUM_VERSIONS)) {
      expect(version.verification.sources.length, version.id).toBeGreaterThan(0);
    }
  });

  it("never claims a version is verified by nobody", () => {
    for (const version of Object.values(CURRICULUM_VERSIONS)) {
      const { verifiedBy, verifiedOn } = version.verification;
      expect(Boolean(verifiedBy) === Boolean(verifiedOn), version.id).toBe(true);
    }
  });
});
