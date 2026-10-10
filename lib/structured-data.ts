/**
 * schema.org JSON-LD builders. Pages render the result with `<JsonLd>`, which
 * search engines read to understand what a page is about (a news article, an
 * event, a course, a club) beyond its title and description.
 */
import { localeHref, type Locale } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";
import { contact, socials } from "@/content/site";
import type { Course } from "@/content/course-review/types";
import { prerequisiteCodes } from "@/lib/course-review/facts";
import { prerequisites, type CourseNode } from "@/lib/courses/graph";
import type { ClubFrontmatter, NewsFrontmatter } from "@/lib/content";

type JsonLdObject = Record<string, unknown>;

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

const IN_LANGUAGE: Record<Locale, string> = { en: "en", th: "th" };

const POSTAL_ADDRESS: Record<Locale, { streetAddress: string; addressLocality: string }> = {
  en: { streetAddress: "2 Prachan Road", addressLocality: "Bangkok" },
  th: { streetAddress: "2 ถนนพระจันทร์", addressLocality: "กรุงเทพฯ" },
};

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
    email: contact.email,
    telephone: contact.phone.replace(/^0/, "+66 "),
    address: {
      "@type": "PostalAddress",
      ...POSTAL_ADDRESS[locale],
      postalCode: "10200",
      addressCountry: "TH",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: contact.email,
      telephone: contact.phone.replace(/^0/, "+66 "),
      availableLanguage: ["th", "en"],
      url: absoluteUrl(locale, "/contact"),
    },
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
    dateModified: frontmatter.updated ?? frontmatter.date,
    mainEntityOfPage: url,
    articleSection: frontmatter.category,
    author: { "@id": ORGANIZATION_ID, name: "BIR Student Association (BIRSA)" },
    publisher: { "@id": ORGANIZATION_ID, name: "BIR Student Association (BIRSA)" },
  };
}

/** The fields a schema.org `Course` is built from, whichever model the course came from. */
type CourseSchemaSource = {
  code: string;
  name: string;
  description: string;
  credits: number;
  prerequisites: string[];
};

function courseSchema(locale: Locale, course: CourseSchemaSource): JsonLdObject {
  const prerequisites = course.prerequisites.map((code) =>
    absoluteUrl(locale, `/student-life/course-reviews/${code}`)
  );
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    courseCode: course.code,
    description: course.description,
    url: absoluteUrl(locale, `/student-life/course-reviews/${course.code}`),
    inLanguage: IN_LANGUAGE[locale],
    provider: university,
    numberOfCredits: course.credits,
    ...(prerequisites.length ? { coursePrerequisites: prerequisites } : {}),
  };
}

export function courseJsonLd(locale: Locale, course: Course): JsonLdObject {
  return courseSchema(locale, {
    code: course.code,
    name: course.title[locale],
    description: course.description[locale],
    credits: course.credits.total,
    prerequisites: prerequisiteCodes(course.code),
  });
}

/**
 * The same schema for a course the review catalogue does not hold, built from
 * its latest curriculum entry. The title is English in both locales, as in the
 * curriculum documents, and the caller supplies the description because the
 * curriculum has none to give.
 */
export function curriculumCourseJsonLd(
  locale: Locale,
  node: CourseNode,
  description: string
): JsonLdObject {
  return courseSchema(locale, {
    code: node.code,
    name: node.title,
    description,
    credits: node.latest.credits,
    prerequisites: prerequisites(node.code, node.latest.version),
  });
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
