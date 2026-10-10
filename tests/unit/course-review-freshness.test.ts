import { describe, expect, it } from "vitest";
import type { Instructor, StudentReview } from "@/content/course-review/types";
import { instructorNote, reviewFreshness } from "@/lib/course-review/freshness";
import { instructorKey, validInstructorKeys } from "@/lib/course-review/instructors";
import { courses } from "@/content/course-review/courses";

const NOW = new Date("2026-10-10T05:00:00+07:00"); // academic year 2569

const THAME: Instructor = {
  name: { en: "Assoc. Prof. Dr. Charlie Thame", th: "รศ.ดร.ชาร์ลี เทม" },
  profileUrl: "https://polsci.tu.ac.th/en/team/assoc-prof-dr-charles-edward-morgan-thame/",
};
const LEE: Instructor = {
  name: { en: "Dr. Joseph Lee", th: "ดร.โจเซฟ ลี" },
  profileUrl: "https://polsci.tu.ac.th/en/team/dr-joseph-lee/",
};
const NO_PROFILE: Instructor = { name: { en: "Visiting Lecturer", th: "อาจารย์พิเศษ" } };

function review(overrides: Partial<StudentReview> = {}): StudentReview {
  return {
    reviewCount: 6,
    term: { year: 2568, semester: 1 },
    workload: { en: "Steady.", th: "สม่ำเสมอ" },
    assessmentStyle: { en: "Essays.", th: "เรียงความ" },
    tips: [],
    ...overrides,
  };
}

describe("instructorKey", () => {
  it("uses the last segment of the faculty profile URL", () => {
    expect(instructorKey(THAME)).toBe("assoc-prof-dr-charles-edward-morgan-thame");
    expect(instructorKey(LEE)).toBe("dr-joseph-lee");
  });

  it("falls back to a slug of the English name when there is no profile", () => {
    expect(instructorKey(NO_PROFILE)).toBe("visiting-lecturer");
  });

  it("does not change when the title or the Thai spelling does", () => {
    const renamed: Instructor = { ...LEE, name: { en: "Prof. Joseph Lee", th: "ศ.โจเซฟ ลี" } };
    expect(instructorKey(renamed)).toBe(instructorKey(LEE));
  });

  it("is unique among each course's instructors, and never collides with 'other'", () => {
    for (const course of courses) {
      const keys = validInstructorKeys(course.instructors);
      expect(new Set(keys).size, course.code).toBe(keys.length);
    }
  });
});

describe("instructorNote", () => {
  it("says nothing when the reviewed instructor is still on the list", () => {
    expect(instructorNote(review({ instructor: THAME }), [THAME, LEE])).toBeNull();
  });

  it("says the instructor changed when the reviewed one is no longer listed", () => {
    expect(instructorNote(review({ instructor: LEE }), [THAME])).toBe("changed");
  });

  it("says someone else taught it when the students said so", () => {
    expect(instructorNote(review({ instructorElsewhere: true }), [THAME])).toBe("elsewhere");
  });

  it("says nothing when the course has no instructors on record to compare with", () => {
    expect(instructorNote(review({ instructor: LEE }), undefined)).toBeNull();
    expect(instructorNote(review({ instructor: LEE }), [])).toBeNull();
    expect(instructorNote(review({ instructorElsewhere: true }), [])).toBeNull();
  });

  it("says nothing about a review that names no instructor at all", () => {
    expect(instructorNote(review(), [THAME])).toBeNull();
  });

  it("matches by key, so a reworded name still counts as the same person", () => {
    const reworded: Instructor = {
      ...THAME,
      name: { en: "Prof. Charlie Thame", th: "ศ.ชาร์ลี เทม" },
    };
    expect(instructorNote(review({ instructor: reworded }), [THAME])).toBeNull();
  });
});

describe("reviewFreshness", () => {
  it("combines the dated rule and the instructor note", () => {
    expect(
      reviewFreshness(review({ term: { year: 2564, semester: 2 }, instructor: LEE }), [THAME], NOW)
    ).toEqual({ dated: true, instructor: "changed" });
    expect(
      reviewFreshness(
        review({ term: { year: 2568, semester: 2 }, instructor: THAME }),
        [THAME],
        NOW
      )
    ).toEqual({ dated: false, instructor: null });
  });

  it("keeps a review from three academic years ago current", () => {
    expect(reviewFreshness(review({ term: { year: 2566, semester: 2 } }), [], NOW).dated).toBe(
      false
    );
  });
});
