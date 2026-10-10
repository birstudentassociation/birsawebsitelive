import { describe, expect, it } from "vitest";
import {
  PUBLICATION_THRESHOLD,
  approvalsNeeded,
  countStatuses,
  groupId,
  groupSubmissions,
  meetsThreshold,
  parseGroupId,
  type GroupableSubmission,
  type SubmissionStatus,
} from "@/lib/course-review/groups";

function submission(
  courseCode: string,
  year: number,
  semester: 1 | 2 | "summer",
  instructorKey: string,
  status: SubmissionStatus
): GroupableSubmission {
  return { courseCode, term: { year, semester }, instructorKey, status };
}

describe("publication threshold", () => {
  it("is five approved submissions", () => {
    expect(PUBLICATION_THRESHOLD).toBe(5);
  });

  it("is met at five and not at four", () => {
    expect(meetsThreshold(4)).toBe(false);
    expect(meetsThreshold(5)).toBe(true);
    expect(meetsThreshold(12)).toBe(true);
    expect(meetsThreshold(0)).toBe(false);
  });

  it("says how many more approvals a group needs, never below zero", () => {
    expect(approvalsNeeded(0)).toBe(5);
    expect(approvalsNeeded(3)).toBe(2);
    expect(approvalsNeeded(5)).toBe(0);
    expect(approvalsNeeded(9)).toBe(0);
  });
});

describe("groupSubmissions", () => {
  it("groups by course, term and instructor, and counts each status", () => {
    const groups = groupSubmissions([
      submission("PI280", 2567, 1, "thames", "approved"),
      submission("PI280", 2567, 1, "thames", "approved"),
      submission("PI280", 2567, 1, "thames", "pending"),
      submission("PI280", 2567, 1, "thames", "rejected"),
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0]!.counts).toEqual({ pending: 1, approved: 2, rejected: 1, total: 4 });
  });

  it("keeps different instructors, terms and courses apart", () => {
    const groups = groupSubmissions([
      submission("PI280", 2567, 1, "thames", "approved"),
      submission("PI280", 2567, 1, "lee", "approved"),
      submission("PI280", 2567, 2, "thames", "approved"),
      submission("PI280", 2566, 1, "thames", "approved"),
      submission("PI121", 2567, 1, "thames", "approved"),
      submission("PI280", 2567, 1, "other", "approved"),
    ]);
    expect(groups).toHaveLength(6);
    for (const group of groups) expect(group.counts.total).toBe(1);
  });

  it("never merges submissions across terms to reach the threshold", () => {
    const groups = groupSubmissions([
      submission("PI280", 2567, 1, "thames", "approved"),
      submission("PI280", 2567, 1, "thames", "approved"),
      submission("PI280", 2567, 1, "thames", "approved"),
      submission("PI280", 2567, 2, "thames", "approved"),
      submission("PI280", 2567, 2, "thames", "approved"),
    ]);
    expect(groups.map((group) => meetsThreshold(group.counts.approved))).toEqual([false, false]);
  });

  it("puts groups with something to decide first, then orders by course and newest term", () => {
    const groups = groupSubmissions([
      submission("PI280", 2567, 1, "thames", "approved"),
      submission("PI121", 2566, 1, "thames", "approved"),
      submission("PI121", 2567, 1, "thames", "approved"),
      submission("PI400", 2565, 1, "thames", "pending"),
    ]);
    expect(groups.map((group) => groupId(group.key))).toEqual([
      "PI400|2565-1|thames",
      "PI121|2567-1|thames",
      "PI121|2566-1|thames",
      "PI280|2567-1|thames",
    ]);
  });

  it("orders semesters within a year newest first", () => {
    const groups = groupSubmissions([
      submission("PI280", 2567, 1, "a", "approved"),
      submission("PI280", 2567, "summer", "a", "approved"),
      submission("PI280", 2567, 2, "a", "approved"),
    ]);
    expect(groups.map((group) => group.key.term.semester)).toEqual(["summer", 2, 1]);
  });

  it("returns nothing for no submissions", () => {
    expect(groupSubmissions([])).toEqual([]);
  });
});

describe("countStatuses", () => {
  it("counts a flat list", () => {
    expect(
      countStatuses([{ status: "approved" }, { status: "pending" }, { status: "approved" }])
    ).toEqual({ pending: 1, approved: 2, rejected: 0, total: 3 });
  });
});

describe("groupId / parseGroupId", () => {
  it("round-trips", () => {
    const key = {
      courseCode: "PI280",
      term: { year: 2567, semester: "summer" as const },
      instructorKey: "dr-joseph-lee",
    };
    expect(groupId(key)).toBe("PI280|2567-summer|dr-joseph-lee");
    expect(parseGroupId(groupId(key))).toEqual(key);
  });

  it("rejects strings groupId could not have produced", () => {
    for (const bad of [
      "",
      "PI280",
      "PI280|2567-1",
      "PI280|2567-9|x",
      "|2567-1|x",
      "PI280|2567-1|",
      "a|2567-1|b|c",
    ]) {
      expect(parseGroupId(bad), bad).toBeNull();
    }
  });
});
