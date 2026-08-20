import clsx from "clsx";

import Icon, { type IconName } from "@/components/bds/Icon";
import { Text } from "@/components/bds/Type";

/**
 * BIRSA Design System: `Notice` (REDESIGN-2.0 `components/bds/manifest.ts`,
 * status cluster, split from `components/Notice.tsx`).
 *
 * THE RULE THIS COMPONENT ENFORCES (manifest `usage`, §8 heuristic 4):
 * `Notice` is for INLINE CONTENT that needs setting apart within a page's
 * flow: a callout that sits among the rest of the prose and is read as part
 * of it. It is NOT a result. If the thing you are building is:
 *
 *   - the outcome of something the reader just did, shown at the top of the
 *     page and important enough to take focus, use `NotificationBanner`;
 *   - a consequence the reader must not miss, use `WarningText`;
 *   - a quoted or emphasised aside with no info/success/warning/error
 *     meaning, use `InsetText`.
 *
 * 1.0's `Notice.tsx` did all four jobs with one `variant` prop and no rule
 * for which to reach for. Re-merging any of the three above back into this
 * component reintroduces exactly that.
 *
 * ROLE: none. `Notice` is static content present when the page renders, in
 * the reader's normal reading order, not a live update to announce. A live
 * region role on content that is simply part of the page is noise, not help
 * (`role="status"` is reserved for `NotificationBanner`, which really is a
 * fresh result). If a `Notice` is ever injected into a page after load
 * without a navigation, wrap it in a `NotificationBanner` instead of adding
 * a role here.
 *
 * COLOUR: text colour is the semantic foreground on its own tint
 * (`text-success` on `bg-success-tint`, and so on), which is exactly the
 * pairing `components/bds/tokens.ts`'s `contrastPairs` asserts ("success
 * notice", "warning notice", "error notice and message", "info notice").
 * 1.0's `Notice.tsx` used `text-ink` on every tint instead, which is not an
 * asserted pairing; this version corrects that rather than carrying it
 * forward unasserted.
 *
 * MEANING NEVER TRAVELS ON COLOUR ALONE: every variant carries its own icon
 * (`aria-hidden`, per `Icon`'s default) and `children` is the visible word
 * that actually says what happened. There is no colour-only variant.
 */

export type NoticeVariant = "info" | "success" | "warning" | "error" | "placeholder";

const iconByVariant: Record<NoticeVariant, IconName> = {
  info: "info-circle",
  success: "check",
  warning: "warning-triangle",
  error: "circle-alert",
  // "placeholder" marks example content BIRSA has not written yet
  // (BUILD-BRIEF-2.0 §9). It is content lifecycle, not a status, but it
  // stays a Notice variant because it is exactly this component's job: an
  // inline aside set apart from the surrounding prose.
  placeholder: "pencil",
};

const toneByVariant: Record<NoticeVariant, string> = {
  info: "border-info bg-info-tint text-info",
  success: "border-success bg-success-tint text-success",
  warning: "border-warning bg-warning-tint text-warning",
  error: "border-error bg-error-tint text-error",
  placeholder: "border-warning bg-warning-tint text-warning",
};

export type NoticeProps = {
  variant?: NoticeVariant;
  /** Optional lead line, rendered bold above `children`. Caller-supplied text: this component owns no dictionary namespace. */
  title?: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Inline content set apart within a page's flow: info, success, warning and
 * error callouts, plus a `placeholder` variant for example content BIRSA
 * will replace. See the file-level TSDoc for the rule that keeps this from
 * being re-merged with `NotificationBanner`, `WarningText` or `InsetText`.
 */
export default function Notice({ variant = "info", title, className, children }: NoticeProps) {
  return (
    <div
      className={clsx("flex gap-3 rounded-md border-l-4 p-4", toneByVariant[variant], className)}
    >
      <Icon name={iconByVariant[variant]} className="text-heading-2 shrink-0" />
      <Text as="div" step="body" className="min-w-0 flex-1">
        {title ? (
          <Text as="p" step="body" className="mb-1 font-semibold">
            {title}
          </Text>
        ) : null}
        <div>{children}</div>
      </Text>
    </div>
  );
}
