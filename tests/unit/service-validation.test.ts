/**
 * `validateServiceDefinition` (REDESIGN-2.0 §5.1 item 10, §6.7).
 *
 * This is the test that carries the most weight in Wave 4A: every rule
 * `lib/services/defineService.ts`'s own TSDoc names, each with a definition
 * that violates exactly that rule and a passing counterpart, per the Wave 4A
 * brief's own instruction. The single most important case is
 * "a service collecting personal data with no register entry fails to
 * publish", marked below, because it is the test that encodes REDESIGN-2.0
 * §5.1 item 10: built eleven times by hand, a retention rule gets forgotten;
 * built once, the chassis can refuse to publish a service that has none.
 */
import { describe, expect, it } from "vitest";

import { validateServiceDefinition, type ServiceDefinition } from "@/lib/services/defineService";
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

/** A complete, valid definition. Every test below mutates a copy of this rather than building one from scratch, so each test isolates exactly one rule. */
function validDefinition(): ServiceDefinition {
  return {
    id: "test-service",
    owner: "general-coordination",
    secondHolder: "rights-and-welfare",
    start: {
      title: { en: "Test service", th: "บริการทดสอบ" },
      whoFor: { en: "Anyone testing the chassis", th: "ผู้ทดสอบระบบ" },
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
    privacyActivityId: REAL_ACTIVITY_ID,
    retentionTrigger: REAL_ACTIVITY_TRIGGER,
    sensitive: false,
  };
}

describe("a valid definition", () => {
  it("has no problems", () => {
    expect(validateServiceDefinition(validDefinition(), baseContext())).toEqual([]);
  });
});

describe("rule 1: start fields, both locales, publish-blocking", () => {
  it("blocks a missing English title", () => {
    const definition = validDefinition();
    definition.start.title = { en: "", th: "บริการทดสอบ" };
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "start.title")).toBe(true);
  });

  it("blocks a missing Thai whoFor", () => {
    const definition = validDefinition();
    definition.start.whoFor = { en: "Anyone", th: "" };
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "start.whoFor")).toBe(true);
  });

  it("blocks an empty before list", () => {
    const definition = validDefinition();
    definition.start.before = [];
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "start.before")).toBe(true);
  });

  it("blocks a before item missing one locale", () => {
    const definition = validDefinition();
    definition.start.before = [{ en: "Something", th: "" }];
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "start.before[0]")).toBe(true);
  });

  it("blocks a missing howLong", () => {
    const definition = validDefinition();
    definition.start.howLong = { en: "", th: "" };
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "start.howLong")).toBe(true);
  });

  it("blocks a missing whatNext", () => {
    const definition = validDefinition();
    definition.start.whatNext = { en: "", th: "" };
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "start.whatNext")).toBe(true);
  });

  it("passes when every start field is complete in both locales", () => {
    expect(validateServiceDefinition(validDefinition(), baseContext())).toEqual([]);
  });
});

describe("rule 2: at least one question, every id unique and URL safe", () => {
  it("blocks zero questions", () => {
    const definition = validDefinition();
    definition.questions = [];
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "questions")).toBe(true);
  });

  it("blocks a duplicate question id", () => {
    const definition = validDefinition();
    definition.questions.push({
      id: "name",
      type: "short-text",
      label: { en: "Name again", th: "ชื่ออีกครั้ง" },
      required: false,
    });
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "questions" && p.message.en.includes("unique"))).toBe(
      true
    );
  });

  it("blocks a question id that is not URL safe", () => {
    const definition = validDefinition();
    definition.questions[0]!.id = "Not A Safe Id!";
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "questions[0].id")).toBe(true);
  });

  it("passes with unique, URL-safe ids", () => {
    expect(validateServiceDefinition(validDefinition(), baseContext())).toEqual([]);
  });
});

describe("rule 3: choose-one and choose-several need at least two options", () => {
  it("blocks a choose-one with one option", () => {
    const definition = validDefinition();
    definition.questions.push({
      id: "single-choice",
      type: "choose-one",
      label: { en: "Pick one", th: "เลือกหนึ่ง" },
      required: true,
      options: [{ value: "only", label: { en: "Only", th: "อย่างเดียว" } }],
    });
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "questions[3].options")).toBe(true);
  });

  it("blocks a choose-several with no options", () => {
    const definition = validDefinition();
    definition.questions.push({
      id: "many-choice",
      type: "choose-several",
      label: { en: "Pick some", th: "เลือกหลายรายการ" },
      required: false,
      options: [],
    });
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "questions[3].options")).toBe(true);
  });

  it("passes with two or more options", () => {
    expect(validateServiceDefinition(validDefinition(), baseContext())).toEqual([]);
  });
});

describe("rule 4: exactly one email question", () => {
  it("blocks zero email questions", () => {
    const definition = validDefinition();
    definition.questions = definition.questions.filter((q) => q.type !== "email");
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "questions" && p.message.en.includes("email"))).toBe(
      true
    );
  });

  it("blocks two email questions", () => {
    const definition = validDefinition();
    definition.questions.push({
      id: "second-email",
      type: "email",
      label: { en: "Second email", th: "อีเมลที่สอง" },
      required: true,
    });
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "questions" && p.message.en.includes("email"))).toBe(
      true
    );
  });

  it("passes with exactly one", () => {
    expect(validateServiceDefinition(validDefinition(), baseContext())).toEqual([]);
  });
});

describe("rule 5: standardHours positive and no more than a fortnight", () => {
  it("blocks zero", () => {
    const definition = validDefinition();
    definition.standardHours = 0;
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "standardHours")).toBe(true);
  });

  it("blocks a negative number", () => {
    const definition = validDefinition();
    definition.standardHours = -5;
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "standardHours")).toBe(true);
  });

  it("blocks more than a fortnight", () => {
    const definition = validDefinition();
    definition.standardHours = 337;
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "standardHours")).toBe(true);
  });

  it("passes at exactly a fortnight", () => {
    const definition = validDefinition();
    definition.standardHours = 336;
    expect(validateServiceDefinition(definition, baseContext())).toEqual([]);
  });

  it("passes with a positive number under the ceiling", () => {
    expect(validateServiceDefinition(validDefinition(), baseContext())).toEqual([]);
  });
});

describe("rule 6: personal data needs a register entry with an implemented retention path (REDESIGN-2.0 section 5.1 item 10)", () => {
  // THIS IS THE TEST. A service that collects personal data (it always does:
  // rule 4 forces exactly one email question, and every email question
  // collects personal data per lib/services/questionTypes.ts) but has no
  // privacy register entry must fail to publish. This is the rule the whole
  // chassis exists for, and this is the case that proves it is enforced
  // rather than merely documented.
  it("fails to publish when it collects personal data and privacyActivityId is null", () => {
    const definition = validDefinition();
    definition.privacyActivityId = null;
    definition.retentionTrigger = null;
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "privacyActivityId")).toBe(true);
  });

  it("fails when privacyActivityId names an activity the register does not have", () => {
    const definition = validDefinition();
    definition.privacyActivityId = "not-a-real-activity";
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "privacyActivityId")).toBe(true);
  });

  it("fails when the register has the activity but retention.ts has no implemented path for it", () => {
    const definition = validDefinition();
    // "contact-message" is a real register activity, but lib/privacy/retention.ts
    // never purges it (storage is "email", not a Postgres table it queries),
    // so it is deliberately absent from this test's implementedRetentionActivityIds.
    definition.privacyActivityId = "contact-message";
    definition.retentionTrigger = "created";
    const context = baseContext();
    // Confirm the fixture is honest: "contact-message" really is a known
    // register activity, just not an implemented one.
    expect(context.knownPrivacyActivityIds).toContain("contact-message");
    expect(context.implementedRetentionActivityIds).not.toContain("contact-message");
    const problems = validateServiceDefinition(definition, context);
    expect(problems.some((p) => p.field === "privacyActivityId")).toBe(true);
  });

  it("fails when retentionTrigger does not match the register activity's own trigger", () => {
    const definition = validDefinition();
    definition.privacyActivityId = REAL_ACTIVITY_ID;
    // The real register entry's trigger is "closed"; claim something else.
    definition.retentionTrigger = REAL_ACTIVITY_TRIGGER === "created" ? "closed" : "created";
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "retentionTrigger")).toBe(true);
  });

  it("fails when retentionTrigger is left unset even though privacyActivityId is set", () => {
    const definition = validDefinition();
    definition.retentionTrigger = null;
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "retentionTrigger")).toBe(true);
  });

  it("passes when the activity exists, the trigger matches, and retention.ts implements it", () => {
    expect(validateServiceDefinition(validDefinition(), baseContext())).toEqual([]);
  });

  it("does not require a register entry when nothing collects personal data", () => {
    const definition = validDefinition();
    // Replace the email question (rule 4 still needs exactly one) is not
    // possible without breaking rule 4, so this exercises the OTHER
    // direction of the same idea: a definition with no privacyActivityId and
    // no personal-data question does not trip rule 6 at all. Built directly
    // rather than derived from validDefinition(), since every valid,
    // rule-4-satisfying definition necessarily collects personal data.
    const noPersonalData: ServiceDefinition = {
      ...definition,
      privacyActivityId: null,
      retentionTrigger: null,
      questions: [
        {
          id: "confirm",
          type: "yes-no",
          label: { en: "Do you agree", th: "ท่านยินยอมหรือไม่" },
          required: true,
        },
      ],
    };
    const problems = validateServiceDefinition(noPersonalData, baseContext());
    // Rule 4 (exactly one email question) still fires, since this fixture
    // has none, but rule 6 must not: no problem should mention the privacy
    // register at all.
    expect(problems.some((p) => p.field === "privacyActivityId")).toBe(false);
    expect(problems.some((p) => p.field === "retentionTrigger")).toBe(false);
  });
});

describe("rule 7: owner and secondHolder must differ", () => {
  it("blocks the same portfolio holding both", () => {
    const definition = validDefinition();
    definition.secondHolder = definition.owner;
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "secondHolder")).toBe(true);
  });

  it("passes with two different portfolios", () => {
    expect(validateServiceDefinition(validDefinition(), baseContext())).toEqual([]);
  });
});

describe("rule 8: sensitive must match the code-side allowlist", () => {
  it("blocks sensitive: true with no allowlist entry", () => {
    const definition = validDefinition();
    definition.sensitive = true;
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.some((p) => p.field === "sensitive")).toBe(true);
  });

  it("blocks sensitive: false when the code allowlists this id", () => {
    const definition = validDefinition();
    const context = { ...baseContext(), sensitiveServiceIds: [definition.id] };
    const problems = validateServiceDefinition(definition, context);
    expect(problems.some((p) => p.field === "sensitive")).toBe(true);
  });

  it("passes when sensitive: true matches an allowlist entry", () => {
    const definition = validDefinition();
    definition.sensitive = true;
    const context = { ...baseContext(), sensitiveServiceIds: [definition.id] };
    expect(validateServiceDefinition(definition, context)).toEqual([]);
  });

  it("passes when sensitive: false matches no allowlist entry", () => {
    expect(validateServiceDefinition(validDefinition(), baseContext())).toEqual([]);
  });
});

describe("every problem is reported, not just the first", () => {
  it("reports several unrelated problems from one bad definition", () => {
    const definition = validDefinition();
    definition.start.title = { en: "", th: "" };
    definition.standardHours = -1;
    definition.secondHolder = definition.owner;
    const problems = validateServiceDefinition(definition, baseContext());
    const fields = problems.map((p) => p.field);
    expect(fields).toContain("start.title");
    expect(fields).toContain("standardHours");
    expect(fields).toContain("secondHolder");
  });
});

describe("every problem carries a bilingual message", () => {
  it("gives every finding both an English and a Thai message", () => {
    const definition = validDefinition();
    definition.start.title = { en: "", th: "" };
    definition.privacyActivityId = null;
    definition.retentionTrigger = null;
    const problems = validateServiceDefinition(definition, baseContext());
    expect(problems.length).toBeGreaterThan(0);
    for (const problem of problems) {
      expect(problem.message.en.length).toBeGreaterThan(0);
      expect(problem.message.th.length).toBeGreaterThan(0);
    }
  });
});
