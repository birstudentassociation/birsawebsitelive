/**
 * BIRSA Design System: the TypeScript mirror of `components/bds/tokens.css`.
 *
 * FROZEN CONTRACT. Wave 0 owns this file (REDESIGN-2.0 §11.1, §11.3 item 3).
 *
 * Why a mirror exists at all: §4.2 asks for one so components and tests can
 * reference a token by name rather than by string literal, which is what turns
 * "the contrast comments in the CSS" into an assertion and what lets the
 * `/design` reference page enumerate the system rather than list it by hand.
 *
 * `tests/unit/bds-tokens.test.ts` parses the CSS and fails if the two drift,
 * so this file cannot quietly fall behind the stylesheet.
 */

/** Every colour token, in the order it is declared in `tokens.css`. */
export const colorTokens = [
  "cream",
  "surface",
  "sunken",
  "line",
  "line-strong",
  "input-border",
  "ink",
  "muted",
  "brand",
  "brand-dark",
  "brand-strong",
  "brand-deep",
  "brand-tint",
  "forest",
  "forest-tint",
  "success",
  "success-tint",
  "warning",
  "warning-tint",
  "error",
  "error-tint",
  "info",
  "info-tint",
] as const;

export type ColorToken = (typeof colorTokens)[number];

/**
 * The seven steps of the bilingual type scale (§4.2).
 *
 * Components use these names as class names: `text-display-2`, never
 * `text-4xl`. Line-height and letter-spacing are properties of the step and
 * resolve through a per-script custom property, so a step is correct in Thai
 * by construction. See the long note in `tokens.css`.
 */
export const typeSteps = [
  "display-1",
  "display-2",
  "heading-1",
  "heading-2",
  "heading-3",
  "body",
  "body-sm",
] as const;

export type TypeStep = (typeof typeSteps)[number];

/** The class name for a type step. The only supported way to set a font size. */
export function typeClass(step: TypeStep): `text-${TypeStep}` {
  return `text-${step}`;
}

/** The spacing scale (§4.2). `--space-section` is the page-section rhythm. */
export const spaceTokens = [
  "3xs",
  "2xs",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "section",
] as const;

export type SpaceToken = (typeof spaceTokens)[number];

/** Radius and shadow tokens, carried over unchanged from 1.0. */
export const radiusTokens = ["sm", "", "lg", "xl"] as const;
export const shadowTokens = ["sm", "md", "lg"] as const;

/**
 * Colour pairs that must meet a contrast ratio, asserted by
 * `npm run check:contrast` in BOTH themes (§4.2, §9 for 1.4.11).
 *
 * `min` is the WCAG 2.2 threshold that applies to the pair: 4.5 for body text
 * (1.4.3), 3 for large text and for non-text UI boundaries (1.4.11).
 */
export const contrastPairs: ReadonlyArray<{
  readonly foreground: ColorToken;
  readonly background: ColorToken;
  readonly min: 3 | 4.5;
  readonly why: string;
}> = [
  { foreground: "ink", background: "cream", min: 4.5, why: "body text on the page" },
  { foreground: "ink", background: "surface", min: 4.5, why: "body text on a card" },
  { foreground: "ink", background: "sunken", min: 4.5, why: "body text in a well" },
  { foreground: "muted", background: "cream", min: 4.5, why: "secondary text, captions" },
  { foreground: "muted", background: "surface", min: 4.5, why: "secondary text on a card" },
  { foreground: "brand-deep", background: "cream", min: 4.5, why: "link text" },
  { foreground: "brand-deep", background: "surface", min: 4.5, why: "link text on a card" },
  { foreground: "success", background: "success-tint", min: 4.5, why: "success notice" },
  { foreground: "warning", background: "warning-tint", min: 4.5, why: "warning notice" },
  { foreground: "error", background: "error-tint", min: 4.5, why: "error notice and message" },
  { foreground: "info", background: "info-tint", min: 4.5, why: "info notice" },
  {
    foreground: "input-border",
    background: "cream",
    min: 3,
    why: "form control boundary (WCAG 1.4.11 non-text contrast)",
  },
  {
    foreground: "input-border",
    background: "surface",
    min: 3,
    why: "form control boundary on a card (WCAG 1.4.11)",
  },
  {
    foreground: "line-strong",
    background: "cream",
    min: 3,
    why: "a hairline that carries meaning, e.g. a selected tab rule",
  },
] as const;
