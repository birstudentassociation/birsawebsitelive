import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  officer: {
    id: "11111111-1111-4111-8111-111111111111",
    role: "admin",
    custodianId: null as string | null,
    isActive: true,
  },
  adjustStock: vi.fn(),
  getItem: vi.fn(),
  createItem: vi.fn(),
  updateItem: vi.fn(),
  listOfficers: vi.fn(),
  updateOfficer: vi.fn(),
  getBorrower: vi.fn(),
  updateBorrower: vi.fn(),
  closeMaintenance: vi.fn(),
  getMaintenanceEntry: vi.fn(),
  getCustodianBySlug: vi.fn(),
}));

vi.mock("@/app/api/_lib/guard", () => ({
  checkRateLimit: () => true,
  getClientIp: () => "127.0.0.1",
}));

vi.mock("@/lib/inventory/auth", () => ({
  requireRole: async () => ({ ok: true, officer: mocks.officer }),
  canManageCustodian: () => true,
  isGlobalOfficer: () => true,
}));

vi.mock("@/lib/inventory/audit", () => ({ recordAudit: async () => undefined }));
vi.mock("@/lib/inventory/consumables", () => ({ adjustStock: mocks.adjustStock }));
vi.mock("@/lib/inventory/items", () => ({
  getItem: mocks.getItem,
  createItem: mocks.createItem,
  updateItem: mocks.updateItem,
  listItems: async () => [],
}));
vi.mock("@/lib/inventory/officers", () => ({
  listOfficers: mocks.listOfficers,
  updateOfficer: mocks.updateOfficer,
}));
vi.mock("@/lib/inventory/borrowers", () => ({
  getBorrower: mocks.getBorrower,
  updateBorrower: mocks.updateBorrower,
}));
vi.mock("@/lib/inventory/maintenance", () => ({
  closeMaintenance: mocks.closeMaintenance,
  getMaintenanceEntry: mocks.getMaintenanceEntry,
}));
vi.mock("@/lib/inventory/units", () => ({ getUnit: async () => null }));
vi.mock("@/lib/inventory/custodians", () => ({
  getCustodian: async () => null,
  getCustodianBySlug: mocks.getCustodianBySlug,
}));

import { POST as adjust } from "@/app/api/inventory/consumables/[id]/adjust/route";
import { POST as createItemRoute } from "@/app/api/inventory/items/route";
import { PATCH as patchItem, DELETE as deleteItem } from "@/app/api/inventory/items/[id]/route";
import { PATCH as patchOfficer } from "@/app/api/inventory/officers/[id]/route";
import {
  GET as getBorrowerRoute,
  PATCH as patchBorrower,
} from "@/app/api/inventory/borrowers/[id]/route";
import { PATCH as patchMaintenance } from "@/app/api/inventory/maintenance/[id]/route";

const VALID_ID = "22222222-2222-4222-8222-222222222222";

function json(body: unknown): Request {
  return new Request("https://example.test/api", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function ctx(id: string) {
  return { params: Promise.resolve({ id }) };
}

const baseItem = {
  key: "tent",
  name: { en: "Tent", th: "เต็นท์" },
  trackingMode: "asset" as const,
  maxLoanDays: 7,
};

beforeEach(() => {
  for (const fn of [
    mocks.adjustStock,
    mocks.getItem,
    mocks.createItem,
    mocks.updateItem,
    mocks.listOfficers,
    mocks.updateOfficer,
    mocks.getBorrower,
    mocks.updateBorrower,
    mocks.closeMaintenance,
    mocks.getMaintenanceEntry,
    mocks.getCustodianBySlug,
  ]) {
    fn.mockReset();
  }
  mocks.officer.custodianId = null;
  mocks.getCustodianBySlug.mockResolvedValue({ id: VALID_ID });
});

describe("consumable adjust", () => {
  it("rejects a fractional delta", async () => {
    const response = await adjust(json({ delta: 1.5 }), ctx(VALID_ID));
    expect(response.status).toBe(400);
    expect(mocks.adjustStock).not.toHaveBeenCalled();
  });

  it("rejects a malformed id without touching the database", async () => {
    const response = await adjust(json({ delta: 1 }), ctx("not-a-uuid"));
    expect(response.status).toBe(404);
    expect(mocks.getItem).not.toHaveBeenCalled();
  });
});

describe("item creation", () => {
  it.each([0, -3, 2.5])("rejects maxLoanDays of %s", async (maxLoanDays) => {
    const response = await createItemRoute(json({ ...baseItem, maxLoanDays }));
    expect(response.status).toBe(400);
    expect(mocks.createItem).not.toHaveBeenCalled();
  });

  it("explains a consumable created without a quantity", async () => {
    const response = await createItemRoute(json({ ...baseItem, trackingMode: "consumable" }));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ reason: "quantity-required" });
    expect(mocks.createItem).not.toHaveBeenCalled();
  });

  it("explains an asset created with a quantity", async () => {
    const response = await createItemRoute(json({ ...baseItem, qtyOnHand: 4 }));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ reason: "quantity-not-allowed" });
    expect(mocks.createItem).not.toHaveBeenCalled();
  });
});

describe("item update", () => {
  it("rejects a non-positive maxLoanDays", async () => {
    const response = await patchItem(json({ maxLoanDays: 0 }), ctx(VALID_ID));
    expect(response.status).toBe(400);
  });

  it("explains removing the quantity from a consumable", async () => {
    mocks.getItem.mockResolvedValue({ id: VALID_ID, custodianId: "c", trackingMode: "consumable" });
    const response = await patchItem(json({ qtyOnHand: null }), ctx(VALID_ID));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ reason: "quantity-required" });
  });

  it("explains giving an asset a quantity", async () => {
    mocks.getItem.mockResolvedValue({ id: VALID_ID, custodianId: "c", trackingMode: "asset" });
    const response = await patchItem(json({ qtyOnHand: 3 }), ctx(VALID_ID));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ reason: "quantity-not-allowed" });
  });

  it("answers a malformed id with 404 for update and retire", async () => {
    expect((await patchItem(json({ isRetired: true }), ctx("nope"))).status).toBe(404);
    expect((await deleteItem(json({}), ctx("nope"))).status).toBe(404);
    expect(mocks.getItem).not.toHaveBeenCalled();
  });
});

describe("officer update", () => {
  const admin = (overrides: object = {}) => ({
    id: "x",
    role: "admin",
    isActive: true,
    custodianId: null,
    ...overrides,
  });

  it("blocks the last active admin from deactivating themselves", async () => {
    mocks.listOfficers.mockResolvedValue([
      admin({ id: mocks.officer.id }),
      admin({ id: "other", role: "read_only" }),
      admin({ id: "gone", isActive: false }),
    ]);
    const response = await patchOfficer(json({ isActive: false }), ctx(mocks.officer.id));
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ reason: "last-admin" });
    expect(mocks.updateOfficer).not.toHaveBeenCalled();
  });

  it("blocks the last active admin from demoting themselves", async () => {
    mocks.listOfficers.mockResolvedValue([admin({ id: mocks.officer.id })]);
    const response = await patchOfficer(json({ role: "read_only" }), ctx(mocks.officer.id));
    expect(response.status).toBe(409);
  });

  it("lets an admin step down when another active admin remains", async () => {
    mocks.listOfficers.mockResolvedValue([admin({ id: mocks.officer.id }), admin({ id: "other" })]);
    mocks.updateOfficer.mockResolvedValue({ ok: true, officer: { id: mocks.officer.id } });
    const response = await patchOfficer(json({ role: "read_only" }), ctx(mocks.officer.id));
    expect(response.status).toBe(200);
  });

  it("answers a malformed id with 404", async () => {
    const response = await patchOfficer(json({ name: "A" }), ctx("nope"));
    expect(response.status).toBe(404);
    expect(mocks.updateOfficer).not.toHaveBeenCalled();
  });
});

describe("malformed ids in other inventory routes", () => {
  it("borrowers", async () => {
    expect((await getBorrowerRoute(json({}), ctx("nope"))).status).toBe(404);
    expect((await patchBorrower(json({ name: "A" }), ctx("nope"))).status).toBe(404);
    expect(mocks.getBorrower).not.toHaveBeenCalled();
    expect(mocks.updateBorrower).not.toHaveBeenCalled();
  });

  it("maintenance", async () => {
    expect((await patchMaintenance(json({}), ctx("nope"))).status).toBe(404);
    expect(mocks.getMaintenanceEntry).not.toHaveBeenCalled();
  });
});
