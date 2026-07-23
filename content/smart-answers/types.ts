/**
 * Typed model for BIRSA's "Smart Answers": short, question-driven flows that
 * turn the site's regulations and service content into plain-language guided
 * answers (GOV.UK "smart answers" pattern). Every step is a URL, every
 * question a plain GET form — no client-side state.
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
  /** Stable id for this node, unique within the flow. */
  id: string;
  question: Bi;
  hint?: Bi;
  /** At least 2 options (enforced by `validateFlow`, not by the type). */
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

/** A terminal answer: the end of one path through the flow. */
export type SmartAnswerOutcome = {
  kind: "outcome";
  /** Stable id for this node, unique within the flow. */
  id: string;
  title: Bi;
  summary: Bi;
  body?: Bi[];
  actions?: SmartAnswerAction[];
  citations?: SmartAnswerCitation[];
};

export type SmartAnswerNode = SmartAnswerQuestion | SmartAnswerOutcome;

/** A complete smart-answer flow, keyed by its URL slug under `/answers/<slug>`. */
export type SmartAnswerFlow = {
  slug: string;
  title: Bi;
  lede: Bi;
  /** Short "what you'll be asked" bullet list shown on the flow's start page. */
  whatYoullNeed?: Bi[];
  /** Id of the first node. */
  start: string;
  nodes: SmartAnswerNode[];
};
