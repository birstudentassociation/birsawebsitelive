import { describe, expect, it } from "vitest";
import { buildIndex, search } from "@/lib/search/engine";
import type { SearchDoc } from "@/lib/search/types";

function doc(partial: Partial<SearchDoc> & { id: string; title: string }): SearchDoc {
  return {
    locale: "en",
    section: "page",
    kind: "guide",
    href: `/en/${partial.id}`,
    summary: "",
    ...partial,
  };
}

const corpus: SearchDoc[] = [
  doc({
    id: "loan",
    title: "Equipment loan service",
    summary: "Borrow a projector or a speaker from BIRSA.",
    keywords: ["borrow", "projector", "microphone"],
    section: "equipment",
  }),
  doc({
    id: "news-kit",
    title: "New kit arrives",
    summary: "BIRSA has bought some things.",
    body: "The projector was funded by the activity budget and lives in the BIRSA room.",
    section: "news",
    date: "2020-01-01",
  }),
  doc({
    id: "clubs",
    title: "Clubs",
    summary: "Every BIR club.",
    keywords: ["society"],
    section: "clubs",
  }),
  doc({
    id: "budget",
    title: "Transparency and budget",
    summary: "How BIRSA accounts for money.",
    body: "Budget reports are published each term.",
    section: "activity",
  }),
];

const index = buildIndex(corpus);

describe("search", () => {
  it("returns nothing for an empty query", () => {
    expect(search(index, "   ")).toEqual([]);
  });

  it("ranks a title and keyword match above a body mention", () => {
    const results = search(index, "projector");
    expect(results[0]?.doc.id).toBe("loan");
  });

  it("requires multi-word queries to cover at least half the terms", () => {
    const results = search(index, "borrow projector");
    // "Transparency and budget" shares no term and must not appear at all.
    expect(results.map((result) => result.doc.id)).not.toContain("budget");
    expect(results[0]?.doc.id).toBe("loan");
  });

  it("prefers documents that matched every term", () => {
    const results = search(index, "borrow projector");
    const top = results[0];
    expect(top?.coverage).toBe(1);
  });

  it("tolerates a typo", () => {
    const results = search(index, "projecter");
    expect(results[0]?.doc.id).toBe("loan");
  });

  it("matches a prefix", () => {
    const results = search(index, "equip");
    expect(results[0]?.doc.id).toBe("loan");
  });

  it("boosts an exact title match", () => {
    const results = search(index, "clubs");
    expect(results[0]?.doc.id).toBe("clubs");
    expect(results[0]?.reason).toBe("exact-title");
  });

  it("counts a synonym as another wording of the same term, not an extra term", () => {
    const expansions = new Map([["society", ["club"]]]);
    const results = search(index, "society", { expansions });
    expect(results[0]?.doc.id).toBe("clubs");
    expect(results[0]?.coverage).toBe(1);
  });

  it("applies the limit", () => {
    expect(search(index, "birsa", { limit: 1 })).toHaveLength(1);
  });

  it("favours recent documents over stale ones", () => {
    const dated = buildIndex([
      doc({ id: "old", title: "Registration opens", section: "news", date: "2015-01-01" }),
      doc({ id: "new", title: "Registration opens", section: "news", date: "2026-07-01" }),
    ]);
    const results = search(dated, "registration", { now: new Date("2026-08-01") });
    expect(results[0]?.doc.id).toBe("new");
  });

  it("floats an upcoming event above a past one", () => {
    const events = buildIndex([
      doc({ id: "past", title: "Freshers night", section: "news", date: "2026-01-10" }),
      doc({
        id: "soon",
        title: "Freshers night",
        section: "news",
        date: "2026-08-20",
        upcoming: true,
      }),
    ]);
    const results = search(events, "freshers", { now: new Date("2026-08-01") });
    expect(results[0]?.doc.id).toBe("soon");
  });

  it("lets editorial priority break a tie between similar documents", () => {
    const weighted = buildIndex([
      doc({ id: "plain", title: "Borrow equipment" }),
      doc({ id: "important", title: "Borrow equipment", priority: 0.9 }),
    ]);
    const results = search(weighted, "borrow equipment");
    expect(results[0]?.doc.id).toBe("important");
  });

  it("reports which terms matched, for highlighting", () => {
    const results = search(index, "projector");
    expect(results[0]?.matched).toContain("projector");
  });

  it("builds a snippet from the body around the match", () => {
    const results = search(index, "budget");
    const withSnippet = results.find((result) => result.doc.id === "budget");
    expect(withSnippet?.snippet).toContain("Budget");
  });
});
