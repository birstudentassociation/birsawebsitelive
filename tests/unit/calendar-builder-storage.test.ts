import { describe, expect, it } from "vitest";
import {
  emptyStoredState,
  readStoredState,
  writeStoredState,
} from "@/lib/calendar-builder/storage";

describe("calendar builder storage", () => {
  it("gives defaults when nothing is saved or the value is junk", () => {
    expect(readStoredState(null, null)).toEqual(emptyStoredState());
    expect(readStoredState("not json", null)).toEqual(emptyStoredState());
    expect(readStoredState('{"v":3}', null)).toEqual(emptyStoredState());
    expect(emptyStoredState().categories).toEqual(["birsa", "holidays", "registration"]);
  });

  it("round-trips categories, the chosen term and a class list per term", () => {
    const state = {
      categories: ["birsa", "classes", "exams"] as const,
      term: "2569-2",
      classesByTerm: {
        "2569-1": [{ code: "PI300", day: 3 as const, start: "10:00", end: "11:00" }],
        "2569-2": [
          {
            code: "LAS101",
            day: 5 as const,
            start: "09:00",
            end: "12:00",
            place: "R.406",
            section: "036402",
          },
        ],
      },
    };
    const saved = writeStoredState({ ...state, categories: [...state.categories] });
    expect(readStoredState(saved, null)).toEqual({ ...state, categories: [...state.categories] });
  });

  it("drops bad classes, unknown categories and bad term keys without throwing", () => {
    const saved = JSON.stringify({
      v: 2,
      inc: "birsa,bogus,exams",
      term: "nope",
      classes: { "2569-2": ["junk", 5, "PI271~2~0900~1200~"], bad: ["PI271~2~0900~1200~"] },
    });
    expect(readStoredState(saved, null)).toEqual({
      categories: ["birsa", "exams"],
      term: null,
      classesByTerm: { "2569-2": [{ code: "PI271", day: 2, start: "09:00", end: "12:00" }] },
    });
  });

  it("migrates version 1 under its own term", () => {
    const v1 = "inc=birsa%2Cclasses&term=2569-2&c=PI271%7E2%7E1300%7E1550%7ER.102";
    expect(readStoredState(null, v1)).toEqual({
      categories: ["birsa", "classes"],
      term: "2569-2",
      classesByTerm: {
        "2569-2": [{ code: "PI271", day: 2, start: "13:00", end: "15:50", place: "R.102" }],
      },
    });
  });

  it("prefers version 2 over version 1", () => {
    const v2 = writeStoredState({ categories: ["birsa"], term: "2569-1", classesByTerm: {} });
    expect(readStoredState(v2, "inc=holidays&term=2569-2").categories).toEqual(["birsa"]);
  });

  it("migrates a version 1 value with no classes or term", () => {
    expect(readStoredState(null, "inc=birsa")).toEqual({
      categories: ["birsa"],
      term: null,
      classesByTerm: {},
    });
  });
});
