/**
 * Typed model for Smart Answers: short guided checks that turn the site's
 * regulations and guides into plain-language answers (GOV.UK "smart answers"
 * pattern). Every step is a URL, every question a plain GET form, with no
 * client-side state.
 *
 * The service is a single graph with a few doors. Topics are entry points
 * into one pool of nodes, each hosted on the page it belongs to (see
 * `SmartAnswerTopic.path`). A question or an outcome written once ("ask BIRSA
 * about this") is reached from every route that should land there, and is
 * fixed in one place when the facts change.
 *
 * Mirrors the site's bilingual-string convention (see
 * `content/activity/regulations/types.ts`) with a local `Bi` so this content
 * module has no dependency on the regulations types.
 */

/** A bilingual string, authored natively in both languages (not translated). */
export type Bi = { en: string; th: string };

/** One answer choice on a question node. */
export type SmartAnswerOption = {
  /** Stable id for this option; also the value submitted in the `a` query param. */
  id: string;
  label: Bi;
  hint?: Bi;
  /** Id of the node (question or outcome) reached by choosing this option. */
  next: string;
};

/** A single question step: renders as a plain GET form with a radio group. */
export type SmartAnswerQuestion = {
  kind: "question";
  /** Stable id for this node, unique across the whole service. */
  id: string;
  question: Bi;
  hint?: Bi;
  /** At least 2 options (enforced by `validateService`, not by the type). */
  options: SmartAnswerOption[];
};

/** A call-to-action link shown on an outcome. */
export type SmartAnswerAction = {
  label: Bi;
  /** Internal path (starts with "/", no locale prefix) or an absolute external URL. */
  href: string;
  external?: boolean;
};

/** A "based on" link into the regulations library backing an outcome. */
export type SmartAnswerCitation = {
  label: Bi;
  /** e.g. "/activity/regulations/political-science-2565#prov-41". */
  href: string;
};

/** Further reading: a page on this site that goes deeper than the answer. */
export type SmartAnswerRelated = {
  label: Bi;
  /** Internal path (starts with "/", no locale prefix). */
  href: string;
  description?: Bi;
};

/** A piece of outcome body content. */
export type OutcomeBlock =
  | { kind: "paragraph"; text: Bi }
  | { kind: "steps"; title?: Bi; items: Bi[] }
  | { kind: "note"; tone: "info" | "warning"; text: Bi };

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

/** A door into the graph: one check, one start node, hosted at one page. */
export type SmartAnswerTopic = {
  /** Stable id for this check, unique across the service. */
  slug: string;
  /** Internal path of the page that hosts this check (starts with "/", no locale prefix). */
  path: string;
  title: Bi;
  lede: Bi;
  /** Id of the node this topic starts at. */
  start: string;
  /**
   * Terms site search matches, in both languages, lower case. Write what a
   * student would actually type, including the wrong-but-common word.
   */
  keywords: string[];
};

/** The whole service: every door, and the one pool of nodes behind them. */
export type SmartAnswerService = {
  topics: SmartAnswerTopic[];
  nodes: SmartAnswerNode[];
};
