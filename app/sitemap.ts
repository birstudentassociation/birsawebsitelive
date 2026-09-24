/**
 * Sitemap: enumerates every route in both locales. Slugs are derived from
 * the same content loaders the pages themselves use (`lib/content.ts`),
 * never hardcoded, so the sitemap can't drift out of sync with what
 * actually gets built.
 */
import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/lib/i18n";
import {
  getClubEntries,
  getEntries,
  getGuideEntries,
  isArchivedEvent,
  type GuideAudience,
} from "@/lib/content";
import { documents } from "@/content/activity/regulations";
import { courses } from "@/content/course-review/courses";
import { service as smartAnswers } from "@/content/smart-answers";
import { onboardingAudiences } from "@/content/onboarding";
import { SITE_URL } from "@/lib/site-url";

/** Regenerated daily so events drop out a year after they end. */
export const revalidate = 86400;

const guideAudiences: GuideAudience[] = ["home", "international", "handbook"];

function url(locale: Locale, path: string): string {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}/${locale}${normalized}`;
}

/** One sitemap entry, with its Thai and English versions linked as alternates. */
function entry(locale: Locale, path: string, lastModified?: string): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = { "x-default": url("th", path) };
  for (const loc of locales) languages[loc] = url(loc, path);
  return {
    url: url(locale, path),
    ...(lastModified ? { lastModified } : {}),
    alternates: { languages },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const staticPaths = [
      "/",
      "/quick",
      "/news",
      "/contact",
      "/activity",
      "/activity/roles",
      "/activity/regulations",
      "/clubs",
      "/clubs/start",
      "/student-life",
      "/student-life/course-reviews",
      "/student-life/getting-started",
      "/answers",
      "/services",
      "/services/university-services",
      "/services/equipment-loan",
      "/services/equipment-loan/status",
      "/standards",
      // Indexable, and offered as a destination by the site's own search
      // (lib/search/pages.ts), so it belongs here too. Its /feedback/sent
      // confirmation carries robots noindex and stays out, like the other
      // journey end points.
      "/feedback",
      "/privacy",
      "/privacy/cookies",
      "/privacy/processing-record",
      // Entry point only, matching /contact and /clubs/start: the step pages
      // of a form journey are not worth indexing on their own.
      "/privacy/your-data",
    ];

    for (const path of staticPaths) {
      entries.push(entry(locale, path));
    }

    for (const post of getEntries("news", locale)) {
      if (isArchivedEvent(post.frontmatter)) continue;
      entries.push(entry(locale, `/news/${post.slug}`, post.frontmatter.date));
    }

    for (const page of getEntries("activity", locale)) {
      entries.push(entry(locale, `/activity/${page.slug}`, page.frontmatter.updated));
    }

    for (const doc of documents) {
      entries.push(entry(locale, `/activity/regulations/${doc.slug}`));
    }

    // Smart Answers: only the topic start pages are indexed. The stateful /q
    // step pages and the audience profile page carry robots noindex and are
    // deliberately absent here.
    for (const topic of smartAnswers.topics) {
      entries.push(entry(locale, `/answers/${topic.slug}`));
    }

    for (const audience of onboardingAudiences) {
      entries.push(entry(locale, `/student-life/getting-started/${audience}`));
    }

    for (const audience of guideAudiences) {
      entries.push(entry(locale, `/student-life/${audience}`));
      for (const guide of getGuideEntries(locale, audience)) {
        entries.push(
          entry(locale, `/student-life/${audience}/${guide.slug}`, guide.frontmatter.updated)
        );
      }
    }

    // Course reviews are a dedicated route (not a guide track), so
    // `getGuideEntries` never emits them; list each course code explicitly.
    for (const course of courses) {
      entries.push(entry(locale, `/student-life/course-reviews/${course.code}`));
    }

    for (const club of getClubEntries(locale)) {
      entries.push(entry(locale, `/clubs/${club.slug}`, club.frontmatter.updated));
    }
  }

  return entries;
}
