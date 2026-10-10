/**
 * Tests for the loan lifecycle in lib/inventory/loans.ts.
 *
 * There is no local Postgres, so the pure decisions (deriveUnitState, isUuid)
 * are tested directly, and the transitions run against the in-memory
 * FakeInventoryDb in tests/unit/fixtures. That covers which rows are written
 * and in what order; it cannot prove the SQL itself, so the overlap and
 * overdue predicates in getItemAvailabilityForRange are checked by statement
 * shape and parameters only.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FakeInventoryDb, type FakeLoan } from "./fixtures/fake-inventory-db";

const fake = vi.hoisted(() => ({ db: null as unknown }));

vi.mock("@/lib/inventory/db", async () => {
  const helpers = await import("./fixtures/fake-inventory-db");
  return helpers.inventoryDbModule(() => fake.db as InstanceType<typeof FakeInventoryDb>);
});

import {
  cancelLoan,
  checkinLoan,
  checkoutLoan,
  createLoanRequest,
  decideLoan,
  deriveUnitState,
  getItemAvailabilityForRange,
  isUuid,
} from "@/lib/inventory/loans";

const ITEM = "a0000000-0000-4000-8000-000000000001";
const OTHER_ITEM = "a0000000-0000-4000-8000-000000000002";
const UNIT = "c0000000-0000-4000-8000-000000000001";
const LOAN_A = "10000000-0000-4000-8000-0000000000a1";
const LOAN_B = "10000000-0000-4000-8000-0000000000b1";
const OFFICER = "0f000000-0000-4000-8000-000000000001";
const BORROWER = "b0000000-0000-4000-8000-0000000000f1";

let db: FakeInventoryDb;

function loan(overrides: Partial<FakeLoan>): FakeLoan {
  return {
    id: LOAN_A,
    reference: "FAK-AAAA",
    item_id: ITEM,
    unit_id: UNIT,
    borrower_id: BORROWER,
    quantity: 1,
    start_date: "2026-11-02",
    end_date: "2026-11-04",
    reason: null,
    status: "approved",
    ...overrides,
  };
}

function seed(unitState: string, loans: FakeLoan[]) {
  db.items.push({
    id: ITEM,
    key: "first-aid-kit",
    max_loan_days: 7,
    is_retired: false,
    online_loanable: true,
    tracking_mode: "asset",
    qty_on_hand: null,
  });
  db.units.push({ id: UNIT, item_id: ITEM, state: unitState, condition: "good" });
  db.loans.push(...loans);
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-10T05:00:00Z"));
  db = new FakeInventoryDb();
  fake.db = db;
});

afterEach(() => {
  vi.useRealTimers();
});

describe("deriveUnitState", () => {
  it("is on_loan while any checked_out or overdue loan remains", () => {
    expect(deriveUnitState("reserved", ["approved", "checked_out"])).toBe("on_loan");
    expect(deriveUnitState("reserved", ["overdue"])).toBe("on_loan");
  });

  it("is reserved when only approved loans remain", () => {
    expect(deriveUnitState("on_loan", ["approved"])).toBe("reserved");
  });

  it("is available when no active loans remain", () => {
    expect(deriveUnitState("on_loan", [])).toBe("available");
    expect(deriveUnitState("reserved", [])).toBe("available");
  });

  it("never overrides maintenance or retired", () => {
    expect(deriveUnitState("maintenance", ["checked_out"])).toBe("maintenance");
    expect(deriveUnitState("maintenance", [])).toBe("maintenance");
    expect(deriveUnitState("retired", ["approved"])).toBe("retired");
  });

  it("retires a unit returned lost and sends one returned damaged to maintenance", () => {
    expect(deriveUnitState("on_loan", [], "lost")).toBe("retired");
    expect(deriveUnitState("on_loan", [], "damaged")).toBe("maintenance");
    expect(deriveUnitState("on_loan", ["approved"], "damaged")).toBe("maintenance");
    expect(deriveUnitState("maintenance", [], "lost")).toBe("retired");
    expect(deriveUnitState("retired", [], "damaged")).toBe("retired");
  });

  it("treats good and worn returns like no condition at all", () => {
    expect(deriveUnitState("on_loan", [], "good")).toBe("available");
    expect(deriveUnitState("on_loan", ["approved"], "worn")).toBe("reserved");
  });
});

describe("isUuid", () => {
  it("accepts a UUID and rejects other strings", () => {
    expect(isUuid(UNIT)).toBe(true);
    expect(isUuid("not-a-uuid")).toBe(false);
    expect(isUuid("")).toBe(false);
    expect(isUuid(`${UNIT}; drop table loans`)).toBe(false);
  });
});

describe("shared units across loans", () => {
  it("keeps a unit on_loan when another loan on it is cancelled", async () => {
    seed("on_loan", [
      loan({ id: LOAN_A, status: "checked_out", end_date: "2026-10-12" }),
      loan({ id: LOAN_B, status: "approved", start_date: "2026-11-02", end_date: "2026-11-04" }),
    ]);
    const result = await cancelLoan({ id: LOAN_B });
    expect(result.ok).toBe(true);
    expect(db.units[0]?.state).toBe("on_loan");
  });

  it("keeps a unit reserved when one of two approved loans is cancelled", async () => {
    seed("reserved", [
      loan({ id: LOAN_A, status: "approved" }),
      loan({ id: LOAN_B, status: "approved", start_date: "2026-11-10", end_date: "2026-11-12" }),
    ]);
    await cancelLoan({ id: LOAN_A });
    expect(db.units[0]?.state).toBe("reserved");
  });

  it("frees the unit when its only loan is cancelled", async () => {
    seed("reserved", [loan({ status: "approved" })]);
    await cancelLoan({ id: LOAN_A });
    expect(db.units[0]?.state).toBe("available");
  });

  it("does not take a unit out of maintenance when a loan is cancelled", async () => {
    seed("maintenance", [loan({ status: "approved" })]);
    await cancelLoan({ id: LOAN_A });
    expect(db.units[0]?.state).toBe("maintenance");
  });

  it("returns a unit to reserved when it is checked in with a later loan approved", async () => {
    seed("on_loan", [
      loan({ id: LOAN_A, status: "checked_out", end_date: "2026-10-12" }),
      loan({ id: LOAN_B, status: "approved", start_date: "2026-11-02", end_date: "2026-11-04" }),
    ]);
    const result = await checkinLoan({ id: LOAN_A, officerId: OFFICER, conditionIn: "good" });
    expect(result.ok).toBe(true);
    expect(db.units[0]?.state).toBe("reserved");
  });

  it("makes the unit available when the last loan is checked in", async () => {
    seed("on_loan", [loan({ status: "checked_out" })]);
    await checkinLoan({ id: LOAN_A, officerId: OFFICER });
    expect(db.units[0]?.state).toBe("available");
  });

  it("leaves a unit on_loan when approving a later loan for it", async () => {
    seed("on_loan", [
      loan({ id: LOAN_A, status: "checked_out", end_date: "2026-10-12" }),
      loan({ id: LOAN_B, status: "pending", unit_id: null, start_date: "2026-11-02" }),
    ]);
    const result = await decideLoan({
      id: LOAN_B,
      decision: "approved",
      officerId: OFFICER,
      unitId: UNIT,
    });
    expect(result.ok).toBe(true);
    expect(db.units[0]?.state).toBe("on_loan");
  });

  it("reserves an available unit when a loan is approved for it", async () => {
    seed("available", [loan({ status: "pending", unit_id: null })]);
    await decideLoan({ id: LOAN_A, decision: "approved", officerId: OFFICER, unitId: UNIT });
    expect(db.units[0]?.state).toBe("reserved");
  });

  it("does not put a unit in maintenance back on loan at checkout", async () => {
    seed("maintenance", [loan({ status: "approved" })]);
    await checkoutLoan({ id: LOAN_A, officerId: OFFICER });
    expect(db.units[0]?.state).toBe("maintenance");
  });
});

describe("checkin condition", () => {
  it("retires a unit returned lost", async () => {
    seed("on_loan", [loan({ status: "checked_out" })]);
    await checkinLoan({ id: LOAN_A, officerId: OFFICER, conditionIn: "lost" });
    expect(db.units[0]).toMatchObject({ state: "retired", condition: "lost" });
  });

  it("sends a unit returned damaged to maintenance", async () => {
    seed("on_loan", [loan({ status: "checked_out" })]);
    await checkinLoan({ id: LOAN_A, officerId: OFFICER, conditionIn: "damaged" });
    expect(db.units[0]).toMatchObject({ state: "maintenance", condition: "damaged" });
  });

  it("makes a unit returned worn available again", async () => {
    seed("on_loan", [loan({ status: "checked_out" })]);
    await checkinLoan({ id: LOAN_A, officerId: OFFICER, conditionIn: "worn" });
    expect(db.units[0]).toMatchObject({ state: "available", condition: "worn" });
  });
});

describe("decideLoan unit checks", () => {
  function approve(unitId: string) {
    return decideLoan({ id: LOAN_A, decision: "approved", officerId: OFFICER, unitId });
  }

  it("rejects a unit that belongs to a different item", async () => {
    seed("available", [loan({ status: "pending", unit_id: null })]);
    db.units[0]!.item_id = OTHER_ITEM;
    expect(await approve(UNIT)).toEqual({ ok: false, reason: "unit-invalid" });
    expect(db.loans[0]?.status).toBe("pending");
  });

  it.each(["maintenance", "retired"])("rejects a unit in %s", async (state) => {
    seed(state, [loan({ status: "pending", unit_id: null })]);
    expect(await approve(UNIT)).toEqual({ ok: false, reason: "unavailable" });
    expect(db.loans[0]?.status).toBe("pending");
  });

  it("reports an unknown unit as not found", async () => {
    seed("available", [loan({ status: "pending", unit_id: null })]);
    expect(await approve("c0000000-0000-4000-8000-0000000000ff")).toEqual({
      ok: false,
      reason: "unit-not-found",
    });
  });

  it("reports a malformed unit id as not found without querying for it", async () => {
    seed("available", [loan({ status: "pending", unit_id: null })]);
    expect(await approve("not-a-uuid")).toEqual({ ok: false, reason: "unit-not-found" });
    expect(db.statements.some((s) => s.values.includes("not-a-uuid"))).toBe(false);
  });
});

describe("malformed loan ids", () => {
  beforeEach(() => {
    seed("available", []);
  });

  it("is not found for decide, checkout, checkin and cancel, without querying", async () => {
    const before = db.statements.length;
    expect(await decideLoan({ id: "nope", decision: "rejected", officerId: OFFICER })).toEqual({
      ok: false,
      reason: "not-found",
    });
    expect(await checkoutLoan({ id: "nope", officerId: OFFICER })).toEqual({
      ok: false,
      reason: "not-found",
    });
    expect(await checkinLoan({ id: "nope", officerId: OFFICER })).toEqual({
      ok: false,
      reason: "not-found",
    });
    expect(await cancelLoan({ id: "nope" })).toEqual({ ok: false, reason: "not-found" });
    expect(db.statements.length).toBe(before);
  });
});

describe("getItemAvailabilityForRange", () => {
  it("counts a unit that is checked out or overdue past its end date as busy for any range", async () => {
    seed("on_loan", [loan({ status: "overdue", end_date: "2026-10-01" })]);
    await getItemAvailabilityForRange("first-aid-kit", "2026-12-01", "2026-12-03");
    const statement = db.statements.find((s) => s.text.includes("not exists"));
    expect(statement?.text).toMatch(/status in \('checked_out', 'overdue'\)/);
    expect(statement?.values).toContain("2026-10-10");
  });
});

describe("createLoanRequest", () => {
  const request = {
    itemKey: "first-aid-kit",
    startDate: "2026-11-02",
    endDate: "2026-11-04",
    borrower: { tuStudentId: "6512345678", name: "Alex", email: "alex@example.com" },
  };

  function seedBorrower(email = "alex@example.com") {
    db.borrowers.push({
      id: BORROWER,
      tu_student_id: "6512345678",
      name: "Alex Original",
      email,
      phone: null,
      blocklisted: false,
      blocklist_reason: null,
      max_concurrent_loans: null,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    });
  }

  it("creates a pending loan for a new borrower", async () => {
    seed("available", []);
    const result = await createLoanRequest(request);
    expect(result.ok).toBe(true);
    expect(db.loans).toHaveLength(1);
    expect(db.borrowers[0]?.email).toBe("alex@example.com");
  });

  it("does not overwrite another student's email or name", async () => {
    seed("available", []);
    seedBorrower("victim@example.com");
    const result = await createLoanRequest({
      ...request,
      borrower: { ...request.borrower, email: "attacker@example.com", name: "Mallory" },
    });
    expect(result).toEqual({ ok: false, reason: "email-mismatch" });
    expect(db.borrowers[0]).toMatchObject({ email: "victim@example.com", name: "Alex Original" });
    expect(db.loans).toHaveLength(0);
  });

  it("does not reveal the stored email in the result", async () => {
    seed("available", []);
    seedBorrower("victim@example.com");
    const result = await createLoanRequest({
      ...request,
      borrower: { ...request.borrower, email: "attacker@example.com" },
    });
    expect(JSON.stringify(result)).not.toContain("victim");
  });

  it("accepts the stored email in a different case and keeps the stored name", async () => {
    seed("available", []);
    seedBorrower("Alex@Example.com");
    const result = await createLoanRequest({
      ...request,
      borrower: { ...request.borrower, name: "Someone Else" },
    });
    expect(result.ok).toBe(true);
    expect(db.borrowers[0]).toMatchObject({ email: "Alex@Example.com", name: "Alex Original" });
  });

  it("only accepts online-loanable items", async () => {
    seed("available", []);
    db.items[0]!.online_loanable = false;
    expect(await createLoanRequest(request)).toEqual({ ok: false, reason: "invalid" });
  });

  it("only accepts asset items", async () => {
    seed("available", []);
    db.items[0]!.tracking_mode = "consumable";
    db.items[0]!.qty_on_hand = 10;
    expect(await createLoanRequest(request)).toEqual({ ok: false, reason: "invalid" });
  });

  it("rejects an impossible calendar date", async () => {
    seed("available", []);
    expect(await createLoanRequest({ ...request, endDate: "2026-02-31" })).toEqual({
      ok: false,
      reason: "invalid",
    });
  });

  it("fails closed when the active loan count cannot be read", async () => {
    seed("available", []);
    seedBorrower();
    db.failOn = /count\(\*\)::text as count from loans where borrower_id/;
    expect(await createLoanRequest(request)).toEqual({ ok: false, reason: "error" });
    expect(db.loans).toHaveLength(0);
  });

  it("enforces the concurrent loan limit", async () => {
    seed("available", []);
    seedBorrower();
    db.borrowers[0]!.max_concurrent_loans = 1;
    db.loans.push(loan({ status: "pending", unit_id: null }));
    expect(await createLoanRequest(request)).toEqual({ ok: false, reason: "limit-exceeded" });
  });

  it("locks the borrower row before counting, inside one transaction", async () => {
    seed("available", []);
    await createLoanRequest(request);
    const texts = db.statements.map((s) => s.text);
    const begin = texts.indexOf("begin");
    const lock = texts.findIndex((t) =>
      /from borrowers where tu_student_id = \$1 for update/.test(t)
    );
    const count = texts.findIndex((t) => /from loans where borrower_id/.test(t));
    const insert = texts.findIndex((t) => t.startsWith("insert into loans"));
    const commit = texts.indexOf("commit");
    expect(begin).toBeGreaterThanOrEqual(0);
    expect(lock).toBeGreaterThan(begin);
    expect(count).toBeGreaterThan(lock);
    expect(insert).toBeGreaterThan(count);
    expect(commit).toBeGreaterThan(insert);
  });
});
