import { describe, expect, it } from "vitest";
import { getTermStatus } from "@/lib/home/term-status";

describe("getTermStatus", () => {
  it("reports the week of the term and when finals start", () => {
    expect(getTermStatus("2026-11-10", "en")).toBe(
      "Week 15 of semester 1. Finals start Monday 23 November."
    );
    expect(getTermStatus("2026-11-10", "th")).toBe(
      "ภาคการศึกษาที่ 1 สัปดาห์ที่ 15 เริ่มสอบปลายภาควันจันทร์ที่ 23 พฤศจิกายน"
    );
  });

  it("counts the first day of term as week 1", () => {
    expect(getTermStatus("2026-08-03", "en")).toBe(
      "Week 1 of semester 1. Finals start Monday 23 November."
    );
    expect(getTermStatus("2026-08-09", "en")).toMatch(/^Week 1 /);
    expect(getTermStatus("2026-08-10", "en")).toMatch(/^Week 2 /);
  });

  it("says when finals end during the exam period", () => {
    expect(getTermStatus("2026-11-25", "en")).toBe("Final exams until Friday 11 December.");
    expect(getTermStatus("2026-11-25", "th")).toBe("สอบปลายภาคไปจนถึงวันศุกร์ที่ 11 ธันวาคม");
    expect(getTermStatus("2026-12-11", "en")).toBe("Final exams until Friday 11 December.");
  });

  it("bridges the gap between the last class and finals", () => {
    expect(getTermStatus("2026-11-22", "en")).toBe(
      "Classes for semester 1 have ended. Finals start Monday 23 November."
    );
  });

  it("says when the next term starts between terms", () => {
    expect(getTermStatus("2026-12-20", "en")).toBe("Semester 2 starts Monday 4 January.");
    expect(getTermStatus("2026-12-20", "th")).toBe(
      "ภาคการศึกษาที่ 2 เปิดเรียนวันจันทร์ที่ 4 มกราคม"
    );
  });

  it("says when the first term starts before it begins", () => {
    expect(getTermStatus("2026-07-01", "en")).toBe("Semester 1 starts Monday 3 August.");
  });

  it("reports the second term, whose finals are recorded", () => {
    expect(getTermStatus("2027-03-01", "en")).toBe(
      "Week 9 of semester 2. Finals start Monday 3 May."
    );
  });

  it("returns null when no recorded date supports a statement", () => {
    expect(getTermStatus("2027-12-01", "en")).toBeNull();
    expect(getTermStatus("2027-12-01", "th")).toBeNull();
  });
});
