import Card, { CardTitle } from "@/components/Card";
import Tag from "@/components/Tag";
import type { Locale } from "@/lib/i18n";
import { localeHref } from "@/lib/i18n";
import { clubCategories, type ClubSummary } from "@/content/clubs/clubs";

export type ClubCardProps = {
  club: ClubSummary;
  locale: Locale;
  /** dict.actions: "open to join" style label per locale. */
  openLabel: string;
  /**
   * Heading level for the card title. Defaults to h2 because the club grid is
   * the club index's top-level content, sitting directly under the h1, so an
   * h3 would skip a level.
   */
  headingLevel?: "h2" | "h3";
};

/** Card summarising a single club; the whole card links to its detail page. */
export default function ClubCard({ club, locale, openLabel, headingLevel = "h2" }: ClubCardProps) {
  const href = localeHref(locale, `/clubs/${club.slug}`);

  return (
    <Card href={href}>
      <div className="flex flex-wrap items-center gap-2">
        <Tag>{clubCategories[club.category][locale]}</Tag>
        {club.joinOpen ? <Tag variant="forest">{openLabel}</Tag> : null}
      </div>
      <CardTitle href={href} as={headingLevel}>
        {club.title}
      </CardTitle>
      <p className="text-sm leading-relaxed text-muted">{club.tagline}</p>
    </Card>
  );
}
