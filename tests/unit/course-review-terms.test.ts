import { describe, expect, it } from "vitest";
import {
  DATED_AFTER_YEARS,
  RECENT_TERM_COUNT,
  currentTerm,
  isDated,
  isRecentTerm,
  parseTermKey,
  recentTerms,
  termKey,
  termYearLabel,
} from "@/lib/course-review/terms";

// Bangkok dates: August to December is semester 1 of the year that starts in
// it, January to May is semester 2 of the year before, June and July is the
// summer session that closes that year (see academicTermAt).
const OCTOBER_2026 = new Date("2026-10-10T05:00:00+07:00"); // 2569 semester 1
const MARCH_2027 = new Date("2027-03-10T05:00:00+07:00"); // 2569 semester 2
const JUNE_2027 = new Date("2027-06-10T05:00:00+07:00"); // 2569 summer

describe("currentTerm", () => {
  it("reads the calendar the way the study plan does", () => {
    expect(currentTerm(OCTOBER_2026)).toEqual({ year: 2569, semester: 1 });
    expect(currentTerm(MARCH_2027)).toEqual({ year: 2569, semester: 2 });
    expect(currentTerm(JUNE_2027)).toEqual({ year: 2569, semester: "summer" });
  });
});

describe("termKey / parseTermKey", () => {
  it("round-trips every semester", () => {
    for (const semester of [1, 2, "summer"] as const) {
      const term = { year: 2567, semester };
      expect(parseTermKey(termKey(term))).toEqual(term);
    }
  });

  it("rejects anything termKey could not have produced", () => {
    for (const bad of ["", "2567", "2567-3", "2567-Summer", "67-1", "2567-1 ", "x-1", "2567-1-2"]) {
      expect(parseTermKey(bad), bad).toBeNull();
    }
  });
});

describe("recentTerms", () => {
  it("offers three academic years of terms, newest first, and not the term in progress", () => {
    const terms = recentTerms(OCTOBER_2026);
    expect(terms).toHaveLength(RECENT_TERM_COUNT);
    expect(RECENT_TERM_COUNT).toBe(9);
    // 2569 semester 1 is in progress, so the newest offered is 2568 summer.
    expect(terms[0]).toEqual({ year: 2568, semester: "summer" });
    expect(terms[1]).toEqual({ year: 2568, semester: 2 });
    expect(terms[2]).toEqual({ year: 2568, semester: 1 });
    expect(terms[8]).toEqual({ year: 2566, semester: 1 });
  });

  it("moves with the calendar", () => {
    expect(recentTerms(MARCH_2027)[0]).toEqual({ year: 2569, semester: 1 });
    expect(recentTerms(JUNE_2027)[0]).toEqual({ year: 2569, semester: 2 });
  });

  it("has no duplicates and never offers a future term", () => {
    const terms = recentTerms(OCTOBER_2026);
    expect(new Set(terms.map(termKey)).size).toBe(terms.length);
    expect(terms.every((term) => term.year <= 2568)).toBe(true);
  });

  it("answers isRecentTerm from the same list", () => {
    expect(isRecentTerm({ year: 2568, semester: 2 }, OCTOBER_2026)).toBe(true);
    expect(isRecentTerm({ year: 2569, semester: 1 }, OCTOBER_2026)).toBe(false);
    expect(isRecentTerm({ year: 2565, semester: 2 }, OCTOBER_2026)).toBe(false);
    expect(isRecentTerm({ year: 2566, semester: 1 }, OCTOBER_2026)).toBe(true);
  });
});

describe("isDated", () => {
  it("marks a review dated only when it is more than three academic years old", () => {
    expect(DATED_AFTER_YEARS).toBe(3);
    // Now is academic year 2569: 2566 is three years ago, 2565 is four.
    expect(isDated({ year: 2569, semester: 1 }, OCTOBER_2026)).toBe(false);
    expect(isDated({ year: 2566, semester: 1 }, OCTOBER_2026)).toBe(false);
    expect(isDated({ year: 2566, semester: 2 }, OCTOBER_2026)).toBe(false);
    expect(isDated({ year: 2565, semester: 2 }, OCTOBER_2026)).toBe(true);
    expect(isDated({ year: 2560, semester: "summer" }, OCTOBER_2026)).toBe(true);
  });

  it("counts academic years, so a whole academic year agrees", () => {
    // 2569 semester 2 and summer fall in 2027 but are still academic year 2569.
    expect(isDated({ year: 2566, semester: 1 }, MARCH_2027)).toBe(false);
    expect(isDated({ year: 2566, semester: 1 }, JUNE_2027)).toBe(false);
    expect(isDated({ year: 2565, semester: 1 }, JUNE_2027)).toBe(true);
  });

  it("never marks a term the form offers as dated", () => {
    for (const now of [OCTOBER_2026, MARCH_2027, JUNE_2027]) {
      for (const term of recentTerms(now)) expect(isDated(term, now), termKey(term)).toBe(false);
    }
  });
});

describe("termYearLabel", () => {
  it("uses the Buddhist Era in Thai and the Gregorian span in English", () => {
    expect(termYearLabel({ year: 2567, semester: 1 }, "th")).toBe("2567");
    expect(termYearLabel({ year: 2567, semester: 1 }, "en")).toBe("2024/25");
    expect(termYearLabel({ year: 2575, semester: 2 }, "en")).toBe("2032/33");
  });
});
