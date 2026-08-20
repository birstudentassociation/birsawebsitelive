/**
 * The service chassis: registry, intake, status, queue, escalation
 * (REDESIGN-2.0 §5.1, §5.2). Complements `tests/unit/service-validation.test.ts`,
 * which owns `validateServiceDefinition` itself; this file exercises the
 * modules built on top of it.
 */
import { describe, expect, it, beforeEach } from "vitest";

import type { ServiceDefinition } from "@/lib/services/defineService";
import { serviceSteps } from "@/lib/services/defineService";
import {
  getService,
  listServices,
  getRegistryOutcomes,
  validateForRegistry,
  _resetRegistryForTests,
} from "@/lib/services/registry";
import {
  buildCheckAnswersRows,
  checkAnswersChangeHref,
  emailQuestion,
  generateReference,
  getSubmissionStore,
  nextStepHref,
  previousStepHref,
  questionStepIds,
  stepIndex,
  submitService,
  validateFullDraft,
  _resetSubmissionStoreForTests,
  type Submission,
} from "@/lib/services/intake";
import { lookupSubmission } from "@/lib/services/status";
import { applyQueueDecision, openQueueItems, scopeQueueToPortfolio } from "@/lib/services/queue";
import { escalationBatch, escalationBatches, isOverdue } from "@/lib/services/escalation";
import { validateAnswer } from "@/lib/services/validate";
import { activities } from "@/content/privacy/register";

function testDefinition(overrides: Partial<ServiceDefinition> = {}): ServiceDefinition {
  return {
    id: "test-chassis-service",
    owner: "general-coordination",
    secondHolder: "rights-and-welfare",
    start: {
      title: { en: "Test chassis service", th: "บริการทดสอบระบบ" },
      whoFor: { en: "Testers", th: "ผู้ทดสอบ" },
      before: [{ en: "Nothing", th: "ไม่มี" }],
      howLong: { en: "Two minutes", th: "สองนาที" },
      whatNext: { en: "We reply by email", th: "เราจะตอบกลับทางอีเมล" },
    },
    questions: [
      { id: "name", type: "short-text", label: { en: "Name", th: "ชื่อ" }, required: true },
      { id: "email", type: "email", label: { en: "Email", th: "อีเมล" }, required: true },
      {
        id: "topic",
        type: "choose-one",
        label: { en: "Topic", th: "หัวข้อ" },
        required: true,
        options: [
          { value: "a", label: { en: "A", th: "ก" } },
          { value: "b", label: { en: "B", th: "ข" } },
        ],
      },
    ],
    standardHours: 48,
    escalateTo: "rights-and-welfare",
    privacyActivityId: "equipment-loan",
    retentionTrigger: activities.find((a) => a.id === "equipment-loan")!.retentionTrigger,
    sensitive: false,
    ...overrides,
  };
}

// ---- registry --------------------------------------------------------------

describe("registry", () => {
  beforeEach(() => _resetRegistryForTests());

  it("serves the one shipped example definition (by id), even though it cannot publish", () => {
    // lib/services/definitions/example-chassis-demo.ts is deliberately
    // invalid (see that file's own header): it collects personal data (its
    // mandatory email question) with no privacy register entry. So the
    // registry must NOT serve it, and that refusal is the actual point.
    expect(getService("example-chassis-demo")).toBeUndefined();
  });

  it("reports why the example definition was refused", () => {
    const outcomes = getRegistryOutcomes();
    const example = outcomes.find(
      (o) => (o.ok ? o.definition.id : o.id) === "example-chassis-demo"
    );
    expect(example).toBeDefined();
    expect(example!.ok).toBe(false);
    if (!example!.ok) {
      expect(example!.problems.some((p) => p.field === "privacyActivityId")).toBe(true);
    }
  });

  it("refuses an invalid definition at load and never lists it", () => {
    expect(listServices().some((d) => d.id === "example-chassis-demo")).toBe(false);
  });

  it("validateForRegistry accepts a definition that satisfies every rule", () => {
    const outcome = validateForRegistry(testDefinition());
    expect(outcome.ok).toBe(true);
  });

  it("validateForRegistry rejects a definition that fails a rule, with the problems attached", () => {
    const outcome = validateForRegistry(testDefinition({ standardHours: -1 }));
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.problems.some((p) => p.field === "standardHours")).toBe(true);
    }
  });

  it("getService returns undefined for an id nothing defines", () => {
    expect(getService("this-service-does-not-exist")).toBeUndefined();
  });
});

// ---- intake: step order and navigation --------------------------------------

describe("intake: step order and navigation", () => {
  const definition = testDefinition();

  it("advances through questions in serviceSteps order", () => {
    expect(questionStepIds(definition)).toEqual(["name", "email", "topic"]);
    expect(serviceSteps(definition)).toEqual(["name", "email", "topic", "check", "confirm"]);
  });

  it("nextStepHref moves to the following question", () => {
    expect(nextStepHref(definition, "name")).toBe("/do/test-chassis-service/email");
    expect(nextStepHref(definition, "email")).toBe("/do/test-chassis-service/topic");
  });

  it("nextStepHref goes to check after the last question", () => {
    expect(nextStepHref(definition, "topic")).toBe("/do/test-chassis-service/check");
  });

  it("nextStepHref honours returnTo=check from any question", () => {
    expect(nextStepHref(definition, "name", "check")).toBe("/do/test-chassis-service/check");
  });

  it("previousStepHref moves to the preceding question", () => {
    expect(previousStepHref(definition, "topic")).toBe("/do/test-chassis-service/email");
  });

  it("previousStepHref goes to the service start page before the first question", () => {
    expect(previousStepHref(definition, "name")).toBe("/do/test-chassis-service");
  });

  it("stepIndex finds each question's position", () => {
    expect(stepIndex(definition, "name")).toBe(0);
    expect(stepIndex(definition, "topic")).toBe(2);
    expect(stepIndex(definition, "check")).toBe(-1);
  });
});

// ---- intake: draft never re-asked, check answers, change links -------------

describe("intake: check answers never re-asks a question it already has", () => {
  const definition = testDefinition();

  it("shows every answered question's stored answer, not a blank field", () => {
    const rows = buildCheckAnswersRows(
      definition,
      { name: "Nueng", email: "nueng@example.com", topic: "a" },
      "en",
      { notAnswered: "Not answered", yes: "Yes", no: "No", listSeparator: ", " }
    );
    expect(rows.find((r) => r.id === "name")!.answer).toBe("Nueng");
    expect(rows.find((r) => r.id === "topic")!.answer).toBe("A");
  });

  it("marks an unanswered optional question as not answered, never as an error", () => {
    const rows = buildCheckAnswersRows(definition, { name: "Nueng" }, "en", {
      notAnswered: "Not answered",
      yes: "Yes",
      no: "No",
      listSeparator: ", ",
    });
    expect(rows.find((r) => r.id === "email")!.answer).toBe("Not answered");
  });

  it("gives every row a change link back to its own question, that returns to check", () => {
    const rows = buildCheckAnswersRows(definition, {}, "en", {
      notAnswered: "Not answered",
      yes: "Yes",
      no: "No",
      listSeparator: ", ",
    });
    expect(rows.find((r) => r.id === "email")!.changeHref).toBe(
      "/do/test-chassis-service/email?returnTo=check"
    );
    expect(checkAnswersChangeHref(definition, "topic")).toBe(
      "/do/test-chassis-service/topic?returnTo=check"
    );
  });

  it("a changed question's own step redirects back to check, not onward to the next question", () => {
    // This is the other half of the same guarantee: the change link points
    // at ?returnTo=check, and nextStepHref (what a step's server action
    // calls to decide where to send the reader next) honours it.
    expect(nextStepHref(definition, "email", "check")).toBe("/do/test-chassis-service/check");
  });
});

// ---- intake: full-draft validation ------------------------------------------

describe("intake: validateFullDraft", () => {
  const definition = testDefinition();

  it("accepts a complete, valid draft", () => {
    const result = validateFullDraft(
      definition,
      { name: "Nueng", email: "nueng@example.com", topic: "a" },
      "en"
    );
    expect(result).toEqual({ ok: true });
  });

  it("rejects a draft missing a required answer", () => {
    const result = validateFullDraft(definition, { name: "Nueng" }, "en");
    expect(result).toEqual({ ok: false, firstInvalidQuestionId: "email" });
  });

  it("rejects a draft with an answer that fails its own type's validation", () => {
    const result = validateFullDraft(
      definition,
      { name: "Nueng", email: "not-an-email", topic: "a" },
      "en"
    );
    expect(result).toEqual({ ok: false, firstInvalidQuestionId: "email" });
  });
});

// ---- intake: submit, reference, persistence ---------------------------------

describe("intake: submitService", () => {
  beforeEach(() => _resetSubmissionStoreForTests());

  it("generates a reference and persists the submission on a valid draft", async () => {
    const definition = testDefinition();
    const outcome = await submitService(
      definition,
      { name: "Nueng", email: "nueng@example.com", topic: "a" },
      "en"
    );
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.reference).toMatch(/^[A-Z0-9]+-[A-Z2-7]{4}$/);
      const stored = await getSubmissionStore().findByReference(definition.id, outcome.reference);
      expect(stored).not.toBeNull();
      expect(stored!.answers.email).toBe("nueng@example.com");
      expect(stored!.status).toBe("received");
    }
  });

  it("refuses to submit an incomplete draft", async () => {
    const definition = testDefinition();
    const outcome = await submitService(definition, { name: "Nueng" }, "en");
    expect(outcome).toEqual({ ok: false, reason: "invalid", firstInvalidQuestionId: "email" });
  });

  it("emailQuestion finds the one email question rule 4 guarantees", () => {
    const definition = testDefinition();
    expect(emailQuestion(definition)?.id).toBe("email");
  });

  it("generateReference produces the service's initials plus a random suffix", () => {
    const reference = generateReference("test-chassis-service");
    expect(reference.startsWith("TCS-")).toBe(true);
  });
});

// ---- status: reference plus corroborating detail, both required ------------

describe("status: lookupSubmission", () => {
  beforeEach(() => _resetSubmissionStoreForTests());

  async function seedSubmission(): Promise<{ definition: ServiceDefinition; reference: string }> {
    const definition = testDefinition();
    const outcome = await submitService(
      definition,
      { name: "Nueng", email: "nueng@example.com", topic: "a" },
      "en"
    );
    if (!outcome.ok) throw new Error("fixture setup failed");
    return { definition, reference: outcome.reference };
  }

  it("finds a submission by its reference and matching email, case-insensitively", async () => {
    const { definition, reference } = await seedSubmission();
    const outcome = await lookupSubmission(
      getSubmissionStore(),
      definition,
      reference,
      "NUENG@EXAMPLE.COM"
    );
    expect(outcome.ok).toBe(true);
  });

  it("requires the reference: a blank reference is invalid, not a miss", async () => {
    const { definition } = await seedSubmission();
    const outcome = await lookupSubmission(
      getSubmissionStore(),
      definition,
      "",
      "nueng@example.com"
    );
    expect(outcome).toEqual({ ok: false, reason: "invalid" });
  });

  it("requires the corroborating detail: a blank detail is invalid, not a miss", async () => {
    const { definition, reference } = await seedSubmission();
    const outcome = await lookupSubmission(getSubmissionStore(), definition, reference, "");
    expect(outcome).toEqual({ ok: false, reason: "invalid" });
  });

  it("refuses a real reference with the wrong detail, the same way as a reference that does not exist", async () => {
    const { definition, reference } = await seedSubmission();
    const wrongDetail = await lookupSubmission(
      getSubmissionStore(),
      definition,
      reference,
      "someone-else@example.com"
    );
    const noSuchReference = await lookupSubmission(
      getSubmissionStore(),
      definition,
      "NOPE-0000",
      "nueng@example.com"
    );
    expect(wrongDetail).toEqual({ ok: false, reason: "not-found" });
    expect(noSuchReference).toEqual({ ok: false, reason: "not-found" });
  });
});

// ---- queue: pure functions, scoped to portfolio -----------------------------

describe("queue", () => {
  it("scopes services to the portfolio that owns or holds them", () => {
    const owned = testDefinition({ id: "owned", owner: "general-coordination" });
    const held = testDefinition({ id: "held", secondHolder: "general-coordination" });
    const unrelated = testDefinition({
      id: "unrelated",
      owner: "sport",
      secondHolder: "merchandise",
    });
    const scoped = scopeQueueToPortfolio([owned, held, unrelated], "general-coordination");
    expect(scoped.map((d) => d.id).sort()).toEqual(["held", "owned"]);
  });

  it("lists open items oldest first and excludes done ones", () => {
    const submissions: Submission[] = [
      makeSubmission({ reference: "A", createdAt: "2026-01-03T00:00:00.000Z", status: "received" }),
      makeSubmission({ reference: "B", createdAt: "2026-01-01T00:00:00.000Z", status: "received" }),
      makeSubmission({ reference: "C", createdAt: "2026-01-02T00:00:00.000Z", status: "done" }),
    ];
    const open = openQueueItems(submissions);
    expect(open.map((s) => s.reference)).toEqual(["B", "A"]);
  });

  it("applyQueueDecision closes the submission and sets closedAt, without mutating the input", () => {
    const submission = makeSubmission({ reference: "A", status: "received" });
    const decided = applyQueueDecision(submission, "approve", new Date("2026-02-01T00:00:00.000Z"));
    expect(decided.status).toBe("done");
    expect(decided.closedAt).toBe("2026-02-01T00:00:00.000Z");
    expect(submission.status).toBe("received");
    expect(submission.closedAt).toBeNull();
  });
});

// ---- escalation: fires only after standardHours -----------------------------

describe("escalation", () => {
  const definition = testDefinition({ standardHours: 48, escalateTo: "rights-and-welfare" });

  it("is not overdue before standardHours has passed", () => {
    const submission = makeSubmission({
      createdAt: "2026-01-01T00:00:00.000Z",
      status: "received",
    });
    const now = new Date("2026-01-02T23:00:00.000Z"); // 47 hours later
    expect(isOverdue(submission, definition, now)).toBe(false);
  });

  it("is overdue exactly at standardHours", () => {
    const submission = makeSubmission({
      createdAt: "2026-01-01T00:00:00.000Z",
      status: "received",
    });
    const now = new Date("2026-01-03T00:00:00.000Z"); // exactly 48 hours later
    expect(isOverdue(submission, definition, now)).toBe(true);
  });

  it("is never overdue once closed, however old it is", () => {
    const submission = makeSubmission({
      createdAt: "2020-01-01T00:00:00.000Z",
      status: "done",
    });
    expect(isOverdue(submission, definition, new Date("2026-01-01T00:00:00.000Z"))).toBe(false);
  });

  it("escalationBatch escalates to the service's own escalateTo portfolio", () => {
    const overdue = makeSubmission({
      reference: "OVERDUE",
      createdAt: "2026-01-01T00:00:00.000Z",
      status: "received",
    });
    const notYet = makeSubmission({
      reference: "FRESH",
      createdAt: "2026-01-02T23:00:00.000Z",
      status: "received",
    });
    const batch = escalationBatch(
      definition,
      [overdue, notYet],
      new Date("2026-01-03T00:00:00.000Z")
    );
    expect(batch.escalateTo).toBe("rights-and-welfare");
    expect(batch.submissions.map((s) => s.reference)).toEqual(["OVERDUE"]);
  });

  it("escalationBatches skips services with nothing overdue", () => {
    const other = testDefinition({ id: "other-service", standardHours: 48 });
    const now = new Date("2026-01-03T00:00:00.000Z");
    const batches = escalationBatches(
      [definition, other],
      {
        [definition.id]: [
          makeSubmission({ createdAt: "2026-01-01T00:00:00.000Z", status: "received" }),
        ],
        [other.id]: [makeSubmission({ createdAt: "2026-01-02T23:30:00.000Z", status: "received" })],
      },
      now
    );
    expect(batches.map((b) => b.serviceId)).toEqual([definition.id]);
  });
});

// ---- validate.ts: a light coverage check, kept small since the eleven types --
// ---- are the primary subject of tests/unit/service-validation.test.ts's own --
// ---- fixtures via validateFullDraft above. -----------------------------------

describe("validate.ts: yes-no requires an actual yes or no", () => {
  it("rejects a required yes-no left blank", () => {
    const question = {
      id: "confirm",
      type: "yes-no" as const,
      label: { en: "Agree", th: "ยินยอม" },
      required: true,
    };
    const formData = new FormData();
    const result = validateAnswer(question, formData, "en");
    expect(result.ok).toBe(false);
  });

  it("accepts yes", () => {
    const question = {
      id: "confirm",
      type: "yes-no" as const,
      label: { en: "Agree", th: "ยินยอม" },
      required: true,
    };
    const formData = new FormData();
    formData.set("confirm", "yes");
    const result = validateAnswer(question, formData, "en");
    expect(result).toEqual({ ok: true, value: "yes" });
  });
});

function makeSubmission(overrides: Partial<Submission> = {}): Submission {
  return {
    reference: "REF-0000",
    serviceId: "test-chassis-service",
    answers: {},
    status: "received",
    createdAt: "2026-01-01T00:00:00.000Z",
    closedAt: null,
    ...overrides,
  };
}
