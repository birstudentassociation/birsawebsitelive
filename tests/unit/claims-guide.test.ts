import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { claimsGuides } from "@/content/emergency/claims";
import { scenarios } from "@/content/emergency/scenarios";
import type { GuideBlock } from "@/content/emergency/types";

const locales = ["en", "th"] as const;
function blockText(blocks: GuideBlock[]): string[] {
  return blocks.flatMap((block) => {
    switch (block.kind) {
      case "paragraph":
      case "heading":
      case "inset":
      case "warning":
        return [block.text];
      case "list":
      case "steps":
        return block.items;
      case "table":
        return [block.caption, ...block.rows.flat()];
      case "details":
        return [block.summary, ...blockText(block.blocks)];
      case "card":
        return [block.title, ...block.rows.flat()];
      case "start":
        return [block.label];
      case "links":
        return block.links.map((link) => link.label);
    }
  });
}

function blockHrefs(blocks: GuideBlock[]): string[] {
  return blocks.flatMap((block) =>
    block.kind === "start"
      ? [block.href]
      : block.kind === "links"
        ? block.links.map((link) => link.href)
        : block.kind === "details"
          ? blockHrefs(block.blocks)
          : []
  );
}

describe("claims guides", () => {
  for (const [scenario, guide] of Object.entries(claimsGuides)) {
    it(`${scenario} belongs to a guide that exists`, () => {
      expect(Object.keys(scenarios)).toContain(scenario);
      expect(guide!.slug).toMatch(/^[a-z]+(-[a-z]+)*$/);
    });

    it(`${scenario} has the same parts and blocks in both languages`, () => {
      const { en, th } = guide!;
      expect(th.parts.map((p) => p.slug)).toEqual(en.parts.map((p) => p.slug));
      en.parts.forEach((part, i) => {
        const other = th.parts[i]!;
        expect(
          other.blocks.map((b) => b.kind),
          part.slug
        ).toEqual(part.blocks.map((b) => b.kind));
        expect(blockHrefs(other.blocks), part.slug).toEqual(blockHrefs(part.blocks));
        const cardRows = (blocks: GuideBlock[]) =>
          blocks.flatMap((b) => (b.kind === "card" ? [b.rows.length] : []));
        expect(cardRows(other.blocks), part.slug).toEqual(cardRows(part.blocks));
      });
      const slugs = en.parts.map((p) => p.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
      for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    });

    it(`${scenario} follows the house style and links to real places`, () => {
      for (const locale of locales) {
        const c = guide![locale];
        expect(c.title).not.toMatch(/:/);
        for (const part of c.parts) {
          expect(part.title).not.toMatch(/:/);
          expect(part.blocks.length).toBeGreaterThan(0);
          for (const text of blockText(part.blocks)) {
            expect(text.trim()).not.toBe("");
            expect(text).not.toMatch(/[–—]/);
          }
          for (const block of part.blocks) {
            if (block.kind === "table") {
              for (const row of block.rows) expect(row.length).toBe(block.rows[0]!.length);
            }
          }
          for (const href of blockHrefs(part.blocks)) {
            expect(href).toMatch(/^(https:\/\/|\/[a-z0-9/._-]*$)/);
            if (/^\/.+\.[a-z0-9]+$/.test(href)) {
              expect(existsSync(join(process.cwd(), "public", href)), href).toBe(true);
            }
          }
        }
      }
    });
  }
});

describe("links into claims guides", () => {
  it("only point at parts that exist", () => {
    const hrefs = Object.values(scenarios).flatMap((scenario) =>
      (["en", "th"] as const).flatMap((locale) =>
        scenario[locale].sections.flatMap((section) => [
          ...(section.actions ?? []).map((action) => action.href),
          ...(section.stepByStep ?? []).flatMap((step) =>
            step.tasks.map((task) => task.href ?? "")
          ),
        ])
      )
    );
    const guideHrefs = Object.values(claimsGuides).flatMap((guide) =>
      guide!.en.parts.flatMap((part) => blockHrefs(part.blocks))
    );
    for (const href of [...hrefs, ...guideHrefs]) {
      const match = href.match(/^\/emergency\/([a-z-]+)\/claims(?:\/([a-z0-9-]+))?$/);
      if (!match) continue;
      const guide = claimsGuides[match[1] as keyof typeof claimsGuides];
      expect(guide, href).toBeDefined();
      if (match[2]) {
        expect(
          guide!.en.parts.slice(1).map((part) => part.slug),
          href
        ).toContain(match[2]);
      }
    }
    expect(hrefs.filter((href) => href.includes("/claims")).length).toBeGreaterThan(0);
  });
});
