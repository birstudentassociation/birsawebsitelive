import Card, { CardTitle, CardMeta } from "@/components/bds/Card";
import Tag from "@/components/bds/Tag";
import { Text } from "@/components/bds/Type";
import type { HeadingLevel } from "@/components/bds/Type";
import type { Locale } from "@/lib/i18n";
import { localeHref } from "@/lib/i18n";
import { clubCategories, type ClubSummary } from "@/content/clubs/clubs";

/**
 * `/whats-on` (Wave 5, `components/whatson/`).
 *
 * A single BIR club, on the `/whats-on/clubs` directory. Built on the bds
 * `Card` family; replaces `components/clubs/ClubCard.tsx`, which this wave
 * does not own and does not edit.
 */
export type ClubCardProps = {
  club: ClubSummary;
  locale: Locale;
  /** Visible label for a club currently taking members. */
  openLabel: string;
  /** The results grid sits directly under the page's h1, so callers pass `2` to avoid skipping a level. */
  headingLevel?: HeadingLevel;
};

export default function ClubCard({ club, locale, openLabel, headingLevel = 2 }: ClubCardProps) {
  const href = localeHref(locale, `/whats-on/clubs/${club.slug}`);

  return (
    <Card href={href}>
      <CardMeta>
        <Tag>{clubCategories[club.category][locale]}</Tag>
        {club.joinOpen ? <Tag variant="success">{openLabel}</Tag> : null}
      </CardMeta>
      <CardTitle href={href} level={headingLevel}>
        {club.title}
      </CardTitle>
      <Text step="body-sm" className="text-muted">
        {club.tagline}
      </Text>
    </Card>
  );
}
