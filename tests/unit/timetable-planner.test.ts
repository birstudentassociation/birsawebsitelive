import { describe, expect, it } from "vitest";
import { timetableForTerm } from "@/content/calendar/timetable";
import {
  MILESTONES_2569_2,
  clashesWith,
  decodeShare,
  entryId,
  examClashesWith,
  feeFor,
  idsFromSlots,
  mergeSlots,
  nextUp,
  resolveIds,
  termStatus,
  toggleEntry,
  weekBlocks,
} from "@/lib/timetable-planner";

const all = [...timetableForTerm("2569-2")];
const pick = (...ids: string[]) => resolveIds(ids, all);

describe("timetable planner", () => {
  it("keeps one LAS101 section at a time", () => {
    const a = all.find((e) => e.section === "036401")!;
    const b = all.find((e) => e.section === "036402")!;
    const ids = toggleEntry(toggleEntry([], a, all), b, all);
    expect(ids).toEqual(["LAS101-036402"]);
    expect(toggleEntry(ids, b, all)).toEqual([]);
  });

  it("decodes a share link, dropping unknown codes and duplicate sections", () => {
    expect(decodeShare("pi211, NOPE1, LAS101-036401,LAS101-036402", all).sort()).toEqual(
      ["LAS101-036401", "PI211"].sort()
    );
    expect(decodeShare(null, all)).toEqual([]);
  });

  it("finds class and exam clashes", () => {
    const [pi382] = pick("PI382");
    expect(clashesWith(pi382!, pick("PI490")).map((e) => e.code)).toEqual(["PI490"]);
    expect(clashesWith(pi382!, pick("PI271"))).toEqual([]);
    const [pi211] = pick("PI211");
    expect(examClashesWith(pi211!, pick("PI343")).map((e) => e.code)).toEqual(["PI343"]);
  });

  it("lays clashing classes side by side", () => {
    const blocks = weekBlocks(pick("PI382", "PI490"), 4);
    expect(blocks.map((b) => [b.lane, b.lanes, b.clash])).toEqual([
      [0, 2, true],
      [1, 2, true],
    ]);
  });

  it("round-trips with the calendar builder's saved classes and keeps custom ones", () => {
    const custom = { code: "TH161", day: 2 as const, start: "13:00", end: "16:00" };
    const slots = mergeSlots("2569-2", [custom], pick("PI211", "LAS101-036402"), "en");
    expect(slots[0]).toEqual(custom);
    expect(idsFromSlots("2569-2", slots).sort()).toEqual(["LAS101-036402", "PI211"]);
    expect(mergeSlots("2569-2", slots, pick("PI211"), "en").map((s) => s.code)).toEqual([
      "TH161",
      "PI211",
    ]);
  });

  it("reports where the semester is", () => {
    expect(termStatus("2026-11-05", MILESTONES_2569_2).focus).toMatchObject({
      state: "next",
      daysUntil: 25,
      milestone: { id: "registration" },
    });
    expect(termStatus("2026-12-02", MILESTONES_2569_2).focus?.milestone.id).toBe("registration");
    const teaching = termStatus("2027-01-12", MILESTONES_2569_2);
    expect([teaching.focus?.milestone.id, teaching.week, teaching.totalWeeks]).toEqual([
      "classes",
      2,
      17,
    ]);
    expect(termStatus("2027-02-24", MILESTONES_2569_2).focus?.milestone.id).toBe("midterms");
    expect(termStatus("2027-06-01", MILESTONES_2569_2).ended).toBe(true);
  });

  it("finds the next class, skipping days with no classes and midterm week", () => {
    const picked = pick("PI271");
    const holiday = [{ start: "2027-01-12", end: "2027-01-12", title: "Holiday" }];
    const up = nextUp("2027-01-11", 0, picked, MILESTONES_2569_2, holiday);
    expect([up?.item.kind, up?.item.date]).toEqual(["class", "2027-01-19"]);
    const live = nextUp("2027-01-19", 10 * 60, picked, MILESTONES_2569_2, []);
    expect(live?.live).toBe(true);
    const exam = nextUp("2027-02-22", 0, picked, MILESTONES_2569_2, []);
    expect([exam?.item.kind, exam?.item.date]).toEqual(["midterm", "2027-02-23"]);
    expect(entryId(exam!.item.entry)).toBe("PI271");
  });

  it("prices whole credit rows only", () => {
    expect(feeFor(15)).toEqual({ thai: 52895, foreign: 62445 });
    expect(feeFor(24)).toBeNull();
  });
});
