import type { Locale } from "@/lib/i18n";
import { formatDate, localeHref } from "@/lib/i18n";
import type { NewsFrontmatter } from "@/lib/content";
import Card, { CardTitle, CardMeta } from "@/components/bds/Card";
import Tag from "@/components/bds/Tag";
import { Text } from "@/components/bds/Type";
import type { HeadingLevel } from "@/components/bds/Type";

/**
 * `/whats-on` (Wave 5, `components/whatson/`).
 *
 * A single news or event entry, on `/whats-on/news` and `/whats-on/events`.
 * Built on the bds `Card` family (content cluster) rather than `components/news/NewsCard.tsx`,
 * which this replaces: that version reached for raw Tailwind `text-xs`/`text-sm`
 * utilities, which is defect D7 (BUILD-BRIEF-2.0 §7) on a page this wave owns.
 */
export type NewsCardLabels = {
  event: string;
  news: string;
  when: string;
  where: string;
};

export type NewsCardProps = {
  locale: Locale;
  slug: string;
  frontmatter: NewsFrontmatter;
  labels: NewsCardLabels;
  /**
   * Heading level for the card title. The results grid sits directly under
   * the page's h1 with no intervening heading, so callers pass `2` there to
   * avoid skipping a level.
   */
  headingLevel?: HeadingLevel;
};

export default function NewsCard({
  locale,
  slug,
  frontmatter,
  labels,
  headingLevel = 3,
}: NewsCardProps) {
  const href = localeHref(locale, `/whats-on/news/${slug}`);
  const isEvent = frontmatter.type === "event";

  return (
    <Card href={href}>
      <CardMeta>
        <Tag variant={isEvent ? "brand" : "neutral"}>{isEvent ? labels.event : labels.news}</Tag>
        <Text as="span" step="body-sm" className="text-muted">
          {formatDate(locale, frontmatter.date)}
        </Text>
      </CardMeta>
      <CardTitle href={href} level={headingLevel}>
        {frontmatter.title}
      </CardTitle>
      <Text step="body-sm" className="text-muted">
        {frontmatter.summary}
      </Text>
      {isEvent && (frontmatter.start || frontmatter.location) ? (
        <dl className="mt-1 flex flex-col gap-1">
          {frontmatter.start ? (
            <div className="flex flex-wrap gap-1.5">
              <Text as="dt" step="body-sm" className="font-semibold text-muted">
                {labels.when}
              </Text>
              <Text as="dd" step="body-sm" className="text-ink">
                {formatDate(locale, frontmatter.start)}
              </Text>
            </div>
          ) : null}
          {frontmatter.location ? (
            <div className="flex flex-wrap gap-1.5">
              <Text as="dt" step="body-sm" className="font-semibold text-muted">
                {labels.where}
              </Text>
              <Text as="dd" step="body-sm" className="text-ink">
                {frontmatter.location}
              </Text>
            </div>
          ) : null}
        </dl>
      ) : null}
    </Card>
  );
}
