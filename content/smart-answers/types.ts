/**
 * Typed model for Smart Answers: one guided answering service that turns the
 * site's regulations, handbook and service content into plain-language
 * answers (GOV.UK "smart answers" pattern). Every step is a URL, every
 * question a plain GET form, with no client-side state.
 *
 * The service is a single graph with many doors. Topics are entry points into
 * one shared pool of nodes, not separate trees: a question or an outcome
 * written once ("contact the Registrar about registration") is reached from
 * every route that should land there, and is fixed in one place when the
 * facts change.
 *
 * What the reader has told us about themselves (see `./audience`) and what
 * they have answered so far are both facts. Options can record facts,
 * questions can answer themselves from facts already known, and outcome
 * content can appear only when a fact holds. That is what makes one answer
 * read differently for a first-week international student and for a
 * third-year club treasurer without maintaining two of everything.
 *
 * Mirrors the site's bilingual-string convention (see
 * `content/activity/regulations/types.ts`) with a local `Bi` so this content
 * module has no dependency on the regulations types.
 */

/** A bilingual string, authored natively in both languages (not translated). */
export type Bi = { en: string; th: string };

/**
 * A predicate over known facts. Kept deliberately small and serialisable:
 * content authors write data, never functions, so a flow stays inspectable,
 * diffable and checkable by `validateService`.
 *
 * A fact that is not known fails every `is` test, so an answer written for a
 * known audience never leaks to a reader who has told us nothing.
 */
export type Condition =
  | { fact: string; is: string | string[] }
  | { fact: string; known: boolean }
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition };

/** One answer choice on a question node. */
export type SmartAnswerOption = {
  /** Stable id for this option; also the value submitted in the `a` query param. */
  id: string;
  label: Bi;
  hint?: Bi;
  /** Id of the node (question or outcome) reached by choosing this option. */
  next: string;
  /** Only offered when this holds. A question must keep 2 unconditional options. */
  when?: Condition;
  /** Facts recorded by choosing this, readable by every later condition. */
  set?: Record<string, string>;
};

/** A single question step: renders as a plain GET form with a radio group. */
export type SmartAnswerQuestion = {
  kind: "question";
  /** Stable id for this node, unique across the whole service. */
  id: string;
  question: Bi;
  hint?: Bi;
  /**
   * Answer this question automatically when we already know the answer, in
   * order, first match wins. `option` names an option of this same question,
   * so the recorded trail is identical to the one a reader would have
   * produced by choosing it by hand.
   */
  skipWhen?: { when: Condition; option: string }[];
  /** At least 2 options (enforced by `validateService`, not by the type). */
  options: SmartAnswerOption[];
};

/** A call-to-action link shown on an outcome. */
export type SmartAnswerAction = {
  label: Bi;
  /** Internal path (starts with "/", no locale prefix) or an absolute external URL. */
  href: string;
  external?: boolean;
  when?: Condition;
};

/** A "based on" link into the regulations library backing an outcome. */
export type SmartAnswerCitation = {
  label: Bi;
  /** e.g. "/activity/regulations/political-science-2565#prov-41". */
  href: string;
  when?: Condition;
};

/** Further reading: a page on this site that goes deeper than the answer. */
export type SmartAnswerRelated = {
  label: Bi;
  /** Internal path (starts with "/", no locale prefix). */
  href: string;
  description?: Bi;
  when?: Condition;
};

/** A piece of outcome body content, shown only when its condition holds. */
export type OutcomeBlock =
  | { kind: "paragraph"; text: Bi; when?: Condition }
  | { kind: "steps"; title?: Bi; items: Bi[]; when?: Condition }
  | { kind: "note"; tone: "info" | "warning"; text: Bi; when?: Condition };

/** A terminal answer: the end of one path through the service. */
export type SmartAnswerOutcome = {
  kind: "outcome";
  /** Stable id for this node, unique across the whole service. */
  id: string;
  title: Bi;
  summary: Bi;
  /**
   * Who actually decides or acts on this, when it is not BIRSA. BIRSA is a
   * student association, not a university office, and saying so on the answer
   * itself is the difference between routing someone and misleading them.
   */
  owner?: Bi;
  body?: OutcomeBlock[];
  actions?: SmartAnswerAction[];
  citations?: SmartAnswerCitation[];
  related?: SmartAnswerRelated[];
  /**
   * Pre-selects a subject on `/contact` for the "this did not answer my
   * question" handoff. Must be a category id the contact form accepts.
   */
  contactCategory?: string;
};

export type SmartAnswerNode = SmartAnswerQuestion | SmartAnswerOutcome;

/** Groupings used to lay out the hub. */
export const topicGroups = ["help", "activities", "study", "life", "rights"] as const;
export type TopicGroupId = (typeof topicGroups)[number];

/** A door into the graph: one row on the hub, one start page, one start node. */
export type SmartAnswerTopic = {
  /** URL slug under `/answers/<slug>`. */
  slug: string;
  title: Bi;
  lede: Bi;
  group: TopicGroupId;
  /** Id of the node this topic starts at. Topics may share start nodes. */
  start: string;
  /** Short "what you'll be asked" bullet list shown on the start page. */
  whatYoullNeed?: Bi[];
  /**
   * Terms the hub's search box matches, in both languages, lower case. Write
   * what a student would actually type, including the wrong-but-common word.
   */
  keywords: string[];
  /** Listed first on the hub when this holds, e.g. visas for arrivals. */
  spotlightWhen?: Condition;
  /** Kept off the hub grid: reached from the "not sure where to start" route. */
  hideFromHub?: boolean;
};

/** The whole service: every door, and the one pool of nodes behind them. */
export type SmartAnswerService = {
  topics: SmartAnswerTopic[];
  nodes: SmartAnswerNode[];
};
