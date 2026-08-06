/**
 * Integration tests over the real site corpus.
 *
 * These are the queries the search has to get right. They are deliberately
 * written against real content, so if a page is renamed or a keyword list is
 * edited badly, the test that breaks tells an editor which reader need has
 * stopped working.
 */
import { describe, expect, it } from "vitest";
import { getIndex, runSearch } from "@/lib/search/query";
import { sectionOrder } from "@/lib/search/sections";

function topIds(query: string, locale: "en" | "th" = "en", count = 3): string[] {
  return runSearch(locale, query, { limit: count })
    .results.slice(0, count)
    .map((result) => result.doc.id);
}

describe("runSearch: query handling", () => {
  it("does not run for an empty or one-character query", () => {
    expect(runSearch("en", "").ran).toBe(false);
    expect(runSearch("en", "a").ran).toBe(false);
    expect(runSearch("th", "  ").ran).toBe(false);
  });

  it("still offers popular searches when it has not run", () => {
    const response = runSearch("en", "");
    expect(response.popular.length).toBeGreaterThan(0);
    expect(response.results).toEqual([]);
  });

  it("runs but finds nothing for gibberish, without throwing", () => {
    const response = runSearch("en", "asdfghjkl");
    expect(response.ran).toBe(true);
    expect(response.total).toBe(0);
    expect(response.popular.length).toBeGreaterThan(0);
  });

  it("respects the limit", () => {
    expect(runSearch("en", "club", { limit: 2 }).results).toHaveLength(2);
  });
});

describe("runSearch: the queries that must work", () => {
  it("sends 'borrow projector' to the equipment loan service", () => {
    const response = runSearch("en", "borrow projector");
    expect(response.results[0]?.doc.id).toBe("page:equipment-loan");
    expect(response.bestBet?.id).toBe("borrow-equipment");
  });

  it("understands a natural Thai sentence with no word boundaries", () => {
    // "I want to borrow something". The old substring search found nothing
    // for this, because no page contains that exact string.
    const response = runSearch("th", "อยากยืมของ");
    expect(response.results[0]?.doc.id).toBe("page:equipment-loan");
  });

  it("finds an English page from a Thai query and the reverse", () => {
    expect(topIds("ยืมอุปกรณ์", "en")).toContain("page:equipment-loan");
    expect(topIds("borrow equipment", "th")).toContain("page:equipment-loan");
  });

  it("tolerates a misspelling", () => {
    expect(topIds("equpment", "en", 2)).toContain("page:equipment-loan");
  });

  it("matches a partial word", () => {
    expect(topIds("equip", "en")).toContain("page:equipment-loan");
    expect(topIds("intern", "en")).toContain("answer:internship-check");
  });

  it("sends a course code straight to that course", () => {
    const response = runSearch("en", "PI280");
    expect(response.results[0]?.doc.id).toBe("course:PI280");
    expect(response.bestBet?.action.href).toContain("/student-life/course-reviews/PI280");
  });

  it("answers 'ผ่อนผันทหาร' with university services", () => {
    expect(runSearch("th", "ผ่อนผันทหาร").results[0]?.doc.id).toBe("page:university-services");
  });

  it("finds the regulations from a plain-language rule question", () => {
    expect(topIds("แต่งกาย", "th")).toContain("page:regulations");
    expect(topIds("dress code", "en")).toContain("page:regulations");
  });

  it("surfaces safety content for the one word someone would type", () => {
    const response = runSearch("en", "fire");
    expect(response.results.some((result) => result.doc.section === "emergency")).toBe(true);
    expect(response.bestBet?.id).toBe("emergency");
    expect(response.bestBet?.note).toBeTruthy();
  });

  it("finds a club by name and the clubs index by category", () => {
    expect(topIds("ชมรม", "th")).toContain("page:clubs");
  });

  it("finds a committee role rather than a person's name alone", () => {
    const response = runSearch("en", "treasurer");
    expect(response.results.length).toBeGreaterThan(0);
    expect(response.results[0]?.doc.href).toContain("/activity/roles");
  });
});

describe("runSearch: filtering and facets", () => {
  it("reports facets in the site's own section order", () => {
    const response = runSearch("en", "club");
    expect(response.facets.length).toBeGreaterThan(0);
    const positions = response.facets.map((facet) => sectionOrder.indexOf(facet.key));
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  it("filters to one section without changing the reported total", () => {
    const all = runSearch("en", "club");
    const filtered = runSearch("en", "club", { section: "clubs" });
    expect(filtered.total).toBe(all.total);
    expect(filtered.results.every((result) => result.doc.section === "clubs")).toBe(true);
    expect(filtered.section).toBe("clubs");
  });

  it("counts every result in exactly one facet", () => {
    const response = runSearch("en", "club", { limit: 500 });
    const counted = response.facets.reduce((sum, facet) => sum + facet.count, 0);
    expect(counted).toBe(response.total);
  });
});

describe("the index", () => {
  it("never exposes officer-only or wizard-step pages", () => {
    for (const locale of ["en", "th"] as const) {
      for (const indexed of getIndex(locale).docs) {
        expect(indexed.doc.href).not.toContain("/officer/");
        // `/answers/[topic]/q` is a state inside a journey, not a destination.
        expect(indexed.doc.href).not.toMatch(/\/answers\/[^/]+\/q$/);
      }
    }
  });

  it("gives every document a locale-prefixed or absolute href", () => {
    for (const locale of ["en", "th"] as const) {
      for (const indexed of getIndex(locale).docs) {
        const href = indexed.doc.href;
        const internal = href.startsWith(`/${locale}`);
        const external = /^(https?:|mailto:)/.test(href);
        expect(internal || external, `${indexed.doc.id} -> ${href}`).toBe(true);
      }
    }
  });

  it("indexes both locales at a comparable size", () => {
    const en = getIndex("en").docs.length;
    const th = getIndex("th").docs.length;
    expect(en).toBeGreaterThan(200);
    expect(Math.abs(en - th)).toBeLessThan(en * 0.15);
  });

  it("has no duplicate document ids", () => {
    for (const locale of ["en", "th"] as const) {
      const ids = getIndex(locale).docs.map((indexed) => indexed.doc.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});
