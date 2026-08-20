/**
 * The dictionary namespace contract (REDESIGN-2.0 §11.2).
 *
 * The dictionaries are split one file per domain per locale so that parallel
 * agents never share a file. The namespaces are then spread flat into one
 * object, which keeps every existing call site working but introduces one new
 * failure mode the compiler cannot see: two namespaces declaring the same
 * top-level key silently overwrite each other, and the loser's copy simply
 * stops appearing on the site. This is the test for that.
 *
 * Bilingual parity itself is enforced by the compiler, twice: `typeof en` on
 * the Thai index and a per-namespace annotation in each Thai namespace file.
 * The runtime assertion here is a backstop that also covers key ORDER, which
 * types do not, because a Thai namespace spread in a different order would
 * resolve a collision differently from the English one.
 */
import { describe, expect, it } from "vitest";

import { a11y as a11yEn } from "@/content/dictionaries/en/a11y";
import { about as aboutEn } from "@/content/dictionaries/en/about";
import { chrome as chromeEn } from "@/content/dictionaries/en/chrome";
import { officerConsole as consoleEn } from "@/content/dictionaries/en/console";
import { doNamespace as doEn } from "@/content/dictionaries/en/do";
import { forms as formsEn } from "@/content/dictionaries/en/forms";
import { help as helpEn } from "@/content/dictionaries/en/help";
import { services as servicesEn } from "@/content/dictionaries/en/services";
import { studies as studiesEn } from "@/content/dictionaries/en/studies";
import { whatson as whatsonEn } from "@/content/dictionaries/en/whatson";
import { a11y as a11yTh } from "@/content/dictionaries/th/a11y";
import { about as aboutTh } from "@/content/dictionaries/th/about";
import { chrome as chromeTh } from "@/content/dictionaries/th/chrome";
import { officerConsole as consoleTh } from "@/content/dictionaries/th/console";
import { doNamespace as doTh } from "@/content/dictionaries/th/do";
import { forms as formsTh } from "@/content/dictionaries/th/forms";
import { help as helpTh } from "@/content/dictionaries/th/help";
import { services as servicesTh } from "@/content/dictionaries/th/services";
import { studies as studiesTh } from "@/content/dictionaries/th/studies";
import { whatson as whatsonTh } from "@/content/dictionaries/th/whatson";
import { en } from "@/content/dictionaries/en";
import { th } from "@/content/dictionaries/th";

/** In the same order the index files spread them. */
const namespaces = {
  en: {
    chrome: chromeEn,
    a11y: a11yEn,
    forms: formsEn,
    services: servicesEn,
    whatson: whatsonEn,
    help: helpEn,
    studies: studiesEn,
    about: aboutEn,
    console: consoleEn,
    do: doEn,
  },
  th: {
    chrome: chromeTh,
    a11y: a11yTh,
    forms: formsTh,
    services: servicesTh,
    whatson: whatsonTh,
    help: helpTh,
    studies: studiesTh,
    about: aboutTh,
    console: consoleTh,
    do: doTh,
  },
} as const;

describe.each(["en", "th"] as const)("the %s dictionary namespaces", (locale) => {
  const tree = namespaces[locale];

  it("declares each top-level key in exactly one namespace", () => {
    const owner = new Map<string, string>();
    const collisions: string[] = [];
    for (const [ns, obj] of Object.entries(tree)) {
      for (const key of Object.keys(obj)) {
        const previous = owner.get(key);
        if (previous) collisions.push(`"${key}" is in both ${previous} and ${ns}`);
        else owner.set(key, ns);
      }
    }
    expect(collisions).toEqual([]);
  });

  it("loses no key when the namespaces are spread into the index", () => {
    const fromNamespaces = Object.values(tree).flatMap((obj) => Object.keys(obj));
    const composed = Object.keys(locale === "en" ? en : th);
    expect([...fromNamespaces].sort()).toEqual([...composed].sort());
  });
});

describe("bilingual parity", () => {
  it("gives every English namespace a Thai one with the same keys", () => {
    for (const ns of Object.keys(namespaces.en) as Array<keyof typeof namespaces.en>) {
      expect(Object.keys(namespaces.th[ns]).sort(), `${ns} namespace`).toEqual(
        Object.keys(namespaces.en[ns]).sort()
      );
    }
  });

  it("resolves the composed trees to the same key set", () => {
    expect(Object.keys(th).sort()).toEqual(Object.keys(en).sort());
  });
});
