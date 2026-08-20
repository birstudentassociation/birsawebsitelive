import clsx from "clsx";
import type { JSX } from "react";

import { typeSteps, type TypeStep } from "@/components/bds/tokens";

export type { TypeStep };

/**
 * BIRSA Design System: typed helpers over the bilingual type scale
 * (`components/bds/tokens.css`, REDESIGN-2.0 §4.2, defect D7).
 *
 * Reaching for a Tailwind `text-*` or `leading-*` utility instead of `Text`
 * or `Heading` is a bug, not a style preference. Tailwind's font-size
 * utilities each carry a fixed line-height tuned for Latin text, and 1.0
 * fought that with unlayered `html[lang="th"]` overrides that had to be
 * remembered for every new heading size (D7). The scale in `tokens.css`
 * makes leading and tracking properties of the step itself, resolved through
 * a per-script custom property, so Thai is correct by construction the
 * moment a component uses a step and never touches the Tailwind scale at
 * all. `Text` and `Heading` are the only two ways a `bds/` component should
 * ever set a font size.
 */

/**
 * The seven steps of the bilingual type scale, re-exported from
 * `components/bds/tokens.ts`. Do not redefine this here: `tokens.ts` is a
 * frozen contract and this file only re-exports its type.
 */
const typeStepSet = new Set<TypeStep>(typeSteps);

function stepClassName(step: TypeStep): string {
  return `text-${step}`;
}

export type TextProps = {
  /**
   * The rendered element. Defaults to `p`. Use this to keep the element
   * that document structure calls for while still picking the visual size
   * from the type scale, for example a `span` inside a sentence that needs
   * to read at `body-sm`.
   */
  as?: keyof JSX.IntrinsicElements;
  /** Which step of the bilingual type scale to render at. */
  step: TypeStep;
  className?: string;
  children: React.ReactNode;
};

/**
 * Renders text at one step of the bilingual type scale.
 *
 * Use this for any run of text that is not a document heading: body copy,
 * captions, labels, standalone lead paragraphs. For an `h1` to `h4`, use
 * `Heading` instead, which keeps heading level and visual size independent
 * so a component never has to pick the wrong heading level just to get the
 * right size.
 *
 * Never pass a Tailwind font-size or line-height utility in `className` to
 * change the size: change `step` instead. `className` is for spacing,
 * colour and layout only.
 */
export function Text({ as, step, className, children }: TextProps) {
  const Component = (as ?? "p") as React.ElementType;
  return <Component className={clsx(stepClassName(step), className)}>{children}</Component>;
}

/** Heading levels `Heading` can render. Document structure only; see `Heading`. */
export type HeadingLevel = 1 | 2 | 3 | 4;

const defaultStepForLevel: Record<HeadingLevel, TypeStep> = {
  1: "display-2",
  2: "heading-1",
  3: "heading-2",
  4: "heading-3",
};

export type HeadingProps = {
  /**
   * The heading level to render, `h1` through `h4`. This is document
   * structure: it is what the accessibility tests assert (one `h1` per
   * page, logical heading order, REDESIGN-2.0 §7) and it must reflect where
   * the heading actually sits in the page outline, never how big the
   * caller wants it to look.
   */
  level: HeadingLevel;
  /**
   * Which step of the bilingual type scale to render at. Optional: when
   * omitted it defaults sensibly per level (1 to display-2, 2 to
   * heading-1, 3 to heading-2, 4 to heading-3). Pass this explicitly
   * whenever a heading needs to look larger or smaller than its level's
   * default, for example a section that is structurally an `h3` but needs
   * to read as prominently as a `display-1`.
   */
  step?: TypeStep;
  className?: string;
  children: React.ReactNode;
};

/**
 * Renders a document heading, `h1` through `h4`, at a step of the bilingual
 * type scale.
 *
 * `level` and `step` are deliberately separate props. `level` is document
 * structure: it is what an assistive technology user's heading navigation
 * and the accessibility tests rely on. `step` is visual size, chosen from
 * the type scale. Conflating the two, by letting heading size imply heading
 * level or the reverse, is exactly what forces a page to pick the wrong
 * heading level in order to get the size it wants, which breaks the
 * heading outline for every screen reader user on the page. So `level={3}
 * step="display-1"` is valid and expected: a heading that is structurally
 * third in the outline but reads as large as the page's biggest display
 * type.
 *
 * Never pass a Tailwind font-size or line-height utility in `className` to
 * change the size: change `step` instead. For text that is not a heading at
 * all, use `Text`.
 */
export function Heading({ level, step, className, children }: HeadingProps) {
  const resolvedStep = step ?? defaultStepForLevel[level];
  const Component = `h${level}` as "h1" | "h2" | "h3" | "h4";
  return <Component className={clsx(stepClassName(resolvedStep), className)}>{children}</Component>;
}

/** Guard used only by tests to confirm every step in the scale round-trips through `stepClassName`. */
export function isTypeStep(value: string): value is TypeStep {
  return typeStepSet.has(value as TypeStep);
}
