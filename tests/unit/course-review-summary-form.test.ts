import { describe, expect, it } from "vitest";
import type { ReviewSummary } from "@/lib/course-review/published";
import {
  SUMMARY_LIMITS,
  SUMMARY_QUOTE_SLOTS,
  SUMMARY_TIP_SLOTS,
  parseSummaryFields,
  summaryFieldNames,
  summaryToFields,
} from "@/lib/course-review/summary-form";

const SUMMARY: ReviewSummary = {
  workload: { en: "A steady load across the term.", th: "ภาระงานสม่ำเสมอตลอดภาคการศึกษา" },
  assessment: { en: "Two essays and a final exam.", th: "เรียงความสองชิ้นและสอบปลายภาค" },
  tips: [
    { en: "Start the essays early", th: "เริ่มเขียนเรียงความแต่เนิ่น ๆ" },
    { en: "Go to office hours", th: "ไปพบอาจารย์ในชั่วโมงให้คำปรึกษา" },
  ],
  quotes: [{ en: "Fair marking.", th: "ให้คะแนนยุติธรรม" }],
};

describe("summaryToFields", () => {
  it("fills every field name, with empty strings for unused slots", () => {
    const fields = summaryToFields(null);
    expect(Object.keys(fields).sort()).toEqual(summaryFieldNames().sort());
    expect(Object.values(fields).every((value) => value === "")).toBe(true);
  });

  it("offers five tip slots and three quote slots", () => {
    expect(SUMMARY_TIP_SLOTS).toBe(5);
    expect(SUMMARY_QUOTE_SLOTS).toBe(3);
  });

  it("round-trips through the parser", () => {
    const result = parseSummaryFields(summaryToFields(SUMMARY));
    expect(result).toEqual({ ok: true, summary: SUMMARY });
  });
});

describe("parseSummaryFields", () => {
  it("trims and skips blank tip and quote slots", () => {
    const fields = summaryToFields(SUMMARY);
    fields.tip4_en = "   ";
    fields.quote2_th = "";
    const result = parseSummaryFields(fields);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.summary.tips).toHaveLength(2);
      expect(result.summary.quotes).toHaveLength(1);
    }
  });

  it("requires both languages for the workload and the assessment", () => {
    const fields = summaryToFields(SUMMARY);
    fields.workload_th = "";
    fields.assessment_en = "";
    expect(parseSummaryFields(fields)).toEqual({
      ok: false,
      errors: { workload_th: "required", assessment_en: "required" },
    });
  });

  it("enforces bilingual parity on tips and quotes", () => {
    const fields = summaryToFields(SUMMARY);
    fields.tip2_th = "";
    fields.quote1_en = "";
    expect(parseSummaryFields(fields)).toEqual({
      ok: false,
      errors: { tip2_th: "pairIncomplete", quote1_en: "pairIncomplete" },
    });
  });

  it("needs at least one tip", () => {
    const fields = summaryToFields({ ...SUMMARY, tips: [] });
    expect(parseSummaryFields(fields)).toEqual({ ok: false, errors: { tip1_en: "noTips" } });
  });

  it("does not ask for a tip when the one that is there has a different problem", () => {
    const fields = summaryToFields({ ...SUMMARY, tips: [] });
    fields.tip1_en = "Only English";
    expect(parseSummaryFields(fields)).toEqual({
      ok: false,
      errors: { tip1_th: "pairIncomplete" },
    });
  });

  it("enforces length limits", () => {
    const fields = summaryToFields(SUMMARY);
    fields.workload_en = "short";
    fields.assessment_th = "ก".repeat(SUMMARY_LIMITS.text + 1);
    fields.tip1_en = "t".repeat(SUMMARY_LIMITS.tip + 1);
    fields.quote1_th = "q".repeat(SUMMARY_LIMITS.quote + 1);
    expect(parseSummaryFields(fields)).toEqual({
      ok: false,
      errors: {
        workload_en: "tooShort",
        assessment_th: "tooLong",
        tip1_en: "tooLong",
        quote1_th: "tooLong",
      },
    });
  });

  it("stops anything that looks like an email address, phone number or student ID being published", () => {
    const fields = summaryToFields(SUMMARY);
    fields.workload_en = "Questions to someone@example.com about the reading.";
    fields.tip1_th = "โทร 081-234-5678 ถามได้";
    fields.quote1_en = "ID 6412345678 said so";
    expect(parseSummaryFields(fields)).toEqual({
      ok: false,
      errors: { workload_en: "identifying", tip1_th: "identifying", quote1_en: "identifying" },
    });
  });

  it("treats a missing field like an empty one", () => {
    expect(parseSummaryFields({}).ok).toBe(false);
  });
});
