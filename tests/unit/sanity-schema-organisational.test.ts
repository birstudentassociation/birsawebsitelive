/**
 * The organisational content schema (REDESIGN-2.0 section 6.3, section 7.2,
 * section 10, DECISIONS-2.0.md gate 3).
 *
 * This is the sensitive cluster: roster, minutes, decisions, budget and
 * regulations, which is where a CMS schema most easily becomes a place
 * personal data ends up. These tests check the shape of the schema
 * definitions offline, without a live Sanity client. Field name checks are a
 * floor and not a proof: a field can hold anything an officer types into it.
 * The real control is the field list itself, read at review time, which is
 * why every document file above carries a long comment explaining what it
 * deliberately excludes and why.
 */
import { describe, expect, it } from "vitest";

import {
  committeeMember,
  committeeMemberGroups,
} from "@/sanity/schemaTypes/documents/committeeMember";
import { portfolio } from "@/sanity/schemaTypes/documents/portfolio";
import { minutes, redactionCategories } from "@/sanity/schemaTypes/documents/minutes";
import { decision } from "@/sanity/schemaTypes/documents/decision";
import { budgetEntry, budgetEntryDirections } from "@/sanity/schemaTypes/documents/budgetEntry";
import { regulation } from "@/sanity/schemaTypes/documents/regulation";
import { forbiddenSchemaFields } from "@/components/bds/sectionPalette";
import { imageField } from "@/sanity/schemaTypes/objects/imageField";
import { portableText } from "@/sanity/schemaTypes/objects/portableText";
import { portfolioIds } from "@/lib/portfolios";

// ---------------------------------------------------------------------------
// Schema introspection helpers. Sanity's `defineType`/`defineField` return
// plain data plus function properties (`validation`, `hidden`, `preview`),
// so a schema definition can be walked with ordinary object traversal.
// No live Sanity client, dataset or Studio is involved anywhere below.
// ---------------------------------------------------------------------------

type FieldLike = {
  name?: string;
  type?: string;
  fields?: FieldLike[];
  of?: FieldLike[];
  options?: { list?: Array<{ value: unknown }> };
  validation?: (rule: unknown) => unknown;
};

/** Every field name reachable from a document or object definition, at any depth. */
function collectFieldNames(def: FieldLike, path: string[] = []): string[] {
  const names: string[] = [];
  for (const field of def.fields ?? []) {
    const here = field.name ? [...path, field.name] : path;
    if (field.name) names.push(field.name);
    names.push(...collectFieldNames(field, here));
  }
  for (const member of def.of ?? []) {
    names.push(...collectFieldNames(member, path));
  }
  return names;
}

/** Every field, at any depth, whose `type` equals `typeName`, as dotted paths. */
function findFieldsByType(def: FieldLike, typeName: string, path: string[] = []): string[] {
  const results: string[] = [];
  for (const field of def.fields ?? []) {
    const here = field.name ? [...path, field.name] : path;
    if (field.type === typeName) results.push(here.join("."));
    results.push(...findFieldsByType(field, typeName, here));
  }
  for (const member of def.of ?? []) {
    results.push(...findFieldsByType(member, typeName, path));
  }
  return results;
}

function fieldByName(def: FieldLike | undefined, name: string): FieldLike | undefined {
  return def?.fields?.find((f) => f.name === name);
}

/**
 * A fake Sanity `Rule` builder. Every method call is chainable (it returns
 * the same proxy, matching how `Rule.required().custom(...)` reads) and is
 * recorded, so a test can assert a method was called and can recover the
 * exact function passed to `.custom(...)` to invoke it directly. None of
 * these documents' validators build an array of separate rule chains off
 * one `Rule` parameter, so one shared recording proxy per call is enough.
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

function calledRuleMethods(field: FieldLike | undefined): string[] {
  if (!field?.validation) return [];
  const { rule, calls } = mockRule();
  field.validation(rule);
  return calls.map((c) => c.method);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyValidator = (...args: any[]) => unknown;

function customValidatorsOf(field: FieldLike | undefined): AnyValidator[] {
  if (!field?.validation) return [];
  const { rule, calls } = mockRule();
  field.validation(rule);
  return calls.filter((c) => c.method === "custom").map((c) => c.args[0] as AnyValidator);
}

/**
 * `defineType`/`defineField` return precisely typed Sanity schema
 * definitions. The introspection helpers above only read `name`, `type`,
 * `fields`, `of`, `options.list` and `validation`, which every one of
 * these definitions actually has, so a structural cast to `FieldLike` is
 * accurate, not a type escape hatch around a real mismatch.
 */
function asFieldLike(def: object): FieldLike {
  return def as FieldLike;
}

const committeeMemberDef = asFieldLike(committeeMember);
const portfolioDef = asFieldLike(portfolio);
const minutesDef = asFieldLike(minutes);
const decisionDef = asFieldLike(decision);
const budgetEntryDef = asFieldLike(budgetEntry);
const regulationDef = asFieldLike(regulation);

const documents = {
  committeeMember: committeeMemberDef,
  portfolio: portfolioDef,
  minutes: minutesDef,
  decision: decisionDef,
  budgetEntry: budgetEntryDef,
  regulation: regulationDef,
};

// ---------------------------------------------------------------------------
// The floor checks: no field name in this cluster matches a forbidden
// escape hatch or a personal data pattern. A name check cannot prove a
// field is safe; it only catches the next person who almost adds one.
// ---------------------------------------------------------------------------

describe("no forbidden escape hatch field", () => {
  it("names no field from forbiddenSchemaFields in any owned document type", () => {
    // §4.6 property 3, same reason bds-contracts.test.ts checks the section
    // palette: a raw HTML, embed or custom CSS field is how a text-forward
    // site becomes a legally exposed photo blog by week nine.
    for (const [docName, def] of Object.entries(documents)) {
      const names = collectFieldNames(def).map((n) => n.toLowerCase());
      for (const forbidden of forbiddenSchemaFields) {
        expect(names, `${docName} must not have a field named "${forbidden}"`).not.toContain(
          forbidden.toLowerCase()
        );
      }
    }
  });
});

describe("no personal data field", () => {
  /**
   * REDESIGN-2.0 section 6.3's boundary: "Sanity holds published content and
   * site configuration. It never holds personal data." A committee member
   * may hold only what a public roster already publishes, so a personal
   * phone number, personal email, student id, address, date of birth or
   * national id has no legitimate field anywhere in this cluster.
   *
   * THIS IS A FLOOR, NOT A PROOF. Matching a field name proves nothing about
   * what an officer later types into a free text field; it only catches a
   * field that was named honestly. The actual control is the field list
   * itself and the review that reads it, both described in the long
   * comments at the top of each document file.
   */
  const PERSONAL_DATA_DENYLIST = [
    "phone",
    "mobile",
    "studentid",
    "address",
    "dateofbirth",
    "dob",
    "birthdate",
    "nationalid",
    "citizenid",
    "idcard",
  ] as const;

  it("matches no field name against the personal data denylist", () => {
    for (const [docName, def] of Object.entries(documents)) {
      const names = collectFieldNames(def);
      for (const name of names) {
        const flat = name.toLowerCase();
        for (const denied of PERSONAL_DATA_DENYLIST) {
          expect(
            flat.includes(denied),
            `${docName}.${name} looks like it might be personal data (matches "${denied}")`
          ).toBe(false);
        }
      }
    }
  });

  it("carries a role email only, never a personal one", () => {
    // The roster's `roleEmail` is a deliberate, named exception (a shared
    // inbox for the position). Any OTHER field with "email" in its name
    // would be exactly the personal email section 6.3 forbids, so the only
    // allowed match is that one field, on that one document.
    const emailFields = Object.entries(documents).flatMap(([docName, def]) =>
      collectFieldNames(def)
        .filter((name) => /email/i.test(name))
        .map((name) => `${docName}.${name}`)
    );
    expect(emailFields).toEqual(["committeeMember.roleEmail"]);
  });

  it("defines no consent, consent date or guardian field anywhere in this cluster", () => {
    // DECISIONS-2.0.md gate 3: BIRSA may publish a photograph WITH written
    // consent per photo, and the consent record lives in the privacy
    // register's `photo-consent` activity, outside the CMS entirely. A
    // consent field here would duplicate a legal record in the wrong store
    // with the wrong retention path, which is worse than not having one.
    const names = Object.values(documents).flatMap((def) => collectFieldNames(def));
    const flat = names.map((n) => n.toLowerCase());
    for (const forbidden of ["consent", "guardian"]) {
      expect(
        flat.some((n) => n.includes(forbidden)),
        `no field may include "${forbidden}"`
      ).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// committeeMember: the public roster
// ---------------------------------------------------------------------------

describe("committeeMember", () => {
  it("cannot publish without a role and a portfolio", () => {
    const role = fieldByName(committeeMemberDef, "role");
    const portfolioField = fieldByName(committeeMemberDef, "portfolio");
    expect(calledRuleMethods(role)).toContain("required");
    expect(calledRuleMethods(portfolioField)).toContain("required");
    // The portfolio is a reference to a real portfolio document, never a
    // typed name, so the roster and the portfolio document cannot disagree
    // about what a portfolio is.
    expect(portfolioField?.type).toBe("reference");
  });

  it("requires a name and does not require a nickname to be typed as free personal detail beyond the roster", () => {
    expect(calledRuleMethods(fieldByName(committeeMemberDef, "firstName"))).toContain("required");
    expect(calledRuleMethods(fieldByName(committeeMemberDef, "lastName"))).toContain("required");
  });

  it("groups members from a closed list, matching how BIRSA already groups its roster", () => {
    expect([...committeeMemberGroups].sort()).toEqual(["assistant", "officer"]);
  });

  it("holds only what a public roster already publishes", () => {
    // §6.3, §4.7C. The exhaustive allow list: identifier, name fields, role,
    // group, portfolio reference, a role email, a portrait, and the shared
    // lifecycle object. Nothing else. A new field arriving here that is not
    // on this list is exactly the drift this test exists to catch.
    const topLevel = (committeeMemberDef.fields ?? []).map((f) => f.name).filter(Boolean);
    expect([...topLevel].sort()).toEqual(
      [
        "slug",
        "firstName",
        "lastName",
        "nickname",
        "role",
        "group",
        "portfolio",
        "roleEmail",
        "portrait",
        "lifecycle",
      ].sort()
    );
  });

  it("gives the roster portrait the shared image field, never a bespoke one", () => {
    const portrait = fieldByName(committeeMemberDef, "portrait");
    expect(portrait?.type).toBe(imageField.name);
  });

  it("validates the role email as an email format when one is given, but never requires it", () => {
    const roleEmail = fieldByName(committeeMemberDef, "roleEmail");
    // Optional: a role with no shared inbox leaves this empty.
    expect(calledRuleMethods(roleEmail)).not.toContain("required");
    const [validator] = customValidatorsOf(roleEmail);
    expect(validator).toBeTypeOf("function");
    expect(validator?.(undefined, {})).toBe(true);
    expect(validator?.("not-an-email", {})).not.toBe(true);
    expect(validator?.("secretariat@birsa.example", {})).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// portfolio: the two person rule
// ---------------------------------------------------------------------------

describe("portfolio", () => {
  it("references a real PortfolioId, never free text", () => {
    const portfolioId = fieldByName(portfolioDef, "portfolioId");
    expect(calledRuleMethods(portfolioId)).toContain("required");
    const list = portfolioId?.options?.list ?? [];
    expect(list.map((entry) => entry.value).sort()).toEqual([...portfolioIds].sort());

    const [validator] = customValidatorsOf(portfolioId);
    expect(validator).toBeTypeOf("function");
    expect(validator?.(portfolioIds[0], {})).toBe(true);
    expect(validator?.("made-up-portfolio", {})).not.toBe(true);
  });

  it("requires both holders, section 7.2's two person rule", () => {
    // Nobody is the only holder of anything.
    const holder = fieldByName(portfolioDef, "holder");
    const secondHolder = fieldByName(portfolioDef, "secondHolder");
    expect(holder?.type).toBe("reference");
    expect(secondHolder?.type).toBe("reference");
    expect(calledRuleMethods(holder)).toContain("required");
    expect(calledRuleMethods(secondHolder)).toContain("required");
  });

  it("refuses to let the second holder be the same person as the first", () => {
    const secondHolder = fieldByName(portfolioDef, "secondHolder");
    const [validator] = customValidatorsOf(secondHolder);
    expect(validator).toBeTypeOf("function");

    const sameContext = { document: { holder: { _ref: "member-a" } } };
    const differentContext = { document: { holder: { _ref: "member-a" } } };
    expect(validator?.({ _ref: "member-a" }, sameContext)).not.toBe(true);
    expect(validator?.({ _ref: "member-b" }, differentContext)).toBe(true);
  });

  it("allows a genuine third holder without requiring one", () => {
    const additional = fieldByName(portfolioDef, "additionalHolders");
    expect(additional?.type).toBe("array");
    expect(calledRuleMethods(additional)).not.toContain("required");
  });
});

// ---------------------------------------------------------------------------
// minutes: public and withheld, structurally different
// ---------------------------------------------------------------------------

describe("minutes", () => {
  it("has exactly one place to write body content, publicSummary", () => {
    // The structural claim under test: there is nowhere else on this
    // document shaped to hold portable text, so there is nowhere else for
    // a fuller, unpublishable account to be typed by mistake.
    const portableTextFields = findFieldsByType(minutesDef, portableText.name);
    expect(portableTextFields.sort()).toEqual(["publicSummary.en", "publicSummary.th"]);
  });

  it("requires both locales of the public summary to leave draft", () => {
    const publicSummary = fieldByName(minutesDef, "publicSummary");
    const th = fieldByName(publicSummary, "th");
    const en = fieldByName(publicSummary, "en");
    expect(calledRuleMethods(th)).toEqual(expect.arrayContaining(["required", "min"]));
    expect(calledRuleMethods(en)).toEqual(expect.arrayContaining(["required", "min"]));
  });

  it("records a withheld item as a number and a closed category only, never as text", () => {
    // §6.3's sharp case, made structural: an officer physically cannot
    // paste a welfare account into a plain integer or a fixed picklist.
    const redactedItems = fieldByName(minutesDef, "redactedItems");
    const redactedItem = redactedItems?.of?.[0];
    const fieldNames = (redactedItem?.fields ?? []).map((f) => f.name);
    expect(fieldNames.sort()).toEqual(["category", "itemNumber"]);

    const itemNumber = fieldByName(redactedItem, "itemNumber");
    const category = fieldByName(redactedItem, "category");
    expect(itemNumber?.type).toBe("number");
    expect(category?.type).toBe("string");
    // A fixed list, not a free text field: the categories are closed.
    expect(category?.options?.list?.map((e) => e.value).sort()).toEqual(
      [...redactionCategories].sort()
    );
    expect(calledRuleMethods(itemNumber)).toEqual(
      expect.arrayContaining(["required", "integer", "positive"])
    );
    expect(calledRuleMethods(category)).toContain("required");
  });

  it("names attendees only by reference to the public roster, never by typed text", () => {
    const attendees = fieldByName(minutesDef, "attendees");
    expect(attendees?.type).toBe("array");
    const member = attendees?.of?.[0];
    expect(member?.type).toBe("reference");
  });

  it("requires a meeting date", () => {
    expect(calledRuleMethods(fieldByName(minutesDef, "meetingDate"))).toContain("required");
  });
});

// ---------------------------------------------------------------------------
// decision: what changed, not who argued for it
// ---------------------------------------------------------------------------

describe("decision", () => {
  it("records what was decided, when and what changed, all required", () => {
    expect(calledRuleMethods(fieldByName(decisionDef, "summary"))).toContain("required");
    expect(calledRuleMethods(fieldByName(decisionDef, "whatChanged"))).toContain("required");
    expect(calledRuleMethods(fieldByName(decisionDef, "decisionDate"))).toContain("required");
  });

  it("has no field for who argued for a decision, only the owning portfolio and an optional meeting", () => {
    const topLevel = (decisionDef.fields ?? []).map((f) => f.name).filter(Boolean);
    expect([...topLevel].sort()).toEqual(
      ["title", "slug", "decisionDate", "meeting", "summary", "whatChanged", "lifecycle"].sort()
    );
    const meeting = fieldByName(decisionDef, "meeting");
    expect(meeting?.type).toBe("reference");
    expect(calledRuleMethods(meeting)).not.toContain("required");
  });
});

// ---------------------------------------------------------------------------
// budgetEntry: money, not who spent it
// ---------------------------------------------------------------------------

describe("budgetEntry", () => {
  it("has no field for who requested, approved or spent anything", () => {
    const topLevel = (budgetEntryDef.fields ?? []).map((f) => f.name).filter(Boolean);
    expect([...topLevel].sort()).toEqual(
      ["description", "amount", "direction", "entryDate", "meeting", "lifecycle"].sort()
    );
  });

  it("requires a positive amount and a direction, so entries add up", () => {
    expect(calledRuleMethods(fieldByName(budgetEntryDef, "amount"))).toEqual(
      expect.arrayContaining(["required", "positive"])
    );
    expect(calledRuleMethods(fieldByName(budgetEntryDef, "direction"))).toContain("required");
    expect([...budgetEntryDirections].sort()).toEqual(["expense", "income"]);
  });
});

// ---------------------------------------------------------------------------
// regulation: effective dates and supersession
// ---------------------------------------------------------------------------

describe("regulation", () => {
  it("carries a required effective date", () => {
    const effectiveDate = fieldByName(regulationDef, "effectiveDate");
    expect(effectiveDate?.type).toBe("date");
    expect(calledRuleMethods(effectiveDate)).toContain("required");
  });

  it("cannot supersede itself", () => {
    const supersedes = fieldByName(regulationDef, "supersedes");
    expect(supersedes?.type).toBe("reference");
    const [validator] = customValidatorsOf(supersedes);
    expect(validator).toBeTypeOf("function");
    expect(validator?.({ _ref: "reg-1" }, { document: { _id: "reg-1" } })).not.toBe(true);
    expect(validator?.({ _ref: "reg-1" }, { document: { _id: "reg-2" } })).toBe(true);
  });

  it("has no manually set current flag: currency is derived, not hand set", () => {
    const topLevel = (regulationDef.fields ?? []).map((f) => f.name).filter(Boolean);
    expect(topLevel).not.toContain("isCurrent");
    expect(topLevel).not.toContain("current");
  });
});

// ---------------------------------------------------------------------------
// Every document type carries the shared lifecycle object, by name
// ---------------------------------------------------------------------------

describe("lifecycle on every owned document", () => {
  it("is present and required on every document type in this cluster", () => {
    for (const [docName, def] of Object.entries(documents)) {
      const lifecycleField = fieldByName(def, "lifecycle");
      expect(lifecycleField, `${docName} must carry lifecycle`).toBeDefined();
      expect(lifecycleField?.type, `${docName}.lifecycle must be the shared object`).toBe(
        "lifecycle"
      );
      expect(calledRuleMethods(lifecycleField), `${docName}.lifecycle must be required`).toContain(
        "required"
      );
    }
  });
});
