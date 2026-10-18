import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolveTopic, stepQuery, toAnswerIds, validateService } from "@/lib/smart-answers";
import { service } from "@/content/smart-answers";
import type {
  SmartAnswerNode,
  SmartAnswerService,
  SmartAnswerTopic,
} from "@/content/smart-answers/types";
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

  it("has exactly the three checks, each hosted at its own path", () => {
    expect(service.topics.map((topic) => [topic.slug, topic.path])).toEqual([
      ["activity-approval", "/activity/approval-check"],
      ["club-readiness", "/clubs/start-check"],
      ["where-to-go", "/contact/where-to-go"],
    ]);
  });

  it("starts each check at its root question", () => {
    expect(service.topics.map((topic) => topic.start)).toEqual([
      "q-activity-body",
      "q-club-idea",
      "q-where-root",
    ]);
  });

  it("reaches an outcome from every topic by always taking the first option", () => {
    for (const topic of service.topics) {
      const journey = walkFirstPath(service, topic);
      expect(journey.node.kind, `${topic.slug} did not reach an outcome`).toBe("outcome");
      expect(journey.node.id).not.toBe("__unresolved__");
    }
  });
});

/** Always take the first option until an outcome is reached. */
function walkFirstPath(target: SmartAnswerService, topic: SmartAnswerTopic) {
  const answers: string[] = [];
  let journey = resolveTopic(target, topic, answers);
  let guard = 0;

  while (journey.node.kind === "question" && guard < 50) {
    answers.push(journey.node.options[0]!.id);
    journey = resolveTopic(target, topic, answers);
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
 * `option.next` edge from every topic's start node. Every node the walk
 * reaches, and every branch it follows, is asserted directly:
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
});

const appRoot = path.join(process.cwd(), "app", "[lang]");
const contentRoot = path.join(process.cwd(), "content");

/** Whether `pathname` has a `page.tsx` under `app/[lang]`, allowing dynamic segments. */
function matchesRoute(dir: string, segments: string[]): boolean {
  if (segments.length === 0) return existsSync(path.join(dir, "page.tsx"));
  const [head, ...rest] = segments as [string, ...string[]];
  const children = readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  return children.some((child) => {
    const isDynamic = child.name.startsWith("[") && !child.name.startsWith("[...");
    if (child.name !== head && !isDynamic) return false;
    return matchesRoute(path.join(dir, child.name), rest);
  });
}

/** A route exists, and a guide under `/student-life/<topic>/<slug>` has an English file. */
function routeExists(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  if (!matchesRoute(appRoot, segments)) return false;
  if (segments[0] === "student-life" && segments.length === 3) {
    return existsSync(
      path.join(contentRoot, "student-life", "en", segments[1]!, `${segments[2]}.mdx`)
    );
  }
  if (segments[0] === "activity" && segments.length === 2 && segments[1] !== "regulations") {
    return existsSync(path.join(contentRoot, "activity", "en", `${segments[1]}.mdx`));
  }
  return true;
}

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

  it("sends internal links to a real route or guide", () => {
    const hosted = new Set(service.topics.map((topic) => topic.path));
    const links = new Set<string>();
    for (const node of service.nodes) {
      if (node.kind !== "outcome") continue;
      for (const action of node.actions ?? []) if (!action.external) links.add(action.href);
      for (const citation of node.citations ?? []) links.add(citation.href);
      for (const related of node.related ?? []) links.add(related.href);
    }

    for (const href of links) {
      const pathname = href.split("#")[0]!;
      if (hosted.has(pathname)) continue;
      expect(routeExists(pathname), `"${href}" does not match a route or guide`).toBe(true);
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
/* The answers in the URL                                                     */
/* -------------------------------------------------------------------------- */

describe("answers round-trip through the URL", () => {
  it("builds a query carrying the answers in order", () => {
    expect(stepQuery(["a", "b"])).toBe("?a=a&a=b");
    expect(stepQuery([])).toBe("");
  });

  it("reads a single or repeated `a` param into a list", () => {
    expect(toAnswerIds(undefined)).toEqual([]);
    expect(toAnswerIds("a")).toEqual(["a"]);
    expect(toAnswerIds(["a", "b"])).toEqual(["a", "b"]);
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
    options: [
      { id: "abroad", label: { en: "Abroad", th: "ต่างประเทศ" }, next: "q2" },
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
  path: "/fixture",
  title: { en: "Fixture", th: "ตัวอย่าง" },
  lede: { en: "Fixture", th: "ตัวอย่าง" },
  start: "q1",
  keywords: ["fixture"],
};

const fixture: SmartAnswerService = { topics: [topic], nodes };

describe("resolveTopic", () => {
  it("with no answers, asks the first question and records nothing", () => {
    const journey = resolveTopic(fixture, topic, []);
    expect(journey.node.id).toBe("q1");
    expect(journey.trail).toEqual([]);
    expect(journey.answerIds).toEqual([]);
  });

  it("walks the answers it is given to an outcome", () => {
    const journey = resolveTopic(fixture, topic, ["abroad", "visa"]);
    expect(journey.node.id).toBe("out-visa");
    expect(journey.trail.map((step) => step.option.id)).toEqual(["abroad", "visa"]);
    expect(journey.trail.map((step) => step.answerIndex)).toEqual([0, 1]);
  });

  it("stops at the first answer that does not match, and ignores the rest", () => {
    const journey = resolveTopic(fixture, topic, ["nonsense", "visa"]);
    expect(journey.node.id).toBe("q1");
    expect(journey.answerIds).toEqual([]);
  });

  it("ignores extra answers supplied after an outcome is reached", () => {
    const journey = resolveTopic(fixture, topic, ["here", "visa", "junk"]);
    expect(journey.node.id).toBe("out-general");
    expect(journey.answerIds).toEqual(["here"]);
  });
});

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

describe("validateService catches a deliberately broken service", () => {
  const broken: SmartAnswerService = {
    topics: [
      { ...topic, slug: "broken", start: "q1" },
      { ...topic, slug: "broken", path: "/en/broken", start: "does-not-exist", keywords: [] },
    ],
    nodes: [
      {
        kind: "question",
        id: "q1",
        question: { en: "Q1?", th: "คำถาม 1" },
        options: [
          { id: "a", label: { en: "A", th: "" }, next: "missing-node" },
          { id: "a", label: { en: "B", th: "บี" }, next: "out-1" },
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

  it("reports the missing Thai and the locale-prefixed link and topic path", () => {
    expect(problems.some((p) => p.includes("is missing Thai"))).toBe(true);
    expect(
      problems.some((p) => p.includes('outcome "out-1" has internal link "/en/contact"'))
    ).toBe(true);
    expect(problems.some((p) => p.includes('path "/en/broken" with a hard-coded locale'))).toBe(
      true
    );
  });

  it("reports a cycle among questions", () => {
    const looping: SmartAnswerService = {
      topics: [topic],
      nodes: [
        {
          kind: "question",
          id: "q1",
          question: { en: "One?", th: "หนึ่ง" },
          options: [
            { id: "again", label: { en: "Again", th: "อีกครั้ง" }, next: "q1" },
            { id: "done", label: { en: "Done", th: "เสร็จ" }, next: "out-general" },
          ],
        },
        nodes[3]!,
      ],
    };
    expect(validateService(looping)).toContain("service contains a cycle");
  });
});
