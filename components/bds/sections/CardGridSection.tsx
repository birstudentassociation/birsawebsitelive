import clsx from "clsx";

import Card, { CardMeta, CardTitle } from "@/components/bds/Card";
import CardImage from "@/components/bds/CardImage";
import { Text } from "@/components/bds/Type";
import type { ImageField } from "@/components/bds/imageContract";
import type { ImageSource } from "@/components/bds/Figure";
import type { Locale } from "@/lib/i18n";

/**
 * BIRSA Design System: `CardGridSection` (REDESIGN-2.0 §4.6, §4.7B, media
 * cluster).
 *
 * Renders the `card-grid` entry of `components/bds/sectionPalette.ts`: two
 * or three columns of cards with optional images, through `Card` (content
 * cluster) and `CardImage` (this cluster). `columns` is a closed choice of
 * `2 | 3`, not a free-form class name, which is what `sectionPalette.ts`'s
 * "two or three columns only" actually means as a type rather than a
 * convention: there is no third value to reach for.
 *
 * The one section type the palette marks `carriesImages: true`. Each card's
 * `image` is optional and, when present, is a full `ImageField` plus its
 * resolved `source`, run through `CardImage`, which calls this cluster's
 * shared validation gate (`Figure.tsx`'s `assertValidImage`) exactly as
 * every other image in the system does: a card image with missing or
 * malformed alt text fails exactly as loudly here as anywhere else.
 */
export type CardGridSectionCard = {
  id: string;
  href?: string;
  title: string;
  /** A date, category or other trailing detail. Plain text; render several with a shared separator by joining before passing in. */
  meta?: string;
  description?: string;
  image?: { field: ImageField; source: ImageSource };
};

export type CardGridSectionProps = {
  cards: CardGridSectionCard[];
  columns: 2 | 3;
  /** Required only because a card's `image` needs it to resolve the right locale's alt text and caption; unused when no card carries an image. */
  locale: Locale;
};

const columnClass: Record<2 | 3, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
};

export default function CardGridSection({ cards, columns, locale }: CardGridSectionProps) {
  return (
    <ul className={clsx("grid grid-cols-1 gap-6", columnClass[columns])}>
      {cards.map((card) => (
        <li key={card.id}>
          <Card href={card.href} className="h-full">
            {card.image ? (
              <CardImage image={card.image.field} locale={locale} source={card.image.source} />
            ) : null}
            <CardTitle href={card.href}>{card.title}</CardTitle>
            {card.meta ? (
              <CardMeta>
                <Text as="span" step="body-sm" className="text-muted">
                  {card.meta}
                </Text>
              </CardMeta>
            ) : null}
            {card.description ? (
              <Text step="body-sm" className="text-muted">
                {card.description}
              </Text>
            ) : null}
          </Card>
        </li>
      ))}
    </ul>
  );
}
