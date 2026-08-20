// @vitest-environment jsdom
/**
 * Unit tests for the page layout primitives in `components/bds/Layout.tsx`
 * (REDESIGN-2.0 §4.2): `GridRow`/`GridMain`/`GridAside`, `Wrap`, `Section`
 * and `Stack`.
 */
import { afterEach, describe, expect, it } from "vitest";
import { render, cleanup } from "@testing-library/react";

import { GridRow, GridMain, GridAside, Wrap, Section, Stack } from "@/components/bds/Layout";

afterEach(() => {
  cleanup();
});

describe("GridRow, GridMain, GridAside", () => {
  it("GridMain spans two tracks and GridAside spans one", () => {
    const { container } = render(
      <GridRow>
        <GridMain className="main-column">main</GridMain>
        <GridAside className="aside-column">aside</GridAside>
      </GridRow>
    );

    const main = container.querySelector(".main-column");
    const aside = container.querySelector(".aside-column");
    expect(main?.className).toContain("md:col-span-2");
    expect(aside?.className).toContain("md:col-span-1");
  });

  it("composes className without dropping the base classes", () => {
    const { container: rowContainer } = render(<GridRow className="extra-row">content</GridRow>);
    const row = rowContainer.firstElementChild;
    expect(row?.className).toContain("grid");
    expect(row?.className).toContain("md:grid-cols-3");
    expect(row?.className).toContain("extra-row");

    const { container: mainContainer } = render(
      <GridMain className="extra-main">content</GridMain>
    );
    const main = mainContainer.firstElementChild;
    expect(main?.className).toContain("md:col-span-2");
    expect(main?.className).toContain("extra-main");

    const { container: asideContainer } = render(
      <GridAside className="extra-aside">content</GridAside>
    );
    const aside = asideContainer.firstElementChild;
    expect(aside?.className).toContain("md:col-span-1");
    expect(aside?.className).toContain("extra-aside");
  });
});

describe("Wrap", () => {
  it("renders with the wrap class", () => {
    const { container } = render(<Wrap>content</Wrap>);
    expect(container.firstElementChild?.className).toContain("wrap");
  });

  it("composes className without dropping the wrap class", () => {
    const { container } = render(<Wrap className="extra-wrap">content</Wrap>);
    const el = container.firstElementChild;
    expect(el?.className).toContain("wrap");
    expect(el?.className).toContain("extra-wrap");
  });
});

describe("Section", () => {
  it("renders a <section> with the bds-section class by default", () => {
    const { container } = render(<Section>content</Section>);
    const el = container.firstElementChild;
    expect(el?.tagName).toBe("SECTION");
    expect(el?.className).toContain("bds-section");
  });

  it("renders a <div> when as is set to div, keeping the bds-section class", () => {
    const { container } = render(<Section as="div">content</Section>);
    const el = container.firstElementChild;
    expect(el?.tagName).toBe("DIV");
    expect(el?.className).toContain("bds-section");
  });

  it("composes className without dropping the bds-section class", () => {
    const { container } = render(<Section className="extra-section">content</Section>);
    const el = container.firstElementChild;
    expect(el?.className).toContain("bds-section");
    expect(el?.className).toContain("extra-section");
  });
});

describe("Stack", () => {
  it("defaults to the md gap token", () => {
    const { container } = render(<Stack>content</Stack>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.gap).toBe("var(--space-md)");
  });

  it("applies the custom property for a given gap token", () => {
    const { container } = render(<Stack gap="lg">content</Stack>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.gap).toBe("var(--space-lg)");
  });

  // `gap` is typed as `SpaceToken`, imported from `components/bds/tokens.ts`
  // rather than redefined here, so passing a token that is not in that union
  // (e.g. `gap="huge"`) is a compile-time error. There is no runtime branch
  // to exercise for an invalid token; the guarantee is the type, not a check
  // this test can call. The assertions above cover the runtime default and
  // an explicit valid token instead.

  it("composes className without dropping the flex classes", () => {
    const { container } = render(<Stack className="extra-stack">content</Stack>);
    const el = container.firstElementChild;
    expect(el?.className).toContain("flex");
    expect(el?.className).toContain("flex-col");
    expect(el?.className).toContain("extra-stack");
  });

  it("renders as a different element when as is set", () => {
    const { container } = render(<Stack as="ul">content</Stack>);
    expect(container.firstElementChild?.tagName).toBe("UL");
  });
});
