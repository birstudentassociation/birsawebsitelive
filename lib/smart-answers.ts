/**
 * Pure engine for Smart Answers: deciding what to ask next and whether the
 * authored service is structurally sound. No React, no side effects, so this
 * is unit-testable in isolation (see `tests/unit/smart-answers.test.ts`).
 *
 * The only input that decides a step is the list of answers carried in
 * `?a=`. It is a user-controlled string, so it is treated as untrusted:
 * anything that does not match the authored graph is dropped, and the reader
 * lands on the last state that does make sense instead of on an error.
 */
import type {
  Bi,
  SmartAnswerNode,
  SmartAnswerOption,
  SmartAnswerOutcome,
  SmartAnswerQuestion,
  SmartAnswerService,
  SmartAnswerTopic,
} from "@/content/smart-answers/types";

/** Build the `?a=...&a=...` query for one state of one topic. */
export function stepQuery(answerIds: string[]): string {
  const params = new URLSearchParams();
  for (const id of answerIds) params.append("a", id);
  const query = params.toString();
  return query ? `?${query}` : "";
}

/** Read repeated `a` params into an ordered list. */
export function toAnswerIds(a: string | string[] | undefined): string[] {
  if (a === undefined) return [];
  return Array.isArray(a) ? a : [a];
}

/* -------------------------------------------------------------------------- */
/* Resolving a journey                                                        */
/* -------------------------------------------------------------------------- */

export type ResolvedStep = {
  question: SmartAnswerQuestion;
  option: SmartAnswerOption;
  /** Position of this answer in the `a` query param, for building a "change this answer" link. */
  answerIndex: number;
};

export type ResolvedJourney = {
  /** The next question to ask, or the outcome reached. */
  node: SmartAnswerNode;
  /** The validated path taken to reach `node`, in order. */
  trail: ResolvedStep[];
  /**
   * The answers that were actually used, which can be shorter than what the
   * URL carried if it was stale or tampered with. Always build links from
   * this, never from the raw query.
   */
  answerIds: string[];
};

/** A blank terminal node, used only when authored content is broken. */
const UNRESOLVED: SmartAnswerOutcome = {
  kind: "outcome",
  id: "__unresolved__",
  title: { en: "", th: "" },
  summary: { en: "", th: "" },
};

function nodeIndex(service: SmartAnswerService): Map<string, SmartAnswerNode> {
  return new Map(service.nodes.map((node) => [node.id, node]));
}

/**
 * Walk the graph from `topic.start`, replaying `rawAnswerIds` in order.
 *
 * Each answer must match an option of the current question. The first answer
 * that does not (because the graph changed or the link was hand-edited) ends
 * the replay there, and that question is asked again. Everything after it is
 * ignored.
 */
export function resolveTopic(
  service: SmartAnswerService,
  topic: SmartAnswerTopic,
  rawAnswerIds: string[]
): ResolvedJourney {
  const nodes = nodeIndex(service);
  const trail: ResolvedStep[] = [];
  const answerIds: string[] = [];

  let current = nodes.get(topic.start);

  while (current && current.kind === "question") {
    const question = current;

    const answerId = rawAnswerIds[answerIds.length];
    if (answerId === undefined) break;

    const option = question.options.find((candidate) => candidate.id === answerId);
    if (!option) break;

    trail.push({ question, option, answerIndex: answerIds.length });
    answerIds.push(option.id);
    current = nodes.get(option.next);
  }

  // `current` is only missing here if the graph itself is broken (a dangling
  // `next`), which `validateService` is expected to catch before it ships.
  // Degrade to a blank outcome rather than throwing, so one bad content edit
  // cannot take a page down.
  return { node: current ?? UNRESOLVED, trail, answerIds };
}

export function getTopic(service: SmartAnswerService, slug: string): SmartAnswerTopic | undefined {
  return service.topics.find((topic) => topic.slug === slug);
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

function bilingualStrings(node: SmartAnswerNode): { path: string; value: Bi }[] {
  const found: { path: string; value: Bi }[] = [];
  const add = (path: string, value?: Bi) => {
    if (value) found.push({ path, value });
  };

  if (node.kind === "question") {
    add("question", node.question);
    add("hint", node.hint);
    node.options.forEach((option, index) => {
      add(`option[${index}].label`, option.label);
      add(`option[${index}].hint`, option.hint);
    });
    return found;
  }

  add("title", node.title);
  add("summary", node.summary);
  add("owner", node.owner);
  node.body?.forEach((block, index) => {
    if (block.kind === "steps") {
      add(`body[${index}].title`, block.title);
      block.items.forEach((item, itemIndex) => add(`body[${index}].items[${itemIndex}]`, item));
      return;
    }
    add(`body[${index}].text`, block.text);
  });
  node.actions?.forEach((action, index) => add(`action[${index}].label`, action.label));
  node.citations?.forEach((citation, index) => add(`citation[${index}].label`, citation.label));
  node.related?.forEach((related, index) => {
    add(`related[${index}].label`, related.label);
    add(`related[${index}].description`, related.description);
  });
  return found;
}

/**
 * Structural checks for the whole service, returning a list of problem
 * descriptions (empty when it is sound). Checked:
 *  - duplicate node ids, topic slugs, or option ids within one question;
 *  - a question with fewer than 2 options;
 *  - every `start` and `next` reference resolving;
 *  - every node reachable from some topic's start, and every topic reaching
 *    at least one outcome;
 *  - no cycles among question nodes;
 *  - topic paths and internal hrefs starting with "/" and carrying no locale
 *    prefix;
 *  - outcomes offering the reader somewhere to go next;
 *  - both languages present and non-empty on every authored string.
 */
export function validateService(service: SmartAnswerService): string[] {
  const problems: string[] = [];
  const byId = nodeIndex(service);
  const ids = new Set<string>();

  for (const node of service.nodes) {
    if (ids.has(node.id)) problems.push(`duplicate node id "${node.id}"`);
    ids.add(node.id);
  }

  const slugs = new Set<string>();
  for (const topic of service.topics) {
    if (slugs.has(topic.slug)) problems.push(`duplicate topic slug "${topic.slug}"`);
    slugs.add(topic.slug);
    if (!ids.has(topic.start)) {
      problems.push(`topic "${topic.slug}" starts at missing node "${topic.start}"`);
    }
    if (topic.keywords.length === 0) {
      problems.push(`topic "${topic.slug}" has no keywords, so search cannot find it`);
    }
    if (!topic.path.startsWith("/")) {
      problems.push(`topic "${topic.slug}" has path "${topic.path}" that does not start with /`);
    }
    if (/^\/(en|th)(\/|$)/.test(topic.path)) {
      problems.push(
        `topic "${topic.slug}" has path "${topic.path}" with a hard-coded locale prefix`
      );
    }
  }

  for (const node of service.nodes) {
    if (node.kind !== "question") continue;

    if (node.options.length < 2) {
      problems.push(`question "${node.id}" has fewer than 2 options`);
    }
    const optionIds = new Set<string>();
    for (const option of node.options) {
      if (optionIds.has(option.id)) {
        problems.push(`question "${node.id}" has duplicate option id "${option.id}"`);
      }
      optionIds.add(option.id);
      if (!ids.has(option.next)) {
        problems.push(
          `question "${node.id}" option "${option.id}" points to missing node "${option.next}"`
        );
      }
    }
  }

  // Reachability over question -> option.next edges, from every topic start.
  const reachable = new Set<string>();
  const queue = service.topics.map((topic) => topic.start).filter((id) => ids.has(id));
  while (queue.length > 0) {
    const id = queue.shift()!;
    if (reachable.has(id)) continue;
    reachable.add(id);
    const node = byId.get(id);
    if (node?.kind === "question") {
      for (const option of node.options) {
        if (ids.has(option.next)) queue.push(option.next);
      }
    }
  }

  for (const node of service.nodes) {
    if (!reachable.has(node.id)) {
      problems.push(`node "${node.id}" is unreachable from every topic`);
    }
  }

  for (const topic of service.topics) {
    const seen = new Set<string>();
    const local = ids.has(topic.start) ? [topic.start] : [];
    let hasOutcome = false;
    while (local.length > 0) {
      const id = local.shift()!;
      if (seen.has(id)) continue;
      seen.add(id);
      const node = byId.get(id);
      if (!node) continue;
      if (node.kind === "outcome") {
        hasOutcome = true;
        continue;
      }
      for (const option of node.options) if (ids.has(option.next)) local.push(option.next);
    }
    if (!hasOutcome) problems.push(`topic "${topic.slug}" never reaches an outcome`);
  }

  // Cycle detection among question nodes via DFS colouring.
  const WHITE = 0;
  const GRAY = 1;
  const BLACK = 2;
  const color = new Map<string, number>();
  for (const node of service.nodes) color.set(node.id, WHITE);

  let hasCycle = false;
  const visit = (id: string) => {
    if (hasCycle) return;
    color.set(id, GRAY);
    const node = byId.get(id);
    if (node?.kind === "question") {
      for (const option of node.options) {
        if (!ids.has(option.next)) continue;
        const state = color.get(option.next);
        if (state === GRAY) {
          hasCycle = true;
          return;
        }
        if (state === WHITE) visit(option.next);
      }
    }
    color.set(id, BLACK);
  };
  for (const topic of service.topics) {
    if (ids.has(topic.start) && color.get(topic.start) === WHITE) visit(topic.start);
  }
  if (hasCycle) problems.push("service contains a cycle");

  for (const node of service.nodes) {
    if (node.kind !== "outcome") continue;

    const exits =
      (node.actions?.length ?? 0) + (node.related?.length ?? 0) + (node.citations?.length ?? 0);
    if (exits === 0) {
      problems.push(`outcome "${node.id}" is a dead end: no action, related page, or citation`);
    }

    const links = [
      ...(node.actions ?? []).map((action) => ({
        href: action.href,
        external: action.external ?? false,
      })),
      ...(node.citations ?? []).map((citation) => ({ href: citation.href, external: false })),
      ...(node.related ?? []).map((related) => ({ href: related.href, external: false })),
    ];
    for (const { href, external } of links) {
      if (external) {
        // `mailto:` is allowed alongside https because several answers hand
        // off to an office by email, which is the channel that office
        // actually uses.
        if (!href.startsWith("https://") && !href.startsWith("mailto:")) {
          problems.push(
            `outcome "${node.id}" has external link "${href}" that is not https or mailto`
          );
        }
        continue;
      }
      if (!href.startsWith("/")) {
        problems.push(
          `outcome "${node.id}" has internal link "${href}" that does not start with /`
        );
      }
      if (/^\/(en|th)\//.test(href)) {
        problems.push(
          `outcome "${node.id}" has internal link "${href}" with a hard-coded locale prefix`
        );
      }
    }
  }

  for (const node of service.nodes) {
    for (const { path, value } of bilingualStrings(node)) {
      if (!value.en?.trim()) problems.push(`node "${node.id}" ${path} is missing English`);
      if (!value.th?.trim()) problems.push(`node "${node.id}" ${path} is missing Thai`);
    }
  }

  return problems;
}
