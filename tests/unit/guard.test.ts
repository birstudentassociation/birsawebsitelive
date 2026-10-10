import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  activeBucketCount,
  checkRateLimit,
  isRateLimited,
  recordRateLimitFailure,
  refundRateLimit,
} from "@/app/api/_lib/guard";

const WINDOW_MS = 10 * 60 * 1000;

let scopeCounter = 0;
function freshScope(): string {
  scopeCounter += 1;
  return `test-${scopeCounter}`;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("checkRateLimit", () => {
  it("allows the budget and then refuses", () => {
    const scope = freshScope();
    for (let i = 0; i < 5; i += 1) expect(checkRateLimit("1.1.1.1", scope)).toBe(true);
    expect(checkRateLimit("1.1.1.1", scope)).toBe(false);
  });

  it("prunes expired buckets so the map does not grow without bound", () => {
    const scope = freshScope();
    for (let i = 0; i < 50; i += 1) checkRateLimit(`10.0.0.${i}`, scope);
    const before = activeBucketCount();
    expect(before).toBeGreaterThanOrEqual(50);
    vi.advanceTimersByTime(WINDOW_MS + 61_000);
    checkRateLimit("10.9.9.9", freshScope());
    expect(activeBucketCount()).toBe(1);
  });
});

describe("failure-only limiting", () => {
  it("does not spend budget on a check, only on recorded failures", () => {
    const scope = freshScope();
    for (let i = 0; i < 20; i += 1) expect(isRateLimited("2.2.2.2", scope)).toBe(false);
    for (let i = 0; i < 5; i += 1) recordRateLimitFailure("2.2.2.2", scope);
    expect(isRateLimited("2.2.2.2", scope)).toBe(true);
  });

  it("lets the budget reset after the window", () => {
    const scope = freshScope();
    for (let i = 0; i < 5; i += 1) recordRateLimitFailure("3.3.3.3", scope);
    vi.advanceTimersByTime(WINDOW_MS + 1);
    expect(isRateLimited("3.3.3.3", scope)).toBe(false);
  });
});

describe("refundRateLimit", () => {
  it("gives back a token spent by checkRateLimit", () => {
    const scope = freshScope();
    for (let i = 0; i < 5; i += 1) {
      expect(checkRateLimit("4.4.4.4", scope)).toBe(true);
      refundRateLimit("4.4.4.4", scope);
    }
    expect(checkRateLimit("4.4.4.4", scope)).toBe(true);
  });

  it("does nothing when there is no bucket", () => {
    expect(() => refundRateLimit("5.5.5.5", freshScope())).not.toThrow();
  });
});
