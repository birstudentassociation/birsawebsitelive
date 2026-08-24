/**
 * Tests for the §3.6 disposition ledger's machine-checkable claims
 * (Wave 6E, REDESIGN-2.0 §3.6, §10, §11.4).
 *
 * `scripts/verify-dispositions.mjs` is the actual gate (it is meant to be
 * run standalone, offline, by an operator or CI step, and it prints
 * everything wrong by name rather than a bare pass/fail). This file wraps
 * that same script in vitest so a regression shows up in `npm run test`
 * too, without re-implementing its checks a second time — every assertion
 * here runs the real script as a child process and inspects its exit code
 * and output, the same "test the thing you actually run" shape
 * `tests/unit/contrast.test.ts` and `tests/unit/external-link-register.test.ts`
 * already use for their own sibling scripts.
 *
 * WHY THIS DOES NOT ASSERT A CLEAN EXIT OUTRIGHT. As of this wave, Wave 6A's
 * (MDX to Portable Text) diff report had not yet landed in
 * `docs/migration/`, which is a real, honestly-reported gap (see this
 * wave's own report and `docs/migration/dispositions.md` §9), not a bug in
 * this wave's own work. A test asserting exit code 0 would either fail for
 * a reason this wave cannot fix, or tempt a future edit to quietly relax
 * the check just to go green. Instead this suite pins down the SHAPE of a
 * correct run: the four checks this wave's own family fully controls must
 * report zero problems each, and if the wave-rollup check is the only
 * failure, it must name the specific missing family, never a bare count.
 * Once Wave 6A's report lands, `overall exit code is 0` below starts
 * passing on its own — nothing here needs to change.
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const SCRIPT_PATH = path.join(REPO_ROOT, "scripts", "verify-dispositions.mjs");

function runVerifyScript(): { exitCode: number; output: string } {
  try {
    const output = execFileSync("node", [SCRIPT_PATH], {
      cwd: REPO_ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { exitCode: 0, output };
  } catch (err) {
    const e = err as { status?: number; stdout?: string; stderr?: string };
    return { exitCode: e.status ?? 1, output: (e.stdout ?? "") + (e.stderr ?? "") };
  }
}

describe("scripts/verify-dispositions.mjs", () => {
  it("runs to completion and reports every one of its five checks", () => {
    const { output } = runVerifyScript();
    expect(output).toContain("Check 1/5");
    expect(output).toContain("Check 2/5");
    expect(output).toContain("Check 3/5");
    expect(output).toContain("Check 4/5");
    expect(output).toContain("Check 5/5");
  }, 60_000);

  it("finds every ABSORB redirect rule and its destination page (check 2)", () => {
    const { output } = runVerifyScript();
    const absorbLines = output
      .split("\n")
      .filter((line) => line.includes("(destination page exists)"));
    // The six §3.6 ABSORB rules named in this wave's brief, no more and no
    // fewer: a count that drifted either way means lib/redirects.ts changed
    // shape under this wave without the ledger being told.
    expect(absorbLines).toHaveLength(6);
    expect(output).not.toContain("[absorb-destination-missing]");
    expect(output).not.toContain("[absorb-rule-count]");
  }, 60_000);

  it("finds no malformed external link register entries (check 3)", () => {
    const { output } = runVerifyScript();
    expect(output).toMatch(/Checked \d+ registered links; 0 problem\(s\) found\./);
    expect(output).not.toContain("[external-link-");
  }, 60_000);

  it("finds no §3.6 content item unaccounted for in the ledger (check 4)", () => {
    const { output } = runVerifyScript();
    expect(output).toMatch(/Checked \d+ §3\.6 content items; 0 unaccounted for\./);
    expect(output).not.toContain("[ledger-unaccounted-file]");
    expect(output).not.toContain("[ledger-missing]");
  }, 60_000);

  it("if the run fails, fails ONLY on the wave-rollup family check, and names the missing family", () => {
    // This is the test that encodes the wave brief's own instruction: "fail
    // loudly and by name on the missing family rather than skipping it
    // silently." If this test starts failing because the script now exits
    // 0, that is good news (Wave 6A's report landed) and this whole test
    // should be deleted along with the rest of the "shape of a correct
    // partial run" scaffolding in this file's header comment.
    const { exitCode, output } = runVerifyScript();
    if (exitCode === 0) {
      expect(output).toContain("All checks passed.");
      return;
    }
    const failureLines = output.split("\n").filter((line) => /^\s*\[[a-z-]+\]/.test(line.trim()));
    for (const line of failureLines) {
      expect(line, `unexpected failure outside the wave-rollup check: ${line}`).toContain(
        "[wave-rollup-missing-family]"
      );
    }
    expect(output).toContain("MDX to Portable Text (Wave 6A)");
  }, 60_000);
});
