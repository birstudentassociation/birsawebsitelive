/**
 * Payload-backed content loaders for the editorial pages (news, activity,
 * student-life). Mirrors the API surface of `lib/content.ts`'s MDX loaders
 * (`getEntries`/`getEntry`/`getGuideEntries`/`getGuideEntry`) so the pages
 * that used to read from the filesystem now read from Payload instead —
 * `lib/content.ts` itself is unchanged (other code/tests still depend on it).
 *
 * Sorting mirrors the collections' `defaultSort` / the old MDX loaders:
 * news is sorted by `date` descending; activity and student-life are sorted
 * by `order` ascending. No `placeholder` filtering is applied anywhere —
 * that mirrors current behaviour: the old MDX-era pages never excluded
 * `placeholder: true` entries from listings either (e.g. the activity index
 * page lists the `transparency` entry even though its frontmatter has
 * `placeholder: true`; the flag is only ever used *inside* a page's body to
 * render a `<Notice variant="placeholder">`).
 */
import GithubSlugger from "github-slugger";
import type { SerializedEditorState } from "lexical";
import { getPayloadClient } from "@/lib/payload";
import type { Locale } from "@/lib/i18n";
import type { Activity, News, StudentLife } from "@/payload-types";

export type GuideAudience = "home" | "international";

/** Depth for Payload queries — enough to populate any upload/relationship nodes referenced from richText bodies. */
const RICH_TEXT_DEPTH = 2;

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

export type NewsFrontmatter = {
  title: string;
  summary: string;
  date: string;
  type: "news" | "event";
  category: string;
  location?: string;
  start?: string;
  end?: string;
  links?: { label: string; href: string }[];
  placeholder?: boolean;
};

export type NewsListItem = {
  slug: string;
  frontmatter: NewsFrontmatter;
};

export type NewsItem = NewsListItem & {
  body: SerializedEditorState | null;
};

function toNewsFrontmatter(doc: News): NewsFrontmatter {
  return {
    title: doc.title,
    summary: doc.summary,
    date: doc.date,
    type: doc.type,
    category: doc.category,
    location: doc.location ?? undefined,
    start: doc.start ?? undefined,
    end: doc.end ?? undefined,
    links: doc.links?.map((link) => ({ label: link.label, href: link.href })),
    placeholder: doc.placeholder ?? undefined,
  };
}

/** All news/event entries for a locale, sorted by `date` descending (newest first). */
export async function getNews(locale: Locale): Promise<NewsListItem[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "news",
    locale,
    fallbackLocale: "th",
    sort: "-date",
    pagination: false,
    depth: 0,
  });
  return docs.map((doc) => ({ slug: doc.slug, frontmatter: toNewsFrontmatter(doc) }));
}

/** A single news/event entry by slug, or `null` if it doesn't exist. */
export async function getNewsItem(locale: Locale, slug: string): Promise<NewsItem | null> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "news",
    locale,
    fallbackLocale: "th",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: RICH_TEXT_DEPTH,
  });
  const doc = docs[0];
  if (!doc) return null;
  return { slug: doc.slug, frontmatter: toNewsFrontmatter(doc), body: doc.body ?? null };
}

// ---------------------------------------------------------------------------
// Activity
// ---------------------------------------------------------------------------

export type ActivityFrontmatter = {
  title: string;
  summary: string;
  order: number;
  updated: string;
  placeholder?: boolean;
};

export type ActivityListItem = {
  slug: string;
  frontmatter: ActivityFrontmatter;
};

export type ActivityItem = ActivityListItem & {
  body: SerializedEditorState | null;
};

function toActivityFrontmatter(doc: Activity): ActivityFrontmatter {
  return {
    title: doc.title,
    summary: doc.summary,
    order: doc.order,
    updated: doc.updated,
    placeholder: doc.placeholder ?? undefined,
  };
}

/** All BIRSA-activity pages for a locale, sorted by `order` ascending. */
export async function getActivityPages(locale: Locale): Promise<ActivityListItem[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "activity",
    locale,
    fallbackLocale: "th",
    sort: "order",
    pagination: false,
    depth: 0,
  });
  return docs.map((doc) => ({ slug: doc.slug, frontmatter: toActivityFrontmatter(doc) }));
}

/** A single BIRSA-activity page by slug, or `null` if it doesn't exist. */
export async function getActivityPage(locale: Locale, slug: string): Promise<ActivityItem | null> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "activity",
    locale,
    fallbackLocale: "th",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: RICH_TEXT_DEPTH,
  });
  const doc = docs[0];
  if (!doc) return null;
  return { slug: doc.slug, frontmatter: toActivityFrontmatter(doc), body: doc.body ?? null };
}

// ---------------------------------------------------------------------------
// Student-life guides
// ---------------------------------------------------------------------------

export type StudentLifeFrontmatter = {
  title: string;
  summary: string;
  order: number;
  updated: string;
  audience: GuideAudience;
  placeholder?: boolean;
};

export type GuideListItem = {
  slug: string;
  frontmatter: StudentLifeFrontmatter;
};

export type GuideItem = GuideListItem & {
  body: SerializedEditorState | null;
};

function toStudentLifeFrontmatter(doc: StudentLife): StudentLifeFrontmatter {
  return {
    title: doc.title,
    summary: doc.summary,
    order: doc.order,
    updated: doc.updated,
    audience: doc.audience,
    placeholder: doc.placeholder ?? undefined,
  };
}

/** All student-life guide entries for a locale/audience, sorted by `order` ascending. */
export async function getGuides(locale: Locale, audience: GuideAudience): Promise<GuideListItem[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "student-life",
    locale,
    fallbackLocale: "th",
    where: { audience: { equals: audience } },
    sort: "order",
    pagination: false,
    depth: 0,
  });
  return docs.map((doc) => ({ slug: doc.slug, frontmatter: toStudentLifeFrontmatter(doc) }));
}

/** A single student-life guide entry by slug within an audience, or `null` if it doesn't exist. */
export async function getGuide(
  locale: Locale,
  audience: GuideAudience,
  slug: string
): Promise<GuideItem | null> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "student-life",
    locale,
    fallbackLocale: "th",
    where: { audience: { equals: audience }, slug: { equals: slug } },
    limit: 1,
    depth: RICH_TEXT_DEPTH,
  });
  const doc = docs[0];
  if (!doc) return null;
  return { slug: doc.slug, frontmatter: toStudentLifeFrontmatter(doc), body: doc.body ?? null };
}

// ---------------------------------------------------------------------------
// Table of contents (h2 headings) for a Lexical body
// ---------------------------------------------------------------------------

export type TocItem = { id: string; label: string };

/** Flattens a Lexical node's text content (ignoring formatting). */
function flattenNodeText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { text?: unknown; children?: unknown };
  if (typeof n.text === "string") return n.text;
  if (Array.isArray(n.children)) return n.children.map(flattenNodeText).join("");
  return "";
}

/**
 * Extracts `h2` headings from a Lexical richText body, with ids generated
 * the same way `RichTextRenderer`'s heading converter generates them
 * (github-slugger, in document order) — mirrors the old
 * `extractH2Toc(mdxSource)` in `lib/toc.ts`, which only ever slugged the h2
 * headings it found (not every heading in the document) using its own
 * scoped `GithubSlugger` instance. Used for the student-life guide's
 * "On this page" navigation.
 */
export function getStudentLifeH2Toc(body: SerializedEditorState | null | undefined): TocItem[] {
  if (!body || !body.root) return [];
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];

  function walk(node: unknown): void {
    if (!node || typeof node !== "object") return;
    const n = node as { type?: unknown; tag?: unknown; children?: unknown };
    if (n.type === "heading" && n.tag === "h2") {
      const label = flattenNodeText(n).trim();
      if (label) items.push({ id: slugger.slug(label), label });
    }
    if (Array.isArray(n.children)) {
      for (const child of n.children) walk(child);
    }
  }

  for (const child of body.root.children) walk(child);
  return items;
}
