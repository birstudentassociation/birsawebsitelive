/**
 * Asserts every colour pair in `components/bds/tokens.ts` `contrastPairs`
 * meets its WCAG threshold, in both themes, against the values actually
 * declared in `components/bds/tokens.css`.
 *
 * REDESIGN-2.0 §4.2: "add a `npm run check:contrast` script that asserts
 * every documented pair in both themes, so the contrast comments in the CSS
 * become an assertion." This is that script.
 *
 * Zero dependencies, on purpose. `tokens.css` is parsed directly for the
 * light theme (the `@theme` block) and the dark theme
 * (`html[data-theme="dark"]`). `tokens.ts` is TypeScript, so rather than
 * importing it into a `.mjs` file, `contrastPairs` is parsed out of its
 * source text the same way, by finding each `{ ... }` object literal in the
 * array and reading its fields with small regexes. This keeps the script
 * dependency-free and keeps the two token files as the only source of
 * truth: nothing here is a second copy of the palette or the pair list.
 *
 * The maths (relative luminance, contrast ratio) lives here as named
 * exports so `tests/unit/contrast.test.ts` can import and run the exact
 * same functions inside vitest, rather than a second implementation
 * drifting from this one.
 *
 * Usage: `node scripts/check-contrast.mjs` (also `npm run check:contrast`).
 * Exits non-zero if any pair fails in either theme.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * @typedef {{ r: number, g: number, b: number }} Rgb
 * @typedef {{ foreground: string, background: string, min: number, why: string }} ContrastPair
 * @typedef {{ light: Record<string, string>, dark: Record<string, string> }} ThemeColors
 * @typedef {ContrastPair & { theme: string, ratio: number | null, pass: boolean, error: string | null }} CheckResult
 */

/**
 * Read the source of `tokens.css` and `tokens.ts` from disk. Exported so the
 * test can point at the same files without duplicating the read.
 *
 * @param {string} [repoRoot]
 * @returns {{ css: string, ts: string }}
 */
export function readTokenSources(repoRoot = REPO_ROOT) {
  const css = readFileSync(path.join(repoRoot, "components/bds/tokens.css"), "utf8");
  const ts = readFileSync(path.join(repoRoot, "components/bds/tokens.ts"), "utf8");
  return { css, ts };
}

/**
 * Slice the first `{ ... }` block out of `css` whose opening line contains
 * `selector`, using the first `\n}` after it as the close. This is the same
 * approach `tests/unit/bds-tokens.test.ts` already uses to find the
 * `@theme` and `html[data-theme="dark"]` blocks, so a future edit to either
 * file only has to keep the same shape, not learn a second parsing method.
 */
function sliceBlock(css, selector) {
  const openMarker = `${selector} {`;
  const start = css.indexOf(openMarker);
  if (start === -1) {
    throw new Error(`check-contrast: could not find "${openMarker}" in tokens.css`);
  }
  const end = css.indexOf("\n}", start);
  if (end === -1) {
    throw new Error(`check-contrast: unterminated block for "${openMarker}" in tokens.css`);
  }
  return css.slice(start, end);
}

/**
 * Parse every `--color-<name>: #rrggbb;` declaration in a block into a
 * `{ name: hex }` map.
 */
function parseColorBlock(block) {
  const colors = {};
  const re = /--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g;
  let match;
  while ((match = re.exec(block)) !== null) {
    colors[match[1]] = match[2];
  }
  return colors;
}

/**
 * The colour tokens for both themes, keyed by theme name, parsed straight
 * out of `tokens.css`. The light theme is the `@theme` block (REDESIGN-2.0
 * §4.2 calls this out explicitly: "the `@theme` block is the light theme").
 * The dark theme is the explicit `html[data-theme="dark"]` override scope,
 * not the `prefers-color-scheme` media-query duplicate of it, since the two
 * are asserted identical elsewhere (`bds-tokens.test.ts`).
 *
 * @param {string} css
 * @returns {ThemeColors}
 */
export function parseThemeColors(css) {
  return {
    light: parseColorBlock(sliceBlock(css, "@theme")),
    dark: parseColorBlock(sliceBlock(css, 'html[data-theme="dark"]')),
  };
}

/**
 * Parse the `contrastPairs` array out of `tokens.ts`'s source text. Finds
 * the array literal by its declaration, then reads each `{ ... }` entry
 * inside it with small per-field regexes, so the result is independent of
 * whether an entry happens to be written on one line or several.
 *
 * @param {string} ts
 * @returns {ContrastPair[]}
 */
export function parseContrastPairs(ts) {
  const declStart = ts.indexOf("export const contrastPairs");
  if (declStart === -1) {
    throw new Error('check-contrast: could not find "export const contrastPairs" in tokens.ts');
  }
  const arrayStart = ts.indexOf("= [", declStart);
  if (arrayStart === -1) {
    throw new Error("check-contrast: could not find the contrastPairs array literal");
  }

  // Bracket-count from the opening `[` to its matching `]`, ignoring the
  // `{`/`}` of the individual object entries: none of them are nested, so a
  // plain `[`/`]` count is enough to find the end of the array without
  // needing a real parser.
  let depth = 0;
  let i = arrayStart + 2; // position of the "["
  let arrayEnd = -1;
  for (; i < ts.length; i++) {
    if (ts[i] === "[") depth++;
    else if (ts[i] === "]") {
      depth--;
      if (depth === 0) {
        arrayEnd = i;
        break;
      }
    }
  }
  if (arrayEnd === -1) {
    throw new Error("check-contrast: contrastPairs array literal was never closed");
  }

  const arrayText = ts.slice(arrayStart + 2, arrayEnd);
  const entries = arrayText.match(/\{[^{}]*\}/g) ?? [];

  return entries.map((entry) => {
    const foreground = entry.match(/foreground:\s*"([^"]+)"/)?.[1];
    const background = entry.match(/background:\s*"([^"]+)"/)?.[1];
    const minRaw = entry.match(/min:\s*(3(?:\.\d+)?|4\.5)/)?.[1];
    const why = entry.match(/why:\s*"([^"]*)"/)?.[1] ?? "";

    if (!foreground || !background || !minRaw) {
      throw new Error(`check-contrast: could not parse a contrastPairs entry: ${entry}`);
    }

    return { foreground, background, min: Number(minRaw), why };
  });
}

/**
 * `#rrggbb` to `{ r, g, b }`, each channel 0..255.
 *
 * @param {string} hex
 * @returns {Rgb}
 */
export function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

/**
 * WCAG 2.x piecewise sRGB linearisation, applied to one 0..1 channel value.
 */
function linearizeChannel(c) {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * WCAG 2.x relative luminance of an `{ r, g, b }` colour (channels 0..255).
 *
 * @param {Rgb} rgb
 * @returns {number}
 */
export function relativeLuminance({ r, g, b }) {
  const R = linearizeChannel(r / 255);
  const G = linearizeChannel(g / 255);
  const B = linearizeChannel(b / 255);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * WCAG 2.x contrast ratio between two `{ r, g, b }` colours: the lighter
 * relative luminance over the darker, both offset by 0.05, so the result is
 * always the same regardless of argument order.
 *
 * @param {Rgb} rgbA
 * @param {Rgb} rgbB
 * @returns {number}
 */
export function contrastRatio(rgbA, rgbB) {
  const lA = relativeLuminance(rgbA);
  const lB = relativeLuminance(rgbB);
  const lighter = Math.max(lA, lB);
  const darker = Math.min(lA, lB);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Contrast ratio directly between two `#rrggbb` hex colours.
 *
 * @param {string} hexA
 * @param {string} hexB
 * @returns {number}
 */
export function contrastRatioHex(hexA, hexB) {
  return contrastRatio(hexToRgb(hexA), hexToRgb(hexB));
}

/**
 * Check every `contrastPairs` entry against the parsed theme colours, in
 * both themes. Returns one result row per (pair, theme) combination so a
 * caller can print a full table and a caller can filter to failures alone.
 *
 * @param {{ themeColors: ThemeColors, pairs: ContrastPair[] }} args
 * @returns {CheckResult[]}
 */
export function checkAllPairs({ themeColors, pairs }) {
  const themeNames = Object.keys(themeColors);
  /** @type {CheckResult[]} */
  const results = [];

  for (const pair of pairs) {
    for (const theme of themeNames) {
      const colors = themeColors[theme];
      const fgHex = colors[pair.foreground];
      const bgHex = colors[pair.background];

      if (!fgHex || !bgHex) {
        results.push({
          ...pair,
          theme,
          ratio: null,
          pass: false,
          error: `token "${!fgHex ? pair.foreground : pair.background}" is not declared in the ${theme} theme`,
        });
        continue;
      }

      const ratio = contrastRatioHex(fgHex, bgHex);
      results.push({
        ...pair,
        theme,
        ratio,
        pass: ratio >= pair.min,
        error: null,
      });
    }
  }

  return results;
}

function formatRatio(ratio) {
  return ratio === null ? "n/a" : `${ratio.toFixed(2)}:1`;
}

function printReport(results) {
  const nameWidth = Math.max(
    ...results.map((r) => `${r.foreground} on ${r.background}`.length),
    20
  );

  console.log(
    "PAIR".padEnd(nameWidth) + "  THEME  " + "RATIO".padEnd(9) + "NEEDED".padEnd(9) + "RESULT"
  );
  console.log("-".repeat(nameWidth + 40));

  for (const r of results) {
    const name = `${r.foreground} on ${r.background}`.padEnd(nameWidth);
    const theme = r.theme.padEnd(7);
    const ratio = formatRatio(r.ratio).padEnd(9);
    const needed = `${r.min}:1`.padEnd(9);
    const status = r.pass ? "PASS" : "FAIL";
    console.log(`${name}  ${theme}${ratio}${needed}${status}`);
    if (r.error) {
      console.log(`  -> ${r.error}`);
    } else if (!r.pass) {
      console.log(`  -> ${r.why}`);
    }
  }

  const failures = results.filter((r) => !r.pass);
  console.log("-".repeat(nameWidth + 40));
  if (failures.length === 0) {
    console.log(`All ${results.length} checks passed (${results.length / 2} pairs, both themes).`);
  } else {
    console.log(`${failures.length} of ${results.length} checks FAILED.`);
    for (const f of failures) {
      if (f.error) {
        console.log(`  ${f.foreground} on ${f.background} (${f.theme}): ${f.error}`);
      } else {
        console.log(
          `  ${f.foreground} on ${f.background} (${f.theme}): got ${formatRatio(f.ratio)}, needed ${f.min}:1`
        );
      }
    }
  }

  return failures.length === 0;
}

function main() {
  const { css, ts } = readTokenSources();
  const themeColors = parseThemeColors(css);
  const pairs = parseContrastPairs(ts);
  const results = checkAllPairs({ themeColors, pairs });
  const ok = printReport(results);
  process.exit(ok ? 0 : 1);
}

// Only run the CLI when this file is executed directly (`node
// scripts/check-contrast.mjs`), not when its functions are imported, for
// example by `tests/unit/contrast.test.ts`.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
