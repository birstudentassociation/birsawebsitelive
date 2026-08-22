/**
 * Unit tests for the schema registry, the two configuration singletons, the
 * service definition schema, the question palette and the Studio desk
 * structure (REDESIGN-2.0 §3.3, §4.5, §6.4, §6.6, §6.7, §6.12), Wave 3D.
 *
 * Entirely offline. No Sanity client, no Studio, no network, no real
 * project (`sanity/projectConfig.ts`, `sanity.config.ts`). Where a
 * validation needs a `Rule` builder or the desk structure needs `S`, a
 * small stand-in records what the real code called and captures the
 * functions it registered, the same pattern
 * `tests/unit/sanity-schema-editorial.test.ts` and
 * `tests/unit/sanity-schema-organisational.test.ts` use.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

import { schemaTypes } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";

import {
  navigation,
  navLink,
  footerNavGroup,
  toHeaderNav,
  toFooterGroups,
} from "@/sanity/schemaTypes/documents/navigation";
import { siteSettings } from "@/sanity/schemaTypes/documents/siteSettings";
import {
  serviceDefinition,
  serviceDefinitionProblems,
  SERVICE_DEFINITION_FIELDS,
} from "@/sanity/schemaTypes/documents/serviceDefinition";
import { question, questionTypeOptions } from "@/sanity/schemaTypes/objects/question";

import { forbiddenSchemaFields } from "@/components/bds/sectionPalette";
import { questionTypeIds } from "@/lib/services/questionTypes";
import { portfolioIds } from "@/lib/portfolios";

// ---------------------------------------------------------------------------
// Schema introspection helpers. `defineType`/`defineField` return plain
// data plus function properties (`validation`, `hidden`, `preview`), so a
// schema definition can be walked with ordinary object traversal.
// ---------------------------------------------------------------------------

type FieldLike = {
  name?: string;
  type?: string;
  readOnly?: boolean;
  fields?: FieldLike[];
  of?: FieldLike[];
  options?: { list?: Array<{ value: unknown }> };
  validation?: (rule: unknown) => unknown;
};

function asFieldLike(def: object): FieldLike {
  return def as FieldLike;
}

/** Every `{ name, type }` this schema tree declares, at any depth, direct fields only (not `options.list`). */
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
    for (const member of record.of as Array<Record<string, unknown>>) {
      out.push(...collectFields(member));
    }
  }
  return out;
}

function fieldByName(fields: unknown, name: string): Record<string, unknown> {
  const found = (fields as Array<Record<string, unknown>>).find((f) => f.name === name);
  if (!found)
    throw new Error(`No field named "${name}" (looked for it in a fixture, not a live schema)`);
  return found;
}

/**
 * A fake Sanity `Rule` builder. Every method chains (returns the same
 * proxy) and is recorded, so a test can assert a method was reached and
 * recover the exact function passed to `.custom(...)` to run it directly,
 * including the sibling-context second argument a document-level `Rule`
 * receives.
 */
function mockRule(): { rule: unknown; calls: Array<{ method: string; args: unknown[] }> } {
  const calls: Array<{ method: string; args: unknown[] }> = [];
  const proxy: unknown = new Proxy(
    {},
    {
      get(_target, prop: string) {
        return (...args: unknown[]) => {
          calls.push({ method: prop, args });
          return proxy;
        };
      },
    }
  );
  return { rule: proxy, calls };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => unknown;

function customValidatorsOf(field: FieldLike | undefined): AnyFn[] {
  if (!field?.validation) return [];
  const { rule, calls } = mockRule();
  field.validation(rule);
  return calls.filter((c) => c.method === "custom").map((c) => c.args[0] as AnyFn);
}

// ---------------------------------------------------------------------------
// The registry (`sanity/schemaTypes/index.ts`): the integration point
// across Wave 3B, 3C and this wave.
// ---------------------------------------------------------------------------

describe("the schema registry", () => {
  it("registers a non-empty array of plain schema objects", () => {
    expect(Array.isArray(schemaTypes)).toBe(true);
    expect(schemaTypes.length).toBeGreaterThan(0);
  });

  it("registers no two types under the same name", () => {
    // Sanity silently lets the second one win. An officer would never
    // find out which type they were actually editing.
    const names = schemaTypes.map((t) => asFieldLike(t).name);
    expect(names.every((n) => typeof n === "string" && n.length > 0)).toBe(true);
    expect(new Set(names).size).toBe(names.length);
  });

  it("registers only structurally valid schema objects", () => {
    for (const entry of schemaTypes) {
      const def = asFieldLike(entry);
      expect(typeof def.name).toBe("string");
      expect((def.name ?? "").length).toBeGreaterThan(0);
      expect(typeof def.type).toBe("string");
      expect((def.type ?? "").length).toBeGreaterThan(0);
    }
  });

  it("includes this wave's own document and object types", () => {
    const names = schemaTypes.map((t) => asFieldLike(t).name);
    for (const expected of [
      "siteSettings",
      "navigation",
      "serviceDefinition",
      "question",
      "questionOption",
      "navLink",
      "footerNavGroup",
      "labelledValue",
      "contactRoute",
      "featureFlag",
    ]) {
      expect(names, `registry is missing "${expected}"`).toContain(expected);
    }
  });

  it("includes every document type Wave 3B and Wave 3C reported on disk", () => {
    const names = schemaTypes.map((t) => asFieldLike(t).name);
    for (const expected of [
      // Wave 3B
      "newsArticle",
      "event",
      "page",
      "guide",
      "club",
      // Wave 3C
      "committeeMember",
      "portfolio",
      "minutes",
      "decision",
      "budgetEntry",
      "regulation",
    ]) {
      expect(names, `registry is missing "${expected}"`).toContain(expected);
    }
  });
});

// ---------------------------------------------------------------------------
// No forbidden escape hatch, anywhere in the whole registry, not just this
// wave's own files. §4.6 property 3.
// ---------------------------------------------------------------------------

describe("no forbidden escape hatch field", () => {
  it("names no field from forbiddenSchemaFields anywhere in the registered schema", () => {
    for (const entry of schemaTypes) {
      const def = asFieldLike(entry);
      const names = collectFields(def).map((f) => f.name.toLowerCase());
      for (const forbidden of forbiddenSchemaFields) {
        expect(
          names,
          `"${def.name}" must not have a field named "${forbidden}"`
        ).not.toContain(forbidden);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// The question palette (`sanity/schemaTypes/objects/question.ts`), mirrored
// from the frozen `questionTypeIds` (§6.7, §6.12).
// ---------------------------------------------------------------------------

describe("question.ts", () => {
  it("offers exactly the eleven ids in questionTypeIds, none extra", () => {
    const offered = questionTypeOptions.map((o) => o.value).sort();
    expect(offered).toEqual([...questionTypeIds].sort());
    expect(offered.length).toBe(11);
  });

  it("the type field's own options list is the same eleven, not a re-typed copy", () => {
    const typeField = fieldByName(question.fields, "type");
    const list = (typeField.options as { list?: Array<{ value: unknown }> } | undefined)?.list;
    expect(list).toBeDefined();
    const values = (list ?? []).map((o) => o.value).sort();
    expect(values).toEqual([...questionTypeIds].sort());
  });

  it("a twelfth, invented question type id is not offered", () => {
    const offered = questionTypeOptions.map((o) => o.value);
    expect(offered).not.toContain("signature");
    expect(offered).not.toContain("rich-text");
  });
});

// ---------------------------------------------------------------------------
// serviceDefinition: field for field mirror of the frozen ServiceDefinition
// type (§6.7).
// ---------------------------------------------------------------------------

describe("serviceDefinition mirrors ServiceDefinition field for field", () => {
  it("has a schema field for every field of ServiceDefinition and no extra field", () => {
    // SERVICE_DEFINITION_FIELDS is driven from the real `ServiceDefinition`
    // type by a compile-time exhaustiveness check in serviceDefinition.ts
    // itself (a `satisfies` plus a `never` assertion), not retyped here, so
    // this test fails the moment the two diverge only if the SOURCE file's
    // own compile-time check has already caught it, and fails on ITS OWN
    // if a schema field is added without a matching type key (the reverse
    // direction the source file's compile check cannot see).
    const schemaFieldNames = (serviceDefinition.fields ?? [])
      .map((f) => asFieldLike(f).name)
      .sort();
    expect(schemaFieldNames).toEqual([...SERVICE_DEFINITION_FIELDS].sort());
  });

  it("start carries ServiceDefinition['start']'s full shape", () => {
    const start = fieldByName(serviceDefinition.fields, "start");
    const startFieldNames = ((start.fields as FieldLike[] | undefined) ?? [])
      .map((f) => f.name)
      .sort();
    expect(startFieldNames).toEqual(
      ["title", "whoFor", "before", "howLong", "whatNext"].sort()
    );
  });

  it("subject, Gate 7's optional field, carries source, paramName and label", () => {
    const subject = fieldByName(serviceDefinition.fields, "subject");
    const subjectFieldNames = ((subject.fields as FieldLike[] | undefined) ?? [])
      .map((f) => f.name)
      .sort();
    expect(subjectFieldNames).toEqual(["source", "paramName", "label"].sort());
  });
});

describe("sensitive is not officer-editable", () => {
  it("the sensitive field is read only in the Studio", () => {
    const sensitive = fieldByName(serviceDefinition.fields, "sensitive");
    expect(sensitive.readOnly).toBe(true);
  });
});

describe("owner and secondHolder cannot be the same portfolio", () => {
  it("rejects a secondHolder equal to owner", () => {
    expect(portfolioIds.length).toBeGreaterThanOrEqual(2);
    const secondHolder = asFieldLike(fieldByName(serviceDefinition.fields, "secondHolder"));
    const validators = customValidatorsOf(secondHolder);
    expect(validators.length).toBeGreaterThan(0);
    const [validate] = validators;
    const owner = portfolioIds[0]!;
    const result = validate(owner, { document: { owner } });
    expect(result).not.toBe(true);
    expect(typeof result).toBe("string");
  });

  it("accepts a secondHolder different from owner", () => {
    const secondHolder = asFieldLike(fieldByName(serviceDefinition.fields, "secondHolder"));
    const [validate] = customValidatorsOf(secondHolder);
    const owner = portfolioIds[0]!;
    const different = portfolioIds[1]!;
    expect(validate(different, { document: { owner } })).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// The publish blocking privacy rule, REDESIGN-2.0 §5.1 item 10: the rule
// the whole chassis exists for. A service that collects personal data
// cannot publish without a privacyActivityId that exists in the register
// AND a retention path that is actually implemented.
//
// Fixtures below are obviously fictional service ids and copy, but they
// reference REAL entries from `content/privacy/register.ts` (a frozen,
// read only file) where the mechanism under test specifically needs a
// register id that either does or does not have an implemented retention
// path, which is not something a fictional register could stand in for.
// ---------------------------------------------------------------------------

function fictionalStart() {
  return {
    title: { th: "บริการทดสอบตัวอย่าง", en: "Example test service" },
    whoFor: { th: "สำหรับการทดสอบเท่านั้น", en: "For testing only" },
    before: [{ th: "ไม่มีสิ่งใดต้องเตรียม", en: "Nothing to prepare" }],
    howLong: { th: "ห้านาที", en: "Five minutes" },
    whatNext: { th: "ไม่มีขั้นตอนต่อไปจริง", en: "Nothing really happens next" },
  };
}

function baseFixture(overrides: Record<string, unknown> = {}) {
  return {
    id: "example-test-service",
    owner: portfolioIds[0],
    secondHolder: portfolioIds[1],
    start: fictionalStart(),
    questions: [
      {
        id: "your-email",
        type: "email",
        label: { th: "อีเมลของคุณ", en: "Your email" },
        required: true,
      },
    ],
    standardHours: 48,
    escalateTo: portfolioIds[1],
    sensitive: false,
    ...overrides,
  };
}

describe("the section 5.1 item 10 publish blocking rule", () => {
  it("blocks a service with an email question and no privacyActivityId", () => {
    const problems = serviceDefinitionProblems(baseFixture());
    expect(problems.some((p) => p.field === "privacyActivityId")).toBe(true);
  });

  it("blocks a privacyActivityId that is not in the register at all", () => {
    const problems = serviceDefinitionProblems(
      baseFixture({
        privacyActivityId: "obviously-fictional-activity-not-in-the-register",
        retentionTrigger: "created",
      })
    );
    expect(
      problems.some(
        (p) =>
          p.field === "privacyActivityId" &&
          (p.message.en.includes("not an activity in the privacy register") ||
            p.message.th.includes("ไม่ใช่กิจกรรม"))
      )
    ).toBe(true);
  });

  it("blocks a real register activity with no implemented retention path", () => {
    // "contact-message" is a real content/privacy/register.ts activity, but
    // is not in serviceDefinition.ts's copy of the implemented retention
    // allowlist, so this is exactly rule 6's third branch.
    const problems = serviceDefinitionProblems(
      baseFixture({ privacyActivityId: "contact-message", retentionTrigger: "created" })
    );
    expect(
      problems.some(
        (p) => p.field === "privacyActivityId" && p.message.en.includes("no code path")
      )
    ).toBe(true);
  });

  it("passes a real, implemented register activity whose trigger matches", () => {
    // "feedback" is real, its own register trigger is "created", and it is
    // in the implemented allowlist, so a definition naming it correctly has
    // nothing left to block on.
    const problems = serviceDefinitionProblems(
      baseFixture({ privacyActivityId: "feedback", retentionTrigger: "created" })
    );
    expect(problems).toEqual([]);
  });

  it("blocks a retentionTrigger that disagrees with the register activity's own trigger", () => {
    // The register's own "feedback" trigger is "created", not "closed".
    const problems = serviceDefinitionProblems(
      baseFixture({ privacyActivityId: "feedback", retentionTrigger: "closed" })
    );
    expect(problems.some((p) => p.field === "retentionTrigger")).toBe(true);
  });

  it("is enforced at publish through the document-level Studio validation rule, not just the helper function", () => {
    // The same fixture and expectation as the first test above, but driven
    // through serviceDefinition's own `validation` Rule builder, which is
    // literally what runs inside the Studio at publish time.
    const { rule, calls } = mockRule();
    const validationFn = serviceDefinition.validation as unknown as (r: unknown) => unknown;
    validationFn(rule);
    const customCall = calls.find((c) => c.method === "custom");
    expect(customCall).toBeDefined();
    const validate = customCall!.args[0] as (doc: unknown) => unknown;
    const result = validate(baseFixture());
    expect(Array.isArray(result)).toBe(true);
    const markers = result as Array<{ message: string; path: unknown[] }>;
    expect(markers.some((m) => m.path[0] === "privacyActivityId")).toBe(true);
    // And a fully valid fixture publishes clean, `true`, not an empty array
    // of markers, matching Sanity's own "no problem" convention.
    expect(
      validate(baseFixture({ privacyActivityId: "feedback", retentionTrigger: "created" }))
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// navigation: same shape Header and Footer already accept, and the footer
// utility row stays hardcoded (§3.3).
// ---------------------------------------------------------------------------

describe("navigation matches the Header and Footer prop shape", () => {
  it("navLink is exactly { href, label }", () => {
    const names = (navLink.fields ?? []).map((f) => asFieldLike(f).name).sort();
    expect(names).toEqual(["href", "label"].sort());
  });

  it("footerNavGroup is exactly { id, title, links }", () => {
    const names = (footerNavGroup.fields ?? []).map((f) => asFieldLike(f).name).sort();
    expect(names).toEqual(["id", "title", "links"].sort());
  });

  it("navigation is exactly { lifecycle, primaryNav, footerGroups }, nothing else", () => {
    const names = (navigation.fields ?? []).map((f) => asFieldLike(f).name).sort();
    expect(names).toEqual(["lifecycle", "primaryNav", "footerGroups"].sort());
  });

  it("toHeaderNav returns the document's primaryNav untouched, matching NavLink[]", () => {
    const fixture = {
      primaryNav: [{ href: "/example", label: { th: "ตัวอย่าง", en: "Example" } }],
    };
    expect(toHeaderNav(fixture)).toEqual(fixture.primaryNav);
  });

  it("toHeaderNav defaults to an empty array when primaryNav is unset", () => {
    expect(toHeaderNav({})).toEqual([]);
  });

  it("toFooterGroups returns the document's footerGroups untouched, matching FooterNavGroup[]", () => {
    const fixture = {
      footerGroups: [
        {
          id: "example",
          title: { th: "ตัวอย่าง", en: "Example" },
          links: [{ href: "/example", label: { th: "ตัวอย่าง", en: "Example" } }],
        },
      ],
    };
    expect(toFooterGroups(fixture)).toEqual(fixture.footerGroups);
  });
});

describe("the footer utility row is not editable", () => {
  it("navigation names no field for accessibility, standards, privacy, cookies or emergency", () => {
    const names = collectFields(navigation).map((f) => f.name.toLowerCase());
    for (const utility of ["accessibility", "standards", "privacy", "cookies", "emergency"]) {
      expect(names, `navigation must not have an editable "${utility}" field`).not.toContain(
        utility
      );
    }
  });
});

// ---------------------------------------------------------------------------
// siteSettings: emergency mode is deliberately absent (lib/emergency.ts
// stays the one source of truth for that switch, §6.6 vs §6.9).
// ---------------------------------------------------------------------------

describe("siteSettings", () => {
  it("carries the §6.6 configuration fields", () => {
    const names = (siteSettings.fields ?? []).map((f) => asFieldLike(f).name);
    for (const expected of [
      "phaseBanner",
      "contact",
      "serviceStandards",
      "openingHours",
      "termDates",
      "signUpsOpen",
      "homepageSectionOrder",
      "contactRouting",
      "featureFlags",
    ]) {
      expect(names, `siteSettings is missing "${expected}"`).toContain(expected);
    }
  });

  it("does not carry an emergency mode toggle: lib/emergency.ts, not Sanity, is the one source of truth", () => {
    const names = collectFields(siteSettings).map((f) => f.name.toLowerCase());
    expect(names).not.toContain("emergency");
    expect(names).not.toContain("emergencymode");
  });
});

// ---------------------------------------------------------------------------
// The desk structure (`sanity/structure/index.ts`), §6.4: shaped by
// portfolio, singletons pinned so they cannot be created twice.
//
// A minimal stand-in for Sanity's `StructureBuilder`. It implements only
// the chainable methods `structure/index.ts` actually calls, each
// returning an inspectable plain object rather than a real Studio pane, so
// the resulting tree can be asserted on without a live Sanity client.
// ---------------------------------------------------------------------------

type FakeNode = { _kind: string; [key: string]: unknown };

function makeFakeS() {
  const list = () => {
    const node: FakeNode = { _kind: "list" };
    return Object.assign(node, {
      title(t: string) {
        node.title = t;
        return this;
      },
      items(arr: unknown[]) {
        node.items = arr;
        return this;
      },
    });
  };
  const listItem = () => {
    const node: FakeNode = { _kind: "listItem" };
    return Object.assign(node, {
      id(v: string) {
        node.id = v;
        return this;
      },
      title(t: string) {
        node.title = t;
        return this;
      },
      schemaType(v: string) {
        node.schemaType = v;
        return this;
      },
      child(v: unknown) {
        node.child = v;
        return this;
      },
    });
  };
  const documentList = () => {
    const node: FakeNode = { _kind: "documentList" };
    return Object.assign(node, {
      title(t: string) {
        node.title = t;
        return this;
      },
      schemaType(v: string) {
        node.schemaType = v;
        return this;
      },
      filter(f: string) {
        node.filter = f;
        return this;
      },
      params(p: Record<string, unknown>) {
        node.params = p;
        return this;
      },
    });
  };
  const documentTypeList = (typeName: string) => {
    const node: FakeNode = { _kind: "documentTypeList", schemaType: typeName };
    return Object.assign(node, {
      title(t: string) {
        node.title = t;
        return this;
      },
    });
  };
  const documentEditor = () => {
    const node: FakeNode = { _kind: "document" };
    return Object.assign(node, {
      schemaType(v: string) {
        node.schemaType = v;
        return this;
      },
      documentId(v: string) {
        node.documentId = v;
        return this;
      },
    });
  };
  const divider = () => ({ _kind: "divider" }) as FakeNode;

  return { list, listItem, documentList, documentTypeList, document: documentEditor, divider };
}

describe("the desk structure is shaped by portfolio", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fakeS = makeFakeS() as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const root = structure(fakeS as any) as any as FakeNode;

  it("returns a top level list titled BIRSA", () => {
    expect(root._kind).toBe("list");
    expect(root.title).toBe("BIRSA");
  });

  it("pins siteSettings and navigation to a single fixed document id, never a document list", () => {
    const items = root.items as FakeNode[];
    const siteSettingsItem = items.find((i) => i.id === "siteSettings");
    const navigationItem = items.find((i) => i.id === "navigation");
    expect(siteSettingsItem).toBeDefined();
    expect(navigationItem).toBeDefined();

    for (const item of [siteSettingsItem!, navigationItem!]) {
      const child = item.child as FakeNode;
      // A singleton's child is a single-document editor pinned to a fixed
      // id, `S.document().documentId(...)`, never `S.documentList(...)` or
      // `S.documentTypeList(...)`, either of which would let an officer
      // create a second one.
      expect(child._kind).toBe("document");
      expect(child.documentId).toBe(item.id);
    }
  });

  it("never calls documentTypeListItems, the one call that would offer create on every type at once", () => {
    // A structural guarantee the fake builder above cannot fully stand in
    // for (it would only surface as a runtime TypeError if called with an
    // unimplemented method), checked directly against this wave's own
    // source instead.
    const source = readFileSync(
      path.join(__dirname, "..", "..", "sanity", "structure", "index.ts"),
      "utf-8"
    );
    expect(source).not.toContain("documentTypeListItems");
  });

  it("gives every one of the thirteen portfolios its own top level branch", () => {
    const items = root.items as FakeNode[];
    const portfolioBranches = items.filter(
      (i) => typeof i.id === "string" && i.id.startsWith("portfolio-")
    );
    expect(portfolioBranches.length).toBe(portfolioIds.length);
    const branchPortfolioIds = portfolioBranches.map((b) => (b.id as string).replace("portfolio-", ""));
    expect(new Set(branchPortfolioIds).size).toBe(portfolioIds.length);
    for (const id of portfolioIds) {
      expect(branchPortfolioIds).toContain(id);
    }
  });

  it("a portfolio branch is a document list scoped to that portfolio, not a flat list of every document type", () => {
    const items = root.items as FakeNode[];
    const firstPortfolioId = portfolioIds[0]!;
    const branch = items.find((i) => i.id === `portfolio-${firstPortfolioId}`)!;
    const branchList = branch.child as FakeNode;
    expect(branchList._kind).toBe("list");
    const branchItems = branchList.items as FakeNode[];
    expect(branchItems.length).toBeGreaterThan(0);
    for (const branchItem of branchItems) {
      const scopedList = branchItem.child as FakeNode;
      expect(scopedList._kind).toBe("documentList");
      // Every scoped list actually filters to this one portfolio: the
      // filter string references the portfolio id parameter, and the
      // params object carries this exact portfolio's id, not a different
      // one and not every portfolio at once.
      expect(String(scopedList.filter)).toContain("$pid");
      expect((scopedList.params as Record<string, unknown>).pid).toBe(firstPortfolioId);
    }
  });
});
