import type { Locale, Dictionary } from "@/lib/i18n";
import { formatDate, localeHref } from "@/lib/i18n";
import type { NewsFrontmatter } from "@/lib/content";
import Card, { CardTitle } from "@/components/Card";
import Tag from "@/components/Tag";

export type NewsCardProps = {
  locale: Locale;
  dict: Dictionary;
  slug: string;
  frontmatter: NewsFrontmatter;
  /**
   * Heading level for the card title. Defaults to h3, which is right on the
   * home page where the cards sit under an h2 section heading. The news index
   * has no such intervening heading, so it passes h2 to avoid skipping a
   * level.
   */
  headingLevel?: "h2" | "h3";
};

function CalendarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="text-muted h-4 w-4 shrink-0">
      <rect
        x="3"
        y="4.5"
        width="14"
        height="12"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <path
        d="M3 8h14M6.5 3v3M13.5 3v3"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="text-muted h-4 w-4 shrink-0">
      <path
        d="M10 18s6-5.2 6-9.5A6 6 0 0 0 4 8.5C4 12.8 10 18 10 18Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <circle cx="10" cy="8.5" r="2" fill="none" stroke="currentColor" strokeWidth={1.5} />
    </svg>
  );
}

/**
 * Card for a single news/event entry. Events additionally show a small
 * "when" / "where" row using a `<dl>` so the relationship between the label
 * and value is conveyed to assistive tech, not just visually.
 */
export default function NewsCard({
  locale,
  dict,
  slug,
  frontmatter,
  headingLevel = "h3",
}: NewsCardProps) {
  const href = localeHref(locale, `/news/${slug}`);
  const isEvent = frontmatter.type === "event";

  return (
    <Card href={href}>
      <div className="flex flex-wrap items-center gap-2">
        <Tag variant={isEvent ? "brand" : "neutral"}>
          {isEvent ? dict.meta.event : dict.meta.news}
        </Tag>
        <span className="text-muted text-xs">{formatDate(locale, frontmatter.date)}</span>
      </div>
      <CardTitle href={href} as={headingLevel}>
        {frontmatter.title}
      </CardTitle>
      <p className="text-muted text-sm leading-relaxed">{frontmatter.summary}</p>
      {isEvent && (frontmatter.start || frontmatter.location) ? (
        <dl className="mt-1 flex flex-col gap-1.5 text-sm">
          {frontmatter.start ? (
            <div className="flex items-center gap-1.5">
              <CalendarIcon />
              <dt className="text-muted font-medium">{dict.meta.when}</dt>
              <dd>{formatDate(locale, frontmatter.start)}</dd>
            </div>
          ) : null}
          {frontmatter.location ? (
            <div className="flex items-center gap-1.5">
              <PinIcon />
              <dt className="text-muted font-medium">{dict.meta.where}</dt>
              <dd>{frontmatter.location}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}
    </Card>
  );
}
