import { beforeEach, describe, expect, it, vi } from "vitest";

const requireRole = vi.hoisted(() => vi.fn());
const listUnits = vi.hoisted(() => vi.fn());

vi.mock("@/app/api/_lib/guard", () => ({
  checkRateLimit: () => true,
  getClientIp: () => "127.0.0.1",
}));

vi.mock("@/lib/inventory/auth", () => ({ requireRole, canManageCustodian: () => true }));
vi.mock("@/lib/inventory/units", () => ({ listUnits, createUnit: vi.fn() }));
vi.mock("@/lib/inventory/items", () => ({ getItem: vi.fn() }));
vi.mock("@/lib/inventory/audit", () => ({ recordAudit: vi.fn() }));

import { GET } from "@/app/api/inventory/units/route";

function officer(custodianId: string | null) {
  return { ok: true, officer: { id: "officer-1", role: "loan_officer", custodianId } };
}

describe("GET /api/inventory/units", () => {
  beforeEach(() => {
    requireRole.mockReset();
    listUnits.mockReset();
    listUnits.mockResolvedValue([]);
  });

  it("scopes a club officer to their own custodian", async () => {
    requireRole.mockResolvedValue(officer("club-1"));
    await GET(new Request("https://example.test/api/inventory/units?itemId=item-9"));
    expect(listUnits).toHaveBeenCalledWith(
      expect.objectContaining({ itemId: "item-9", custodianId: "club-1" })
    );
  });

  it("does not let the caller choose another custodian", async () => {
    requireRole.mockResolvedValue(officer("club-1"));
    await GET(new Request("https://example.test/api/inventory/units?custodianId=club-2"));
    expect(listUnits).toHaveBeenCalledWith(expect.objectContaining({ custodianId: "club-1" }));
  });

  it("leaves a BIRSA-wide officer unscoped", async () => {
    requireRole.mockResolvedValue(officer(null));
    await GET(new Request("https://example.test/api/inventory/units"));
    expect(listUnits).toHaveBeenCalledWith(expect.objectContaining({ custodianId: undefined }));
  });
});
