import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Bans the coloured-box-with-coloured-lip pattern (see docs/EDITING.md, "Boxes and notices").
 *
 * Banned in app/, components/, lib/ (tsx, ts, css, mjs):
 *  1. a one-side border (left, right, top, bottom, start, end) in any non-grey colour, with or
 *     without a fill;
 *  2. a one-side border together with a tinted or coloured background in the same className
 *     string or CSS rule.
 *
 * Allowed: a grey one-side border with no fill (GOV.UK inset text), borders on all four sides,
 * 1px hairline dividers in a grey token, and solid filled panels with no lip.
 *
 * Tailwind classes are judged per string literal. When a literal sets a one-side border width
 * but names no border colour at all (the colour lives in a lookup map such as
 * `styles[variant].border`), the literals within CONTEXT_LINES lines are read as its siblings, so
 * `"border-l-4 p-4"` next to `"border-error"` and `"bg-error-tint"` is still caught.
 */

const ROOT = join(__dirname, "..", "..");
const DIRS = ["app", "components", "lib"];
const EXTENSIONS = /\.(tsx|ts|css|mjs)$/;
const SKIP_DIRS = new Set(["node_modules", ".next", "tests"]);
const CONTEXT_LINES = 6;

/** Colour names (after `border-`/`bg-`/`var(--color-`) that count as grey or neutral. */
const NEUTRAL_COLOURS = new Set([
  "line",
  "line-strong",
  "input-border",
  "muted",
  "ink",
  "cream",
  "surface",
  "sunken",
  "white",
  "black",
  "transparent",
  "current",
  "inherit",
  "none",
]);
const GREY_FAMILY = /^(gray|grey|slate|zinc|neutral|stone)(-\d+)?$/;

function isNeutral(colour: string): boolean {
  const name = colour.replace(/\/\d+$/, "");
  return NEUTRAL_COLOURS.has(name) || GREY_FAMILY.test(name);
}

function isGreyHex(hex: string): boolean {
  const h = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex.slice(0, 6);
  const [r = 0, g = 0, b = 0] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return Math.max(r, g, b) - Math.min(r, g, b) <= 32;
}

export type Violation = { file: string; line: number; reason: string; snippet: string };

// ---------------------------------------------------------------------------
// Tailwind classes
// ---------------------------------------------------------------------------

type ClassFacts = {
  /** One-side border width utilities, e.g. `border-l-4`, `border-t`. */
  sideWidths: string[];
  /** Border colours (general or side-specific) that are not grey. */
  badBorderColours: string[];
  /** Any border colour at all, grey included. */
  anyBorderColour: boolean;
  /** Tinted or coloured backgrounds. */
  badBackgrounds: string[];
};

const VARIANT_PREFIX = /^(?:(?:\[[^\]]*\]|[^\s:[\]]+):)+/;
const SIDE_WIDTH = /^border-([lrtbse])(?:-(\d+|\[[^\]]+\]))?$/;
const SIDE_COLOUR = /^border-([lrtbse])-(.+)$/;
const BORDER_NON_COLOUR =
  /^(solid|dashed|dotted|double|hidden|none|collapse|separate|spacing|\d+|\[\d.*\]|\[length:.*\]|[xy](-.*)?)$/;

function classFacts(literal: string): ClassFacts {
  const facts: ClassFacts = {
    sideWidths: [],
    badBorderColours: [],
    anyBorderColour: false,
    badBackgrounds: [],
  };
  for (const raw of literal.split(/\s+/)) {
    const token = raw.replace(VARIANT_PREFIX, "").replace(/^!/, "");
    if (!token || token.startsWith("[")) continue;

    if (SIDE_WIDTH.test(token)) {
      facts.sideWidths.push(token);
      continue;
    }
    const side = SIDE_COLOUR.exec(token);
    if (side && /^[lrtbse]$/.test(side[1]!) && !/^(\d+|\[\d.*)$/.test(side[2]!)) {
      facts.anyBorderColour = true;
      if (!isNeutral(side[2]!)) facts.badBorderColours.push(token);
      continue;
    }
    if (token.startsWith("border-")) {
      const rest = token.slice("border-".length);
      if (BORDER_NON_COLOUR.test(rest)) continue;
      const arbitrary = /^\[(.+)\]$/.exec(rest);
      if (arbitrary) {
        const value = arbitrary[1]!.replace(/^color:/, "");
        facts.anyBorderColour = true;
        if (!isNeutralValue(value)) facts.badBorderColours.push(token);
        continue;
      }
      facts.anyBorderColour = true;
      if (!isNeutral(rest)) facts.badBorderColours.push(token);
      continue;
    }
    if (token.startsWith("bg-")) {
      const rest = token.slice("bg-".length);
      if (
        /^(none|clip-.*|origin-.*|no-repeat|repeat.*|cover|contain|center|top|bottom|left|right|fixed|local|scroll|blend-.*|linear.*|radial.*|conic.*|gradient.*)$/.test(
          rest
        )
      )
        continue;
      const arbitrary = /^\[(.+)\]$/.exec(rest);
      if (arbitrary) {
        if (!isNeutralValue(arbitrary[1]!)) facts.badBackgrounds.push(token);
        continue;
      }
      if (!isNeutral(rest)) facts.badBackgrounds.push(token);
    }
  }
  return facts;
}

/** Judges an arbitrary value such as `#8a7a64`, `var(--color-brand)` or `currentColor`. */
function isNeutralValue(value: string): boolean {
  const v = value.trim();
  const named = /var\(--color-([a-z-]+)\)/.exec(v);
  if (named) return isNeutral(named[1]!);
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})(?:[0-9a-f]{2})?$/i.exec(v);
  if (hex) return isGreyHex(hex[1]!);
  if (
    /^(currentcolor|transparent|inherit|initial|unset|none|white|black|canvas|canvastext)$/i.test(v)
  )
    return true;
  return false;
}

// ---------------------------------------------------------------------------
// String literals in ts/tsx/mjs
// ---------------------------------------------------------------------------

type Literal = { text: string; line: number };

function blankComments(source: string): string {
  const keepNewlines = (m: string) => m.replace(/[^\n]/g, " ");
  return source
    .replace(/\/\*[\s\S]*?\*\//g, keepNewlines)
    .replace(
      /(^|[\s;{}(),])\/\/.*$/gm,
      (m, lead: string) => lead + " ".repeat(m.length - lead.length)
    );
}

function extractLiterals(source: string): Literal[] {
  const clean = blankComments(source);
  const literals: Literal[] = [];
  const pattern = /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(clean))) {
    const line = clean.slice(0, match.index).split("\n").length;
    literals.push({ text: match[0].slice(1, -1), line });
  }
  return literals;
}

function scanTailwind(file: string, source: string): Violation[] {
  const literals = extractLiterals(source);
  const violations: Violation[] = [];
  for (const [index, literal] of literals.entries()) {
    if (!/\bborder-/.test(literal.text) && !/(^|\s)(\S+:)*border-[lrtbse]\b/.test(literal.text))
      continue;
    const facts = classFacts(literal.text);
    if (facts.sideWidths.length === 0) continue;

    let badBorderColours = facts.badBorderColours;
    let badBackgrounds = facts.badBackgrounds;
    if (!facts.anyBorderColour && badBackgrounds.length === 0) {
      // The colour or fill may live in a sibling literal (lookup map, clsx branch).
      for (const [other, sibling] of literals.entries()) {
        if (other === index || Math.abs(sibling.line - literal.line) > CONTEXT_LINES) continue;
        if (!/\b(border|bg)-/.test(sibling.text) || sibling.text.length > 160) continue;
        const siblingFacts = classFacts(sibling.text);
        if (siblingFacts.sideWidths.length > 0) continue;
        badBorderColours = badBorderColours.concat(siblingFacts.badBorderColours);
        badBackgrounds = badBackgrounds.concat(siblingFacts.badBackgrounds);
      }
    }

    const reasons: string[] = [];
    if (badBorderColours.length > 0)
      reasons.push(
        `one-side border (${facts.sideWidths.join(" ")}) in non-grey colour (${badBorderColours.join(" ")})`
      );
    if (badBackgrounds.length > 0)
      reasons.push(
        `one-side border (${facts.sideWidths.join(" ")}) with coloured background (${badBackgrounds.join(" ")})`
      );
    if (reasons.length > 0) {
      violations.push({
        file,
        line: literal.line,
        reason: reasons.join("; "),
        snippet: literal.text.replace(/\s+/g, " ").slice(0, 100),
      });
    }
  }
  return violations;
}

/**
 * Inline React style props with a left/right accent lip, e.g. `borderLeftColor: accent`. Only the
 * horizontal sides are read: top/bottom style borders occur in generated OG images and email
 * markup, which are not page boxes.
 */
function scanStyleProps(file: string, source: string): Violation[] {
  const violations: Violation[] = [];
  const lines = blankComments(source).split("\n");
  for (const [index, text] of lines.entries()) {
    const prop = /\bborder(Left|Right|InlineStart|InlineEnd)(Color)?\s*:\s*([^,}]+)/.exec(text);
    if (!prop) continue;
    const value = prop[3]!.trim();
    if (/^["'`]?(none|0|0px)["'`]?$/.test(value)) continue;
    if (/var\(--color-([a-z-]+)\)/.test(value) && isNeutralValue(value)) continue;
    // Width-only declarations carry no colour; the colour is judged where it is set.
    if (!prop[2] && !/(solid|dashed|dotted|#|rgb|var\()/.test(value)) continue;
    violations.push({
      file,
      line: index + 1,
      reason: `inline style border${prop[1]}${prop[2] ?? ""} sets a non-grey side border`,
      snippet: text.trim().slice(0, 100),
    });
  }
  return violations;
}

// ---------------------------------------------------------------------------
// CSS rules (also inline CSS text in ts/tsx literals)
// ---------------------------------------------------------------------------

const SIDE_PROPERTY =
  /^border-(left|right|top|bottom|inline-start|inline-end|block-start|block-end)(-width|-color|-style)?$/;

function scanCss(file: string, source: string): Violation[] {
  const clean = source.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
  const violations: Violation[] = [];
  // Innermost blocks only: declarations live in `{ ... }` with no nested braces.
  const block = /([^{}]*)\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = block.exec(clean))) {
    const bodyStart = match.index + match[1]!.length + 1;
    const declarations: { prop: string; value: string; line: number }[] = [];
    const decl = /([a-z-]+)\s*:\s*([^;]+)(?:;|$)/gi;
    let d: RegExpExecArray | null;
    while ((d = decl.exec(match[2]!))) {
      const line = clean.slice(0, bodyStart + d.index).split("\n").length;
      declarations.push({ prop: d[1]!.toLowerCase(), value: d[2]!.trim(), line });
    }

    const sides = declarations.filter((x) => SIDE_PROPERTY.test(x.prop));
    if (sides.length === 0) continue;
    const drawn = sides.filter(
      (x) => !/^(none|0|0px|hidden)$/.test(x.value) && !x.prop.endsWith("-style")
    );
    if (drawn.length === 0) continue;

    const reasons: string[] = [];
    const anchor = drawn[0]!.line;
    for (const side of drawn) {
      const colourPart = side.prop.endsWith("-width")
        ? ""
        : side.value
            .replace(/\b\d*\.?\d+(px|rem|em)?\b/g, " ")
            .replace(/\b(solid|dashed|dotted|double|thin|medium|thick)\b/g, " ");
      const colours = [
        ...colourPart.matchAll(
          /var\(--color-([a-z-]+)\)|#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?)\([^)]*\)|\b[a-z]+\b/gi
        ),
      ];
      for (const c of colours) {
        const text = c[0];
        const neutral = c[1] ? isNeutral(c[1]) : isNeutralValue(text);
        if (!neutral && !/^(var|calc)$/i.test(text))
          reasons.push(`${side.prop}: ${side.value} is a non-grey one-side border`);
      }
    }
    const fill = declarations.find(
      (x) => (x.prop === "background" || x.prop === "background-color") && !isNeutralFill(x.value)
    );
    if (fill) reasons.push(`one-side border with coloured background (${fill.value})`);

    if (reasons.length > 0) {
      violations.push({
        file,
        line: anchor,
        reason: [...new Set(reasons)].join("; "),
        snippet: `${match[1]!.trim().slice(-60)} { ${drawn.map((x) => `${x.prop}: ${x.value}`).join("; ")} }`,
      });
    }
  }
  return violations;
}

function isNeutralFill(value: string): boolean {
  const vars = [...value.matchAll(/var\(--color-([a-z-]+)\)/g)].map((m) => m[1]!);
  if (vars.length > 0) return vars.every((v) => isNeutral(v));
  const hex = /#([0-9a-f]{3}|[0-9a-f]{6})\b/i.exec(value);
  if (hex) return isGreyHex(hex[1]!);
  return !/\b(rgb|hsl|oklch|color-mix)a?\(/i.test(value);
}

// ---------------------------------------------------------------------------

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) files.push(...walk(path));
    else if (EXTENSIONS.test(name)) files.push(path);
  }
  return files;
}

export function scanSource(file: string, source: string): Violation[] {
  if (file.endsWith(".css")) return scanCss(file, source);
  return [
    ...scanTailwind(file, source),
    ...scanStyleProps(file, source),
    ...scanCss(file, source.replace(/\/\/.*$/gm, "")),
  ].filter((v, i, all) => all.findIndex((o) => o.line === v.line && o.reason === v.reason) === i);
}

describe("scanSource (matcher precision)", () => {
  const scan = (source: string) => scanSource("x.tsx", source).length;

  it("flags non-grey one-side borders and tinted one-side boxes", () => {
    expect(scan(`<div className="border-l-4 border-brand p-4" />`)).toBe(1);
    expect(scan(`<div className="rounded border-l-4 border-info bg-info-tint" />`)).toBe(1);
    expect(scan(`<div className="border-l-4 bg-warning-tint" />`)).toBe(1);
    expect(scan(`<div className="border-t-2 border-t-success" />`)).toBe(1);
    expect(scan(`<div className="md:border-s-4 md:border-error" />`)).toBe(1);
    expect(
      scan(`const s = { info: "border-info", bg: "bg-info-tint" };\nconst c = "border-l-4 p-4";`)
    ).toBe(1);
  });

  it("allows grey one-side borders, hairlines and all-round borders", () => {
    expect(scan(`<div className="border-l-4 border-line-strong pl-4" />`)).toBe(0);
    expect(scan(`<li className="border-t border-line py-2" />`)).toBe(0);
    expect(scan(`<div className="border-b border-line bg-sunken" />`)).toBe(0);
    expect(scan(`<div className="border-4 border-error bg-surface" />`)).toBe(0);
    expect(scan(`<div className="border border-brand bg-brand-tint" />`)).toBe(0);
    expect(scan(`<div className="border-l-4 border-gray-400" />`)).toBe(0);
  });

  it("judges CSS rules", () => {
    const css = (rule: string) => scanSource("x.css", rule).length;
    expect(css(`.a { border-left: 4px solid var(--color-brand); }`)).toBe(1);
    expect(css(`.a { border-left: 4px solid var(--color-line-strong); }`)).toBe(0);
    expect(css(`.a { border-top: 1px solid var(--color-line); }`)).toBe(0);
    expect(
      css(`.a { border-left: 3px solid var(--color-line); background: var(--color-info-tint); }`)
    ).toBe(1);
    expect(
      css(`.a { border: 1px solid var(--color-brand); background: var(--color-brand-tint); }`)
    ).toBe(0);
  });
});

describe("no coloured accent boxes", () => {
  it("has no one-side accent border in a colour, or one-side border on a tinted fill", () => {
    const violations: Violation[] = [];
    for (const dir of DIRS) {
      for (const path of walk(join(ROOT, dir))) {
        const file = relative(ROOT, path);
        violations.push(...scanSource(file, readFileSync(path, "utf8")));
      }
    }
    const report = violations
      .sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)
      .map((v) => `${v.file}:${v.line}  ${v.reason}\n    ${v.snippet}`);
    expect(report, `Coloured accent boxes found:\n${report.join("\n")}`).toEqual([]);
  });
});
