/**
 * Runs the WCAG contrast maths from `scripts/check-contrast.mjs` inside
 * vitest, so a failing pair shows up in `npm run test` and not only when
 * someone remembers to run the standalone script (REDESIGN-2.0 §4.2).
 *
 * The maths and the parsing both live in `check-contrast.mjs` and are
 * imported here rather than reimplemented, on purpose: duplicating the
 * contrast maths in two places is the exact failure mode this whole test
 * harness exists to prevent (Wave 1 Agent D brief).
 */
import { describe, expect, it } from "vitest";

import {
  checkAllPairs,
  contrastRatio,
  contrastRatioHex,
  hexToRgb,
  parseContrastPairs,
  parseThemeColors,
  readTokenSources,
  relativeLuminance,
} from "@/scripts/check-contrast.mjs";

describe("the WCAG contrast maths", () => {
  it("gives white on black the maximum ratio, 21:1", () => {
    expect(contrastRatioHex("#ffffff", "#000000")).toBeCloseTo(21, 1);
  });

  it("gives identical colours the minimum ratio, 1:1", () => {
    expect(contrastRatioHex("#d81f26", "#d81f26")).toBeCloseTo(1, 5);
  });

  it("is symmetric in its two arguments", () => {
    const a = contrastRatioHex("#211c19", "#fbf7ef");
    const b = contrastRatioHex("#fbf7ef", "#211c19");
    expect(a).toBeCloseTo(b, 10);
  });

  it("computes relative luminance 1 for white and 0 for black", () => {
    expect(relativeLuminance(hexToRgb("#ffffff"))).toBeCloseTo(1, 6);
    expect(relativeLuminance(hexToRgb("#000000"))).toBeCloseTo(0, 6);
  });

  it("applies the piecewise linearisation rather than a flat gamma curve", () => {
    // A channel at the 0.03928 boundary takes the linear branch (c / 12.92);
    // a mid-grey channel takes the exponential branch. If either branch were
    // wrong the two assertions below would not both hold: the linear branch
    // is much darker than a naive x^2.4 curve would give it credit for.
    const nearBlack = relativeLuminance({ r: 1, g: 1, b: 1 });
    expect(nearBlack).toBeGreaterThan(0);
    expect(nearBlack).toBeLessThan(0.001);

    const midGrey = relativeLuminance({ r: 128, g: 128, b: 128 });
    expect(midGrey).toBeGreaterThan(0.2);
    expect(midGrey).toBeLessThan(0.3);
  });

  it("matches a known WCAG worked example", () => {
    // #767676 on #ffffff is the textbook "just passes 4.5:1" grey, widely
    // cited (including in W3C's own understanding docs) as ~4.54:1.
    expect(contrastRatioHex("#767676", "#ffffff")).toBeCloseTo(4.54, 1);
  });

  it("computes the same ratio through the rgb and the hex entry points", () => {
    const viaHex = contrastRatioHex("#d81f26", "#fbf7ef");
    const viaRgb = contrastRatio(hexToRgb("#d81f26"), hexToRgb("#fbf7ef"));
    expect(viaHex).toBe(viaRgb);
  });
});

describe("parsing the real token files", () => {
  const { css, ts } = readTokenSources();
  const themeColors = parseThemeColors(css);
  const pairs = parseContrastPairs(ts);

  it("finds both themes", () => {
    expect(Object.keys(themeColors).sort()).toEqual(["dark", "light"]);
  });

  it("finds at least the light-theme colours the CSS declares", () => {
    expect(themeColors.light.cream).toMatch(/^#[0-9a-f]{6}$/);
    expect(themeColors.light.ink).toMatch(/^#[0-9a-f]{6}$/);
    expect(themeColors.dark.cream).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("parses every contrastPairs entry, single-line and multi-line alike", () => {
    // tokens.ts mixes single-line entries (e.g. "ink on cream") and
    // multi-line entries (e.g. the input-border pairs); both must parse.
    expect(pairs.length).toBeGreaterThan(0);
    for (const pair of pairs) {
      expect(typeof pair.foreground).toBe("string");
      expect(typeof pair.background).toBe("string");
      expect([3, 4.5]).toContain(pair.min);
    }
    const names = pairs.map((p) => `${p.foreground} on ${p.background}`);
    expect(names).toContain("ink on cream");
    expect(names).toContain("input-border on cream");
  });
});

describe("every documented contrast pair, in both themes", () => {
  // REDESIGN-2.0 §4.2: "the contrast comments in the CSS become an
  // assertion." This is that assertion, run the same way `npm run
  // check:contrast` runs it.
  const { css, ts } = readTokenSources();
  const themeColors = parseThemeColors(css);
  const pairs = parseContrastPairs(ts);
  const results = checkAllPairs({ themeColors, pairs });

  it("resolves every pair's tokens to an actual colour in both themes", () => {
    for (const result of results) {
      expect(result.error, `${result.foreground} on ${result.background} (${result.theme})`).toBe(
        null
      );
    }
  });

  it.each(results.map((r) => [`${r.foreground} on ${r.background} (${r.theme})`, r]))(
    "%s meets its WCAG minimum",
    (_label, result) => {
      expect(
        result.ratio,
        `${result.foreground} on ${result.background} in the ${result.theme} theme needed ` +
          `${result.min}:1 (${result.why}) and got ${result.ratio?.toFixed(2)}:1`
      ).toBeGreaterThanOrEqual(result.min);
    }
  );
});
