import { describe, expect, it } from "vitest";
import { matchIntent } from "@/lib/search/intent";
import { buildExpansions } from "@/lib/search/synonyms";
import { didYouMean } from "@/lib/search/suggest";
import { buildIndex } from "@/lib/search/engine";
import type { SearchDoc } from "@/lib/search/types";

describe("matchIntent", () => {
  it("offers nothing for a query with no clear need behind it", () => {
    expect(matchIntent("en", "x")).toBeUndefined();
    expect(matchIntent("en", "thursday afternoon")).toBeUndefined();
  });

  it("prefers the more specific rule when two could fire", () => {
    expect(matchIntent("en", "start a club")?.id).toBe("start-club");
    expect(matchIntent("en", "clubs")?.id).toBe("clubs");
  });

  it("matches Latin triggers only on word boundaries", () => {
    // "fireworks" contains "fire" but is not an emergency.
    expect(matchIntent("en", "fireworks display")?.id).not.toBe("emergency");
  });

  it("matches Thai triggers inside an unsegmented query", () => {
    expect(matchIntent("th", "ยืมโปรเจคเตอร์")?.id).toBe("borrow-equipment");
    expect(matchIntent("th", "อยากยืมของ")?.id).toBe("borrow-equipment");
  });

  it("routes a course code to that course", () => {
    expect(matchIntent("en", "PI280")?.id).toBe("course:PI280");
    expect(matchIntent("en", "pi 280")?.id).toBe("course:PI280");
  });

  it("ignores a course-code-shaped string that is not a real course", () => {
    expect(matchIntent("en", "zz999")?.id).not.toBe("course:ZZ999");
  });

  it("carries a safety note only where one belongs", () => {
    expect(matchIntent("en", "earthquake")?.note).toBeTruthy();
    expect(matchIntent("en", "borrow a projector")?.note).toBeUndefined();
  });

  it("builds every best bet in both languages", () => {
    for (const query of ["borrow", "graduate", "harassment", "visa", "ชมรม"]) {
      for (const locale of ["en", "th"] as const) {
        const bet = matchIntent(locale, query);
        if (!bet) continue;
        expect(bet.title.length).toBeGreaterThan(0);
        expect(bet.description.length).toBeGreaterThan(0);
        expect(bet.action.href).toMatch(new RegExp(`^/${locale}/|^https?:`));
      }
    }
  });
});

describe("buildExpansions", () => {
  it("expands across languages in both directions", () => {
    expect(buildExpansions("wifi").get("wifi")).toContain("อินเทอร์เน็ต");
    expect(buildExpansions("หอพัก").get("หอพัก")).toContain("dorm");
  });

  it("expands a term found inside an unsegmented Thai query", () => {
    expect(buildExpansions("อยากยืมของ").get("อยากยืมของ")).toContain("borrow");
  });

  it("does not expand multi-word entries into their separate words", () => {
    // "room to rent" belongs to the housing group; letting its word "rent"
    // leak out would pull the equipment loan service into housing queries.
    const alternatives = buildExpansions("dorm").get("dorm") ?? [];
    expect(alternatives).not.toContain("rent");
    expect(alternatives.every((term) => !term.includes(" "))).toBe(true);
  });

  it("returns nothing for a word in no group", () => {
    expect(buildExpansions("thursday").size).toBe(0);
  });
});

describe("didYouMean", () => {
  const index = buildIndex([
    {
      id: "a",
      locale: "en",
      section: "equipment",
      kind: "task",
      href: "/en/a",
      title: "Equipment loan service",
      summary: "Borrow equipment from BIRSA.",
    },
    {
      id: "b",
      locale: "en",
      section: "equipment",
      kind: "guide",
      href: "/en/b",
      title: "Equipment directory",
      summary: "Borrow from a club.",
    },
  ] satisfies SearchDoc[]);

  it("suggests a correction for a word the index has never seen", () => {
    expect(didYouMean(index, "equpment")).toBe("equipment");
  });

  it("stays quiet when the query is already made of real words", () => {
    expect(didYouMean(index, "equipment")).toBeUndefined();
  });

  it("does not guess at very short words", () => {
    expect(didYouMean(index, "zzz")).toBeUndefined();
  });
});
