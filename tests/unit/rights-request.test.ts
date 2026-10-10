import { afterEach, describe, expect, it, vi } from "vitest";
import { rightsDeadlineIso } from "@/lib/privacy/rightsRequest";

afterEach(() => {
  vi.useRealTimers();
});

describe("rightsDeadlineIso", () => {
  it("counts 30 days from the Bangkok day once Bangkok has rolled over", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-10T20:00:00Z"));
    expect(rightsDeadlineIso()).toBe("2026-11-10");
  });

  it("counts from the same Bangkok day just before the rollover", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-10T16:59:00Z"));
    expect(rightsDeadlineIso()).toBe("2026-11-09");
  });
});
