import { describe, expect, it } from "vitest";
import {
  getAllInformationGuideEntries,
  getInformationGuideEntries,
  getInformationGuideEntry,
  informationGuideFrontmatterSchema,
  informationTopics,
  isInformationTopic,
} from "@/lib/content";
import { resolveRelatedPath } from "@/lib/guide-related";
import { extractHeadings } from "@/lib/toc";
import { applyingSteps } from "@/content/information/applying-to-bir/steps";
import { locales } from "@/lib/i18n";

const guidePathPattern = /^\/services\/([a-z0-9-]+)\/([a-z0-9-]+)$/;

describe("information guides", () => {
  for (const topic of informationTopics) {
    for (const locale of locales) {
      it(`${topic} (${locale}) loads and has guides`, () => {
        expect(() => getInformationGuideEntries(locale, topic)).not.toThrow();
        expect(getInformationGuideEntries(locale, topic).length).toBeGreaterThan(0);
      });

      it(`${topic} (${locale}) is sorted by order ascending with unique orders`, () => {
        const orders = getInformationGuideEntries(locale, topic).map((e) => e.frontmatter.order);
        expect(orders).toEqual([...orders].sort((a, b) => a - b));
        expect(new Set(orders).size).toBe(orders.length);
      });

      it(`${topic} (${locale}) guides carry their folder as topic`, () => {
        for (const entry of getInformationGuideEntries(locale, topic)) {
          expect(entry.frontmatter.topic, entry.slug).toBe(topic);
        }
      });
    }

    it(`${topic} has the same slug set in en and th`, () => {
      const slugs = (locale: "en" | "th") =>
        getInformationGuideEntries(locale, topic)
          .map((e) => e.slug)
          .sort();
      expect(slugs("en")).toEqual(slugs("th"));
    });

    it(`${topic} guides match in order, audience and related between en and th`, () => {
      for (const en of getInformationGuideEntries("en", topic)) {
        const th = getInformationGuideEntry("th", topic, en.slug);
        expect(th, `${en.slug} missing in th`).not.toBeNull();
        expect(th?.frontmatter.order, `order differs for "${en.slug}"`).toBe(en.frontmatter.order);
        expect(th?.frontmatter.audience, `audience differs for "${en.slug}"`).toBe(
          en.frontmatter.audience
        );
        expect(th?.frontmatter.related, `related differs for "${en.slug}"`).toEqual(
          en.frontmatter.related
        );
      }
    });
  }

  it("recognises only listed topics", () => {
    expect(isInformationTopic("applying-to-bir")).toBe(true);
    expect(isInformationTopic("money")).toBe(false);
  });

  it("rejects a topic that does not match the folder or a related entry that is not a path", () => {
    const base = {
      title: "t",
      summary: "s",
      topic: "applying-to-bir",
      order: 1,
      updated: "2026-10-17",
      reviewed: "2026-10-17",
    };
    expect(informationGuideFrontmatterSchema.safeParse(base).success).toBe(true);
    expect(informationGuideFrontmatterSchema.safeParse({ ...base, topic: "money" }).success).toBe(
      false
    );
    expect(
      informationGuideFrontmatterSchema.safeParse({ ...base, related: ["money/monthly-costs"] })
        .success
    ).toBe(false);
    expect(
      informationGuideFrontmatterSchema.safeParse({
        ...base,
        related: ["/services/applying-to-bir/documents"],
      }).success
    ).toBe(true);
  });

  for (const locale of locales) {
    it(`every related path resolves to a real page (${locale})`, () => {
      for (const entry of getAllInformationGuideEntries(locale)) {
        for (const ref of entry.frontmatter.related) {
          expect(
            resolveRelatedPath(locale, ref),
            `"${entry.topic}/${entry.slug}" (${locale}) relates to missing "${ref}"`
          ).not.toBeNull();
          expect(ref, `"${entry.slug}" relates to itself`).not.toBe(
            `/services/${entry.topic}/${entry.slug}`
          );
        }
      }
    });

    it(`every quickAnswers anchor matches a heading id in its file (${locale})`, () => {
      for (const entry of getAllInformationGuideEntries(locale)) {
        const ids = new Set(extractHeadings(entry.content).map((heading) => heading.id));
        for (const answer of entry.frontmatter.quickAnswers) {
          if (!answer.anchor) continue;
          expect(
            ids.has(answer.anchor),
            `"${entry.topic}/${entry.slug}" (${locale}) quick answer anchor "${answer.anchor}" matches no heading`
          ).toBe(true);
        }
      }
    });

    it(`every internal link in an information guide points at a real guide (${locale})`, () => {
      for (const entry of getAllInformationGuideEntries(locale)) {
        const links = [...entry.content.matchAll(/\]\((\/services\/[a-z0-9/-]+)(?:#[^)]*)?\)/g)];
        for (const [, href] of links) {
          expect(
            resolveRelatedPath(locale, href as string),
            `"${entry.slug}" (${locale}) links to missing "${href}"`
          ).not.toBeNull();
        }
      }
    });
  }

  it("the applying step by step only links to real guides, in both locales", () => {
    const hrefs = applyingSteps.flatMap((step) => step.tasks.map((task) => task.href ?? ""));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const locale of locales) {
      for (const href of hrefs) {
        const match = guidePathPattern.exec(href);
        expect(match, href).not.toBeNull();
        expect(
          getInformationGuideEntry(locale, "applying-to-bir", match?.[2] as string),
          `${href} (${locale})`
        ).not.toBeNull();
      }
    }
  });

  it("the step by step has unique step and task ids and both languages for every label", () => {
    const stepIds = applyingSteps.map((s) => s.id);
    expect(new Set(stepIds).size).toBe(stepIds.length);
    const taskIds = applyingSteps.flatMap((s) => s.tasks.map((t) => t.id));
    expect(new Set(taskIds).size).toBe(taskIds.length);
    for (const step of applyingSteps) {
      expect(step.title.en && step.title.th).toBeTruthy();
      for (const task of step.tasks) expect(task.label.en && task.label.th).toBeTruthy();
    }
  });
});
