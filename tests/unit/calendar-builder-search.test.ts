import { describe, expect, it } from "vitest";
import {
  OTHER_COURSE_LIMIT,
  highlightParts,
  matchesFields,
  queryTokens,
  searchCourses,
} from "@/lib/calendar-builder/courseSearch";

const curriculum = [
  { code: "PI271", title: "Introduction to International Relations" },
  { code: "PI280", title: "Foreign Affairs" },
  { code: "PI300", title: "Not in the timetable" },
  { code: "PI301", title: "Another course" },
];

function codes(query: string, termKey = "2569-2", locale: "en" | "th" = "en") {
  const result = searchCourses({ termKey, query, locale, curriculum, otherLabel: "Other" });
  return result.groups.flatMap((g) => g.options.map((o) => `${g.id}:${o.code}`));
}

describe("matchesFields", () => {
  it("ignores case, spaces and dots, and needs every word", () => {
    expect(matchesFields(["PI271", "Intro"], "")).toBe(true);
    expect(matchesFields(["PI271", "Intro"], "pi 271")).toBe(true);
    expect(matchesFields(["R.102"], "r102")).toBe(true);
    expect(matchesFields(["R.102"], "R 102")).toBe(true);
    expect(matchesFields(["PI271", "Tuesday"], "tue pi2")).toBe(true);
    expect(matchesFields(["PI271", "Tuesday"], "mon pi2")).toBe(false);
  });
  it("lets a lone digit match only a whole word", () => {
    expect(matchesFields(["Year 1"], "year 1")).toBe(true);
    expect(matchesFields(["Year 2 required", "13:00"], "year 1")).toBe(false);
  });
  it("tokenises", () => {
    expect(queryTokens("  Tue  R.102 ")).toEqual(["tue", "r102"]);
    expect(queryTokens("   ")).toEqual([]);
  });
});

describe("searchCourses", () => {
  it("lists every timetable group in order, then the other courses", () => {
    const result = searchCourses({
      termKey: "2569-2",
      query: "",
      locale: "en",
      curriculum,
      otherLabel: "Other",
    });
    expect(result.groups.map((g) => g.id)).toEqual([
      "year1",
      "year2",
      "year3",
      "gov",
      "pa",
      "gpe",
      "area",
      "approaches",
      "other",
    ]);
    expect(result.groups[0]?.label).toBe("Year 1");
    expect(result.groups[1]?.label).toBe("Year 2 required");
    // A timetabled course is not repeated under "other", and LAS101 appears once.
    const other = result.groups.find((g) => g.id === "other");
    expect(other?.options.map((o) => o.code)).toEqual(["PI280", "PI300", "PI301"]);
    expect(result.groups[0]?.options.filter((o) => o.code === "LAS101")).toHaveLength(1);
  });

  it("filters by code across groups, keeping group order", () => {
    expect(codes("pi2")).toEqual([
      "year1:PI211",
      "year1:PI271",
      "year2:PI270",
      "year2:PI272",
      "year2:PI292",
      "other:PI280",
    ]);
    expect(codes("PI 271")).toEqual(["year1:PI271"]);
    expect(codes("  pi271 ")).toEqual(["year1:PI271"]);
  });

  it("filters by title, lecturer, day, room and group name", () => {
    expect(codes("life")).toEqual(["year1:TU102"]);
    expect(codes("goncharoff")).toEqual(["gov:PI382", "gov:PI387", "gpe:PI490"]);
    expect(codes("tue 09")).toEqual(["year1:PI271", "gov:PI384", "pa:PI341", "gpe:PI480"]);
    expect(codes("year 1")).toEqual([
      "year1:TU102",
      "year1:LAS101",
      "year1:PI122",
      "year1:AH208",
      "year1:PI211",
      "year1:PI271",
    ]);
    expect(codes("approaches")).toEqual([
      "approaches:PI478",
      "approaches:PI479",
      "approaches:PI488",
      "approaches:PI489",
    ]);
  });

  it("matches rooms with or without the dot, including both LAS101 sections", () => {
    expect(codes("r.406")).toEqual(codes("R406"));
    expect(codes("r406")).toContain("year1:LAS101");
    expect(codes("r.202")).toEqual(["year2:PI321", "year3:PI320", "gpe:PI480"]);
  });

  it("matches English and Thai day names", () => {
    expect(codes("tue")).toEqual(codes("อังคาร"));
    expect(codes("tuesday")).toEqual(codes("วันอังคาร"));
    expect(codes("พฤหัส", "2569-2", "th")).toContain("year1:TU102");
    expect(codes("พฤหัส")).not.toContain("year1:PI271");
  });

  it("matches nothing for gibberish, and Saturday has no classes", () => {
    expect(codes("zzz")).toEqual([]);
    expect(codes("เสาร์")).toEqual([]);
  });

  it("uses Thai group names in Thai", () => {
    const result = searchCourses({
      termKey: "2569-2",
      query: "ชั้นปีที่ 1",
      locale: "th",
      curriculum,
      otherLabel: "อื่น ๆ",
    });
    expect(result.groups.map((g) => g.label)).toEqual(["ชั้นปีที่ 1"]);
  });

  it("offers only curriculum courses in a term with no timetable", () => {
    expect(codes("", "2569-1")).toEqual([
      "other:PI271",
      "other:PI280",
      "other:PI300",
      "other:PI301",
    ]);
    expect(codes("301", "2569-1")).toEqual(["other:PI301"]);
  });

  it("caps the other courses and reports how many are hidden", () => {
    const many = Array.from({ length: OTHER_COURSE_LIMIT + 7 }, (_, i) => ({
      code: `ZZ${100 + i}`,
      title: "Filler",
    }));
    const result = searchCourses({
      termKey: "2569-1",
      query: "",
      locale: "en",
      curriculum: many,
      otherLabel: "Other",
    });
    expect(result.shown).toBe(OTHER_COURSE_LIMIT);
    expect(result.hidden).toBe(7);
  });
});

describe("highlightParts", () => {
  const text = (parts: { text: string; match: boolean }[]) =>
    parts.map((p) => (p.match ? `[${p.text}]` : p.text)).join("");
  it("marks matched text whatever its case", () => {
    expect(text(highlightParts("PI271 Introduction", "pi2"))).toBe("[PI2]71 Introduction");
    expect(text(highlightParts("PI271 Introduction", "intro 71"))).toBe("PI2[71] [Intro]duction");
  });
  it("sees through dots in rooms and leaves lone digits alone", () => {
    expect(text(highlightParts("R.102", "r102"))).toBe("[R.102]");
    expect(text(highlightParts("Year 1", "year 1"))).toBe("[Year] 1");
  });
  it("returns the text unmarked for a blank query", () => {
    expect(highlightParts("PI271", "  ")).toEqual([{ text: "PI271", match: false }]);
  });
});
