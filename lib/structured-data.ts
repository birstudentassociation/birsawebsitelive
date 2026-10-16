/**
 * schema.org JSON-LD builders. Pages render the result with `<JsonLd>`, which
 * search engines read to understand what a page is about (a news article, an
 * event, a course, a club) beyond its title and description.
 */
import { getDictionary, localeHref, type Locale } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";
import { contact, socials } from "@/content/site";
import type { Course } from "@/content/course-review/types";
import { prerequisiteCodes } from "@/lib/course-review/facts";
import { prerequisites, type CourseNode } from "@/lib/courses/graph";
import type { ClubFrontmatter, NewsFrontmatter } from "@/lib/content";
import type { RegulationDoc } from "@/content/activity/regulations/types";

type JsonLdObject = Record<string, unknown>;

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

const ORGANIZATION_NAME = "BIR Student Association (BIRSA)";

/** The site organisation as a reference other entities (author, publisher) can embed. */
function organizationRef(locale: Locale): JsonLdObject {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: ORGANIZATION_NAME,
    url: `${SITE_URL}/${locale}`,
  };
}

const IN_LANGUAGE: Record<Locale, string> = { en: "en", th: "th" };

const POSTAL_ADDRESS: Record<Locale, { streetAddress: string; addressLocality: string }> = {
  en: { streetAddress: "2 Prachan Road", addressLocality: "Bangkok" },
  th: { streetAddress: "2 ถนนพระจันทร์", addressLocality: "กรุงเทพฯ" },
};

const RANGSIT_POSTAL_ADDRESS: Record<
  Locale,
  { streetAddress: string; addressLocality: string; addressRegion: string }
> = {
  en: {
    streetAddress: "99 Moo 18 Phahonyothin Road",
    addressLocality: "Khlong Luang",
    addressRegion: "Pathum Thani",
  },
  th: {
    streetAddress: "99 หมู่ 18 ถนนพหลโยธิน",
    addressLocality: "คลองหลวง",
    addressRegion: "ปทุมธานี",
  },
};

const THA_PRACHAN_REGION: Record<Locale, string> = { en: "Bangkok", th: "กรุงเทพฯ" };

const DEFAULT_EVENT_LOCATION: Record<Locale, string> = {
  en: "Thammasat University",
  th: "มหาวิทยาลัยธรรมศาสตร์",
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
    description: getDictionary(locale).site.description,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/birsa-logo.png`,
      width: 512,
      height: 512,
    },
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

export function websiteJsonLd(locale: Locale): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "BIRSA",
    alternateName: ["BIR Student Association", "สโมสรนักศึกษา BIR"],
    url: `${SITE_URL}/`,
    inLanguage: IN_LANGUAGE[locale],
    publisher: { "@id": ORGANIZATION_ID },
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
    const organizer = {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
      url: `${SITE_URL}/${locale}`,
    };
    const isRangsit = /Rangsit|รังสิต/.test(frontmatter.location ?? "");
    const address = isRangsit
      ? { ...RANGSIT_POSTAL_ADDRESS[locale], postalCode: "12120" }
      : {
          ...POSTAL_ADDRESS[locale],
          addressRegion: THA_PRACHAN_REGION[locale],
          postalCode: "10200",
        };
    return {
      ...base,
      "@type": "Event",
      name: frontmatter.title,
      startDate: frontmatter.start,
      ...(frontmatter.end ? { endDate: frontmatter.end } : {}),
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: frontmatter.location || DEFAULT_EVENT_LOCATION[locale],
        address: { "@type": "PostalAddress", ...address, addressCountry: "TH" },
      },
      organizer,
      performer: organizer,
      offers: {
        "@type": "Offer",
        url,
        price: 0,
        priceCurrency: "THB",
        availability: "https://schema.org/InStock",
        validFrom: frontmatter.date,
      },
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
    author: organizationRef(locale),
    publisher: organizationRef(locale),
  };
}

export type ArticleJsonLdInput = {
  url: string;
  headline: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  image: string | string[];
  section?: string;
};

/** A schema.org `Article` published by the site organisation. Only dates that exist are emitted. */
export function articleJsonLd(locale: Locale, input: ArticleJsonLdInput): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: input.url,
    mainEntityOfPage: input.url,
    inLanguage: IN_LANGUAGE[locale],
    image: input.image,
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.section ? { articleSection: input.section } : {}),
    author: organizationRef(locale),
    publisher: organizationRef(locale),
  };
}

/** A regulation or notice page, as a schema.org `Legislation` issued by its authority. */
export function regulationJsonLd(locale: Locale, doc: RegulationDoc): JsonLdObject {
  const url = absoluteUrl(locale, `/activity/regulations/${doc.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Legislation",
    name: doc.citation[locale],
    alternateName: doc.shortTitle[locale],
    url,
    inLanguage: IN_LANGUAGE[locale],
    legislationPassedBy: { "@type": "Organization", name: doc.authority[locale] },
    publisher: organizationRef(locale),
    isPartOf: { "@type": "WebPage", url: absoluteUrl(locale, "/activity/regulations") },
  };
}

/** Wraps an organisation as the subject of a `ProfilePage`. */
function profilePage(
  locale: Locale,
  url: string,
  mainEntity: JsonLdObject,
  dateModified?: string
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url,
    inLanguage: IN_LANGUAGE[locale],
    ...(dateModified ? { dateModified } : {}),
    mainEntity,
  };
}

/** The contact page, about the site organisation. */
export function contactPageJsonLd(locale: Locale, name: string, description: string): JsonLdObject {
  const url = absoluteUrl(locale, "/contact");
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name,
    description,
    url,
    inLanguage: IN_LANGUAGE[locale],
    about: { "@id": ORGANIZATION_ID },
    mainEntity: { "@id": ORGANIZATION_ID },
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
  const url = absoluteUrl(locale, `/clubs/${slug}`);
  return profilePage(
    locale,
    url,
    {
      "@type": "Organization",
      "@id": `${url}#organization`,
      name: frontmatter.title,
      description: frontmatter.tagline,
      url,
      parentOrganization: { "@id": ORGANIZATION_ID, name: ORGANIZATION_NAME },
      ...(sameAs.length ? { sameAs } : {}),
    },
    frontmatter.updated
  );
}
