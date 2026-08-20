import Image from "next/image";
import clsx from "clsx";

import { assertValidImage, ratioClassName, resolveAlt, type ImageSource } from "@/components/bds/Figure";
import type { ImageField } from "@/components/bds/imageContract";
import type { Locale } from "@/lib/i18n";

/**
 * BIRSA Design System: `CardImage` (REDESIGN-2.0 §4.7B, media cluster).
 *
 * The image variant of `Card` (content cluster), at one of the three
 * contract aspect ratios so cards in a `card-grid` never jump and
 * cumulative layout shift stays at zero (§4.7A). Place it as the first
 * child inside a `Card`, above `CardTitle`; `Card` keeps its own padding
 * around it rather than this component bleeding to the card's edge, which
 * is what keeps the "generous margins" identity rule (§4.7A) true without
 * `CardImage` having to know anything about `Card`'s internal layout.
 *
 * No caption or credit here: a card's own `CardMeta` carries the trailing
 * detail line (a date, a category), and repeating a caption under every
 * image in a grid of cards is noise `Figure` does not have to solve for a
 * single reading-column image. Never sets `priority` (§4.7D): every card
 * image is a lazy body image, never the hero.
 */
export type CardImageProps = {
  image: ImageField;
  locale: Locale;
  source: ImageSource;
  sizes?: string;
  className?: string;
};

export default function CardImage({ image, locale, source, sizes, className }: CardImageProps) {
  const valid = assertValidImage(image, "CardImage");

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-md border border-line bg-sunken",
        ratioClassName[image.ratio],
        className
      )}
    >
      {valid ? (
        <Image
          src={source.src}
          alt={resolveAlt(image, locale)}
          fill
          sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          placeholder={source.blurDataURL ? "blur" : undefined}
          blurDataURL={source.blurDataURL}
          className="object-cover"
        />
      ) : null}
    </div>
  );
}
