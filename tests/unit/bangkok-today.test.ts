import { describe, expect, it } from "vitest";
import { todayInBangkok } from "@/lib/bangkok-today";

/**
 * The whole point of this helper is the seven-hour window where the server's
 * UTC date and the reader's Bangkok date disagree, so that window is what
 * these cases pin down. Without it, a loan pickup date that is already in the
 * past in Thailand passes the "not in the past" check every morning until
 * 07:00 local.
 */
describe("todayInBangkok", () => {
  it("reports tomorrow's UTC date once Bangkok has rolled over", () => {
    // 31 July 2026, 18:00 UTC is already 1 August in Bangkok (UTC+7).
    expect(todayInBangkok(new Date("2026-07-31T18:00:00Z"))).toBe("2026-08-01");
  });

  it("still reports the current date just before the Bangkok rollover", () => {
    // 16:59 UTC is 23:59 the same day in Bangkok.
    expect(todayInBangkok(new Date("2026-07-31T16:59:00Z"))).toBe("2026-07-31");
  });

  it("does not lag behind during the Bangkok morning", () => {
    // 01:00 UTC is 08:00 the same day in Bangkok — the naive UTC slice agrees
    // here, which is why the bug this guards against only showed up overnight.
    expect(todayInBangkok(new Date("2026-08-01T01:00:00Z"))).toBe("2026-08-01");
  });

  it("reports the Bangkok date for the whole 00:00-07:00 local window", () => {
    // 17:00 UTC through 23:59 UTC is 00:00-06:59 the next day in Bangkok.
    expect(todayInBangkok(new Date("2026-08-01T17:00:00Z"))).toBe("2026-08-02");
    expect(todayInBangkok(new Date("2026-08-01T23:59:00Z"))).toBe("2026-08-02");
  });

  it("crosses year boundaries correctly", () => {
    expect(todayInBangkok(new Date("2026-12-31T17:00:00Z"))).toBe("2027-01-01");
  });

  it("formats as zero-padded YYYY-MM-DD", () => {
    expect(todayInBangkok(new Date("2026-01-05T06:00:00Z"))).toBe("2026-01-05");
  });
});
