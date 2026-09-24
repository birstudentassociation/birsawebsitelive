/**
 * schema.org JSON-LD builders. Pages render the result with `<JsonLd>`, which
 * search engines read to understand what a page is about (a news article, an
 * event, a course, a club) beyond its title and description.
 */
import { localeHref, type Locale } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";
import { socials } from "@/content/site";
import type { Course } from "@/content/course-review/types";
import type { ClubFrontmatter, NewsFrontmatter } from "@/lib/content";

type JsonLdObject = Record<string, unknown>;

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

const IN_LANGUAGE: Record<Locale, string> = { en: "en", th: "th" };

const university = {
  "@type": "CollegeOrUniversity",
  name: "Thammasat University",
  url: "https://tu.ac.th",
};

export function organizationJsonLd(locale: Locale): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "BIR Student Association (BIRSA)",
    alternateName: ["BIRSA", "สโมสรนักศึกษา BIR"],
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/birsa-logo.png`,
    email: "birsa@tu.ac.th",
    parentOrganization: university,
    sameAs: socials
      .filter((s) => s.href.startsWith("https://") && !s.placeholder)
      .map((s) => s.href),
  };
}

export type BreadcrumbTrailItem = { label: string; href?: string };

export function breadcrumbJsonLd(locale: Locale, items: BreadcrumbTrailItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${localeHref(locale, item.href)}` } : {}),
    })),
  };
}

export function newsJsonLd(
  locale: Locale,
  slug: string,
  frontmatter: NewsFrontmatter,
  description: string
): JsonLdObject {
  const url = absoluteUrl(locale, `/news/${slug}`);
  const base = {
    "@context": "https://schema.org",
    url,
    inLanguage: IN_LANGUAGE[locale],
    description,
    image: `${url}/opengraph-image`,
  };

  if (frontmatter.type === "event" && frontmatter.start) {
    return {
      ...base,
      "@type": "Event",
      name: frontmatter.title,
      startDate: frontmatter.start,
      ...(frontmatter.end ? { endDate: frontmatter.end } : {}),
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      ...(frontmatter.location
        ? { location: { "@type": "Place", name: frontmatter.location } }
        : {}),
      organizer: { "@id": ORGANIZATION_ID, name: "BIR Student Association (BIRSA)" },
    };
  }

  return {
    ...base,
    "@type": "NewsArticle",
    headline: frontmatter.title,
    datePublished: frontmatter.date,
    mainEntityOfPage: url,
    articleSection: frontmatter.category,
    author: { "@id": ORGANIZATION_ID, name: "BIR Student Association (BIRSA)" },
    publisher: { "@id": ORGANIZATION_ID, name: "BIR Student Association (BIRSA)" },
  };
}

export function courseJsonLd(locale: Locale, course: Course): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title[locale],
    courseCode: course.code,
    description: course.description[locale],
    url: absoluteUrl(locale, `/student-life/course-reviews/${course.code}`),
    inLanguage: IN_LANGUAGE[locale],
    provider: university,
  };
}

export function clubJsonLd(
  locale: Locale,
  slug: string,
  frontmatter: ClubFrontmatter
): JsonLdObject {
  const sameAs = (frontmatter.links ?? [])
    .map((link) => link.href)
    .filter((href) => href.startsWith("https://"));
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: frontmatter.title,
    description: frontmatter.tagline,
    url: absoluteUrl(locale, `/clubs/${slug}`),
    parentOrganization: { "@id": ORGANIZATION_ID, name: "BIR Student Association (BIRSA)" },
    ...(sameAs.length ? { sameAs } : {}),
  };
}
