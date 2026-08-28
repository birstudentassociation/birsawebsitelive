/**
 * Pure data + scheduling logic for the Thammasat shuttle bus guide
 * (`content/student-life/{en,th}/home/shuttle-bus.mdx`). No React here so
 * this stays fully unit-testable; see `tests/unit/shuttle.test.ts`.
 *
 * All times below are the two lines' scheduled DEPARTURES FROM the
 * Thammasat Tha Prachan campus (TPC), Monday to Friday only. Buses are
 * boarded in front of the Thammasat University Auditorium.
 */

export type LineId = "sanam-chai" | "pinklao";

export type Bilingual = { en: string; th: string };

export type Stop = Bilingual & {
  /** Marks the Tha Prachan campus stop (both the start and, for a loop, the end). */
  isCampus?: boolean;
};

/** Hour of day (0-23) -> sorted list of departure minutes within that hour. Hours with no service are omitted. */
export type Schedule = Record<number, number[]>;

/** A departure that also serves as a dormitory shuttle round, e.g. Pinklao's 07:00/09:00/17:00/19:00. */
export type DormitoryMarker = {
  time: string; // "HH:MM"
  label: Bilingual;
};

export type ShuttleLine = {
  id: LineId;
  name: Bilingual;
  kind: "point-to-point" | "loop";
  stops: Stop[];
  schedule: Schedule;
  dormitoryMarkers?: DormitoryMarker[];
};

export const shuttleLines: ShuttleLine[] = [
  {
    id: "sanam-chai",
    name: { en: "Sanam Chai Line", th: "สายสนามไชย" },
    kind: "point-to-point",
    stops: [
      {
        en: "Thammasat University, Tha Prachan",
        th: "มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์",
        isCampus: true,
      },
      { en: "MRT Sanam Chai Station, Museum Siam Exit", th: "สถานีสนามไชย ทางออกมิวเซียมสยาม" },
    ],
    schedule: {
      7: [45],
      8: [0, 15, 30, 45],
      9: [0, 30, 45],
      10: [0],
      12: [0, 15, 30, 45],
      13: [0, 15, 30],
      14: [0],
      15: [0],
      16: [0, 15, 30, 45],
      17: [0, 15, 30, 45],
      18: [0, 15, 30],
      19: [0],
      20: [0, 30, 45],
      21: [0, 30],
    },
  },
  {
    id: "pinklao",
    name: { en: "Pinklao Line", th: "สายปิ่นเกล้า" },
    kind: "loop",
    stops: [
      {
        en: "Thammasat University, Tha Prachan",
        th: "มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์",
        isCampus: true,
      },
      { en: "Before Pinklao Bridge", th: "ก่อนสะพานปิ่นเกล้า" },
      { en: "Pata Pinklao", th: "พาต้าปิ่นเกล้า" },
      { en: "Major Pinklao", th: "เมเจอร์ปิ่นเกล้า" },
      { en: "Lumphini Park Pinklao", th: "ลุมพินีพาร์ค ปิ่นเกล้า" },
      { en: "Lumphini Place Pinklao 2", th: "ลุมพินีเพลส ปิ่นเกล้า 2" },
      { en: "Central Pinklao", th: "เซ็นทรัลปิ่นเกล้า" },
      { en: "Opposite Pata Pinklao", th: "ตรงข้ามพาต้าปิ่นเกล้า" },
      { en: "After Pinklao Bridge", th: "หลังสะพานปิ่นเกล้า" },
      {
        en: "Thammasat University, Tha Prachan",
        th: "มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์",
        isCampus: true,
      },
    ],
    schedule: {
      7: [0, 20, 40],
      8: [0, 20, 40],
      9: [0, 30],
      11: [0, 30],
      12: [0, 30],
      13: [0, 30],
      14: [0, 30],
      16: [0, 20, 40],
      17: [0, 20, 40],
      18: [0, 30],
      19: [0, 30],
      20: [0, 30],
      21: [0, 30],
    },
    dormitoryMarkers: [
      {
        time: "07:00",
        label: { en: "Morning TPC dormitory service (inbound)", th: "บริการหอใน ขาเข้ารอบเช้า" },
      },
      {
        time: "09:00",
        label: { en: "Morning TPC dormitory service (inbound)", th: "บริการหอใน ขาเข้ารอบเช้า" },
      },
      {
        time: "17:00",
        label: { en: "Evening TPC dormitory service (outbound)", th: "บริการหอใน ขาออกรอบเย็น" },
      },
      {
        time: "19:00",
        label: { en: "Evening TPC dormitory service (outbound)", th: "บริการหอใน ขาออกรอบเย็น" },
      },
    ],
  },
];

/**
 * A change to how a line is being run that has no announced end date, e.g.
 * the reduced rush hour service on the Sanam Chai Line after an accident.
 *
 * The scheduled times do not change, so this affects nothing the timetable
 * or the countdown compute. It is a flag on the affected lines and the copy
 * that goes with it, held in one place so the page notice and the live board
 * cannot drift apart.
 *
 * There is exactly one of these at a time, or none. Unlike a dated
 * announcement it cannot expire on its own, so set it back to `undefined`
 * once the university says service is back to normal; the notice and the
 * board flag both go with it.
 */
export type ServiceModification = {
  /** The lines running a modified service. Lines left out are running normally. */
  lines: LineId[];
  /** Short badge for the live board, e.g. "Modified service". */
  flag: Bilingual;
  /** Heading for the notice on the guide page. */
  title: Bilingual;
  /** What has changed. */
  body: Bilingual;
  /** What to travel on instead. */
  alternatives: Bilingual;
};

export const serviceModification: ServiceModification | undefined = {
  // Thammasat announcement: reduced Sanam Chai Line service at Tha Prachan
  // after an accident involving one of its buses.
  lines: ["sanam-chai"],
  flag: { en: "Modified service", th: "ปรับตารางเวลา" },
  title: {
    en: "Sanam Chai Line schedule changed after an accident",
    th: "สายสนามไชยปรับตารางเวลาชั่วคราว",
  },
  body: {
    en: "A Sanam Chai Line shuttle bus was involved in an accident. The line runs fewer buses during rush hour while the schedule is adjusted.",
    th: "รถเวียนสายสนามไชยคันหนึ่งประสบอุบัติเหตุ ทำให้ช่วงเวลาเร่งด่วนมีรถให้บริการน้อยลงกว่าปกติ",
  },
  alternatives: {
    en: "At these times, use the M2 shuttle bus from Sanam Luang, or public bus routes 53, 43 or 15.",
    th: "ช่วงเวลานี้นักศึกษาใช้รถเมล์ M2 ที่สนามหลวง หรือรถเมล์สาย 53 43 หรือ 15 แทนได้",
  },
};

/** Whether a line is covered by the current service modification, if there is one. */
export function isModified(lineId: LineId): boolean {
  return serviceModification?.lines.includes(lineId) ?? false;
}

export function getLine(id: LineId): ShuttleLine {
  const line = shuttleLines.find((l) => l.id === id);
  if (!line) throw new Error(`Unknown shuttle line: ${id}`);
  return line;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Minutes since midnight -> "HH:MM". */
function formatTime(minutes: number): string {
  return `${pad2(Math.floor(minutes / 60))}:${pad2(minutes % 60)}`;
}

/** Sorted list of every departure for a line, expressed as minutes since midnight. */
export function getDepartureMinutes(lineId: LineId): number[] {
  const { schedule } = getLine(lineId);
  const minutes: number[] = [];
  for (const hourKey of Object.keys(schedule)) {
    const hour = Number(hourKey);
    for (const minute of schedule[hour] ?? []) {
      minutes.push(hour * 60 + minute);
    }
  }
  minutes.sort((a, b) => a - b);
  return minutes;
}

/** Sorted list of every departure for a line, as "HH:MM" strings. */
export function getDepartureTimes(lineId: LineId): string[] {
  return getDepartureMinutes(lineId).map(formatTime);
}

/** Looks up the dormitory-service footnote for a given "HH:MM" departure, if any. */
export function getDormitoryMarker(lineId: LineId, time: string): DormitoryMarker | undefined {
  return getLine(lineId).dormitoryMarkers?.find((marker) => marker.time === time);
}

export const lastDepartureNote: Bilingual = {
  en: "Last bus",
  th: "รถคันสุดท้าย",
};

/** Weekday/minute-of-day for a given instant, computed for Asia/Bangkok regardless of host timezone. */
export type BangkokParts = {
  /** 0 = Sunday ... 6 = Saturday. */
  weekday: number;
  /** Minutes since midnight, 0-1439. */
  minutes: number;
  /** Calendar date in Bangkok, ISO `YYYY-MM-DD`. */
  date: string;
};

const WEEKDAY_ORDER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Resolves the current calendar date, weekday and minute-of-day in the
 * Asia/Bangkok timezone, independent of the viewer's device timezone. Uses
 * `Intl.DateTimeFormat` with an explicit `timeZone` and `formatToParts`
 * rather than trusting `Date`'s local getters.
 */
export function getBangkokParts(date: Date = new Date()): BangkokParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Bangkok",
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const lookup = new Map(parts.map((p) => [p.type, p.value]));

  const weekdayName = lookup.get("weekday") ?? "Sun";
  const weekday = WEEKDAY_ORDER.indexOf(weekdayName);

  // Some ICU implementations render midnight as "24" with hour12: false.
  const hour = Number(lookup.get("hour") ?? "0") % 24;
  const minute = Number(lookup.get("minute") ?? "0");

  return {
    weekday: weekday < 0 ? 0 : weekday,
    minutes: hour * 60 + minute,
    date: `${lookup.get("year") ?? "1970"}-${lookup.get("month") ?? "01"}-${lookup.get("day") ?? "01"}`,
  };
}

export type NextDepartureResult =
  | { status: "no-service-weekend" }
  | { status: "not-in-service" }
  | {
      status: "upcoming";
      minutesOfDay: number;
      hh: string;
      mm: string;
      /** Whole minutes remaining until this departure (floor). */
      minutesUntil: number;
    };

/**
 * Given Bangkok weekday/minute-of-day parts, returns the next scheduled
 * departure for a line, at whole-minute granularity. Weekends never have
 * service. On a weekday, finds the earliest departure strictly after the
 * current minute; this naturally covers "mid-service" (the next slot) and
 * "after last bus" (nothing found -> not-in-service). Before the first bus
 * of the day, the board still counts as not-in-service until we're within
 * an hour of that first departure, so the overnight and early-morning
 * window doesn't show a long, misleading countdown; the upcoming countdown
 * only appears once 60 minutes or less remain.
 */
export function nextDeparture(lineId: LineId, parts: BangkokParts): NextDepartureResult {
  if (parts.weekday === 0 || parts.weekday === 6) {
    return { status: "no-service-weekend" };
  }

  const departures = getDepartureMinutes(lineId);
  const first = departures[0];
  const next = departures.find((minutesOfDay) => minutesOfDay > parts.minutes);

  // After the last departure of the day: out of service until the next day.
  if (next === undefined) {
    return { status: "not-in-service" };
  }

  // Before the first bus, but more than an hour out: the overnight and
  // early-morning window still counts as out of service. The countdown only
  // appears within an hour of the first departure.
  if (next === first && first - parts.minutes > 60) {
    return { status: "not-in-service" };
  }

  return {
    status: "upcoming",
    minutesOfDay: next,
    hh: pad2(Math.floor(next / 60)),
    mm: pad2(next % 60),
    minutesUntil: next - parts.minutes,
  };
}
