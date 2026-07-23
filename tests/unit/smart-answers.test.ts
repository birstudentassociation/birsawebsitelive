import { describe, expect, it } from "vitest";
import { resolveFlow, validateFlow } from "@/lib/smart-answers";
import { flows } from "@/content/smart-answers";
import type { SmartAnswerFlow } from "@/content/smart-answers/types";
import { documents } from "@/content/activity/regulations";
import { locales } from "@/lib/i18n";

const knownDocSlugs = new Set(documents.map((doc) => doc.slug));

describe("validateFlow: every published flow is structurally sound", () => {
  for (const flow of flows) {
    it(`"${flow.slug}" has no problems`, () => {
      expect(validateFlow(flow)).toEqual([]);
    });
  }
});

describe("validateFlow: catches a deliberately broken flow", () => {
  const broken: SmartAnswerFlow = {
    slug: "broken",
    title: { en: "Broken", th: "พัง" },
    lede: { en: "Broken", th: "พัง" },
    start: "q1",
    nodes: [
      {
        kind: "question",
        id: "q1",
        question: { en: "Q1?", th: "คำถาม 1" },
        options: [
          { id: "a", label: { en: "A", th: "เอ" }, next: "q1" }, // duplicate node id "q1" reused below
          { id: "b", label: { en: "B", th: "บี" }, next: "does-not-exist" }, // dangling next
        ],
      },
      // Duplicate node id "q1" (should have been unique).
      {
        kind: "question",
        id: "q1",
        question: { en: "Q1 again?", th: "คำถาม 1 อีกครั้ง" },
        options: [{ id: "a", label: { en: "A", th: "เอ" }, next: "out-1" }],
      },
      {
        kind: "outcome",
        id: "out-1",
        title: { en: "Out", th: "ผลลัพธ์" },
        summary: { en: "Out", th: "ผลลัพธ์" },
      },
      // Unreachable from start.
      {
        kind: "outcome",
        id: "out-orphan",
        title: { en: "Orphan", th: "ไม่มีใครไปถึง" },
        summary: { en: "Orphan", th: "ไม่มีใครไปถึง" },
      },
    ],
  };

  it("reports the dangling next, the duplicate id, and the unreachable node", () => {
    const problems = validateFlow(broken);
    expect(problems.length).toBeGreaterThan(0);
    expect(problems.some((p) => p.includes('duplicate node id "q1"'))).toBe(true);
    expect(problems.some((p) => p.includes("does-not-exist"))).toBe(true);
    expect(problems.some((p) => p.includes('"out-orphan"') && p.includes("unreachable"))).toBe(
      true
    );
  });

  it("also flags a question with fewer than 2 options and a real cycle", () => {
    const cyclic: SmartAnswerFlow = {
      slug: "cyclic",
      title: { en: "Cyclic", th: "วนซ้ำ" },
      lede: { en: "Cyclic", th: "วนซ้ำ" },
      start: "q1",
      nodes: [
        {
          kind: "question",
          id: "q1",
          question: { en: "Q1?", th: "คำถาม 1" },
          options: [{ id: "only", label: { en: "Only", th: "ตัวเดียว" }, next: "q2" }],
        },
        {
          kind: "question",
          id: "q2",
          question: { en: "Q2?", th: "คำถาม 2" },
          options: [{ id: "back", label: { en: "Back", th: "กลับ" }, next: "q1" }],
        },
      ],
    };
    const problems = validateFlow(cyclic);
    expect(problems.some((p) => p.includes("fewer than 2 options"))).toBe(true);
    expect(problems.some((p) => p.includes("cycle"))).toBe(true);
    expect(problems.some((p) => p.includes("no reachable outcome"))).toBe(true);
  });
});

describe("resolveFlow", () => {
  const flow = flows[0]!;

  it("with no answers, resolves to the first question with an empty trail", () => {
    const { node, trail } = resolveFlow(flow, []);
    expect(node.id).toBe(flow.start);
    expect(node.kind).toBe("question");
    expect(trail).toEqual([]);
  });

  it("a full valid path reaches an outcome with the full trail recorded", () => {
    // Walk the flow greedily, always taking the first option, until an
    // outcome is reached, recording the answers taken along the way.
    const answers: string[] = [];
    let node = flow.nodes.find((n) => n.id === flow.start)!;
    let guard = 0;
    while (node.kind === "question" && guard < 20) {
      const option = node.options[0]!;
      answers.push(option.id);
      node = flow.nodes.find((n) => n.id === option.next)!;
      guard++;
    }
    expect(node.kind).toBe("outcome");

    const resolved = resolveFlow(flow, answers);
    expect(resolved.node.kind).toBe("outcome");
    expect(resolved.node.id).toBe(node.id);
    expect(resolved.trail.length).toBe(answers.length);
    expect(resolved.trail.map((step) => step.option.id)).toEqual(answers);
  });

  it("stops at the first invalid answer, trail is the valid prefix", () => {
    const start = flow.nodes.find((n) => n.id === flow.start);
    if (start?.kind !== "question") throw new Error("expected a question start node");
    const validFirst = start.options[0]!.id;

    const { node, trail } = resolveFlow(flow, [validFirst, "not-a-real-option-id", "more-junk"]);
    expect(trail).toHaveLength(1);
    expect(trail[0]!.option.id).toBe(validFirst);
    // The current node should be whatever the valid first answer led to,
    // not something derived from the bogus answers.
    const expectedNode = flow.nodes.find((n) => n.id === start.options[0]!.next)!;
    expect(node.id).toBe(expectedNode.id);
  });

  it("ignores extra answers supplied after an outcome is already reached", () => {
    const answers: string[] = [];
    let node = flow.nodes.find((n) => n.id === flow.start)!;
    let guard = 0;
    while (node.kind === "question" && guard < 20) {
      const option = node.options[0]!;
      answers.push(option.id);
      node = flow.nodes.find((n) => n.id === option.next)!;
      guard++;
    }
    expect(node.kind).toBe("outcome");

    const withTrailingJunk = [...answers, "junk-after-outcome"];
    const resolved = resolveFlow(flow, withTrailingJunk);
    expect(resolved.node.id).toBe(node.id);
    expect(resolved.trail.length).toBe(answers.length);
  });
});

describe("every flow: bilingual copy and link shapes", () => {
  function expectNonEmptyBi(value: { en: string; th: string }, context: string) {
    expect(value.en.trim().length, `${context} missing en`).toBeGreaterThan(0);
    expect(value.th.trim().length, `${context} missing th`).toBeGreaterThan(0);
  }

  for (const flow of flows) {
    describe(`"${flow.slug}"`, () => {
      it("has non-empty title and lede in both languages", () => {
        expectNonEmptyBi(flow.title, `${flow.slug} title`);
        expectNonEmptyBi(flow.lede, `${flow.slug} lede`);
      });

      it("has non-empty whatYoullNeed entries, if present", () => {
        for (const [index, item] of (flow.whatYoullNeed ?? []).entries()) {
          expectNonEmptyBi(item, `${flow.slug} whatYoullNeed[${index}]`);
        }
      });

      it("every question and option has non-empty en/th text", () => {
        for (const node of flow.nodes) {
          if (node.kind !== "question") continue;
          expectNonEmptyBi(node.question, `${flow.slug}/${node.id} question`);
          if (node.hint) expectNonEmptyBi(node.hint, `${flow.slug}/${node.id} hint`);
          for (const option of node.options) {
            expectNonEmptyBi(option.label, `${flow.slug}/${node.id}/${option.id} label`);
            if (option.hint) {
              expectNonEmptyBi(option.hint, `${flow.slug}/${node.id}/${option.id} hint`);
            }
          }
        }
      });

      it("every outcome has non-empty en/th title, summary, and body paragraphs", () => {
        for (const node of flow.nodes) {
          if (node.kind !== "outcome") continue;
          expectNonEmptyBi(node.title, `${flow.slug}/${node.id} title`);
          expectNonEmptyBi(node.summary, `${flow.slug}/${node.id} summary`);
          for (const [index, paragraph] of (node.body ?? []).entries()) {
            expectNonEmptyBi(paragraph, `${flow.slug}/${node.id} body[${index}]`);
          }
        }
      });

      it("every action has non-empty en/th label, and internal hrefs start with /", () => {
        for (const node of flow.nodes) {
          if (node.kind !== "outcome") continue;
          for (const action of node.actions ?? []) {
            expectNonEmptyBi(action.label, `${flow.slug}/${node.id} action label`);
            if (!action.external) {
              expect(
                action.href.startsWith("/"),
                `${flow.slug}/${node.id} internal action href "${action.href}" should start with "/"`
              ).toBe(true);
            }
          }
        }
      });

      it("every citation has non-empty en/th label and points at a known regulations doc", () => {
        for (const node of flow.nodes) {
          if (node.kind !== "outcome") continue;
          for (const citation of node.citations ?? []) {
            expectNonEmptyBi(citation.label, `${flow.slug}/${node.id} citation label`);
            expect(
              citation.href.startsWith("/"),
              `${flow.slug}/${node.id} citation href "${citation.href}" should start with "/"`
            ).toBe(true);

            const match = citation.href.match(/^\/activity\/regulations\/([^/#]+)(#prov-\d+)?$/);
            expect(
              match,
              `${flow.slug}/${node.id} citation href "${citation.href}" should look like /activity/regulations/<slug>[#prov-N]`
            ).not.toBeNull();
            expect(
              knownDocSlugs.has(match![1]!),
              `${flow.slug}/${node.id} citation href "${citation.href}" references an unknown regulations doc slug "${match?.[1]}"`
            ).toBe(true);
          }
        }
      });
    });
  }
});

describe("locales", () => {
  it("th is the default/primary locale and en is also configured", () => {
    expect(locales).toContain("th");
    expect(locales).toContain("en");
  });
});
