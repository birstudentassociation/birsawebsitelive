/**
 * Pure engine for Smart Answers: deciding what to ask next, what an answer
 * should say for this particular reader, and whether the authored service is
 * structurally sound. No React, no side effects, so this is unit-testable in
 * isolation (see `tests/unit/smart-answers.test.ts`).
 *
 * Two inputs decide a step: the audience profile carried in `?p=` and the
 * answers carried in `?a=`. Both are user-controlled strings, so both are
 * treated as untrusted: anything that does not match the authored graph is
 * dropped, and the reader lands on the last state that does make sense
 * instead of on an error.
 *
 * Only answers the reader gave by hand are stored in the URL. Steps the
 * service answered for them from their profile are re-derived on every
 * request, so editing the profile re-routes the rest of the journey rather
 * than stranding it on a stale path.
 */
import {
  audienceDimensions,
  audienceQuestions,
  dimensionForValue,
  type AudienceProfile,
} from "@/content/smart-answers/audience";
import type {
  Bi,
  Condition,
  SmartAnswerNode,
  SmartAnswerOption,
  SmartAnswerOutcome,
  SmartAnswerQuestion,
  SmartAnswerService,
  SmartAnswerTopic,
} from "@/content/smart-answers/types";

/** Everything known about the reader: their profile plus what they answered. */
export type Facts = Record<string, string>;

/* -------------------------------------------------------------------------- */
/* Conditions                                                                 */
/* -------------------------------------------------------------------------- */

/** Evaluate a content-authored predicate against the facts known so far. */
export function evaluate(condition: Condition | undefined, facts: Facts): boolean {
  if (!condition) return true;

  if ("all" in condition) return condition.all.every((child) => evaluate(child, facts));
  if ("any" in condition) return condition.any.some((child) => evaluate(child, facts));
  if ("not" in condition) return !evaluate(condition.not, facts);

  if ("known" in condition) {
    const isKnown = facts[condition.fact] !== undefined;
    return condition.known ? isKnown : !isKnown;
  }

  const value = facts[condition.fact];
  if (value === undefined) return false;
  return Array.isArray(condition.is) ? condition.is.includes(value) : condition.is === value;
}

/** Keep only the items whose `when` holds, preserving authored order. */
export function filterWhen<T extends { when?: Condition }>(
  items: T[] | undefined,
  facts: Facts
): T[] {
  if (!items) return [];
  return items.filter((item) => evaluate(item.when, facts));
}

/* -------------------------------------------------------------------------- */
/* The audience profile in the URL                                            */
/* -------------------------------------------------------------------------- */

/**
 * Decode `?p=international.starting` into a profile. Tokens are matched by
 * value, so their order does not matter and an unknown or repeated token is
 * dropped rather than rejected: an old or hand-edited link keeps working with
 * whatever part of it still means something.
 */
export function parseProfile(raw: string | string[] | undefined): AudienceProfile {
  const first = Array.isArray(raw) ? raw[0] : raw;
  if (!first) return {};

  const profile: AudienceProfile = {};
  for (const token of first.split(".")) {
    const dimension = dimensionForValue(token);
    if (dimension && profile[dimension] === undefined) profile[dimension] = token;
  }
  return profile;
}

/** Encode a profile as a stable, order-independent `p` token. */
export function serializeProfile(profile: AudienceProfile): string {
  return audienceDimensions
    .map((dimension) => profile[dimension])
    .filter((value): value is string => Boolean(value))
    .join(".");
}

export function profileToFacts(profile: AudienceProfile): Facts {
  const facts: Facts = {};
  for (const dimension of audienceDimensions) {
    const value = profile[dimension];
    if (value) facts[dimension] = value;
  }
  return facts;
}

/** Build the `?p=...&a=...` query for one state of one topic. */
export function stepQuery(profile: AudienceProfile, answerIds: string[]): string {
  const params = new URLSearchParams();
  const token = serializeProfile(profile);
  if (token) params.set("p", token);
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
  /**
   * Set when the service answered this itself from the profile. Such a step
   * is shown to the reader as an assumption they can correct, never as
   * something they said.
   */
  auto: boolean;
  /**
   * Position of this answer in the `a` query param, for building a "change
   * this answer" link. Null on automatic steps, which are changed by editing
   * the profile instead.
   */
  answerIndex: number | null;
};

export type ResolvedJourney = {
  /** The next question to ask, or the outcome reached. */
  node: SmartAnswerNode;
  /** The validated path taken to reach `node`, in order. */
  trail: ResolvedStep[];
  /** Profile facts plus everything recorded along the trail. */
  facts: Facts;
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

/** The options this reader can actually see, in authored order. */
export function visibleOptions(question: SmartAnswerQuestion, facts: Facts): SmartAnswerOption[] {
  return filterWhen(question.options, facts);
}

/**
 * The option to take without asking, if any: an explicit `skipWhen` rule
 * first, then the degenerate case where conditions have left the reader only
 * one thing they could possibly choose.
 */
function automaticOption(
  question: SmartAnswerQuestion,
  facts: Facts
): SmartAnswerOption | undefined {
  for (const rule of question.skipWhen ?? []) {
    if (!evaluate(rule.when, facts)) continue;
    const option = question.options.find((candidate) => candidate.id === rule.option);
    if (option && evaluate(option.when, facts)) return option;
  }

  const visible = visibleOptions(question, facts);
  return visible.length === 1 ? visible[0] : undefined;
}

/**
 * Walk the graph from `topic.start`, replaying `rawAnswerIds` in order.
 *
 * Each answer must match a visible option of the current question. The first
 * answer that does not (because the graph changed, the link was hand-edited,
 * or a different profile has hidden that option) ends the replay there, and
 * that question is asked again. Everything after it is ignored.
 */
export function resolveTopic(
  service: SmartAnswerService,
  topic: SmartAnswerTopic,
  profile: AudienceProfile,
  rawAnswerIds: string[]
): ResolvedJourney {
  const nodes = nodeIndex(service);
  const facts: Facts = profileToFacts(profile);
  const trail: ResolvedStep[] = [];
  const answerIds: string[] = [];

  let current = nodes.get(topic.start);

  while (current && current.kind === "question") {
    const question = current;

    const auto = automaticOption(question, facts);
    if (auto) {
      trail.push({ question, option: auto, auto: true, answerIndex: null });
      Object.assign(facts, auto.set ?? {});
      current = nodes.get(auto.next);
      continue;
    }

    const answerId = rawAnswerIds[answerIds.length];
    if (answerId === undefined) break;

    const option = visibleOptions(question, facts).find((candidate) => candidate.id === answerId);
    if (!option) break;

    trail.push({ question, option, auto: false, answerIndex: answerIds.length });
    answerIds.push(option.id);
    Object.assign(facts, option.set ?? {});
    current = nodes.get(option.next);
  }

  // `current` is only missing here if the graph itself is broken (a dangling
  // `next`), which `validateService` is expected to catch before it ships.
  // Degrade to a blank outcome rather than throwing, so one bad content edit
  // cannot take a page down.
  return { node: current ?? UNRESOLVED, trail, facts, answerIds };
}

/**
 * The profile implied by a journey: what the reader arrived with, plus
 * anything they told us along the way that also fills in a profile
 * dimension, so the next topic they open starts better informed.
 */
export function profileFromJourney(journey: ResolvedJourney): AudienceProfile {
  const profile: AudienceProfile = {};
  for (const dimension of audienceDimensions) {
    const value = journey.facts[dimension];
    if (value) profile[dimension] = value;
  }
  return profile;
}

/* -------------------------------------------------------------------------- */
/* Finding the right door                                                     */
/* -------------------------------------------------------------------------- */

function normalise(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Match a free-text query against topic keywords and titles. Substring in
 * both directions, since Thai is not word-delimited and a keyword is often a
 * fragment of what someone types ("ยืมของ" inside "อยากยืมของ").
 */
export function matchTopics(service: SmartAnswerService, query: string): SmartAnswerTopic[] {
  const needle = normalise(query);
  if (needle.length < 2) return [];

  const scored: { topic: SmartAnswerTopic; score: number }[] = [];

  for (const topic of service.topics) {
    if (topic.hideFromHub) continue;

    let score = 0;
    for (const keyword of topic.keywords) {
      const term = normalise(keyword);
      if (!term) continue;
      if (term === needle) score = Math.max(score, 3);
      else if (needle.includes(term) || term.includes(needle)) score = Math.max(score, 2);
    }
    if (score === 0) {
      const haystack = normalise(
        `${topic.title.en} ${topic.title.th} ${topic.lede.en} ${topic.lede.th}`
      );
      if (haystack.includes(needle)) score = 1;
    }

    if (score > 0) scored.push({ topic, score });
  }

  return scored.sort((a, b) => b.score - a.score).map((entry) => entry.topic);
}

/** Hub ordering: topics flagged relevant to this reader come first. */
export function orderTopics(topics: SmartAnswerTopic[], facts: Facts): SmartAnswerTopic[] {
  return [...topics].sort((a, b) => {
    const aSpot = a.spotlightWhen && evaluate(a.spotlightWhen, facts) ? 1 : 0;
    const bSpot = b.spotlightWhen && evaluate(b.spotlightWhen, facts) ? 1 : 0;
    return bSpot - aSpot;
  });
}

export function getTopic(service: SmartAnswerService, slug: string): SmartAnswerTopic | undefined {
  return service.topics.find((topic) => topic.slug === slug);
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

function collectConditions(service: SmartAnswerService): Condition[] {
  const found: Condition[] = [];
  const push = (condition: Condition | undefined) => {
    if (condition) found.push(condition);
  };

  for (const topic of service.topics) push(topic.spotlightWhen);

  for (const node of service.nodes) {
    if (node.kind === "question") {
      for (const option of node.options) push(option.when);
      for (const rule of node.skipWhen ?? []) push(rule.when);
      continue;
    }
    for (const block of node.body ?? []) push(block.when);
    for (const action of node.actions ?? []) push(action.when);
    for (const citation of node.citations ?? []) push(citation.when);
    for (const related of node.related ?? []) push(related.when);
  }

  return found;
}

/** Every fact reference inside a condition tree. */
function factLeaves(condition: Condition): { fact: string; values: string[] }[] {
  if ("all" in condition) return condition.all.flatMap(factLeaves);
  if ("any" in condition) return condition.any.flatMap(factLeaves);
  if ("not" in condition) return factLeaves(condition.not);
  if ("known" in condition) return [{ fact: condition.fact, values: [] }];
  return [
    {
      fact: condition.fact,
      values: Array.isArray(condition.is) ? condition.is : [condition.is],
    },
  ];
}

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
 *  - a question with fewer than 2 options, or with no unconditional option
 *    (which could leave a reader with nothing to choose);
 *  - every `start`, `next` and `skipWhen.option` reference resolving;
 *  - every node reachable from some topic's start, and every topic reaching
 *    at least one outcome;
 *  - no cycles among question nodes;
 *  - conditions referencing only facts the profile or some option sets, and
 *    comparing them only against values that occur somewhere;
 *  - internal hrefs starting with "/" and carrying no locale prefix;
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
      problems.push(`topic "${topic.slug}" has no keywords, so the hub search cannot find it`);
    }
  }

  // Facts the graph can ever hold: the audience dimensions, plus everything
  // any option records. A condition outside this set is a typo.
  const settableFacts = new Map<string, Set<string>>();
  for (const dimension of audienceDimensions) settableFacts.set(dimension, new Set());
  for (const question of audienceQuestions) {
    for (const choice of question.choices) {
      settableFacts.get(question.dimension)?.add(choice.value);
    }
  }
  for (const node of service.nodes) {
    if (node.kind !== "question") continue;
    for (const option of node.options) {
      for (const [key, value] of Object.entries(option.set ?? {})) {
        const values = settableFacts.get(key) ?? new Set<string>();
        values.add(value);
        settableFacts.set(key, values);
      }
    }
  }

  for (const node of service.nodes) {
    if (node.kind !== "question") continue;

    if (node.options.length < 2) {
      problems.push(`question "${node.id}" has fewer than 2 options`);
    }
    if (!node.options.some((option) => option.when === undefined)) {
      problems.push(`question "${node.id}" has no unconditional option`);
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

    for (const rule of node.skipWhen ?? []) {
      if (!optionIds.has(rule.option)) {
        problems.push(
          `question "${node.id}" skips to option "${rule.option}", which it does not have`
        );
      }
    }
  }

  for (const condition of collectConditions(service)) {
    for (const leaf of factLeaves(condition)) {
      const known = settableFacts.get(leaf.fact);
      if (!known) {
        problems.push(`condition references unknown fact "${leaf.fact}"`);
        continue;
      }
      for (const value of leaf.values) {
        if (!known.has(value)) {
          problems.push(
            `condition compares fact "${leaf.fact}" against unreachable value "${value}"`
          );
        }
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
