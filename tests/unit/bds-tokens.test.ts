/**
 * The BDS token contract (REDESIGN-2.0 §4.2, §11.1).
 *
 * `components/bds/tokens.css` is the source of truth and `tokens.ts` is its
 * mirror. A mirror nobody checks is a mirror that drifts, so this parses the
 * stylesheet and asserts the two agree, in both directions.
 *
 * It also asserts the property that fixes defect D7: every step of the type
 * scale must have a Thai override for leading, and every display and heading
 * step must have one for tracking. That is the assertion which makes "Thai is
 * correct by construction" a test rather than a claim.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  colorTokens,
  contrastPairs,
  spaceTokens,
  typeClass,
  typeSteps,
} from "@/components/bds/tokens";

const css = readFileSync(join(process.cwd(), "components/bds/tokens.css"), "utf8");

/** The `@theme` block, which is where the light-theme colour tokens live. */
const themeBlock = css.slice(css.indexOf("@theme {"), css.indexOf("\n}", css.indexOf("@theme {")));

/** The explicit dark-theme scope. */
const darkBlock = css.slice(
  css.indexOf('html[data-theme="dark"] {'),
  css.indexOf("\n}", css.indexOf('html[data-theme="dark"] {'))
);

/** The Thai type-scale scope. */
const thaiBlock = css.slice(
  css.indexOf('html[lang="th"] {'),
  css.indexOf("\n}", css.indexOf('html[lang="th"] {'))
);

function declaredNames(block: string, prefix: string): string[] {
  const names: string[] = [];
  const re = new RegExp(`^\\s*--${prefix}-([a-z0-9-]+):`, "gm");
  let match: RegExpExecArray | null;
  while ((match = re.exec(block)) !== null) names.push(match[1]!);
  return names;
}

describe("colour tokens", () => {
  const declared = declaredNames(themeBlock, "color");

  it("mirrors every colour token declared in the stylesheet", () => {
    expect([...colorTokens].sort()).toEqual([...declared].sort());
  });

  it("overrides every colour token in the dark theme", () => {
    // A token defined only in the light theme keeps its light value in dark
    // mode, which is exactly how a contrast pair silently fails.
    expect([...declaredNames(darkBlock, "color")].sort()).toEqual([...declared].sort());
  });

  it("only names contrast pairs that exist", () => {
    for (const pair of contrastPairs) {
      expect(declared).toContain(pair.foreground);
      expect(declared).toContain(pair.background);
    }
  });
});

describe("the bilingual type scale", () => {
  it("declares a size for every step", () => {
    expect([...declaredNames(css, "type")].sort()).toEqual([...typeSteps].sort());
  });

  it("declares Latin leading and tracking for every step", () => {
    const root = css.slice(css.indexOf(":root {"), css.indexOf('html[lang="th"] {'));
    expect([...new Set(declaredNames(root, "leading"))].sort()).toEqual([...typeSteps].sort());
    expect([...new Set(declaredNames(root, "tracking"))].sort()).toEqual([...typeSteps].sort());
  });

  it("overrides leading for every step under html[lang='th']", () => {
    // Defect D7 in one assertion: a step added without a Thai leading is a
    // step that will ship correct in English and touching in Thai.
    expect([...declaredNames(thaiBlock, "leading")].sort()).toEqual([...typeSteps].sort());
  });

  it("gives every display and heading step the JenjrusVris tracking in Thai", () => {
    const thaiTracking = Object.fromEntries(
      [...thaiBlock.matchAll(/^\s*--tracking-([a-z0-9-]+):\s*([^;]+);/gm)].map((m) => [
        m[1]!,
        m[2]!.trim(),
      ])
    );
    for (const step of typeSteps) {
      const expected = step.startsWith("body") ? "0em" : "0.06em";
      expect(thaiTracking[step], `--tracking-${step} under html[lang="th"]`).toBe(expected);
    }
  });

  it("sets font-size, line-height and letter-spacing on each step's class", () => {
    for (const step of typeSteps) {
      const rule = css.slice(
        css.indexOf(`.${typeClass(step)} {`),
        css.indexOf("\n}", css.indexOf(`.${typeClass(step)} {`))
      );
      expect(rule, `.${typeClass(step)}`).toContain(`font-size: var(--type-${step})`);
      expect(rule, `.${typeClass(step)}`).toContain(`line-height: var(--leading-${step})`);
      expect(rule, `.${typeClass(step)}`).toContain(`letter-spacing: var(--tracking-${step})`);
    }
  });

  it("keeps a rem term in every clamp so text still scales at 200% zoom", () => {
    // WCAG 1.4.4. A `vw`-only middle term ignores the user's font size.
    for (const step of typeSteps) {
      const match = css.match(new RegExp(`--type-${step}:\\s*clamp\\(([^;]+)\\);`));
      expect(match, `--type-${step}`).not.toBeNull();
      const middle = match![1]!.split(",")[1]!;
      expect(middle, `--type-${step} middle term`).toContain("rem");
    }
  });
});

describe("the spacing scale", () => {
  it("mirrors every spacing token declared in the stylesheet", () => {
    expect([...new Set(declaredNames(css, "space"))].sort()).toEqual([...spaceTokens].sort());
  });
});

describe("the sticky chrome height", () => {
  it("derives the chrome height from the header and the service nav", () => {
    // WCAG 2.4.11. §9: the value becomes a token derived from the actual
    // chrome height rather than a hard coded 5.5rem.
    expect(css).toMatch(/--bds-chrome-height:\s*calc\(/);
    expect(css).toContain("--bds-header-height");
    expect(css).toContain("--bds-service-nav-height");
  });
});
