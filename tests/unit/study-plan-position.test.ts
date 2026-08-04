import { describe, expect, it } from "vitest";
import { academicTermAt, derivePosition } from "@/lib/study-plan/position";

describe("academicTermAt", () => {
  it("maps August to December to semester 1 of the academic year starting that Gregorian year", () => {
    expect(academicTermAt(new Date("2026-08-15T12:00:00+07:00"))).toEqual({
      academicYear: 2569,
      kind: "semester1",
    });
    expect(academicTermAt(new Date("2026-12-15T12:00:00+07:00"))).toEqual({
      academicYear: 2569,
      kind: "semester1",
    });
  });

  it("maps January to May to semester 2 of the academic year one behind the calendar year", () => {
    expect(academicTermAt(new Date("2027-01-15T12:00:00+07:00"))).toEqual({
      academicYear: 2569,
      kind: "semester2",
    });
    expect(academicTermAt(new Date("2027-05-15T12:00:00+07:00"))).toEqual({
      academicYear: 2569,
      kind: "semester2",
    });
  });

  it("maps June to July to the summer session of the academic year one behind the calendar year", () => {
    expect(academicTermAt(new Date("2027-06-15T12:00:00+07:00"))).toEqual({
      academicYear: 2569,
      kind: "summer",
    });
    expect(academicTermAt(new Date("2027-07-15T12:00:00+07:00"))).toEqual({
      academicYear: 2569,
      kind: "summer",
    });
  });

  it("resolves the January boundary correctly: 31 December is still semester 1, 1 January is already semester 2", () => {
    expect(academicTermAt(new Date("2026-12-31T12:00:00+07:00"))).toEqual({
      academicYear: 2569,
      kind: "semester1",
    });
    expect(academicTermAt(new Date("2027-01-01T12:00:00+07:00"))).toEqual({
      academicYear: 2569,
      kind: "semester2",
    });
  });

  it("resolves the July/August boundary correctly: 31 July is still summer, 1 August is already semester 1", () => {
    expect(academicTermAt(new Date("2026-07-31T12:00:00+07:00"))).toEqual({
      academicYear: 2568,
      kind: "summer",
    });
    expect(academicTermAt(new Date("2026-08-01T12:00:00+07:00"))).toEqual({
      academicYear: 2569,
      kind: "semester1",
    });
  });

  it("respects Asia/Bangkok rather than the host timezone: late evening 31 July UTC is already 1 August in Bangkok", () => {
    // 2026-07-31T18:00:00Z is 2026-08-01T01:00:00+07:00 in Bangkok.
    expect(academicTermAt(new Date("2026-07-31T18:00:00Z"))).toEqual({
      academicYear: 2569,
      kind: "semester1",
    });
  });
});

describe("derivePosition", () => {
  it("places cohort 67 on 2026-08-04 in year 3, semester 1", () => {
    const result = derivePosition("67", new Date("2026-08-04T12:00:00+07:00"));
    expect(result).toEqual({
      term: { year: 3, kind: "semester1" },
      now: { academicYear: 2569, kind: "semester1" },
      clamped: false,
    });
  });

  it("returns null when the cohort has not started yet", () => {
    // Cohort 99 has not begun as of 2026.
    expect(derivePosition("99", new Date("2026-08-04T12:00:00+07:00"))).toBeNull();
  });

  it("clamps a very old cohort to year 8 with clamped true", () => {
    const result = derivePosition("40", new Date("2026-08-04T12:00:00+07:00"));
    expect(result).not.toBeNull();
    expect(result!.term.year).toBe(8);
    expect(result!.clamped).toBe(true);
  });

  it("returns null for invalid cohort input", () => {
    expect(derivePosition("6", new Date("2026-08-04T12:00:00+07:00"))).toBeNull();
    expect(derivePosition("abc", new Date("2026-08-04T12:00:00+07:00"))).toBeNull();
    expect(derivePosition("", new Date("2026-08-04T12:00:00+07:00"))).toBeNull();
  });
});
