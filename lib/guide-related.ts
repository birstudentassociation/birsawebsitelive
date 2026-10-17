/**
 * Resolve a locale-less site path in an information guide's `related` list to
 * the title and summary shown in its "Related guides" box. Returns `null` for
 * a path that is not a guide or a topic page on this site, so the box leaves
 * it out and the content tests can flag it.
 */
import {
  getGuideEntry,
  getInformationGuideEntry,
  isGuideTopic,
  isInformationTopic,
} from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import {
  informationLabel,
  informationLede,
  informationTopicCopy,
} from "@/content/information/topics";
import { studentLifeTopics } from "@/content/student-life/topics";

export type RelatedLink = { href: string; title: string; summary: string };

export function resolveRelatedPath(locale: Locale, href: string): RelatedLink | null {
  const [section, topic, slug, ...rest] = href.split("/").slice(1);
  if (rest.length > 0 || !section) return null;

  if (section === "information") {
    if (!topic) {
      return { href, title: informationLabel[locale], summary: informationLede[locale] };
    }
    if (!isInformationTopic(topic)) return null;
    if (!slug) {
      const copy = informationTopicCopy[locale][topic];
      return { href, title: copy.title, summary: copy.lede };
    }
    const entry = getInformationGuideEntry(locale, topic, slug);
    return entry
      ? { href, title: entry.frontmatter.title, summary: entry.frontmatter.summary }
      : null;
  }

  if (section === "student-life") {
    if (!topic || !isGuideTopic(topic)) return null;
    if (!slug) {
      const copy = studentLifeTopics[locale][topic];
      return { href, title: copy.title, summary: copy.lede };
    }
    const entry = getGuideEntry(locale, topic, slug);
    return entry
      ? { href, title: entry.frontmatter.title, summary: entry.frontmatter.summary }
      : null;
  }

  return null;
}
