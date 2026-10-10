import { describe, expect, it } from "vitest";
import { en } from "@/content/dictionaries/en";
import { th } from "@/content/dictionaries/th";
import * as workload from "@/lib/course-review/workload";
import {
  WORKLOAD_BANDS,
  bandAnswerCount,
  countBands,
  describeBandDistribution,
  isWorkloadBand,
} from "@/lib/course-review/workload";

const enCopy = {
  labels: en.courseReview.collect.bandLabels,
  sentence: en.courseReview.collect.bandSentence,
  sentenceSingle: en.courseReview.collect.bandSentenceSingle,
};
const thCopy = {
  labels: th.courseReview.collect.bandLabels,
  sentence: th.courseReview.collect.bandSentence,
  sentenceSingle: th.courseReview.collect.bandSentenceSingle,
};

describe("countBands", () => {
  it("counts each band and leaves out students who gave none", () => {
    expect(countBands(["3_to_6", "3_to_6", null, "over_6", null])).toEqual({
      "3_to_6": 2,
      over_6: 1,
    });
  });

  it("is empty when nobody gave a band", () => {
    expect(countBands([null, null])).toEqual({});
    expect(countBands([])).toEqual({});
  });
});

describe("bandAnswerCount", () => {
  it("is the number of students who answered, not the number of reviews", () => {
    expect(bandAnswerCount({ under_3: 1, "3_to_6": 8, over_6: 3 })).toBe(12);
    expect(bandAnswerCount({})).toBe(0);
  });
});

describe("describeBandDistribution", () => {
  it("states the distribution in words, lightest band first", () => {
    expect(describeBandDistribution({ over_6: 3, "3_to_6": 8, under_3: 1 }, enCopy)).toEqual([
      "1 of 12 students who gave an estimate said under 3 hours a week.",
      "8 of 12 students who gave an estimate said 3 to 6 hours a week.",
      "3 of 12 students who gave an estimate said over 6 hours a week.",
    ]);
  });

  it("leaves out bands nobody chose", () => {
    expect(describeBandDistribution({ "3_to_6": 5, over_6: 2 }, enCopy)).toEqual([
      "5 of 7 students who gave an estimate said 3 to 6 hours a week.",
      "2 of 7 students who gave an estimate said over 6 hours a week.",
    ]);
  });

  it("does not say '1 of 1 students' when only one student answered", () => {
    expect(describeBandDistribution({ over_6: 1 }, enCopy)).toEqual([
      "One student who gave an estimate said over 6 hours a week.",
    ]);
  });

  it("says nothing when nobody answered", () => {
    expect(describeBandDistribution({}, enCopy)).toEqual([]);
  });

  it("is written in Thai for Thai readers", () => {
    expect(describeBandDistribution({ "3_to_6": 8, over_6: 4 }, thCopy)).toEqual([
      "นักศึกษา 8 จาก 12 คนที่ให้ค่าประมาณไว้ ระบุว่าใช้เวลา 3 ถึง 6 ชั่วโมงต่อสัปดาห์",
      "นักศึกษา 4 จาก 12 คนที่ให้ค่าประมาณไว้ ระบุว่าใช้เวลา มากกว่า 6 ชั่วโมงต่อสัปดาห์",
    ]);
  });

  it("returns only sentences, never a number", () => {
    const lines = describeBandDistribution({ under_3: 4, "3_to_6": 4 }, enCopy);
    expect(lines.every((line) => typeof line === "string")).toBe(true);
  });
});

describe("workload bands are never reduced to one number", () => {
  it("exports no function that averages, scores or ranks bands", () => {
    const exported = Object.keys(workload);
    expect(
      exported.filter((name) => /avg|average|mean|median|score|rating|rank/i.test(name))
    ).toEqual([]);
  });

  it("knows exactly three bands", () => {
    expect([...WORKLOAD_BANDS]).toEqual(["under_3", "3_to_6", "over_6"]);
    expect(isWorkloadBand("3_to_6")).toBe(true);
    expect(isWorkloadBand("4")).toBe(false);
    expect(isWorkloadBand(null)).toBe(false);
  });
});
