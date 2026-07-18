import { describe, expect, it } from "vitest";
import {
  getDepartureMinutes,
  getDepartureTimes,
  nextDeparture,
  type BangkokParts,
} from "@/lib/shuttle";

function parts(weekday: number, hh: number, mm: number): BangkokParts {
  return { weekday, minutes: hh * 60 + mm };
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

describe("nextDeparture", () => {
  it("returns no-service-weekend on Saturday", () => {
    const result = nextDeparture("sanam-chai", parts(6, 12, 0));
    expect(result.status).toBe("no-service-weekend");
  });

  it("returns no-service-weekend on Sunday", () => {
    const result = nextDeparture("pinklao", parts(0, 12, 0));
    expect(result.status).toBe("no-service-weekend");
  });

  it("returns the first bus when checked before the first departure of the day", () => {
    const result = nextDeparture("sanam-chai", parts(1, 6, 0));
    expect(result).toMatchObject({ status: "upcoming", hh: "07", mm: "45" });
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

  it("returns finished-today after the last departure", () => {
    const result = nextDeparture("sanam-chai", parts(5, 22, 0));
    expect(result.status).toBe("finished-today");
  });

  it("returns finished-today exactly at the last departure (21:30), since it's no longer strictly after", () => {
    const result = nextDeparture("pinklao", parts(2, 21, 30));
    expect(result.status).toBe("finished-today");
  });

  it("at the exact boundary of a departure minute, returns the NEXT departure, not the same one", () => {
    // Sanam Chai has a departure at 08:15; checking exactly at 08:15 should
    // yield 08:30, not 08:15 again.
    const result = nextDeparture("sanam-chai", parts(1, 8, 15));
    expect(result).toMatchObject({ status: "upcoming", hh: "08", mm: "30" });
  });

  it("getDepartureMinutes stays consistent with getDepartureTimes", () => {
    const minutes = getDepartureMinutes("pinklao");
    const times = getDepartureTimes("pinklao");
    expect(minutes.length).toBe(times.length);
    expect(minutes.every((m, i) => m >= 0 && m < 24 * 60 && times[i] !== undefined)).toBe(true);
  });
});
