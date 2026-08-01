/**
 * Sitemap: enumerates every route in both locales. Slugs are derived from
 * the same content loaders the pages themselves use (`lib/content.ts`),
 * never hardcoded, so the sitemap can't drift out of sync with what
 * actually gets built.
 */
import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/lib/i18n";
import { getClubEntries, getEntries, getGuideEntries, type GuideAudience } from "@/lib/content";
import { documents } from "@/content/activity/regulations";
import { courses } from "@/content/course-review/courses";
import { service as smartAnswers } from "@/content/smart-answers";
import { onboardingAudiences } from "@/content/onboarding";
import { SITE_URL } from "@/lib/site-url";

const guideAudiences: GuideAudience[] = ["home", "international", "handbook"];

function url(locale: Locale, path: string): string {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}/${locale}${normalized}`;
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
      "/privacy",
      "/privacy/cookies",
      "/privacy/processing-record",
      // Entry point only, matching /contact and /clubs/start: the step pages
      // of a form journey are not worth indexing on their own.
      "/privacy/your-data",
    ];

    for (const path of staticPaths) {
      entries.push({ url: url(locale, path) });
    }

    for (const entry of getEntries("news", locale)) {
      entries.push({ url: url(locale, `/news/${entry.slug}`) });
    }

    for (const entry of getEntries("activity", locale)) {
      entries.push({ url: url(locale, `/activity/${entry.slug}`) });
    }

    for (const doc of documents) {
      entries.push({ url: url(locale, `/activity/regulations/${doc.slug}`) });
    }

    // Smart Answers: only the topic start pages are indexed. The stateful /q
    // step pages and the audience profile page carry robots noindex and are
    // deliberately absent here.
    for (const topic of smartAnswers.topics) {
      entries.push({ url: url(locale, `/answers/${topic.slug}`) });
    }

    for (const audience of onboardingAudiences) {
      entries.push({ url: url(locale, `/student-life/getting-started/${audience}`) });
    }

    for (const audience of guideAudiences) {
      entries.push({ url: url(locale, `/student-life/${audience}`) });
      for (const entry of getGuideEntries(locale, audience)) {
        entries.push({ url: url(locale, `/student-life/${audience}/${entry.slug}`) });
      }
    }

    // Course reviews are a dedicated route (not a guide track), so
    // `getGuideEntries` never emits them; list each course code explicitly.
    for (const course of courses) {
      entries.push({ url: url(locale, `/student-life/course-reviews/${course.code}`) });
    }

    for (const club of getClubEntries(locale)) {
      entries.push({ url: url(locale, `/clubs/${club.slug}`) });
    }
  }

  return entries;
}
