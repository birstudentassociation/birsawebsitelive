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
] as const;

/**
 * `line-strong` is deliberately NOT in the list above, and the reason is worth
 * keeping because it is the first thing `check:contrast` found.
 *
 * It was declared as a 1.4.11 surface ("a hairline that carries meaning") and
 * it failed: #d9cbb2 on cream is 1.50:1 against a 3:1 requirement, in the light
 * theme only, since the dark theme already gives it the same value as
 * `input-border`.
 *
 * Looking at where it was actually used settled which half was wrong. Eleven of
 * its fifteen call sites were the BORDER OF AN INTERACTIVE CONTROL: the header
 * menu button, the theme and language toggles, the search button, scroll to
 * top, the calendar's month buttons, the ring marking today, and every filter
 * pill on the site. WCAG 1.4.11 covers exactly that, so the requirement was
 * right and the token was wrong for the job. The other four are genuine
 * decoration: the footer rule, the step connector, a static label pill and a
 * note border.
 *
 * The fix was to move those eleven onto `input-border`, which exists for
 * precisely this ("form input/textarea/select boundary, >=3:1") and already
 * passes at 3.89:1. In dark mode the two tokens are the same colour, so
 * nothing changed there; in light mode only control outlines darkened, and the
 * decorative hairlines that carry the cream-editorial identity are untouched.
 *
 * `line-strong` is now decorative only, so asserting a contrast minimum on it
 * would be asserting something WCAG does not require. If a future component
 * uses it to convey state, that component is the bug, not this list.
 */
