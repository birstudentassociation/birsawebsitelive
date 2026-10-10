import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ConditionsSnapshot, Reading } from "@/lib/conditions/types";

const snapshot = vi.hoisted(() => ({ getConditionsSnapshot: vi.fn() }));

vi.mock("@/lib/conditions/snapshot", () => ({
  getConditionsSnapshot: snapshot.getConditionsSnapshot,
}));

import { GET, maxDuration } from "@/app/api/conditions/route";

function reading(value: number | null): Reading {
  return {
    id: "tide",
    value,
    unit: "m",
    observedAt: value === null ? null : "2026-10-01T00:00:00Z",
    staleAfterMinutes: 60,
    station: { en: "Tide", th: "น้ำขึ้นน้ำลง" },
    source: { name: { en: "Source", th: "แหล่ง" }, url: "https://example.test" },
  };
}

function snapshotOf(readings: Reading[]): ConditionsSnapshot {
  return { generatedAt: "2026-10-01T00:00:00Z", cards: [], readings };
}

function request(ip: string): Request {
  return new Request("https://example.test/api/conditions", {
    headers: { "x-forwarded-for": ip },
  });
}

beforeEach(() => {
  snapshot.getConditionsSnapshot.mockReset();
});

describe("GET /api/conditions", () => {
  it("caches a snapshot that has data for five minutes", async () => {
    snapshot.getConditionsSnapshot.mockResolvedValue(snapshotOf([reading(1.2)]));
    const response = await GET(request("203.0.113.1"));
    expect(response.headers.get("cache-control")).toContain("s-maxage=300");
  });

  it("does not cache an empty result for five minutes", async () => {
    snapshot.getConditionsSnapshot.mockResolvedValue(snapshotOf([]));
    const response = await GET(request("203.0.113.2"));
    expect(response.headers.get("cache-control")).not.toContain("s-maxage=300");
  });

  it("treats a snapshot where every reading is unavailable as a total failure", async () => {
    snapshot.getConditionsSnapshot.mockResolvedValue(snapshotOf([reading(null), reading(null)]));
    const response = await GET(request("203.0.113.3"));
    expect(response.headers.get("cache-control")).not.toContain("s-maxage=300");
  });

  it("answers with a handled error when building the snapshot throws", async () => {
    snapshot.getConditionsSnapshot.mockRejectedValue(new Error("verdicts broke"));
    const response = await GET(request("203.0.113.4"));
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ ok: false, reason: "error" });
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("allows long enough for the slowest source to retry and time out", () => {
    expect(maxDuration).toBeGreaterThanOrEqual(60);
  });
});
