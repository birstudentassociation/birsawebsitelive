/**
 * Pure engine for Smart Answers: resolving a flow's current step from a list
 * of answers, and validating a flow's shape at build/test time. No React, no
 * side effects — this is unit-testable in isolation (see
 * `tests/unit/smart-answers.test.ts`).
 */
import type {
  SmartAnswerFlow,
  SmartAnswerNode,
  SmartAnswerOption,
  SmartAnswerQuestion,
} from "@/content/smart-answers/types";

export type ResolvedTrailStep = { question: SmartAnswerQuestion; option: SmartAnswerOption };

export type ResolvedFlow = {
  /** The next question to ask, or the outcome reached. */
  node: SmartAnswerNode;
  /** The validated question/answer path taken to reach `node`, in order. */
  trail: ResolvedTrailStep[];
};

function findNode(flow: SmartAnswerFlow, id: string): SmartAnswerNode | undefined {
  return flow.nodes.find((node) => node.id === id);
}

/**
 * Walk `flow` from its start node, replaying `answerIds` in order. Each
 * answer must match an option of the *current* question; the first
 * invalid or extra answer (one that doesn't match, or one given after an
 * outcome is already reached) is dropped, and everything after it is
 * ignored. This means a tampered, stale, or hand-edited URL degrades
 * gracefully to the last valid state instead of crashing or 404ing.
 */
export function resolveFlow(flow: SmartAnswerFlow, answerIds: string[]): ResolvedFlow {
  const trail: ResolvedTrailStep[] = [];
  let current = findNode(flow, flow.start);

  for (const answerId of answerIds) {
    if (!current || current.kind !== "question") break;
    const option = current.options.find((candidate) => candidate.id === answerId);
    if (!option) break;
    trail.push({ question: current, option });
    current = findNode(flow, option.next);
  }

  // `current` can only be missing here if the flow itself is malformed (a
  // dangling `next` id) — `validateFlow` is expected to catch that before a
  // flow ships. Fall back to a blank, clearly-unreachable outcome rather than
  // throwing, so a bad content edit degrades instead of crashing the page.
  const node: SmartAnswerNode = current ?? {
    kind: "outcome",
    id: "__unresolved__",
    title: { en: "", th: "" },
    summary: { en: "", th: "" },
  };

  return { node, trail };
}

/** Encode a list of answer ids as repeated `a` query params, e.g. `?a=x&a=y`. */
export function answersQuery(answerIds: string[]): string {
  if (answerIds.length === 0) return "";
  const params = new URLSearchParams();
  for (const id of answerIds) params.append("a", id);
  return `?${params.toString()}`;
}

/**
 * Structural checks for a flow, returning a list of problem descriptions
 * (empty when the flow is sound). Checked:
 *  - duplicate node ids, or duplicate option ids within one question;
 *  - a question with fewer than 2 options;
 *  - `flow.start` and every `option.next` referencing a node that exists;
 *  - every node reachable from `flow.start`;
 *  - at least one reachable outcome;
 *  - no cycles among question nodes (a cycle would mean some answer
 *    sequence never terminates in an outcome).
 */
export function validateFlow(flow: SmartAnswerFlow): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();

  for (const node of flow.nodes) {
    if (ids.has(node.id)) {
      problems.push(`duplicate node id "${node.id}"`);
    }
    ids.add(node.id);

    if (node.kind === "question") {
      if (node.options.length < 2) {
        problems.push(`question "${node.id}" has fewer than 2 options`);
      }
      const optionIds = new Set<string>();
      for (const option of node.options) {
        if (optionIds.has(option.id)) {
          problems.push(`question "${node.id}" has duplicate option id "${option.id}"`);
        }
        optionIds.add(option.id);
      }
    }
  }

  if (!ids.has(flow.start)) {
    problems.push(`start node "${flow.start}" does not exist`);
  }

  for (const node of flow.nodes) {
    if (node.kind !== "question") continue;
    for (const option of node.options) {
      if (!ids.has(option.next)) {
        problems.push(
          `question "${node.id}" option "${option.id}" points to missing node "${option.next}"`
        );
      }
    }
  }

  // Reachability from start, over question -> option.next edges only
  // (outcomes are leaves with no outgoing edges).
  const reachable = new Set<string>();
  const queue: string[] = ids.has(flow.start) ? [flow.start] : [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    if (reachable.has(id)) continue;
    reachable.add(id);
    const node = findNode(flow, id);
    if (node?.kind === "question") {
      for (const option of node.options) {
        if (ids.has(option.next)) queue.push(option.next);
      }
    }
  }

  for (const node of flow.nodes) {
    if (!reachable.has(node.id)) {
      problems.push(`node "${node.id}" is unreachable from start`);
    }
  }

  const hasReachableOutcome = flow.nodes.some(
    (node) => node.kind === "outcome" && reachable.has(node.id)
  );
  if (!hasReachableOutcome) {
    problems.push("flow has no reachable outcome");
  }

  // Cycle detection among question nodes via DFS colouring.
  const WHITE = 0;
  const GRAY = 1;
  const BLACK = 2;
  const color = new Map<string, number>();
  for (const node of flow.nodes) color.set(node.id, WHITE);

  let hasCycle = false;
  function visit(id: string) {
    if (hasCycle) return;
    color.set(id, GRAY);
    const node = findNode(flow, id);
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
  }
  if (ids.has(flow.start)) visit(flow.start);
  if (hasCycle) problems.push("flow contains a cycle");

  return problems;
}
