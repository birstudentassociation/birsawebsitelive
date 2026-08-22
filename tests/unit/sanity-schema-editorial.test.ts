/**
 * Unit tests for the editorial content schema (REDESIGN-2.0 §4.6, §4.7C,
 * §6.3, §6.5, §6.10, `docs/CMS-SCHEMA-CONVENTIONS.md`), Wave 3B.
 *
 * These run entirely offline against the schema objects themselves. There is
 * no Sanity client, no Studio, no network. Where a validation needs a `Rule`
 * builder, `makeRuleRecorder` below stands in for the real one: it records
 * every call and captures every function passed to `.custom()`, so the
 * actual validator function that would run inside the Studio is exercised
 * directly, including the `undefined` case a required bilingual field has to
 * catch.
 *
 * Mirrors the pattern in `tests/unit/bds-sections.test.tsx`: the single most
 * important test in this file is the forbidden-fields check, run against the
 * REAL list in `sectionPalette.ts` rather than a copy of it.
 */
import { describe, expect, it } from "vitest";
import type { ObjectDefinition } from "sanity";

import {
  allowedBlocks,
  allowedMarks,
  forbiddenSchemaFields,
  sectionTypeIds,
} from "@/components/bds/sectionPalette";

import { localizedString } from "@/sanity/schemaTypes/objects/localizedString";
import { localizedText } from "@/sanity/schemaTypes/objects/localizedText";
import { portableText, portableTextInline } from "@/sanity/schemaTypes/objects/portableText";
import {
  sectionTypes,
  sectionTypeList,
  sectionsField,
} from "@/sanity/schemaTypes/objects/sectionTypes";
import { imageField } from "@/sanity/schemaTypes/objects/imageField";
import { lifecycle } from "@/sanity/schemaTypes/objects/lifecycle";

import { newsArticle } from "@/sanity/schemaTypes/documents/newsArticle";
import { event } from "@/sanity/schemaTypes/documents/event";
import { page } from "@/sanity/schemaTypes/documents/page";
import { guide } from "@/sanity/schemaTypes/documents/guide";
import { club } from "@/sanity/schemaTypes/documents/club";

// ---------------------------------------------------------------------------
// A stand-in `Rule` builder.
//
// Every method chains (returns the same recorder), `custom()` additionally
// captures the function it was given, in call order, and `calledMethods`
// lets a test assert `required()` was actually reached without caring what
// it returns (Sanity's real `Rule` object does the enforcing; here we only
// need to know the schema asked for it).
// ---------------------------------------------------------------------------

type AnyFn = (...args: unknown[]) => unknown;

function makeRuleRecorder() {
  const customFns: AnyFn[] = [];
  const calledMethods: string[] = [];
  const rule: Record<string, AnyFn> = {};
  const handler = (method: string): AnyFn => {
    return (...args: unknown[]) => {
      calledMethods.push(method);
      if (method === "custom") customFns.push(args[0] as AnyFn);
      return rule as unknown as AnyFn;
    };
  };
  for (const method of [
    "required",
    "custom",
    "warning",
    "error",
    "min",
    "max",
    "uri",
    "regex",
    "valueOfField",
  ]) {
    rule[method] = handler(method);
  }
  return { rule, customFns, calledMethods };
}

/** Runs a field's `validation` builder and returns every `.custom()` function it registered, in order. */
function customValidatorsOf(field: { validation?: unknown }): AnyFn[] {
  const { rule, customFns } = makeRuleRecorder();
  const validationFn = field.validation as ((r: unknown) => unknown) | undefined;
  if (typeof validationFn === "function") validationFn(rule);
  return customFns;
}

/** True if a field's `validation` builder reaches `.required()`. */
function isRequired(field: { validation?: unknown }): boolean {
  const { rule, calledMethods } = makeRuleRecorder();
  const validationFn = field.validation as ((r: unknown) => unknown) | undefined;
  if (typeof validationFn === "function") validationFn(rule);
  return calledMethods.includes("required");
}

// ---------------------------------------------------------------------------
// Find-and-assert helpers.
//
// `noUncheckedIndexedAccess` (tsconfig) is on, so `arr[i]`, `.find(...)` and
// array destructuring all type as possibly `undefined`. That is correct: a
// lookup here CAN fail, if a schema field gets renamed or a validator stops
// registering a `.custom()` call, and a test that used the value anyway
// would fail several lines later with a bare "cannot read property of
// undefined" a reader has to reverse engineer. These three helpers do the
// lookup and the assertion in one call, so a failure names exactly what
// this test could not find and every caller gets a real, non optional
// value back.
// ---------------------------------------------------------------------------

/** Returns `arr[index]`, or throws naming what was expected there. */
function at<T>(arr: readonly T[], index: number, label: string): T {
  const value = arr[index];
  if (value === undefined) {
    throw new Error(`Expected ${label} at index ${index}, found ${arr.length} item(s)`);
  }
  return value;
}

/** Returns the first item matching `predicate`, or throws naming what was being looked for. */
function findOrThrow<T>(arr: readonly T[], predicate: (item: T) => boolean, label: string): T {
  const found = arr.find(predicate);
  if (found === undefined) {
    throw new Error(`Expected to find ${label}, found none among ${arr.length} item(s)`);
  }
  return found;
}

/** Same as `findOrThrow`, but for a type guard: the return value narrows to `S`. */
function findTypedOrThrow<S>(
  arr: readonly unknown[],
  predicate: (item: unknown) => item is S,
  label: string
): S {
  const found = arr.find(predicate);
  if (found === undefined) {
    throw new Error(`Expected to find ${label}, found none among ${arr.length} item(s)`);
  }
  return found;
}

/** Runs a field's validation builder and returns the `.custom()` validator at `index`, asserting it exists. */
function customValidatorAt(field: { validation?: unknown }, index: number, label: string): AnyFn {
  return at(customValidatorsOf(field), index, `custom validator on ${label}`);
}

function fieldByName(fields: unknown, name: string): Record<string, unknown> {
  const list = fields as Array<Record<string, unknown>>;
  return findOrThrow(list, (f) => f.name === name, `a field named "${name}"`);
}

// ---------------------------------------------------------------------------
// The forbidden-fields check. The most important test in this file: no
// schema field anywhere in the editorial content schema may be named for
// raw HTML, an embed, or a style escape hatch.
// ---------------------------------------------------------------------------

/** Recursively collects every `{ name, type }` field this schema tree declares. */
function collectFields(def: unknown): Array<{ name: string; type: string }> {
  const out: Array<{ name: string; type: string }> = [];
  if (!def || typeof def !== "object") return out;
  const record = def as Record<string, unknown>;

  if (Array.isArray(record.fields)) {
    for (const f of record.fields as Array<Record<string, unknown>>) {
      if (typeof f.name === "string") out.push({ name: f.name, type: String(f.type ?? "") });
      out.push(...collectFields(f));
    }
  }
  if (Array.isArray(record.of)) {
    for (const member of record.of as unknown[]) {
      out.push(...collectFields(member));
    }
  }
  return out;
}

const ALL_OWNED_TREES: Array<{ label: string; def: unknown }> = [
  { label: "localizedString", def: localizedString },
  { label: "localizedText", def: localizedText },
  { label: "portableText", def: portableText },
  { label: "portableTextInline", def: portableTextInline },
  { label: "imageField", def: imageField },
  { label: "lifecycle", def: lifecycle },
  { label: "newsArticle", def: newsArticle },
  { label: "event", def: event },
  { label: "page", def: page },
  { label: "guide", def: guide },
  { label: "club", def: club },
  ...sectionTypeIds.map((id) => ({ label: `section:${id}`, def: sectionTypes[id] })),
];

describe("no schema field anywhere in this cluster is named in sectionPalette.ts's forbiddenSchemaFields", () => {
  const forbidden = new Set<string>(forbiddenSchemaFields);

  it("forbiddenSchemaFields is the real, non-empty list from the frozen contract", () => {
    // Guards against a future refactor of sectionPalette.ts silently emptying
    // the list this test iterates and turning every case below into a no-op.
    expect(forbiddenSchemaFields.length).toBeGreaterThan(0);
    expect(forbiddenSchemaFields).toContain("html");
    expect(forbiddenSchemaFields).toContain("rawHtml");
    expect(forbiddenSchemaFields).toContain("customCss");
    expect(forbiddenSchemaFields).toContain("iframe");
  });

  it.each(ALL_OWNED_TREES.map((t) => [t.label, t.def] as const))(
    "%s declares no forbidden field name",
    (_label, def) => {
      const names = collectFields(def).map((f) => f.name);
      const offending = names.filter((n) => forbidden.has(n));
      expect(offending).toEqual([]);
    }
  );

  it('no field anywhere carries a raw "image" type outside imageField.ts\'s own asset field', () => {
    for (const { label, def } of ALL_OWNED_TREES) {
      if (label === "imageField") continue;
      const rawImages = collectFields(def).filter((f) => f.type === "image");
      expect(rawImages, label).toEqual([]);
    }
    // imageField.ts itself is allowed exactly one: the asset field the
    // contract's `hotspot`, `decorative` and `alt` fields surround.
    const own = collectFields(imageField).filter((f) => f.type === "image");
    expect(own.map((f) => f.name)).toEqual(["image"]);
  });
});

// ---------------------------------------------------------------------------
// Portable Text: exactly allowedMarks and allowedBlocks, and h1 refused.
//
// `portableText.of`'s real element type is Sanity's own generic array-member
// union, which this file has no reason to reproduce. `isBlockArrayMember`
// and `isTableArrayMember` below narrow it by checking the one discriminant
// field (`type`, plus `name` for the table) that actually distinguishes the
// members our own schema put there, the same way any code reading a Sanity
// schema definition at runtime would have to.
// ---------------------------------------------------------------------------

type StyleOrListOption = { title: string; value: string };

type BlockArrayMember = {
  type: "block";
  styles: StyleOrListOption[];
  lists: StyleOrListOption[];
  marks: {
    decorators: StyleOrListOption[];
    annotations: Array<{ name: string }>;
  };
  validation?: unknown;
};

function isBlockArrayMember(value: unknown): value is BlockArrayMember {
  return (
    typeof value === "object" && value !== null && (value as { type?: unknown }).type === "block"
  );
}

function isTableArrayMember(value: unknown): value is { type: "object"; name: "table" } {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { type?: unknown }).type === "object" &&
    (value as { name?: unknown }).name === "table"
  );
}

describe("portableText", () => {
  const blockMember = findTypedOrThrow(
    portableText.of,
    isBlockArrayMember,
    "portableText's block array member"
  );

  it("offers exactly the non-list, non-table styles from allowedBlocks, and never h1", () => {
    const styles = blockMember.styles.map((s) => s.value);
    const expected = allowedBlocks.filter((v) => v !== "ul" && v !== "ol" && v !== "table");
    expect([...styles].sort()).toEqual([...expected].sort());
    expect(styles).not.toContain("h1");
  });

  it("offers exactly the list styles from allowedBlocks", () => {
    const lists = blockMember.lists.map((l) => l.value);
    expect([...lists].sort()).toEqual(["ol", "ul"]);
  });

  it("offers exactly the decorator marks from allowedMarks, plus a link annotation, and nothing else", () => {
    const decorators = blockMember.marks.decorators.map((d) => d.value);
    const expected = allowedMarks.filter((m) => m !== "link");
    expect([...decorators].sort()).toEqual([...expected].sort());
    expect(blockMember.marks.annotations.map((a) => a.name)).toEqual(["link"]);
  });

  it("also allows a table array member, for allowedBlocks's table value", () => {
    expect(allowedBlocks).toContain("table");
    findTypedOrThrow(portableText.of, isTableArrayMember, "portableText's table array member");
  });

  const blockValidator = customValidatorAt(
    blockMember,
    0,
    "portableText block style rule (blocking)"
  );
  const blockWarning = customValidatorAt(blockMember, 1, "portableText block style rule (warning)");

  it("registers exactly one blocking validator and one warning validator on the block member", () => {
    expect(customValidatorsOf(blockMember)).toHaveLength(2);
  });

  it("the undefined case: neither validator complains about an absent block", () => {
    expect(blockValidator(undefined, {})).toBe(true);
    expect(blockWarning(undefined, {})).toBe(true);
  });

  it("refuses an h1 block, blocking publication, in both languages", () => {
    const h1Block = {
      _type: "block",
      _key: "a",
      style: "h1",
      children: [{ _type: "span", _key: "b", text: "Should not be allowed" }],
    };
    const result = blockValidator(h1Block, {});
    expect(result).not.toBe(true);
    expect(String(result)).toMatch(/หัวข้อระดับ 1/);
    expect(String(result)).toMatch(/h1/i);
  });

  it("passes a clean h2 heading", () => {
    const h2Block = {
      _type: "block",
      _key: "a",
      style: "h2",
      children: [{ _type: "span", _key: "b", text: "A welcome fair for new students" }],
    };
    expect(blockValidator(h2Block, {})).toBe(true);
  });

  it("blocks publication on an em dash, a house style rule that cannot be a false positive", () => {
    const block = {
      _type: "block",
      _key: "a",
      style: "normal",
      children: [{ _type: "span", _key: "b", text: "Bring your student card, and your ID." }],
    };
    // A genuine em dash is the trigger; write it explicitly so the fixture
    // is unambiguous about what it tests.
    const dashBlock = {
      ...block,
      children: [
        {
          _type: "span",
          _key: "b",
          text: `Bring your card${String.fromCharCode(8212)} it is required.`,
        },
      ],
    };
    expect(blockValidator(block, {})).toBe(true);
    expect(blockValidator(dashBlock, {})).not.toBe(true);
  });

  it("a table block (no style, no text children) never trips the h1 or house style checks", () => {
    const tableBlock = { _type: "table", _key: "c", rows: [] };
    expect(blockValidator(tableBlock, {})).toBe(true);
    expect(blockWarning(tableBlock, {})).toBe(true);
  });

  it("warns rather than blocks on heading case, which cannot tell a mistake from a proper noun", () => {
    // "Thammasat" is a known proper noun (skipped); "Week" is not, so it is
    // the one word that trips the sentence case hint.
    const heading = {
      _type: "block",
      _key: "a",
      style: "h2",
      children: [{ _type: "span", _key: "b", text: "Welcome Week at Thammasat" }],
    };
    expect(blockValidator(heading, {})).toBe(true);
    expect(blockWarning(heading, {})).not.toBe(true);
  });
});

describe("portableTextInline (inset-text)", () => {
  const inlineMember = findTypedOrThrow(
    portableTextInline.of,
    isBlockArrayMember,
    "portableTextInline's block array member"
  );

  it("carries only the plain paragraph style, no headings and no lists", () => {
    const styles = inlineMember.styles.map((s) => s.value);
    expect(styles).toEqual(["normal"]);
    expect(inlineMember.lists).toEqual([]);
  });

  it("carries no table member, unlike the full rich-text config", () => {
    expect(portableTextInline.of).toHaveLength(1);
  });

  it("still refuses house style violations through the same validator", () => {
    const validator = customValidatorAt(inlineMember, 0, "portableTextInline block style rule");
    const block = {
      _type: "block",
      _key: "a",
      style: "normal",
      children: [{ _type: "span", _key: "b", text: "For more information, click here." }],
    };
    expect(validator(block, {})).not.toBe(true);
  });
});

// ---------------------------------------------------------------------------
// sectionTypes: every id in sectionTypeIds, none missing, none extra.
// ---------------------------------------------------------------------------

describe("sectionTypes", () => {
  it("is keyed by exactly the ids in sectionPalette.ts's sectionTypeIds, none missing, none extra", () => {
    expect(Object.keys(sectionTypes).sort()).toEqual([...sectionTypeIds].sort());
  });

  it("each type's own Sanity name IS the section id, so the two cannot drift apart", () => {
    for (const id of sectionTypeIds) {
      expect((sectionTypes[id] as ObjectDefinition).name).toBe(id);
    }
  });

  it("sectionTypeList carries the same eleven, in the palette's order", () => {
    expect(sectionTypeList.map((t) => t.name)).toEqual([...sectionTypeIds]);
  });

  it("sectionsField() composes its array from exactly those eleven types", () => {
    const body = sectionsField("body");
    const of = body.of as Array<{ type: string }>;
    expect(of.map((m) => m.type).sort()).toEqual([...sectionTypeIds].sort());
  });

  it("sectionsField() refuses an empty body: at least one block is required", () => {
    const body = sectionsField("body");
    const { rule, calledMethods } = makeRuleRecorder();
    (body.validation as (r: unknown) => unknown)(rule);
    expect(calledMethods).toContain("min");
  });
});

// ---------------------------------------------------------------------------
// Every image field requires bilingual alt text and an explicit decorative
// flag (components/bds/imageContract.ts, frozen).
// ---------------------------------------------------------------------------

describe("imageField", () => {
  it("the decorative flag is required, with no initialValue, so an officer must choose it deliberately", () => {
    const decorative = fieldByName(imageField.fields, "decorative");
    expect(isRequired(decorative)).toBe(true);
    expect(decorative.initialValue).toBeUndefined();
  });

  it("the alt field's validator blocks publication with neither locale filled, on a non-decorative image", () => {
    const alt = fieldByName(imageField.fields, "alt");
    const validator = customValidatorAt(alt, 0, "imageField.alt");
    const context = {
      parent: { decorative: false, image: { asset: { _ref: "img-1" } }, ratio: "16:9" },
    };
    expect(validator(undefined, context)).not.toBe(true);
    expect(validator({ en: "", th: "" }, context)).not.toBe(true);
  });

  it("the alt field's validator blocks publication with only one locale filled", () => {
    const alt = fieldByName(imageField.fields, "alt");
    const validator = customValidatorAt(alt, 0, "imageField.alt");
    const context = {
      parent: { decorative: false, image: { asset: { _ref: "img-1" } }, ratio: "16:9" },
    };
    expect(validator({ en: "Students at the welcome fair", th: "" }, context)).not.toBe(true);
    expect(validator({ en: "", th: "นักศึกษาในงานต้อนรับ" }, context)).not.toBe(true);
  });

  it("the alt field's validator passes with both locales filled, on a non-decorative image", () => {
    const alt = fieldByName(imageField.fields, "alt");
    const validator = customValidatorAt(alt, 0, "imageField.alt");
    const context = {
      parent: { decorative: false, image: { asset: { _ref: "img-1" } }, ratio: "16:9" },
    };
    expect(
      validator({ en: "Students at the welcome fair", th: "นักศึกษาในงานต้อนรับ" }, context)
    ).toBe(true);
  });

  it("a decorative image passes with no alt text at all, and fails if alt text sneaks in anyway", () => {
    const alt = fieldByName(imageField.fields, "alt");
    const validator = customValidatorAt(alt, 0, "imageField.alt");
    const decorativeContext = {
      parent: { decorative: true, image: { asset: { _ref: "img-1" } }, ratio: "16:9" },
    };
    expect(validator(undefined, decorativeContext)).toBe(true);
    expect(validator({ en: "A photograph", th: "ภาพถ่าย" }, decorativeContext)).not.toBe(true);
  });

  it("the image asset field is required", () => {
    const imageAsset = fieldByName(imageField.fields, "image");
    expect(isRequired(imageAsset)).toBe(true);
  });

  it("hides alt and caption when the image is marked decorative", () => {
    const alt = fieldByName(imageField.fields, "alt");
    const caption = fieldByName(imageField.fields, "caption");
    const hiddenFn = (field: Record<string, unknown>) =>
      field.hidden as (opts: { parent: unknown }) => boolean;
    expect(hiddenFn(alt)({ parent: { decorative: true } })).toBe(true);
    expect(hiddenFn(alt)({ parent: { decorative: false } })).toBe(false);
    expect(hiddenFn(caption)({ parent: { decorative: true } })).toBe(true);
  });

  it("card-grid's optional image field is a full imageField, never a bare image type", () => {
    const cardGrid = sectionTypes["card-grid"];
    const cards = fieldByName(cardGrid.fields as unknown[], "cards");
    const cardItem = at(cards.of as Array<Record<string, unknown>>, 0, "card-grid's card item");
    const image = fieldByName(cardItem.fields, "image");
    expect(image.type).toBe("imageField");
  });
});

// ---------------------------------------------------------------------------
// A document with only one locale filled in FAILS validation. Exercised at
// the validator itself, the undefined case included, since that is exactly
// the case an empty required bilingual field has to catch.
// ---------------------------------------------------------------------------

describe("localizedString: bilingual parity is publish blocking, field by field", () => {
  const th = fieldByName(localizedString.fields, "th");
  const en = fieldByName(localizedString.fields, "en");
  const thValidator = customValidatorAt(th, 0, "th");
  const enValidator = customValidatorAt(en, 0, "en");

  it("fails when the value is undefined, the case an empty field actually arrives as", () => {
    expect(thValidator(undefined, {})).not.toBe(true);
    expect(enValidator(undefined, {})).not.toBe(true);
  });

  it("fails when the value is an empty or whitespace only string", () => {
    expect(thValidator("", {})).not.toBe(true);
    expect(thValidator("   ", {})).not.toBe(true);
  });

  it("passes when the value is filled in", () => {
    expect(thValidator("ยินดีต้อนรับ", {})).toBe(true);
    expect(enValidator("Welcome", {})).toBe(true);
  });

  it("each locale's error message names that locale, in both languages, so an officer knows which field to fix", () => {
    expect(String(thValidator(undefined, {}))).toMatch(/ภาษาไทย/);
    expect(String(thValidator(undefined, {}))).toMatch(/Thai/);
    expect(String(enValidator(undefined, {}))).toMatch(/ภาษาอังกฤษ/);
    expect(String(enValidator(undefined, {}))).toMatch(/English/);
  });
});

describe("localizedText: the same bilingual parity rule, for the paragraph field", () => {
  const th = fieldByName(localizedText.fields, "th");
  const en = fieldByName(localizedText.fields, "en");
  const thValidator = customValidatorAt(th, 0, "th");
  const enValidator = customValidatorAt(en, 0, "en");

  it("fails when undefined, empty, or one locale only, passes with both locales filled", () => {
    expect(thValidator(undefined, {})).not.toBe(true);
    expect(enValidator("", {})).not.toBe(true);
    expect(thValidator("สรุปย่อ", {})).toBe(true);
    expect(enValidator("A short summary.", {})).toBe(true);
  });
});

describe("a document type with only one locale filled cannot publish, exercised end to end on page.ts", () => {
  it("page's title field routes through localizedString, whose th/en validators are the real bilingual gate", () => {
    const titleField = fieldByName(page.fields, "title");
    expect(titleField.type).toBe("localizedString");

    // The document field itself only asserts the object is present; the
    // per-locale requiredness is enforced inside localizedString.ts, one
    // level down, which is what the two describe blocks above exercise
    // directly. This test asserts the wiring: page.ts really does use that
    // shared type rather than a bespoke, unvalidated string pair.
    expect(isRequired(titleField)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Every document type carries the lifecycle fields.
// ---------------------------------------------------------------------------

describe("lifecycle", () => {
  const LIFECYCLE_FIELD_NAMES = [
    "status",
    "publishAt",
    "owner",
    "lastReviewed",
    "reviewBy",
    "slugHistory",
    "maintainedBecause",
  ];

  it("mirrors lib/content/lifecycle.ts's Lifecycle type field for field", () => {
    const names = (lifecycle.fields as Array<{ name: string }>).map((f) => f.name);
    expect([...names].sort()).toEqual([...LIFECYCLE_FIELD_NAMES].sort());
  });

  it("status and owner are required; a document with neither set is not publishable", () => {
    expect(isRequired(fieldByName(lifecycle.fields, "status"))).toBe(true);
    expect(isRequired(fieldByName(lifecycle.fields, "owner"))).toBe(true);
  });

  it("publishing scheduled with no publishAt date is a blocking finding, surfaced on the publishAt field", () => {
    const publishAt = fieldByName(lifecycle.fields, "publishAt");
    const validator = customValidatorAt(publishAt, 0, "lifecycle.publishAt");
    const context = { parent: { status: "scheduled", owner: "president" } };
    expect(validator(undefined, context)).not.toBe(true);
  });

  it("publishing published with no reviewBy date is a blocking finding, surfaced on the reviewBy field", () => {
    const reviewBy = fieldByName(lifecycle.fields, "reviewBy");
    const validator = customValidatorAt(reviewBy, 0, "lifecycle.reviewBy");
    const context = { parent: { status: "published", owner: "president" } };
    expect(validator(undefined, context)).not.toBe(true);
  });

  it("a draft with no reviewBy date is fine; the block is specific to published", () => {
    const reviewBy = fieldByName(lifecycle.fields, "reviewBy");
    const validator = customValidatorAt(reviewBy, 0, "lifecycle.reviewBy");
    const context = { parent: { status: "draft", owner: "president" } };
    expect(validator(undefined, context)).toBe(true);
  });

  it.each([
    ["newsArticle", newsArticle],
    ["event", event],
    ["page", page],
    ["guide", guide],
    ["club", club],
  ])("%s carries a required lifecycle field", (_name, doc) => {
    const lifecycleField = fieldByName(doc.fields as unknown[], "lifecycle");
    expect(lifecycleField.type).toBe("lifecycle");
    expect(isRequired(lifecycleField)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// The shared slug: identical across locales, generated from the English
// title (docs/CMS-SCHEMA-CONVENTIONS.md #3). The typecheck fix narrows
// SlugSourceFn's SanityDocument inside the function rather than lying about
// the parameter type; this exercises the actual narrowing behaviour.
// ---------------------------------------------------------------------------

describe("slug source functions narrow SanityDocument to this document's own title, safely", () => {
  it.each([
    ["newsArticle", newsArticle],
    ["event", event],
    ["page", page],
    ["guide", guide],
    ["club", club],
  ])("%s's slug is sourced from title.en", (_name, doc) => {
    const slug = fieldByName(doc.fields as unknown[], "slug");
    const source = (slug.options as { source: (d: unknown) => string }).source;
    expect(source({ title: { en: "Welcome Fair" } })).toBe("Welcome Fair");
    // A document with no title yet (mid draft) must not throw.
    expect(source({})).toBe("");
    expect(source({ title: {} })).toBe("");
  });
});

// ---------------------------------------------------------------------------
// Every document type's title and summary route through the shared
// localised object types, never a bespoke unvalidated string field.
// ---------------------------------------------------------------------------

describe("document types compose their bilingual fields from the shared objects", () => {
  it.each([
    ["newsArticle", newsArticle, ["title"]],
    ["event", event, ["title", "location"]],
    ["page", page, ["title"]],
    ["guide", guide, ["title"]],
    ["club", club, ["title", "tagline"]],
  ] as const)(
    "%s's short bilingual fields (title, labels) are localizedString",
    (_name, doc, fields) => {
      for (const name of fields) {
        const field = fieldByName(doc.fields as unknown[], name);
        expect(field.type, name).toBe("localizedString");
      }
    }
  );

  it.each([
    ["newsArticle", newsArticle, ["summary"]],
    ["event", event, ["summary"]],
    ["guide", guide, ["summary"]],
  ] as const)("%s's paragraph fields (summary) are localizedText", (_name, doc, fields) => {
    for (const name of fields) {
      const field = fieldByName(doc.fields as unknown[], name);
      expect(field.type, name).toBe("localizedText");
    }
  });
});
