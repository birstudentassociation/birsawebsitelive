import { describe, expect, it } from "vitest";
import {
  getBangkokParts,
  getDepartureMinutes,
  getDepartureTimes,
  getExtension,
  getExtraDepartureTimes,
  getSuspension,
  nextDeparture,
  serviceExtensions,
  serviceSuspensions,
  shuttleLines,
  type BangkokParts,
} from "@/lib/shuttle";

/**
 * `date` defaults to a plain Monday well clear of any announced suspension,
 * so the scheduling tests below stay about the timetable.
 */
function parts(weekday: number, hh: number, mm: number, date = "2026-09-07"): BangkokParts {
  return { weekday, minutes: hh * 60 + mm, date };
}

describe("getDepartureTimes", () => {
  it("returns the sanam-chai departures sorted, starting with the first bus", () => {
    const times = getDepartureTimes("sanam-chai");
    expect(times[0]).toBe("07:45");
    expect(times[times.length - 1]).toBe("21:30");
  });

  it("returns the pinklao departures sorted, starting with the first bus", () => {
    const times = getDepartureTimes("pinklao");
    expect(times[0]).toBe("07:00");
    expect(times[times.length - 1]).toBe("21:30");
  });

  it("has no service in hours with a gap (sanam-chai 11, pinklao 10/15)", () => {
    expect(getDepartureTimes("sanam-chai")).not.toContain("11:00");
    expect(getDepartureTimes("pinklao")).not.toContain("10:00");
    expect(getDepartureTimes("pinklao")).not.toContain("15:00");
  });
});

describe("getSuspension", () => {
  it("is active on each day of the July 2026 suspension", () => {
    for (const date of ["2026-07-28", "2026-07-29", "2026-07-30"]) {
      expect(getSuspension(date)).toMatchObject({ phase: "active", daysUntil: 0 });
    }
  });

  it("gives a heads-up within the notice window before it starts", () => {
    expect(getSuspension("2026-07-27")).toMatchObject({ phase: "upcoming", daysUntil: 1 });
    expect(getSuspension("2026-07-14")).toMatchObject({ phase: "upcoming", daysUntil: 14 });
  });

  it("stays quiet before the notice window opens", () => {
    expect(getSuspension("2026-07-13")).toBeUndefined();
    expect(getSuspension("2026-01-01")).toBeUndefined();
  });

  it("expires by itself on the resumption day and after", () => {
    expect(getSuspension("2026-07-31")).toBeUndefined();
    expect(getSuspension("2026-08-15")).toBeUndefined();
    expect(getSuspension("2027-01-01")).toBeUndefined();
  });

  it("keeps every announced suspension well formed and in date order", () => {
    let previousTo = "";
    for (const suspension of serviceSuspensions) {
      expect(suspension.from).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(suspension.to >= suspension.from).toBe(true);
      expect(suspension.resumes > suspension.to).toBe(true);
      expect(suspension.from > previousTo).toBe(true);
      previousTo = suspension.to;
    }
  });
});

describe("getExtension", () => {
  it("applies on the announced date only", () => {
    expect(getExtension("2026-08-19")).toMatchObject({ lastDeparture: "23:30", everyMinutes: 30 });
    expect(getExtension("2026-08-18")).toBeUndefined();
    expect(getExtension("2026-08-20")).toBeUndefined();
  });

  it("keeps every announced extension well formed", () => {
    for (const extension of serviceExtensions) {
      expect(extension.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(extension.lastDeparture).toMatch(/^\d{2}:\d{2}$/);
      expect(extension.everyMinutes).toBeGreaterThan(0);
    }
  });
});

describe("getExtraDepartureTimes", () => {
  it("runs every half hour from the normal last bus to 23:30 on both lines", () => {
    for (const line of shuttleLines) {
      expect(getExtraDepartureTimes(line.id, "2026-08-19")).toEqual([
        "22:00",
        "22:30",
        "23:00",
        "23:30",
      ]);
    }
  });

  it("adds nothing on an ordinary day", () => {
    expect(getExtraDepartureTimes("sanam-chai", "2026-09-07")).toEqual([]);
    expect(getDepartureTimes("sanam-chai", "2026-09-07")).toEqual(getDepartureTimes("sanam-chai"));
  });

  it("leaves the printed timetable (no date) unchanged", () => {
    const times = getDepartureTimes("pinklao");
    expect(times[times.length - 1]).toBe("21:30");
  });

  it("extends the dated timetable to 23:30", () => {
    const times = getDepartureTimes("pinklao", "2026-08-19");
    expect(times[times.length - 1]).toBe("23:30");
    expect(times.filter((t, i) => times.indexOf(t) !== i)).toEqual([]);
  });
});

describe("getBangkokParts", () => {
  it("reads the Bangkok calendar date, not the host timezone's date", () => {
    // 2026-07-27T18:30Z is already 01:30 on the 28th in Bangkok (UTC+7).
    const result = getBangkokParts(new Date("2026-07-27T18:30:00Z"));
    expect(result).toMatchObject({ date: "2026-07-28", weekday: 2, minutes: 90 });
  });
});

describe("nextDeparture", () => {
  it("returns no-service-weekend on Saturday", () => {
    const result = nextDeparture("sanam-chai", parts(6, 12, 0));
    expect(result.status).toBe("no-service-weekend");
  });

  it("returns no-service-weekend on Sunday", () => {
    const result = nextDeparture("pinklao", parts(0, 12, 0));
    expect(result.status).toBe("no-service-weekend");
  });

  it("returns not-in-service well before the first departure (overnight/early morning)", () => {
    const result = nextDeparture("sanam-chai", parts(1, 6, 0));
    expect(result.status).toBe("not-in-service");
  });

  it("is out of service just over an hour before the first departure", () => {
    // 06:44 is 61 min before Sanam Chai's 07:45 first bus.
    const result = nextDeparture("sanam-chai", parts(1, 6, 44));
    expect(result.status).toBe("not-in-service");
  });

  it("shows the first bus at exactly one hour before (boundary is in service)", () => {
    // 06:45 is exactly 60 min before 07:45.
    const result = nextDeparture("sanam-chai", parts(1, 6, 45));
    expect(result).toMatchObject({ status: "upcoming", hh: "07", mm: "45", minutesUntil: 60 });
  });

  it("shows the first bus once within an hour of the first departure", () => {
    const result = nextDeparture("sanam-chai", parts(1, 7, 0));
    expect(result).toMatchObject({ status: "upcoming", hh: "07", mm: "45", minutesUntil: 45 });
  });

  it("returns the correct next slot mid-service", () => {
    // Sanam Chai: 09:00, 09:30, 09:45 -> at 09:10 the next bus is 09:30.
    const result = nextDeparture("sanam-chai", parts(3, 9, 10));
    expect(result).toMatchObject({ status: "upcoming", hh: "09", mm: "30", minutesUntil: 20 });
  });

  it("skips a gap hour correctly (Pinklao 09:30 -> next is 11:00, hour 10 has no service)", () => {
    const result = nextDeparture("pinklao", parts(4, 9, 45));
    expect(result).toMatchObject({ status: "upcoming", hh: "11", mm: "0".padStart(2, "0") });
  });

  it("returns not-in-service after the last departure", () => {
    const result = nextDeparture("sanam-chai", parts(5, 22, 0));
    expect(result.status).toBe("not-in-service");
  });

  it("returns not-in-service exactly at the last departure (21:30), since it's no longer strictly after", () => {
    const result = nextDeparture("pinklao", parts(2, 21, 30));
    expect(result.status).toBe("not-in-service");
  });

  it("at the exact boundary of a departure minute, returns the NEXT departure, not the same one", () => {
    // Sanam Chai has a departure at 08:15; checking exactly at 08:15 should
    // yield 08:30, not 08:15 again.
    const result = nextDeparture("sanam-chai", parts(1, 8, 15));
    expect(result).toMatchObject({ status: "upcoming", hh: "08", mm: "30" });
  });

  it("reports suspended on every day of an announced suspension, weekday or not", () => {
    // 28 to 30 July 2026 is Tuesday to Thursday.
    for (const [weekday, date] of [
      [2, "2026-07-28"],
      [3, "2026-07-29"],
      [4, "2026-07-30"],
    ] as const) {
      const result = nextDeparture("sanam-chai", parts(weekday, 9, 0, date));
      expect(result.status).toBe("suspended");
    }
  });

  it("a suspension wins over the normal countdown, even mid-service", () => {
    const result = nextDeparture("pinklao", parts(3, 16, 10, "2026-07-29"));
    expect(result).toMatchObject({ status: "suspended" });
  });

  it("runs normally on the day before and the resumption day", () => {
    expect(nextDeparture("sanam-chai", parts(1, 9, 10, "2026-07-27")).status).toBe("upcoming");
    expect(nextDeparture("sanam-chai", parts(5, 9, 10, "2026-07-31")).status).toBe("upcoming");
  });

  it("keeps counting down after 21:30 on an extension night", () => {
    // 19 August 2026 is a Wednesday; the extra buses run to 23:30.
    const result = nextDeparture("sanam-chai", parts(3, 21, 40, "2026-08-19"));
    expect(result).toMatchObject({ status: "upcoming", hh: "22", mm: "00", minutesUntil: 20 });
  });

  it("counts down to the last extra bus of an extension night", () => {
    const result = nextDeparture("pinklao", parts(3, 23, 0, "2026-08-19"));
    expect(result).toMatchObject({ status: "upcoming", hh: "23", mm: "30", minutesUntil: 30 });
  });

  it("goes out of service once the extension's last bus has gone", () => {
    expect(nextDeparture("pinklao", parts(3, 23, 30, "2026-08-19")).status).toBe("not-in-service");
    expect(nextDeparture("sanam-chai", parts(3, 23, 45, "2026-08-19")).status).toBe(
      "not-in-service"
    );
  });

  it("leaves the daytime schedule alone on an extension night", () => {
    const result = nextDeparture("sanam-chai", parts(3, 9, 10, "2026-08-19"));
    expect(result).toMatchObject({ status: "upcoming", hh: "09", mm: "30" });
  });

  it("still stops at 21:30 on an ordinary evening", () => {
    expect(nextDeparture("sanam-chai", parts(3, 21, 40, "2026-08-18")).status).toBe(
      "not-in-service"
    );
  });

  it("getDepartureMinutes stays consistent with getDepartureTimes", () => {
    const minutes = getDepartureMinutes("pinklao");
    const times = getDepartureTimes("pinklao");
    expect(minutes.length).toBe(times.length);
    expect(minutes.every((m, i) => m >= 0 && m < 24 * 60 && times[i] !== undefined)).toBe(true);
  });
});
