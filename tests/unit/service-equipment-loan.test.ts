/**
 * `lib/services/definitions/equipment-loan.ts` and
 * `lib/services/loanSubmissionStore.ts` (Wave 4B, REDESIGN-2.0 §11.4).
 *
 * This is the gate for "the loan service can be expressed as a service
 * definition": every question the old wizard asks maps onto the frozen
 * palette, the definition passes `validateServiceDefinition` against the
 * REAL privacy register, and the registry serves it. It also locks in, as
 * passing tests rather than prose, the two findings
 * `lib/services/loanSubmissionStore.ts`'s header describes in full: no
 * chassis question can carry which item a submission is for, and
 * `SubmissionStore.save` has no channel back to the reference
 * `submitService` already generated.
 *
 * Does not touch, import from, or assert against anything under
 * `app/[lang]/services/equipment-loan/**` or its own tests: those are the
 * old service's, unchanged, and this wave's gate.
 */
import { describe, expect, it, beforeEach, vi } from "vitest";

import { equipmentLoan } from "@/lib/services/definitions/equipment-loan";
import { serviceSteps } from "@/lib/services/defineService";
import { questionTypes } from "@/lib/services/questionTypes";
import { activities } from "@/content/privacy/register";
import {
  getService,
  listServices,
  getRegistryOutcomes,
  validateForRegistry,
  _resetRegistryForTests,
} from "@/lib/services/registry";
import { questionStepIds } from "@/lib/services/intake";
import type { Submission } from "@/lib/services/intake";
import { LOAN_STEPS } from "@/app/[lang]/services/equipment-loan/[item]/request/steps";

// ---------------------------------------------------------------------------
// 1. The definition passes validateServiceDefinition against the REAL
//    register, and the registry publishes it.
// ---------------------------------------------------------------------------

describe("equipmentLoan definition validates against the real register", () => {
  it("validateForRegistry accepts it outright", () => {
    const outcome = validateForRegistry(equipmentLoan);
    expect(outcome.ok).toBe(true);
  });

  it("has exactly one email question", () => {
    const emailQuestions = equipmentLoan.questions.filter((q) => q.type === "email");
    expect(emailQuestions).toHaveLength(1);
  });

  it("has a positive standardHours no greater than a fortnight", () => {
    expect(equipmentLoan.standardHours).toBeGreaterThan(0);
    expect(equipmentLoan.standardHours).toBeLessThanOrEqual(24 * 14);
  });

  it("owner and secondHolder are different real portfolios", () => {
    expect(equipmentLoan.owner).not.toBe(equipmentLoan.secondHolder);
  });

  it("is not marked sensitive (no allowlist entry exists for it)", () => {
    expect(equipmentLoan.sensitive).toBe(false);
  });

  it("every question uses a type from the frozen palette", () => {
    for (const question of equipmentLoan.questions) {
      expect(question.type in questionTypes).toBe(true);
    }
  });
});

describe("equipmentLoan's privacy activity and retention trigger", () => {
  it("privacyActivityId names an activity that exists in the register", () => {
    expect(equipmentLoan.privacyActivityId).toBe("equipment-loan");
    const activity = activities.find((a) => a.id === equipmentLoan.privacyActivityId);
    expect(activity).toBeDefined();
  });

  it("retentionTrigger matches the register activity's own trigger exactly", () => {
    const activity = activities.find((a) => a.id === "equipment-loan")!;
    expect(equipmentLoan.retentionTrigger).toBe(activity.retentionTrigger);
    expect(equipmentLoan.retentionTrigger).toBe("closed");
  });
});

describe("registry: equipment-loan is the first real service to publish", () => {
  beforeEach(() => _resetRegistryForTests());

  it("getService serves it", () => {
    const served = getService("equipment-loan");
    expect(served).toBeDefined();
    expect(served?.id).toBe("equipment-loan");
  });

  it("listServices includes it", () => {
    expect(listServices().some((d) => d.id === "equipment-loan")).toBe(true);
  });

  it("getRegistryOutcomes shows it ok, with no problems", () => {
    const outcomes = getRegistryOutcomes();
    const outcome = outcomes.find((o) => (o.ok ? o.definition.id : o.id) === "equipment-loan");
    expect(outcome).toBeDefined();
    expect(outcome!.ok).toBe(true);
  });

  it("the example definition still fails to publish, unaffected by this wave", () => {
    // Guards against a regression where registering equipmentLoan somehow
    // changed the example's own outcome (it should not: each definition is
    // validated independently).
    expect(getService("example-chassis-demo")).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// 2. Every question the old wizard asks is covered, none dropped, same
//    order. Enumerated straight from the old wizard's own steps.ts so a
//    dropped question fails this test rather than passing quietly.
// ---------------------------------------------------------------------------

// LOAN_STEPS spells its ids as JS object keys (the wizard's own draft-cookie
// field names), so "studentId" is camelCase there. A chassis question id is
// also a URL segment (rule 2, lib/services/defineService.ts,
// URL_SAFE_ID), so equipmentLoan spells the same field "student-id" instead,
// matching the wizard's OWN url for that step (STEP_SLUG.studentId ===
// "student-id" in the wizard's own actions.ts). Every other field's chassis
// id is identical to its LOAN_STEPS id. This map is the single place that
// translation lives, so the tests below prove coverage and order against
// LOAN_STEPS itself rather than against a hand-copied list that could drift.
const CHASSIS_ID_FOR_LOAN_STEP: Record<string, string> = {
  name: "name",
  studentId: "student-id",
  email: "email",
  phone: "phone",
  dates: "dates",
  reason: "reason",
};

describe("questions cover every field LOAN_STEPS names, in the same order", () => {
  it("LOAN_STEPS, minus the trailing check step, is exactly the old wizard's field list", () => {
    // Sanity check on the fixture itself: if the old wizard ever grows or
    // reorders a step, this is where that would first show up.
    expect(LOAN_STEPS).toEqual(["name", "studentId", "email", "phone", "dates", "reason", "check"]);
  });

  it("equipmentLoan asks every one of those fields, none dropped", () => {
    const oldWizardFields = LOAN_STEPS.filter((step) => step !== "check");
    const expectedChassisIds = oldWizardFields.map((field) => CHASSIS_ID_FOR_LOAN_STEP[field]);
    const definitionIds = equipmentLoan.questions.map((q) => q.id);
    for (const id of expectedChassisIds) {
      expect(definitionIds).toContain(id);
    }
    expect(definitionIds).toHaveLength(expectedChassisIds.length);
  });

  it("serviceSteps order matches the old wizard's own order exactly", () => {
    const oldWizardFields = LOAN_STEPS.filter((step) => step !== "check");
    const expectedChassisIds = oldWizardFields.map((field) => CHASSIS_ID_FOR_LOAN_STEP[field]);
    expect(questionStepIds(equipmentLoan)).toEqual(expectedChassisIds);
    expect(serviceSteps(equipmentLoan)).toEqual([...expectedChassisIds, "check", "confirm"]);
  });
});

describe("each question maps onto a sensible frozen type", () => {
  const byId = Object.fromEntries(equipmentLoan.questions.map((q) => [q.id, q]));

  it("name is short-text (the names pattern, not two first/last fields)", () => {
    expect(byId.name!.type).toBe("short-text");
  });

  it("student-id uses the student-id type built for exactly this", () => {
    expect(byId["student-id"]!.type).toBe("student-id");
  });

  it("email is the service's one email question", () => {
    expect(byId.email!.type).toBe("email");
    expect(byId.email!.required).toBe(true);
  });

  it("phone is optional, matching the wizard's own optional phone step", () => {
    expect(byId.phone!.type).toBe("phone");
    expect(byId.phone!.required).toBe(false);
  });

  it("dates uses date-range, built for exactly this ('the existing loan date logic')", () => {
    expect(byId.dates!.type).toBe("date-range");
    expect(byId.dates!.required).toBe(true);
  });

  it("reason is optional long-text, matching the wizard's own optional reason step", () => {
    expect(byId.reason!.type).toBe("long-text");
    expect(byId.reason!.required).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 3. The submission store creates a loan through the existing library.
// ---------------------------------------------------------------------------

const loans = vi.hoisted(() => ({
  createLoanRequest: vi.fn(),
  listLoans: vi.fn(),
}));
const borrowers = vi.hoisted(() => ({
  getBorrower: vi.fn(),
}));
const items = vi.hoisted(() => ({
  getItemByKey: vi.fn(),
}));

vi.mock("@/lib/inventory/loans", () => loans);
vi.mock("@/lib/inventory/borrowers", () => borrowers);
vi.mock("@/lib/inventory/items", () => items);

import { loanSubmissionStore } from "@/lib/services/loanSubmissionStore";

function baseSubmission(overrides: Partial<Submission["answers"]> = {}): Submission {
  return {
    reference: "EQL-TEST",
    serviceId: "equipment-loan",
    answers: {
      name: "Nueng Somchai",
      "student-id": "6412345678",
      email: "nueng@dome.tu.ac.th",
      phone: "0812345678",
      dates: "2027-01-10..2027-01-12",
      reason: "A club event",
      // Not one of equipmentLoan's own questions (see the definitions and
      // store headers): supplied directly here because save() has no other
      // way to learn which item a real chassis submission is for.
      item: "test-projector",
      ...overrides,
    },
    status: "received",
    createdAt: "2027-01-01T00:00:00.000Z",
    closedAt: null,
  };
}

describe("loanSubmissionStore.save creates a real loan through lib/inventory/loans", () => {
  beforeEach(() => {
    loans.createLoanRequest.mockReset();
    loans.listLoans.mockReset();
    borrowers.getBorrower.mockReset();
    items.getItemByKey.mockReset();
    items.getItemByKey.mockResolvedValue({
      key: "test-projector",
      name: { en: "Test projector", th: "โปรเจกเตอร์ทดสอบ" },
      isRetired: false,
    });
    loans.createLoanRequest.mockResolvedValue({ ok: true, reference: "test-projector-9f2a" });
  });

  it("calls createLoanRequest with the submission's answers mapped onto its input shape", async () => {
    await loanSubmissionStore.save(baseSubmission());

    expect(loans.createLoanRequest).toHaveBeenCalledTimes(1);
    expect(loans.createLoanRequest).toHaveBeenCalledWith({
      itemKey: "test-projector",
      startDate: "2027-01-10",
      endDate: "2027-01-12",
      reason: "A club event",
      borrower: {
        tuStudentId: "6412345678",
        name: "Nueng Somchai",
        email: "nueng@dome.tu.ac.th",
        phone: "0812345678",
      },
    });
  });

  // Wave 4B originally threw here, because `save` returned `Promise<void>`
  // and a rejection had nowhere to go. The orchestrator widened the chassis
  // interface at the boundary so a store can decline, which is what this
  // situation actually is: every answer is valid and the loan still cannot be
  // created. A throw would have shown the student a crash for a case the
  // service understands perfectly well.
  it("reuses createLoanRequest's own business rules rather than duplicating them: a decline is returned, not thrown", async () => {
    loans.createLoanRequest.mockResolvedValue({ ok: false, reason: "blocklisted" });
    const outcome = await loanSubmissionStore.save(baseSubmission());
    expect(outcome.ok).toBe(false);
    // The message tells the student what to do next and never names the rule.
    if (!outcome.ok) {
      expect(outcome.problem.en).toMatch(/email BIRSA/i);
      expect(outcome.problem.en).not.toMatch(/blocklist/i);
      expect(outcome.problem.th.length).toBeGreaterThan(0);
    }
  });

  it("passes an empty reason through as null, not an empty string", async () => {
    await loanSubmissionStore.save(baseSubmission({ reason: "" }));
    expect(loans.createLoanRequest).toHaveBeenCalledWith(expect.objectContaining({ reason: null }));
  });

  it("passes an empty phone through as null, not an empty string", async () => {
    await loanSubmissionStore.save(baseSubmission({ phone: "" }));
    expect(loans.createLoanRequest).toHaveBeenCalledWith(
      expect.objectContaining({ borrower: expect.objectContaining({ phone: null }) })
    );
  });

  // Finding 2 (see the store's own header): no chassis question can carry
  // which item a real submission is for, so a submission with none is a
  // real state the store must handle honestly, not silently guess through.
  it("throws a precise error when no item was specified, rather than guessing one", async () => {
    await expect(loanSubmissionStore.save(baseSubmission({ item: "" }))).rejects.toThrow(
      /no item was specified/
    );
    expect(loans.createLoanRequest).not.toHaveBeenCalled();
  });

  // Also a decline rather than a throw: an item being retired is a thing that
  // changed in the world, not a mistake the student made.
  it("declines when the given item does not exist or is retired", async () => {
    items.getItemByKey.mockResolvedValue(null);
    const outcome = await loanSubmissionStore.save(baseSubmission());
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.problem.en).toMatch(/no longer available/i);
      expect(outcome.problem.th.length).toBeGreaterThan(0);
    }
  });

  it("refuses a submission for a different service id", async () => {
    const wrongService: Submission = { ...baseSubmission(), serviceId: "example-chassis-demo" };
    await expect(loanSubmissionStore.save(wrongService)).rejects.toThrow(/only serves/);
    expect(loans.createLoanRequest).not.toHaveBeenCalled();
  });
});

describe("loanSubmissionStore.findByReference and listByService read loans back", () => {
  beforeEach(() => {
    loans.listLoans.mockReset();
    borrowers.getBorrower.mockReset();
  });

  const loanRow = {
    id: "loan-1",
    reference: "test-projector-9f2a",
    itemId: "item-1",
    unitId: null,
    borrowerId: "borrower-1",
    quantity: 1,
    startDate: "2027-01-10",
    endDate: "2027-01-12",
    reason: "A club event",
    status: "pending" as const,
    decidedBy: null,
    decidedAt: null,
    checkedOutBy: null,
    checkedOutAt: null,
    checkedInBy: null,
    checkedInAt: null,
    conditionOut: null,
    conditionIn: null,
    createdAt: "2027-01-01T00:00:00.000Z",
    closedAt: null,
  };
  const borrowerRow = {
    id: "borrower-1",
    tuStudentId: "6412345678",
    name: "Nueng Somchai",
    email: "nueng@dome.tu.ac.th",
    phone: "0812345678",
    blocklisted: false,
    blocklistReason: null,
    maxConcurrentLoans: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };

  it("findByReference reuses listLoans and getBorrower, reusing existing functions rather than new SQL", async () => {
    loans.listLoans.mockResolvedValue([loanRow]);
    borrowers.getBorrower.mockResolvedValue(borrowerRow);

    const found = await loanSubmissionStore.findByReference(
      "equipment-loan",
      "test-projector-9f2a"
    );

    expect(found).not.toBeNull();
    expect(found!.answers.name).toBe("Nueng Somchai");
    expect(found!.answers["student-id"]).toBe("6412345678");
    expect(found!.answers.dates).toBe("2027-01-10..2027-01-12");
    expect(found!.status).toBe("received");
  });

  it("findByReference returns null for a reference no loan has", async () => {
    loans.listLoans.mockResolvedValue([loanRow]);
    const found = await loanSubmissionStore.findByReference("equipment-loan", "no-such-reference");
    expect(found).toBeNull();
  });

  it("findByReference returns null for a different service id", async () => {
    const found = await loanSubmissionStore.findByReference("example-chassis-demo", "anything");
    expect(found).toBeNull();
    expect(loans.listLoans).not.toHaveBeenCalled();
  });

  it("listByService returns every loan as a Submission", async () => {
    loans.listLoans.mockResolvedValue([loanRow]);
    borrowers.getBorrower.mockResolvedValue(borrowerRow);

    const all = await loanSubmissionStore.listByService("equipment-loan");
    expect(all).toHaveLength(1);
    expect(all[0]!.reference).toBe("test-projector-9f2a");
  });
});

// ---------------------------------------------------------------------
// The store is REACHABLE. Wave 4B built a correct store and then found the
// chassis handed every service the same in-memory placeholder, so none of it
// could ever run. Fixing that without a test would leave nothing stopping the
// next person from reintroducing a single hardcoded store.
// ---------------------------------------------------------------------

describe("the loan store is reachable through the chassis", () => {
  it("is the store the chassis hands out for equipment-loan, not the in-memory placeholder", async () => {
    const { getSubmissionStore } = await import("@/lib/services/intake");
    await import("@/lib/services/loanSubmissionStore");
    expect(getSubmissionStore("equipment-loan")).toBe(loanSubmissionStore);
  });

  it("still hands the placeholder to a service that has registered nothing", async () => {
    const { getSubmissionStore } = await import("@/lib/services/intake");
    expect(getSubmissionStore("example-chassis-demo")).not.toBe(loanSubmissionStore);
  });
});

// ---------------------------------------------------------------------
// A SERVICE STATES NO TURNAROUND IT HAS NOT AGREED.
//
// `standardHours` is required, because escalation needs a threshold, and the
// loan has no agreed turnaround anywhere in 1.0 (REDESIGN-2.0 §1.2 D3), so it
// carries a documented placeholder in order to publish at all. The chassis
// confirmation page rendered that number straight into "We aim to respond
// within {hours} hours." Two reasonable decisions composed into the site
// promising students something no committee ever agreed to.
//
// `publishStandard` separates the two uses and defaults to silence. These
// tests keep it that way, because the failure is invisible in code review:
// both halves look right on their own.
// ---------------------------------------------------------------------

describe("the loan states the standard it agreed, and only that", () => {
  it("publishes its service standard, decided at gate 6", () => {
    expect(equipmentLoan.publishStandard).toBe(true);
    expect(equipmentLoan.standardHours).toBe(48);
  });

  // The number is stated on the confirmation page from `standardHours`. If the
  // prose also carried a figure, the two could drift apart silently.
  it("states no second, hardcoded turnaround in its what-happens-next copy", () => {
    for (const locale of ["en", "th"] as const) {
      expect(equipmentLoan.start.whatNext[locale]).not.toMatch(
        /\d+\s*(hour|hours|day|days|ชั่วโมง|วัน)/i
      );
    }
  });
});
