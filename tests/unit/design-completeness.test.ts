/**
 * "A component has not shipped until it is on `/design`" (REDESIGN-2.0
 * §11.6 point 5, restated in `components/bds/manifest.ts`'s own header
 * comment). `/design` renders one entry per row of
 * `components/bds/manifest.ts`, so this test is the other half of that
 * promise: it asserts the manifest and the files on disk agree with each
 * other, in both directions.
 *
 * Most components in the manifest do not exist yet; that is expected at
 * this point in the build and is not a failure. What IS a failure is a
 * component file that exists in `components/bds/` with no manifest entry
 * naming it, because such a file can never appear on `/design` no matter
 * how DesignReference.tsx is written: nothing tells the reference page it
 * exists. The two assertions below therefore tighten automatically as
 * Wave 2 lands components, without this file ever encoding a fixed count:
 *
 *   1. Every manifest entry names a file path
 *      (`components/bds/<Name>.tsx`) that the completeness sweep in (2)
 *      would actually notice, so a future component landing under that
 *      exact name gets picked up rather than silently missed.
 *   2. Every file in `components/bds/` that looks like a component (a
 *      PascalCase `.tsx` file, not one of the contract files that are not
 *      components) has a manifest entry naming it.
 */
import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { manifest, manifestByName } from "@/components/bds/manifest";

const BDS_DIR = path.join(process.cwd(), "components/bds");

/**
 * Files in `components/bds/` that are contracts, shared plumbing, or the
 * reference page itself, none of which are individual components with a
 * manifest entry. Named literally, per the Wave 1 Agent D brief, rather
 * than inferred, so a future contract file added here does not silently
 * start failing this test.
 */
const NOT_A_COMPONENT = new Set([
  "tokens.ts",
  "tokens.css",
  "manifest.ts",
  "sectionPalette.ts",
  "imageContract.ts",
  "Icon.tsx",
  "icons.ts",
  "Type.tsx",
  "Layout.tsx",
  "DesignReference.tsx",
]);

/** A component file: a PascalCase name directly in `components/bds/`, as `.tsx`. */
const COMPONENT_FILE_PATTERN = /^[A-Z][A-Za-z0-9]*\.tsx$/;

function componentFilesOnDisk(): string[] {
  return readdirSync(BDS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => COMPONENT_FILE_PATTERN.test(name))
    .filter((name) => !NOT_A_COMPONENT.has(name));
}

describe("design system completeness: manifest against components/bds/", () => {
  it("gives every manifest entry a name the completeness sweep would notice", () => {
    // Direction 1: a manifest entry whose name is not a valid PascalCase
    // component identifier could never be matched to the file Wave 2 lands
    // for it, so the correspondence in direction 2 would silently stop
    // tightening. This keeps that from happening quietly.
    for (const entry of manifest) {
      expect(`${entry.name}.tsx`, entry.name).toMatch(COMPONENT_FILE_PATTERN);
      expect(NOT_A_COMPONENT.has(`${entry.name}.tsx`), entry.name).toBe(false);
    }
  });

  it("has no file in components/bds/ that looks like a component but is absent from the manifest", () => {
    // Direction 2, the one that actually enforces "shipped without an
    // entry has not shipped". Runs today against zero or few files and
    // keeps running, unchanged, as Wave 2 adds them.
    const onDisk = componentFilesOnDisk();
    const undocumented = onDisk.filter((file) => {
      const name = file.replace(/\.tsx$/, "");
      return manifestByName[name] === undefined;
    });

    expect(
      undocumented,
      "these files exist in components/bds/ but have no components/bds/manifest.ts entry"
    ).toEqual([]);
  });

  it("names every file that IS in the manifest with the exact casing the manifest expects", () => {
    // A file that exists under a near-miss name (wrong casing, a typo) is
    // just as undocumented in effect as a missing manifest entry: /design
    // renders manifest.name, so a mismatch never resolves to the file.
    const onDisk = new Set(componentFilesOnDisk());
    for (const entry of manifest) {
      const expectedFile = `${entry.name}.tsx`;
      const nearMiss = [...onDisk].find(
        (file) => file.toLowerCase() === expectedFile.toLowerCase() && file !== expectedFile
      );
      expect(
        nearMiss,
        `${entry.name} has a same-name, different-case file on disk`
      ).toBeUndefined();
    }
  });
});
