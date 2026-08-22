/**
 * The Studio desk structure (REDESIGN-2.0 §6.4).
 *
 * "Officers should never see a list of document types. They should see
 * their job... Structure Builder gives each portfolio its own top-level
 * entry, containing exactly what that portfolio owns, in the order they
 * use it." This file is that structure.
 *
 * HOW "OWNS" IS COMPUTED, RATHER THAN GUESSED. Every content document type
 * this wave did not itself write (Wave 3B, 3C) carries `lifecycle.owner`
 * (`sanity/schemaTypes/objects/lifecycle.ts`, frozen to this wave): "the
 * portfolio that owns this document... so the review queue and handover
 * pack can show what a portfolio holds." A portfolio's branch below is a
 * live GROQ filter against that field, `_type == "<type>" && lifecycle.owner
 * == $portfolioId`, for every lifecycle-bearing document type. This wave
 * does not hardcode "the Treasurer's branch shows budget entries": it would
 * have to invent that assignment, and REDESIGN-2.0 §6.4's own worked
 * example (Treasurer sees Budget, Spokesperson sees Statements) is
 * illustrative prose, not a schema this wave owns. Filtering by the field
 * every document already carries means the structure is correct for
 * whatever an officer actually sets as `lifecycle.owner`, not for what an
 * agent guessed BIRSA's committee does, and it cannot drift from the
 * review queue and handover pack, which read the same field.
 *
 * `serviceDefinition` (§6.7) has no `lifecycle` (see that file's own
 * header for why) but carries `owner` and `secondHolder` directly, the same
 * two fields §7.1 and §7.2 already require: a service's branch entry
 * filters on `owner == $portfolioId || secondHolder == $portfolioId`, so
 * both the owning portfolio and the second holder (who genuinely shares
 * responsibility, §7.2) see it. `portfolio` (Wave 3C's document recording
 * who currently holds a portfolio) is filtered on its own `portfolioId`
 * field instead of `lifecycle.owner`, because "which portfolio is this
 * document ABOUT" is the more useful question for that one type than
 * "which portfolio maintains this record" (ordinarily the same answer,
 * secretariat, for every row, which would make the filter a no-op).
 *
 * SINGLETONS APPEAR ONCE (§6.6), NOT AS A LIST YOU CAN ADD A SECOND OF.
 * `siteSettings` and `navigation` are each pinned to one fixed document id
 * via `S.document().documentId(...)`, a single-document editor pane, never
 * `S.documentTypeList(...)` or `S.documentTypeListItems()`, which is the
 * Studio's own "create new" affordance. There is deliberately no path
 * anywhere in this file that lets an officer create a second `siteSettings`
 * or `navigation` document; `tests/unit/sanity-schema-config.test.ts`
 * checks both that these two ids resolve to a single-document pane and that
 * this file's own source never calls `documentTypeListItems`, which is the
 * one call that would reintroduce a create action for every type at once,
 * singletons included.
 *
 * THE IN-STUDIO GUIDE (§6.4: "a set of guide documents, visible in the
 * Studio, covering the ten things officers actually do") is the one
 * document type deliberately NOT portfolio filtered below. A guide written
 * by one portfolio is meant to be found by every officer, not hidden inside
 * the writing portfolio's own branch, so it gets its own top level entry
 * next to the singletons.
 */
import type { StructureResolver } from "sanity/structure";

import { portfolios, type PortfolioId } from "@/lib/portfolios";

/** A document type whose ownership is `lifecycle.owner` (every content type but `serviceDefinition`, which has its own two owning fields, and `portfolio`, whose more useful filter is its own `portfolioId`). */
const LIFECYCLE_OWNED_TYPES: Array<{ type: string; title: string }> = [
  { type: "newsArticle", title: "ข่าว / News" },
  { type: "event", title: "กิจกรรม / Events" },
  { type: "page", title: "หน้าเว็บ / Pages" },
  { type: "club", title: "ชมรม / Clubs" },
  { type: "committeeMember", title: "สมาชิกคณะกรรมการ / Committee members" },
  { type: "minutes", title: "รายงานการประชุม / Minutes" },
  { type: "decision", title: "มติคณะกรรมการ / Decisions" },
  { type: "budgetEntry", title: "รายการงบประมาณ / Budget entries" },
  { type: "regulation", title: "ระเบียบข้อบังคับ / Regulations" },
];

/** One portfolio branch item: a document list, filtered to this portfolio, wrapped as the `ListItemBuilder` a parent `S.list().items([...])` needs (`S.documentList()` alone is not a list item). */
function scopedListItem(
  S: Parameters<StructureResolver>[0],
  options: {
    id: string;
    title: string;
    schemaType: string;
    filter: string;
    params: Record<string, string>;
  }
) {
  return S.listItem()
    .id(options.id)
    .title(options.title)
    .schemaType(options.schemaType)
    .child(
      S.documentList()
        .title(options.title)
        .schemaType(options.schemaType)
        .filter(options.filter)
        .params(options.params)
    );
}

function portfolioBranch(
  S: Parameters<StructureResolver>[0],
  portfolio: { id: PortfolioId; label: { th: string; en: string } }
) {
  const items = [
    scopedListItem(S, {
      id: `${portfolio.id}-serviceDefinition`,
      title: "บริการ / Services",
      schemaType: "serviceDefinition",
      filter: '_type == "serviceDefinition" && (owner == $pid || secondHolder == $pid)',
      params: { pid: portfolio.id },
    }),
    scopedListItem(S, {
      id: `${portfolio.id}-portfolio`,
      title: "ข้อมูลฝ่ายงาน / Portfolio record",
      schemaType: "portfolio",
      filter: '_type == "portfolio" && portfolioId == $pid',
      params: { pid: portfolio.id },
    }),
    ...LIFECYCLE_OWNED_TYPES.map(({ type, title }) =>
      scopedListItem(S, {
        id: `${portfolio.id}-${type}`,
        title,
        schemaType: type,
        filter: `_type == "${type}" && lifecycle.owner == $pid`,
        params: { pid: portfolio.id },
      })
    ),
  ];

  return S.listItem()
    .id(`portfolio-${portfolio.id}`)
    .title(`${portfolio.label.th} / ${portfolio.label.en}`)
    .child(S.list().title(`${portfolio.label.th} / ${portfolio.label.en}`).items(items));
}

/** A singleton: exactly one document, at a fixed id, no create action, no list. */
function singleton(
  S: Parameters<StructureResolver>[0],
  id: string,
  schemaType: string,
  title: string
) {
  return S.listItem()
    .id(id)
    .title(title)
    .schemaType(schemaType)
    .child(S.document().schemaType(schemaType).documentId(id));
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("BIRSA")
    .items([
      singleton(S, "siteSettings", "siteSettings", "ตั้งค่าเว็บไซต์ / Site settings"),
      singleton(S, "navigation", "navigation", "เมนูนำทาง / Navigation"),
      S.listItem()
        .id("guide")
        .title("คู่มือการใช้งาน Studio / Studio guides")
        .schemaType("guide")
        .child(S.documentTypeList("guide").title("คู่มือการใช้งาน Studio / Studio guides")),
      S.divider(),
      ...portfolios.map((portfolio) => portfolioBranch(S, portfolio)),
    ]);
