/**
 * The design system contracts (REDESIGN-2.0 §4.1, §4.6, §4.7).
 *
 * These assert the properties that are supposed to survive turnover: the
 * palette stays finite, the escape hatches stay absent, alt text stays
 * bilingual, and no component ships without a usage rule. Each one exists
 * because the reason for it will be forgotten before the rule is, and a rule
 * whose reason has been forgotten gets removed by whoever is in a hurry.
 */
import { describe, expect, it } from "vitest";

import {
  altTextProblems,
  aspectRatios,
  aspectRatioValue,
  budgetFor,
  MAX_SOURCE_BYTES,
  storeFor,
  templateImageBudgets,
  type ImageField,
} from "@/components/bds/imageContract";
import { clusters, manifest, manifestByName } from "@/components/bds/manifest";
import {
  allowedBlocks,
  allowedMarks,
  forbiddenSchemaFields,
  sectionPalette,
  sectionTypeIds,
} from "@/components/bds/sectionPalette";

describe("the component manifest", () => {
  it("names every component exactly once", () => {
    const names = manifest.map((entry) => entry.name);
    expect(names.length).toBe(new Set(names).size);
  });

  it("gives every component a usage rule saying what to use instead", () => {
    // §4.1. A component without this is how the twelfth module invents the
    // thirteenth kind of box.
    for (const entry of manifest) {
      expect(entry.usage.length, entry.name).toBeGreaterThan(40);
    }
  });

  it("assigns every component to exactly one Wave 2 cluster", () => {
    // Rule 2 (§11.2): two agents never hold the same path in the same wave.
    // Clusters are the unit of ownership, so this IS the partition check.
    for (const entry of manifest) {
      expect(clusters, entry.name).toContain(entry.cluster);
    }
  });

  it("keeps every cluster small enough for one agent", () => {
    for (const cluster of clusters) {
      const size = manifest.filter((e) => e.cluster === cluster).length;
      expect(size, `${cluster} cluster`).toBeGreaterThan(0);
      expect(size, `${cluster} cluster`).toBeLessThanOrEqual(15);
    }
  });

  it("carries the three new components that change what BIRSA can offer", () => {
    // §4.4. Named individually because they are the ones most likely to be
    // dropped for time, and each one is a capability rather than a polish.
    for (const name of ["ExitThisPage", "TaskList", "ServiceNavigation"]) {
      expect(manifestByName[name], name).toBeDefined();
      expect(manifestByName[name]!.status, name).toBe("new");
    }
  });

  it("does not build Tabs", () => {
    // §4.3: "probably do not build. Tabs hide content and hurt on mobile."
    expect(manifestByName["Tabs"]).toBeUndefined();
  });
});

describe("the section palette", () => {
  it("is finite and matches its id list", () => {
    expect(Object.keys(sectionPalette).sort()).toEqual([...sectionTypeIds].sort());
  });

  it("renders every section through a component in the manifest", () => {
    // §4.6 property 2: every section renders through a bds/ component, so a
    // design system change reaches every page an officer ever made.
    for (const section of Object.values(sectionPalette)) {
      expect(manifestByName[section.component], section.id).toBeDefined();
    }
  });

  it("has no raw HTML, embed or custom CSS escape hatch", () => {
    // §4.6 property 3. The pressure to add one of these arrives in week nine,
    // when something looks wrong and the person who knows why it must not
    // exist has graduated. This test is what is left of them.
    const serialised = JSON.stringify(sectionPalette).toLowerCase();
    for (const field of forbiddenSchemaFields) {
      expect(serialised, `section palette must not offer a "${field}" field`).not.toMatch(
        new RegExp(`"${field}"\\s*:`)
      );
    }
  });

  it("does not let an officer put an h1 in a page body", () => {
    // §9: the schema forbids the ways an editor can break accessibility. A
    // second h1 breaks the heading order the a11y suite asserts.
    expect(allowedBlocks).not.toContain("h1");
    expect(allowedBlocks).toContain("h2");
  });

  it("allows no mark that can carry styling", () => {
    expect([...allowedMarks].sort()).toEqual(["code", "em", "link", "strong"]);
  });
});

describe("the image contract", () => {
  it("offers a fixed set of aspect ratios", () => {
    // §4.7A: no arbitrary heights, so cards never jump and layout shift stays
    // at zero.
    expect([...aspectRatios]).toEqual(["16:9", "4:3", "1:1"]);
    expect(aspectRatioValue("1:1")).toBe(1);
    expect(aspectRatioValue("16:9")).toBeCloseTo(1.777, 2);
  });

  it("rejects a source file large enough to be a problem forever", () => {
    // §4.7D: a 12MB original is rejected at the door rather than stored.
    expect(MAX_SOURCE_BYTES).toBeLessThan(12 * 1024 * 1024);
  });

  describe("alt text validation (§4.7C)", () => {
    const base: ImageField = {
      assetId: "image-1",
      decorative: false,
      alt: { en: "Students at the welcome fair", th: "นักศึกษาในงานต้อนรับ" },
      ratio: "16:9",
    };

    it("accepts alt text present in both locales", () => {
      expect(altTextProblems(base)).toEqual([]);
    });

    it("blocks an image with no alt text at all", () => {
      expect(altTextProblems({ ...base, alt: null })).toContain("missing-locale");
    });

    it("blocks an image with English alt text and no Thai", () => {
      // Acceptance test row 36. An English-only alt text is a Thai screen
      // reader user reading English.
      expect(altTextProblems({ ...base, alt: { en: "Students", th: "  " } })).toContain("empty");
    });

    it("blocks alt text that begins 'image of'", () => {
      expect(
        altTextProblems({ ...base, alt: { en: "Image of the fair", th: "ภาพงานต้อนรับ" } })
      ).toContain("starts-with-image-of");
    });

    it("blocks alt text identical to the caption", () => {
      expect(
        altTextProblems({
          ...base,
          caption: { en: "Students at the welcome fair", th: "นักศึกษาในงานต้อนรับ" },
        })
      ).toContain("same-as-caption");
    });

    it("accepts a decorative image with no alt text", () => {
      // Row 37: marking an image decorative is a deliberate choice that hides
      // the alt field and renders alt="".
      expect(altTextProblems({ ...base, decorative: true, alt: null })).toEqual([]);
    });

    it("blocks an image that is both decorative and has alt text", () => {
      expect(altTextProblems({ ...base, decorative: true })).toEqual(["alt-on-decorative"]);
    });
  });

  describe("per-template budgets (§4.7D, §9)", () => {
    it("allows at most one priority hero per template", () => {
      // A page with two priority images has no priority image.
      for (const budget of templateImageBudgets) {
        expect(typeof budget.heroAllowed, budget.template).toBe("boolean");
      }
    });

    it("gives a service step no images and the tightest LCP", () => {
      // A student filling in a welfare or a loan form does not need a
      // photograph, and §5.4's sensitive services must not carry one at all.
      const step = budgetFor("service-step")!;
      expect(step.maxBodyImages).toBe(0);
      expect(step.heroAllowed).toBe(false);
      expect(step.lcpMs).toBeLessThanOrEqual(1800);
    });

    it("keeps the home page free of a hero, per §8.2's four blocks", () => {
      expect(budgetFor("home")!.heroAllowed).toBe(false);
    });

    it("returns null for a template with no budget rather than a default", () => {
      // A silent default is how a template ships unbudgeted.
      expect(budgetFor("not-a-template")).toBeNull();
    });
  });

  describe("where images live (§4.7F, §6.3)", () => {
    it("sends published content and portraits to the CMS", () => {
      expect(storeFor("content")).toBe("cms");
      expect(storeFor("committee-portrait")).toBe("cms");
    });

    it("keeps every operational upload out of the CMS", () => {
      // The boundary in §6.3 holds without exception. These may contain
      // personal data, they are subject to retention, and they must be
      // deletable by lib/privacy/retention.ts.
      expect(storeFor("equipment-photo")).toBe("blob");
      expect(storeFor("reimbursement-receipt")).toBe("blob");
      expect(storeFor("found-item-photo")).toBe("blob");
    });
  });
});
