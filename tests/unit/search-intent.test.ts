import { describe, expect, it } from "vitest";
import { exactCourseCode, exactCourseHref, matchIntent } from "@/lib/search/intent";
import { parseFilters } from "@/lib/course-review/filter";
import { suggest } from "@/lib/search/query";
import { allCourseCodes, courseNode } from "@/lib/courses/graph";
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

  it("routes a code written any usual way to the same course", () => {
    for (const query of ["PI380", "pi380", "pi 380", "Pi 380", " PI380 ", "PI-380"]) {
      expect(matchIntent("en", query)?.id, query).toBe("course:PI380");
      expect(matchIntent("en", query)?.action.href, query).toBe(
        "/en/student-life/course-reviews/PI380"
      );
    }
  });

  it("routes a code with no catalogue entry too, since every curriculum code has a page", () => {
    const plain = allCourseCodes().filter((code) => !courseNode(code)?.catalogue);
    expect(plain).toEqual(expect.arrayContaining(["TU104", "LAS101"]));
    for (const code of plain) {
      const bet = matchIntent("th", code.toLowerCase());
      expect(bet?.id, code).toBe(`course:${code}`);
      expect(bet?.action.href, code).toBe(`/th/student-life/course-reviews/${code}`);
      expect(bet?.description.length, code).toBeGreaterThan(0);
    }
  });

  it("keeps the code ahead of an intent rule that its other words would fire", () => {
    expect(matchIntent("en", "PI380 workload")?.id).toBe("course:PI380");
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

describe("exactCourseCode and exactCourseHref", () => {
  it("names the course only when the whole query is a code with a page", () => {
    expect(exactCourseCode("PI380")).toBe("PI380");
    expect(exactCourseCode("pi 380")).toBe("PI380");
    expect(exactCourseCode("pi380")).toBe("PI380");
    expect(exactCourseCode("LAS101")).toBe("LAS101");
  });

  it("names every code that has a page, and only those", () => {
    for (const code of allCourseCodes()) {
      expect(exactCourseCode(code.toLowerCase()), code).toBe(code);
      expect(exactCourseCode(`${code.slice(0, -3)} ${code.slice(-3)}`), code).toBe(code);
    }
  });

  it("does not take over a query that is more than a code", () => {
    expect(exactCourseCode("PI380 workload")).toBeNull();
    expect(exactCourseCode("is PI380 hard")).toBeNull();
    expect(exactCourseCode("PI3800")).toBeNull();
    expect(exactCourseCode("PI")).toBeNull();
    expect(exactCourseCode("")).toBeNull();
  });

  it("does not claim a code no curriculum lists", () => {
    expect(exactCourseCode("ZZ999")).toBeNull();
    expect(exactCourseCode("PI999")).toBeNull();
    expect(exactCourseHref("en", "zz999")).toBeUndefined();
  });

  it("builds the localised course page address", () => {
    expect(exactCourseHref("en", "pi 380")).toBe("/en/student-life/course-reviews/PI380");
    expect(exactCourseHref("th", "TU104")).toBe("/th/student-life/course-reviews/TU104");
  });

  it("leads the typeahead with the course, whether or not the ranked index knows it", () => {
    const pi = suggest("en", "PI380");
    expect(pi[0]?.href).toBe("/en/student-life/course-reviews/PI380");
    expect(pi.filter((s) => s.href === pi[0]?.href).length).toBe(1);
    const las = suggest("en", "las101");
    expect(las[0]?.href).toBe("/en/student-life/course-reviews/LAS101");
    expect(las[0]?.title).toContain("LAS101");
    expect(las.length).toBeLessThanOrEqual(8);
  });
});

describe("the what can I take next intent", () => {
  const english = [
    "what can I take next",
    "What should I take next?",
    "what courses can I take",
    "which courses can I take next term",
    "courses for next semester",
    "what to take next",
  ];
  const thai = [
    "เทอมหน้าเรียนอะไร",
    "เทอมหน้าลงวิชาอะไรดี",
    "ลงทะเบียนวิชาอะไรได้",
    "วิชาที่ลงได้",
    "เรียนอะไรต่อ",
  ];

  it("fires on its English triggers", () => {
    for (const query of english) expect(matchIntent("en", query)?.id, query).toBe("what-next");
  });

  it("fires on its Thai triggers, which are written as Thai rather than translated", () => {
    for (const query of thai) expect(matchIntent("th", query)?.id, query).toBe("what-next");
  });

  it("routes to the catalogue with the plan filters on, and says what they do", () => {
    for (const locale of ["en", "th"] as const) {
      const bet = matchIntent(locale, locale === "en" ? "what can I take next" : "เรียนอะไรต่อ");
      expect(bet?.action.href).toBe(`/${locale}/student-life/course-reviews?notPassed=1&ready=1`);
      expect(bet?.description).toMatch(locale === "en" ? /study plan/ : /แผนการศึกษา/);
      expect(bet?.links.map((link) => link.href)).toContain(`/${locale}/services/study-plan`);
    }
  });

  it("does not take over the broader course and plan intents", () => {
    expect(matchIntent("en", "course reviews")?.id).toBe("course-reviews");
    expect(matchIntent("en", "which course is easy")?.id).toBe("course-reviews");
    expect(matchIntent("en", "how many credits to graduate")?.id).toBe("study-plan");
    expect(matchIntent("th", "หน่วยกิตที่ต้องจบ")?.id).toBe("study-plan");
  });
});

describe("a link built for the intent", () => {
  it("is read by the catalogue's own filter parser", () => {
    const href = matchIntent("en", "what can I take next")!.action.href;
    const parsed = parseFilters(new URL(href, "https://example.test").searchParams);
    expect(parsed.notPassed).toBe(true);
    expect(parsed.ready).toBe(true);
    expect(parsed.short).toBe(false);
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
