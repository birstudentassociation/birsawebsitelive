import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { SITE_URL } from "@/lib/site-url";

describe("robots", () => {
  const result = robots();
  const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
  const rule = rules[0]!;

  it("applies to all crawlers", () => {
    expect(rules).toHaveLength(1);
    expect(rule.userAgent).toBe("*");
  });

  it("allows the site and the Open House share image but not the rest of /api/", () => {
    expect(rule.allow).toEqual(["/", "/api/openhouse-card"]);
    expect(rule.disallow).toEqual(["/api/"]);
  });

  it("does not hide officer pages, so their noindex stays visible", () => {
    const disallow = ([] as string[]).concat(rule.disallow ?? []);
    expect(disallow.some((d) => d.includes("officer"))).toBe(false);
  });

  it("points at the sitemap", () => {
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});
