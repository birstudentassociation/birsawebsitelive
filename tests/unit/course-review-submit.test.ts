import { describe, expect, it } from "vitest";
import type { Instructor } from "@/content/course-review/types";
import { validateReview, type RawReviewForm } from "@/lib/course-review/submit";
import { recentTerms, termKey } from "@/lib/course-review/terms";
import { COURSE_REVIEW_LIMITS, looksIdentifying } from "@/lib/validation";

const NOW = new Date("2026-10-10T05:00:00+07:00");
const THAME: Instructor = {
  name: { en: "Assoc. Prof. Dr. Charlie Thame", th: "รศ.ดร.ชาร์ลี เทม" },
  profileUrl: "https://polsci.tu.ac.th/en/team/assoc-prof-dr-charles-edward-morgan-thame/",
};
const THAME_KEY = "assoc-prof-dr-charles-edward-morgan-thame";
const COURSE = { code: "PI280", instructors: [THAME] };
const TERM = termKey(recentTerms(NOW)[2]!);

function form(overrides: Partial<RawReviewForm> = {}): RawReviewForm {
  return {
    code: "PI280",
    term: TERM,
    instructor: THAME_KEY,
    workload: "About one reading a week and a short essay every fortnight.",
    workloadBand: "",
    assessment: "Two essays and a final exam, marked fairly quickly.",
    tips: ["", "", ""],
    quote: "",
    locale: "en",
    nickname: "",
    ...overrides,
  };
}

describe("validateReview", () => {
  it("accepts a complete form and returns the submission ready to store", () => {
    const result = validateReview(
      form({
        workloadBand: "3_to_6",
        tips: ["Start early", "", "Go to office hours"],
        quote: "Fair.",
      }),
      COURSE,
      NOW
    );
    expect(result).toEqual({
      ok: true,
      data: {
        courseCode: "PI280",
        term: recentTerms(NOW)[2],
        instructorKey: THAME_KEY,
        workload: "About one reading a week and a short essay every fortnight.",
        workloadBand: "3_to_6",
        assessment: "Two essays and a final exam, marked fairly quickly.",
        tips: ["Start early", "Go to office hours"],
        quote: "Fair.",
        locale: "en",
      },
    });
  });

  it("treats the band, tips and quote as optional", () => {
    const result = validateReview(form(), COURSE, NOW);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.workloadBand).toBeNull();
      expect(result.data.tips).toEqual([]);
      expect(result.data.quote).toBeNull();
    }
  });

  it("accepts 'someone else' for any course, with or without a named instructor list", () => {
    expect(validateReview(form({ instructor: "other" }), COURSE, NOW).ok).toBe(true);
    expect(validateReview(form({ instructor: "other" }), { code: "TU105" }, NOW).ok).toBe(true);
  });

  it("asks for the three required fields, in the GOV.UK way: by field, not by schema", () => {
    const result = validateReview(
      form({ term: "", instructor: "", workload: "", assessment: "" }),
      COURSE,
      NOW
    );
    expect(result).toEqual({
      ok: false,
      errors: {
        term: "required",
        instructor: "required",
        workload: "required",
        assessment: "required",
      },
    });
  });

  it("rejects a term the form does not offer", () => {
    const older = validateReview(form({ term: "2560-1" }), COURSE, NOW);
    const future = validateReview(form({ term: "2575-1" }), COURSE, NOW);
    const current = validateReview(form({ term: "2569-1" }), COURSE, NOW);
    const garbage = validateReview(form({ term: "last term" }), COURSE, NOW);
    for (const result of [older, future, current, garbage]) {
      expect(result).toEqual({ ok: false, errors: { term: "invalidChoice" } });
    }
  });

  it("rejects an instructor who is not on the course's list", () => {
    expect(validateReview(form({ instructor: "someone-made-up" }), COURSE, NOW)).toEqual({
      ok: false,
      errors: { instructor: "invalidChoice" },
    });
  });

  it("rejects a band that is not one of the three", () => {
    expect(validateReview(form({ workloadBand: "7" }), COURSE, NOW)).toEqual({
      ok: false,
      errors: { workloadBand: "invalidChoice" },
    });
  });

  it("enforces the length limits", () => {
    expect(validateReview(form({ workload: "Short" }), COURSE, NOW)).toEqual({
      ok: false,
      errors: { workload: "tooShort" },
    });
    expect(
      validateReview(
        form({ assessment: "a".repeat(COURSE_REVIEW_LIMITS.assessment + 1) }),
        COURSE,
        NOW
      )
    ).toEqual({ ok: false, errors: { assessment: "tooLong" } });
    expect(
      validateReview(
        form({ tips: ["a".repeat(COURSE_REVIEW_LIMITS.tip + 1), "", ""] }),
        COURSE,
        NOW
      )
    ).toEqual({ ok: false, errors: { tips: "tooLong" } });
    expect(
      validateReview(form({ quote: "q".repeat(COURSE_REVIEW_LIMITS.quote + 1) }), COURSE, NOW)
    ).toEqual({ ok: false, errors: { quote: "tooLong" } });
  });

  it("measures Thai by characters, so a short Thai sentence is long enough", () => {
    const result = validateReview(
      form({ workload: "งานอ่านมาก แต่สม่ำเสมอ", assessment: "เรียงความสองชิ้นและสอบปลายภาค" }),
      COURSE,
      NOW
    );
    expect(result.ok).toBe(true);
  });

  it("tells the reader when free text contains an email address, a phone number or a student ID", () => {
    expect(
      validateReview(form({ workload: "Email me at someone@example.com about it" }), COURSE, NOW)
    ).toEqual({
      ok: false,
      errors: { workload: "identifying" },
    });
    expect(
      validateReview(form({ assessment: "My ID is 6412345678 if you need it" }), COURSE, NOW)
    ).toEqual({
      ok: false,
      errors: { assessment: "identifying" },
    });
    expect(validateReview(form({ tips: ["Call 081-234-5678", "", ""] }), COURSE, NOW)).toEqual({
      ok: false,
      errors: { tips: "identifying" },
    });
    expect(validateReview(form({ quote: "line: 0812345678" }), COURSE, NOW)).toEqual({
      ok: false,
      errors: { quote: "identifying" },
    });
  });

  it("reports every problem at once, so the error summary can list them all", () => {
    const result = validateReview(
      form({ workload: "x", assessment: "", term: "bad" }),
      COURSE,
      NOW
    );
    expect(result).toEqual({
      ok: false,
      errors: { workload: "tooShort", assessment: "required", term: "invalidChoice" },
    });
  });

  it("rejects an unknown locale", () => {
    expect(validateReview(form({ locale: "fr" }), COURSE, NOW).ok).toBe(false);
  });

  it("never carries a name, student ID, email, IP or user agent", () => {
    const result = validateReview(form(), COURSE, NOW);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(Object.keys(result.data).sort()).toEqual(
        [
          "assessment",
          "courseCode",
          "instructorKey",
          "locale",
          "quote",
          "term",
          "tips",
          "workload",
          "workloadBand",
        ].sort()
      );
    }
  });
});

describe("looksIdentifying", () => {
  it("flags emails, long digit runs and phone numbers with separators", () => {
    expect(looksIdentifying("a@b.co")).toBe(true);
    expect(looksIdentifying("6412345678")).toBe(true);
    expect(looksIdentifying("02-613-2200")).toBe(true);
    expect(looksIdentifying("081 234 5678")).toBe(true);
  });

  it("leaves ordinary review text alone", () => {
    expect(looksIdentifying("Worth 30% of the grade, due in week 9 (2567/1).")).toBe(false);
    expect(looksIdentifying("งานกลุ่มสามชิ้น คะแนน 40 เปอร์เซ็นต์")).toBe(false);
    expect(looksIdentifying("About 3 to 6 hours, 12 readings in 14 weeks")).toBe(false);
  });
});
