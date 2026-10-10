import { beforeEach, describe, expect, it, vi } from "vitest";

const createLoanRequest = vi.hoisted(() => vi.fn());
const decideLoan = vi.hoisted(() => vi.fn());
const requireRole = vi.hoisted(() => vi.fn());

vi.mock("@/app/api/_lib/guard", () => ({
  checkRateLimit: () => true,
  getClientIp: () => "127.0.0.1",
}));
vi.mock("@/lib/inventory/loans", () => ({ createLoanRequest, decideLoan }));
vi.mock("@/lib/inventory/auth", () => ({ requireRole, isGlobalOfficer: () => true }));
vi.mock("@/lib/inventory/audit", () => ({ recordAudit: vi.fn() }));
vi.mock("@/lib/inventory/items", () => ({ getItemByKey: vi.fn(), getItem: vi.fn() }));
vi.mock("@/lib/inventory/borrowers", () => ({ getBorrower: vi.fn() }));

import { POST as requestPost } from "@/app/api/loans/request/route";
import { POST as decisionPost } from "@/app/api/loans/decision/route";

function post(body: unknown) {
  return new Request("https://example.test/api", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/loans/request", () => {
  beforeEach(() => {
    createLoanRequest.mockReset();
  });

  it("answers an email mismatch with a field error that does not name the stored email", async () => {
    createLoanRequest.mockResolvedValue({ ok: false, reason: "email-mismatch" });
    const response = await requestPost(
      post({
        itemKey: "first-aid-kit",
        studentName: "Mallory",
        studentId: "6512345678",
        studentEmail: "attacker@example.com",
        startDate: "2026-11-02",
        endDate: "2026-11-04",
      })
    );
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.reason).toBe("validation");
    expect(body.errors.studentEmail).toHaveLength(1);
    expect(JSON.stringify(body)).not.toContain("victim");
  });

  it("rejects an impossible date before reaching the database", async () => {
    const response = await requestPost(
      post({
        itemKey: "first-aid-kit",
        studentName: "Alex",
        studentId: "6512345678",
        studentEmail: "alex@example.com",
        startDate: "2026-02-31",
        endDate: "2026-03-04",
      })
    );
    expect(response.status).toBe(400);
    expect(createLoanRequest).not.toHaveBeenCalled();
  });
});

describe("POST /api/loans/decision", () => {
  beforeEach(() => {
    decideLoan.mockReset();
    requireRole.mockResolvedValue({ ok: true, officer: { id: "officer-1", custodianId: null } });
  });

  it.each([
    ["unit-not-found", 404],
    ["unit-invalid", 400],
    ["unavailable", 409],
    ["not-found", 404],
  ])("maps %s to %i", async (reason, status) => {
    decideLoan.mockResolvedValue({ ok: false, reason });
    const response = await decisionPost(
      post({ id: "x", decision: "approved", unitId: "not-a-uuid" })
    );
    expect(response.status).toBe(status);
  });
});
