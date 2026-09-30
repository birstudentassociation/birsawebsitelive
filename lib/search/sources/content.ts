/**
 * Turn the site's MDX content (news, BIRSA activity, student-life guides,
 * clubs) into search documents.
 *
 * These four sections share one shape: a filesystem entry with typed
 * frontmatter and an MDX body, loaded through `@/lib/content`. Building their
 * `SearchDoc`s here, in one place, keeps that mapping (which frontmatter
 * field becomes the date, which becomes the badge) out of the loaders
 * themselves, which know nothing about search.
 *
 * A placeholder entry (`frontmatter.placeholder: true`) is an unwritten stub
 * kept in the repo so the page route exists; it must never surface as a
 * search result before it has real content.
 */
import {
  getClubEntries,
  getEntries,
  getAllGuideEntries,
  type ActivityFrontmatter,
  type ClubFrontmatter,
  type Entry,
  type GuideTopic,
  type NewsFrontmatter,
  type StudentLifeFrontmatter,
} from "@/lib/content";
import { localeHref, type Locale } from "@/lib/i18n";
import { extractH2Sections } from "@/lib/toc";
import { studentLifeTopics } from "@/content/student-life/topics";
import { mdxHeadings, mdxToText } from "@/lib/search/mdx-text";
import type { SearchDoc } from "@/lib/search/types";

/**
 * Slugs are English kebab-case on every locale (see `lib/content.ts`), so
 * splitting one into words gives the Thai index a bit of English recall it
 * would not otherwise have: a Thai reader typing "งาน" won't type
 * "orientation-week", but one typing "orientation week" should still find it.
 */
function slugKeyword(slug: string): string {
  return slug.replace(/-/g, " ");
}

function keywordsOf(parts: (string | undefined)[]): string[] {
  return parts.filter((part): part is string => Boolean(part));
}

function newsDoc(locale: Locale, entry: Entry<NewsFrontmatter>): SearchDoc {
  const { frontmatter, slug, content } = entry;
  return {
    id: `news:${slug}`,
    locale,
    section: "news",
    kind: "guide",
    href: localeHref(locale, `/news/${slug}`),
    title: frontmatter.title,
    summary: frontmatter.summary,
    keywords: keywordsOf([
      frontmatter.category,
      frontmatter.location,
      ...mdxHeadings(content),
      slugKeyword(slug),
    ]),
    body: mdxToText(content),
    // An event's own date is the moment it happens, not the moment it was
    // written about, so prefer `start` when the entry has one.
    date: frontmatter.start ?? frontmatter.date,
    upcoming: frontmatter.type === "event",
    badge: frontmatter.category,
  };
}

function activityDoc(locale: Locale, entry: Entry<ActivityFrontmatter>): SearchDoc {
  const { frontmatter, slug, content } = entry;
  return {
    id: `activity:${slug}`,
    locale,
    section: "activity",
    kind: "guide",
    href: localeHref(locale, `/activity/${slug}`),
    title: frontmatter.title,
    summary: frontmatter.summary,
    keywords: keywordsOf([...mdxHeadings(content), slugKeyword(slug)]),
    body: mdxToText(content),
    date: frontmatter.updated,
  };
}

function guideDocs(
  locale: Locale,
  topic: GuideTopic,
  entry: Entry<StudentLifeFrontmatter>
): SearchDoc[] {
  const { frontmatter, slug, content } = entry;
  const badge = studentLifeTopics[locale][topic].title;
  const path = `/student-life/${topic}/${slug}`;
  const guide: SearchDoc = {
    id: `student-life:${topic}:${slug}`,
    locale,
    section: "student-life",
    kind: "guide",
    href: localeHref(locale, path),
    title: frontmatter.title,
    summary: frontmatter.summary,
    keywords: keywordsOf([
      ...frontmatter.keyQuestions,
      ...frontmatter.quickAnswers.flatMap((item) => [item.q, item.a]),
      ...frontmatter.aliases,
      ...mdxHeadings(content),
      slugKeyword(slug),
    ]),
    body: mdxToText(content),
    date: frontmatter.reviewed,
    badge,
  };

  // One result per H2, opening the guide at that heading, so a query such as
  // "Rangsit" or "90 day" lands on the right part of a long page.
  const sections: SearchDoc[] = extractH2Sections(content).map((section) => ({
    id: `student-life:${topic}:${slug}#${section.id}`,
    locale,
    section: "student-life",
    kind: "guide",
    href: `${localeHref(locale, path)}#${section.id}`,
    title: `${section.label} (${frontmatter.title})`,
    summary: frontmatter.title,
    keywords: keywordsOf([section.label]),
    body: mdxToText(section.body),
    date: frontmatter.reviewed,
    badge,
  }));

  return [guide, ...sections];
}

function clubDoc(locale: Locale, entry: Entry<ClubFrontmatter>): SearchDoc {
  const { frontmatter, slug, content } = entry;
  return {
    id: `clubs:${slug}`,
    locale,
    section: "clubs",
    kind: "guide",
    href: localeHref(locale, `/clubs/${slug}`),
    title: frontmatter.title,
    summary: frontmatter.tagline,
    keywords: keywordsOf([
      frontmatter.category,
      frontmatter.meets,
      frontmatter.where,
      ...mdxHeadings(content),
      slugKeyword(slug),
    ]),
    body: mdxToText(content),
    date: frontmatter.updated,
    badge: frontmatter.category,
  };
}

/** Build search documents for every non-placeholder MDX entry, for one locale. */
export function contentDocs(locale: Locale): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const entry of getEntries("news", locale)) {
    if (entry.frontmatter.placeholder) continue;
    docs.push(newsDoc(locale, entry));
  }

  for (const entry of getEntries("activity", locale)) {
    if (entry.frontmatter.placeholder) continue;
    docs.push(activityDoc(locale, entry));
  }

  for (const { topic, ...entry } of getAllGuideEntries(locale)) {
    if (entry.frontmatter.placeholder) continue;
    docs.push(...guideDocs(locale, topic, entry));
  }

  for (const entry of getClubEntries(locale)) {
    if (entry.frontmatter.placeholder) continue;
    docs.push(clubDoc(locale, entry));
  }

  return docs;
}
