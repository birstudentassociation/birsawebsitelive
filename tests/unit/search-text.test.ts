import { describe, expect, it } from "vitest";
import {
  bigramSimilarity,
  boundedEditDistance,
  fold,
  foldThaiLoose,
  fuzzyBudget,
  stem,
  tokenize,
  tokenSimilarity,
} from "@/lib/search/text";

describe("fold", () => {
  it("lowercases and strips punctuation", () => {
    expect(fold("Equipment Loan — Service!")).toBe("equipment loan service");
  });

  it("removes Latin accents but keeps Thai vowels and tone marks", () => {
    expect(fold("café")).toBe("cafe");
    expect(fold("หอพัก")).toBe("หอพัก");
    expect(fold("ผ่อนผัน")).toBe("ผ่อนผัน");
  });

  it("maps Thai digits to ASCII", () => {
    expect(fold("ปี ๒๕๖๘")).toBe("ปี 2568");
  });

  it("drops zero-width characters pasted in from other apps", () => {
    expect(fold("wifi​code")).toBe("wificode");
  });
});

describe("foldThaiLoose", () => {
  it("drops tone marks so a mistyped tone still compares equal", () => {
    expect(foldThaiLoose("ผ่อนผัน")).toBe(foldThaiLoose("ผอนผัน"));
  });
});

describe("tokenize", () => {
  it("keeps Thai runs whole and splits Latin words", () => {
    const tokens = tokenize("borrow a projector");
    expect(tokens.map((token) => token.value)).toEqual(["borrow", "projector"]);
  });

  it("marks scripts and splits at script boundaries", () => {
    expect(tokenize("wifiเน็ต").map((token) => [token.value, token.script])).toEqual([
      ["wifi", "latin"],
      ["เน็ต", "thai"],
    ]);
  });

  it("splits letters from digits so a course code is findable both ways", () => {
    expect(tokenize("PI280").map((token) => token.value)).toEqual(["pi", "280"]);
  });

  it("drops single Latin letters but keeps single digits", () => {
    expect(tokenize("a year 1 student").map((token) => token.value)).toEqual([
      "year",
      "1",
      "student",
    ]);
  });

  it("returns nothing for empty or punctuation-only input", () => {
    expect(tokenize("   ---  ")).toEqual([]);
  });
});

describe("stem", () => {
  it("strips common English suffixes conservatively", () => {
    expect(stem("clubs")).toBe("club");
    expect(stem("borrowing")).toBe("borrow");
    expect(stem("policies")).toBe("policy");
  });

  it("leaves short words alone", () => {
    expect(stem("bus")).toBe("bus");
    expect(stem("news")).toBe("news");
  });
});

describe("boundedEditDistance", () => {
  it("measures distance within the budget", () => {
    expect(boundedEditDistance("equipment", "equpment", 2)).toBe(1);
  });

  it("abandons pairs beyond the budget", () => {
    expect(boundedEditDistance("equipment", "projector", 2)).toBeNull();
  });

  it("returns zero for identical strings", () => {
    expect(boundedEditDistance("club", "club", 1)).toBe(0);
  });
});

describe("fuzzyBudget", () => {
  it("gives short words no slack and long words more", () => {
    expect(fuzzyBudget(4)).toBe(0);
    expect(fuzzyBudget(6)).toBe(1);
    expect(fuzzyBudget(9)).toBe(2);
  });
});

describe("bigramSimilarity", () => {
  it("scores identical strings 1 and unrelated strings low", () => {
    expect(bigramSimilarity("หอพัก", "หอพัก")).toBe(1);
    expect(bigramSimilarity("หอพัก", "ปฏิทิน")).toBeLessThan(0.2);
  });
});

describe("tokenSimilarity", () => {
  const latin = (value: string) => ({ value, script: "latin" as const });
  const thai = (value: string) => ({ value, script: "thai" as const });

  it("scores an exact match highest", () => {
    expect(tokenSimilarity(latin("club"), "club")).toBe(1);
  });

  it("ranks exact above prefix above fuzzy", () => {
    const exact = tokenSimilarity(latin("club"), "club");
    const prefix = tokenSimilarity(latin("clu"), "club");
    const fuzzy = tokenSimilarity(latin("equpment"), "equipment");
    expect(exact).toBeGreaterThan(prefix);
    expect(prefix).toBeGreaterThan(fuzzy);
    expect(fuzzy).toBeGreaterThan(0);
  });

  it("matches a Thai fragment inside a compound", () => {
    expect(tokenSimilarity(thai("หอพัก"), "หอพักนักศึกษา")).toBeGreaterThan(0.8);
    expect(tokenSimilarity(thai("ยืมของ"), "ยืม")).toBeGreaterThan(0);
  });

  it("refuses interior matches for very short Thai fragments", () => {
    // Two characters occur inside a large share of Thai words; allowing an
    // interior match there would match most of the corpus.
    expect(tokenSimilarity(thai("ระ"), "กระทรวง")).toBe(0);
  });

  it("does not match unrelated short Latin words", () => {
    expect(tokenSimilarity(latin("bir"), "car")).toBe(0);
  });
});
