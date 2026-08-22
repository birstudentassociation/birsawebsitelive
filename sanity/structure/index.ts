/**
 * PLACEHOLDER. Owned by Wave 3B, 3C, 3D and 3E (docs/BUILD-BRIEF-2.0.md §5,
 * docs/CMS-SCHEMA-CONVENTIONS.md), not Wave 3A.
 *
 * Wave 3A (the Studio mount, `sanity.config.ts`) needs this file to exist
 * and export a `StructureResolver` so the Studio can boot, but does not own
 * the real desk structure. REDESIGN-2.0 §6.4 asks for one top-level entry
 * per portfolio, shaped around what each officer actually does, in place of
 * the default flat list of document types; that is real editorial design
 * work for the schema waves, not a decision Wave 3A can make on their
 * behalf. This placeholder falls back to Sanity's own default document type
 * list so the Studio has something to show in the meantime.
 */
import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("BIRSA")
    .items(S.documentTypeListItems());
