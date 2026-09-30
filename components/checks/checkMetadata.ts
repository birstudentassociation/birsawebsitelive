import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { resolveTopic, toAnswerIds } from "@/lib/smart-answers";
import { service } from "@/content/smart-answers";
import type { SmartAnswerTopic } from "@/content/smart-answers/types";

/**
 * Metadata for one state of a check. The bare page is indexable under the
 * topic title. Any state carrying `?a=` is mid-journey rather than a
 * destination, so it names its step but is kept out of the index.
 */
export function checkMetadata(
  locale: Locale,
  topic: SmartAnswerTopic,
  a: string | string[] | undefined
): Metadata {
  const answerIds = toAnswerIds(a);
  const base = (title: string) =>
    buildMetadata({ locale, title, description: topic.lede[locale], path: topic.path });

  if (answerIds.length === 0) return base(topic.title[locale]);

  const { node } = resolveTopic(service, topic, answerIds);
  const stepTitle = node.kind === "question" ? node.question[locale] : node.title[locale];
  return {
    ...base(`${stepTitle}: ${topic.title[locale]}`),
    robots: { index: false, follow: true },
  };
}
