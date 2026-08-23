import Card, { CardMeta, CardTitle } from "@/components/bds/Card";
import { Text } from "@/components/bds/Type";
import type { Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/i18n";
import type { NewsFrontmatter } from "@/lib/content";

/**
 * One row of the home page's "what's on" block (REDESIGN-2.0 §8.2, "what is
 * on as three items and a link"). A news or event entry carries a date and a
 * category, which is exactly what `Card`'s own usage rule in
 * `components/bds/manifest.ts` calls for over `NavList`: "a listing item
 * carrying dates, tags or images".
 *
 * Kept to a small, self-contained component in `components/home/` (this
 * wave's own path) rather than reusing 1.0's `components/news/NewsCard.tsx`,
 * which is not owned by this wave and is not built on the bds type scale.
 */
export type WhatsOnCardProps = {
  locale: Locale;
  href: string;
  frontmatter: NewsFrontmatter;
  eventLabel: string;
  newsLabel: string;
};

export default function WhatsOnCard({
  locale,
  href,
  frontmatter,
  eventLabel,
  newsLabel,
}: WhatsOnCardProps) {
  return (
    <Card href={href}>
      <CardMeta>
        <Text as="span" step="body-sm" className="font-semibold text-brand-deep uppercase">
          {frontmatter.type === "event" ? eventLabel : newsLabel}
        </Text>
        <Text as="span" step="body-sm" className="text-muted">
          {formatDate(locale, frontmatter.date)}
        </Text>
      </CardMeta>
      <CardTitle href={href} level={3}>
        {frontmatter.title}
      </CardTitle>
      <Text step="body-sm" className="text-muted">
        {frontmatter.summary}
      </Text>
    </Card>
  );
}
