import { describe, expect, it } from "vitest";
import { GET } from "@/app/[lang]/news/feed.xml/route";
import { getEntries, isArchivedEvent } from "@/lib/content";
import { documents } from "@/content/activity/regulations";
import { SITE_URL } from "@/lib/site-url";
import {
  ORGANIZATION_ID,
  articleJsonLd,
  clubJsonLd,
  contactPageJsonLd,
  organizationJsonLd,
  regulationJsonLd,
} from "@/lib/structured-data";
import type { ClubFrontmatter } from "@/lib/content";

describe("organizationJsonLd", () => {
  it("has a localized description and an ImageObject logo", () => {
    const th = organizationJsonLd("th") as Record<string, unknown>;
    const en = organizationJsonLd("en") as Record<string, unknown>;
    expect(th.description).not.toEqual(en.description);
    expect(en.logo).toEqual({
      "@type": "ImageObject",
      url: `${SITE_URL}/birsa-logo.png`,
      width: 512,
      height: 512,
    });
  });
});

describe("articleJsonLd", () => {
  const url = `${SITE_URL}/en/student-life/money/banking`;

  it("references the organisation and only includes dates that exist", () => {
    const data = articleJsonLd("en", {
      url,
      headline: "Banking",
      description: "How to open an account.",
      dateModified: "2026-09-30",
      image: `${url}/opengraph-image`,
    }) as Record<string, unknown>;
    expect(data["@type"]).toBe("Article");
    expect(data.inLanguage).toBe("en");
    expect(data.mainEntityOfPage).toBe(url);
    expect(data.dateModified).toBe("2026-09-30");
    expect(data).not.toHaveProperty("datePublished");
    expect(data.author).toMatchObject({ "@id": ORGANIZATION_ID, url: `${SITE_URL}/en` });
    expect(data.publisher).toMatchObject({ "@id": ORGANIZATION_ID });
  });
});

describe("clubJsonLd", () => {
  it("wraps the club organisation in a ProfilePage", () => {
    const frontmatter = {
      title: "Film club",
      tagline: "We watch films.",
      updated: "2026-08-01",
      links: [{ label: "IG", href: "https://instagram.com/film" }],
    } as ClubFrontmatter;
    const data = clubJsonLd("en", "film", frontmatter) as Record<string, unknown>;
    const url = `${SITE_URL}/en/clubs/film`;
    expect(data["@type"]).toBe("ProfilePage");
    expect(data.dateModified).toBe("2026-08-01");
    expect(data.mainEntity).toMatchObject({
      "@type": "Organization",
      "@id": `${url}#organization`,
      name: "Film club",
      sameAs: ["https://instagram.com/film"],
    });
  });
});

describe("regulationJsonLd and contactPageJsonLd", () => {
  it("describes a regulation as Legislation in the page language", () => {
    const doc = documents[0]!;
    const data = regulationJsonLd("th", doc) as Record<string, unknown>;
    expect(data["@type"]).toBe("Legislation");
    expect(data.name).toBe(doc.citation.th);
    expect(data.inLanguage).toBe("th");
    expect(data.url).toBe(`${SITE_URL}/th/activity/regulations/${doc.slug}`);
  });

  it("points the contact page at the organisation by @id", () => {
    const data = contactPageJsonLd("en", "Contact", "Get in touch.") as Record<string, unknown>;
    expect(data["@type"]).toBe("ContactPage");
    expect(data.about).toEqual({ "@id": ORGANIZATION_ID });
  });
});

describe("news RSS feed", () => {
  const call = (lang: string) =>
    GET(new Request("http://x"), { params: Promise.resolve({ lang }) });

  it("serves well-formed RSS in each locale without archived events", async () => {
    for (const lang of ["th", "en"] as const) {
      const response = await call(lang);
      expect(response.headers.get("content-type")).toBe("application/rss+xml; charset=utf-8");
      const body = await response.text();
      expect(body.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
      expect(body).toContain(`<language>${lang}</language>`);
      expect(body).toContain(`${SITE_URL}/${lang}/news/feed.xml`);
      expect(body.match(/<item>/g)?.length ?? 0).toBe(body.match(/<\/item>/g)?.length ?? -1);
      expect(body.match(/<item>/g)?.length ?? 0).toBeGreaterThan(0);
      expect(body).toMatch(/<pubDate>\w{3}, \d{2} \w{3} \d{4} 00:00:00 \+0700<\/pubDate>/);

      for (const post of getEntries("news", lang)) {
        if (isArchivedEvent(post.frontmatter)) {
          expect(body).not.toContain(`/news/${post.slug}<`);
        }
      }
    }
  });

  it("returns 404 for an unknown language", async () => {
    expect((await call("fr")).status).toBe(404);
  });
});
