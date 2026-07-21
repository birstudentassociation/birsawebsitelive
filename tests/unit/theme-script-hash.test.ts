import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { THEME_SCRIPT, THEME_SCRIPT_HASH } from "@/lib/theme-script";

/**
 * The strict-CSP routes (officer console) authorise the inline theme script by
 * SHA-256 hash, not by nonce. If THEME_SCRIPT is edited without updating
 * THEME_SCRIPT_HASH, the browser silently blocks the script and the dark-mode
 * bootstrap breaks under CSP. This test recomputes the hash from the exact
 * source bytes so that drift fails CI. On failure it prints the value to paste
 * into `lib/theme-script.ts`.
 */
describe("THEME_SCRIPT_HASH", () => {
  it("matches the SHA-256 of THEME_SCRIPT's exact bytes", () => {
    const digest = createHash("sha256").update(THEME_SCRIPT, "utf8").digest("base64");
    const expected = `sha256-${digest}`;
    if (expected !== THEME_SCRIPT_HASH) {
      // eslint-disable-next-line no-console
      console.error(`Theme script changed. Update THEME_SCRIPT_HASH to: ${expected}`);
    }
    expect(THEME_SCRIPT_HASH).toBe(expected);
  });
});
