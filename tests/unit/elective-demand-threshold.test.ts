/**
 * When a course page may say students have planned it, and how. The page
 * states a band ("20 or more") for a term that has not ended, and never a
 * number; these tests hold the rule at its edges and check that the read the
 * page uses hands back terms, not counts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  rows: [] as { term_year: number; term_semester: string; students: string | number }[],
  fail: false,
  calls: 0,
}));

vi.mock("@/lib/inventory/db", () => ({
  isInventoryConfigured: () => !!process.env.POSTGRES_URL,
  sql: async () => {
    db.calls += 1;
    if (db.fail) throw new Error("database down");
    return { rows: db.rows, rowCount: db.rows.length };
  },
}));

import { fillTemplate } from "@/components/course-review/constants";
import { buildPlanOutreachCopy } from "@/components/study-plan/planOutreachCopy";
import { listDemandTerms } from "@/lib/elective-demand/store";
import { academicTermLabel } from "@/lib/elective-demand/terms";
import {
  DEMAND_THRESHOLD,
  meetsDemandThreshold,
  publishableTerms,
} from "@/lib/elective-demand/threshold";

/** Semester 1 of academic year 2569, the term the calendar is in. */
const NOW = new Date("2026-10-11T05:00:00Z");

beforeEach(() => {
  vi.stubEnv("POSTGRES_URL", "postgres://example");
  db.rows = [];
  db.fail = false;
  db.calls = 0;
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe("the threshold", () => {
  it("is 20 students", () => {
    expect(DEMAND_THRESHOLD).toBe(20);
  });

  it("is met at 20 and not at 19", () => {
    expect(meetsDemandThreshold(19)).toBe(false);
    expect(meetsDemandThreshold(20)).toBe(true);
    expect(meetsDemandThreshold(21)).toBe(true);
    expect(meetsDemandThreshold(500)).toBe(true);
  });

  it("is never met by nonsense", () => {
    for (const bad of [0, -20, Number.NaN, Number.POSITIVE_INFINITY * -1]) {
      expect(meetsDemandThreshold(bad), String(bad)).toBe(false);
    }
  });
});

describe("publishableTerms", () => {
  const term = (year: number, semester: 1 | 2 | "summer") => ({ year, semester });

  it("keeps the terms at or over the threshold and drops the rest", () => {
    const terms = publishableTerms(
      [
        { term: term(2569, 2), students: 25 },
        { term: term(2570, 1), students: 19 },
        { term: term(2569, "summer"), students: 20 },
      ],
      NOW
    );
    expect(terms).toEqual([term(2569, 2), term(2569, "summer")]);
  });

  it("drops a term that has ended, and keeps the one in progress", () => {
    const terms = publishableTerms(
      [
        { term: term(2568, 2), students: 100 },
        { term: term(2568, "summer"), students: 100 },
        { term: term(2569, 1), students: 20 },
      ],
      NOW
    );
    expect(terms).toEqual([term(2569, 1)]);
  });

  it("lists the earliest term first", () => {
    const terms = publishableTerms(
      [
        { term: term(2570, 1), students: 40 },
        { term: term(2569, 2), students: 40 },
        { term: term(2569, 1), students: 40 },
      ],
      NOW
    );
    expect(terms.map((t) => `${t.year}-${t.semester}`)).toEqual(["2569-1", "2569-2", "2570-1"]);
  });

  it("hands back terms and never a count", () => {
    const terms = publishableTerms([{ term: term(2569, 2), students: 37 }], NOW);
    expect(Object.keys(terms[0]!).sort()).toEqual(["semester", "year"]);
    expect(JSON.stringify(terms)).not.toContain("37");
  });

  it("is empty when nothing qualifies", () => {
    expect(publishableTerms([], NOW)).toEqual([]);
    expect(publishableTerms([{ term: term(2569, 2), students: 3 }], NOW)).toEqual([]);
  });
});

describe("listDemandTerms, the read a course page uses", () => {
  it("returns the qualifying terms only, with no count anywhere in what it returns", async () => {
    db.rows = [
      { term_year: 2569, term_semester: "2", students: "31" },
      { term_year: 2570, term_semester: "1", students: 7 },
      { term_year: 2568, term_semester: "1", students: "90" },
    ];
    const terms = await listDemandTerms("PI364", NOW);
    expect(terms).toEqual([{ year: 2569, semester: 2 }]);
    expect(JSON.stringify(terms)).not.toMatch(/31|students/);
  });

  it("is empty, and does not touch the database, when none is configured", async () => {
    vi.stubEnv("POSTGRES_URL", "");
    await expect(listDemandTerms("PI364", NOW)).resolves.toEqual([]);
    expect(db.calls).toBe(0);
  });

  it("is empty rather than an error when the read fails", async () => {
    db.fail = true;
    await expect(listDemandTerms("PI364", NOW)).resolves.toEqual([]);
  });
});

describe("the line a course page shows", () => {
  const line = (locale: "en" | "th") => {
    const { published } = buildPlanOutreachCopy(locale);
    return fillTemplate(published.template, {
      n: DEMAND_THRESHOLD,
      term: academicTermLabel({ year: 2569, semester: 1 }, locale),
    });
  };

  it("states the band for the term, in English", () => {
    expect(line("en")).toBe("Planned by 20 or more students for Semester 1, 2026/27.");
  });

  it("states it in Thai as Thai", () => {
    expect(line("th")).toBe(
      "มีนักศึกษาวางแผนเรียนวิชานี้ในภาคเรียนที่ 1 ปีการศึกษา 2569 ตั้งแต่ 20 คนขึ้นไป"
    );
  });

  it("explains the band and promises nothing about the course running", () => {
    const note = fillTemplate(buildPlanOutreachCopy("en").published.note, { n: DEMAND_THRESHOLD });
    expect(note).toMatch(/20 or more students/);
    expect(note).toMatch(/never shows the exact number/);
    expect(note).toMatch(/not a promise that the course will run/);
  });
});
