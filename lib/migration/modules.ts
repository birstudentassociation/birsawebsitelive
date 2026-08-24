/**
 * Wave 6B: TypeScript content module -> Sanity document transforms
 * (REDESIGN-2.0 §11.4 item 6, `docs/CMS-SCHEMA-CONVENTIONS.md`).
 *
 * WHY THIS FILE IS SHAPED THE WAY IT IS.
 *
 * Every function here is pure: given source data (already-parsed content
 * module values, not file paths) and an `idFor` function supplied by the
 * caller, it returns a document (or documents) plus a list of `Gap`s. There
 * is no filesystem access, no Sanity client, and no import of
 * `lib/migration/ids.ts` or `lib/migration/report.ts` (Wave 6A's owned
 * files). Two reasons for that, both deliberate:
 *
 *   1. Testability. `tests/unit/migration-modules.test.ts` exercises these
 *      functions directly, in memory, with a trivial `idFor` stub. That test
 *      suite must pass regardless of whether Wave 6A's files exist yet in
 *      this checkout (the shared brief warns they may not: "may not exist
 *      yet when you start... come back to them"). A hard import here would
 *      make this whole file, and its tests, fail to typecheck until another
 *      agent's work lands.
 *   2. Honesty about the actual dependency. `idFor` is the one thing this
 *      file genuinely cannot decide for itself (an id has to be stable
 *      across runs and consistent with whatever the other four migration
 *      families derive), so it is threaded through explicitly rather than
 *      hidden behind an import. `scripts/migrate-modules.mjs` is the one
 *      place that resolves a real `idFor`, preferring `lib/migration/ids.ts`
 *      when present and falling back to a local, clearly-labelled
 *      implementation when it is not (see that script's header).
 *
 * THE CENTRAL FINDING THIS FILE ENCODES: `regulation.ts`'s schema cannot
 * hold the regulation content model.
 *
 * `content/activity/regulations/types.ts` describes a deeply nested,
 * bilingual, numbered legal-text tree: `RegulationDoc` -> `Section[]`
 * (arbitrarily nested via `.children`, e.g. Title -> Chapter -> Division) ->
 * `Provision[]` (each with its own `num`, a citation-bearing integer) ->
 * either the simple shape (`lead`/`definitions`/`items`/`tail`) or the
 * ordered `body: Block[]` shape, where a `Block` is `para` | `list` |
 * `definitions`, and a `list`'s `ProvisionItem[]` carry an explicit `marker`
 * ("(1)", "A.") plus optional `note` and arbitrarily nested `children`.
 *
 * `sanity/schemaTypes/documents/regulation.ts` has exactly one content
 * field, `body: portableText`, and `portableText.ts`'s own comment confirms
 * it is deliberately restricted: four block styles (normal, h2, h3,
 * blockquote — no h1, no h4/h5/h6), two list styles (ul/ol, which render
 * with a renderer-generated marker, not the source's literal one), a table,
 * and three inline marks. Critically, `portableText` is SINGLE-LOCALE: one
 * flat array, not `{ en, th }` the way `localizedString`/`localizedText`
 * are (confirmed against `tests/unit/sanity-schema-editorial.test.ts`,
 * which never exercises `portableText` as bilingual). A `rich-text` section
 * built from it cannot carry both language versions of a paragraph in one
 * document, and `regulation.body` gives a whole document exactly one such
 * field for its entire bilingual legal text.
 *
 * Squeezing `Section`/`Provision`/`ProvisionItem`/`Definition` into that
 * field is not a shape mismatch that a clever mapping papers over: it would
 * mean either (a) collapsing Title/Chapter/Division into two available
 * heading levels, which makes a Division heading typographically
 * indistinguishable from its parent Chapter — the exact "losing the nesting
 * of a clause changes what the rule says" the brief warns against — or
 * (b) discarding the bilingual split entirely and picking one language, or
 * (c) both. `docs/migration/modules.md` and this wave's report lay out why
 * each of those is a real loss for legal text, not a cosmetic one. Per the
 * brief ("do not flatten the structure to make it fit, and do not edit the
 * schema"), this file does NOT attempt it. `transformRegulationDocument`
 * below emits only the front-matter fields that have an honest, faithful
 * home in the schema (`title`, `slug`, a derived `effectiveDate`) and
 * reports everything else — the entire section/provision tree, plus
 * `citation`/`authority`/`preamble`/`signatory`, plus `lifecycle.owner` — as
 * gaps. See this file's report for the full accounting.
 */

import type {
  Bi,
  Block,
  Provision,
  ProvisionItem,
  RegulationDoc,
  Section,
} from "@/content/activity/regulations/types";
import type { CalendarEvent } from "@/content/calendar/events";
import type { CommitteeMember } from "@/content/committee";
import type { Portfolio, PortfolioId } from "@/lib/portfolios";
import type { QuickGroup } from "@/content/quick";

// ---------------------------------------------------------------------------
// Shared vocabulary
// ---------------------------------------------------------------------------

/**
 * A field or structure this migration could not populate, and why. Never
 * thrown, never silently dropped: every `TransformResult` carries its own
 * gaps, and `scripts/migrate-modules.mjs` folds every function's gaps into
 * the one diff report the shared brief requires.
 */
export type Gap = {
  /** What this gap is about, e.g. "regulation:university-2563" or "committeeMember:chayapon-srisukho". */
  scope: string;
  /** The field or structure with no home, e.g. "sections (the whole provision tree)". */
  field: string;
  /** Why it was not filled in, never invented. */
  reason: string;
};

export type TransformResult<T> = {
  document: T | null;
  gaps: Gap[];
};

/** A stable id deriver, injected by the caller (see this file's header). Called with
 * ordered, already-stable parts (a type discriminator, then a slug or key); the
 * implementation owns how those become a real Sanity `_id`. */
export type IdFor = (parts: string[]) => string;

type LocalizedStringValue = { en: string; th: string };
type SlugValue = { _type: "slug"; current: string };
type ReferenceValue = { _type: "reference"; _ref: string };

function bi(value: Bi): LocalizedStringValue {
  return { en: value.en, th: value.th };
}

function slug(current: string): SlugValue {
  return { _type: "slug", current };
}

function ref(id: string): ReferenceValue {
  return { _type: "reference", _ref: id };
}

// ---------------------------------------------------------------------------
// Regulations (content/activity/regulations/** -> `regulation`)
// ---------------------------------------------------------------------------

export type RegulationNdjsonDoc = {
  _id: string;
  _type: "regulation";
  title: LocalizedStringValue;
  slug: SlugValue;
  effectiveDate?: string;
};

const THAI_MONTHS: Record<string, number> = {
  มกราคม: 1,
  กุมภาพันธ์: 2,
  มีนาคม: 3,
  เมษายน: 4,
  พฤษภาคม: 5,
  มิถุนายน: 6,
  กรกฎาคม: 7,
  สิงหาคม: 8,
  กันยายน: 9,
  ตุลาคม: 10,
  พฤศจิกายน: 11,
  ธันวาคม: 12,
};

/**
 * Extracts an ISO `YYYY-MM-DD` effective date from a `made.th` string of the
 * form "ประกาศ ณ วันที่ <day> <Thai month> พ.ศ./พุทธศักราช <BE year>".
 *
 * This is EXTRACTION, not invention: the date is already present, verbatim,
 * in the source Thai text (`docs/EDITING.md`'s "never fill a gap" rule is
 * about content that is absent, not about reformatting a fact that is
 * there). The transform is a pure, deterministic regex match plus the fixed
 * Buddhist-to-Gregorian offset (BE year minus 543 is CE year; this holds for
 * any Thai calendar date, since the Thai New Year historically fell in
 * April, well clear of the 1 January where a naive year-only subtraction
 * could be one year off). It returns `null`, never a guess, when the string
 * does not match this exact pattern, so a differently-worded front matter
 * (a future regulation might not use "ประกาศ ณ วันที่" at all) surfaces as a
 * reported gap rather than a silently wrong date.
 */
export function parseThaiAnnouncementDate(th: string): string | null {
  const match =
    /ประกาศ\s*ณ\s*วันที่\s*(\d{1,2})\s*([ก-๙]+)\s*(?:พ\.?\s*ศ\.?|พุทธศักราช)\s*(\d{4})/u.exec(th);
  if (!match) return null;
  const [, dayStr, monthName, beYearStr] = match;
  const day = Number(dayStr);
  const month = THAI_MONTHS[monthName ?? ""];
  const beYear = Number(beYearStr);
  if (!month || !Number.isFinite(day) || day < 1 || day > 31 || !Number.isFinite(beYear)) {
    return null;
  }
  const ceYear = beYear - 543;
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  // A cheap validity check (no 31 April, no 30 February): construct the date
  // and read the parts back rather than trusting the regex's ranges alone.
  const probe = new Date(Date.UTC(ceYear, month - 1, day));
  if (
    probe.getUTCFullYear() !== ceYear ||
    probe.getUTCMonth() !== month - 1 ||
    probe.getUTCDate() !== day
  ) {
    return null;
  }
  return `${ceYear}-${mm}-${dd}`;
}

/** Recursively counts the section groups, provisions and provision items in a
 * document's tree, for the diff report's scale accounting (not a schema
 * transform: this never leaves the report). */
export function countRegulationStructure(doc: RegulationDoc): {
  sectionGroups: number;
  provisions: number;
  provisionItems: number;
} {
  let sectionGroups = 0;
  let provisions = 0;
  let provisionItems = 0;

  function countItems(items: ProvisionItem[]): number {
    let n = 0;
    for (const item of items) {
      n += 1;
      if (item.children) n += countItems(item.children);
    }
    return n;
  }

  function countBlocks(blocks: Block[]): void {
    for (const block of blocks) {
      if (block.kind === "list") provisionItems += countItems(block.items);
      if (block.kind === "definitions") provisionItems += block.entries.length;
    }
  }

  function walkProvision(p: Provision): void {
    provisions += 1;
    if (p.items) provisionItems += countItems(p.items);
    if (p.definitions) provisionItems += p.definitions.length;
    if (p.body) countBlocks(p.body);
  }

  function walkSections(sections: Section[]): void {
    for (const s of sections) {
      sectionGroups += 1;
      if (s.provisions) s.provisions.forEach(walkProvision);
      if (s.children) walkSections(s.children);
    }
  }

  walkSections(doc.sections);
  return { sectionGroups, provisions, provisionItems };
}

/**
 * Emits the front-matter-only stub `regulation.ts`'s schema can actually
 * hold, and reports everything else. See this file's header for why the
 * section/provision tree is not attempted here.
 */
export function transformRegulationDocument(
  doc: RegulationDoc,
  idFor: IdFor
): TransformResult<RegulationNdjsonDoc> {
  const scope = `regulation:${doc.slug}`;
  const gaps: Gap[] = [];

  const document: RegulationNdjsonDoc = {
    _id: idFor(["regulation", doc.slug]),
    _type: "regulation",
    title: bi(doc.shortTitle),
    slug: slug(doc.slug),
  };

  const effectiveDate = parseThaiAnnouncementDate(doc.made.th);
  if (effectiveDate) {
    document.effectiveDate = effectiveDate;
  } else {
    gaps.push({
      scope,
      field: "effectiveDate",
      reason:
        `Required by the schema, but the source has no structured date, only the prose ` +
        `"made" line ("${doc.made.th}"), which did not match the expected ` +
        `"ประกาศ ณ วันที่ <day> <month> พ.ศ./พุทธศักราช <year>" pattern. Not guessed.`,
    });
  }

  gaps.push({
    scope,
    field: "citation, authority, preamble, signatory",
    reason:
      "RegulationMeta carries all four (the full citation, the issuing authority, the " +
      "recital preamble, and the signatory block). regulation.ts's schema has no field for " +
      "any of them: its only fields are title, slug, body, effectiveDate, supersedes and " +
      "lifecycle.",
  });

  const { sectionGroups, provisions, provisionItems } = countRegulationStructure(doc);
  gaps.push({
    scope,
    field: "sections (the whole provision tree)",
    reason:
      `${sectionGroups} section group(s), ${provisions} provision(s) and ${provisionItems} ` +
      `provision item(s)/definition(s), bilingual, with legally significant numbering, ` +
      `explicit item markers and clause nesting. regulation.ts's only content field is a ` +
      `single-locale portableText array (h2/h3 only, renderer-numbered lists). Flattening ` +
      `this tree into it would either collapse the Title/Chapter/Division hierarchy into two ` +
      `heading levels, or drop one language, or both — exactly the loss the brief forbids. ` +
      `Not migrated; the 1.0 route keeps rendering this content from the TypeScript module.`,
  });

  gaps.push({
    scope,
    field: "lifecycle.owner",
    reason:
      "Required on every document, but which BIRSA portfolio owns a regulation is a " +
      "governance decision this migration has no source data for (unlike a committee " +
      "member's portfolio, which is derivable from lib/portfolios.ts's heldBy list, a " +
      "regulation names no owning portfolio anywhere in its own data). An officer or " +
      "developer must set this before the stub can leave draft.",
  });

  return { document, gaps };
}

// ---------------------------------------------------------------------------
// Calendar (content/calendar/events.ts) — assessment only, no documents.
//
// A `CalendarEvent` is a date marker for the front-page widget that POINTS
// at a news/event post by `slug`; it is not itself the event's content
// (summary, category, location, body all live in the MDX post, which is
// Wave 6A's family, not this one). Several markers share one slug (e.g.
// four different August dates all click through to
// "august-2026-activity-calendar"), which the `event` schema's one
// start/end per document cannot represent even if the missing fields were
// available. See this file's report for the full reasoning; this function
// only classifies each entry for the diff report.
// ---------------------------------------------------------------------------

export type CalendarAssessment = {
  id: string;
  outcome: "points-to-migrated-content" | "orphan-no-content";
  matchedSlug: string;
};

/** `existingContentSlugs` is the set of `content/news/{en,th}/*.mdx` filenames
 * (without extension) already present, i.e. the slugs Wave 6A's family owns. */
export function assessCalendarEvents(
  events: CalendarEvent[],
  existingContentSlugs: ReadonlySet<string>
): CalendarAssessment[] {
  return events
    .map((event) => ({
      id: event.id,
      matchedSlug: event.slug,
      outcome: (existingContentSlugs.has(event.slug)
        ? "points-to-migrated-content"
        : "orphan-no-content") as CalendarAssessment["outcome"],
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

// ---------------------------------------------------------------------------
// Committee (content/committee.ts -> `committeeMember`, and
// lib/portfolios.ts -> `portfolio` where committee.ts supplies the holders)
// ---------------------------------------------------------------------------

export type CommitteeMemberNdjsonDoc = {
  _id: string;
  _type: "committeeMember";
  slug: SlugValue;
  firstName: LocalizedStringValue;
  lastName: LocalizedStringValue;
  nickname: LocalizedStringValue;
  role: LocalizedStringValue;
  group: "officer" | "assistant";
  portfolio?: ReferenceValue;
  lifecycle: {
    status: "draft";
    owner?: PortfolioId;
  };
};

/**
 * Finds the one portfolio whose `heldBy` list names this exact English role
 * title (`docs/CMS-SCHEMA-CONVENTIONS.md`'s "do not invent a portfolio":
 * this matches against the frozen `lib/portfolios.ts` list, it never
 * constructs one). Returns `null`, and lets the caller report a gap, if no
 * portfolio names the title or if — which should not happen against the
 * frozen list, but is not assumed — more than one does.
 */
export function findPortfolioForRole(
  titleEn: string,
  portfolios: readonly Portfolio[]
): PortfolioId | null {
  const matches = portfolios.filter((p) => p.heldBy.includes(titleEn));
  if (matches.length !== 1) return null;
  return matches[0]!.id;
}

export function transformCommitteeMember(
  member: CommitteeMember,
  portfolios: readonly Portfolio[],
  migratedPortfolioIds: ReadonlySet<PortfolioId>,
  idFor: IdFor
): TransformResult<CommitteeMemberNdjsonDoc> {
  const scope = `committeeMember:${member.key}`;
  const gaps: Gap[] = [];

  const portfolioId = findPortfolioForRole(member.en.title, portfolios);
  if (!portfolioId) {
    gaps.push({
      scope,
      field: "portfolio",
      reason:
        `No portfolio in lib/portfolios.ts names the exact role title "${member.en.title}" ` +
        `in its heldBy list (or more than one does, which would itself be a ` +
        `lib/portfolios.ts data error). Required by the schema; not guessed.`,
    });
  } else if (!migratedPortfolioIds.has(portfolioId)) {
    // The role title resolves to a real portfolio id, but that portfolio's
    // OWN document was not migrated (see transformPortfolios: fewer than two
    // current holders, so it cannot satisfy the schema's required
    // secondHolder). Setting a reference to an id that will not exist in the
    // artifact would be a dangling reference the verify script must catch;
    // omitting it here, with a gap that names the same root cause, is the
    // honest alternative.
    gaps.push({
      scope,
      field: "portfolio",
      reason:
        `Resolves to portfolio "${portfolioId}", but that portfolio was not migrated (see ` +
        `portfolio:${portfolioId}'s own gap: fewer than two current holders). Reference ` +
        `omitted rather than pointing at a document this artifact does not contain.`,
    });
  }
  const portfolioRefId = portfolioId && migratedPortfolioIds.has(portfolioId) ? portfolioId : null;

  gaps.push({
    scope,
    field: "portrait, roleEmail",
    reason:
      "Both optional. `portrait` needs an uploaded image asset (this migration has no " +
      "write token and does not touch binary assets — see the shared brief); the header " +
      "comment on content/committee.ts names the expected file at " +
      "public/committee/<key>.*, so a follow-up asset-upload pass has what it needs. " +
      "`roleEmail` has no source: committee.ts carries no email field at all, by the file's " +
      "own guard (tests/unit/content.test.ts), so none is invented here either.",
  });

  const document: CommitteeMemberNdjsonDoc = {
    _id: idFor(["committee-member", member.key]),
    _type: "committeeMember",
    slug: slug(member.key),
    firstName: { en: member.en.firstName, th: member.th.firstName },
    lastName: { en: member.en.lastName, th: member.th.lastName },
    nickname: { en: member.en.nickname, th: member.th.nickname },
    role: { en: member.en.title, th: member.th.title },
    group: member.group,
    lifecycle: { status: "draft", owner: portfolioId ?? undefined },
  };
  if (portfolioRefId) document.portfolio = ref(idFor(["portfolio", portfolioRefId]));

  return { document, gaps };
}

export type PortfolioNdjsonDoc = {
  _id: string;
  _type: "portfolio";
  portfolioId: PortfolioId;
  holder: ReferenceValue;
  secondHolder: ReferenceValue;
  additionalHolders?: ReferenceValue[];
  lifecycle: { status: "draft"; owner: PortfolioId };
};

/**
 * Builds one `portfolio` document per entry in the frozen `lib/portfolios.ts`
 * list, with `holder`/`secondHolder`/`additionalHolders` resolved against
 * `content/committee.ts` by exact role-title match against `heldBy`, in
 * `committee`'s own array order (BIRSA's supplied ordering, per that file's
 * header) so the output is deterministic without inventing a tie-break rule.
 *
 * A portfolio whose `heldBy` titles match fewer than two real committee
 * members cannot satisfy the schema's required `secondHolder` (§7.2's two
 * person rule) — see this file's report for which of the thirteen
 * portfolios that is true for today, an operational fact this migration
 * surfaces rather than papers over with an invented second holder.
 */
export function transformPortfolios(
  portfolios: readonly Portfolio[],
  committee: readonly CommitteeMember[],
  idFor: IdFor
): { documents: PortfolioNdjsonDoc[]; gaps: Gap[] } {
  const documents: PortfolioNdjsonDoc[] = [];
  const gaps: Gap[] = [];

  for (const portfolio of portfolios) {
    const scope = `portfolio:${portfolio.id}`;
    const holders: CommitteeMember[] = [];
    for (const title of portfolio.heldBy) {
      for (const member of committee) {
        if (member.en.title === title) holders.push(member);
      }
    }

    if (holders.length < 2) {
      gaps.push({
        scope,
        field: "holder, secondHolder",
        reason:
          `§7.2's two person rule requires a second holder, but content/committee.ts's ` +
          `current roster has only ${holders.length} member(s) whose role title matches ` +
          `this portfolio's heldBy list (${JSON.stringify(portfolio.heldBy)}). This is an ` +
          `operational fact about the real 2026 committee, not a migration bug: BIRSA's ` +
          `current roster does not satisfy the two-person rule for this portfolio. Not ` +
          `migrated; inventing a second holder was not an option.`,
      });
      continue;
    }

    const [holder, secondHolder, ...rest] = holders;
    const document: PortfolioNdjsonDoc = {
      _id: idFor(["portfolio", portfolio.id]),
      _type: "portfolio",
      portfolioId: portfolio.id,
      holder: ref(idFor(["committee-member", holder!.key])),
      secondHolder: ref(idFor(["committee-member", secondHolder!.key])),
      lifecycle: { status: "draft", owner: portfolio.id },
    };
    if (rest.length > 0) {
      document.additionalHolders = rest.map((m) => ref(idFor(["committee-member", m.key])));
    }
    documents.push(document);
  }

  return { documents, gaps };
}

// ---------------------------------------------------------------------------
// Site settings (content/site.ts -> `siteSettings` singleton)
// ---------------------------------------------------------------------------

export type SiteContact = {
  address: Record<"en" | "th", string>;
  phone: string;
  email: string;
  secondaryEmail: string;
};

export type SiteSettingsNdjsonDoc = {
  _id: "siteSettings";
  _type: "siteSettings";
  contact: {
    email: string;
    secondaryEmail?: string;
    phone?: string;
    address?: LocalizedStringValue;
  };
};

/**
 * `siteSettings` is a fixed-id singleton (`sanity/structure/index.ts` pins
 * it to `"siteSettings"`), so this returns exactly one document, never an
 * array, and never invents an `idFor` call for it: the id is not derived
 * from content, it is a structural constant every other family's tooling
 * must also treat as fixed.
 */
export function transformSiteSettings(
  contact: SiteContact
): TransformResult<SiteSettingsNdjsonDoc> {
  const scope = "siteSettings";
  const gaps: Gap[] = [];

  gaps.push({
    scope,
    field: "socials (instagram, facebook, email, line)",
    reason:
      "content/site.ts's `socials` array (with each channel's href and a placeholder flag " +
      "for LINE) has no field anywhere in siteSettings.ts. Not migrated.",
  });
  gaps.push({
    scope,
    field: "officialLinks (birProgram, faculty, registrar, university)",
    reason:
      "These are external URLs (https://polsci.tu.ac.th, etc.). siteSettings.ts has no " +
      "field for them, and navigation.ts's navLink type could not hold them either even if " +
      'it were the right place: navLink.href is validated to start with "/", i.e. internal ' +
      "paths only (sanity/schemaTypes/documents/navigation.ts). Not migrated.",
  });
  gaps.push({
    scope,
    field: "lifecycle.owner",
    reason:
      "Required by the schema. content/site.ts names no owning portfolio for this " +
      "configuration (it predates the portfolio/ownership model entirely); an officer or " +
      "developer must choose one before this document can leave draft.",
  });

  const document: SiteSettingsNdjsonDoc = {
    _id: "siteSettings",
    _type: "siteSettings",
    contact: {
      email: contact.email,
      secondaryEmail: contact.secondaryEmail || undefined,
      phone: contact.phone || undefined,
      address: contact.address ? { en: contact.address.en, th: contact.address.th } : undefined,
    },
  };

  return { document, gaps };
}

// ---------------------------------------------------------------------------
// Quick links (content/quick.ts) — assessment only, no document.
//
// The brief asks which of `navigation` or `siteSettings` this belongs to.
// Neither does, and the reasoning is field-level, not a preference:
//
//   navigation.navLink = { href, label }. quick.ts's QuickItem carries an
//   `icon` (18-value enum) and an optional `hint`, neither of which navLink
//   has a field for, and roughly a third of QuickItems have an external
//   `href` (Instagram, Facebook, the BIR Programme site) while navLink's
//   `href` is validated to REQUIRE an internal path starting with "/"
//   (sanity/schemaTypes/documents/navigation.ts) — those entries could not
//   even be attempted, not just trimmed of extra fields. `navigation` is
//   also the sitewide primary menu and footer, a different information
//   architecture role than this "link in bio" page entirely.
//
//   siteSettings has no field of this shape at all (nothing resembling a
//   grouped, iconed link list — the closest candidates, contactRouting and
//   featureFlags, are both a different shape for a different purpose).
//
//   `page` + the section palette's `related-links` section was also
//   considered (its `relatedLinkItem` has title + optional localizedText
//   description, which `label`/`hint` would map onto, and its link target
//   DOES allow an external href). It still fails on the majority of items:
//   most QuickItems point at an internal PATH ("/services/equipment-loan",
//   "/student-life/getting-started"), and `related-links`'s internal case
//   is a Sanity document REFERENCE, not a path string — resolving a path to
//   a document id needs the route registry navigation.ts's own header
//   already names as a known, unbuilt gap ("checking a target against the
//   real set of published documents and served routes needs a live query
//   against both the dataset and the route table, neither of which this
//   schema can reach offline"). This migration cannot resolve what that
//   schema comment says no wave has built yet.
// ---------------------------------------------------------------------------

export function assessQuickLinks(groups: readonly QuickGroup[]): Gap[] {
  const gaps: Gap[] = [];
  for (const group of groups) {
    for (const item of group.items) {
      gaps.push({
        scope: `quick:${group.key}/${item.key}`,
        field: "(whole item)",
        reason: item.external
          ? "External href; no schema field on any candidate type (navigation.navLink " +
            "requires an internal path; see this file's header for the full reasoning)."
          : "Internal path with no document to reference (no route registry exists yet to " +
            "resolve it); no schema field can hold it as-is.",
      });
    }
  }
  return gaps;
}

// ---------------------------------------------------------------------------
// Reporting channels (content/reporting.ts) — assessment only.
// ---------------------------------------------------------------------------

/** Always returns exactly one gap: `content/reporting.ts` is genuine content
 * (the two harassment-reporting channels), but it is neither a
 * `serviceDefinition` (no start page, no question flow — it is two static
 * contact cards) nor a `siteSettings.contactRoute` (a contactRoute is a
 * category routed to one of BIRSA's own portfolios; one of the two
 * reporting channels here is an external body, the BIR Programme office,
 * and both carry a named person, phone, extension and email a contactRoute
 * has no fields for). No document type in the current schema fits. */
export function assessReporting(): Gap[] {
  return [
    {
      scope: "reporting",
      field: "reportingChannels, reportingCopy (whole module)",
      reason:
        "Two named contact channels (organisation, person, phone, phone href, optional " +
        "extension, email) plus their surrounding copy. Not a serviceDefinition (no start " +
        "page or question flow) and not siteSettings.contactRoute (that type routes a " +
        "category to a BIRSA portfolio id; one channel here, the BIR Programme office, is " +
        "not a BIRSA portfolio at all, and neither channel's shape — organisation/person/" +
        "phone/extension/email — has a home in contactRoute's two fields). No document type " +
        "in the current schema fits. Not service configuration either: it is read-facing " +
        "safety content, just content with nowhere to go yet.",
    },
  ];
}
