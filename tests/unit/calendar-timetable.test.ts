/**
 * Cross-checks `content/calendar/timetable.ts` against the tables in the BIR
 * timetable post, which is the source of truth, so a change to one without the
 * other fails here.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  TIMETABLE_GROUPS,
  TIMETABLE_GROUP_NAMES,
  findTimetableEntry,
  formatRoom,
  hasTimetable,
  knownRooms,
  timetableEntriesByCode,
  timetableForTerm,
  timetableRooms,
  type TimetableEntry,
} from "@/content/calendar/timetable";

const root = process.cwd();
const post = (locale: "en" | "th") =>
  readFileSync(
    path.join(root, "content/news", locale, "bir-timetable-semester-2-2569.mdx"),
    "utf8"
  );

/** Rows of every table under each heading, without the header and divider. */
function tables(markdown: string): Record<string, string[][]> {
  const out: Record<string, string[][]> = {};
  let heading = "";
  for (const line of markdown.split("\n")) {
    const h = line.match(/^#{2,3} (.*)/);
    if (h) {
      heading = h[1] as string;
      out[heading] = [];
    } else if (heading && line.startsWith("|")) {
      out[heading]?.push(
        line
          .split("|")
          .slice(1, -1)
          .map((cell) => cell.trim())
      );
    }
  }
  for (const key of Object.keys(out)) {
    out[key] = (out[key] as string[][]).filter((row) => !/^-+$/.test(row[0] as string)).slice(1);
  }
  return out;
}

const DAYS: Record<string, number> = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
};
const MONTHS: Record<string, string> = { February: "02", May: "05" };

function isoDate(day: string, month: string): string {
  return `2027-${MONTHS[month]}-${day.padStart(2, "0")}`;
}

const GROUP_HEADINGS: Record<string, string> = {
  "Year 1 courses": "year1",
  "Year 2 required courses": "year2",
  "Year 3 courses": "year3",
  "Governance and Transnational Studies (GOV)": "gov",
  "Public Administration and Public Policy (PA)": "pa",
  "Global Political Economy (GPE)": "gpe",
  "Area Studies": "area",
  "Approaches and Issues": "approaches",
};

const en = tables(post("en"));
const entries = timetableForTerm("2569-2");

describe("timetable 2569-2 against the English post", () => {
  it("lists every course in the post's class tables, once per section", () => {
    const codes = Object.keys(GROUP_HEADINGS).flatMap((heading) =>
      (en[heading] as string[][]).map((row) => (row[0] as string).split(" ")[0])
    );
    const expected = codes.flatMap((code) => (code === "LAS101" ? [code, code] : [code]));
    expect(entries.map((e) => e.code).sort()).toEqual([...expected].sort());
    expect(entries).toHaveLength(33);
  });

  it("matches code, title, group, day, time, room and lecturer", () => {
    for (const [heading, group] of Object.entries(GROUP_HEADINGS)) {
      for (const row of en[heading] as string[][]) {
        const [course = "", when = "", room = ""] = row;
        const code = course.split(" ")[0] as string;
        const title = course.slice(code.length + 1);
        const [dayName = "", times = ""] = when.split(", ");
        const [start, end] = times.split(" to ");
        const list = timetableEntriesByCode("2569-2", code);
        expect(list.length, code).toBeGreaterThan(0);
        for (const entry of list) {
          expect(entry.title, code).toBe(title);
          expect(entry.group, code).toBe(group);
          expect(entry.day, code).toBe(DAYS[dayName]);
          expect(entry.start, code).toBe(start);
          expect(entry.end, code).toBe(end);
          if (!room.includes(" or ")) expect(entry.room, code).toBe(room);
          if (["gov", "pa", "gpe", "area", "approaches"].includes(group)) {
            expect(entry.lecturer, code).toBe(row[3]);
          } else {
            expect(entry.lecturer, code).toBeUndefined();
          }
        }
      }
    }
  });

  it("prints the Year 1, 2 and 3 midterms as the post does", () => {
    for (const heading of ["Year 1 courses", "Year 2 required courses", "Year 3 courses"]) {
      for (const row of en[heading] as string[][]) {
        const code = (row[0] as string).split(" ")[0] as string;
        const m = (row[3] as string).match(/(\d+) February, (\d\d:\d\d) to (\d\d:\d\d)/);
        for (const entry of timetableEntriesByCode("2569-2", code)) {
          expect(entry.midterm, code).toEqual({
            date: isoDate(m?.[1] as string, "February"),
            start: m?.[2],
            end: m?.[3],
          });
        }
      }
    }
  });

  it("derives minor and elective midterms from the weekday rule", () => {
    const rule = new Map(
      (en["Minor and elective courses"] as string[][]).map((row) => {
        const m = (row[1] as string).match(/(\d+) (February)/);
        return [DAYS[row[0] as string], isoDate(m?.[1] as string, "February")];
      })
    );
    expect(rule.get(1)).toBe("2027-02-27");
    const minors = entries.filter((e) =>
      ["gov", "pa", "gpe", "area", "approaches"].includes(e.group)
    );
    expect(minors.length).toBe(20);
    for (const entry of minors) {
      const morning = entry.start < "12:00";
      expect(entry.midterm, entry.code).toEqual({
        date: rule.get(entry.day),
        start: morning ? "09:00" : "13:00",
        end: morning ? "11:00" : "15:00",
      });
    }
  });

  it("matches the final exam table, including rooms, groups and sections", () => {
    const rows = en["Final exam timetable"] as string[][];
    expect(rows).toHaveLength(34);
    for (const row of rows) {
      const [date = "", time = "", course = "", room = ""] = row;
      const d = date.match(/(\d+) May/);
      const [start, end] = time.split(" to ");
      const m = course.match(/^(\w+) .*?(?: (group|section) (\w+))?$/);
      const code = m?.[1] as string;
      const kind = m?.[2];
      const label = m?.[3];
      if (kind === "section") {
        const entry = findTimetableEntry("2569-2", code, label);
        expect(entry, course).not.toBeNull();
        expect(entry?.final).toEqual({ date: isoDate(d?.[1] as string, "May"), start, end, room });
        expect(entry?.room, course).toBe(room);
      } else if (kind === "group") {
        const entry = findTimetableEntry("2569-2", code) as TimetableEntry;
        expect(entry.final.date).toBe(isoDate(d?.[1] as string, "May"));
        expect(entry.final.start).toBe(start);
        expect(entry.final.end).toBe(end);
        expect(entry.final.groups).toContainEqual({ group: Number(label), room });
        expect(entry.final.room).toBeUndefined();
      } else {
        const entry = findTimetableEntry("2569-2", code) as TimetableEntry;
        expect(entry.final, code).toEqual({
          date: isoDate(d?.[1] as string, "May"),
          start,
          end,
          room,
        });
      }
    }
  });

  it("is internally consistent", () => {
    const keys = entries.map((e) => `${e.code}|${e.section ?? ""}`);
    expect(new Set(keys).size).toBe(keys.length);
    for (const entry of entries) {
      expect(entry.start < entry.end).toBe(true);
      expect(entry.midterm.start < entry.midterm.end).toBe(true);
      expect(entry.final.date >= "2027-05-03" && entry.final.date <= "2027-05-18").toBe(true);
      expect(entry.final.date).not.toBe("2027-05-04");
      expect(entry.midterm.date >= "2027-02-23" && entry.midterm.date <= "2027-02-27").toBe(true);
      expect(TIMETABLE_GROUPS).toContain(entry.group);
    }
  });

  it("lists the same course codes in the Thai post", () => {
    const thCodes = [...post("th").matchAll(/\b(?:PI|TU|LAS|AH)\d{3}\b/g)].map((m) => m[0]);
    for (const entry of entries) expect(thCodes, entry.code).toContain(entry.code);
  });
});

describe("timetable helpers", () => {
  it("looks up by term and code", () => {
    expect(hasTimetable("2569-2")).toBe(true);
    expect(hasTimetable("2569-1")).toBe(false);
    expect(timetableForTerm("2569-1")).toEqual([]);
    expect(timetableEntriesByCode("2569-2", " pi271 ")).toHaveLength(1);
    expect(timetableEntriesByCode("2569-2", "LAS101")).toHaveLength(2);
    expect(timetableEntriesByCode("2569-1", "PI271")).toEqual([]);
  });

  it("resolves a section, and refuses to guess one", () => {
    expect(findTimetableEntry("2569-2", "LAS101", "036402")?.room).toBe("R.406");
    expect(findTimetableEntry("2569-2", "LAS101")).toBeNull();
    expect(findTimetableEntry("2569-2", "LAS101", "999999")).toBeNull();
    expect(findTimetableEntry("2569-2", "PI271")?.title).toBe(
      "Introduction to International Relations"
    );
    expect(findTimetableEntry("2569-2", "ZZ999")).toBeNull();
  });

  it("collects rooms and formats them for Thai", () => {
    expect(timetableRooms("2569-2")).toEqual(["R.102", "R.103", "R.202", "R.405", "R.406"]);
    expect(knownRooms()).toEqual(timetableRooms("2569-2"));
    expect(formatRoom("R.102", "th")).toBe("ร.102");
    expect(formatRoom("R.102", "en")).toBe("R.102");
    expect(formatRoom("Room 301", "th")).toBe("Room 301");
  });

  it("names every group in both languages", () => {
    for (const group of TIMETABLE_GROUPS) {
      expect(TIMETABLE_GROUP_NAMES[group].en.length).toBeGreaterThan(0);
      expect(TIMETABLE_GROUP_NAMES[group].th.length).toBeGreaterThan(0);
    }
  });
});
