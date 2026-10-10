import { describe, expect, it } from "vitest";
import { courses } from "@/content/course-review/courses";
import type { Course } from "@/content/course-review/types";
import {
  DEFAULT_FILTERS,
  MINOR_IDS,
  filterCourses,
  parseFilters,
  serialiseFilters,
  type CourseFilters,
} from "@/lib/course-review/filter";
import { minorMembers, minorsFor } from "@/lib/course-review/facts";

const withFilters = (patch: Partial<CourseFilters>): CourseFilters => ({
  ...DEFAULT_FILTERS,
  ...patch,
});

const codesOf = (list: Course[]) => list.map((c) => c.code);

function search(query: string): string[] {
  return codesOf(filterCourses(courses, withFilters({ query })));
}

describe("filterCourses", () => {
  it("returns the whole catalogue for the default filters", () => {
    expect(filterCourses(courses, DEFAULT_FILTERS)).toEqual(courses);
  });

  it("treats a blank or punctuation-only query as no query", () => {
    expect(search("   ")).toEqual(codesOf(courses));
    expect(search("...")).toEqual(codesOf(courses));
  });

  it("finds a course by code, ignoring case and spacing", () => {
    expect(search("PI280")).toContain("PI280");
    expect(search("  pi280 ")).toContain("PI280");
    expect(search("pi121")).toContain("PI121");
  });

  it("finds a course by Thai title", () => {
    expect(search("ประวัติศาสตร์การทูต")).toContain("PI270");
    expect(search("ประวัติศาสตร์การทูต")).not.toContain("PI121");
  });

  it("finds a course by English title", () => {
    expect(search("diplomatic history")).toContain("PI270");
  });

  it("finds courses by instructor name in English and Thai", () => {
    const en = search("Thanes");
    const th = search("ธเนศ");
    expect(en).toEqual(expect.arrayContaining(["PI121", "PI122"]));
    expect(th).toEqual(expect.arrayContaining(["PI121", "PI122"]));
    expect(new Set(th)).toEqual(new Set(en));
  });

  it("requires every token to match, in any order", () => {
    expect(search("diplomatic history")).toEqual(search("history diplomatic"));
    expect(search("PI270 Peera")).toEqual(["PI270"]);
    expect(search("PI270 Thanes")).toEqual([]);
    expect(search("diplomatic zzzzqqqq")).toEqual([]);
  });

  it("filters by track", () => {
    const result = filterCourses(courses, withFilters({ track: "foundational" }));
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((c) => c.track === "foundational")).toBe(true);
    expect(result.length).toBe(courses.filter((c) => c.track === "foundational").length);
  });

  it("filters by category", () => {
    const result = filterCourses(courses, withFilters({ category: "general-education" }));
    expect(codesOf(result)).toEqual(["PI121", "PI122"]);
  });

  it("filters by year level", () => {
    const result = filterCourses(courses, withFilters({ year: 3 }));
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((c) => c.yearLevel.includes(3))).toBe(true);
    expect(codesOf(result)).not.toContain("PI121");
  });

  it("keeps only reviewed courses when reviewed is set", () => {
    const result = filterCourses(courses, withFilters({ reviewed: true }));
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((c) => (c.reviews?.length ?? 0) > 0)).toBe(true);
    expect(codesOf(result)).toContain("PI121");
  });

  it("combines filters with AND", () => {
    const result = filterCourses(
      courses,
      withFilters({ track: "foundational", category: "required", year: 2, query: "PI270" })
    );
    expect(codesOf(result)).toEqual(["PI270"]);
    expect(filterCourses(courses, withFilters({ category: "general-education", year: 3 }))).toEqual(
      []
    );
  });

  it("ignores page", () => {
    expect(filterCourses(courses, withFilters({ page: 7 }))).toEqual(courses);
  });

  describe("minor filter", () => {
    const listed = {
      governance: ["PI380", "PI390"],
      publicAdministration: ["PI340"],
      globalPoliticalEconomy: [],
    };

    it("keeps the courses the membership lists for that minor", () => {
      const result = filterCourses(courses, withFilters({ minor: "governance" }), {
        minorMembers: listed,
      });
      expect(codesOf(result)).toEqual(["PI380", "PI390"]);
    });

    it("keeps nothing for a minor with no members, or when no membership is given", () => {
      const gpe = withFilters({ minor: "globalPoliticalEconomy" });
      expect(filterCourses(courses, gpe, { minorMembers: listed })).toEqual([]);
      // A missing table must never read as "every course".
      expect(filterCourses(courses, withFilters({ minor: "governance" }))).toEqual([]);
    });

    it("combines with the other filters", () => {
      const result = filterCourses(courses, withFilters({ minor: "governance", query: "PI390" }), {
        minorMembers: listed,
      });
      expect(codesOf(result)).toEqual(["PI390"]);
    });

    it("matches the course graph's membership for the current curriculum", () => {
      // The page passes the graph's membership, so this is the real filter.
      const members = minorMembers();
      for (const minor of MINOR_IDS) {
        const result = filterCourses(courses, withFilters({ minor }), { minorMembers: members });
        expect(result.length, minor).toBeGreaterThan(0);
        for (const course of result) {
          expect(
            minorsFor(course.code).map((m) => m.id),
            `${course.code} in ${minor}`
          ).toContain(minor);
        }
      }
    });
  });

  describe("with my plan filters", () => {
    const plan = {
      notPassed: (code: string) => code !== "PI121",
      ready: (code: string) => code === "PI270" || code === "PI121",
      short: (code: string) => code === "PI270",
    };

    it("applies each filter through the plan matcher", () => {
      expect(
        codesOf(filterCourses(courses, withFilters({ notPassed: true }), { plan }))
      ).not.toContain("PI121");
      expect(codesOf(filterCourses(courses, withFilters({ ready: true }), { plan }))).toEqual([
        "PI121",
        "PI270",
      ]);
      expect(codesOf(filterCourses(courses, withFilters({ short: true }), { plan }))).toEqual([
        "PI270",
      ]);
    });

    it("combines them", () => {
      const result = filterCourses(courses, withFilters({ notPassed: true, ready: true }), {
        plan,
      });
      expect(codesOf(result)).toEqual(["PI270"]);
    });

    it("does nothing without a plan, so the same URL works for a visitor who has none", () => {
      const on = withFilters({ notPassed: true, ready: true, short: true });
      expect(filterCourses(courses, on)).toEqual(courses);
    });
  });

  it("preserves catalogue order", () => {
    const result = codesOf(filterCourses(courses, withFilters({ year: 2 })));
    expect(result).toEqual([...result].sort());
  });
});

describe("parseFilters and serialiseFilters", () => {
  it("parses empty params to the defaults", () => {
    expect(parseFilters(new URLSearchParams())).toEqual(DEFAULT_FILTERS);
  });

  it("round-trips a fully populated filter set", () => {
    const filters: CourseFilters = {
      query: "diplomatic history",
      track: "governance-transnational",
      category: "minor-elective",
      year: 3,
      minor: "globalPoliticalEconomy",
      reviewed: true,
      notPassed: true,
      ready: true,
      short: true,
      page: 4,
    };
    expect(parseFilters(serialiseFilters(filters))).toEqual(filters);
  });

  it("round-trips each minor through the URL and drops one it does not know", () => {
    for (const minor of MINOR_IDS) {
      const params = serialiseFilters(withFilters({ minor }));
      expect(params.get("minor")).toBe(minor);
      expect(parseFilters(new URLSearchParams(params.toString())).minor).toBe(minor);
    }
    expect(serialiseFilters(withFilters({ minor: "all" })).has("minor")).toBe(false);
    expect(parseFilters(new URLSearchParams("minor=astrology")).minor).toBe("all");
    expect(parseFilters(new URLSearchParams("minor=Governance")).minor).toBe("all");
  });

  it("serialises the plan filters as 1 and reads only 1 back", () => {
    expect(
      serialiseFilters(withFilters({ notPassed: true, ready: true, short: true })).toString()
    ).toBe("notPassed=1&ready=1&short=1");
    const parsed = parseFilters(new URLSearchParams("notPassed=true&ready=0&short=1"));
    expect([parsed.notPassed, parsed.ready, parsed.short]).toEqual([false, false, true]);
  });

  it("round-trips a Thai query", () => {
    const filters = withFilters({ query: "ธเนศ วงศ์ยานนาวา" });
    expect(parseFilters(serialiseFilters(filters))).toEqual(filters);
    expect(parseFilters(new URLSearchParams(serialiseFilters(filters).toString()))).toEqual(
      filters
    );
  });

  it("round-trips the defaults to empty params", () => {
    expect(serialiseFilters(DEFAULT_FILTERS).toString()).toBe("");
  });

  it("omits each default value individually", () => {
    expect(serialiseFilters(withFilters({ track: "all" })).has("track")).toBe(false);
    expect(serialiseFilters(withFilters({ category: "all" })).has("category")).toBe(false);
    expect(serialiseFilters(withFilters({ year: "all" })).has("year")).toBe(false);
    expect(serialiseFilters(withFilters({ reviewed: false })).has("reviewed")).toBe(false);
    expect(serialiseFilters(withFilters({ page: 1 })).has("page")).toBe(false);
    expect(serialiseFilters(withFilters({ query: "" })).has("q")).toBe(false);
  });

  it("writes only what differs from the defaults", () => {
    expect(serialiseFilters(withFilters({ track: "foundational", page: 2 })).toString()).toBe(
      "track=foundational&page=2"
    );
  });

  it("falls back to defaults for invalid params", () => {
    const params = new URLSearchParams({
      track: "nonsense",
      category: "nonsense",
      year: "abc",
      reviewed: "yes",
      page: "-3",
    });
    expect(parseFilters(params)).toEqual(DEFAULT_FILTERS);
  });

  it("rejects zero, fractional and unsafe numbers", () => {
    for (const bad of ["0", "1.5", "-1", "", "99999999999999999999", "1e3", " 2"]) {
      const parsed = parseFilters(new URLSearchParams({ year: bad, page: bad }));
      expect(parsed.year, bad).toBe("all");
      expect(parsed.page, bad).toBe(1);
    }
  });

  it("only treats reviewed=1 as true", () => {
    expect(parseFilters(new URLSearchParams("reviewed=1")).reviewed).toBe(true);
    expect(parseFilters(new URLSearchParams("reviewed=true")).reviewed).toBe(false);
    expect(parseFilters(new URLSearchParams("reviewed=0")).reviewed).toBe(false);
  });

  it("keeps valid params alongside invalid ones", () => {
    const parsed = parseFilters(new URLSearchParams("track=foundational&year=x&page=3"));
    expect(parsed).toEqual(withFilters({ track: "foundational", page: 3 }));
  });
});
