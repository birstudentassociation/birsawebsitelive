import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  answersQuery,
  assessClaims,
  nextQuestion,
  parseAnswers,
  questionOptions,
  questionSequence,
  type QuestionId,
} from "@/lib/claims-check";
import { checkerCopy } from "@/content/emergency/claims/checker";
import { claimsGuides } from "@/content/emergency/claims";
import { scenarios } from "@/content/emergency/scenarios";
import type { GuideBlock } from "@/content/emergency/types";

const locales = ["en", "th"] as const;

describe("claims checker logic", () => {
  it("starts with where the home is", () => {
    expect(nextQuestion(parseAnswers({}))).toBe("home");
  });

  it("asks Bangkok homes about damage and costs, and others not", () => {
    expect(questionSequence({ home: "bangkok" })).toEqual([
      "home",
      "flood",
      "tenure",
      "damage",
      "costs",
      "id",
    ]);
    expect(questionSequence({ home: "elsewhere" })).toEqual(["home", "flood", "tenure", "id"]);
    expect(questionSequence({ home: "no" })).toEqual(["home"]);
  });

  it("drops invalid values and answers to questions not yet reached", () => {
    expect(parseAnswers({ home: "mars", flood: "over7" })).toEqual({});
    expect(parseAnswers({ home: "bangkok", tenure: "rent" })).toEqual({ home: "bangkok" });
    expect(
      parseAnswers({ home: "elsewhere", flood: "over7", tenure: "rent", damage: "whole" })
    ).toEqual({ home: "elsewhere", flood: "over7", tenure: "rent" });
  });

  it("takes several costs, dropping none when something else is chosen", () => {
    const base = { home: "bangkok", flood: "over7", tenure: "rent", damage: "part" };
    expect(parseAnswers({ ...base, costs: ["stay", "none", "stay"] }).costs).toEqual(["stay"]);
    expect(parseAnswers({ ...base, costs: "none" }).costs).toEqual(["none"]);
  });

  it("round trips through the query string", () => {
    const query = {
      home: "bangkok",
      flood: "damaged",
      tenure: "owner",
      damage: "whole",
      costs: ["tools", "injury"],
      id: "thai",
    };
    const answers = parseAnswers(query);
    expect(nextQuestion(answers)).toBeNull();
    const params = new URLSearchParams(answersQuery(answers).slice(1));
    expect(
      parseAnswers(Object.fromEntries([...params.keys()].map((k) => [k, params.getAll(k)])))
    ).toEqual(answers);
    expect(answersQuery(answers, "damage")).toBe("?home=bangkok&flood=damaged&tenure=owner");
  });

  it("gives an owner in Bangkok with a damaged home repairs, living costs and the 9,000 baht", () => {
    const result = assessClaims({
      home: "bangkok",
      flood: "over7",
      tenure: "owner",
      damage: "whole",
      costs: ["stay"],
      id: "thai",
    });
    expect(result.government).toEqual(["government"]);
    expect(result.bma).toEqual(["repairs", "stayWhole", "livingWhole"]);
    expect(result.notes).toContain("bmaDeadline");
    expect(result.notes).toContain("bangkokArea");
  });

  it("never gives a tenant repairs, and says the 9,000 baht is paid to them", () => {
    const result = assessClaims({
      home: "bangkok",
      flood: "over7",
      tenure: "rent",
      damage: "part",
      costs: ["none"],
      id: "other",
    });
    expect(result.bma).toEqual(["livingPart"]);
    expect(result.notes).toEqual(
      expect.arrayContaining(["tenantPaid", "repairsLandlord", "notThai"])
    );
  });

  it("gives nothing from the government for a brief flood with no damage", () => {
    const result = assessClaims({
      home: "bangkok",
      flood: "brief",
      tenure: "rent",
      damage: "none",
      costs: ["none"],
      id: "thai",
    });
    expect(result.government).toEqual([]);
    expect(result.bma).toEqual([]);
    expect(result.notes).toEqual(["waterCameIn"]);
  });

  it("only offers the government payment outside Bangkok", () => {
    const result = assessClaims({
      home: "elsewhere",
      flood: "cutoff",
      tenure: "other",
      id: "thai",
    });
    expect(result.government).toEqual(["government"]);
    expect(result.bma).toEqual([]);
    expect(result.notes).toEqual(["household", "outsideBangkok"]);
  });

  it("explains when the usual home was not flooded", () => {
    expect(assessClaims({ home: "no" }).notes).toEqual(["notYourHome"]);
  });
});

describe("claims checker copy", () => {
  it.each(locales)("%s has every question and option", (locale) => {
    const t = checkerCopy[locale];
    for (const question of Object.keys(questionOptions) as QuestionId[]) {
      expect(t.questions[question].question.trim()).not.toBe("");
      expect(t.questions[question].error.trim()).not.toBe("");
      expect(Object.keys(t.questions[question].options).sort()).toEqual(
        [...questionOptions[question]].sort()
      );
    }
  });
});

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
      if (match[2] && match[2] !== "check") {
        expect(
          guide!.en.parts.slice(1).map((part) => part.slug),
          href
        ).toContain(match[2]);
      }
    }
    expect(hrefs.filter((href) => href.includes("/claims")).length).toBeGreaterThan(0);
  });
});
