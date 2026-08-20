/**
 * The redirect gate (REDESIGN-2.0 §3.4).
 *
 * "No URL that works today may stop working." This test is how that sentence
 * is enforced rather than intended. It walks the 1.0 sitemap, which is
 * generated from the same content loaders the pages themselves use and so
 * cannot drift from what actually gets built, and asserts that every path
 * either stays where it is or resolves through `lib/redirects.ts` to a 2.0
 * route family.
 *
 * It is deliberately a unit test rather than an e2e one. An e2e test can only
 * check redirects that are wired up, and the map is checked in from Wave 0
 * while the targets are built in Wave 5. This one fails the moment a route
 * family moves without a rule, which is the point at which it is cheap to fix.
 */
import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import {
  redirectRules,
  resolveRedirect,
  resolveRedirectChain,
  routeFamilies2_0,
} from "@/lib/redirects";
import { locales } from "@/lib/i18n";

/** Every 1.0 path, locale prefix stripped, deduplicated across locales. */
const paths1_0 = [
  ...new Set(
    sitemap().map((entry) => {
      const { pathname } = new URL(entry.url);
      for (const locale of locales) {
        if (pathname === `/${locale}`) return "/";
        if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
      }
      return pathname;
    })
  ),
].sort();

/** Paths §3.2 keeps exactly where they are. */
const unmoved = new Set([
  "/",
  "/contact",
  "/feedback",
  "/privacy",
  "/privacy/cookies",
  "/privacy/processing-record",
  "/privacy/your-data",
  "/standards",
]);

describe("the 1.0 sitemap", () => {
  it("is not empty, so a passing run means something", () => {
    // Guards against the loaders returning nothing and every assertion below
    // passing vacuously.
    expect(paths1_0.length).toBeGreaterThan(50);
  });

  it("sends every path that moves to a 2.0 route family", () => {
    const stranded: string[] = [];
    for (const path of paths1_0) {
      if (unmoved.has(path)) continue;
      const target = resolveRedirect(path);
      if (target === null) {
        stranded.push(path);
        continue;
      }
      const inFamily = routeFamilies2_0.some(
        (family) => target === family || target.startsWith(`${family}/`)
      );
      if (!inFamily) stranded.push(`${path} -> ${target} (no 2.0 route family)`);
    }
    expect(stranded).toEqual([]);
  });
});

describe("the redirect rules", () => {
  it("resolves every rule in a single hop", () => {
    // A rule whose target is itself a source is a chain: an extra round trip
    // for the reader, and a cycle waiting to happen once the CMS slug history
    // starts feeding rules in at Wave 3.
    const chained = redirectRules
      .filter((rule) => resolveRedirect(rule.to) !== null)
      .map((rule) => `${rule.from} -> ${rule.to} -> ${resolveRedirect(rule.to)}`);
    expect(chained).toEqual([]);
  });

  it("settles every 1.0 path without exceeding the hop limit", () => {
    for (const path of paths1_0) {
      expect(() => resolveRedirectChain(path)).not.toThrow();
    }
  });

  it("orders specific rules before the general ones they sit inside", () => {
    // `/clubs/start` after `/clubs` would send a club proposal into the club
    // directory. The ordering is load-bearing, so assert it rather than trust
    // the comment above the array.
    const misordered: string[] = [];
    redirectRules.forEach((rule, index) => {
      const shadowedBy = redirectRules
        .slice(0, index)
        .find((earlier) => earlier.subtree && rule.from.startsWith(`${earlier.from}/`));
      if (shadowedBy) misordered.push(`${rule.from} is unreachable behind ${shadowedBy.from}`);
    });
    expect(misordered).toEqual([]);
  });

  it("gives every rule a reason a reviewer can check", () => {
    // A citation into REDESIGN-2.0: either a section (§3.2) or a numbered
    // defect (D2). A rule with no citation is a rule someone invented, and
    // the IA is a decision rather than work (§11.7).
    for (const rule of redirectRules) {
      expect(rule.why, rule.from).toMatch(/§\d|\bD[1-9]\b/);
    }
  });

  it("never redirects a utility route", () => {
    // §3.2: search, the language toggle, the emergency banner, /contact,
    // /privacy, /standards and /officer are never nav items but are always
    // reachable. Moving one would break a link in the footer of every page.
    for (const path of unmoved) {
      expect(resolveRedirect(path), path).toBeNull();
    }
  });
});
