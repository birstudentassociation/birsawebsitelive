/**
 * One-off (but safely re-runnable) migration that imports the site's
 * filesystem MDX content (`content/news`, `content/activity`,
 * `content/student-life`) into the equivalent Payload CMS collections
 * (`news`, `activity`, `student-life`).
 *
 * Run with `npm run migrate:content` (= `payload run
 * scripts/migrate-content-to-payload.ts --use-swc`). `payload run` simply
 * dynamically imports this file, so it is responsible for obtaining its own
 * Payload instance and for exiting the process cleanly when done.
 *
 * Frontmatter shapes mirror `lib/content.ts` (zod schemas + gray-matter date
 * coercion) — see that file for the canonical definitions this reimplements.
 * Slugs are identical across locales; only the `th`/`en` frontmatter + body
 * differ. `content/student-life` additionally splits by `audience`
 * (home | international) sub-directory.
 *
 * Idempotency: for each slug (student-life: each (audience, slug) pair) we
 * look up an existing document by `slug` (and `audience`) and UPDATE it if
 * found, otherwise CREATE it — so re-running never duplicates documents.
 * Both locales are written onto the same document via two `locale`-scoped
 * writes (`th` then `en`); the first write of the pair also carries the
 * non-localized fields, the second carries only its own localized fields.
 */
import fs from "node:fs";
import path from "node:path";

import { randomBytes } from "node:crypto";

import matter from "gray-matter";
import { JSDOM } from "jsdom";
import { z } from "zod";
import { getPayload, type Payload } from "payload";
import config from "@payload-config";
import { convertMarkdownToLexical, editorConfigFactory } from "@payloadcms/richtext-lexical";
import type { SanitizedServerEditorConfig } from "@payloadcms/richtext-lexical";

const CONTENT_ROOT = path.join(process.cwd(), "content");

type LocaleCode = "th" | "en";

// ---------------------------------------------------------------------------
// Shared date helpers (mirrors lib/content.ts) — gray-matter's YAML engine
// auto-coerces unquoted `YYYY-MM-DD` (and full ISO datetime) frontmatter
// values into JS `Date` objects. Accept either shape, normalize to a
// canonical string.
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
// Frontmatter schemas (mirrors lib/content.ts)
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

type NewsFrontmatter = z.infer<typeof newsFrontmatterSchema>;
type ActivityFrontmatter = z.infer<typeof activityFrontmatterSchema>;
type StudentLifeFrontmatter = z.infer<typeof studentLifeFrontmatterSchema>;

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

type CollectionSummary = {
  created: number;
  updated: number;
  skipped: number;
  warnings: string[];
};

function emptySummary(): CollectionSummary {
  return { created: 0, updated: 0, skipped: 0, warnings: [] };
}

/** Shape of the `body` richText field as generated in payload-types.ts — identical across News/Activity/StudentLife. */
type LexicalBody = {
  root: {
    type: string;
    children: { type: unknown; version: number; [k: string]: unknown }[];
    direction: "ltr" | "rtl" | null;
    format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
    indent: number;
    version: number;
  };
  [k: string]: unknown;
};

/** Lists `<dir>/*.mdx` files as a Map of slug -> absolute file path (parsing deferred to the caller so failures stay per-file). */
function listMdxSlugs(dir: string): Map<string, string> {
  const map = new Map<string, string>();
  if (!fs.existsSync(dir)) return map;
  for (const file of fs.readdirSync(dir)) {
    if (file.endsWith(".mdx")) {
      map.set(file.replace(/\.mdx$/, ""), path.join(dir, file));
    }
  }
  return map;
}

/** Parses one MDX file against a frontmatter schema. Never throws — returns null and records a warning on any failure. */
function tryParseFile<T extends z.ZodTypeAny>(
  filePath: string | undefined,
  schema: T,
  label: string,
  warnings: string[]
): { frontmatter: z.infer<T>; markdown: string } | null {
  if (!filePath) return null;
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const result = schema.safeParse(data);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
        .join("; ");
      warnings.push(`[${label}] invalid frontmatter, skipping this locale's file: ${issues}`);
      return null;
    }
    return { frontmatter: result.data, markdown: content };
  } catch (err) {
    warnings.push(
      `[${label}] failed to read/parse file: ${err instanceof Error ? err.message : String(err)}`
    );
    return null;
  }
}

// Heuristic detection of MDX/JSX that plain markdown->lexical conversion
// cannot represent (custom components like <Notice>/<Email>, or JSX-only
// attributes like `className`). We still attempt conversion — this is purely
// to surface a warning so an editor can review the result manually.
const JSX_COMPONENT_RE = /<[A-Z][A-Za-z0-9]*(?:\s[^>]*)?\/?>/;
const JSX_ATTR_RE = /\b(?:className|onClick)=/;

function looksLikeJsx(markdown: string): boolean {
  return JSX_COMPONENT_RE.test(markdown) || JSX_ATTR_RE.test(markdown);
}

function plainTextFallback(text: string): LexicalBody {
  return {
    root: {
      type: "root",
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
      children: [
        {
          type: "paragraph",
          direction: "ltr",
          format: "",
          indent: 0,
          version: 1,
          children: [
            {
              type: "text",
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text,
              version: 1,
            },
          ],
        },
      ],
    },
  };
}

/** A single Lexical node (block-level or inline) in loose, migration-friendly form. */
type LexicalNode = { type: string; version: number; [k: string]: unknown };

/** Generates a Mongo-ObjectId-style 24-hex-char id for block / inline-block field rows. */
function newBlockId(): string {
  return randomBytes(12).toString("hex");
}

/** Parses an HTML/JSX attribute string (`a="b" c="d"`) into a plain record. */
function parseAttrs(attrStr: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /([A-Za-z][\w-]*)\s*=\s*"([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(attrStr)) !== null) {
    if (m[1]) attrs[m[1]] = m[2] ?? "";
  }
  return attrs;
}

/** Builds a Lexical `notice` block node from a parsed <Notice> tag. */
function makeNoticeBlock(attrStr: string, inner: string): LexicalNode {
  const attrs = parseAttrs(attrStr);
  return {
    type: "block",
    format: "",
    version: 2,
    fields: {
      id: newBlockId(),
      blockName: "",
      blockType: "notice",
      variant: attrs.variant ?? "placeholder",
      title: attrs.title ?? null,
      content: inner.trim(),
    },
  };
}

/** Builds a Lexical `email` inline-block node from parsed <Email> attributes. */
function makeEmailInline(attrs: Record<string, string>): LexicalNode {
  return {
    type: "inlineBlock",
    version: 1,
    fields: {
      id: newBlockId(),
      blockType: "email",
      address: attrs.address ?? "",
      label: attrs.label ?? null,
      subject: attrs.subject ?? null,
    },
  };
}

/** Recursively replaces `@@EMAILn@@` placeholder tokens in text nodes with email inline-block nodes. */
function injectInlineEmails(node: unknown, emails: LexicalNode[]): void {
  if (!node || typeof node !== "object") return;
  const n = node as { children?: unknown };
  if (!Array.isArray(n.children)) return;
  const out: unknown[] = [];
  for (const child of n.children) {
    const c = child as { type?: string; text?: string };
    if (c && c.type === "text" && typeof c.text === "string" && c.text.includes("@@EMAIL")) {
      for (const part of c.text.split(/(@@EMAIL\d+@@)/g)) {
        const m = /^@@EMAIL(\d+)@@$/.exec(part);
        if (m) {
          const email = emails[Number(m[1])];
          if (email) out.push(email);
        } else if (part.length > 0) {
          out.push({ ...c, text: part });
        }
      }
    } else {
      injectInlineEmails(child, emails);
      out.push(child);
    }
  }
  n.children = out;
}

/** Converts a plain-markdown chunk to Lexical root children, turning inline <Email> into inline-block nodes. */
function markdownChunkToChildren(
  markdown: string,
  editorConfig: SanitizedServerEditorConfig
): LexicalNode[] {
  const emails: LexicalNode[] = [];
  const withTokens = markdown.replace(/<Email\b([^>]*?)\/?>/g, (_full, attrStr: string) => {
    const idx = emails.length;
    emails.push(makeEmailInline(parseAttrs(attrStr)));
    return `@@EMAIL${idx}@@`;
  });
  const state = convertMarkdownToLexical({
    editorConfig,
    markdown: withTokens,
  }) as unknown as LexicalBody;
  if (emails.length > 0) injectInlineEmails(state.root, emails);
  return (state.root.children ?? []) as unknown as LexicalNode[];
}

// Lexical node builders for tables (matching @lexical/table's serialized
// shape + the EXPERIMENTAL_TableFeature). Built by hand from the source HTML
// so header cells keep the right `headerState` (ROW = 1, COLUMN = 2), which
// RichTextRenderer maps to `scope="row"`/`scope="col"`.
function textNode(text: string): LexicalNode {
  return { type: "text", version: 1, text, detail: 0, format: 0, mode: "normal", style: "" };
}
function paragraphNode(text: string): LexicalNode {
  return {
    type: "paragraph",
    version: 1,
    direction: "ltr",
    format: "",
    indent: 0,
    textFormat: 0,
    children: text ? [textNode(text)] : [],
  };
}
function tableCellNode(text: string, headerState: number): LexicalNode {
  return {
    type: "tablecell",
    version: 1,
    direction: "ltr",
    format: "",
    indent: 0,
    headerState,
    colSpan: 1,
    rowSpan: 1,
    backgroundColor: null,
    children: [paragraphNode(text)],
  };
}
function tableRowNode(cells: LexicalNode[]): LexicalNode {
  return { type: "tablerow", version: 1, direction: "ltr", format: "", indent: 0, children: cells };
}

/** Converts a raw HTML <table> to a single Lexical table node (best-effort). */
function htmlTableToChildren(html: string, editorConfig: SanitizedServerEditorConfig): LexicalNode[] {
  const tableEl = new JSDOM(html).window.document.querySelector("table");
  if (!tableEl) return markdownChunkToChildren(html, editorConfig);
  const rows: LexicalNode[] = [];
  for (const tr of Array.from(tableEl.querySelectorAll("tr"))) {
    const cells: LexicalNode[] = [];
    for (const cell of Array.from(tr.querySelectorAll("th,td"))) {
      const isTh = cell.tagName.toLowerCase() === "th";
      // TableCellHeaderStates: ROW = 1, COLUMN = 2. A <th scope="row"> is a row
      // header; any other <th> defaults to a column header.
      const headerState = isTh ? (cell.getAttribute("scope") === "row" ? 1 : 2) : 0;
      cells.push(tableCellNode((cell.textContent ?? "").trim(), headerState));
    }
    if (cells.length > 0) rows.push(tableRowNode(cells));
  }
  if (rows.length === 0) return markdownChunkToChildren(html, editorConfig);
  return [{ type: "table", version: 1, direction: "ltr", format: "", indent: 0, children: rows }];
}

// Matches a block-level <Notice ...>...</Notice> OR a raw <table>...</table>.
const BLOCK_SEGMENT_RE = /<Notice\b([^>]*)>([\s\S]*?)<\/Notice>|<table\b[\s\S]*?<\/table>/g;

/**
 * Converts one markdown body to a Lexical richText value, handling the site's
 * bespoke MDX components: block-level <Notice> and raw <table> become dedicated
 * Lexical nodes, inline <Email> becomes an inline block, and everything between
 * is converted as ordinary markdown. Never throws — warns and falls back to a
 * plain-text paragraph on unexpected failures.
 */
function markdownToLexicalBody(
  markdown: string,
  editorConfig: SanitizedServerEditorConfig,
  label: string,
  warnings: string[]
): LexicalBody {
  try {
    const children: LexicalNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    BLOCK_SEGMENT_RE.lastIndex = 0;
    while ((match = BLOCK_SEGMENT_RE.exec(markdown)) !== null) {
      const before = markdown.slice(lastIndex, match.index);
      if (before.trim().length > 0) {
        children.push(...markdownChunkToChildren(before, editorConfig));
      }
      if (match[0].startsWith("<Notice")) {
        children.push(makeNoticeBlock(match[1] ?? "", match[2] ?? ""));
      } else {
        children.push(...htmlTableToChildren(match[0], editorConfig));
      }
      lastIndex = match.index + match[0].length;
    }
    const rest = markdown.slice(lastIndex);
    if (rest.trim().length > 0) {
      children.push(...markdownChunkToChildren(rest, editorConfig));
    }

    // Warn only if an UNHANDLED custom component / JSX attribute survives after
    // stripping the ones we now support (Notice, table, Email).
    const residual = markdown.replace(BLOCK_SEGMENT_RE, "").replace(/<Email\b[^>]*?\/?>/g, "");
    if (looksLikeJsx(residual)) {
      warnings.push(
        `[${label}] body still contains unhandled MDX/JSX after block extraction — review the converted body in the admin UI.`
      );
    }

    if (children.length === 0) return plainTextFallback(markdown.trim());
    return {
      root: {
        type: "root",
        direction: "ltr",
        format: "",
        indent: 0,
        version: 1,
        children: children as unknown as LexicalBody["root"]["children"],
      },
    };
  } catch (err) {
    warnings.push(
      `[${label}] markdown->lexical conversion failed (${err instanceof Error ? err.message : String(err)}); imported as a single plain-text paragraph instead.`
    );
    return plainTextFallback(markdown);
  }
}

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

async function migrateNewsEntry(
  payload: Payload,
  editorConfig: SanitizedServerEditorConfig,
  slug: string,
  thPath: string | undefined,
  enPath: string | undefined,
  summary: CollectionSummary
): Promise<void> {
  const th = tryParseFile(thPath, newsFrontmatterSchema, `news/th/${slug}`, summary.warnings);
  const en = tryParseFile(enPath, newsFrontmatterSchema, `news/en/${slug}`, summary.warnings);

  if (!th && !en) {
    summary.warnings.push(`[news/${slug}] no valid content in either locale — skipped`);
    summary.skipped++;
    return;
  }
  if (!th) {
    summary.warnings.push(`[news/${slug}] missing or invalid th file — importing en only`);
  }
  if (!en) {
    summary.warnings.push(`[news/${slug}] missing or invalid en file — importing th only`);
  }

  if (th && en) {
    const mismatches: string[] = [];
    if (th.frontmatter.date !== en.frontmatter.date) {
      mismatches.push(`date (th=${th.frontmatter.date}, en=${en.frontmatter.date})`);
    }
    if (th.frontmatter.type !== en.frontmatter.type) {
      mismatches.push(`type (th=${th.frontmatter.type}, en=${en.frontmatter.type})`);
    }
    if ((th.frontmatter.start ?? null) !== (en.frontmatter.start ?? null)) {
      mismatches.push(`start (th=${th.frontmatter.start ?? "none"}, en=${en.frontmatter.start ?? "none"})`);
    }
    if ((th.frontmatter.end ?? null) !== (en.frontmatter.end ?? null)) {
      mismatches.push(`end (th=${th.frontmatter.end ?? "none"}, en=${en.frontmatter.end ?? "none"})`);
    }
    if ((th.frontmatter.placeholder ?? false) !== (en.frontmatter.placeholder ?? false)) {
      mismatches.push(
        `placeholder (th=${th.frontmatter.placeholder ?? false}, en=${en.frontmatter.placeholder ?? false})`
      );
    }
    if (mismatches.length > 0) {
      summary.warnings.push(
        `[news/${slug}] th/en non-localized field mismatch, keeping th values: ${mismatches.join(", ")}`
      );
    }
  }

  const primaryFm: NewsFrontmatter = (th ?? en)!.frontmatter;
  const nonLocalized = {
    slug,
    date: primaryFm.date,
    type: primaryFm.type,
    start: primaryFm.start,
    end: primaryFm.end,
    placeholder: primaryFm.placeholder ?? false,
  };

  const existing = await payload.find({
    collection: "news",
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  });
  const existingDoc = existing.docs[0];
  let id = existingDoc?.id;

  const writes: { locale: LocaleCode; data: NonNullable<typeof th> }[] = [];
  if (th) writes.push({ locale: "th", data: th });
  if (en) writes.push({ locale: "en", data: en });

  for (const [index, write] of writes.entries()) {
    const body = markdownToLexicalBody(
      write.data.markdown,
      editorConfig,
      `news/${write.locale}/${slug}`,
      summary.warnings
    );
    const localizedData = {
      title: write.data.frontmatter.title,
      summary: write.data.frontmatter.summary,
      category: write.data.frontmatter.category,
      location: write.data.frontmatter.location,
      links: write.data.frontmatter.links,
      body,
    };
    const dataToWrite = index === 0 ? { ...nonLocalized, ...localizedData } : localizedData;

    if (!id) {
      const created = await payload.create({
        collection: "news",
        locale: write.locale,
        overrideAccess: true,
        data: { ...nonLocalized, ...localizedData },
      });
      id = created.id;
    } else {
      await payload.update({
        collection: "news",
        id,
        locale: write.locale,
        overrideAccess: true,
        data: dataToWrite,
      });
    }
  }

  if (existingDoc) {
    summary.updated++;
  } else {
    summary.created++;
  }
}

async function migrateNews(
  payload: Payload,
  editorConfig: SanitizedServerEditorConfig,
  summary: CollectionSummary
): Promise<void> {
  const thSlugs = listMdxSlugs(path.join(CONTENT_ROOT, "news", "th"));
  const enSlugs = listMdxSlugs(path.join(CONTENT_ROOT, "news", "en"));
  const slugs = new Set([...thSlugs.keys(), ...enSlugs.keys()]);

  for (const slug of slugs) {
    try {
      await migrateNewsEntry(payload, editorConfig, slug, thSlugs.get(slug), enSlugs.get(slug), summary);
    } catch (err) {
      summary.warnings.push(
        `[news/${slug}] unexpected error, skipped: ${err instanceof Error ? err.message : String(err)}`
      );
      summary.skipped++;
    }
  }
}

// ---------------------------------------------------------------------------
// Activity
// ---------------------------------------------------------------------------

async function migrateActivityEntry(
  payload: Payload,
  editorConfig: SanitizedServerEditorConfig,
  slug: string,
  thPath: string | undefined,
  enPath: string | undefined,
  summary: CollectionSummary
): Promise<void> {
  const th = tryParseFile(thPath, activityFrontmatterSchema, `activity/th/${slug}`, summary.warnings);
  const en = tryParseFile(enPath, activityFrontmatterSchema, `activity/en/${slug}`, summary.warnings);

  if (!th && !en) {
    summary.warnings.push(`[activity/${slug}] no valid content in either locale — skipped`);
    summary.skipped++;
    return;
  }
  if (!th) {
    summary.warnings.push(`[activity/${slug}] missing or invalid th file — importing en only`);
  }
  if (!en) {
    summary.warnings.push(`[activity/${slug}] missing or invalid en file — importing th only`);
  }

  if (th && en) {
    const mismatches: string[] = [];
    if (th.frontmatter.order !== en.frontmatter.order) {
      mismatches.push(`order (th=${th.frontmatter.order}, en=${en.frontmatter.order})`);
    }
    if (th.frontmatter.updated !== en.frontmatter.updated) {
      mismatches.push(`updated (th=${th.frontmatter.updated}, en=${en.frontmatter.updated})`);
    }
    if ((th.frontmatter.placeholder ?? false) !== (en.frontmatter.placeholder ?? false)) {
      mismatches.push(
        `placeholder (th=${th.frontmatter.placeholder ?? false}, en=${en.frontmatter.placeholder ?? false})`
      );
    }
    if (mismatches.length > 0) {
      summary.warnings.push(
        `[activity/${slug}] th/en non-localized field mismatch, keeping th values: ${mismatches.join(", ")}`
      );
    }
  }

  const primaryFm: ActivityFrontmatter = (th ?? en)!.frontmatter;
  const nonLocalized = {
    slug,
    order: primaryFm.order,
    updated: primaryFm.updated,
    placeholder: primaryFm.placeholder ?? false,
  };

  const existing = await payload.find({
    collection: "activity",
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  });
  const existingDoc = existing.docs[0];
  let id = existingDoc?.id;

  const writes: { locale: LocaleCode; data: NonNullable<typeof th> }[] = [];
  if (th) writes.push({ locale: "th", data: th });
  if (en) writes.push({ locale: "en", data: en });

  for (const [index, write] of writes.entries()) {
    const body = markdownToLexicalBody(
      write.data.markdown,
      editorConfig,
      `activity/${write.locale}/${slug}`,
      summary.warnings
    );
    const localizedData = {
      title: write.data.frontmatter.title,
      summary: write.data.frontmatter.summary,
      body,
    };
    const dataToWrite = index === 0 ? { ...nonLocalized, ...localizedData } : localizedData;

    if (!id) {
      const created = await payload.create({
        collection: "activity",
        locale: write.locale,
        overrideAccess: true,
        data: { ...nonLocalized, ...localizedData },
      });
      id = created.id;
    } else {
      await payload.update({
        collection: "activity",
        id,
        locale: write.locale,
        overrideAccess: true,
        data: dataToWrite,
      });
    }
  }

  if (existingDoc) {
    summary.updated++;
  } else {
    summary.created++;
  }
}

async function migrateActivity(
  payload: Payload,
  editorConfig: SanitizedServerEditorConfig,
  summary: CollectionSummary
): Promise<void> {
  const thSlugs = listMdxSlugs(path.join(CONTENT_ROOT, "activity", "th"));
  const enSlugs = listMdxSlugs(path.join(CONTENT_ROOT, "activity", "en"));
  const slugs = new Set([...thSlugs.keys(), ...enSlugs.keys()]);

  for (const slug of slugs) {
    try {
      await migrateActivityEntry(payload, editorConfig, slug, thSlugs.get(slug), enSlugs.get(slug), summary);
    } catch (err) {
      summary.warnings.push(
        `[activity/${slug}] unexpected error, skipped: ${err instanceof Error ? err.message : String(err)}`
      );
      summary.skipped++;
    }
  }
}

// ---------------------------------------------------------------------------
// Student-life (has an extra `audience` sub-directory + field; uniqueness is
// the compound (audience, slug) pair rather than a global unique slug).
// ---------------------------------------------------------------------------

type GuideAudience = "home" | "international";

async function migrateStudentLifeEntry(
  payload: Payload,
  editorConfig: SanitizedServerEditorConfig,
  audience: GuideAudience,
  slug: string,
  thPath: string | undefined,
  enPath: string | undefined,
  summary: CollectionSummary
): Promise<void> {
  const label = `student-life/${audience}/${slug}`;
  const th = tryParseFile(thPath, studentLifeFrontmatterSchema, `${label} (th)`, summary.warnings);
  const en = tryParseFile(enPath, studentLifeFrontmatterSchema, `${label} (en)`, summary.warnings);

  if (!th && !en) {
    summary.warnings.push(`[${label}] no valid content in either locale — skipped`);
    summary.skipped++;
    return;
  }
  if (!th) {
    summary.warnings.push(`[${label}] missing or invalid th file — importing en only`);
  }
  if (!en) {
    summary.warnings.push(`[${label}] missing or invalid en file — importing th only`);
  }

  if (th && th.frontmatter.audience !== audience) {
    summary.warnings.push(
      `[${label}] th frontmatter audience "${th.frontmatter.audience}" does not match its "${audience}" directory — using the directory value`
    );
  }
  if (en && en.frontmatter.audience !== audience) {
    summary.warnings.push(
      `[${label}] en frontmatter audience "${en.frontmatter.audience}" does not match its "${audience}" directory — using the directory value`
    );
  }

  if (th && en) {
    const mismatches: string[] = [];
    if (th.frontmatter.order !== en.frontmatter.order) {
      mismatches.push(`order (th=${th.frontmatter.order}, en=${en.frontmatter.order})`);
    }
    if (th.frontmatter.updated !== en.frontmatter.updated) {
      mismatches.push(`updated (th=${th.frontmatter.updated}, en=${en.frontmatter.updated})`);
    }
    if ((th.frontmatter.placeholder ?? false) !== (en.frontmatter.placeholder ?? false)) {
      mismatches.push(
        `placeholder (th=${th.frontmatter.placeholder ?? false}, en=${en.frontmatter.placeholder ?? false})`
      );
    }
    if (mismatches.length > 0) {
      summary.warnings.push(`[${label}] th/en non-localized field mismatch, keeping th values: ${mismatches.join(", ")}`);
    }
  }

  const primaryFm: StudentLifeFrontmatter = (th ?? en)!.frontmatter;
  const nonLocalized = {
    slug,
    audience, // authoritative: the directory this file lives in, not the frontmatter value
    order: primaryFm.order,
    updated: primaryFm.updated,
    placeholder: primaryFm.placeholder ?? false,
  };

  const existing = await payload.find({
    collection: "student-life",
    where: { and: [{ slug: { equals: slug } }, { audience: { equals: audience } }] },
    limit: 1,
    overrideAccess: true,
  });
  const existingDoc = existing.docs[0];
  let id = existingDoc?.id;

  const writes: { locale: LocaleCode; data: NonNullable<typeof th> }[] = [];
  if (th) writes.push({ locale: "th", data: th });
  if (en) writes.push({ locale: "en", data: en });

  for (const [index, write] of writes.entries()) {
    const body = markdownToLexicalBody(
      write.data.markdown,
      editorConfig,
      `${label} (${write.locale})`,
      summary.warnings
    );
    const localizedData = {
      title: write.data.frontmatter.title,
      summary: write.data.frontmatter.summary,
      body,
    };
    const dataToWrite = index === 0 ? { ...nonLocalized, ...localizedData } : localizedData;

    if (!id) {
      const created = await payload.create({
        collection: "student-life",
        locale: write.locale,
        overrideAccess: true,
        data: { ...nonLocalized, ...localizedData },
      });
      id = created.id;
    } else {
      await payload.update({
        collection: "student-life",
        id,
        locale: write.locale,
        overrideAccess: true,
        data: dataToWrite,
      });
    }
  }

  if (existingDoc) {
    summary.updated++;
  } else {
    summary.created++;
  }
}

async function migrateStudentLifeAudience(
  payload: Payload,
  editorConfig: SanitizedServerEditorConfig,
  audience: GuideAudience,
  summary: CollectionSummary
): Promise<void> {
  const thSlugs = listMdxSlugs(path.join(CONTENT_ROOT, "student-life", "th", audience));
  const enSlugs = listMdxSlugs(path.join(CONTENT_ROOT, "student-life", "en", audience));
  const slugs = new Set([...thSlugs.keys(), ...enSlugs.keys()]);

  for (const slug of slugs) {
    try {
      await migrateStudentLifeEntry(
        payload,
        editorConfig,
        audience,
        slug,
        thSlugs.get(slug),
        enSlugs.get(slug),
        summary
      );
    } catch (err) {
      summary.warnings.push(
        `[student-life/${audience}/${slug}] unexpected error, skipped: ${err instanceof Error ? err.message : String(err)}`
      );
      summary.skipped++;
    }
  }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function printSummary(summaries: Record<string, CollectionSummary>): void {
  console.log("\n=== Content migration summary ===");
  for (const [name, s] of Object.entries(summaries)) {
    console.log(`\n${name}:`);
    console.log(`  created:  ${s.created}`);
    console.log(`  updated:  ${s.updated}`);
    console.log(`  skipped:  ${s.skipped}`);
    console.log(`  warnings: ${s.warnings.length}`);
    for (const warning of s.warnings) {
      console.log(`    - ${warning}`);
    }
  }
  console.log("");
}

async function main(): Promise<void> {
  console.log("Starting content -> Payload migration...");
  let payload: Payload | undefined;
  try {
    payload = await getPayload({ config });
    const editorConfig = await editorConfigFactory.default({ config: payload.config });

    const summaries: { news: CollectionSummary; activity: CollectionSummary; "student-life": CollectionSummary } = {
      news: emptySummary(),
      activity: emptySummary(),
      "student-life": emptySummary(),
    };

    await migrateNews(payload, editorConfig, summaries.news);
    await migrateActivity(payload, editorConfig, summaries.activity);
    await migrateStudentLifeAudience(payload, editorConfig, "home", summaries["student-life"]);
    await migrateStudentLifeAudience(payload, editorConfig, "international", summaries["student-life"]);

    printSummary(summaries);
    await payload.destroy();
    process.exit(0);
  } catch (err) {
    console.error("Fatal error during migration:", err);
    if (payload) {
      try {
        await payload.destroy();
      } catch {
        // ignore — we're exiting non-zero anyway
      }
    }
    process.exit(1);
  }
}

// Top-level await (not `void main()`): `payload run` does `await import(this)`,
// which only waits for the module's synchronous evaluation. A floating promise
// would be cut off — the process would exit before any async work runs. Awaiting
// here keeps the process alive until the migration finishes.
await main();
