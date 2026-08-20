/**
 * Gate 7 (`docs/DECISIONS-2.0.md`, decided 2026-08-20): a chassis request
 * names its subject in the route, `/do/[service]/[subject]/[step]`.
 *
 * Complements `tests/unit/service-chassis.test.ts` (the no-subject chassis)
 * and `tests/unit/service-equipment-loan.test.ts` (the loan definition and
 * store, updated alongside this file since gate 7 is what moves `save()`
 * from throwing to working). This file owns everything new: the `subject`
 * declaration on `ServiceDefinition`, its resolver registry
 * (`lib/services/subject.ts`), and the href/draft-scope/`Submission`
 * plumbing in `lib/services/intake.ts` that carries a resolved subject
 * through to a store.
 */
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import { validateServiceDefinition, type ServiceDefinition } from "@/lib/services/defineService";
import {
  serviceStepHrefs,
  nextStepHref,
  checkAnswersChangeHref,
  submitService,
  getSubmissionStore,
  _resetSubmissionStoreForTests,
  type Submission,
  type SubmissionStore,
} from "@/lib/services/intake";
import {
  registerSubjectResolver,
  resolveSubject,
  isSubjectSourceRegistered,
  subjectDraftScope,
  _resetSubjectResolversForTests,
  type SubjectResolver,
} from "@/lib/services/subject";
import { activities } from "@/content/privacy/register";

const REAL_ACTIVITY_ID = "equipment-loan"; // content/privacy/register.ts, retentionTrigger "closed"
const REAL_ACTIVITY_TRIGGER = activities.find((a) => a.id === REAL_ACTIVITY_ID)!.retentionTrigger;

function baseContext() {
  return {
    knownPrivacyActivityIds: activities.map((a) => a.id),
    implementedRetentionActivityIds: [REAL_ACTIVITY_ID],
    registerRetentionTriggers: Object.fromEntries(
      activities.map((a) => [a.id, a.retentionTrigger])
    ),
    sensitiveServiceIds: [] as string[],
  };
}

/** A definition with no `subject`, the same shape every service had before gate 7. */
function noSubjectDefinition(overrides: Partial<ServiceDefinition> = {}): ServiceDefinition {
  return {
    id: "test-no-subject",
    owner: "general-coordination",
    secondHolder: "rights-and-welfare",
    start: {
      title: { en: "Test service", th: "บริการทดสอบ" },
      whoFor: { en: "Testers", th: "ผู้ทดสอบ" },
      before: [{ en: "Nothing", th: "ไม่มี" }],
      howLong: { en: "Two minutes", th: "สองนาที" },
      whatNext: { en: "We reply by email", th: "เราจะตอบกลับทางอีเมล" },
    },
    questions: [
      { id: "name", type: "short-text", label: { en: "Name", th: "ชื่อ" }, required: true },
      { id: "email", type: "email", label: { en: "Email", th: "อีเมล" }, required: true },
    ],
    standardHours: 48,
    escalateTo: "rights-and-welfare",
    privacyActivityId: REAL_ACTIVITY_ID,
    retentionTrigger: REAL_ACTIVITY_TRIGGER,
    sensitive: false,
    ...overrides,
  };
}

const TEST_SUBJECT_SOURCE = "test-subject-source";

/** A definition that declares a subject against `TEST_SUBJECT_SOURCE`. */
function subjectDefinition(overrides: Partial<ServiceDefinition> = {}): ServiceDefinition {
  return {
    ...noSubjectDefinition(),
    id: "test-with-subject",
    subject: {
      source: TEST_SUBJECT_SOURCE,
      paramName: "widget",
      label: { en: "widget", th: "วิดเจ็ต" },
    },
    ...overrides,
  };
}

function fakeResolver(available: Record<string, { en: string; th: string }>): SubjectResolver {
  return {
    async resolve(key: string) {
      const name = available[key];
      if (!name) return { ok: false };
      return { ok: true, key, name };
    },
  };
}

// ---------------------------------------------------------------------------
// A service with no subject keeps its old two-segment URLs and still submits.
// ---------------------------------------------------------------------------

describe("a service with no subject", () => {
  const definition = noSubjectDefinition();

  it("builds its old two-segment step hrefs, unaffected by gate 7", () => {
    expect(serviceStepHrefs(definition)).toEqual([
      "/do/test-no-subject/name",
      "/do/test-no-subject/email",
      "/do/test-no-subject/check",
      "/do/test-no-subject/confirm",
    ]);
  });

  it("nextStepHref and checkAnswersChangeHref are unchanged with no subject argument", () => {
    expect(nextStepHref(definition, "name")).toBe("/do/test-no-subject/email");
    expect(checkAnswersChangeHref(definition, "email")).toBe(
      "/do/test-no-subject/email?returnTo=check"
    );
  });

  it("subjectDraftScope with no subject is exactly the service id, so every existing draft cookie name is unchanged", () => {
    expect(subjectDraftScope("test-no-subject")).toBe("test-no-subject");
    expect(subjectDraftScope("test-no-subject", undefined)).toBe("test-no-subject");
  });

  beforeEach(() => _resetSubmissionStoreForTests());

  it("still submits and persists, with no subject on the stored Submission", async () => {
    const outcome = await submitService(
      definition,
      { name: "Nueng", email: "nueng@example.com" },
      "en"
    );
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      const stored = await getSubmissionStore().findByReference(definition.id, outcome.reference);
      expect(stored).not.toBeNull();
      expect(stored!.subject).toBeUndefined();
    }
  });
});

// ---------------------------------------------------------------------------
// A subject-taking service builds /do/[service]/[subject]/[step], in order.
// ---------------------------------------------------------------------------

describe("a subject-taking service", () => {
  const definition = subjectDefinition();

  it("builds three-segment step hrefs, in serviceSteps order, once a subject is supplied", () => {
    expect(serviceStepHrefs(definition, "widget-1")).toEqual([
      "/do/test-with-subject/widget-1/name",
      "/do/test-with-subject/widget-1/email",
      "/do/test-with-subject/widget-1/check",
      "/do/test-with-subject/widget-1/confirm",
    ]);
  });

  it("nextStepHref and checkAnswersChangeHref carry the subject through when it is given", () => {
    expect(nextStepHref(definition, "name", undefined, "widget-1")).toBe(
      "/do/test-with-subject/widget-1/email"
    );
    expect(checkAnswersChangeHref(definition, "email", "widget-1")).toBe(
      "/do/test-with-subject/widget-1/email?returnTo=check"
    );
  });

  it("falls back to the two-segment shape if no subject is supplied at all (a caller bug, not a crash)", () => {
    expect(serviceStepHrefs(definition)).toEqual([
      "/do/test-with-subject/name",
      "/do/test-with-subject/email",
      "/do/test-with-subject/check",
      "/do/test-with-subject/confirm",
    ]);
  });

  it("scopes drafts per subject, so two different subjects of the same service never collide", () => {
    const scopeA = subjectDraftScope("test-with-subject", "widget-1");
    const scopeB = subjectDraftScope("test-with-subject", "widget-2");
    expect(scopeA).not.toBe(scopeB);
    expect(scopeA).not.toBe("test-with-subject");
    expect(scopeB).not.toBe("test-with-subject");
  });
});

// ---------------------------------------------------------------------------
// Resolving a subject: found, unknown, retired.
// ---------------------------------------------------------------------------

describe("resolveSubject", () => {
  beforeEach(() => {
    _resetSubjectResolversForTests();
    registerSubjectResolver(
      TEST_SUBJECT_SOURCE,
      fakeResolver({ "widget-1": { en: "Widget one", th: "วิดเจ็ตหนึ่ง" } })
    );
  });
  afterEach(() => _resetSubjectResolversForTests());

  it("resolves a real subject to its name in both locales", async () => {
    const outcome = await resolveSubject(subjectDefinition(), "widget-1");
    expect(outcome).toEqual({ ok: true, key: "widget-1", name: { en: "Widget one", th: "วิดเจ็ตหนึ่ง" } });
  });

  it("does not resolve an unknown subject", async () => {
    const outcome = await resolveSubject(subjectDefinition(), "no-such-widget");
    expect(outcome).toEqual({ ok: false });
  });

  it("does not resolve once nothing is registered (retired resolver, or a definition read before load)", async () => {
    _resetSubjectResolversForTests();
    const outcome = await resolveSubject(subjectDefinition(), "widget-1");
    expect(outcome).toEqual({ ok: false });
  });

  it("does not resolve at all for a definition with no subject", async () => {
    const outcome = await resolveSubject(noSubjectDefinition(), "anything");
    expect(outcome).toEqual({ ok: false });
  });

  it("a retired subject reads exactly like an unknown one to resolveSubject's caller", async () => {
    // The resolver itself is what tells "retired" and "never existed" apart
    // internally (lib/services/loanSubmissionStore.ts's own resolver checks
    // `isRetired`); resolveSubject's contract only ever exposes ok/not-ok,
    // so a route always gets one proper not-found, never a distinction it
    // would have to invent copy for.
    _resetSubjectResolversForTests();
    registerSubjectResolver(TEST_SUBJECT_SOURCE, {
      async resolve() {
        return { ok: false };
      },
    });
    const outcome = await resolveSubject(subjectDefinition(), "widget-1");
    expect(outcome.ok).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// validateServiceDefinition rule 9: a subject naming an unregistered source
// fails at load.
// ---------------------------------------------------------------------------

describe("validateServiceDefinition rule 9: subject.source needs a registered resolver", () => {
  beforeEach(() => _resetSubjectResolversForTests());
  afterEach(() => _resetSubjectResolversForTests());

  it("a definition with no subject at all has no rule 9 problems", () => {
    const problems = validateServiceDefinition(noSubjectDefinition(), baseContext());
    expect(problems.some((p) => p.field.startsWith("subject"))).toBe(false);
  });

  it("fails to publish when its subject.source has no registered resolver", () => {
    const definition = subjectDefinition({
      subject: {
        source: "nobody-registered-this-source",
        paramName: "widget",
        label: { en: "widget", th: "วิดเจ็ต" },
      },
    });
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "subject.source")).toBe(true);
  });

  it("publishes once a resolver is registered for its source, with the resolver as the only thing that changed", () => {
    const definition = subjectDefinition();

    const before = validateServiceDefinition(definition, baseContext());
    expect(before.some((p) => p.field === "subject.source")).toBe(true);

    registerSubjectResolver(TEST_SUBJECT_SOURCE, fakeResolver({}));
    const after = validateServiceDefinition(definition, baseContext());
    expect(after.some((p) => p.field === "subject.source")).toBe(false);
  });

  it("requires both locales on subject.label", () => {
    registerSubjectResolver(TEST_SUBJECT_SOURCE, fakeResolver({}));
    const definition = subjectDefinition({
      subject: { source: TEST_SUBJECT_SOURCE, paramName: "widget", label: { en: "widget", th: "" } },
    });
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "subject.label")).toBe(true);
  });

  it("requires a non-empty paramName", () => {
    registerSubjectResolver(TEST_SUBJECT_SOURCE, fakeResolver({}));
    const definition = subjectDefinition({
      subject: {
        source: TEST_SUBJECT_SOURCE,
        paramName: "  ",
        label: { en: "widget", th: "วิดเจ็ต" },
      },
    });
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "subject.paramName")).toBe(true);
  });

  it("isSubjectSourceRegistered reflects registration directly", () => {
    expect(isSubjectSourceRegistered(TEST_SUBJECT_SOURCE)).toBe(false);
    registerSubjectResolver(TEST_SUBJECT_SOURCE, fakeResolver({}));
    expect(isSubjectSourceRegistered(TEST_SUBJECT_SOURCE)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// submitService carries the resolved subject through to the Submission a
// store receives.
// ---------------------------------------------------------------------------

describe("submitService carries a resolved subject through to the store", () => {
  it("passes subject on the Submission it hands the store", async () => {
    const definition = subjectDefinition();
    const save = vi.fn(async (submission: Submission) => ({
      ok: true as const,
      reference: submission.reference,
    }));
    const store: SubmissionStore = {
      save,
      findByReference: async () => null,
      listByService: async () => [],
    };

    await submitService(
      definition,
      { name: "Nueng", email: "nueng@example.com" },
      "en",
      store,
      "widget-1"
    );

    expect(save).toHaveBeenCalledTimes(1);
    expect(save.mock.calls[0]![0]!.subject).toBe("widget-1");
  });

  it("leaves subject undefined for a service with none, exactly as before gate 7", async () => {
    const definition = noSubjectDefinition();
    const save = vi.fn(async (submission: Submission) => ({
      ok: true as const,
      reference: submission.reference,
    }));
    const store: SubmissionStore = {
      save,
      findByReference: async () => null,
      listByService: async () => [],
    };

    await submitService(definition, { name: "Nueng", email: "nueng@example.com" }, "en", store);

    expect(save.mock.calls[0]![0]!.subject).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// THE GATE 7 ACCEPTANCE TEST: loanSubmissionStore.save() receives the item
// and creates a loan, mocked the same way
// tests/unit/service-equipment-loan.test.ts already mocks it.
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

describe("gate 7 closed: loanSubmissionStore.save() no longer throws for a real item", () => {
  beforeEach(async () => {
    loans.createLoanRequest.mockReset();
    borrowers.getBorrower.mockReset();
    items.getItemByKey.mockReset();
    items.getItemByKey.mockResolvedValue({
      key: "test-projector",
      name: { en: "Test projector", th: "โปรเจกเตอร์ทดสอบ" },
      isRetired: false,
    });
    loans.createLoanRequest.mockResolvedValue({ ok: true, reference: "test-projector-9f2a" });
  });

  it("submitService, given a real chassis draft and a resolved subject, ends with a real loan created", async () => {
    const { equipmentLoan } = await import("@/lib/services/definitions/equipment-loan");
    const { loanSubmissionStore } = await import("@/lib/services/loanSubmissionStore");

    const outcome = await submitService(
      equipmentLoan,
      {
        name: "Nueng Somchai",
        "student-id": "6412345678",
        email: "nueng@dome.tu.ac.th",
        phone: "0812345678",
        dates: "2027-01-10..2027-01-12",
        reason: "A club event",
      },
      "en",
      loanSubmissionStore,
      "test-projector"
    );

    expect(outcome).toEqual({ ok: true, reference: "test-projector-9f2a" });
    expect(loans.createLoanRequest).toHaveBeenCalledTimes(1);
    expect(loans.createLoanRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        itemKey: "test-projector",
        startDate: "2027-01-10",
        endDate: "2027-01-12",
      })
    );
  });

  it("equipmentLoan's own subject.source resolves through the registered item resolver", async () => {
    const { equipmentLoan } = await import("@/lib/services/definitions/equipment-loan");
    await import("@/lib/services/loanSubmissionStore");

    const resolution = await resolveSubject(equipmentLoan, "test-projector");
    expect(resolution).toEqual({
      ok: true,
      key: "test-projector",
      name: { en: "Test projector", th: "โปรเจกเตอร์ทดสอบ" },
    });
  });

  it("equipmentLoan's subject.source does not resolve a retired item", async () => {
    items.getItemByKey.mockResolvedValue({
      key: "old-camera",
      name: { en: "Old camera", th: "กล้องเก่า" },
      isRetired: true,
    });
    const { equipmentLoan } = await import("@/lib/services/definitions/equipment-loan");
    await import("@/lib/services/loanSubmissionStore");

    const resolution = await resolveSubject(equipmentLoan, "old-camera");
    expect(resolution).toEqual({ ok: false });
  });
});
