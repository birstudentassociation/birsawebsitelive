#!/usr/bin/env node
/**
 * Wave 6A migration: MDX content -> Portable Text Sanity NDJSON
 * (REDESIGN-2.0 §11.4 item 6). Reads every file in the six source families
 * listed in the wave brief:
 *
 *   content/news/{en,th}/*.mdx                        -> newsArticle | event
 *   content/clubs/{en,th}/*.mdx                        -> club
 *   content/activity/{en,th}/*.mdx                     -> page
 *   content/student-life/{en,th}/handbook/*.mdx        -> guide
 *   content/student-life/{en,th}/home/*.mdx            -> guide
 *   content/student-life/{en,th}/international/*.mdx   -> guide
 *
 * and writes:
 *
 *   - docs/migration/mdx.ndjson, one JSON document per line, in the exact
 *     shape `sanity dataset import` consumes;
 *   - docs/migration/mdx-report.md (+ .json sidecar), the diff report
 *     accounting for every source file, via lib/migration/report.ts.
 *
 * A DEVIATION FROM THE BRIEF'S ONE-LINE TABLE, NAMED HERE BECAUSE IT IS THE
 * ONE PLACE THIS SCRIPT DISAGREES WITH ITS OWN INSTRUCTIONS. The brief maps
 * `content/news/**` to `newsArticle` alone. `sanity/schemaTypes/documents/event.ts`
 * exists specifically to receive `content/news` items with frontmatter
 * `type: "event"` -- its own file header says so in as many words ("Models
 * what content/news/{en,th}/*.mdx already carries for a type: "event" entry
 * ... split into its own document type because ... 1.0's single type flag on
 * one schema is exactly the ambiguity this wave is meant to remove"). Wave
 * 3B's schema is the more specific and more recent authority on where this
 * content belongs than the brief's own summary table, and following the
 * brief literally here would silently drop every event's `location`/`start`/
 * `end` (fields `newsArticle` does not carry at all, and an event's when/
 * where is core information, not a nice-to-have). So: `type: "news"` frontmatter
 * -> `newsArticle`, `type: "event"` -> `event`, both still sourced from
 * `content/news/**` exactly as the brief's path list says. Reported again,
 * plainly, in docs/migration/mdx.md.
 *
 * OFFLINE BY DESIGN, same as every Wave 6 migrate script: no network, no
 * `SANITY_API_READ_TOKEN` (unset in this checkout, and no write token exists
 * anywhere). Filesystem in, two files out. `sanity dataset import` is an
 * operator step, documented in docs/migration/mdx.md.
 *
 * REUSES THE SITE'S OWN LOADER. `lib/content.ts`'s `getEntries`/
 * `getClubEntries`/`getGuideEntries` already parse frontmatter with
 * gray-matter and validate it with zod -- that IS "the authoritative
 * statement of what each frontmatter shape actually is" the brief points at,
 * so this script calls those functions rather than re-implementing
 * frontmatter parsing. A section whose frontmatter fails that validation
 * throws before this script ever sees it (matching `lib/content.ts`'s own
 * "the build fails loudly rather than shipping broken content"), so a
 * validation failure anywhere in a section aborts that whole section's
 * migration rather than silently continuing past it; see `loadSection`
 * below.
 *
 * BODY PROSE GOES THROUGH `lib/migration/portableText.ts`, which is pure
 * and does the actual MDX -> Portable Text work, including the two-phase
 * per-locale-parse-then-merge design that bilingual sections require -- see
 * that file's header for why a single pass cannot do this.
 *
 * DETERMINISM. Every source directory is listed with `readdirSync` and
 * sorted before use; the final NDJSON is sorted by `_id` before it is
 * written. Running this script twice on an unchanged tree produces
 * byte-identical output (the shared brief's determinism requirement); see
 * `tests/unit/migration-mdx.test.ts`'s "byte-identical on a second run"
 * test.
 *
 * RUN FROM THE REPO ROOT. `npm run` and every sibling Wave 6 script assume
 * this; this script additionally checks it and refuses to run otherwise,
 * because a wrong cwd is exactly how an earlier Wave 6 run left a stray
 * `home/user/birsawebsitelive/...` tree at the repo root (an absolute path
 * joined onto the wrong base). Every path this script writes is built with
 * `path.join(REPO_ROOT, <relative segments only>)`; nothing here ever joins
 * an already-absolute path onto another path.
 */
import { readdirSync, statSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import esbuild from "esbuild";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

if (process.cwd() !== REPO_ROOT) {
  console.error(
    `migrate-mdx: must be run from the repo root (${REPO_ROOT}), not ${process.cwd()}. ` +
      "Run `node scripts/migrate-mdx.mjs` from the repository root."
  );
  process.exit(1);
}

function repoPath(...parts) {
  for (const part of parts) {
    if (path.isAbsolute(part)) {
      throw new Error(
        `migrate-mdx: repoPath() received an absolute path segment "${part}"; pass relative segments only.`
      );
    }
  }
  return path.join(REPO_ROOT, ...parts);
}

// ---------------------------------------------------------------------------
// TypeScript module loader (see scripts/migrate-modules.mjs's header for
// why: no ts-node/tsx dependency in this repo, esbuild already present
// transitively via vite/vitest).
// ---------------------------------------------------------------------------

async function loadTsModule(entryRelativePath) {
  // Bundled to CJS, not ESM, and written to a REAL temporary file rather
  // than a `data:` URL: `lib/content.ts` pulls in `gray-matter`, a genuine
  // CommonJS npm dependency, and esbuild's ESM output wraps a bundled CJS
  // dependency in a `__require` shim that falls back to the ambient
  // `require` global -- which does not exist for a `data:` URL imported
  // into pure ESM ("Dynamic require of \"fs\" is not supported"). A `.cjs`
  // file loaded via Node's own module system has a real `require` in scope
  // (part of the CJS module wrapper Node itself provides), which is what
  // the shim needs, and Node's dynamic `import()` can load a CJS file from
  // an ESM script directly. The temp file is written under `os.tmpdir()`
  // (never inside this repo, so it cannot become a stray tracked file) and
  // removed immediately after the import resolves.
  const result = await esbuild.build({
    entryPoints: [repoPath(entryRelativePath)],
    bundle: true,
    format: "cjs",
    platform: "node",
    write: false,
    logLevel: "silent",
  });
  const code = result.outputFiles[0].text;
  const tempFile = path.join(
    os.tmpdir(),
    `migrate-mdx-${path.basename(entryRelativePath, ".ts")}-${process.pid}-${Date.now()}.cjs`
  );
  writeFileSync(tempFile, code, "utf8");
  try {
    return await import(pathToFileURL(tempFile).href);
  } finally {
    rmSync(tempFile, { force: true });
  }
}

// ---------------------------------------------------------------------------
// Small pure helpers shared across every family below.
// ---------------------------------------------------------------------------

function listSlugs(dirRelative) {
  const dir = repoPath(dirRelative);
  try {
    statSync(dir);
  } catch {
    return [];
  }
  return readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .sort();
}

/**
 * Builds a `localizedString`/`localizedText` value from the same field read
 * out of the EN and TH frontmatter/body. Both present -> a bilingual value.
 * Both absent -> `undefined` (fine for an optional field). Exactly one
 * present -> `localizedString`/`localizedText` cannot express "one language
 * only" (both `en`/`th` are required at the field itself,
 * `sanity/schemaTypes/objects/localizedString.ts`), so the value is dropped
 * and a note is pushed rather than publishing a half-filled field.
 */
function mergeLocalized(typeName, en, th, label, notes) {
  const enVal = en == null ? null : String(en);
  const thVal = th == null ? null : String(th);
  if (enVal && thVal) return { _type: typeName, en: enVal, th: thVal };
  if (!enVal && !thVal) return undefined;
  notes.push(
    `${label}: present in only one locale (en=${JSON.stringify(enVal)}, th=${JSON.stringify(thVal)}); ` +
      `${typeName} requires both, so it was dropped rather than published half-filled.`
  );
  return undefined;
}

/** A plain (non-localized) scalar that 1.0 stores once per locale file but 2.0 stores once per document (e.g. `category`, `order`, `date`). Asserts the two locale files agree; on disagreement, uses the EN value and notes the conflict rather than silently discarding the TH value. */
function mergeUnlocalizedScalar(en, th, label, notes) {
  if (en === undefined && th === undefined) return undefined;
  if (en === undefined) return th;
  if (th === undefined) return en;
  const same = en instanceof Date || th instanceof Date ? String(en) === String(th) : en === th;
  if (!same) {
    notes.push(
      `${label}: the EN and TH source files disagree (en=${JSON.stringify(en)}, th=${JSON.stringify(
        th
      )}); this field has no locale wrapper in the 2.0 schema, so the EN value was kept. Reconcile the source.`
    );
  }
  return en;
}

const LIFECYCLE_NOTE =
  "lifecycle.owner and lifecycle.reviewBy are omitted. Both are `Rule.required()` " +
  "(sanity/schemaTypes/objects/lifecycle.ts), and both are 2.0 concepts with no 1.0 source: " +
  "1.0 content carries no per-document owning portfolio and no review-by date. Assigning an " +
  "owner is an editorial decision for the owning portfolio, not something this migration script " +
  'invents ("no agent hand-writes content"). Every document below will show as unpublishable ' +
  "in the Studio until an officer sets both by hand; this is expected, not a bug in this script.";

function buildLifecycle(lastReviewed) {
  const lifecycle = { _type: "lifecycle", status: "published", slugHistory: [] };
  if (lastReviewed) lifecycle.lastReviewed = lastReviewed;
  return lifecycle;
}

async function main() {
  const content = await loadTsModule("lib/content.ts");
  const ids = await loadTsModule("lib/migration/ids.ts");
  const report = await loadTsModule("lib/migration/report.ts");
  const pt = await loadTsModule("lib/migration/portableText.ts");

  const allSourceFiles = [];
  const entries = [];
  const documents = [];
  const crossFamilyNotes = [];

  function addFile(relPath) {
    allSourceFiles.push(relPath);
  }
  function migrated(relPath, documentId, notes) {
    entries.push({
      sourcePath: relPath,
      status: "migrated",
      documentId,
      notes: notes?.length ? notes : undefined,
    });
  }
  function notMigrated(relPath, reason) {
    entries.push({ sourcePath: relPath, status: "not-migrated", reason });
  }
  function gap(relPath, reason) {
    entries.push({ sourcePath: relPath, status: "gap", reason });
  }

  /**
   * Loads a whole section/locale via `lib/content.ts`, isolating a
   * validation failure to that one (section, locale) pair rather than
   * letting it crash every family: `getEntries`/`getClubEntries`/
   * `getGuideEntries` throw on the FIRST invalid file in the directory
   * (`lib/content.ts`'s `parseEntry`, by design -- "the build fails loudly").
   * In this corpus, which is what the live 1.0 site already builds from,
   * this should never actually throw; the catch exists so a future invalid
   * file becomes one named report line instead of a stack trace that aborts
   * the whole run.
   */
  function loadSectionSafely(loaderFn) {
    try {
      return { ok: true, entries: loaderFn() };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : String(err) };
    }
  }

  // -------------------------------------------------------------------------
  // Pass 1: club title/tagline index, needed before any body is parsed
  // because `<RelatedClubs slugs="..." />` resolves to another club's own
  // (already-computed) title/tagline and document id.
  // -------------------------------------------------------------------------

  const clubSlugsEn = listSlugs("content/clubs/en");
  const clubSlugsTh = listSlugs("content/clubs/th");
  const clubEnSection = loadSectionSafely(() => content.getClubEntries("en"));
  const clubThSection = loadSectionSafely(() => content.getClubEntries("th"));
  const clubEnBySlug = clubEnSection.ok
    ? new Map(clubEnSection.entries.map((e) => [e.slug, e]))
    : new Map();
  const clubThBySlug = clubThSection.ok
    ? new Map(clubThSection.entries.map((e) => [e.slug, e]))
    : new Map();

  /** slug -> { documentId, title: LocalizedString, tagline: LocalizedString } for every club with a valid, bilingual-paired frontmatter. Built before any body is parsed. */
  const clubIndex = new Map();
  for (const slug of new Set([...clubSlugsEn, ...clubSlugsTh])) {
    const en = clubEnBySlug.get(slug);
    const th = clubThBySlug.get(slug);
    if (!en || !th) continue; // reported properly in the clubs pass below
    const notes = [];
    const title = mergeLocalized(
      "localizedString",
      en.frontmatter.title,
      th.frontmatter.title,
      "club title",
      notes
    );
    const tagline = mergeLocalized(
      "localizedText",
      en.frontmatter.tagline,
      th.frontmatter.tagline,
      "club tagline",
      notes
    );
    if (!title || !tagline) continue; // required fields; a real gap, surfaced by the clubs pass
    clubIndex.set(slug, { documentId: ids.documentId("club", slug), title, tagline });
  }

  function resolveClub(slug) {
    return clubIndex.get(slug) ?? null;
  }

  // -------------------------------------------------------------------------
  // Shared body-merge step: parses both locale bodies through
  // lib/migration/portableText.ts, catching its named errors and turning
  // them into report entries instead of crashing the run.
  // -------------------------------------------------------------------------

  function mergeBody(sourcePathEn, sourcePathTh, bodyEn, bodyTh) {
    let parsedEn, parsedTh;
    try {
      parsedEn = pt.parseMdxBody(bodyEn, {
        sourcePath: sourcePathEn,
        linkResolver: pt.defaultLinkResolver,
      });
    } catch (err) {
      return {
        ok: false,
        reasonEn: err.message,
        reasonTh: `its EN twin failed to parse: ${err.message}`,
      };
    }
    try {
      parsedTh = pt.parseMdxBody(bodyTh, {
        sourcePath: sourcePathTh,
        linkResolver: pt.defaultLinkResolver,
      });
    } catch (err) {
      return {
        ok: false,
        reasonEn: `its TH twin failed to parse: ${err.message}`,
        reasonTh: err.message,
      };
    }
    try {
      const merged = pt.mergeLocaleSections(parsedEn.sections, parsedTh.sections, {
        sourcePathEn,
        sourcePathTh,
        resolveClub,
      });
      return {
        ok: true,
        sections: merged.sections,
        notes: [...parsedEn.notes, ...parsedTh.notes, ...merged.notes],
      };
    } catch (err) {
      return { ok: false, reasonEn: err.message, reasonTh: err.message };
    }
  }

  // -------------------------------------------------------------------------
  // News and events (content/news -> newsArticle | event)
  // -------------------------------------------------------------------------

  {
    const slugsEn = listSlugs("content/news/en");
    const slugsTh = listSlugs("content/news/th");
    slugsEn.forEach((s) => addFile(`content/news/en/${s}.mdx`));
    slugsTh.forEach((s) => addFile(`content/news/th/${s}.mdx`));

    const enSection = loadSectionSafely(() => content.getEntries("news", "en"));
    const thSection = loadSectionSafely(() => content.getEntries("news", "th"));

    if (!enSection.ok || !thSection.ok) {
      const reason = `frontmatter validation failed for this whole section (${
        !enSection.ok ? enSection.error : thSection.error
      })`;
      for (const s of slugsEn) notMigrated(`content/news/en/${s}.mdx`, reason);
      for (const s of slugsTh) notMigrated(`content/news/th/${s}.mdx`, reason);
    } else {
      const enBySlug = new Map(enSection.entries.map((e) => [e.slug, e]));
      const thBySlug = new Map(thSection.entries.map((e) => [e.slug, e]));

      for (const slug of new Set([...slugsEn, ...slugsTh])) {
        const pathEn = `content/news/en/${slug}.mdx`;
        const pathTh = `content/news/th/${slug}.mdx`;
        const en = enBySlug.get(slug);
        const th = thBySlug.get(slug);

        if (!en || !th) {
          const missing = !en ? "en" : "th";
          const present = en ? pathEn : pathTh;
          gap(
            present,
            `no ${missing.toUpperCase()} twin found at content/news/${missing}/${slug}.mdx.`
          );
          continue;
        }

        const notes = [];
        if (en.frontmatter.type !== th.frontmatter.type) {
          const reason =
            `the EN frontmatter says type: "${en.frontmatter.type}" but TH says type: ` +
            `"${th.frontmatter.type}"; this decides which 2.0 document type (newsArticle vs event) the ` +
            "item becomes, so it cannot be guessed.";
          notMigrated(pathEn, reason);
          notMigrated(pathTh, reason);
          continue;
        }

        const merge = mergeBody(pathEn, pathTh, en.content, th.content);
        if (!merge.ok) {
          notMigrated(pathEn, merge.reasonEn);
          notMigrated(pathTh, merge.reasonTh);
          continue;
        }
        notes.push(...merge.notes);

        const title = mergeLocalized(
          "localizedString",
          en.frontmatter.title,
          th.frontmatter.title,
          "title",
          notes
        );
        const summary = mergeLocalized(
          "localizedText",
          en.frontmatter.summary,
          th.frontmatter.summary,
          "summary",
          notes
        );
        const category = mergeUnlocalizedScalar(
          en.frontmatter.category,
          th.frontmatter.category,
          "category",
          notes
        );
        const date = mergeUnlocalizedScalar(
          en.frontmatter.date,
          th.frontmatter.date,
          "date",
          notes
        );
        const placeholder = mergeUnlocalizedScalar(
          en.frontmatter.placeholder,
          th.frontmatter.placeholder,
          "placeholder",
          notes
        );

        if ((en.frontmatter.links?.length ?? 0) > 0 || (th.frontmatter.links?.length ?? 0) > 0) {
          notes.push(
            "frontmatter `links` field has no destination in newsArticle/event " +
              "(sanity/schemaTypes/documents/{newsArticle,event}.ts carry no such field); dropped. " +
              `EN: ${JSON.stringify(en.frontmatter.links ?? [])}, TH: ${JSON.stringify(th.frontmatter.links ?? [])}`
          );
        }

        const docType = en.frontmatter.type === "event" ? "event" : "newsArticle";
        // lib/migration/ids.ts's documentId() validates docType against a
        // lowercase-kebab pattern (matching how Wave 6B actually calls it,
        // e.g. "committee-member" rather than "committeeMember" -- see
        // lib/migration/modules.ts), which newsArticle's own camelCase
        // _type does not satisfy. The id prefix and the emitted _type are
        // independent: _type below is still the real Sanity schema name;
        // the id just needs its own stable, collision-free token.
        const documentId = ids.documentId(docType === "event" ? "event" : "news-article", slug);

        const base = {
          _id: documentId,
          _type: docType,
          title,
          slug: { _type: "slug", current: slug },
          summary,
          category,
          date,
          body: merge.sections,
          placeholder: placeholder ?? false,
          lifecycle: buildLifecycle(date),
        };
        notes.push(LIFECYCLE_NOTE);

        if (docType === "event") {
          const location = mergeLocalized(
            "localizedString",
            en.frontmatter.location,
            th.frontmatter.location,
            "location",
            notes
          );
          const start = mergeUnlocalizedScalar(
            en.frontmatter.start,
            th.frontmatter.start,
            "start",
            notes
          );
          const end = mergeUnlocalizedScalar(en.frontmatter.end, th.frontmatter.end, "end", notes);
          if (!location || !start) {
            const reason =
              `type: "event" but ${!location ? "location" : "start"} is missing or not bilingual, and both ` +
              "are Rule.required() on the event document type.";
            notMigrated(pathEn, reason);
            notMigrated(pathTh, reason);
            continue;
          }
          base.location = location;
          base.start = start;
          if (end) base.end = end;
        }

        documents.push(base);
        migrated(pathEn, documentId, notes);
        migrated(pathTh, documentId, notes);
      }
    }
  }

  // -------------------------------------------------------------------------
  // Clubs (content/clubs -> club)
  // -------------------------------------------------------------------------

  {
    clubSlugsEn.forEach((s) => addFile(`content/clubs/en/${s}.mdx`));
    clubSlugsTh.forEach((s) => addFile(`content/clubs/th/${s}.mdx`));

    if (!clubEnSection.ok || !clubThSection.ok) {
      const reason = `frontmatter validation failed for this whole section (${
        !clubEnSection.ok ? clubEnSection.error : clubThSection.error
      })`;
      for (const s of clubSlugsEn) notMigrated(`content/clubs/en/${s}.mdx`, reason);
      for (const s of clubSlugsTh) notMigrated(`content/clubs/th/${s}.mdx`, reason);
    } else {
      for (const slug of new Set([...clubSlugsEn, ...clubSlugsTh])) {
        const pathEn = `content/clubs/en/${slug}.mdx`;
        const pathTh = `content/clubs/th/${slug}.mdx`;
        const en = clubEnBySlug.get(slug);
        const th = clubThBySlug.get(slug);

        if (!en || !th) {
          const missing = !en ? "en" : "th";
          const present = en ? pathEn : pathTh;
          gap(
            present,
            `no ${missing.toUpperCase()} twin found at content/clubs/${missing}/${slug}.mdx.`
          );
          continue;
        }

        const notes = [];
        const merge = mergeBody(pathEn, pathTh, en.content, th.content);
        if (!merge.ok) {
          notMigrated(pathEn, merge.reasonEn);
          notMigrated(pathTh, merge.reasonTh);
          continue;
        }
        notes.push(...merge.notes);

        const title = mergeLocalized(
          "localizedString",
          en.frontmatter.title,
          th.frontmatter.title,
          "title",
          notes
        );
        const tagline = mergeLocalized(
          "localizedString",
          en.frontmatter.tagline,
          th.frontmatter.tagline,
          "tagline",
          notes
        );
        if (!title || !tagline) {
          const reason =
            "title and tagline are both Rule.required() localizedString fields on club.";
          notMigrated(pathEn, reason);
          notMigrated(pathTh, reason);
          continue;
        }

        const category = mergeUnlocalizedScalar(
          en.frontmatter.category,
          th.frontmatter.category,
          "category",
          notes
        );
        const order = mergeUnlocalizedScalar(
          en.frontmatter.order,
          th.frontmatter.order,
          "order",
          notes
        );
        const joinOpen = mergeUnlocalizedScalar(
          en.frontmatter.joinOpen,
          th.frontmatter.joinOpen,
          "joinOpen",
          notes
        );
        const updated = mergeUnlocalizedScalar(
          en.frontmatter.updated,
          th.frontmatter.updated,
          "updated",
          notes
        );
        const placeholder = mergeUnlocalizedScalar(
          en.frontmatter.placeholder,
          th.frontmatter.placeholder,
          "placeholder",
          notes
        );
        const lead = mergeLocalized(
          "localizedString",
          en.frontmatter.lead,
          th.frontmatter.lead,
          "lead",
          notes
        );
        const meets = mergeLocalized(
          "localizedString",
          en.frontmatter.meets,
          th.frontmatter.meets,
          "meets",
          notes
        );
        const where = mergeLocalized(
          "localizedString",
          en.frontmatter.where,
          th.frontmatter.where,
          "where",
          notes
        );
        const custodian = mergeUnlocalizedScalar(
          en.frontmatter.custodian,
          th.frontmatter.custodian,
          "custodian",
          notes
        );

        const enLinks = en.frontmatter.links ?? [];
        const thLinks = th.frontmatter.links ?? [];
        let socialLinks;
        if (enLinks.length !== thLinks.length) {
          notes.push(
            `socialLinks: EN has ${enLinks.length} link(s), TH has ${thLinks.length}; cannot pair them ` +
              "positionally, so socialLinks was dropped for this club. Reconcile the source lists."
          );
        } else {
          socialLinks = [];
          let mismatchedHref = false;
          enLinks.forEach((enLink, i) => {
            const thLink = thLinks[i];
            if (enLink.href !== thLink.href) {
              mismatchedHref = true;
              notes.push(
                `socialLinks[${i}]: EN href "${enLink.href}" differs from TH href "${thLink.href}" for the ` +
                  "same position; kept the EN href, since a per-locale channel URL cannot be represented and " +
                  "silently picking one needed to be visible."
              );
            }
            socialLinks.push({
              _type: "socialLink",
              _key: ids.arrayKey("link", String(i)),
              label: { _type: "localizedString", en: enLink.label, th: thLink.label },
              href: enLink.href,
            });
          });
          void mismatchedHref;
        }

        const documentId = ids.documentId("club", slug);
        const doc = {
          _id: documentId,
          _type: "club",
          title,
          slug: { _type: "slug", current: slug },
          tagline,
          category,
          order,
          joinOpen: joinOpen ?? false,
          ...(lead ? { lead } : {}),
          ...(meets ? { meets } : {}),
          ...(where ? { where } : {}),
          ...(custodian ? { custodian } : {}),
          ...(socialLinks ? { socialLinks } : {}),
          body: merge.sections,
          placeholder: placeholder ?? false,
          lifecycle: buildLifecycle(updated),
        };
        notes.push(LIFECYCLE_NOTE);

        documents.push(doc);
        migrated(pathEn, documentId, notes);
        migrated(pathTh, documentId, notes);
      }
    }
  }

  // -------------------------------------------------------------------------
  // Activity (content/activity -> page). `order` has no destination field
  // on `page` (sanity/schemaTypes/documents/page.ts carries no such field,
  // unlike `guide`, which keeps it) -- noted per document below.
  // -------------------------------------------------------------------------

  {
    const slugsEn = listSlugs("content/activity/en");
    const slugsTh = listSlugs("content/activity/th");
    slugsEn.forEach((s) => addFile(`content/activity/en/${s}.mdx`));
    slugsTh.forEach((s) => addFile(`content/activity/th/${s}.mdx`));

    const enSection = loadSectionSafely(() => content.getEntries("activity", "en"));
    const thSection = loadSectionSafely(() => content.getEntries("activity", "th"));

    if (!enSection.ok || !thSection.ok) {
      const reason = `frontmatter validation failed for this whole section (${
        !enSection.ok ? enSection.error : thSection.error
      })`;
      for (const s of slugsEn) notMigrated(`content/activity/en/${s}.mdx`, reason);
      for (const s of slugsTh) notMigrated(`content/activity/th/${s}.mdx`, reason);
    } else {
      const enBySlug = new Map(enSection.entries.map((e) => [e.slug, e]));
      const thBySlug = new Map(thSection.entries.map((e) => [e.slug, e]));

      for (const slug of new Set([...slugsEn, ...slugsTh])) {
        const pathEn = `content/activity/en/${slug}.mdx`;
        const pathTh = `content/activity/th/${slug}.mdx`;
        const en = enBySlug.get(slug);
        const th = thBySlug.get(slug);

        if (!en || !th) {
          const missing = !en ? "en" : "th";
          const present = en ? pathEn : pathTh;
          gap(
            present,
            `no ${missing.toUpperCase()} twin found at content/activity/${missing}/${slug}.mdx.`
          );
          continue;
        }

        const notes = [];
        const merge = mergeBody(pathEn, pathTh, en.content, th.content);
        if (!merge.ok) {
          notMigrated(pathEn, merge.reasonEn);
          notMigrated(pathTh, merge.reasonTh);
          continue;
        }
        notes.push(...merge.notes);

        const title = mergeLocalized(
          "localizedString",
          en.frontmatter.title,
          th.frontmatter.title,
          "title",
          notes
        );
        const summary = mergeLocalized(
          "localizedText",
          en.frontmatter.summary,
          th.frontmatter.summary,
          "summary",
          notes
        );
        if (!title) {
          const reason = "title is a Rule.required() localizedString field on page.";
          notMigrated(pathEn, reason);
          notMigrated(pathTh, reason);
          continue;
        }
        const updated = mergeUnlocalizedScalar(
          en.frontmatter.updated,
          th.frontmatter.updated,
          "updated",
          notes
        );
        const placeholder = mergeUnlocalizedScalar(
          en.frontmatter.placeholder,
          th.frontmatter.placeholder,
          "placeholder",
          notes
        );
        notes.push(
          `order (en=${en.frontmatter.order}, th=${th.frontmatter.order}) has no destination field on ` +
            "`page` (sanity/schemaTypes/documents/page.ts); dropped. 1.0 uses it to sequence the activity " +
            "listing; if the 2.0 listing still needs a manual order, it needs a field added to `page` or " +
            "sequencing needs to move to the `navigation` document type."
        );

        const documentId = ids.documentId("page", slug);
        const doc = {
          _id: documentId,
          _type: "page",
          title,
          slug: { _type: "slug", current: slug },
          ...(summary ? { summary } : {}),
          body: merge.sections,
          placeholder: placeholder ?? false,
          lifecycle: buildLifecycle(updated),
        };
        notes.push(LIFECYCLE_NOTE);

        documents.push(doc);
        migrated(pathEn, documentId, notes);
        migrated(pathTh, documentId, notes);
      }
    }
  }

  // -------------------------------------------------------------------------
  // Student-life guides (content/student-life/{audience} -> guide)
  // -------------------------------------------------------------------------

  {
    const audiences = ["handbook", "home", "international"];
    for (const audience of audiences) {
      const slugsEn = listSlugs(`content/student-life/en/${audience}`);
      const slugsTh = listSlugs(`content/student-life/th/${audience}`);
      slugsEn.forEach((s) => addFile(`content/student-life/en/${audience}/${s}.mdx`));
      slugsTh.forEach((s) => addFile(`content/student-life/th/${audience}/${s}.mdx`));

      const enSection = loadSectionSafely(() => content.getGuideEntries("en", audience));
      const thSection = loadSectionSafely(() => content.getGuideEntries("th", audience));

      if (!enSection.ok || !thSection.ok) {
        const reason = `frontmatter validation failed for this whole section (${
          !enSection.ok ? enSection.error : thSection.error
        })`;
        for (const s of slugsEn)
          notMigrated(`content/student-life/en/${audience}/${s}.mdx`, reason);
        for (const s of slugsTh)
          notMigrated(`content/student-life/th/${audience}/${s}.mdx`, reason);
        continue;
      }

      const enBySlug = new Map(enSection.entries.map((e) => [e.slug, e]));
      const thBySlug = new Map(thSection.entries.map((e) => [e.slug, e]));

      for (const slug of new Set([...slugsEn, ...slugsTh])) {
        const pathEn = `content/student-life/en/${audience}/${slug}.mdx`;
        const pathTh = `content/student-life/th/${audience}/${slug}.mdx`;
        const en = enBySlug.get(slug);
        const th = thBySlug.get(slug);

        if (!en || !th) {
          const missing = !en ? "en" : "th";
          const present = en ? pathEn : pathTh;
          gap(
            present,
            `no ${missing.toUpperCase()} twin found at content/student-life/${missing}/${audience}/${slug}.mdx.`
          );
          continue;
        }

        const notes = [];
        const merge = mergeBody(pathEn, pathTh, en.content, th.content);
        if (!merge.ok) {
          notMigrated(pathEn, merge.reasonEn);
          notMigrated(pathTh, merge.reasonTh);
          continue;
        }
        notes.push(...merge.notes);

        const title = mergeLocalized(
          "localizedString",
          en.frontmatter.title,
          th.frontmatter.title,
          "title",
          notes
        );
        const summary = mergeLocalized(
          "localizedText",
          en.frontmatter.summary,
          th.frontmatter.summary,
          "summary",
          notes
        );
        if (!title || !summary) {
          const reason = "title and summary are both Rule.required() fields on guide.";
          notMigrated(pathEn, reason);
          notMigrated(pathTh, reason);
          continue;
        }
        const order = mergeUnlocalizedScalar(
          en.frontmatter.order,
          th.frontmatter.order,
          "order",
          notes
        );
        const updated = mergeUnlocalizedScalar(
          en.frontmatter.updated,
          th.frontmatter.updated,
          "updated",
          notes
        );
        const placeholder = mergeUnlocalizedScalar(
          en.frontmatter.placeholder,
          th.frontmatter.placeholder,
          "placeholder",
          notes
        );
        const frontmatterAudience = mergeUnlocalizedScalar(
          en.frontmatter.audience,
          th.frontmatter.audience,
          "audience",
          notes
        );
        if (frontmatterAudience && frontmatterAudience !== audience) {
          notes.push(
            `frontmatter audience ("${frontmatterAudience}") disagrees with the directory it was read from ` +
              `("${audience}"); the directory was used, since that is what determined this document's id.`
          );
        }

        const documentId = ids.documentId("guide", `${audience}-${slug}`);
        const doc = {
          _id: documentId,
          _type: "guide",
          title,
          slug: { _type: "slug", current: slug },
          summary,
          audience,
          order,
          body: merge.sections,
          placeholder: placeholder ?? false,
          lifecycle: buildLifecycle(updated),
        };
        notes.push(LIFECYCLE_NOTE);

        documents.push(doc);
        migrated(pathEn, documentId, notes);
        migrated(pathTh, documentId, notes);
      }
    }
  }

  // -------------------------------------------------------------------------
  // Cross-family check for Wave 6B: does every content/calendar/events.ts
  // slug reference land on a document this script actually produced, and
  // does that document carry a date? 6B deliberately emits no document of
  // its own for the calendar (to avoid colliding with these ids) and relies
  // on this family's newsArticle/event documents to carry the date.
  // -------------------------------------------------------------------------

  {
    let calendarSlugs = [];
    try {
      const calendarSrc = repoPath("content/calendar/events.ts");
      statSync(calendarSrc);
      const calendarMod = await loadTsModule("content/calendar/events.ts");
      calendarSlugs = [...new Set((calendarMod.calendarEvents ?? []).map((e) => e.slug))].sort();
    } catch (err) {
      crossFamilyNotes.push(
        `Could not load content/calendar/events.ts to cross-check Wave 6B's date-marker slugs (${
          err instanceof Error ? err.message : String(err)
        }); skipped this check.`
      );
    }

    if (calendarSlugs.length > 0) {
      const migratedIdsBySlug = new Map();
      for (const doc of documents) {
        if (doc.slug?.current) migratedIdsBySlug.set(doc.slug.current, doc);
      }
      const missing = [];
      const noDate = [];
      for (const slug of calendarSlugs) {
        const doc = migratedIdsBySlug.get(slug);
        if (!doc) {
          missing.push(slug);
          continue;
        }
        const hasDate = doc._type === "event" ? Boolean(doc.start) : Boolean(doc.date);
        if (!hasDate) noDate.push(slug);
      }
      if (missing.length === 0 && noDate.length === 0) {
        crossFamilyNotes.push(
          `Wave 6B cross-check: all ${calendarSlugs.length} slug(s) content/calendar/events.ts references ` +
            "(" +
            calendarSlugs.join(", ") +
            ") resolved to a migrated newsArticle/event document carrying a date. 6B's decision to emit no " +
            "document of its own for the calendar is safe as far as this family's output goes."
        );
      }
      if (missing.length > 0) {
        crossFamilyNotes.push(
          "Wave 6B cross-check FAILURE: content/calendar/events.ts references slug(s) that did not migrate " +
            `to any document in this run: ${missing.join(", ")}. Look up each slug's outcome in the table ` +
            "above (it exists as a source file with a not-migrated/gap reason, or the calendar's slug is " +
            "simply wrong) -- the calendar will link to nothing for these entries until it is fixed."
        );
      }
      if (noDate.length > 0) {
        crossFamilyNotes.push(
          "Wave 6B cross-check FAILURE: these migrated documents have no date the calendar can rely on: " +
            noDate.join(", ") +
            "."
        );
      }
    }
  }

  // -------------------------------------------------------------------------
  // Write the NDJSON artifact, sorted by _id for determinism.
  // -------------------------------------------------------------------------

  ids.assertNoDuplicateIds(
    documents.map((d) => d._id),
    "MDX-migrated documents"
  );

  const sortedDocuments = [...documents].sort((a, b) => a._id.localeCompare(b._id));
  const ndjsonPath = repoPath("docs/migration/mdx.ndjson");
  mkdirSync(path.dirname(ndjsonPath), { recursive: true });
  writeFileSync(
    ndjsonPath,
    sortedDocuments.map((d) => JSON.stringify(d)).join("\n") + "\n",
    "utf8"
  );

  const intro = [
    "Wave 6A migrates every MDX content file into Portable Text, per REDESIGN-2.0 §11.4 item 6.",
    "",
    "**A note on document types.** `content/news/**` splits across two 2.0 document types by its own " +
      '`type` frontmatter field: `type: "news"` becomes `newsArticle`, `type: "event"` becomes `event` ' +
      "(`sanity/schemaTypes/documents/event.ts`'s own header names this split explicitly). The rest of the " +
      "family maps one source directory to one document type, exactly as the wave brief's table says.",
    "",
    "**The one field 1.0 has that this schema does not carry unlocalised**, per `newsArticle.ts`/`event.ts`'s " +
      "own header comment: `category`. 1.0 stores it once per locale file; 2.0's `category` field is a bare " +
      "`string`, not a `localizedString`. In this corpus the two locale files always already agree (verified " +
      "for every migrated item; disagreements, if any occur later, are noted per document below), so no " +
      "content is actually lost today, but the schema cannot express a future divergence.",
    "",
    "**Every migrated document omits `lifecycle.owner` and `lifecycle.reviewBy`.** See the per-document note " +
      "for why (both are 2.0 concepts absent from 1.0 content, and assigning an owner is an editorial " +
      "decision, not this script's to make). This is expected on every row, not an error.",
    "",
    "**The one field the Portable Text schema genuinely cannot hold bilingually**: `rich-text`/`inset-text` " +
      "sections' `content` field (`portableText`/`portableTextInline` in " +
      "`sanity/schemaTypes/objects/portableText.ts`) has no `{en, th}` wrapper, unlike every other text field " +
      "in this schema. `content` below carries the English blocks; the Thai blocks for the same section are " +
      "preserved in a sibling `_i18nGapPortableText` property the schema does not declare (so the Studio will " +
      "not render or let an officer edit it) purely so the Thai prose survives this NDJSON round trip. See " +
      "`docs/migration/mdx.md` and `lib/migration/portableText.ts`'s file header for the full explanation.",
  ];
  if (crossFamilyNotes.length > 0) {
    intro.push("", "**Cross-family check, requested by Wave 6B:**");
    for (const note of crossFamilyNotes) intro.push("", note);
  }

  const result = report.writeMigrationReport({
    outBasePath: "docs/migration/mdx-report",
    title: "Wave 6A diff report: MDX to Portable Text",
    intro: intro.join("\n"),
    allSourceFiles: [...new Set(allSourceFiles)].sort(),
    entries,
  });

  console.log(`migrate-mdx: wrote ${sortedDocuments.length} document(s) to ${ndjsonPath}`);
  console.log(
    `migrate-mdx: wrote diff report to ${repoPath("docs/migration/mdx-report.md")} ` +
      `(migrated ${result.counts.migrated}, not-migrated ${result.counts["not-migrated"]}, ` +
      `gap ${result.counts.gap}, unaccounted ${result.counts.unaccounted})`
  );

  if (result.unaccounted.length > 0) {
    console.error(
      `migrate-mdx: ${result.unaccounted.length} file(s) are unaccounted for; this is a bug in this script, ` +
        "not a content problem. See the report's Unaccounted for section."
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("migrate-mdx: fatal error:", err);
  process.exit(1);
});
