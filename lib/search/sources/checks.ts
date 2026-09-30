/**
 * Turn the checks (Smart Answers topics) into search documents.
 *
 * A topic's own fields (`title`, `lede`, `keywords`) are a good summary, but
 * they are what the topic is *about*, not everything a reader might type to
 * reach it: a student searching "ผ่อนผัน" or "reimbursement" is quoting a
 * phrase that only appears deep inside one outcome's body, several questions
 * into the flow. `body` here is that flow's text, walked from the topic's
 * start node, so a phrase-level match can still surface the check
 * that resolves it — which beats an article the reader has to interpret
 * themselves, hence the fixed `priority`.
 *
 * Each check is indexed at `topic.path`, the page that hosts it.
 */
import { service } from "@/content/smart-answers";
import type {
  OutcomeBlock,
  SmartAnswerNode,
  SmartAnswerTopic,
} from "@/content/smart-answers/types";
import { localeHref, type Locale } from "@/lib/i18n";
import type { SearchDoc } from "@/lib/search/types";

/** A check resolves a question in a few clicks; weight it accordingly. */
const CHECK_PRIORITY = 0.85;

/** Safety cap on graph traversal, in case authored content ever cycles. */
const MAX_TRAVERSED_NODES = 200;

function outcomeBlockText(block: OutcomeBlock, locale: Locale): string[] {
  switch (block.kind) {
    case "paragraph":
    case "note":
      return [block.text[locale]];
    case "steps":
      return [block.title?.[locale], ...block.items.map((item) => item[locale])].filter(
        (text): text is string => Boolean(text)
      );
  }
}

/**
 * Walk every node reachable from `startId` (questions through their options,
 * outcomes as leaves) and concatenate its reader-facing text for one locale.
 * The node pool is shared across topics and can be revisited from different
 * branches, so a visited set keeps each node's text out of the body once.
 */
function collectBody(nodes: Map<string, SmartAnswerNode>, startId: string, locale: Locale): string {
  const visited = new Set<string>();
  const queue: string[] = [startId];
  const parts: string[] = [];

  while (queue.length > 0 && visited.size < MAX_TRAVERSED_NODES) {
    const id = queue.shift();
    if (id === undefined || visited.has(id)) continue;
    visited.add(id);

    const node = nodes.get(id);
    if (!node) continue;

    if (node.kind === "question") {
      parts.push(node.question[locale]);
      if (node.hint) parts.push(node.hint[locale]);
      for (const option of node.options) {
        parts.push(option.label[locale]);
        if (option.hint) parts.push(option.hint[locale]);
        queue.push(option.next);
      }
      continue;
    }

    parts.push(node.title[locale], node.summary[locale]);
    for (const block of node.body ?? []) {
      parts.push(...outcomeBlockText(block, locale));
    }
  }

  return parts.join(" ");
}

function checkDoc(
  locale: Locale,
  nodes: Map<string, SmartAnswerNode>,
  topic: SmartAnswerTopic
): SearchDoc {
  return {
    id: `check:${topic.slug}`,
    locale,
    section: "checks",
    kind: "check",
    href: localeHref(locale, topic.path),
    title: topic.title[locale],
    summary: topic.lede[locale],
    // `topic.keywords` are authored bilingual search terms, not per-locale.
    keywords: topic.keywords,
    body: collectBody(nodes, topic.start, locale),
    priority: CHECK_PRIORITY,
  };
}

/** Build one search document per check, for one locale. */
export function checkDocs(locale: Locale): SearchDoc[] {
  const nodes = new Map(service.nodes.map((node) => [node.id, node]));
  return service.topics.map((topic) => checkDoc(locale, nodes, topic));
}
