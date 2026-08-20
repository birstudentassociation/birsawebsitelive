// @vitest-environment jsdom
/**
 * Unit tests for `Icon` and its sprite `components/bds/icons.ts`
 * (REDESIGN-2.0 §4.2). Covers: every icon in the record renders without
 * throwing, the default render is decorative (`aria-hidden`, not
 * focusable), passing `title` is the documented exception (`role="img"`,
 * a `<title>`, no `aria-hidden`), and the sprite data itself stays
 * theme-safe (one shared viewBox, no icon carries a hard-coded colour).
 */
import { afterEach, describe, expect, it } from "vitest";
import { render, cleanup } from "@testing-library/react";
import axe from "axe-core";

import Icon from "@/components/bds/Icon";
import { iconPaths, ICON_VIEW_BOX, type IconName } from "@/components/bds/icons";

const AXE_OPTIONS: Parameters<typeof axe.run>[1] = {
  runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
};

afterEach(() => {
  cleanup();
});

const iconNames = Object.keys(iconPaths) as IconName[];

describe("Icon", () => {
  it("has at least one icon registered", () => {
    expect(iconNames.length).toBeGreaterThan(0);
  });

  it.each(iconNames)("renders '%s' without throwing", (name) => {
    expect(() => render(<Icon name={name} />)).not.toThrow();
  });

  it.each(iconNames)("renders '%s' as a real <svg> with a <path>", (name) => {
    const { container } = render(<Icon name={name} />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.querySelector("path")).not.toBeNull();
  });

  describe("default render (no title)", () => {
    it("is aria-hidden and not focusable", () => {
      const { container } = render(<Icon name="close" />);
      const svg = container.querySelector("svg");
      expect(svg?.getAttribute("aria-hidden")).toBe("true");
      expect(svg?.getAttribute("focusable")).toBe("false");
      expect(svg?.getAttribute("role")).toBeNull();
      expect(svg?.querySelector("title")).toBeNull();
    });

    it("has no axe violations sitting next to real text", async () => {
      const { container } = render(
        <button type="button">
          <Icon name="close" />
          Close
        </button>
      );
      const results = await axe.run(container, AXE_OPTIONS);
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    });

    it("inherits currentColor rather than a hard coded colour", () => {
      const { container } = render(<Icon name="close" />);
      const svg = container.querySelector("svg");
      expect(svg?.getAttribute("stroke")).toBe("currentColor");
      expect(svg?.getAttribute("fill")).toBe("none");
    });

    it("sizes from font size, not a fixed pixel height", () => {
      const { container } = render(<Icon name="close" />);
      const svg = container.querySelector("svg");
      expect(svg?.getAttribute("width")).toBe("1em");
      expect(svg?.getAttribute("height")).toBe("1em");
    });
  });

  describe("with title passed", () => {
    it("takes role=img, renders a <title>, and drops aria-hidden", () => {
      const { container } = render(<Icon name="close" title="Close" />);
      const svg = container.querySelector("svg");
      expect(svg?.getAttribute("role")).toBe("img");
      expect(svg?.getAttribute("aria-hidden")).toBeNull();

      const titleEl = svg?.querySelector("title");
      expect(titleEl).not.toBeNull();
      expect(titleEl?.textContent).toBe("Close");

      const labelledBy = svg?.getAttribute("aria-labelledby");
      expect(labelledBy).toBeTruthy();
      expect(container.querySelector(`#${labelledBy}`)).toBe(titleEl);
    });

    it("has no axe violations as a standalone labelled image", async () => {
      const { container } = render(<Icon name="close" title="Close" />);
      const results = await axe.run(container, AXE_OPTIONS);
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    });
  });
});

describe("icon sprite data (components/bds/icons.ts)", () => {
  it("agrees on a single viewBox for every icon, via the shared constant", () => {
    // Icon.tsx never reads a per-icon viewBox: every render uses
    // ICON_VIEW_BOX. This test asserts that constant is the fixed shape
    // every icon in iconPaths was authored against, so a future edit to
    // Icon.tsx cannot quietly start reading one per icon without this
    // failing to say why that would be unsafe.
    expect(ICON_VIEW_BOX).toBe("0 0 20 20");
    for (const name of iconNames) {
      const { container } = render(<Icon name={name} />);
      expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe(ICON_VIEW_BOX);
    }
  });

  it("contains no hard coded fill or stroke colour in any path's `d`", () => {
    // The `d` attribute is pure path syntax (moveto/lineto/curveto/arcto
    // commands and numbers); colour never belongs inside it. This guards
    // against a future entry being pasted in with an inline style or a
    // colour keyword left over from its source component, which would make
    // that one icon break in dark mode while every other icon stayed
    // theme-safe.
    const colourLike = /fill|stroke|#[0-9a-f]{3,8}\b|rgb\(|rgba\(/i;
    for (const [name, d] of Object.entries(iconPaths)) {
      expect(colourLike.test(d), `${name} should not embed a colour: ${d}`).toBe(false);
    }
  });

  it("uses only valid path-data characters", () => {
    // Commands, numbers, decimals, minus signs, commas and whitespace. Catches
    // a stray character left over from copying JSX (a curly brace, a quote)
    // that would otherwise only surface as a rendering glitch.
    const validPathData = /^[MmLlHhVvCcSsQqTtAaZz0-9.,\-\s]+$/;
    for (const [name, d] of Object.entries(iconPaths)) {
      expect(validPathData.test(d), `${name} has unexpected characters: ${d}`).toBe(true);
    }
  });

  it("every icon name is unique and non-empty", () => {
    const seen = new Set<string>();
    for (const name of iconNames) {
      expect(name.length).toBeGreaterThan(0);
      expect(seen.has(name)).toBe(false);
      seen.add(name);
    }
  });

  it("has exactly the inventory the report names, no more, no fewer", () => {
    // Every other test in this file iterates `Object.keys(iconPaths)`, which
    // means a missing icon is invisible to it: a test that only ever asks
    // "for each icon that exists, does it behave" can never notice that one
    // was supposed to exist and doesn't. This is the one assertion in the
    // file that does not iterate the record; it checks the record itself
    // against a list written down independently of it, so a future edit
    // that silently drops (or renames, or duplicates under a new key) an
    // icon fails here even though every iterate-the-record test above it
    // would still pass. Keep this list in sync with the inventory table in
    // the Wave 1 Agent C report when an icon is deliberately added.
    const expectedIconNames = [
      "arrow-up",
      "building",
      "calendar",
      "check",
      "chevron-down",
      "chevron-left",
      "chevron-right",
      "circle-alert",
      "circle-x",
      "close",
      "external-link",
      "globe",
      "info-circle",
      "menu",
      "moon",
      "pencil",
      "person",
      "pin",
      "search",
      "star",
      "sun",
      "warning-triangle",
    ].sort();

    expect(Object.keys(iconPaths).sort()).toEqual(expectedIconNames);
  });
});
