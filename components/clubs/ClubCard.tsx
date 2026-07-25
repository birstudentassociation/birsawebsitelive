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
};

/** Card summarising a single club; the whole card links to its detail page. */
export default function ClubCard({ club, locale, openLabel }: ClubCardProps) {
  const href = localeHref(locale, `/clubs/${club.slug}`);

  return (
    <Card href={href}>
      <div className="flex flex-wrap items-center gap-2">
        <Tag>{clubCategories[club.category][locale]}</Tag>
        {club.joinOpen ? <Tag variant="forest">{openLabel}</Tag> : null}
      </div>
      <CardTitle href={href}>{club.title}</CardTitle>
      <p className="text-muted text-sm leading-relaxed">{club.tagline}</p>
    </Card>
  );
}
