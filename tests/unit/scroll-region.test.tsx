// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { act, render } from "@testing-library/react";
import ScrollRegion from "@/components/ScrollRegion";

const ROOT = join(__dirname, "..", "..");

function sourceFiles(dir: string): string[] {
  return readdirSync(join(ROOT, dir), { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && /\.(tsx|ts|css)$/.test(entry.name))
    .map((entry) => join(entry.parentPath, entry.name));
}

describe("sideways scrolling", () => {
  it("goes through ScrollRegion everywhere so every scroller gets edge shadows", () => {
    const offenders = ["app", "components", "lib"]
      .flatMap(sourceFiles)
      .filter((file) => !file.endsWith(join("components", "ScrollRegion.tsx")))
      .filter((file) => {
        const code = readFileSync(file, "utf8")
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/^\s*\/\/.*$/gm, "");
        return /overflow-x-(auto|scroll)|overflow-x:\s*(auto|scroll)/.test(code);
      })
      .map((file) => file.slice(ROOT.length + 1));
    expect(offenders).toEqual([]);
  });
});

function setScroll(
  el: HTMLElement,
  { scrollWidth, clientWidth, scrollLeft }: Record<string, number>
) {
  Object.defineProperty(el, "scrollWidth", { configurable: true, value: scrollWidth });
  Object.defineProperty(el, "clientWidth", { configurable: true, value: clientWidth });
  Object.defineProperty(el, "scrollLeft", { configurable: true, value: scrollLeft });
}

describe("ScrollRegion", () => {
  it("shows a shadow on each edge there is more content beyond", async () => {
    const frames: FrameRequestCallback[] = [];
    globalThis.requestAnimationFrame = (cb) => frames.push(cb);
    globalThis.cancelAnimationFrame = () => {};

    const { container } = render(
      <ScrollRegion aria-label="Table" tabIndex={0}>
        <table />
      </ScrollRegion>
    );
    const scroller = container.querySelector<HTMLElement>("[aria-label='Table']")!;
    const [start, end] = Array.from(container.querySelectorAll(".scroll-shadow")) as [
      Element,
      Element,
    ];
    const scrollTo = (scrollLeft: number) =>
      act(() => {
        setScroll(scroller, { scrollWidth: 600, clientWidth: 300, scrollLeft });
        scroller.dispatchEvent(new Event("scroll"));
        frames.splice(0).forEach((cb) => cb(0));
      });

    expect(start.hasAttribute("data-visible")).toBe(false);
    expect(end.hasAttribute("data-visible")).toBe(false);

    await scrollTo(0);
    expect(start.hasAttribute("data-visible")).toBe(false);
    expect(end.hasAttribute("data-visible")).toBe(true);

    await scrollTo(150);
    expect(start.hasAttribute("data-visible")).toBe(true);
    expect(end.hasAttribute("data-visible")).toBe(true);

    await scrollTo(300);
    expect(start.hasAttribute("data-visible")).toBe(true);
    expect(end.hasAttribute("data-visible")).toBe(false);
  });
});
