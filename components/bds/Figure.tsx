import Image from "next/image";
import clsx from "clsx";

import { altTextProblems, type AspectRatio, type ImageField } from "@/components/bds/imageContract";
import { Text } from "@/components/bds/Type";
import type { Locale } from "@/lib/i18n";

/**
 * BIRSA Design System: `Figure` (REDESIGN-2.0 §4.7B, media cluster).
 *
 * The workhorse: an image with an optional caption and credit, at one of the
 * three contract aspect ratios (`components/bds/imageContract.ts`). Every
 * other image component in this cluster (`CardImage`, `HeroImage`, `Gallery`,
 * `Portrait`) builds on the same ratio map and the same validation gate
 * defined here, so a fix to either reaches every image on the site at once.
 *
 * THE IDENTITY DOES NOT CHANGE (§4.7A). Images sit ON the cream-editorial
 * page, they do not bleed off it: a hairline `border-line` and a `bg-sunken`
 * inset (so a white-heavy photograph does not float against cream) with
 * generous rounding, both of which invert automatically in dark mode because
 * `--color-line` and `--color-sunken` are theme tokens, not fixed colours.
 * There is deliberately no `dark:` filter rule here to darken bright source
 * photographs the way `app/globals.css`'s `.osm-tile-layer` filter darkens
 * OSM tiles: that filter lives in a stylesheet this cluster does not own
 * (`app/globals.css` is frozen, §5), and a border/inset treatment already
 * satisfies §4.7A's "the same treatment inverted in dark mode" on its own
 * terms. If a future wave wants the OSM-style brightness filter applied to
 * content photographs too, it is a small addition to `app/globals.css` by
 * whichever agent owns that file next; see this cluster's report.
 *
 * CAPTIONS AND CREDITS ARE REAL TEXT, NEVER BAKED INTO THE IMAGE (§4.7C).
 * They render as `<figcaption>` text below the image, in the muted tone,
 * never as a scrim over it: "never text over an image" (§4.7A), because
 * contrast cannot be guaranteed across an arbitrary photograph.
 *
 * BILINGUAL CONTENT, NOT A DICTIONARY. `ImageField.alt` and `.caption` are
 * `{ en, th }` pairs stored on the content item itself (the frozen contract
 * requires both locales, publish-blocking, exactly as body copy), not UI
 * chrome strings, so this component takes the whole `ImageField` plus a
 * `locale` to read from it, the same way an MDX page already picks its own
 * locale's body copy. This is not a dictionary namespace: nothing here reads
 * `getDictionary` or `content/dictionaries/**`, and every UI-chrome string a
 * caller of this component might want (there are none today) would still
 * come in as a plain prop, as every other component in this cluster's TSDoc
 * says explicitly.
 *
 * ACCESSIBILITY, ENFORCED NOT ENCOURAGED (§4.7C). `alt` is required in both
 * locales and publish-blocking in the schema; that validation should mean an
 * invalid `ImageField` never reaches a component at all. If one does anyway,
 * `assertValidImage` below turns it into a loud, unmissable throw in
 * development (never a silently broken page) and, in production, logs the
 * failure and renders nothing: an image with no accessible name is a worse
 * outcome on a live site than a missing one, and reaching this fallback in
 * production is itself a finding, because §10 was supposed to have caught it
 * at publish time.
 *
 * PERFORMANCE (§4.7D). `Figure` never sets `next/image`'s `priority`: only
 * `HeroImage` does, and it does so unconditionally rather than through a
 * prop, so "only the hero gets it" is a structural guarantee rather than a
 * convention a caller could get wrong. Resolving `ImageField.assetId` into an
 * actual URL is the CMS asset pipeline's job (§4.7D, §4.7F) and Gate 1 in
 * `docs/DECISIONS-2.0.md` (the Sanity plan) is blocked, so no such resolver
 * exists anywhere in this checkout yet. `Figure` and its siblings take the
 * already-resolved `ImageSource` as a plain prop instead, the same way
 * `components/about/CommitteeRoster.tsx` already passes a resolved `src`
 * straight to `next/image`; a future resolver only has to produce this shape.
 */

/**
 * Maps a contract aspect ratio to the Tailwind class that sets it. The ONLY
 * place this mapping exists: every sibling component in this cluster imports
 * it from here rather than repeating the three ratios. No arbitrary height
 * is ever set anywhere in this cluster, so cards never jump and cumulative
 * layout shift stays at zero (§4.7A).
 */
export const ratioClassName: Record<AspectRatio, string> = {
  "16:9": "aspect-[16/9]",
  "4:3": "aspect-[4/3]",
  "1:1": "aspect-square",
};

/**
 * A resolved image asset: what a CMS asset resolver produces from
 * `ImageField.assetId`, once one exists. See the file header note above for
 * why this cluster stops here rather than writing that resolver itself.
 */
export type ImageSource = {
  src: string;
  /** A low-quality placeholder data URI, when the pipeline supplies one (§4.7D). Omit to render with no placeholder. */
  blurDataURL?: string;
};

/** A reasonable default for `sizes` when a caller does not know its own layout better. Callers that do (a grid column, a fixed-width card) should pass their own. */
export const DEFAULT_IMAGE_SIZES = "(min-width: 1024px) 50vw, 100vw";

/**
 * The one validation gate every image component in this cluster calls
 * before rendering a pixel. See the file header note on why development
 * throws and production renders nothing.
 */
export function assertValidImage(image: ImageField, componentName: string): boolean {
  const problems = altTextProblems(image);
  if (problems.length === 0) return true;

  const message = `bds/${componentName}: invalid ImageField (${problems.join(", ")}). This is meant to be caught by CMS publish validation (REDESIGN-2.0 SS4.7C, SS10); reaching render means that validation was bypassed.`;

  if (process.env.NODE_ENV !== "production") {
    throw new Error(message);
  }

  // eslint-disable-next-line no-console -- deliberate: the one place a
  // production image failure gets recorded once it renders nothing.
  console.error(message);
  return false;
}

/** Resolves the alt text to render for one locale, given a valid `ImageField`. */
export function resolveAlt(image: ImageField, locale: Locale): string {
  if (image.decorative) return "";
  return image.alt?.[locale] ?? "";
}

/** Resolves the caption text to render for one locale, if the field carries one. */
export function resolveCaption(image: ImageField, locale: Locale): string | undefined {
  return image.caption?.[locale];
}

export type FigureProps = {
  image: ImageField;
  locale: Locale;
  source: ImageSource;
  sizes?: string;
  className?: string;
};

/**
 * An image with an optional caption and credit, at one of the three contract
 * aspect ratios. See the file header for the accessibility gate, the ratio
 * map and why this component never sets `priority`.
 */
export default function Figure({ image, locale, source, sizes, className }: FigureProps) {
  const valid = assertValidImage(image, "Figure");
  const caption = resolveCaption(image, locale);
  const hasCaptionBlock = !image.decorative && (caption || image.credit);

  return (
    <figure className={clsx("flex flex-col gap-2", className)}>
      <div
        className={clsx(
          "relative overflow-hidden rounded-lg border border-line bg-sunken",
          ratioClassName[image.ratio]
        )}
      >
        {valid ? (
          <Image
            src={source.src}
            alt={resolveAlt(image, locale)}
            fill
            sizes={sizes ?? DEFAULT_IMAGE_SIZES}
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
