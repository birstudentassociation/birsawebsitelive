import Image from "next/image";
import clsx from "clsx";

import {
  assertValidImage,
  ratioClassName,
  resolveAlt,
  resolveCaption,
  type ImageSource,
} from "@/components/bds/Figure";
import type { ImageField } from "@/components/bds/imageContract";
import { Text } from "@/components/bds/Type";
import type { Locale } from "@/lib/i18n";

/**
 * BIRSA Design System: `HeroImage` (REDESIGN-2.0 §4.7B, media cluster).
 *
 * At most one per page, and it is the LCP candidate (§4.7D), so it is the
 * ONLY image component in this cluster that sets `next/image`'s `priority`.
 * That is not a prop here: `priority` is hardcoded `true` below rather than
 * exposed for a caller to set or unset, so "only the hero gets it" is a
 * structural guarantee. `templateImageBudgets` in `imageContract.ts` is
 * where "at most one per page" is actually enforced (`heroAllowed`, checked
 * against the template at publish time); a React component rendered inside
 * a Server Component tree has no reliable way to count its own siblings
 * across a page without global mutable state, so this cluster does not
 * attempt that check here and the budget stays the single source of truth.
 *
 * FULL-BLEED IS RARE AND DELIBERATE, NOT THE DEFAULT (§4.7A). `fullBleed`
 * defaults to `false`: the ordinary hero keeps `Figure`'s hairline border and
 * soft inset so it still sits ON the page rather than floating against it. A
 * caller reaches for `fullBleed` only when a page genuinely wants the rare
 * edge-to-edge treatment; even then, this component still never places text
 * over the image (§4.7A: "no amount of scrim makes it reliably AA"), so a
 * full-bleed hero carries no title overlay prop at all. A page's `<h1>`
 * stays in `PageHeader`, below or beside the image, never on top of it.
 *
 * Shares `Figure`'s validation gate, ratio map and alt/caption resolution
 * rather than repeating them: a fix to how an invalid `ImageField` is
 * handled reaches every image in this cluster from one place.
 */
export type HeroImageProps = {
  image: ImageField;
  locale: Locale;
  source: ImageSource;
  sizes?: string;
  /** Rare and deliberate (§4.7A). Renders edge to edge with no border or inset. Never overlays text either way. */
  fullBleed?: boolean;
  className?: string;
};

export default function HeroImage({
  image,
  locale,
  source,
  sizes,
  fullBleed = false,
  className,
}: HeroImageProps) {
  const valid = assertValidImage(image, "HeroImage");
  const caption = resolveCaption(image, locale);
  const hasCaptionBlock = !image.decorative && (caption || image.credit);

  return (
    <figure className={clsx("flex flex-col gap-2", className)}>
      <div
        className={clsx(
          "relative overflow-hidden",
          fullBleed ? "" : "rounded-lg border border-line bg-sunken",
          ratioClassName[image.ratio]
        )}
      >
        {valid ? (
          <Image
            src={source.src}
            alt={resolveAlt(image, locale)}
            fill
            // The LCP candidate: eager and prioritised, never lazy.
            priority
            sizes={sizes ?? "100vw"}
            placeholder={source.blurDataURL ? "blur" : undefined}
            blurDataURL={source.blurDataURL}
            className="object-cover"
          />
        ) : null}
      </div>
      {hasCaptionBlock ? (
        <figcaption className="flex flex-col gap-0.5">
          {caption ? (
            <Text as="span" step="body-sm" className="text-muted">
              {caption}
            </Text>
          ) : null}
          {image.credit ? (
            <Text as="span" step="body-sm" className="text-muted">
              {image.credit}
            </Text>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
