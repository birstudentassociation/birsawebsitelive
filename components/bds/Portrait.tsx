import Image from "next/image";
import clsx from "clsx";

import { assertValidImage, resolveAlt } from "@/components/bds/Figure";
import type { ImageField } from "@/components/bds/imageContract";
import { findPortrait } from "@/lib/committee-portrait";
import type { Locale } from "@/lib/i18n";

/**
 * BIRSA Design System: `Portrait` (REDESIGN-2.0 §4.7B, §4.7F, media cluster).
 *
 * Committee portraits at 1:1. **Preserves `lib/committee-portrait.ts`'s
 * placeholder fallback behaviour exactly**, per this cluster's brief and
 * the manifest's own usage rule: the circular silhouette placeholder below
 * is the same shape, borders and icon as `components/about/CommitteeRoster.tsx`'s
 * `PortraitPlaceholder`, ported here so it has a design-system home; the
 * found-image branch keeps the same `h-24 w-24 rounded-full border border-line
 * object-cover` treatment that component already uses. Only the SOURCE
 * changes, later, from the filesystem to the CMS (§4.7F): `image.assetId` is
 * today `lib/committee-portrait.ts`'s filesystem stem (`content/committee.ts`'s
 * `key`), and after the Sanity migration it becomes the CMS asset reference.
 * Nothing about this component's behaviour changes when that happens, which
 * is the whole point of routing the lookup through `findPortrait` here
 * rather than through a resolved `src` prop the way `Figure` and its other
 * siblings do: `Portrait` IS the lookup, today, and stays the one place that
 * lookup lives, exactly as `lib/committee-portrait.ts`'s own header comment
 * asks for ("so the lookup lives in exactly one place").
 *
 * `image.ratio` must be `"1:1"`: committee portraits are square by the
 * house rule this component enforces, not a per-call-site choice. A
 * mismatch throws in development, the same loud-error contract every other
 * image component in this cluster uses (`Figure`'s `assertValidImage`,
 * generalised here to cover this component's one extra invariant).
 *
 * `image.decorative` is still the caller's call, not hardcoded: the
 * original `CommitteeRoster.tsx` always used `alt=""` because the member's
 * name renders as adjacent visible text beside every portrait it draws, so
 * marking the image decorative is normally the right choice wherever
 * `Portrait` is used the same way. A page that shows a portrait with no
 * adjacent name (a single officer's own profile page, say) should mark it
 * NOT decorative and supply real alt text instead; this component does not
 * assume either answer for the caller.
 */
export type PortraitProps = {
  image: ImageField;
  locale: Locale;
  className?: string;
};

function PortraitPlaceholder({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-line bg-sunken",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-12 w-12 text-muted"
      >
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 20c1.4-3.8 4.7-6 7.5-6s6.1 2.2 7.5 6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function Portrait({ image, locale, className }: PortraitProps) {
  if (image.ratio !== "1:1" && process.env.NODE_ENV !== "production") {
    throw new Error(
      `bds/Portrait: committee portraits are 1:1 only (got "${image.ratio}"). Fix the ImageField, do not add a new ratio here (imageContract.ts §4.7A: extending the ratio set is code, deliberately).`
    );
  }

  const valid = assertValidImage(image, "Portrait");
  const src = valid ? findPortrait(image.assetId) : null;

  if (!src) {
    return <PortraitPlaceholder className={className} />;
  }

  return (
    <Image
      src={src}
      alt={resolveAlt(image, locale)}
      width={160}
      height={160}
      className={clsx("h-24 w-24 shrink-0 rounded-full border border-line object-cover", className)}
    />
  );
}
