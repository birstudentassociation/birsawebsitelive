import { describe, expect, it } from "vitest";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import type { StudentReview, WorkloadBandCounts } from "@/content/course-review/types";
import { getDictionary } from "@/lib/i18n";
import {
  MIN_BAND_ANSWERS,
  digestReviews,
  latestBandReport,
  realReviews,
  reviewLine,
  type ReviewLineCopy,
} from "@/lib/course-review/reviewSummary";
import { checkPlan } from "@/lib/study-plan/findings";
import type { StudyPlan } from "@/lib/study-plan/plan";
import {
  WORKLOAD_COPY,
  WORKLOAD_TOP_BAND_TERM_COUNT,
  catalogueReviews,
  stacksWorkload,
  termWorkloadProfile,
  workloadLine,
  type ReviewLookup,
} from "@/lib/study-plan/workloadProfile";
import { buildTermInsightCopy } from "@/components/study-plan/termInsightCopy";

/** A review for a term with just the fields the workload code reads. */
function review(
  year: number,
  semester: 1 | 2 | "summer",
  workloadBands: WorkloadBandCounts | undefined,
  extra: Partial<StudentReview> = {}
): StudentReview {
  return {
    reviewCount: 8,
    term: { year, semester },
    workload: { en: "w", th: "w" },
    assessmentStyle: { en: "a", th: "a" },
    tips: [],
    workloadBands,
    ...extra,
  };
}

const lookupOf =
  (byCode: Record<string, StudentReview[]>): ReviewLookup =>
  (code) =>
    byCode[code] ?? [];

describe("latestBandReport", () => {
  it("takes the most recent term that has enough answers", () => {
    const report = latestBandReport([
      review(2566, 1, { over_6: 9 }),
      review(2568, 1, { "3_to_6": 5, over_6: 1 }),
    ]);
    expect(report?.term).toEqual({ year: 2568, semester: 1 });
    expect(report?.counts).toEqual({ "3_to_6": 5, over_6: 1 });
    expect(report?.answers).toBe(6);
  });

  it("never mixes terms: an older term is ignored once a newer one qualifies", () => {
    const report = latestBandReport([
      review(2567, 2, { under_3: 10 }),
      review(2568, 2, { over_6: 4 }),
    ]);
    expect(report?.counts).toEqual({ over_6: 4 });
  });

  it("sums the summaries of one term, one per instructor", () => {
    const report = latestBandReport([
      review(2568, 1, { over_6: 2 }),
      review(2568, 1, { over_6: 3, under_3: 1 }),
    ]);
    expect(report?.counts).toEqual({ over_6: 5, under_3: 1 });
    expect(report?.answers).toBe(6);
  });

  it("skips a newer term with too few answers and falls back to the one before", () => {
    const thin = MIN_BAND_ANSWERS - 1;
    const report = latestBandReport([
      review(2567, 1, { over_6: 4 }),
      review(2568, 1, { over_6: thin }),
    ]);
    expect(report?.term).toEqual({ year: 2567, semester: 1 });
  });

  it("is null with no estimate, too few, or only sample reviews", () => {
    expect(latestBandReport([])).toBeNull();
    expect(latestBandReport([review(2568, 1, undefined)])).toBeNull();
    expect(latestBandReport([review(2568, 1, { over_6: MIN_BAND_ANSWERS - 1 })])).toBeNull();
    expect(latestBandReport([review(2568, 1, { over_6: 9 }, { sample: true })])).toBeNull();
  });

  it("counts exactly the minimum number of answers", () => {
    expect(latestBandReport([review(2568, 1, { over_6: MIN_BAND_ANSWERS })])).not.toBeNull();
  });
});

describe("termWorkloadProfile", () => {
  const lookup = lookupOf({
    A: [review(2568, 1, { over_6: 6, "3_to_6": 2 })],
    B: [review(2568, 1, { over_6: 4, "3_to_6": 4 })],
    C: [review(2568, 1, { under_3: 5 })],
    D: [review(2568, 1, { over_6: 9 }, { sample: true })],
  });

  it("counts a course as mostly in the top band only when more than half chose it", () => {
    const profile = termWorkloadProfile(["A", "B", "C"], lookup);
    expect(profile.topBand.map((e) => e.code)).toEqual(["A"]);
    // Exactly half (4 of 8) is not most.
    expect(profile.reported.find((e) => e.code === "B")?.mostlyTop).toBe(false);
    expect(profile.reported.map((e) => e.code)).toEqual(["A", "B", "C"]);
  });

  it("names the courses with nothing on record and never assumes them, samples included", () => {
    const profile = termWorkloadProfile(["A", "D", "E"], lookup);
    expect(profile.unreported).toEqual(["D", "E"]);
    expect(profile.courseCount).toBe(3);
  });

  it("reads the repository's reviews by default, which hold no workload band today", () => {
    expect(termWorkloadProfile(["PI280", "PI390", "PI364"]).reported).toEqual([]);
    expect(catalogueReviews("PI121").every((r) => r.sample)).toBe(true);
  });

  it("stacks only at the threshold", () => {
    const two = termWorkloadProfile(
      ["A", "A2"],
      lookupOf({ A: lookup("A") as StudentReview[], A2: lookup("A") as StudentReview[] })
    );
    expect(WORKLOAD_TOP_BAND_TERM_COUNT).toBe(2);
    expect(stacksWorkload(two)).toBe(true);
    expect(stacksWorkload(termWorkloadProfile(["A", "C"], lookup))).toBe(false);
  });
});

describe("workloadLine", () => {
  // 14 student reports across two courses, both for semester 1 of 2568 (2025/26).
  const lookup = lookupOf({
    PI280: [review(2568, 1, { over_6: 6, "3_to_6": 1 })],
    PI390: [review(2568, 1, { over_6: 6, "3_to_6": 1 })],
    PI364: [review(2568, 1, { under_3: 5 })],
  });

  it("states how many courses, which, how many reports and which term", () => {
    const line = workloadLine(
      termWorkloadProfile(["PI280", "PI390"], lookup),
      "en",
      WORKLOAD_COPY.en
    );
    expect(line).toBe(
      "Two courses in this term are reported as over 6 hours a week by most of the students who gave an estimate (PI280, PI390). This rests on 14 student reports for semester 1, 2025/26."
    );
  });

  it("says One for a single course", () => {
    const line = workloadLine(
      termWorkloadProfile(["PI280", "PI364"], lookup),
      "en",
      WORKLOAD_COPY.en
    );
    expect(line).toContain("One course in this term is reported as over 6 hours a week");
    expect(line).toContain("(PI280)");
    // The count and term it rests on are those of the course named, not of the whole term.
    expect(line).toContain("7 student reports for semester 1, 2025/26");
  });

  it("names the courses with no estimate on record", () => {
    const line = workloadLine(
      termWorkloadProfile(["PI280", "PI211"], lookup),
      "en",
      WORKLOAD_COPY.en
    );
    expect(line).toContain("No workload estimates are on record for PI211.");
  });

  it("says so when estimates exist but none is mostly in the top band, with the count and term", () => {
    const line = workloadLine(termWorkloadProfile(["PI364"], lookup), "en", WORKLOAD_COPY.en);
    expect(line).toBe(
      "Workload estimates are on record for 1 of 1 courses, and for none of them do most students say over 6 hours a week. This rests on 5 student reports for semester 1, 2025/26."
    );
  });

  it("cites every term when the courses were reported for different ones", () => {
    const mixed = lookupOf({
      A: [review(2567, 2, { over_6: 5 })],
      B: [review(2568, 1, { over_6: 5 })],
    });
    const line = workloadLine(termWorkloadProfile(["A", "B"], mixed), "en", WORKLOAD_COPY.en);
    expect(line).toContain("semester 2, 2024/25 and semester 1, 2025/26");
    expect(line).toContain("10 student reports");
  });

  it("is silent for a term with nothing on record", () => {
    expect(workloadLine(termWorkloadProfile(["PI211"], lookup), "en", WORKLOAD_COPY.en)).toBeNull();
    expect(workloadLine(termWorkloadProfile([], lookup), "th", WORKLOAD_COPY.th)).toBeNull();
  });

  it("reads as Thai, with the Buddhist Era year and no leftover token or full stop", () => {
    const line = workloadLine(
      termWorkloadProfile(["PI280", "PI390", "PI211"], lookup),
      "th",
      WORKLOAD_COPY.th
    )!;
    expect(line).toMatch(/[฀-๿]/);
    expect(line).toContain("ภาคเรียนที่ 1 ปีการศึกษา 2568");
    expect(line).toContain("14 คน");
    expect(line).toContain("PI280, PI390");
    expect(line).not.toMatch(/\{\w+\}/);
    expect(line).not.toMatch(/\.$/);
  });

  it("never averages, scores or ranks", () => {
    const line = workloadLine(
      termWorkloadProfile(["PI280", "PI390", "PI364"], lookup),
      "en",
      WORKLOAD_COPY.en
    )!;
    expect(line).not.toMatch(/average|mean|score|rating|rank|difficult/i);
    expect(line).not.toMatch(/\d\.\d/);
  });

  it("words the top band as the course page does, in both languages", () => {
    for (const locale of ["en", "th"] as const) {
      const bandLabels = getDictionary(locale).courseReview.collect.bandLabels;
      expect(WORKLOAD_COPY[locale].topBandLabel).toBe(bandLabels.over_6);
    }
  });
});

describe("the workloadLoad finding", () => {
  const version = CURRICULUM_VERSIONS["2564-rev2566"];
  const plan: StudyPlan = {
    versionId: "2564-rev2566",
    cohort: "66",
    startYear: 2566,
    minorId: "governance",
    passed: ["PI271"],
    freeElectiveCreditsPassed: 0,
    terms: [
      {
        term: { year: 3, kind: "semester1" },
        codes: ["PI364", "PI390", "PI211"],
        freeElectiveCredits: 0,
      },
      { term: { year: 3, kind: "semester2" }, codes: ["PI364"], freeElectiveCredits: 0 },
    ],
  };
  const heavy = (n: number) => [review(2568, 1, { over_6: n, "3_to_6": 1 })];
  const workload = (reviews: ReviewLookup) =>
    checkPlan(version, plan, { reviews }).filter((f) => f.id.startsWith("workloadLoad:"));

  it("notes a term where two courses are mostly reported in the top band", () => {
    const [finding, ...rest] = workload(lookupOf({ PI364: heavy(6), PI390: heavy(5) }));
    expect(rest).toEqual([]);
    expect(finding?.id).toBe("workloadLoad:3-semester1");
    expect(finding?.severity).toBe("note");
    expect(finding?.message.en).toContain("2 courses");
    expect(finding?.message.en).toContain("over 6 hours a week (PI364, PI390)");
    expect(finding?.message.en).toContain("from 13 student reports for semester 1, 2025/26");
    expect(finding?.message.en).toContain(
      "No workload estimates are on record for PI211, so there may be more"
    );
    expect(finding?.message.en).toContain("only a note");
    expect(finding?.message.th).toContain("ปีการศึกษา 2568");
    expect(finding?.message.th).not.toMatch(/\{\w+\}/);
  });

  it("always cites the review term and count the note rests on, and documents the rule", () => {
    const [finding] = workload(lookupOf({ PI364: heavy(6), PI390: heavy(5) }));
    expect(finding?.source.document).toBe("Student course reviews, workload estimates");
    expect(finding?.source.provision).toContain("semester 1, 2025/26");
    expect(finding?.source.provision).toContain(`at least ${WORKLOAD_TOP_BAND_TERM_COUNT} courses`);
    expect(finding?.source.provision).toContain("sample reviews excluded");
  });

  it("is quiet with one such course, and in a term where only one course has estimates", () => {
    expect(workload(lookupOf({ PI364: heavy(6) }))).toEqual([]);
    expect(
      workload(lookupOf({ PI364: heavy(6), PI390: [review(2568, 1, { under_3: 6 })] }))
    ).toEqual([]);
  });

  it("is quiet when the two courses' answers are too few to repeat", () => {
    const thin = [review(2568, 1, { over_6: MIN_BAND_ANSWERS - 1 })];
    expect(workload(lookupOf({ PI364: thin, PI390: thin }))).toEqual([]);
  });

  it("ignores sample reviews", () => {
    const sample = [review(2568, 1, { over_6: 9 }, { sample: true })];
    expect(workload(lookupOf({ PI364: sample, PI390: sample }))).toEqual([]);
  });

  it("is quiet by default, because the repository holds no workload band yet", () => {
    expect(checkPlan(version, plan).filter((f) => f.id.startsWith("workloadLoad:"))).toEqual([]);
  });

  it("never blocks: it is a note, not a problem", () => {
    for (const finding of workload(lookupOf({ PI364: heavy(6), PI390: heavy(5) }))) {
      expect(finding.severity).toBe("note");
    }
  });
});

describe("the review line a list carries", () => {
  const collect = getDictionary("en").courseReview.collect;
  const copy: ReviewLineCopy = {
    ...buildTermInsightCopy("en").reviewLine,
    band: {
      labels: collect.bandLabels,
      sentence: collect.bandSentence,
      sentenceSingle: collect.bandSentenceSingle,
    },
  };
  const termLabel = (term: { year: number }) => `term ${term.year}`;

  it("says plainly when there is no real review, sample reviews included", () => {
    expect(reviewLine(digestReviews([]), copy, termLabel)).toBe("No student reviews yet.");
    expect(
      reviewLine(digestReviews([review(2568, 1, { over_6: 9 }, { sample: true })]), copy, termLabel)
    ).toBe("No student reviews yet.");
    expect(realReviews([review(2568, 1, {}, { sample: true })])).toEqual([]);
  });

  it("describes the band distribution in words for a named term, never as one number", () => {
    const line = reviewLine(
      digestReviews([review(2568, 1, { "3_to_6": 8, over_6: 4 })]),
      copy,
      termLabel
    );
    expect(line).toContain("Student reviews on record, latest for term 2568.");
    expect(line).toContain("8 of 12 students who gave an estimate said 3 to 6 hours a week.");
    expect(line).toContain("4 of 12 students who gave an estimate said over 6 hours a week.");
    expect(line).not.toMatch(/average|score|rating/i);
  });

  it("says reviews exist but no hours estimate where they carry no usable band", () => {
    const line = reviewLine(digestReviews([review(2568, 1, undefined)]), copy, termLabel);
    expect(line).toContain("Student reviews on record");
    expect(line).toContain("No workload estimates in hours yet.");
  });
});
