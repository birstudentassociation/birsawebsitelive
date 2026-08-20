// @vitest-environment jsdom
/**
 * Unit tests for `Text` and `Heading` (`components/bds/Type.tsx`), the
 * typed helpers over the bilingual type scale (REDESIGN-2.0 §4.2, defect
 * D7). These pin down the contract that keeps D7 fixed: every rendered
 * class name comes from the scale, `as`/`level` control the element while
 * `step` controls the size, and no helper ever emits a Tailwind font-size
 * or line-height utility.
 */
import { afterEach, describe, expect, it } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { Text, Heading } from "@/components/bds/Type";

afterEach(cleanup);

/** Any Tailwind font-size or line-height utility, the utilities D7 forbids. */
const TAILWIND_TYPE_UTILITY = /\b(text-(xs|sm|base|lg|xl|\d?xl)|leading-)/;

describe("Text", () => {
  it("renders a <p> with class text-body by default", () => {
    render(<Text step="body">Read this first.</Text>);
    const el = screen.getByText("Read this first.");
    expect(el.tagName).toBe("P");
    expect(el).toHaveClass("text-body");
  });

  it("lets `as` override the rendered element", () => {
    render(
      <Text as="span" step="body-sm">
        A caption.
      </Text>
    );
    const el = screen.getByText("A caption.");
    expect(el.tagName).toBe("SPAN");
    expect(el).toHaveClass("text-body-sm");
  });

  it("composes className rather than replacing it", () => {
    render(
      <Text step="body" className="mt-4 text-muted">
        Composed.
      </Text>
    );
    const el = screen.getByText("Composed.");
    expect(el).toHaveClass("text-body");
    expect(el).toHaveClass("text-muted");
    expect(el).toHaveClass("mt-4");
  });
});

describe("Heading", () => {
  it("renders an <h2> and defaults to the heading-1 step", () => {
    render(<Heading level={2}>Section title</Heading>);
    const el = screen.getByRole("heading", { level: 2, name: "Section title" });
    expect(el).toHaveClass("text-heading-1");
  });

  it("defaults level 1 to display-2, level 3 to heading-2 and level 4 to heading-3", () => {
    render(<Heading level={1}>H1</Heading>);
    expect(screen.getByRole("heading", { level: 1, name: "H1" })).toHaveClass("text-display-2");

    render(<Heading level={3}>H3</Heading>);
    expect(screen.getByRole("heading", { level: 3, name: "H3" })).toHaveClass("text-heading-2");

    render(<Heading level={4}>H4</Heading>);
    expect(screen.getByRole("heading", { level: 4, name: "H4" })).toHaveClass("text-heading-3");
  });

  it('keeps level and step independent: level={3} step="display-1" renders an h3 carrying text-display-1', () => {
    render(
      <Heading level={3} step="display-1">
        Loud but structurally third
      </Heading>
    );
    const el = screen.getByRole("heading", { level: 3, name: "Loud but structurally third" });
    expect(el.tagName).toBe("H3");
    expect(el).toHaveClass("text-display-1");
  });

  it("composes className rather than replacing it", () => {
    render(
      <Heading level={2} className="mb-2">
        Composed heading
      </Heading>
    );
    const el = screen.getByRole("heading", { level: 2, name: "Composed heading" });
    expect(el).toHaveClass("text-heading-1");
    expect(el).toHaveClass("mb-2");
  });
});

describe("D7 regression guard", () => {
  it("never emits a Tailwind font-size or line-height utility for any step or level", () => {
    const steps = [
      "display-1",
      "display-2",
      "heading-1",
      "heading-2",
      "heading-3",
      "body",
      "body-sm",
    ] as const;

    for (const step of steps) {
      const { unmount } = render(<Text step={step}>Sample</Text>);
      const el = screen.getByText("Sample");
      expect(el.className).not.toMatch(TAILWIND_TYPE_UTILITY);
      unmount();
    }

    for (const level of [1, 2, 3, 4] as const) {
      const { unmount } = render(<Heading level={level}>Sample heading</Heading>);
      const el = screen.getByRole("heading", { level });
      expect(el.className).not.toMatch(TAILWIND_TYPE_UTILITY);
      unmount();
    }
  });
});
