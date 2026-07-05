import { describe, expect, it } from "vitest";
import { extractH2Toc } from "@/lib/toc";

describe("extractH2Toc", () => {
  it("extracts only h2 headings, excluding h1 and h3", () => {
    const source = ["# Title", "## First section", "### A subsection", "## Second section"].join(
      "\n"
    );
    const toc = extractH2Toc(source);
    expect(toc.map((item) => item.label)).toEqual(["First section", "Second section"]);
  });

  it("strips bold, links, and inline code from heading labels", () => {
    const source = [
      "## **Bold** heading",
      "## A [linked](https://example.com) heading",
      "## Some `code` heading",
    ].join("\n");
    const toc = extractH2Toc(source);
    expect(toc.map((item) => item.label)).toEqual([
      "Bold heading",
      "A linked heading",
      "Some code heading",
    ]);
  });

  it("skips headings inside fenced code blocks", () => {
    const source = ["## Real heading", "```", "## Not a heading", "```", "## Another real heading"].join(
      "\n"
    );
    const toc = extractH2Toc(source);
    expect(toc.map((item) => item.label)).toEqual(["Real heading", "Another real heading"]);
  });

  it("preserves Thai characters in the generated id", () => {
    const source = "## การลงทะเบียนเรียน";
    const toc = extractH2Toc(source);
    expect(toc).toHaveLength(1);
    expect(toc[0]?.label).toBe("การลงทะเบียนเรียน");
    expect(toc[0]?.id).toBe("การลงทะเบียนเรียน");
  });

  it("appends a -1 suffix for duplicate headings, matching github-slugger", () => {
    const source = ["## Getting started", "## Getting started"].join("\n");
    const toc = extractH2Toc(source);
    expect(toc.map((item) => item.id)).toEqual(["getting-started", "getting-started-1"]);
  });
});
