import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const jobs = vi.hoisted(() => ({
  runDailyJob: vi.fn(),
  purge: vi.fn(),
}));

vi.mock("@/lib/inventory/notifications", () => ({
  isCronConfigured: () => !!process.env.CRON_SECRET,
  runDailyJob: jobs.runDailyJob,
}));

vi.mock("@/lib/privacy/retention", () => ({
  purgeExpiredPersonalData: jobs.purge,
}));

import { GET } from "@/app/api/cron/daily/route";

function request(authorization?: string): Request {
  return new Request("https://example.test/api/cron/daily", {
    headers: authorization ? { authorization } : {},
  });
}

beforeEach(() => {
  jobs.runDailyJob.mockReset();
  jobs.purge.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("GET /api/cron/daily", () => {
  it("answers an unauthenticated caller with 401 whether or not the secret is configured", async () => {
    vi.stubEnv("CRON_SECRET", "");
    const unconfigured = await GET(request());
    vi.stubEnv("CRON_SECRET", "s3cret");
    const configured = await GET(request("Bearer wrong"));
    expect(unconfigured.status).toBe(401);
    expect(configured.status).toBe(401);
    expect(await unconfigured.json()).toEqual(await configured.json());
  });

  it("does nothing at all while the secret is unset", async () => {
    vi.stubEnv("CRON_SECRET", "");
    await GET(request("Bearer "));
    expect(jobs.runDailyJob).not.toHaveBeenCalled();
    expect(jobs.purge).not.toHaveBeenCalled();
  });

  it("runs both jobs for a valid secret", async () => {
    vi.stubEnv("CRON_SECRET", "s3cret");
    jobs.runDailyJob.mockResolvedValue({ ok: true, summary: { overdueFlagged: 1 } });
    jobs.purge.mockResolvedValue({ ok: false, reason: "error" });
    const response = await GET(request("Bearer s3cret"));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      ok: true,
      overdueFlagged: 1,
      retentionPurge: { skipped: "error" },
    });
  });
});
