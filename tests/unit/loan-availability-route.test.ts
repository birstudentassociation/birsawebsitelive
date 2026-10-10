import { beforeEach, describe, expect, it, vi } from "vitest";

const getItemAvailabilityForRange = vi.hoisted(() => vi.fn());

vi.mock("@/app/api/_lib/guard", () => ({
  checkRateLimit: () => true,
  getClientIp: () => "127.0.0.1",
}));

vi.mock("@/lib/inventory/loans", () => ({ getItemAvailabilityForRange }));

import { GET } from "@/app/api/loans/availability/route";

function call(query: string) {
  return GET(new Request(`https://example.test/api/loans/availability?${query}`));
}

describe("GET /api/loans/availability", () => {
  beforeEach(() => {
    getItemAvailabilityForRange.mockReset();
    getItemAvailabilityForRange.mockResolvedValue({ total: 2, available: 1, configured: true });
  });

  it("returns availability for a valid range", async () => {
    const response = await call("itemKey=first-aid-kit&start=2026-11-02&end=2026-11-04");
    expect(response.status).toBe(200);
    expect(getItemAvailabilityForRange).toHaveBeenCalledWith(
      "first-aid-kit",
      "2026-11-02",
      "2026-11-04"
    );
  });

  it.each([
    ["an impossible start", "start=2026-02-31&end=2026-03-04"],
    ["an impossible end", "start=2026-03-01&end=2026-04-31"],
    ["a malformed start", "start=tomorrow&end=2026-03-04"],
    ["an end before the start", "start=2026-03-05&end=2026-03-04"],
  ])("returns 400 for %s", async (_label, range) => {
    const response = await call(`itemKey=first-aid-kit&${range}`);
    expect(response.status).toBe(400);
    expect(getItemAvailabilityForRange).not.toHaveBeenCalled();
  });
});
