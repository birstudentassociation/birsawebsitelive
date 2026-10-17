import { describe, expect, it } from "vitest";
import {
  admissionRounds,
  englishTests,
  getAdmissionRound,
  type DateSpan,
} from "@/content/information/admissions";
import { formatSpan } from "@/components/information/format";

const LOCALES = ["en", "th"] as const;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isRealDate(iso: string): boolean {
  return ISO_DATE.test(iso) && new Date(`${iso}T00:00:00Z`).toISOString().startsWith(iso);
}

function spanDates(span: DateSpan): string[] {
  return span.end ? [span.start, span.end] : [span.start];
}

describe("admission rounds data", () => {
  it("has the five rounds in order", () => {
    expect(admissionRounds.map((r) => r.id)).toEqual([
      "inter-portfolio-1",
      "inter-portfolio-2",
      "tcas-3",
      "non-thai-1",
      "non-thai-2",
    ]);
  });

  it("has every text field in both locales", () => {
    for (const round of admissionRounds) {
      const texts = [
        round.name,
        round.who,
        round.minimumGrades,
        round.tests,
        round.selection,
        round.fee,
        ...round.window.flatMap((w) => (w.label ? [w.label] : [])),
        ...round.milestones.flatMap((m) => [m.label, ...(m.note ? [m.note] : [])]),
      ];
      for (const text of texts) {
        for (const locale of LOCALES) expect(text[locale].trim(), round.id).not.toBe("");
      }
    }
  });

  it("uses no colons, other than clock times, or dashes in text", () => {
    for (const round of admissionRounds) {
      const texts = [
        round.who,
        round.minimumGrades,
        round.tests,
        round.selection,
        round.fee,
        ...round.milestones.flatMap((m) => [m.label, ...(m.note ? [m.note] : [])]),
      ];
      for (const text of texts) {
        for (const locale of LOCALES) {
          expect(text[locale].replace(/\d{1,2}:\d{2}/g, ""), text[locale]).not.toMatch(/[:–—]| - /);
        }
      }
    }
  });

  it("has valid ISO dates with a start that is not after the end", () => {
    for (const round of admissionRounds) {
      for (const span of round.window) {
        for (const iso of spanDates(span)) expect(isRealDate(iso), `${round.id} ${iso}`).toBe(true);
        expect(span.start <= (span.end ?? span.start)).toBe(true);
      }
      for (const m of round.milestones) {
        if (m.date === "tba") continue;
        for (const iso of spanDates(m.date))
          expect(isRealDate(iso), `${round.id} ${iso}`).toBe(true);
        expect(m.date.start <= (m.date.end ?? m.date.start)).toBe(true);
      }
    }
  });

  it("lists dated milestones in chronological order within a round, with tba last", () => {
    for (const round of admissionRounds) {
      const starts = round.milestones.map((m) => (m.date === "tba" ? null : m.date.start));
      const firstTba = starts.indexOf(null);
      const dated = firstTba === -1 ? starts : starts.slice(0, firstTba);
      expect(
        starts.slice(dated.length).every((s) => s === null),
        round.id
      ).toBe(true);
      expect([...dated].sort(), round.id).toEqual(dated);
    }
  });

  it("has unique milestone ids per round", () => {
    for (const round of admissionRounds) {
      const ids = round.milestones.map((m) => m.id);
      expect(new Set(ids).size, round.id).toBe(ids.length);
    }
  });

  it("matches the decided seat counts", () => {
    const seats = Object.fromEntries(admissionRounds.map((r) => [r.id, r.seats]));
    expect(seats).toEqual({
      "inter-portfolio-1": 45,
      "inter-portfolio-2": 5,
      "tcas-3": 15,
      "non-thai-1": 3,
      "non-thai-2": 2,
    });
    expect(admissionRounds.reduce((sum, r) => sum + r.seats, 0)).toBe(70);
  });

  it("points guides at the spec slugs", () => {
    expect(Object.fromEntries(admissionRounds.map((r) => [r.id, r.guide]))).toEqual({
      "inter-portfolio-1": "/services/applying-to-bir/inter-portfolio-1",
      "inter-portfolio-2": "/services/applying-to-bir/inter-portfolio-2",
      "tcas-3": "/services/applying-to-bir/tcas-3-written-exam",
      "non-thai-1": "/services/applying-to-bir/non-thai-applicants",
      "non-thai-2": "/services/applying-to-bir/non-thai-applicants",
    });
  });

  it("uses the decided announcement dates", () => {
    const successful = (id: string) => {
      const m = getAdmissionRound(id)?.milestones.find((x) => x.id === "successful");
      return m && m.date !== "tba" ? m.date.start : undefined;
    };
    expect(successful("inter-portfolio-2")).toBe("2027-03-11");
    expect(successful("non-thai-2")).toBe("2027-05-11");
  });

  it("includes the written exam milestones under tcas-3", () => {
    const tcas = getAdmissionRound("tcas-3");
    const exam = tcas?.milestones.find((m) => m.id === "exam");
    expect(exam?.date).toEqual({ start: "2027-03-21" });
    expect(tcas?.milestones.some((m) => m.id === "exam-apply")).toBe(true);
    expect(tcas?.milestones.filter((m) => m.date === "tba").length).toBe(2);
  });

  it("states the decided English test minimums", () => {
    const byId = Object.fromEntries(englishTests.map((t) => [t.id, t.minimum.en]));
    expect(byId.toefl).toContain("500");
    expect(byId.toefl).toContain("61");
    expect(byId.ielts).toContain("6.0");
    expect(byId["tu-get"]).toContain("500");
    expect(byId["tu-get"]).toContain("74");
    expect(byId.sat).toContain("50");
    const sat = englishTests.find((t) => t.id === "sat");
    expect(sat?.requiredFor).toEqual(["inter-portfolio-1", "non-thai-1", "non-thai-2"]);
  });

  it("formats ranges in both locales", () => {
    expect(formatSpan("en", { start: "2027-01-06", end: "2027-01-24" })).toBe(
      "6 to 24 January 2027"
    );
    expect(formatSpan("en", { start: "2026-10-06", end: "2026-11-06" })).toBe(
      "6 October to 6 November 2026"
    );
    expect(formatSpan("th", { start: "2027-01-06", end: "2027-01-24" })).toBe(
      "6 ถึง 24 มกราคม 2570"
    );
  });
});
