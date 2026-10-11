import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Instructor, StudentReview } from "@/content/course-review/types";

type Call = { text: string; values: unknown[] };
const db = vi.hoisted(() => ({
  calls: [] as { text: string; values: unknown[] }[],
  submissionRows: [] as Record<string, unknown>[],
  publishedRows: [] as Record<string, unknown>[],
  fail: false,
}));

vi.mock("@/lib/inventory/db", () => ({
  sql: async (strings: TemplateStringsArray, ...values: unknown[]) => {
    const text = strings.join("?").replace(/\s+/g, " ").trim().toLowerCase();
    db.calls.push({ text, values });
    if (db.fail) throw new Error("connection refused");
    if (text.startsWith("select") && text.includes("from course_review_submissions")) {
      return { rows: db.submissionRows, rowCount: db.submissionRows.length };
    }
    if (text.startsWith("select") && text.includes("from published_course_reviews")) {
      return { rows: db.publishedRows, rowCount: db.publishedRows.length };
    }
    if (text.startsWith("delete from published_course_reviews")) {
      return { rows: [], rowCount: db.publishedRows.length };
    }
    return { rows: [], rowCount: 1 };
  },
}));

import {
  listPublishedReviewCodes,
  listPublishedReviews,
  listPublishedReviewsByCourse,
  mergeReviews,
  publishGroup,
  rowToReview,
  unpublishGroup,
  type ReviewSummary,
} from "@/lib/course-review/published";

const THAME: Instructor = {
  name: { en: "Assoc. Prof. Dr. Charlie Thame", th: "รศ.ดร.ชาร์ลี เทม" },
  profileUrl: "https://polsci.tu.ac.th/en/team/assoc-prof-dr-charles-edward-morgan-thame/",
};
const THAME_KEY = "assoc-prof-dr-charles-edward-morgan-thame";
const LEE: Instructor = {
  name: { en: "Dr. Joseph Lee", th: "ดร.โจเซฟ ลี" },
  profileUrl: "https://polsci.tu.ac.th/en/team/dr-joseph-lee/",
};

function review(overrides: Partial<StudentReview> = {}): StudentReview {
  return {
    reviewCount: 6,
    term: { year: 2567, semester: 1 },
    workload: { en: "Steady.", th: "สม่ำเสมอ" },
    assessmentStyle: { en: "Essays.", th: "เรียงความ" },
    tips: [],
    ...overrides,
  };
}

function publishedRow(overrides: Record<string, unknown> = {}) {
  return {
    course_code: "PI280",
    term_year: 2567,
    term_semester: "1",
    instructor_key: THAME_KEY,
    instructor_name_en: THAME.name.en,
    instructor_name_th: THAME.name.th,
    review_count: 7,
    workload_en: "Steady.",
    workload_th: "สม่ำเสมอ",
    assessment_en: "Essays.",
    assessment_th: "เรียงความ",
    tips: [{ en: "Start early", th: "เริ่มแต่เนิ่น ๆ" }],
    quotes: [],
    band_counts: {},
    published_at: new Date("2026-09-01T00:00:00Z"),
    ...overrides,
  };
}

const KEY = {
  courseCode: "PI280",
  term: { year: 2567, semester: 1 as const },
  instructorKey: THAME_KEY,
};
const SUMMARY: ReviewSummary = {
  workload: { en: "Steady.", th: "สม่ำเสมอ" },
  assessment: { en: "Essays.", th: "เรียงความ" },
  tips: [{ en: "Start early", th: "เริ่มแต่เนิ่น ๆ" }],
  quotes: [],
};

function approved(n: number, band: string | null = null) {
  return Array.from({ length: n }, (_, i) => ({
    id: `00000000-0000-4000-8000-${String(i).padStart(12, "0")}`,
    course_code: "PI280",
    term_year: 2567,
    term_semester: "1",
    instructor_key: THAME_KEY,
    workload: "w",
    workload_band: band,
    assessment: "a",
    tips: [],
    quote: null,
    locale: "en",
    status: "approved",
    moderated_at: null,
    created_at: new Date(),
  }));
}

beforeEach(() => {
  db.calls = [];
  db.submissionRows = [];
  db.publishedRows = [];
  db.fail = false;
  vi.stubEnv("POSTGRES_URL", "postgres://example.invalid/db");
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe("mergeReviews", () => {
  it("shows the repository's reviews when nothing is published", () => {
    const own = review();
    expect(mergeReviews([own], [])).toEqual([own]);
  });

  it("shows published reviews alongside the repository's, newest term first", () => {
    const old = review({ term: { year: 2565, semester: 2 } });
    const middle = review({ term: { year: 2567, semester: 1 }, instructor: THAME });
    const newest = review({ term: { year: 2568, semester: "summer" }, instructor: LEE });
    const merged = mergeReviews([old, middle], [newest]);
    expect(merged).toEqual([newest, middle, old]);
  });

  it("orders semesters within a year newest first", () => {
    const merged = mergeReviews(
      [review({ term: { year: 2567, semester: 1 } })],
      [
        review({ term: { year: 2567, semester: 2 }, instructor: LEE }),
        review({ term: { year: 2567, semester: "summer" }, instructor: THAME }),
      ]
    );
    expect(merged.map((r) => r.term.semester)).toEqual(["summer", 2, 1]);
  });

  it("lets a published review replace a hand-written one for the same term and instructor", () => {
    const handWritten = review({ instructor: THAME, reviewCount: 3 });
    const published = review({ instructor: THAME, reviewCount: 9 });
    expect(mergeReviews([handWritten], [published])).toEqual([published]);
  });

  it("keeps a hand-written review for a different instructor or term", () => {
    const otherInstructor = review({ instructor: LEE });
    const otherTerm = review({ instructor: THAME, term: { year: 2566, semester: 1 } });
    const published = review({ instructor: THAME });
    const merged = mergeReviews([otherInstructor, otherTerm], [published]);
    expect(merged).toHaveLength(3);
  });

  it("treats 'someone else' as its own instructor when deciding what to replace", () => {
    const named = review({ instructor: THAME });
    const elsewhere = review({ instructorElsewhere: true });
    expect(mergeReviews([named], [elsewhere])).toHaveLength(2);
    expect(
      mergeReviews([elsewhere], [review({ instructorElsewhere: true, reviewCount: 8 })])
    ).toHaveLength(1);
  });

  it("does not modify its inputs", () => {
    const own = [review({ term: { year: 2565, semester: 1 } })];
    const published = [review({ term: { year: 2568, semester: 1 }, instructor: LEE })];
    mergeReviews(own, published);
    expect(own).toHaveLength(1);
    expect(published).toHaveLength(1);
  });
});

describe("rowToReview", () => {
  it("rebuilds the StudentReview shape the course page already renders", () => {
    const result = rowToReview(publishedRow() as never, [THAME]);
    expect(result).toEqual({
      reviewCount: 7,
      term: { year: 2567, semester: 1 },
      instructor: THAME,
      workload: { en: "Steady.", th: "สม่ำเสมอ" },
      assessmentStyle: { en: "Essays.", th: "เรียงความ" },
      tips: [{ en: "Start early", th: "เริ่มแต่เนิ่น ๆ" }],
    });
  });

  it("falls back to the name stored at publication when the instructor has left the list", () => {
    const result = rowToReview(publishedRow() as never, [LEE]);
    expect(result.instructor).toEqual({ name: THAME.name });
    expect(result.instructor?.profileUrl).toBeUndefined();
  });

  it("marks 'someone else' without naming anyone", () => {
    const result = rowToReview(
      publishedRow({
        instructor_key: "other",
        instructor_name_en: null,
        instructor_name_th: null,
      }) as never,
      [THAME]
    );
    expect(result.instructor).toBeUndefined();
    expect(result.instructorElsewhere).toBe(true);
  });

  it("carries quotes and the band distribution when there are any", () => {
    const result = rowToReview(
      publishedRow({
        quotes: [{ en: "Fair", th: "ยุติธรรม" }],
        band_counts: { "3_to_6": 5, over_6: 2 },
      }) as never,
      [THAME]
    );
    expect(result.quotes).toEqual([{ text: { en: "Fair", th: "ยุติธรรม" } }]);
    expect(result.workloadBands).toEqual({ "3_to_6": 5, over_6: 2 });
  });

  it("omits the band distribution when nobody gave a band", () => {
    expect(rowToReview(publishedRow() as never, [THAME])).not.toHaveProperty("workloadBands");
  });
});

describe("listPublishedReviews", () => {
  it("returns an empty list without touching the database when it is not configured", async () => {
    vi.stubEnv("POSTGRES_URL", "");
    await expect(listPublishedReviews("PI280", [THAME])).resolves.toEqual([]);
    expect(db.calls).toEqual([]);
  });

  it("returns the course's published reviews", async () => {
    db.publishedRows = [publishedRow()];
    const reviews = await listPublishedReviews("PI280", [THAME]);
    expect(reviews).toHaveLength(1);
    expect(reviews[0]!.instructor).toEqual(THAME);
    const call = db.calls[0] as Call;
    expect(call.values).toEqual(["PI280"]);
  });

  it("returns an empty list when the query fails, so the page still renders", async () => {
    db.fail = true;
    await expect(listPublishedReviews("PI280")).resolves.toEqual([]);
  });
});

describe("listPublishedReviewsByCourse", () => {
  it("returns an empty map without touching the database when it is not configured", async () => {
    vi.stubEnv("POSTGRES_URL", "");
    const byCourse = await listPublishedReviewsByCourse();
    expect(byCourse.size).toBe(0);
    expect(db.calls).toEqual([]);
  });

  it("groups every published review under its course code, in one query", async () => {
    db.publishedRows = [
      publishedRow(),
      publishedRow({ term_year: 2568, band_counts: { over_6: 4 } }),
      publishedRow({ course_code: "PI390" }),
    ];
    const byCourse = await listPublishedReviewsByCourse();
    expect([...byCourse.keys()].sort()).toEqual(["PI280", "PI390"]);
    expect(byCourse.get("PI280")).toHaveLength(2);
    expect(byCourse.get("PI280")![1]!.workloadBands).toEqual({ over_6: 4 });
    expect(db.calls).toHaveLength(1);
  });

  it("returns an empty map when the query fails, so the screen falls back to the repository", async () => {
    db.fail = true;
    expect((await listPublishedReviewsByCourse()).size).toBe(0);
  });
});

describe("listPublishedReviewCodes", () => {
  it("returns an empty list without touching the database when it is not configured", async () => {
    vi.stubEnv("POSTGRES_URL", "");
    await expect(listPublishedReviewCodes()).resolves.toEqual([]);
    expect(db.calls).toEqual([]);
  });

  it("returns the codes of courses with a published review", async () => {
    db.publishedRows = [{ course_code: "PI280" }, { course_code: "PI390" }];
    await expect(listPublishedReviewCodes()).resolves.toEqual(["PI280", "PI390"]);
    expect((db.calls[0] as Call).text).toContain("distinct course_code");
  });

  it("returns an empty list when the query fails, so the catalogue still renders", async () => {
    db.fail = true;
    await expect(listPublishedReviewCodes()).resolves.toEqual([]);
  });
});

describe("publishGroup", () => {
  it("refuses below the threshold and writes nothing", async () => {
    db.submissionRows = approved(4);
    const result = await publishGroup(KEY, SUMMARY, THAME, "officer-1");
    expect(result).toEqual({ ok: false, reason: "below-threshold" });
    expect(db.calls.some((call) => call.text.startsWith("insert"))).toBe(false);
  });

  it("counts only approved submissions towards the threshold", async () => {
    db.submissionRows = [
      ...approved(4),
      { ...approved(1)[0]!, id: "00000000-0000-4000-8000-0000000000ff", status: "pending" },
      { ...approved(1)[0]!, id: "00000000-0000-4000-8000-0000000000fe", status: "rejected" },
    ];
    const result = await publishGroup(KEY, SUMMARY, THAME, "officer-1");
    expect(result).toEqual({ ok: false, reason: "below-threshold" });
  });

  it("publishes at the threshold, taking the count, ids and bands from the database", async () => {
    db.submissionRows = [...approved(3, "3_to_6"), ...approved(2, null)];
    const result = await publishGroup(KEY, SUMMARY, THAME, "officer-1");
    expect(result).toEqual({ ok: true, reviewCount: 5 });
    const insert = db.calls.find((call) =>
      call.text.startsWith("insert into published_course_reviews")
    )!;
    expect(insert.values).toContain(5);
    expect(insert.values).toContain(JSON.stringify({ "3_to_6": 3 }));
    expect(insert.values).toContain("officer-1");
    // The ids are passed as a Postgres array literal.
    expect(
      insert.values.some((value) => typeof value === "string" && value.startsWith('{"0000'))
    ).toBe(true);
    expect(insert.text).toContain("on conflict");
  });

  it("snapshots the instructor's name, and stores none for 'someone else'", async () => {
    db.submissionRows = approved(5);
    await publishGroup(KEY, SUMMARY, THAME, "officer-1");
    const named = db.calls.find((call) => call.text.startsWith("insert"))!;
    expect(named.values).toContain(THAME.name.en);
    expect(named.values).toContain(THAME.name.th);

    db.calls = [];
    await publishGroup({ ...KEY, instructorKey: "other" }, SUMMARY, undefined, "officer-1");
    const other = db.calls.find((call) => call.text.startsWith("insert"))!;
    expect(other.values).not.toContain(THAME.name.en);
    expect(other.values.filter((value) => value === null)).toHaveLength(2);
  });

  it("does nothing without a database", async () => {
    vi.stubEnv("POSTGRES_URL", "");
    await expect(publishGroup(KEY, SUMMARY, THAME, "officer-1")).resolves.toEqual({
      ok: false,
      reason: "not-configured",
    });
    expect(db.calls).toEqual([]);
  });

  it("reports a database failure instead of throwing", async () => {
    db.fail = true;
    await expect(publishGroup(KEY, SUMMARY, THAME, "officer-1")).resolves.toEqual({
      ok: false,
      reason: "error",
    });
  });
});

describe("unpublishGroup", () => {
  it("removes the group's summary and says so", async () => {
    db.publishedRows = [publishedRow()];
    await expect(unpublishGroup(KEY)).resolves.toBe(true);
    expect(db.calls[0]!.text).toContain("delete from published_course_reviews");
  });

  it("returns false without a database or on failure", async () => {
    db.fail = true;
    await expect(unpublishGroup(KEY)).resolves.toBe(false);
    vi.stubEnv("POSTGRES_URL", "");
    db.fail = false;
    db.calls = [];
    await expect(unpublishGroup(KEY)).resolves.toBe(false);
    expect(db.calls).toEqual([]);
  });
});
