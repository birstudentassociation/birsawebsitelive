import clsx from "clsx";

import type { LoanStatus } from "@/lib/inventory/types";
import { typeClass } from "@/components/bds/tokens";

/**
 * BIRSA Design System: `Tag` (REDESIGN-2.0 `components/bds/manifest.ts`,
 * status cluster, merged from `components/Tag.tsx` and
 * `components/inventory/StatusPill.tsx`, GDS `tag`).
 *
 * THE RULE THIS COMPONENT ENFORCES (manifest `usage`): the state of ONE
 * thing in a list or on a `TaskList`, for example a loan's status or a
 * task's completion. 1.0 had two components doing this job with two
 * different colour tables; there is now one, and `variant` is the single
 * source of truth for both.
 *
 * `children` IS THE WORD. Colour never carries the meaning alone: a Tag
 * that is only a colour is a Tag a colourblind reader cannot read, so
 * `children` is required and always visible, never optional, never hidden.
 *
 * THE STATUS VOCABULARY, taken from the source rather than guessed:
 *   - `components/Tag.tsx`'s three category variants: `neutral`, `brand`, `forest`.
 *   - `components/inventory/StatusPill.tsx`'s eight `LoanStatus` values:
 *     `pending`, `approved`, `checked_out`, `overdue`, `returned`,
 *     `rejected`, `cancelled`, `no_show`.
 * `loanStatusVariant` below maps every one of those eight to a `TagVariant`
 * so a caller migrating `StatusPill` needs no new colour decision of its
 * own.
 *
 * COLOUR, AND THE CONTRACT GAP THIS COMPONENT DOES NOT PAPER OVER:
 * `components/bds/tokens.ts`'s `contrastPairs` asserts exactly four
 * semantic text-on-tint pairs (success, warning, error, info) plus
 * `ink`/`sunken` and `brand-deep`/`surface` among others. Neither
 * `Tag.tsx`'s original `brand` variant (`bg-brand-tint text-brand-deep`) nor
 * its `forest` variant (`bg-forest-tint text-forest`), nor `StatusPill`'s
 * `checked_out` (`bg-forest-tint text-forest`) or its `cancelled`/`no_show`
 * (`bg-sunken text-muted`), are asserted pairs. This component does not
 * invent assertions for them:
 *   - `checked_out` maps to the `info` variant, not a new `forest` variant.
 *     `--color-forest`/`--color-forest-tint` and `--color-info`/
 *     `--color-info-tint` are declared to the SAME hex values in both
 *     themes in `components/bds/tokens.css` (`#2f5e4e`/`#e7efe9` light,
 *     `#93c4b1`/`#22312a` dark), so this changes zero rendered pixels while
 *     using the pairing `contrastPairs` actually checks.
 *   - `cancelled`/`no_show` map to `neutral`, styled `bg-sunken text-ink`
 *     (the asserted "body text in a well" pairing) rather than
 *     `StatusPill`'s `text-muted`, since `muted`/`sunken` is not asserted.
 *   - `brand` (a category tag, not a status) is restyled as a bordered chip
 *     on `bg-surface` with `text-brand-deep`, the asserted "link text on a
 *     card" pairing, rather than filled `bg-brand-tint`.
 * This is reported in the Wave 2 status cluster report as a contract gap:
 * `forest`/`forest-tint` and `brand-tint`/`brand-deep` have no asserted
 * pairing at all, and if a future component genuinely needs the `forest`
 * hue as distinct from `info` (they are visually identical today), Wave 0
 * needs to give `forest` its own tint value and assert it.
 *
 * TYPE SCALE: uses `typeClass("body-sm")` directly rather than wrapping in
 * `Text` (`components/bds/Type.tsx`), because `Text` does not forward
 * `aria-label`, which this component needs to pass through for a caller
 * whose visible text is ambiguous on its own (matching 1.0's `Tag.tsx`
 * API). This still reaches for the type scale, never a raw Tailwind
 * `text-*` utility: `typeClass` is the same lookup `Text` uses internally.
 */

export type TagVariant = "neutral" | "brand" | "info" | "success" | "warning" | "error";

const toneByVariant: Record<TagVariant, string> = {
  neutral: "bg-sunken text-ink",
  brand: "border border-brand bg-surface text-brand-deep",
  info: "bg-info-tint text-info",
  success: "bg-success-tint text-success",
  warning: "bg-warning-tint text-warning",
  error: "bg-error-tint text-error",
};

/**
 * `LoanStatus` (`lib/inventory/types.ts`) to `TagVariant`, preserving
 * `StatusPill`'s colour intent within asserted pairs only. See the
 * file-level TSDoc for `checked_out` and `cancelled`/`no_show`.
 */
export const loanStatusVariant: Record<LoanStatus, TagVariant> = {
  pending: "warning",
  approved: "info",
  checked_out: "info",
  overdue: "error",
  returned: "success",
  rejected: "error",
  cancelled: "neutral",
  no_show: "neutral",
};

export type TagProps = {
  variant?: TagVariant;
  className?: string;
  /** The visible word. Required: this is what keeps the state readable without colour. */
  children: React.ReactNode;
  /** Optional accessible name override, e.g. "Price range: ฿฿" when the visible text alone is ambiguous. */
  "aria-label"?: string;
};

export default function Tag({
  variant = "neutral",
  className,
  children,
  "aria-label": ariaLabel,
}: TagProps) {
  return (
    <span
      aria-label={ariaLabel}
      className={clsx(
        typeClass("body-sm"),
        "inline-flex items-center rounded-full px-2.5 py-1 font-semibold tracking-wide",
        toneByVariant[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
