import { describe, expect, it } from "vitest";
import {
  evaluate,
  parseProfile,
  resolveTopic,
  serializeProfile,
  stepQuery,
  validateService,
  visibleOptions,
} from "@/lib/smart-answers";
import { service } from "@/content/smart-answers";
import type {
  SmartAnswerNode,
  SmartAnswerService,
  SmartAnswerTopic,
} from "@/content/smart-answers/types";
import { audienceQuestions } from "@/content/smart-answers/audience";
import { documents } from "@/content/activity/regulations";
import type { Provision, Section } from "@/content/activity/regulations";
import { locales } from "@/lib/i18n";

/* -------------------------------------------------------------------------- */
/* The published service                                                      */
/* -------------------------------------------------------------------------- */

describe("the published service is structurally sound", () => {
  it("has no validation problems", () => {
    expect(validateService(service)).toEqual([]);
  });

  it("keeps the topic slugs that are linked from elsewhere on the site", () => {
    const slugs = new Set(service.topics.map((topic) => topic.slug));
    for (const slug of ["start", "who-to-contact", "activity-approval", "start-a-club-check"]) {
      expect(slugs).toContain(slug);
    }
  });

  it("reaches an outcome from every topic, for every audience combination", () => {
    // Exhaustive over the audience space, including "not set" on each
    // dimension, since a condition that hides the last visible option would
    // strand exactly one kind of reader and nobody else.
    const optionsFor = (dimension: string) => [
      undefined,
      ...(audienceQuestions
        .find((question) => question.dimension === dimension)
        ?.choices.map((choice) => choice.value) ?? []),
    ];

    for (const origin of optionsFor("origin")) {
      for (const stage of optionsFor("stage")) {
        for (const role of optionsFor("role")) {
          const profile = { origin, stage, role };
          for (const topic of service.topics) {
            const journey = walkFirstPath(service, topic, profile);
            expect(
              journey.node.kind,
              `${topic.slug} with ${JSON.stringify(profile)} did not reach an outcome`
            ).toBe("outcome");
            expect(journey.node.id).not.toBe("__unresolved__");
          }
        }
      }
    }
  });
});

/** Always take the first visible option until an outcome is reached. */
function walkFirstPath(
  target: SmartAnswerService,
  topic: SmartAnswerTopic,
  profile: Record<string, string | undefined>
) {
  const answers: string[] = [];
  let journey = resolveTopic(target, topic, profile, answers);
  let guard = 0;

  while (journey.node.kind === "question" && guard < 50) {
    const options = visibleOptions(journey.node, journey.facts);
    expect(
      options.length,
      `question "${journey.node.id}" left the reader no options`
    ).toBeGreaterThan(0);
    answers.push(options[0]!.id);
    journey = resolveTopic(target, topic, profile, answers);
    guard += 1;
  }

  return journey;
}

/* -------------------------------------------------------------------------- */
/* Exhaustive graph traversal: proving there are no dead ends                 */
/* -------------------------------------------------------------------------- */

/**
 * This is the deliverable that proves "no dead ends" as a property of the
 * published service, not a sample of it: a breadth-first walk over every
 * `option.next` edge from every topic's start node, regardless of any
 * audience profile or `when` condition (those gate what a particular reader
 * *sees*, they do not remove the edge from the graph itself). Every node
 * the walk reaches, and every branch it follows, is asserted directly:
 *
 *  - a question node resolves every option to a node that exists;
 *  - an outcome node reached this way is a genuine answer: both languages
 *    say something, and there is at least one way to act on it (an action,
 *    a citation, or a related page), never a page that just stops.
 *
 * `validateService` already checks most of this (reachability, dangling
 * `next`, dead-end outcomes), but it is exercised elsewhere by a test that
 * only asserts its output is empty. Re-deriving the walk here, independently
 * of `lib/smart-answers.ts`'s own implementation, means a bug in that
 * validator could not hide a real dead end from this suite.
 */
describe("exhaustive traversal: every node and every branch reaches a real outcome", () => {
  const byId = new Map(service.nodes.map((node) => [node.id, node]));

  it("walks the whole graph from every topic start with no missing or empty terminal", () => {
    const visited = new Set<string>();
    const queue: string[] = [...service.topics.map((topic) => topic.start)];
    let branchCount = 0;

    while (queue.length > 0) {
      const id = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);

      const node = byId.get(id);
      expect(node, `node "${id}" is referenced but not defined in service.nodes`).toBeDefined();
      if (!node) continue;

      if (node.kind === "question") {
        expect(node.options.length, `question "${id}" has no options at all`).toBeGreaterThan(0);

        for (const option of node.options) {
          branchCount += 1;
          const target = byId.get(option.next);
          expect(
            target,
            `question "${id}" option "${option.id}" points to missing node "${option.next}"`
          ).toBeDefined();
          if (target) queue.push(option.next);
        }
        continue;
      }

      // A terminal node: it must be a genuine outcome, not a blank stop.
      expect(node.title.en.trim(), `outcome "${id}" has no English title`).not.toBe("");
      expect(node.title.th.trim(), `outcome "${id}" has no Thai title`).not.toBe("");
      expect(node.summary.en.trim(), `outcome "${id}" has no English summary`).not.toBe("");
      expect(node.summary.th.trim(), `outcome "${id}" has no Thai summary`).not.toBe("");

      const nextSteps =
        (node.actions?.length ?? 0) + (node.related?.length ?? 0) + (node.citations?.length ?? 0);
      expect(
        nextSteps,
        `outcome "${id}" is a dead end: it gives the reader no action, related page, or citation to follow`
      ).toBeGreaterThan(0);
    }

    const questionsVisited = [...visited].filter((id) => byId.get(id)?.kind === "question").length;
    const outcomesVisited = [...visited].filter((id) => byId.get(id)?.kind === "outcome").length;

    console.log(
      `[exhaustive traversal] visited ${visited.size} of ${service.nodes.length} nodes ` +
        `(${questionsVisited} questions, ${outcomesVisited} outcomes) across ${branchCount} branches`
    );

    // Every authored node is reachable (validateService checks this too);
    // restated here so this test does not silently pass over an orphan.
    expect(
      visited.size,
      "the traversal did not reach every node in service.nodes: something is unreachable from every topic"
    ).toBe(service.nodes.length);
  });

  it("lets a reader answer honestly when severity genuinely cannot be judged", () => {
    // Spot-check for the one question in the service where "I don't know"
    // is a plausible, expected reader state (self-assessed symptom
    // severity), rather than mechanically requiring it everywhere.
    const question = byId.get("q-wellbeing-unwell");
    expect(question?.kind).toBe("question");
    if (question?.kind !== "question") return;
    const combined = question.options
      .map((option) => `${option.label.en} ${option.label.th}`)
      .join(" ");
    expect(combined).toMatch(/not sure|ไม่แน่ใจ/);
  });
});

describe("every outcome links somewhere real", () => {
  const provisionsByDoc = new Map<string, Set<number>>();
  for (const doc of documents) {
    const numbers = new Set<number>();
    const walk = (sections: Section[]) => {
      for (const section of sections) {
        for (const provision of (section.provisions ?? []) as Provision[])
          numbers.add(provision.num);
        if (section.children) walk(section.children);
      }
    };
    walk(doc.sections);
    provisionsByDoc.set(doc.slug, numbers);
  }

  it("cites only provisions that exist in the document cited", () => {
    for (const node of service.nodes) {
      if (node.kind !== "outcome") continue;
      for (const citation of node.citations ?? []) {
        const match = /^\/activity\/regulations\/([^#]+)#prov-(\d+)$/.exec(citation.href);
        expect(
          match,
          `outcome "${node.id}" has malformed citation "${citation.href}"`
        ).not.toBeNull();
        const [, slug, num] = match!;
        const provisions = provisionsByDoc.get(slug!);
        expect(provisions, `outcome "${node.id}" cites unknown document "${slug}"`).toBeDefined();
        expect(
          provisions!.has(Number(num)),
          `outcome "${node.id}" cites ${slug} prov ${num}, which does not exist`
        ).toBe(true);
      }
    }
  });

  it("uses internal paths that are not locale-prefixed", () => {
    for (const node of service.nodes) {
      if (node.kind !== "outcome") continue;
      const internal = [
        ...(node.actions ?? []).filter((action) => !action.external).map((a) => a.href),
        ...(node.citations ?? []).map((c) => c.href),
        ...(node.related ?? []).map((r) => r.href),
      ];
      for (const href of internal) {
        expect(href.startsWith("/"), `outcome "${node.id}" href "${href}"`).toBe(true);
        expect(/^\/(en|th)\//.test(href), `outcome "${node.id}" href "${href}"`).toBe(false);
      }
    }
  });

  it("only sends people to a contact category the contact form accepts", () => {
    const allowed = new Set(["question", "suggestion", "problem", "other"]);
    for (const node of service.nodes) {
      if (node.kind !== "outcome" || !node.contactCategory) continue;
      expect(allowed, `outcome "${node.id}"`).toContain(node.contactCategory);
    }
  });
});

describe("copy is authored in both languages", () => {
  it("has a non-empty title and lede for every topic, in both locales", () => {
    for (const topic of service.topics) {
      for (const locale of locales) {
        expect(topic.title[locale].trim(), `topic "${topic.slug}" title`).not.toBe("");
        expect(topic.lede[locale].trim(), `topic "${topic.slug}" lede`).not.toBe("");
      }
    }
  });

  it("uses no em dashes, in either language", () => {
    // A site-wide writing rule (see docs/EDITING.md); easy to reintroduce by
    // hand and invisible in review, so it is asserted rather than trusted.
    const serialized = JSON.stringify(service);
    expect(serialized.includes("—")).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/* Conditions                                                                 */
/* -------------------------------------------------------------------------- */

describe("evaluate", () => {
  const facts = { origin: "international", stage: "starting" };

  it("matches a single value and a list of values", () => {
    expect(evaluate({ fact: "origin", is: "international" }, facts)).toBe(true);
    expect(evaluate({ fact: "origin", is: ["thai", "international"] }, facts)).toBe(true);
    expect(evaluate({ fact: "origin", is: "thai" }, facts)).toBe(false);
  });

  it("treats an unknown fact as not matching, never as matching by default", () => {
    expect(evaluate({ fact: "role", is: "officer" }, facts)).toBe(false);
    expect(evaluate({ not: { fact: "role", is: "officer" } }, facts)).toBe(true);
    expect(evaluate({ fact: "role", known: false }, facts)).toBe(true);
    expect(evaluate({ fact: "role", known: true }, facts)).toBe(false);
  });

  it("combines with all, any and not", () => {
    expect(
      evaluate(
        {
          all: [
            { fact: "origin", is: "international" },
            { fact: "stage", is: "starting" },
          ],
        },
        facts
      )
    ).toBe(true);
    expect(
      evaluate(
        {
          all: [
            { fact: "origin", is: "international" },
            { fact: "stage", is: "finishing" },
          ],
        },
        facts
      )
    ).toBe(false);
    expect(
      evaluate(
        {
          any: [
            { fact: "stage", is: "finishing" },
            { fact: "origin", is: "international" },
          ],
        },
        facts
      )
    ).toBe(true);
  });

  it("holds when there is no condition at all", () => {
    expect(evaluate(undefined, {})).toBe(true);
  });
});

/* -------------------------------------------------------------------------- */
/* The profile in the URL                                                     */
/* -------------------------------------------------------------------------- */

describe("the audience profile round-trips through the URL", () => {
  it("parses tokens in any order and drops what it does not recognise", () => {
    expect(parseProfile("starting.international")).toEqual({
      origin: "international",
      stage: "starting",
    });
    expect(parseProfile("international.nonsense.officer")).toEqual({
      origin: "international",
      role: "officer",
    });
    expect(parseProfile(undefined)).toEqual({});
    expect(parseProfile("")).toEqual({});
  });

  it("serializes to a stable order regardless of how it was built", () => {
    expect(serializeProfile({ role: "officer", origin: "thai" })).toBe("thai.officer");
    expect(serializeProfile(parseProfile("officer.thai"))).toBe("thai.officer");
    expect(serializeProfile({})).toBe("");
  });

  it("builds a query carrying the profile and the answers in order", () => {
    expect(stepQuery({ origin: "thai" }, ["a", "b"])).toBe("?p=thai&a=a&a=b");
    expect(stepQuery({}, [])).toBe("");
  });
});

/* -------------------------------------------------------------------------- */
/* Resolution                                                                 */
/* -------------------------------------------------------------------------- */

const nodes: SmartAnswerNode[] = [
  {
    kind: "question",
    id: "q1",
    question: { en: "Where from?", th: "มาจากไหน" },
    skipWhen: [{ when: { fact: "origin", is: "international" }, option: "abroad" }],
    options: [
      {
        id: "abroad",
        label: { en: "Abroad", th: "ต่างประเทศ" },
        next: "q2",
        set: { origin: "international" },
      },
      { id: "here", label: { en: "Thailand", th: "ไทย" }, next: "out-general" },
    ],
  },
  {
    kind: "question",
    id: "q2",
    question: { en: "Which?", th: "แบบไหน" },
    options: [
      { id: "visa", label: { en: "Visa", th: "วีซ่า" }, next: "out-visa" },
      { id: "bank", label: { en: "Bank", th: "ธนาคาร" }, next: "out-general" },
      {
        id: "officer-only",
        label: { en: "Committee duty", th: "หน้าที่กรรมการ" },
        next: "out-general",
        when: { fact: "role", is: "officer" },
      },
    ],
  },
  {
    kind: "outcome",
    id: "out-visa",
    title: { en: "Visa", th: "วีซ่า" },
    summary: { en: "Visa answer", th: "คำตอบเรื่องวีซ่า" },
    actions: [{ label: { en: "Guide", th: "คู่มือ" }, href: "/student-life" }],
  },
  {
    kind: "outcome",
    id: "out-general",
    title: { en: "General", th: "ทั่วไป" },
    summary: { en: "General answer", th: "คำตอบทั่วไป" },
    actions: [{ label: { en: "Contact", th: "ติดต่อ" }, href: "/contact" }],
  },
];

const topic: SmartAnswerTopic = {
  slug: "fixture",
  title: { en: "Fixture", th: "ตัวอย่าง" },
  lede: { en: "Fixture", th: "ตัวอย่าง" },
  group: "help",
  start: "q1",
  keywords: ["fixture"],
};

const fixture: SmartAnswerService = { topics: [topic], nodes };

describe("resolveTopic", () => {
  it("with no answers, asks the first question and records nothing", () => {
    const journey = resolveTopic(fixture, topic, {}, []);
    expect(journey.node.id).toBe("q1");
    expect(journey.trail).toEqual([]);
    expect(journey.answerIds).toEqual([]);
  });

  it("walks the answers it is given to an outcome", () => {
    const journey = resolveTopic(fixture, topic, {}, ["abroad", "visa"]);
    expect(journey.node.id).toBe("out-visa");
    expect(journey.trail.map((step) => step.option.id)).toEqual(["abroad", "visa"]);
    expect(journey.facts.origin).toBe("international");
  });

  it("records facts set by an option, for later conditions to read", () => {
    const journey = resolveTopic(fixture, topic, {}, ["abroad"]);
    expect(journey.facts).toEqual({ origin: "international" });
  });

  it("stops at the first answer that does not match, and ignores the rest", () => {
    const journey = resolveTopic(fixture, topic, {}, ["nonsense", "visa"]);
    expect(journey.node.id).toBe("q1");
    expect(journey.answerIds).toEqual([]);
  });

  it("ignores extra answers supplied after an outcome is reached", () => {
    const journey = resolveTopic(fixture, topic, {}, ["here", "visa", "junk"]);
    expect(journey.node.id).toBe("out-general");
    expect(journey.answerIds).toEqual(["here"]);
  });
});

describe("resolveTopic takes the audience into account", () => {
  it("answers a question it already knows the answer to, and says it did", () => {
    const journey = resolveTopic(fixture, topic, { origin: "international" }, []);
    expect(journey.node.id).toBe("q2");
    expect(journey.trail).toHaveLength(1);
    expect(journey.trail[0]!.auto).toBe(true);
    expect(journey.trail[0]!.option.id).toBe("abroad");
    expect(journey.trail[0]!.answerIndex).toBeNull();
  });

  it("keeps an automatic step out of the URL, so changing the profile reroutes", () => {
    const journey = resolveTopic(fixture, topic, { origin: "international" }, ["visa"]);
    expect(journey.node.id).toBe("out-visa");
    // Only the hand-given answer is carried forward.
    expect(journey.answerIds).toEqual(["visa"]);

    const rerouted = resolveTopic(fixture, topic, { origin: "thai" }, journey.answerIds);
    expect(rerouted.node.id).toBe("q1");
  });

  it("hides an option the reader is not eligible for", () => {
    const asStudent = resolveTopic(fixture, topic, { origin: "international" }, []);
    expect(visibleOptions(asStudent.node as never, asStudent.facts).map((o) => o.id)).toEqual([
      "visa",
      "bank",
    ]);

    const asOfficer = resolveTopic(
      fixture,
      topic,
      { origin: "international", role: "officer" },
      []
    );
    expect(visibleOptions(asOfficer.node as never, asOfficer.facts).map((o) => o.id)).toEqual([
      "visa",
      "bank",
      "officer-only",
    ]);
  });

  it("refuses an answer naming an option this reader cannot see", () => {
    const journey = resolveTopic(fixture, topic, { origin: "international" }, ["officer-only"]);
    expect(journey.node.id).toBe("q2");
    expect(journey.answerIds).toEqual([]);
  });
});

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

describe("validateService catches a deliberately broken service", () => {
  const broken: SmartAnswerService = {
    topics: [
      { ...topic, slug: "broken", start: "q1" },
      { ...topic, slug: "broken", start: "does-not-exist", keywords: [] },
    ],
    nodes: [
      {
        kind: "question",
        id: "q1",
        question: { en: "Q1?", th: "คำถาม 1" },
        skipWhen: [{ when: { fact: "origin", is: "martian" }, option: "nope" }],
        options: [
          { id: "a", label: { en: "A", th: "" }, next: "missing-node" },
          {
            id: "a",
            label: { en: "B", th: "บี" },
            next: "out-1",
            when: { fact: "role", is: "officer" },
          },
        ],
      },
      {
        kind: "outcome",
        id: "out-1",
        title: { en: "Out", th: "ผลลัพธ์" },
        summary: { en: "Out", th: "ผลลัพธ์" },
        actions: [{ label: { en: "Bad", th: "แย่" }, href: "/en/contact" }],
      },
      {
        kind: "outcome",
        id: "out-orphan",
        title: { en: "Orphan", th: "กำพร้า" },
        summary: { en: "Orphan", th: "กำพร้า" },
      },
    ],
  };

  const problems = validateService(broken);

  it("reports the dangling next", () => {
    expect(problems.some((p) => p.includes('points to missing node "missing-node"'))).toBe(true);
  });

  it("reports the duplicate option id and the duplicate topic slug", () => {
    expect(problems.some((p) => p.includes('duplicate option id "a"'))).toBe(true);
    expect(problems.some((p) => p.includes('duplicate topic slug "broken"'))).toBe(true);
  });

  it("reports the missing start node and the topic with no keywords", () => {
    expect(problems.some((p) => p.includes('starts at missing node "does-not-exist"'))).toBe(true);
    expect(problems.some((p) => p.includes("has no keywords"))).toBe(true);
  });

  it("reports the unreachable node and the dead-end outcome", () => {
    expect(problems.some((p) => p.includes('node "out-orphan" is unreachable'))).toBe(true);
    expect(problems.some((p) => p.includes('outcome "out-orphan" is a dead end'))).toBe(true);
  });

  it("reports the condition typo and the skip to a non-existent option", () => {
    expect(problems.some((p) => p.includes('unreachable value "martian"'))).toBe(true);
    expect(problems.some((p) => p.includes('skips to option "nope"'))).toBe(true);
  });

  it("reports the missing Thai and the locale-prefixed link", () => {
    expect(problems.some((p) => p.includes("is missing Thai"))).toBe(true);
    expect(problems.some((p) => p.includes("hard-coded locale prefix"))).toBe(true);
  });
});
