import { describe, expect, it } from "vitest";
import {
  MAX_DISMISSED_REVIEW_PROMPTS,
  deserialisePlan,
  envelopeOf,
  parseStoredPlans,
  serialiseEnvelope,
  serialisePlan,
  type PlanEnvelope,
  type StudyPlan,
} from "@/lib/study-plan/plan";
import {
  MAX_REVIEW_PROMPTS,
  academicTermOf,
  justEndedTerm,
  reviewPromptCodes,
} from "@/lib/study-plan/reviewPrompt";
import {
  addScenario,
  deleteScenario,
  dismissReviewPrompt,
  isReviewPromptDismissed,
  renameScenario,
  setActivePlan,
  switchScenario,
} from "@/lib/study-plan/scenarioStore";

// Cohort 66 started in B.E. 2566, so study year 3 is academic year 2568,
// which ran from August 2025 to July 2026.
const plan: StudyPlan = {
  versionId: "2568",
  cohort: "66",
  startYear: 2566,
  minorId: "governance",
  passed: ["PI121"],
  freeElectiveCreditsPassed: 0,
  terms: [
    { term: { year: 3, kind: "semester1" }, codes: ["PI211", "PI271"], freeElectiveCredits: 0 },
    { term: { year: 3, kind: "semester2" }, codes: ["PI280", "PI390"], freeElectiveCredits: 3 },
    { term: { year: 4, kind: "semester1" }, codes: ["PI364"], freeElectiveCredits: 0 },
  ],
};

/** An instant in Asia/Bangkok, written as the wall clock there. */
const bangkok = (iso: string) => new Date(`${iso}+07:00`);

describe("which term has just ended", () => {
  it("maps a plan's study year and term onto the calendar", () => {
    expect(academicTermOf(plan, { year: 1, kind: "semester1" })).toEqual({
      academicYear: 2566,
      kind: "semester1",
    });
    expect(academicTermOf(plan, { year: 3, kind: "summer" })).toEqual({
      academicYear: 2568,
      kind: "summer",
    });
  });

  it("is semester 2 during the summer session", () => {
    const ended = justEndedTerm(plan, bangkok("2026-06-15T12:00:00"));
    expect(ended?.term).toEqual({ academicYear: 2568, kind: "semester2" });
    expect(ended?.codes).toEqual(["PI280", "PI390"]);
  });

  it("is semester 1 during semester 2", () => {
    const ended = justEndedTerm(plan, bangkok("2026-03-10T12:00:00"));
    expect(ended?.term).toEqual({ academicYear: 2568, kind: "semester1" });
    expect(ended?.codes).toEqual(["PI211", "PI271"]);
  });

  it("is semester 1 of the new year after semester 2 when the plan has it", () => {
    const ended = justEndedTerm(plan, bangkok("2027-01-05T12:00:00"));
    expect(ended?.term).toEqual({ academicYear: 2569, kind: "semester1" });
    expect(ended?.codes).toEqual(["PI364"]);
  });

  describe("at the boundaries of the academic calendar (Asia/Bangkok)", () => {
    it("is still semester 2 at the last second of May, so semester 1 is what ended", () => {
      expect(justEndedTerm(plan, bangkok("2026-05-31T23:59:59"))?.term.kind).toBe("semester1");
    });

    it("turns to the summer session at midnight on 1 June, so semester 2 is what ended", () => {
      const ended = justEndedTerm(plan, bangkok("2026-06-01T00:00:00"));
      expect(ended?.term).toEqual({ academicYear: 2568, kind: "semester2" });
    });

    it("is still the summer session at the last second of July", () => {
      const ended = justEndedTerm(plan, bangkok("2026-07-31T23:59:59"));
      expect(ended?.term.kind).toBe("semester2");
    });

    it("turns to semester 1 at midnight on 1 August, and steps back over an empty summer", () => {
      // The summer session just gone holds nothing in this plan, so semester 2 is the term that ended.
      const ended = justEndedTerm(plan, bangkok("2026-08-01T00:00:00"));
      expect(ended?.term).toEqual({ academicYear: 2568, kind: "semester2" });
      expect(ended?.codes).toEqual(["PI280", "PI390"]);
    });

    it("uses the summer session when the plan does have courses in it", () => {
      const withSummer: StudyPlan = {
        ...plan,
        terms: [
          ...plan.terms,
          { term: { year: 3, kind: "summer" }, codes: ["PI574"], freeElectiveCredits: 0 },
        ],
      };
      const ended = justEndedTerm(withSummer, bangkok("2026-08-01T00:00:00"));
      expect(ended?.term).toEqual({ academicYear: 2568, kind: "summer" });
      expect(ended?.codes).toEqual(["PI574"]);
    });

    it("steps back over an empty summer only, never over an empty semester", () => {
      // In September 2026 the previous term is the empty summer, so semester 2 is used,
      // but in October 2026 of a plan with nothing in semester 2 there is no further looking back.
      const sparse: StudyPlan = { ...plan, terms: [plan.terms[0]!] };
      expect(justEndedTerm(sparse, bangkok("2026-09-01T12:00:00"))).toBeNull();
    });

    it("runs through the turn of the Gregorian year inside semester 1", () => {
      // 31 December and 1 January are a day apart but the term changes at the year's turn:
      // December is semester 1, January semester 2.
      const december = justEndedTerm(plan, bangkok("2026-12-31T23:59:59"));
      const january = justEndedTerm(plan, bangkok("2027-01-01T00:00:00"));
      expect(december?.term).toEqual({ academicYear: 2568, kind: "semester2" });
      expect(january?.term).toEqual({ academicYear: 2569, kind: "semester1" });
      expect(january?.codes).toEqual(["PI364"]);
    });
  });

  it("is null when the plan has nothing in the term that ended", () => {
    // October 2026 is semester 1 of 2569; the term before is the empty summer, then semester 2 of 2568.
    // A plan whose courses are all later has nothing to ask about.
    const future: StudyPlan = {
      ...plan,
      terms: [{ term: { year: 4, kind: "semester2" }, codes: ["PI364"], freeElectiveCredits: 0 }],
    };
    expect(justEndedTerm(future, bangkok("2026-10-01T12:00:00"))).toBeNull();
    expect(reviewPromptCodes(future, bangkok("2026-10-01T12:00:00"))).toEqual([]);
  });

  it("offers only the one term that just ended, not older ones", () => {
    // In March 2027 (semester 2 of 2569) the term that ended is semester 1 of 2569, and the
    // courses of 2568 are no longer "last term".
    const march = justEndedTerm(plan, bangkok("2027-03-01T12:00:00"));
    expect(march?.codes).toEqual(["PI364"]);
  });

  it("is null for a plan with no terms", () => {
    expect(justEndedTerm({ ...plan, terms: [] }, bangkok("2026-06-15T12:00:00"))).toBeNull();
  });

  it("does not read the host's timezone: the same instant gives the same answer", () => {
    // 2026-07-31T17:00:00Z is midnight on 1 August in Bangkok whatever the host thinks.
    expect(justEndedTerm(plan, new Date("2026-07-31T16:59:59Z"))?.term.kind).toBe("semester2");
    expect(justEndedTerm(plan, new Date("2026-07-31T17:00:00Z"))?.term.kind).toBe("semester2");
    expect(justEndedTerm(plan, new Date("2026-07-31T17:00:00Z"))?.term.academicYear).toBe(2568);
  });
});

describe("which courses to ask about", () => {
  const june = bangkok("2026-06-15T12:00:00");

  it("lists the courses of the term that ended, in plan order", () => {
    expect(reviewPromptCodes(plan, june)).toEqual(["PI280", "PI390"]);
  });

  it("leaves out courses the student dismissed", () => {
    expect(reviewPromptCodes(plan, june, ["PI280"])).toEqual(["PI390"]);
    expect(reviewPromptCodes(plan, june, ["PI280", "PI390"])).toEqual([]);
    expect(reviewPromptCodes(plan, june, ["PI211"])).toEqual(["PI280", "PI390"]);
  });

  it("asks about a course once, and about no more than a few at a time", () => {
    const busy: StudyPlan = {
      ...plan,
      terms: [
        {
          term: { year: 3, kind: "semester2" },
          codes: ["PI280", "PI280", "PI390", "PI364", "PI365", "PI366"],
          freeElectiveCredits: 0,
        },
      ],
    };
    expect(MAX_REVIEW_PROMPTS).toBe(3);
    expect(reviewPromptCodes(busy, june)).toEqual(["PI280", "PI390", "PI364"]);
    // Dismissing one brings the next into view.
    expect(reviewPromptCodes(busy, june, ["PI280"])).toEqual(["PI390", "PI364", "PI365"]);
  });

  it("does not count free elective credits, which are not courses", () => {
    const creditsOnly: StudyPlan = {
      ...plan,
      terms: [{ term: { year: 3, kind: "semester2" }, codes: [], freeElectiveCredits: 3 }],
    };
    expect(reviewPromptCodes(creditsOnly, june)).toEqual([]);
  });
});

describe("remembering a dismissal in the stored envelope", () => {
  const envelope = envelopeOf(plan);

  it("starts empty", () => {
    expect(envelope.dismissedReviewPrompts).toEqual([]);
    expect(isReviewPromptDismissed(envelope, "PI280")).toBe(false);
  });

  it("records a dismissal per course, once", () => {
    const once = dismissReviewPrompt(envelope, "PI280");
    expect(once.dismissedReviewPrompts).toEqual(["PI280"]);
    expect(isReviewPromptDismissed(once, "PI280")).toBe(true);
    expect(isReviewPromptDismissed(once, "PI390")).toBe(false);
    expect(dismissReviewPrompt(once, "PI280")).toBe(once);
    expect(dismissReviewPrompt(once, "PI390").dismissedReviewPrompts).toEqual(["PI280", "PI390"]);
  });

  it("does not change the envelope it was given", () => {
    dismissReviewPrompt(envelope, "PI280");
    expect(envelope.dismissedReviewPrompts).toEqual([]);
  });

  it("survives a trip through storage", () => {
    const dismissed = dismissReviewPrompt(dismissReviewPrompt(envelope, "PI280"), "PI390");
    const restored = parseStoredPlans(serialiseEnvelope(dismissed));
    expect(restored).toEqual(dismissed);
    expect(restored?.dismissedReviewPrompts).toEqual(["PI280", "PI390"]);
  });

  it("is kept when scenarios are added, renamed, switched, deleted or the plan is edited", () => {
    const dismissed = dismissReviewPrompt(envelope, "PI280");
    const other: StudyPlan = { ...plan, minorId: "publicAdministration" };
    const added = addScenario(dismissed, "Other minor", other)!;
    expect(added.dismissedReviewPrompts).toEqual(["PI280"]);
    expect(renameScenario(added, "s2", "Renamed")!.dismissedReviewPrompts).toEqual(["PI280"]);
    expect(switchScenario(added, "s1")!.dismissedReviewPrompts).toEqual(["PI280"]);
    expect(deleteScenario(added, "s2")!.dismissedReviewPrompts).toEqual(["PI280"]);
    expect(setActivePlan(added, plan).dismissedReviewPrompts).toEqual(["PI280"]);
  });

  it("forgets the oldest past its bound, never throwing", () => {
    let full: PlanEnvelope = envelope;
    for (let i = 0; i < MAX_DISMISSED_REVIEW_PROMPTS + 5; i += 1) {
      full = dismissReviewPrompt(full, `PI${100 + i}`);
    }
    expect(full.dismissedReviewPrompts).toHaveLength(MAX_DISMISSED_REVIEW_PROMPTS);
    // The oldest went, the newest stayed.
    expect(full.dismissedReviewPrompts).not.toContain("PI100");
    expect(full.dismissedReviewPrompts.at(-1)).toBe(`PI${100 + MAX_DISMISSED_REVIEW_PROMPTS + 4}`);
  });
});

describe("migrating the envelope", () => {
  /** The envelope as a build from before the field existed would have written it. */
  const withoutField = (envelope: PlanEnvelope) => {
    const old: Partial<PlanEnvelope> = { ...envelope };
    delete old.dismissedReviewPrompts;
    return JSON.stringify(old);
  };

  it("reads a version 2 envelope written before the field existed, with none dismissed", () => {
    const old = withoutField(envelopeOf(plan));
    expect(old).not.toContain("dismissedReviewPrompts");
    const parsed = parseStoredPlans(old);
    expect(parsed?.dismissedReviewPrompts).toEqual([]);
    expect(parsed?.plans[0]?.plan).toEqual(plan);
  });

  it("migrates a version 1 bare plan with none dismissed, as before", () => {
    const parsed = parseStoredPlans(serialisePlan(plan));
    expect(parsed).toEqual(envelopeOf(plan));
    expect(parsed?.dismissedReviewPrompts).toEqual([]);
  });

  it("still returns the active plan from either shape", () => {
    expect(deserialisePlan(withoutField(envelopeOf(plan)))).toEqual(plan);
    expect(
      deserialisePlan(serialiseEnvelope(dismissReviewPrompt(envelopeOf(plan), "PI280")))
    ).toEqual(plan);
  });

  it("refuses a dismissal list that is not course codes, rather than throwing", () => {
    const good = envelopeOf(plan);
    for (const bad of [
      ["not a code"],
      [42],
      "PI280",
      [""],
      ["<script>"],
      new Array(MAX_DISMISSED_REVIEW_PROMPTS + 1).fill("PI280"),
    ]) {
      expect(parseStoredPlans(JSON.stringify({ ...good, dismissedReviewPrompts: bad }))).toBeNull();
    }
  });

  it("keeps a plain envelope with an empty list equal to a fresh one", () => {
    expect(parseStoredPlans(serialiseEnvelope(envelopeOf(plan)))).toEqual(envelopeOf(plan));
  });
});
