/**
 * BIR class and exam timetables, one list per teaching term, transcribed from the BIR office's
 * announcements. Term 2569-2 comes from `content/news/en/bir-timetable-semester-2-2569.mdx`, the
 * source of truth, and `tests/unit/calendar-timetable.test.ts` parses that post's tables to catch
 * drift. Semester 1 has no timetable here: the BIR office announces BIR's semester 1 dates
 * separately, so the calendar builder asks for those times by hand.
 *
 * Reading notes for 2569-2, each an ambiguity in the post worth knowing about:
 *
 * - LAS101 has two sections meeting at the same time, so it has two entries. The class table says
 *   "R.405 or R.406"; the final exam table pairs section 036401 with R.405 and section 036402 with
 *   R.406, and the class rooms follow that pairing.
 * - PI320 sits its final in two rooms by group (group 1 R.405, group 2 R.406), recorded in
 *   `final.groups`. Its class room is R.202.
 * - The post gives no midterm rooms, so midterms have none and the feed leaves LOCATION out.
 * - Midterms for the minor and elective courses are derived from the post's weekday rule (Monday
 *   classes sit on Saturday 27 February). Morning classes sit 09:00 to 11:00 and afternoon classes
 *   13:00 to 15:00. Year 1, 2 and 3 midterms are printed in full, and the post says the same
 *   Monday to Saturday move applies to them.
 * - PI382 is taught jointly with PI490, so the two clash if both are added.
 */
export type TimetableGroup =
  "year1" | "year2" | "year3" | "gov" | "pa" | "gpe" | "area" | "approaches";

/** Display order of the groups, and the order search results appear in. */
export const TIMETABLE_GROUPS: readonly TimetableGroup[] = [
  "year1",
  "year2",
  "year3",
  "gov",
  "pa",
  "gpe",
  "area",
  "approaches",
];

/** Group names in both languages. The minor group names stay in English in Thai, as the post has them. */
export const TIMETABLE_GROUP_NAMES: Record<TimetableGroup, { en: string; th: string }> = {
  year1: { en: "Year 1", th: "ชั้นปีที่ 1" },
  year2: { en: "Year 2 required", th: "วิชาบังคับชั้นปีที่ 2" },
  year3: { en: "Year 3", th: "ชั้นปีที่ 3" },
  gov: {
    en: "Governance and Transnational Studies",
    th: "Governance and Transnational Studies",
  },
  pa: {
    en: "Public Administration and Public Policy",
    th: "Public Administration and Public Policy",
  },
  gpe: { en: "Global Political Economy", th: "Global Political Economy" },
  area: { en: "Area Studies", th: "Area Studies" },
  approaches: { en: "Approaches and Issues", th: "Approaches and Issues" },
};

export type ExamSlot = {
  /** `YYYY-MM-DD`. */
  date: string;
  /** `HH:MM`. */
  start: string;
  end: string;
};

export type FinalExam = ExamSlot & {
  /** Exam room, `R.103` style. Absent when `groups` sets it by group. */
  room?: string;
  /** Rooms by group, for a course whose final is split across rooms. */
  groups?: { group: number; room: string }[];
};

export type TimetableEntry = {
  /** Term key, `2569-2`. */
  term: string;
  code: string;
  title: string;
  group: TimetableGroup;
  /** Section number, only where a course has sections that meet at the same time. */
  section?: string;
  /** ISO weekday, Monday = 1. */
  day: 1 | 2 | 3 | 4 | 5;
  start: string;
  end: string;
  /** Class room, `R.103` style. */
  room: string;
  lecturer?: string;
  /** The post lists no midterm rooms. */
  midterm: ExamSlot;
  final: FinalExam;
};

export const TIMETABLES: Record<string, TimetableEntry[]> = {
  "2569-2": [
    {
      term: "2569-2",
      code: "TU102",
      title: "Life and Aesthetics",
      group: "year1",
      day: 4,
      start: "09:00",
      end: "12:00",
      room: "R.103",
      midterm: { date: "2027-02-25", start: "09:00", end: "11:00" },
      final: { date: "2027-05-06", start: "09:00", end: "12:00", room: "R.103" },
    },
    {
      term: "2569-2",
      code: "LAS101",
      title: "Critical Thinking, Reading, and Writing",
      group: "year1",
      section: "036401",
      day: 5,
      start: "09:00",
      end: "12:00",
      room: "R.405",
      midterm: { date: "2027-02-26", start: "09:00", end: "11:00" },
      final: { date: "2027-05-14", start: "09:00", end: "12:00", room: "R.405" },
    },
    {
      term: "2569-2",
      code: "LAS101",
      title: "Critical Thinking, Reading, and Writing",
      group: "year1",
      section: "036402",
      day: 5,
      start: "09:00",
      end: "12:00",
      room: "R.406",
      midterm: { date: "2027-02-26", start: "09:00", end: "11:00" },
      final: { date: "2027-05-14", start: "09:00", end: "12:00", room: "R.406" },
    },
    {
      term: "2569-2",
      code: "PI122",
      title: "Introduction to Humanities",
      group: "year1",
      day: 3,
      start: "08:30",
      end: "11:30",
      room: "R.102",
      midterm: { date: "2027-02-24", start: "09:00", end: "11:00" },
      final: { date: "2027-05-12", start: "09:00", end: "12:00", room: "R.103" },
    },
    {
      term: "2569-2",
      code: "AH208",
      title: "Exercise for Good Health and Well-Being",
      group: "year1",
      day: 1,
      start: "13:30",
      end: "16:30",
      room: "R.103",
      midterm: { date: "2027-02-27", start: "13:00", end: "15:00" },
      final: { date: "2027-05-10", start: "13:00", end: "16:00", room: "R.103" },
    },
    {
      term: "2569-2",
      code: "PI211",
      title: "Introduction to Political Science",
      group: "year1",
      day: 1,
      start: "09:00",
      end: "12:00",
      room: "R.103",
      midterm: { date: "2027-02-27", start: "09:00", end: "11:00" },
      final: { date: "2027-05-03", start: "09:00", end: "12:00", room: "R.103" },
    },
    {
      term: "2569-2",
      code: "PI271",
      title: "Introduction to International Relations",
      group: "year1",
      day: 2,
      start: "09:00",
      end: "12:00",
      room: "R.102",
      midterm: { date: "2027-02-23", start: "09:00", end: "11:00" },
      final: { date: "2027-05-18", start: "09:00", end: "12:00", room: "R.103" },
    },
    {
      term: "2569-2",
      code: "PI321",
      title: "Thai Politics and Government",
      group: "year2",
      day: 5,
      start: "09:00",
      end: "12:00",
      room: "R.202",
      midterm: { date: "2027-02-26", start: "09:00", end: "11:00" },
      final: { date: "2027-05-14", start: "09:00", end: "12:00", room: "R.103" },
    },
    {
      term: "2569-2",
      code: "PI270",
      title: "Diplomacy History",
      group: "year2",
      day: 3,
      start: "13:00",
      end: "16:00",
      room: "R.102",
      midterm: { date: "2027-02-24", start: "13:00", end: "15:00" },
      final: { date: "2027-05-10", start: "09:00", end: "12:00", room: "R.103" },
    },
    {
      term: "2569-2",
      code: "PI272",
      title: "Foreign Policy Analysis",
      group: "year2",
      day: 3,
      start: "09:00",
      end: "12:00",
      room: "R.103",
      midterm: { date: "2027-02-24", start: "09:00", end: "11:00" },
      final: { date: "2027-05-05", start: "09:00", end: "12:00", room: "R.103" },
    },
    {
      term: "2569-2",
      code: "PI292",
      title: "International Organizations and Regimes",
      group: "year2",
      day: 4,
      start: "13:00",
      end: "16:00",
      room: "R.102",
      midterm: { date: "2027-02-25", start: "13:00", end: "15:00" },
      final: { date: "2027-05-06", start: "13:00", end: "16:00", room: "R.103" },
    },
    {
      term: "2569-2",
      code: "PI370",
      title: "Thai Foreign Affairs",
      group: "year2",
      day: 4,
      start: "09:00",
      end: "12:00",
      room: "R.102",
      midterm: { date: "2027-02-25", start: "09:00", end: "11:00" },
      final: { date: "2027-05-13", start: "09:00", end: "12:00", room: "R.103" },
    },
    {
      term: "2569-2",
      code: "PI320",
      title: "Comparative Government and Politics",
      group: "year3",
      day: 3,
      start: "09:00",
      end: "12:00",
      room: "R.202",
      midterm: { date: "2027-02-24", start: "09:00", end: "11:00" },
      final: {
        date: "2027-05-05",
        start: "09:00",
        end: "12:00",
        groups: [
          { group: 1, room: "R.405" },
          { group: 2, room: "R.406" },
        ],
      },
    },
    {
      term: "2569-2",
      code: "PI381",
      title: "Globalization and Global Governance",
      group: "gov",
      day: 3,
      start: "13:00",
      end: "16:00",
      room: "R.406",
      lecturer: "Dr. Kasina Sundhagul",
      midterm: { date: "2027-02-24", start: "13:00", end: "15:00" },
      final: { date: "2027-05-12", start: "13:00", end: "16:00", room: "R.406" },
    },
    {
      term: "2569-2",
      code: "PI382",
      title: "Politics of International Development",
      group: "gov",
      day: 4,
      start: "13:00",
      end: "16:00",
      room: "R.405",
      lecturer: "Aj. Rebecca Goncharoff",
      midterm: { date: "2027-02-25", start: "13:00", end: "15:00" },
      final: { date: "2027-05-13", start: "13:00", end: "16:00", room: "R.406" },
    },
    {
      term: "2569-2",
      code: "PI384",
      title: "Selected Topics in Global Governance",
      group: "gov",
      day: 2,
      start: "09:00",
      end: "12:00",
      room: "R.406",
      lecturer: "Asst. Prof. Dr. Wasin Punthong",
      midterm: { date: "2027-02-23", start: "09:00", end: "11:00" },
      final: { date: "2027-05-11", start: "09:00", end: "12:00", room: "R.406" },
    },
    {
      term: "2569-2",
      code: "PI387",
      title: "Environment and Global Politics",
      group: "gov",
      day: 5,
      start: "13:00",
      end: "16:00",
      room: "R.405",
      lecturer: "Aj. Rebecca Goncharoff",
      midterm: { date: "2027-02-26", start: "13:00", end: "15:00" },
      final: { date: "2027-05-07", start: "13:00", end: "16:00", room: "R.405" },
    },
    {
      term: "2569-2",
      code: "PI414",
      title: "Seminar in International Conflict and Resolutions",
      group: "gov",
      day: 2,
      start: "13:00",
      end: "16:00",
      room: "R.406",
      lecturer: "Aj. Iain Cowie",
      midterm: { date: "2027-02-23", start: "13:00", end: "15:00" },
      final: { date: "2027-05-18", start: "13:00", end: "16:00", room: "R.406" },
    },
    {
      term: "2569-2",
      code: "PI341",
      title: "Policy Analysis and Evaluation, Concepts and Techniques",
      group: "pa",
      day: 2,
      start: "09:00",
      end: "12:00",
      room: "R.405",
      lecturer: "Assoc. Prof. Dr. Sikarn Issarachaiyos",
      midterm: { date: "2027-02-23", start: "09:00", end: "11:00" },
      final: { date: "2027-05-18", start: "09:00", end: "12:00", room: "R.405" },
    },
    {
      term: "2569-2",
      code: "PI342",
      title: "Organization and Human Resource Management, Theories and Practices",
      group: "pa",
      day: 3,
      start: "13:00",
      end: "16:00",
      room: "R.405",
      lecturer: "Assoc. Prof. Dr. Sunisa Chorkaew",
      midterm: { date: "2027-02-24", start: "13:00", end: "15:00" },
      final: { date: "2027-05-12", start: "13:00", end: "16:00", room: "R.405" },
    },
    {
      term: "2569-2",
      code: "PI343",
      title: "Strategic Planning and Management",
      group: "pa",
      day: 1,
      start: "09:00",
      end: "12:00",
      room: "R.405",
      lecturer: "Assoc. Prof. Dr. Gamolporn Sonsri",
      midterm: { date: "2027-02-27", start: "09:00", end: "11:00" },
      final: { date: "2027-05-03", start: "09:00", end: "12:00", room: "R.405" },
    },
    {
      term: "2569-2",
      code: "PI346",
      title: "Urban Planning and Development Policy",
      group: "pa",
      day: 1,
      start: "13:00",
      end: "16:00",
      room: "R.102",
      lecturer: "Assoc. Prof. Dr. Wijitbusaba Marome",
      midterm: { date: "2027-02-27", start: "13:00", end: "15:00" },
      final: { date: "2027-05-03", start: "13:00", end: "16:00", room: "R.103" },
    },
    {
      term: "2569-2",
      code: "PI397",
      title: "Public Choice in Global Affairs",
      group: "gpe",
      day: 1,
      start: "09:00",
      end: "12:00",
      room: "R.406",
      lecturer: "Prof. Dr. Attakrit Patchimnan",
      midterm: { date: "2027-02-27", start: "09:00", end: "11:00" },
      final: { date: "2027-05-17", start: "09:00", end: "12:00", room: "R.406" },
    },
    {
      term: "2569-2",
      code: "PI480",
      title: "Seminar, Issues in Global Political Economy",
      group: "gpe",
      day: 2,
      start: "09:00",
      end: "12:00",
      room: "R.202",
      lecturer: "Assoc. Prof. Dr. Charlie Thame",
      midterm: { date: "2027-02-23", start: "09:00", end: "11:00" },
      final: { date: "2027-05-11", start: "09:00", end: "12:00", room: "R.405" },
    },
    {
      term: "2569-2",
      code: "PI490",
      title: "Political Economy of Development",
      group: "gpe",
      day: 4,
      start: "13:00",
      end: "16:00",
      room: "R.405",
      lecturer: "Aj. Rebecca Goncharoff",
      midterm: { date: "2027-02-25", start: "13:00", end: "15:00" },
      final: { date: "2027-05-13", start: "13:00", end: "16:00", room: "R.406" },
    },
    {
      term: "2569-2",
      code: "PI494",
      title: "Selected Topics in International Political Economy",
      group: "gpe",
      day: 4,
      start: "09:00",
      end: "12:00",
      room: "R.406",
      lecturer: "Aj. Virot Ali",
      midterm: { date: "2027-02-25", start: "09:00", end: "11:00" },
      final: { date: "2027-05-06", start: "09:00", end: "12:00", room: "R.406" },
    },
    {
      term: "2569-2",
      code: "PI495",
      title: "Contemporary Debates in Global Political Economy",
      group: "gpe",
      day: 2,
      start: "13:00",
      end: "16:00",
      room: "R.405",
      lecturer: "Asst. Prof. Dr. Trin Aiyara",
      midterm: { date: "2027-02-23", start: "13:00", end: "15:00" },
      final: { date: "2027-05-11", start: "13:00", end: "16:00", room: "R.405" },
    },
    {
      term: "2569-2",
      code: "PI374",
      title: "China in Global Politics",
      group: "area",
      day: 1,
      start: "13:00",
      end: "16:00",
      room: "R.405",
      lecturer: "Dr. Joseph Lee",
      midterm: { date: "2027-02-27", start: "13:00", end: "15:00" },
      final: { date: "2027-05-03", start: "13:00", end: "16:00", room: "R.405" },
    },
    {
      term: "2569-2",
      code: "PI474",
      title: "East Asia in Global Politics",
      group: "area",
      day: 2,
      start: "13:00",
      end: "16:00",
      room: "R.102",
      lecturer: "Prof. Dr. Kitti Prasirtsuk",
      midterm: { date: "2027-02-23", start: "13:00", end: "15:00" },
      final: { date: "2027-05-11", start: "13:00", end: "16:00", room: "R.103" },
    },
    {
      term: "2569-2",
      code: "PI478",
      title: "Political Psychology and International Relations",
      group: "approaches",
      day: 5,
      start: "13:00",
      end: "16:00",
      room: "R.102",
      lecturer: "Dr. Pongkwan Sawasdipakdi",
      midterm: { date: "2027-02-26", start: "13:00", end: "15:00" },
      final: { date: "2027-05-14", start: "13:00", end: "16:00", room: "R.103" },
    },
    {
      term: "2569-2",
      code: "PI479",
      title: "Global Politics through Film",
      group: "approaches",
      day: 5,
      start: "09:00",
      end: "12:00",
      room: "R.102",
      lecturer: "Assoc. Prof. Dr. Jittipat Poonkham",
      midterm: { date: "2027-02-26", start: "09:00", end: "11:00" },
      final: { date: "2027-05-07", start: "09:00", end: "12:00", room: "R.103" },
    },
    {
      term: "2569-2",
      code: "PI488",
      title: "Classical Theories in International Relations",
      group: "approaches",
      day: 1,
      start: "13:00",
      end: "16:00",
      room: "R.406",
      lecturer: "Assoc. Prof. Dr. Charlie Thame",
      midterm: { date: "2027-02-27", start: "13:00", end: "15:00" },
      final: { date: "2027-05-10", start: "13:00", end: "16:00", room: "R.405" },
    },
    {
      term: "2569-2",
      code: "PI489",
      title: "Epistemology and Global Politics",
      group: "approaches",
      day: 5,
      start: "13:00",
      end: "16:00",
      room: "R.406",
      lecturer: "Aj. Iain Cowie",
      midterm: { date: "2027-02-26", start: "13:00", end: "15:00" },
      final: { date: "2027-05-07", start: "13:00", end: "16:00", room: "R.406" },
    },
  ],
};

/** The timetable for a term key such as `2569-2`; empty when none is published. */
export function timetableForTerm(termKey: string): readonly TimetableEntry[] {
  return TIMETABLES[termKey] ?? [];
}

/** Whether the BIR office has published a timetable for the term. */
export function hasTimetable(termKey: string): boolean {
  return timetableForTerm(termKey).length > 0;
}

/** Every entry for a course code in a term (two for a course with sections). */
export function timetableEntriesByCode(termKey: string, code: string): TimetableEntry[] {
  const wanted = code.trim().toUpperCase();
  return timetableForTerm(termKey).filter((entry) => entry.code === wanted);
}

/**
 * The entry a saved class refers to. A section picks one of several entries; with no section it
 * resolves only when the course has a single entry, because guessing a section would put the wrong
 * exam room in someone's calendar.
 */
export function findTimetableEntry(
  termKey: string,
  code: string,
  section?: string
): TimetableEntry | null {
  const entries = timetableEntriesByCode(termKey, code);
  if (section) return entries.find((entry) => entry.section === section) ?? null;
  return entries.length === 1 ? (entries[0] as TimetableEntry) : null;
}

/** Class and exam rooms in the timetable, each once, in a stable order. */
export function timetableRooms(termKey: string): string[] {
  const rooms = new Set<string>();
  for (const entry of timetableForTerm(termKey)) {
    rooms.add(entry.room);
    if (entry.final.room) rooms.add(entry.final.room);
    for (const group of entry.final.groups ?? []) rooms.add(group.room);
  }
  return [...rooms].sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
}

/** `R.102` in English, `ร.102` in Thai. Other text passes through unchanged. */
export function formatRoom(room: string, locale: "en" | "th"): string {
  return locale === "th" ? room.replace(/^R\./, "ร.") : room;
}

/** Every room named in any term's timetable, each once, in a stable order. */
export function knownRooms(): string[] {
  const rooms = new Set<string>();
  for (const termKey of Object.keys(TIMETABLES)) {
    for (const room of timetableRooms(termKey)) rooms.add(room);
  }
  return [...rooms].sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
}
