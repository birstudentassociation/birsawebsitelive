/**
 * /llms.txt: a Markdown map of the site for language models and AI agents
 * (https://llmstxt.org). Lighthouse's Agentic Browsing audit fetches it and
 * expects Markdown with at least one H1.
 *
 * Built from the same content loaders as `app/sitemap.ts`, so it lists what
 * actually gets built. Prerendered and regenerated daily, so the request is
 * a CDN hit rather than a function call. The path has a dot in it, so
 * `proxy.ts` never sees it and it is not redirected into a locale.
 */
import {
  getClubEntries,
  getEntries,
  getGuideEntries,
  guideTopics,
  isArchivedEvent,
} from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";

export const dynamic = "force-static";
export const revalidate = 86400;

/** How many recent news posts to list. Older ones are in the sitemap. */
const NEWS_LIMIT = 20;

function link(title: string, path: string, description?: string): string {
  const clean = description?.replace(/\s+/g, " ").trim();
  return `- [${title}](${SITE_URL}/en${path === "/" ? "" : path})${clean ? `: ${clean}` : ""}`;
}

function buildLlmsTxt(): string {
  const dict = getDictionary("en");
  const lines: string[] = [
    `# ${dict.site.name} (${dict.site.fullName})`,
    "",
    `> ${dict.site.description}`,
    "",
    "Every page exists in English under `/en/` and in Thai under `/th/` with the same path. " +
      "Links point to the English version.",
    "",
    "## Main pages",
    "",
    link("Home", "/"),
    link("What's on", "/news", "News and events from BIRSA"),
    link("Student life", "/student-life", "Guides for BIR students at Thammasat"),
    link(
      "Course reviews",
      "/student-life/course-reviews",
      "Student reviews and facts for BIR courses"
    ),
    link("Getting started", "/student-life/getting-started", "Where to start for new students"),
    link("Clubs", "/clubs", "Student clubs and how to join"),
    link("Find a service", "/services", "University services and BIRSA equipment loans"),
    link("BIRSA activity", "/activity", "What BIRSA does, its roles and its regulations"),
    link("Regulations", "/activity/regulations"),
    link("Campus conditions", "/conditions", "Weather, air quality and flooding near campus"),
    link("Contact", "/contact"),
    link("Privacy", "/privacy"),
    "",
    "## Student life guides",
    "",
  ];

  for (const topic of guideTopics) {
    for (const guide of getGuideEntries("en", topic)) {
      if (guide.frontmatter.placeholder) continue;
      lines.push(
        link(
          guide.frontmatter.title,
          `/student-life/${topic}/${guide.slug}`,
          guide.frontmatter.summary
        )
      );
    }
  }

  lines.push("", "## BIRSA activity", "");
  for (const page of getEntries("activity", "en")) {
    if (page.frontmatter.placeholder) continue;
    lines.push(link(page.frontmatter.title, `/activity/${page.slug}`, page.frontmatter.summary));
  }

  lines.push("", "## Clubs", "");
  for (const club of getClubEntries("en")) {
    if (club.frontmatter.placeholder) continue;
    lines.push(link(club.frontmatter.title, `/clubs/${club.slug}`, club.frontmatter.tagline));
  }

  lines.push("", "## Recent news", "");
  const news = getEntries("news", "en").filter(
    (post) => !post.frontmatter.placeholder && !isArchivedEvent(post.frontmatter)
  );
  for (const post of news.slice(0, NEWS_LIMIT)) {
    lines.push(link(post.frontmatter.title, `/news/${post.slug}`, post.frontmatter.summary));
  }

  lines.push("", "## Optional", "", `- [Sitemap](${SITE_URL}/sitemap.xml)`, "");
  return lines.join("\n");
}

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
