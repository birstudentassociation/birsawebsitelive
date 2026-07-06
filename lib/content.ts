/**
 * Build-time filesystem content loaders. Reads MDX files under `content/`,
 * parses frontmatter with gray-matter, and validates it with zod — invalid
 * frontmatter throws a descriptive error so the build fails loudly rather
 * than shipping broken content.
 *
 * Slugs are identical across locales; only the frontmatter/body differ.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import type { Locale } from "@/lib/i18n";

const CONTENT_ROOT = path.join(process.cwd(), "content");

// ---------------------------------------------------------------------------
// Shared date helpers
//
// gray-matter's YAML engine auto-coerces unquoted `YYYY-MM-DD` (and full
// ISO datetime) frontmatter values into JS `Date` objects. We accept either
// shape and normalize back to a canonical string, so callers (e.g.
// `formatDate`) can always rely on getting an ISO string.
// ---------------------------------------------------------------------------

function toDateOnlyString(value: Date): string {
  const y = value.getUTCFullYear();
  const m = String(value.getUTCMonth() + 1).padStart(2, "0");
  const d = String(value.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Frontmatter date field, e.g. `2025-08-20` — normalized to `YYYY-MM-DD`. */
const dateOnly = z
  .union([z.string(), z.date()])
  .transform((v) => (v instanceof Date ? toDateOnlyString(v) : v))
  .pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be an ISO date, e.g. 2025-08-20"));

/** Frontmatter datetime field — normalized to a full ISO string. */
const dateTime = z
  .union([z.string(), z.date()])
  .transform((v) => (v instanceof Date ? v.toISOString() : v))
  .pipe(z.string().min(1));

// ---------------------------------------------------------------------------
// Frontmatter schemas — see docs/PROJECT-BRIEF.md "Content model".
// ---------------------------------------------------------------------------

const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const newsFrontmatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  date: dateOnly,
  type: z.enum(["news", "event"]),
  category: z.string().min(1),
  location: z.string().optional(),
  start: dateTime.optional(),
  end: dateTime.optional(),
  links: z.array(linkSchema).optional(),
  placeholder: z.boolean().optional(),
});

const activityFrontmatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  order: z.number(),
  updated: dateOnly,
  placeholder: z.boolean().optional(),
});

const studentLifeFrontmatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  order: z.number(),
  updated: dateOnly,
  audience: z.enum(["home", "international"]),
  placeholder: z.boolean().optional(),
});

const aboutFrontmatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  order: z.number(),
  updated: dateOnly,
  placeholder: z.boolean().optional(),
});

const frontmatterSchemas = {
  news: newsFrontmatterSchema,
  activity: activityFrontmatterSchema,
  about: aboutFrontmatterSchema,
} as const;

export type NewsFrontmatter = z.infer<typeof newsFrontmatterSchema>;
export type ActivityFrontmatter = z.infer<typeof activityFrontmatterSchema>;
export type StudentLifeFrontmatter = z.infer<typeof studentLifeFrontmatterSchema>;
export type AboutFrontmatter = z.infer<typeof aboutFrontmatterSchema>;

export type Section = "news" | "activity" | "about";

type FrontmatterFor<S extends Section> = S extends "news"
  ? NewsFrontmatter
  : S extends "activity"
    ? ActivityFrontmatter
    : AboutFrontmatter;

export type Entry<F = Record<string, unknown>> = {
  slug: string;
  frontmatter: F;
  /** Raw (unrendered) MDX body — pass to `Mdx({ source })` to render. */
  content: string;
};

// ---------------------------------------------------------------------------
// Filesystem helpers
// ---------------------------------------------------------------------------

/** Simple in-memory cache so repeated calls during a single build stay fast. */
const cache = new Map<string, Entry[]>();

function readMdxDir(dir: string): { slug: string; raw: string; filePath: string }[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(dir, file);
      return {
        slug: file.replace(/\.mdx$/, ""),
        raw: fs.readFileSync(filePath, "utf8"),
        filePath,
      };
    });
}

function parseEntry<T extends z.ZodTypeAny>(
  schema: T,
  slug: string,
  raw: string,
  filePath: string
): Entry<z.infer<T>> {
  const { data, content } = matter(raw);
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid frontmatter in ${path.relative(process.cwd(), filePath)}:\n${issues}`);
  }
  return { slug, frontmatter: result.data, content };
}

function sortEntries<S extends Section>(
  section: S,
  entries: Entry<FrontmatterFor<S>>[]
): Entry<FrontmatterFor<S>>[] {
  if (section === "news") {
    return [...entries].sort((a, b) => {
      const dateA = (a.frontmatter as NewsFrontmatter).date;
      const dateB = (b.frontmatter as NewsFrontmatter).date;
      return dateA < dateB ? 1 : dateA > dateB ? -1 : 0;
    });
  }
  return [...entries].sort((a, b) => {
    const orderA = (a.frontmatter as { order: number }).order;
    const orderB = (b.frontmatter as { order: number }).order;
    return orderA - orderB;
  });
}

/** Returns all entries for a section/locale, sorted (news: date desc; services/about: order asc). */
export function getEntries<S extends Section>(
  section: S,
  locale: Locale
): Entry<FrontmatterFor<S>>[] {
  const cacheKey = `${section}:${locale}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached as Entry<FrontmatterFor<S>>[];

  const dir = path.join(CONTENT_ROOT, section, locale);
  const schema = frontmatterSchemas[section];
  const entries = readMdxDir(dir).map(({ slug, raw, filePath }) =>
    parseEntry(schema, slug, raw, filePath)
  ) as Entry<FrontmatterFor<S>>[];

  const sorted = sortEntries(section, entries);
  cache.set(cacheKey, sorted as Entry[]);
  return sorted;
}

/** Returns a single entry by slug, or `null` if it doesn't exist. */
export function getEntry<S extends Section>(
  section: S,
  locale: Locale,
  slug: string
): Entry<FrontmatterFor<S>> | null {
  return getEntries(section, locale).find((entry) => entry.slug === slug) ?? null;
}

// ---------------------------------------------------------------------------
// Student-life guide (has an extra `audience` sub-directory + field)
// ---------------------------------------------------------------------------

export type GuideAudience = "home" | "international";

/** Returns all student-life guide entries for a locale/audience, sorted by `order` asc. */
export function getGuideEntries(
  locale: Locale,
  audience: GuideAudience
): Entry<StudentLifeFrontmatter>[] {
  const cacheKey = `student-life:${locale}:${audience}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached as Entry<StudentLifeFrontmatter>[];

  const dir = path.join(CONTENT_ROOT, "student-life", locale, audience);
  const entries = readMdxDir(dir).map(({ slug, raw, filePath }) =>
    parseEntry(studentLifeFrontmatterSchema, slug, raw, filePath)
  );

  const sorted = [...entries].sort((a, b) => a.frontmatter.order - b.frontmatter.order);
  cache.set(cacheKey, sorted as Entry[]);
  return sorted;
}

/** Returns a single student-life guide entry by slug, or `null` if it doesn't exist. */
export function getGuideEntry(
  locale: Locale,
  audience: GuideAudience,
  slug: string
): Entry<StudentLifeFrontmatter> | null {
  return getGuideEntries(locale, audience).find((entry) => entry.slug === slug) ?? null;
}
