/**
 * The guided-journey tree migration (REDESIGN-2.0 §11.4 Wave 6, "Smart
 * Answers trees"). Pure transform logic only: everything here is a function
 * from an in-memory content shape to another in-memory shape, with no file
 * I/O and no network. `scripts/migrate-trees.mjs`, `scripts/verify-trees.mjs`
 * and `scripts/rollback-trees.mjs` are the thin CLI wrappers that read the
 * filesystem, call these functions, and write the results.
 *
 * WHAT THIS MIGRATES. Two families that are structurally "a guided journey",
 * even though only one of them branches:
 *
 *  - Smart Answers (`content/smart-answers/**`): a single shared pool of
 *    question and outcome nodes, entered through many topic doors, wired by
 *    `option.next` edges and gated by `Condition`s over a small fact
 *    vocabulary (`content/smart-answers/audience.ts` plus whatever an option
 *    itself records via `set`). This is the family the brief calls "the
 *    hardest to verify": a structurally valid tree can still have silently
 *    lost an edge.
 *  - Onboarding tracks (`content/onboarding/**`): a strictly linear
 *    audience -> step -> task hierarchy with no conditions, no shared nodes
 *    and no branching. It "works the same way" only in the sense that it is
 *    also a guided, ordered journey a reader steps through; it has none of
 *    Smart Answers' graph hazards (unreachable nodes, cycles, dangling
 *    edges), so its integrity checks below are correspondingly smaller.
 *
 * THE TARGET SCHEMA GAP, READ THIS BEFORE CHANGING THE SHAPE BELOW. The wave
 * brief asks this file to target `sanity/schemaTypes/objects/question.ts`
 * (`question`, `questionOption`) and "whichever document type actually holds
 * a topic". Both were read in full, alongside every document type in
 * `sanity/schemaTypes/documents/*.ts` and `sanity/schemaTypes/index.ts`.
 * Neither fits, and forcing the tree into either would misrepresent it:
 *
 *   - `question`/`questionOption` (`sanity/schemaTypes/objects/question.ts`)
 *     belong to `serviceDefinition`, the `/do/<service>` request-form
 *     wizard (`lib/services/defineService.ts`, FROZEN). That is a LINEAR
 *     sequence of form fields answered once and submitted. `questionOption`
 *     is `{ value, label }` only: no `next`, no `when`, no `set`, no `hint`.
 *     `question.type` is one of eleven fixed FIELD KINDS ("email",
 *     "choose-one", ...), not "a node in a branching decision graph". A
 *     Smart Answers question has none of a service question's constraints
 *     (a max length, a field kind) and has several a service question does
 *     not (an option can point at an arbitrary other node anywhere in the
 *     shared pool, can be conditionally hidden, and can assert facts other
 *     nodes read later). Reusing this type would either lose `next`/`when`/
 *     `set` entirely (a silently broken tree, exactly the failure mode this
 *     agent's brief exists to prevent) or bolt those fields onto a type
 *     whose own header says it is "FIELD FOR FIELD, DELIBERATELY, NO MORE"
 *     mirrored to `ServiceDefinition` — which this migration is not allowed
 *     to edit (it is not an owned path) and should not want to, since a
 *     `serviceDefinition` growing branching-graph fields would blur the
 *     boundary REDESIGN-2.0 draws between "a service" and "an answer".
 *   - No `document` type in `sanity/schemaTypes/documents/*.ts` holds a
 *     topic or a node. The closest candidates were checked and rejected on
 *     the record: `guide` composes the eleven-item section palette
 *     (`sanity/schemaTypes/objects/sectionTypes.ts`), which includes a
 *     "step-by-step" section (`heading`/`body` only, no branching, no
 *     tasks, no links) and a "task-list" section (an AUTHOR-set `status`
 *     enum — not-started/in-progress/cannot-start/completed — which is the
 *     opposite of Onboarding's model, where completion is a READER-set,
 *     client-only checkbox that is never authored and never leaves the
 *     browser, per `content/onboarding/types.ts` and
 *     `components/onboarding/StepTasksClient.tsx`). Neither section type
 *     carries a `next` edge, a `Condition`, or a fact vocabulary. No other
 *     document type is even a plausible candidate (`page`, `newsArticle`,
 *     `event`, `club`, `regulation`, `minutes`, `decision`, `budgetEntry`,
 *     `committeeMember`, `portfolio`, `siteSettings`, `navigation` are all
 *     shaped for something else entirely).
 *
 * REDESIGN-2.0.md §11.5 itself resolves the "leave in git or move to the
 * CMS" question for Smart Answers by naming a shape nothing in
 * `sanity/schemaTypes/**` yet builds: "Node and edge documents with
 * schema-enforced referential integrity: every outcome must be reachable,
 * every question must have at least two answers, every answer must point at
 * an existing node, and the `out-not-covered` honest fallback is mandatory
 * and cannot be deleted." Wave 3D's own header confirms the schema for this
 * wave's chassis document is `serviceDefinition`, mirrored field for field to
 * a different frozen type; it says nothing about Smart Answers because that
 * schema was never built. THIS IS THE REAL GAP, reported per the brief's own
 * instruction rather than papered over: a `smartAnswerNode` / `smartAnswerTopic`
 * Sanity schema (object types for `Condition`, `SmartAnswerOption`,
 * `OutcomeBlock` and friends; document types for the node pool and the topic
 * list; the publish-blocking tree validation §11.5 describes) does not exist
 * and is not this agent's to create (`sanity/schemaTypes/**` is read-only for
 * this wave; see `docs/migration/trees.md` and this agent's final report).
 *
 * So the shapes below are a PROVISIONAL, faithful, field-for-field mirror of
 * `content/smart-answers/types.ts` and `content/onboarding/types.ts`, using
 * `localizedString`/`localizedText` (Wave 3B, a genuine fit for a bilingual
 * scalar) and Sanity's native `reference` type for every `next`/`start` edge
 * (so a real Sanity dataset enforces "every answer points at an existing
 * node" the moment this is imported, which is the referential-integrity
 * property §11.5 asks for even before a bespoke schema exists to render or
 * edit it). Everything that has no existing Sanity object type of its own
 * (`Condition`, `OutcomeBlock`, `SmartAnswerOption`, ...) is emitted as a
 * plain nested object, self-tagged with a `_type` naming what it is
 * (`smartAnswerConditionFact`, `smartAnswerBlockNote`, ...) so a future
 * schema author has a concrete, working data shape to declare types for,
 * rather than a blank page. None of this is invented content: every field
 * value below traces to one field of one node in `content/smart-answers/**`
 * or `content/onboarding/**`, transformed, never authored.
 *
 * DETERMINISTIC IDS. `lib/migration/ids.ts` (Wave 6A) did not exist for most
 * of the time this file was being built — checked repeatedly, per that
 * agent's own brief ("they may not exist yet when you start... come back to
 * them") — so this file originally carried a local stand-in with the same
 * `${prefix}-${key}` shape. It landed mid-session and `nodeDocId` /
 * `topicDocId` / `audienceQuestionDocId` / `onboardingTrackDocId` below now
 * call its `documentId(docType, key)` directly, which is why every id in
 * this artifact is unchanged from before the reconciliation (`sa-node-q-root`
 * stays `sa-node-q-root`): the two schemes were the same shape by
 * construction, not by coincidence, per this file's own earlier note that
 * "every source id in this family is already a stable, human-authored,
 * URL-safe string, so the only job left is a namespacing prefix". Array
 * `_key`s for synthetic (non-content-derived) array members use the shared
 * `arrayKey` for the same reason; array members already keyed by a
 * meaningful, source-unique id (an option's own `id`, a task's own `id`, ...)
 * keep that id as their `_key` rather than wrapping it, since it is already
 * exactly what `arrayKey` exists to produce.
 *
 * ISOMORPHISM, NOT JUST VALIDITY. `docsToSmartAnswerService` and
 * `docsToOnboardingTracks` below are exact inverses of the forward
 * transform: round-tripping source -> documents -> reconstructed source
 * must produce a deep-equal result, not merely a structurally sound one.
 * `tests/unit/migration-trees.test.ts` asserts exactly that against the real
 * content modules, which is the only honest proof that migrating did not
 * quietly drop an edge, a locale, or a fact.
 */
import type { Locale } from "@/lib/i18n";
import { arrayKey, documentId } from "@/lib/migration/ids";
import type {
  Bi,
  Condition,
  OutcomeBlock,
  SmartAnswerAction,
  SmartAnswerCitation,
  SmartAnswerNode,
  SmartAnswerOption,
  SmartAnswerOutcome,
  SmartAnswerQuestion,
  SmartAnswerRelated,
  SmartAnswerService,
  SmartAnswerTopic,
} from "@/content/smart-answers/types";
import type { AudienceQuestion } from "@/content/smart-answers/audience";
import type { OnboardingStep, OnboardingTask, OnboardingTrack } from "@/content/onboarding/types";

/* -------------------------------------------------------------------------- */
/* Generic NDJSON document shape                                              */
/* -------------------------------------------------------------------------- */

/**
 * One line of the artifact `sanity dataset import` consumes: any JSON object
 * carrying at least `_id` and `_type`. Loose on purpose (a `Record`, not a
 * union of the exact document shapes below) because the artifact is meant to
 * be readable by a generic NDJSON writer without re-deriving a type for every
 * nested shape; the exact shapes are documented in the JSDoc above each
 * builder instead, which is where an officer or a schema author will
 * actually look for them.
 */
export type MigratedDoc = { _id: string; _type: string; [key: string]: unknown };

/* -------------------------------------------------------------------------- */
/* Deterministic ids: thin, typed wrappers over `lib/migration/ids.ts`'s      */
/* shared `documentId`, one per document type this family emits.             */
/* -------------------------------------------------------------------------- */

export const NODE_ID_PREFIX = "sa-node";
export const TOPIC_ID_PREFIX = "sa-topic";
export const AUDIENCE_ID_PREFIX = "sa-audience";
export const ONBOARDING_TRACK_ID_PREFIX = "onboarding-track";

export function nodeDocId(nodeId: string): string {
  return documentId(NODE_ID_PREFIX, nodeId);
}

export function topicDocId(slug: string): string {
  return documentId(TOPIC_ID_PREFIX, slug);
}

export function audienceQuestionDocId(dimension: string): string {
  return documentId(AUDIENCE_ID_PREFIX, dimension);
}

export function onboardingTrackDocId(audience: string): string {
  return documentId(ONBOARDING_TRACK_ID_PREFIX, audience);
}

/** Reverse of `nodeDocId`/`topicDocId`/etc: strip a known prefix, or `null`
 * if `id` does not carry it. Used by the reverse transforms below and by
 * `scripts/rollback-trees.mjs`, which has to recover the source id to
 * explain what it is deleting. */
function stripPrefix(id: string, prefix: string): string | null {
  const withDash = `${prefix}-`;
  return id.startsWith(withDash) ? id.slice(withDash.length) : null;
}

/* -------------------------------------------------------------------------- */
/* Bilingual scalars: content/smart-answers/types.ts's `Bi` -> Wave 3B's      */
/* `localizedString` / `localizedText` object types.                         */
/* -------------------------------------------------------------------------- */

type LocalizedField = { _type: "localizedString" | "localizedText"; en: string; th: string };

/** `kind` picks which Wave 3B object type this scalar becomes: `"string"`
 * for a title/label/single line, `"text"` for a paragraph. This is a
 * presentational choice with no effect on the data carried (both are
 * `{ en, th }`), recorded because a future schema literally needs to pick
 * one Sanity field type per field and this is where that choice was made. */
function bi(value: Bi, kind: "string" | "text"): LocalizedField {
  return {
    _type: kind === "string" ? "localizedString" : "localizedText",
    en: value.en,
    th: value.th,
  };
}

function unbi(value: LocalizedField): Bi {
  return { en: value.en, th: value.th };
}

/* -------------------------------------------------------------------------- */
/* Conditions: a small recursive predicate language, self-tagged per variant  */
/* so the shape is legible without a schema to read it against.              */
/* -------------------------------------------------------------------------- */

type MigratedCondition =
  | { _type: "smartAnswerConditionFact"; fact: string; is: string | string[] }
  | { _type: "smartAnswerConditionKnown"; fact: string; known: boolean }
  | { _type: "smartAnswerConditionAll"; all: (MigratedCondition & { _key: string })[] }
  | { _type: "smartAnswerConditionAny"; any: (MigratedCondition & { _key: string })[] }
  | { _type: "smartAnswerConditionNot"; not: MigratedCondition };

function transformCondition(condition: Condition): MigratedCondition {
  if ("all" in condition) {
    return {
      _type: "smartAnswerConditionAll",
      all: condition.all.map((child, index) => ({
        ...transformCondition(child),
        _key: arrayKey("c", String(index)),
      })),
    };
  }
  if ("any" in condition) {
    return {
      _type: "smartAnswerConditionAny",
      any: condition.any.map((child, index) => ({
        ...transformCondition(child),
        _key: arrayKey("c", String(index)),
      })),
    };
  }
  if ("not" in condition) {
    return { _type: "smartAnswerConditionNot", not: transformCondition(condition.not) };
  }
  if ("known" in condition) {
    return { _type: "smartAnswerConditionKnown", fact: condition.fact, known: condition.known };
  }
  return { _type: "smartAnswerConditionFact", fact: condition.fact, is: condition.is };
}

function reverseCondition(condition: MigratedCondition): Condition {
  switch (condition._type) {
    case "smartAnswerConditionAll":
      return { all: condition.all.map(reverseCondition) };
    case "smartAnswerConditionAny":
      return { any: condition.any.map(reverseCondition) };
    case "smartAnswerConditionNot":
      return { not: reverseCondition(condition.not) };
    case "smartAnswerConditionKnown":
      return { fact: condition.fact, known: condition.known };
    case "smartAnswerConditionFact":
      return { fact: condition.fact, is: condition.is };
  }
}

/* -------------------------------------------------------------------------- */
/* Smart Answers: options, questions, outcomes                                */
/* -------------------------------------------------------------------------- */

function transformOption(option: SmartAnswerOption) {
  return {
    _key: option.id,
    _type: "smartAnswerOption",
    id: option.id,
    label: bi(option.label, "string"),
    ...(option.hint ? { hint: bi(option.hint, "text") } : {}),
    next: { _type: "reference", _ref: nodeDocId(option.next) },
    ...(option.when ? { when: transformCondition(option.when) } : {}),
    ...(option.set ? { set: option.set } : {}),
  };
}

function reverseOption(doc: Record<string, unknown>): SmartAnswerOption {
  const next = doc.next as { _ref: string };
  const nextId = stripPrefix(next._ref, NODE_ID_PREFIX);
  if (!nextId) throw new Error(`reverseOption: reference "${next._ref}" is not a node id`);
  return {
    id: doc.id as string,
    label: unbi(doc.label as LocalizedField),
    ...(doc.hint ? { hint: unbi(doc.hint as LocalizedField) } : {}),
    next: nextId,
    ...(doc.when ? { when: reverseCondition(doc.when as MigratedCondition) } : {}),
    ...(doc.set ? { set: doc.set as Record<string, string> } : {}),
  };
}

function transformBlock(block: OutcomeBlock, index: number) {
  const key = arrayKey("blk", String(index));
  if (block.kind === "paragraph") {
    return {
      _key: key,
      _type: "smartAnswerBlockParagraph",
      text: bi(block.text, "text"),
      ...(block.when ? { when: transformCondition(block.when) } : {}),
    };
  }
  if (block.kind === "steps") {
    return {
      _key: key,
      _type: "smartAnswerBlockSteps",
      ...(block.title ? { title: bi(block.title, "string") } : {}),
      items: block.items.map((item, itemIndex) => ({
        _key: arrayKey("item", String(itemIndex)),
        ...bi(item, "text"),
      })),
      ...(block.when ? { when: transformCondition(block.when) } : {}),
    };
  }
  return {
    _key: key,
    _type: "smartAnswerBlockNote",
    tone: block.tone,
    text: bi(block.text, "text"),
    ...(block.when ? { when: transformCondition(block.when) } : {}),
  };
}

function reverseBlock(doc: Record<string, unknown>): OutcomeBlock {
  const when = doc.when ? { when: reverseCondition(doc.when as MigratedCondition) } : {};
  if (doc._type === "smartAnswerBlockParagraph") {
    return { kind: "paragraph", text: unbi(doc.text as LocalizedField), ...when };
  }
  if (doc._type === "smartAnswerBlockSteps") {
    const items = (doc.items as { en: string; th: string }[]).map((item) => ({
      en: item.en,
      th: item.th,
    }));
    return {
      kind: "steps",
      ...(doc.title ? { title: unbi(doc.title as LocalizedField) } : {}),
      items,
      ...when,
    };
  }
  return {
    kind: "note",
    tone: doc.tone as "info" | "warning",
    text: unbi(doc.text as LocalizedField),
    ...when,
  };
}

function transformAction(action: SmartAnswerAction, index: number) {
  return {
    _key: arrayKey("act", String(index)),
    _type: "smartAnswerAction",
    label: bi(action.label, "string"),
    href: action.href,
    ...(action.external ? { external: true } : {}),
    ...(action.when ? { when: transformCondition(action.when) } : {}),
  };
}

function reverseAction(doc: Record<string, unknown>): SmartAnswerAction {
  return {
    label: unbi(doc.label as LocalizedField),
    href: doc.href as string,
    ...(doc.external ? { external: true } : {}),
    ...(doc.when ? { when: reverseCondition(doc.when as MigratedCondition) } : {}),
  };
}

function transformCitation(citation: SmartAnswerCitation, index: number) {
  return {
    _key: arrayKey("cit", String(index)),
    _type: "smartAnswerCitation",
    label: bi(citation.label, "string"),
    href: citation.href,
    ...(citation.when ? { when: transformCondition(citation.when) } : {}),
  };
}

function reverseCitation(doc: Record<string, unknown>): SmartAnswerCitation {
  return {
    label: unbi(doc.label as LocalizedField),
    href: doc.href as string,
    ...(doc.when ? { when: reverseCondition(doc.when as MigratedCondition) } : {}),
  };
}

function transformRelated(related: SmartAnswerRelated, index: number) {
  return {
    _key: arrayKey("rel", String(index)),
    _type: "smartAnswerRelated",
    label: bi(related.label, "string"),
    href: related.href,
    ...(related.description ? { description: bi(related.description, "text") } : {}),
    ...(related.when ? { when: transformCondition(related.when) } : {}),
  };
}

function reverseRelated(doc: Record<string, unknown>): SmartAnswerRelated {
  return {
    label: unbi(doc.label as LocalizedField),
    href: doc.href as string,
    ...(doc.description ? { description: unbi(doc.description as LocalizedField) } : {}),
    ...(doc.when ? { when: reverseCondition(doc.when as MigratedCondition) } : {}),
  };
}

/**
 * One `smartAnswerNode` document per entry in the source's single shared
 * node pool (`SmartAnswerService.nodes`). `kind` discriminates question vs
 * outcome exactly as the source union does; nothing here re-groups nodes
 * into two document types, because the source deliberately keeps one pool
 * (see `content/smart-answers/index.ts`'s own header: "the whole point of
 * the rewrite is that there is one graph").
 */
export function transformNode(node: SmartAnswerNode): MigratedDoc {
  const base = {
    _id: nodeDocId(node.id),
    _type: "smartAnswerNode",
    sourceId: node.id,
    kind: node.kind,
  };

  if (node.kind === "question") {
    return {
      ...base,
      question: bi(node.question, "string"),
      ...(node.hint ? { hint: bi(node.hint, "text") } : {}),
      ...(node.skipWhen
        ? {
            skipWhen: node.skipWhen.map((rule, index) => ({
              _key: arrayKey("skip", String(index)),
              when: transformCondition(rule.when),
              option: rule.option,
            })),
          }
        : {}),
      options: node.options.map(transformOption),
    };
  }

  return {
    ...base,
    title: bi(node.title, "string"),
    summary: bi(node.summary, "text"),
    ...(node.owner ? { owner: bi(node.owner, "text") } : {}),
    ...(node.body ? { body: node.body.map((block, index) => transformBlock(block, index)) } : {}),
    ...(node.actions
      ? { actions: node.actions.map((action, index) => transformAction(action, index)) }
      : {}),
    ...(node.citations
      ? { citations: node.citations.map((citation, index) => transformCitation(citation, index)) }
      : {}),
    ...(node.related
      ? { related: node.related.map((related, index) => transformRelated(related, index)) }
      : {}),
    ...(node.contactCategory ? { contactCategory: node.contactCategory } : {}),
  };
}

export function reverseNode(doc: MigratedDoc): SmartAnswerNode {
  const sourceId = doc.sourceId as string;
  if (doc.kind === "question") {
    const skipWhen = doc.skipWhen as { when: MigratedCondition; option: string }[] | undefined;
    const question: SmartAnswerQuestion = {
      kind: "question",
      id: sourceId,
      question: unbi(doc.question as LocalizedField),
      ...(doc.hint ? { hint: unbi(doc.hint as LocalizedField) } : {}),
      ...(skipWhen
        ? {
            skipWhen: skipWhen.map((rule) => ({
              when: reverseCondition(rule.when),
              option: rule.option,
            })),
          }
        : {}),
      options: (doc.options as Record<string, unknown>[]).map(reverseOption),
    };
    return question;
  }

  const body = doc.body as Record<string, unknown>[] | undefined;
  const actions = doc.actions as Record<string, unknown>[] | undefined;
  const citations = doc.citations as Record<string, unknown>[] | undefined;
  const related = doc.related as Record<string, unknown>[] | undefined;

  const outcome: SmartAnswerOutcome = {
    kind: "outcome",
    id: sourceId,
    title: unbi(doc.title as LocalizedField),
    summary: unbi(doc.summary as LocalizedField),
    ...(doc.owner ? { owner: unbi(doc.owner as LocalizedField) } : {}),
    ...(body ? { body: body.map(reverseBlock) } : {}),
    ...(actions ? { actions: actions.map(reverseAction) } : {}),
    ...(citations ? { citations: citations.map(reverseCitation) } : {}),
    ...(related ? { related: related.map(reverseRelated) } : {}),
    ...(doc.contactCategory ? { contactCategory: doc.contactCategory as string } : {}),
  };
  return outcome;
}

/**
 * One `smartAnswerTopic` document per door into the graph. `start` is a
 * `reference` into the node pool rather than a bare string, for the same
 * reason `option.next` is: Sanity enforces that the target exists as soon
 * as this is imported.
 */
export function transformTopic(topic: SmartAnswerTopic, triageSlug: string): MigratedDoc {
  return {
    _id: topicDocId(topic.slug),
    _type: "smartAnswerTopic",
    slug: topic.slug,
    title: bi(topic.title, "string"),
    lede: bi(topic.lede, "text"),
    group: topic.group,
    start: { _type: "reference", _ref: nodeDocId(topic.start) },
    ...(topic.whatYoullNeed
      ? { whatYoullNeed: topic.whatYoullNeed.map((item) => bi(item, "string")) }
      : {}),
    keywords: topic.keywords,
    ...(topic.spotlightWhen ? { spotlightWhen: transformCondition(topic.spotlightWhen) } : {}),
    ...(topic.hideFromHub ? { hideFromHub: true } : {}),
    // Not a source field: records which topic `TRIAGE_SLUG` in
    // `content/smart-answers/index.ts` names, since that constant is code,
    // not data, and would otherwise have no representation in the artifact.
    // See this file's header and the migration report for the runtime
    // behaviour this cannot fully reconstruct on its own.
    isTriageEntry: topic.slug === triageSlug,
  };
}

export function reverseTopic(doc: MigratedDoc): SmartAnswerTopic {
  const start = doc.start as { _ref: string };
  const startId = stripPrefix(start._ref, NODE_ID_PREFIX);
  if (!startId) throw new Error(`reverseTopic: reference "${start._ref}" is not a node id`);
  const whatYoullNeed = doc.whatYoullNeed as LocalizedField[] | undefined;

  return {
    slug: doc.slug as string,
    title: unbi(doc.title as LocalizedField),
    lede: unbi(doc.lede as LocalizedField),
    group: doc.group as SmartAnswerTopic["group"],
    start: startId,
    ...(whatYoullNeed ? { whatYoullNeed: whatYoullNeed.map(unbi) } : {}),
    keywords: doc.keywords as string[],
    ...(doc.spotlightWhen
      ? { spotlightWhen: reverseCondition(doc.spotlightWhen as MigratedCondition) }
      : {}),
    ...(doc.hideFromHub ? { hideFromHub: true } : {}),
  };
}

/**
 * One `smartAnswerAudienceQuestion` document per dimension of
 * `content/smart-answers/audience.ts`'s `AudienceProfile`. This is the fact
 * vocabulary's own declaration, not a node: it is what `validateService`
 * (`lib/smart-answers.ts`) seeds `settableFacts` with before checking that
 * every condition in the graph only ever references a fact and value that
 * is actually reachable. Migrated so `scripts/verify-trees.mjs` can rebuild
 * that same check from the artifact alone.
 */
export function transformAudienceQuestion(question: AudienceQuestion): MigratedDoc {
  return {
    _id: audienceQuestionDocId(question.dimension),
    _type: "smartAnswerAudienceQuestion",
    dimension: question.dimension,
    question: bi(question.question, "string"),
    ...(question.hint ? { hint: bi(question.hint, "text") } : {}),
    summaryLabel: bi(question.summaryLabel, "string"),
    choices: question.choices.map((choice) => ({
      _key: choice.value,
      value: choice.value,
      label: bi(choice.label, "string"),
      ...(choice.hint ? { hint: bi(choice.hint, "text") } : {}),
    })),
  };
}

export function reverseAudienceQuestion(doc: MigratedDoc): AudienceQuestion {
  const choices = doc.choices as Record<string, unknown>[];
  return {
    dimension: doc.dimension as AudienceQuestion["dimension"],
    question: unbi(doc.question as LocalizedField),
    ...(doc.hint ? { hint: unbi(doc.hint as LocalizedField) } : {}),
    summaryLabel: unbi(doc.summaryLabel as LocalizedField),
    choices: choices.map((choice) => ({
      value: choice.value as string,
      label: unbi(choice.label as LocalizedField),
      ...(choice.hint ? { hint: unbi(choice.hint as LocalizedField) } : {}),
    })),
  };
}

/**
 * Deterministic, sorted assembly of every Smart Answers document: nodes
 * sorted by source id, topics by slug, audience questions in their fixed
 * dimension order. Sorting (rather than emitting in whatever order the
 * source arrays happen to be in) is what makes two runs on an unchanged
 * tree byte-identical (shared brief, "determinism is a requirement").
 */
export function buildSmartAnswerDocuments(
  service: SmartAnswerService,
  audienceQuestions: AudienceQuestion[],
  triageSlug: string
): MigratedDoc[] {
  const nodes = [...service.nodes]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((node) => transformNode(node));
  const topics = [...service.topics]
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((topic) => transformTopic(topic, triageSlug));
  const audience = audienceQuestions.map((question) => transformAudienceQuestion(question));
  return [...topics, ...nodes, ...audience];
}

/**
 * Reverse of `buildSmartAnswerDocuments`: rebuild a `SmartAnswerService`
 * from an artifact, restoring the source arrays' authored order (by node id
 * / topic slug, matching `buildSmartAnswerDocuments`' own sort — the source
 * arrays are not themselves alphabetically ordered, so this cannot recover
 * the ORIGINAL authored order across topic files; see this file's header
 * and the migration report for why identity, not array position, is what
 * this migration guarantees).
 */
export function docsToSmartAnswerService(docs: MigratedDoc[]): SmartAnswerService {
  const nodes = docs
    .filter((doc) => doc._type === "smartAnswerNode")
    .map((doc) => reverseNode(doc))
    .sort((a, b) => a.id.localeCompare(b.id));
  const topics = docs
    .filter((doc) => doc._type === "smartAnswerTopic")
    .map((doc) => reverseTopic(doc))
    .sort((a, b) => a.slug.localeCompare(b.slug));
  return { topics, nodes };
}

export function docsToAudienceQuestions(docs: MigratedDoc[]): AudienceQuestion[] {
  return docs
    .filter((doc) => doc._type === "smartAnswerAudienceQuestion")
    .map((doc) => reverseAudienceQuestion(doc));
}

/* -------------------------------------------------------------------------- */
/* Onboarding tracks: a linear audience -> step -> task hierarchy             */
/* -------------------------------------------------------------------------- */

function transformTask(task: OnboardingTask): Record<string, unknown> {
  return {
    _key: task.id,
    id: task.id,
    label: bi(task.label, "string"),
    ...(task.hint ? { hint: bi(task.hint, "text") } : {}),
    ...(task.href ? { href: task.href } : {}),
    ...(task.external ? { external: true } : {}),
  };
}

function reverseTask(doc: Record<string, unknown>): OnboardingTask {
  return {
    id: doc.id as string,
    label: unbi(doc.label as LocalizedField),
    ...(doc.hint ? { hint: unbi(doc.hint as LocalizedField) } : {}),
    ...(doc.href ? { href: doc.href as string } : {}),
    ...(doc.external ? { external: true } : {}),
  };
}

function transformStep(step: OnboardingStep): Record<string, unknown> {
  return {
    _key: step.id,
    id: step.id,
    title: bi(step.title, "string"),
    ...(step.blurb ? { blurb: bi(step.blurb, "text") } : {}),
    ...(step.connector ? { connector: step.connector } : {}),
    tasks: step.tasks.map(transformTask),
  };
}

function reverseStep(doc: Record<string, unknown>): OnboardingStep {
  return {
    id: doc.id as string,
    title: unbi(doc.title as LocalizedField),
    ...(doc.blurb ? { blurb: unbi(doc.blurb as LocalizedField) } : {}),
    ...(doc.connector ? { connector: doc.connector as "and" | "or" } : {}),
    tasks: (doc.tasks as Record<string, unknown>[]).map(reverseTask),
  };
}

/**
 * One `onboardingTrack` document per audience, embedding its steps and
 * tasks inline rather than splitting them into their own documents. Step
 * and task ids are "unique within its track" by the source type's own
 * comment, not globally, and nothing in `content/onboarding/**` shares a
 * step or a task across tracks the way Smart Answers shares nodes across
 * topics — so there is no shared pool here to normalise out, and embedding
 * is the faithful shape, not a shortcut.
 */
export function transformOnboardingTrack(track: OnboardingTrack): MigratedDoc {
  return {
    _id: onboardingTrackDocId(track.audience),
    _type: "onboardingTrack",
    audience: track.audience,
    title: bi(track.title, "string"),
    lede: bi(track.lede, "text"),
    steps: track.steps.map(transformStep),
  };
}

export function reverseOnboardingTrack(doc: MigratedDoc): OnboardingTrack {
  return {
    audience: doc.audience as OnboardingTrack["audience"],
    title: unbi(doc.title as LocalizedField),
    lede: unbi(doc.lede as LocalizedField),
    steps: (doc.steps as Record<string, unknown>[]).map(reverseStep),
  };
}

export function buildOnboardingDocuments(tracks: OnboardingTrack[]): MigratedDoc[] {
  return [...tracks]
    .sort((a, b) => a.audience.localeCompare(b.audience))
    .map((track) => transformOnboardingTrack(track));
}

export function docsToOnboardingTracks(docs: MigratedDoc[]): OnboardingTrack[] {
  return docs
    .filter((doc) => doc._type === "onboardingTrack")
    .map((doc) => reverseOnboardingTrack(doc))
    .sort((a, b) => a.audience.localeCompare(b.audience));
}

/* -------------------------------------------------------------------------- */
/* Structural deep equality, order-independent on object keys                 */
/* -------------------------------------------------------------------------- */

/**
 * Deep equality that ignores object key ORDER (unlike a naive
 * `JSON.stringify` comparison, which two structurally identical objects can
 * fail purely because one was built with `{ en, th }` and the other with
 * `{ th, en }`) while still treating array ELEMENT order as significant
 * (array order is real content: authored option order, step order, ...).
 * This is what `scripts/verify-trees.mjs` and
 * `tests/unit/migration-trees.test.ts` both use to assert the source tree
 * and the round-tripped tree are the same graph, not merely
 * `JSON.stringify`-coincidentally the same string.
 */
export function deepEqualIgnoringKeyOrder(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (typeof a !== "object") return false;

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqualIgnoringKeyOrder(item, b[index]));
  }

  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const aKeys = Object.keys(aObj).sort();
  const bKeys = Object.keys(bObj).sort();
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key, index) => {
    if (key !== bKeys[index]) return false;
    return deepEqualIgnoringKeyOrder(aObj[key], bObj[key]);
  });
}

/* -------------------------------------------------------------------------- */
/* Locale sanity, reused by verify + tests                                    */
/* -------------------------------------------------------------------------- */

/** Every locale this repo supports, imported for a type-level cross-check
 * only: `Locale` is `"th" | "en"`, and `Bi` is `{ en: string; th: string }`,
 * so a locale this repo added without updating `Bi` would show up as a
 * compile error here rather than a silent gap in the migrated content. */
export type _LocaleCrossCheck = Locale extends "th" | "en" ? true : never;
