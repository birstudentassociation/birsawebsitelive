/**
 * PLACEHOLDER. Owned by Wave 3B, 3C, 3D and 3E (docs/BUILD-BRIEF-2.0.md §5,
 * docs/CMS-SCHEMA-CONVENTIONS.md §1), not Wave 3A.
 *
 * Wave 3A (the Studio mount, `sanity.config.ts`) needs this file to exist
 * and to export a schema array so the Studio can boot, but does not own its
 * contents. This file was empty when Wave 3A started (no `sanity/`
 * directory existed at all); it exports nothing but an empty array so the
 * four schema waves start from a clean, uncontested file rather than one
 * seeded with a guess at what belongs in it.
 *
 * Real schema goes in `sanity/schemaTypes/<domain>.ts`, one file per
 * domain, composed here. Do not add a document type directly to this file.
 */
import type { SchemaTypeDefinition } from "sanity";

export const schemaTypes: SchemaTypeDefinition[] = [];
