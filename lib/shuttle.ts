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
 * A dated break in service announced by the university, e.g. the Tha Prachan
 * suspension of 28 to 30 July 2026. Dates are Bangkok calendar dates in ISO
 * `YYYY-MM-DD` form, so plain string comparison orders them correctly.
 *
 * The display strings are written out by hand rather than formatted from the
 * dates: Thai copy uses the Buddhist era and its own phrasing, and the
 * announcement's own wording is what students will have seen elsewhere.
 */
export type ServiceSuspension = {
  /** First suspended date, inclusive. */
  from: string;
  /** Last suspended date, inclusive. */
  to: string;
  /** First date service runs again. */
  resumes: string;
  /** The suspended range as it should read on the page, e.g. "28 to 30 July 2026". */
  dates: Bilingual;
  /** The resumption date as it should read, e.g. "Friday 31 July 2026". */
  resumesLabel: Bilingual;
  /** How many days ahead of `from` the heads-up notice appears. Defaults to 14. */
  noticeDaysBefore?: number;
};

/**
 * Announced suspensions, ordered by date. Entries are kept until they expire
 * on their own: everything that reads this list goes through
 * `getSuspension`, which returns nothing once the Bangkok date has passed
 * `to`, so a stale entry stops appearing on the page without an edit. Old
 * entries can then be deleted at any convenient time.
 */
export const serviceSuspensions: ServiceSuspension[] = [
  {
    // Thammasat announcement: TU Shuttle Bus, Tha Prachan campus.
    from: "2026-07-28",
    to: "2026-07-30",
    resumes: "2026-07-31",
    dates: { en: "28 to 30 July 2026", th: "28 ถึง 30 กรกฎาคม 2569" },
    resumesLabel: { en: "Friday 31 July 2026", th: "วันศุกร์ที่ 31 กรกฎาคม 2569" },
  },
];

export type SuspensionPhase = "upcoming" | "active";

export type SuspensionState = {
  suspension: ServiceSuspension;
  phase: SuspensionPhase;
  /** Whole days from the given date until `from`; 0 once the suspension is active. */
  daysUntil: number;
};

const DAY_MS = 86_400_000;

/** Whole days from ISO date `a` to ISO date `b`; negative when `b` is earlier. */
function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / DAY_MS);
}

/**
 * The suspension relevant to a given Bangkok date, if any: the one in
 * progress, otherwise the next one close enough to warn about. Returns
 * `undefined` once a suspension's last day has passed, which is what makes
 * the notice disappear by itself.
 */
export function getSuspension(date: string): SuspensionState | undefined {
  for (const suspension of serviceSuspensions) {
    if (date > suspension.to) continue;

    if (date >= suspension.from) {
      return { suspension, phase: "active", daysUntil: 0 };
    }

    const daysUntil = daysBetween(date, suspension.from);
    if (daysUntil <= (suspension.noticeDaysBefore ?? 14)) {
      return { suspension, phase: "upcoming", daysUntil };
    }

    // The nearest suspension is still too far out to be worth a notice, and
    // anything later in the list is further out again.
    return undefined;
  }
  return undefined;
}

/**
 * A one-off, dated extension of the evening service, e.g. the late buses
 * laid on for the night of 19 August 2026. Like a suspension it is keyed to
 * a Bangkok calendar date in ISO `YYYY-MM-DD` form and read through
 * `getExtension`, so it stops applying by itself once that date has passed.
 *
 * Extra departures are generated rather than listed: they carry on from each
 * line's normal last bus at a fixed interval up to `lastDeparture`
 * inclusive. Both lines currently end at 21:30, so a 30 minute interval and
 * a 23:30 last bus give 22:00, 22:30, 23:00 and 23:30 on each line.
 */
export type ServiceExtension = {
  /** The Bangkok date the extension applies to. */
  date: string;
  /** Gap between the extra departures, in minutes. */
  everyMinutes: number;
  /** Last extra departure of the night, "HH:MM". */
  lastDeparture: string;
  /** The date as it should read on the page, e.g. "Wednesday 19 August 2026". */
  dateLabel: Bilingual;
};

/**
 * Announced late-night extensions, ordered by date. As with suspensions,
 * entries are safe to leave in place: nothing reads this list except
 * `getExtension`, which only matches the current Bangkok date, so a past
 * entry stops affecting the timetable and the countdown without an edit.
 */
export const serviceExtensions: ServiceExtension[] = [
  {
    // Thammasat announcement: late buses on both lines, Tha Prachan campus.
    date: "2026-08-19",
    everyMinutes: 30,
    lastDeparture: "23:30",
    dateLabel: { en: "Wednesday 19 August 2026", th: "วันพุธที่ 19 สิงหาคม 2569" },
  },
];

/** The extension in force on a given Bangkok date, if any. */
export function getExtension(date: string): ServiceExtension | undefined {
  return serviceExtensions.find((extension) => extension.date === date);
}

export function getLine(id: LineId): ShuttleLine {
  const line = shuttleLines.find((l) => l.id === id);
  if (!line) throw new Error(`Unknown shuttle line: ${id}`);
  return line;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** "HH:MM" -> minutes since midnight. */
function parseTime(time: string): number {
  const [hh, mm] = time.split(":");
  return Number(hh) * 60 + Number(mm);
}

/** Minutes since midnight -> "HH:MM". */
function formatTime(minutes: number): string {
  return `${pad2(Math.floor(minutes / 60))}:${pad2(minutes % 60)}`;
}

/**
 * Sorted list of every departure for a line, expressed as minutes since
 * midnight. Pass a Bangkok date to include any late-night extension
 * announced for that date; without one this is the ordinary weekday
 * timetable, which is what the printed tables show.
 */
export function getDepartureMinutes(lineId: LineId, date?: string): number[] {
  const { schedule } = getLine(lineId);
  const minutes: number[] = [];
  for (const hourKey of Object.keys(schedule)) {
    const hour = Number(hourKey);
    for (const minute of schedule[hour] ?? []) {
      minutes.push(hour * 60 + minute);
    }
  }
  minutes.sort((a, b) => a - b);
  if (date) minutes.push(...getExtraDepartureMinutes(lineId, date));
  return minutes;
}

/** Sorted list of every departure for a line, as "HH:MM" strings. */
export function getDepartureTimes(lineId: LineId, date?: string): string[] {
  return getDepartureMinutes(lineId, date).map(formatTime);
}

/**
 * The extra late-night departures a line gains on a given Bangkok date,
 * sorted, or an empty list when no extension applies. They carry on from the
 * line's normal last bus at the extension's interval, up to and including
 * its last departure.
 */
export function getExtraDepartureMinutes(lineId: LineId, date: string): number[] {
  const extension = getExtension(date);
  if (!extension) return [];

  const scheduled = getDepartureMinutes(lineId);
  const normalLast = scheduled[scheduled.length - 1];
  if (normalLast === undefined) return [];

  const last = parseTime(extension.lastDeparture);
  const extra: number[] = [];
  for (let m = normalLast + extension.everyMinutes; m <= last; m += extension.everyMinutes) {
    extra.push(m);
  }
  return extra;
}

/** The extra late-night departures for a line on a date, as "HH:MM" strings. */
export function getExtraDepartureTimes(lineId: LineId, date: string): string[] {
  return getExtraDepartureMinutes(lineId, date).map(formatTime);
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
  | { status: "suspended"; suspension: ServiceSuspension }
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
 *
 * An announced suspension covering the current Bangkok date wins over
 * everything else, so no countdown is shown on a day with no buses.
 */
export function nextDeparture(lineId: LineId, parts: BangkokParts): NextDepartureResult {
  const suspension = getSuspension(parts.date);
  if (suspension?.phase === "active") {
    return { status: "suspended", suspension: suspension.suspension };
  }

  if (parts.weekday === 0 || parts.weekday === 6) {
    return { status: "no-service-weekend" };
  }

  const departures = getDepartureMinutes(lineId, parts.date);
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
