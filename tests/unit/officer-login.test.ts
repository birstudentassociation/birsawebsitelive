import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({ authenticateOfficer: vi.fn() }));

vi.mock("@/lib/inventory/auth", () => ({
  OFFICER_COOKIE: "birsa_inventory",
  authenticateOfficer: auth.authenticateOfficer,
  createSessionToken: () => "token",
  isInventoryAuthConfigured: () => true,
}));
vi.mock("@/lib/inventory/audit", () => ({ recordAudit: async () => undefined }));

import { POST } from "@/app/api/officer/session/route";

function login(ip: string, passcode: string): Request {
  return new Request("https://example.test/api/officer/session", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify({ email: "a@example.test", passcode }),
  });
}

beforeEach(() => {
  auth.authenticateOfficer.mockReset();
  auth.authenticateOfficer.mockImplementation(async (_email: string, passcode: string) =>
    passcode === "right" ? { id: "o", name: "O", role: "admin" } : null
  );
});

describe("officer sign-in rate limit", () => {
  it("lets many successful sign-ins through from one address", async () => {
    for (let i = 0; i < 12; i += 1) {
      expect((await POST(login("192.0.2.10", "right"))).status).toBe(200);
    }
  });

  it("locks an address out after repeated failures", async () => {
    for (let i = 0; i < 5; i += 1) {
      expect((await POST(login("192.0.2.11", "wrong"))).status).toBe(401);
    }
    expect((await POST(login("192.0.2.11", "right"))).status).toBe(429);
  });

  it("does not let failures from one address lock out another", async () => {
    for (let i = 0; i < 5; i += 1) await POST(login("192.0.2.12", "wrong"));
    expect((await POST(login("192.0.2.13", "right"))).status).toBe(200);
  });
});
