"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";

import Icon, { type IconName } from "@/components/bds/Icon";
import { Heading, Text, type HeadingLevel } from "@/components/bds/Type";

/**
 * BIRSA Design System: `NotificationBanner` (REDESIGN-2.0
 * `components/bds/manifest.ts`, status cluster, split from
 * `components/Notice.tsx`, GDS `notification-banner`).
 *
 * THE RULE THIS COMPONENT ENFORCES (manifest `usage`, §8 heuristic 4): a
 * PAGE-LEVEL RESULT of something the reader just did, at the top of the
 * page, important enough to take focus. NOT for standing information: a
 * fact that is true regardless of what the reader just did is `InsetText`
 * or plain content, and an inline callout that is part of the page's own
 * flow, not a result of an action, is `Notice`. Re-adding "standing info"
 * variants here is exactly the four-boxes-with-no-rule defect this split
 * fixes.
 *
 * FOCUS MANAGEMENT (BUILD-BRIEF-2.0 §7): the banner is focusable
 * (`tabIndex={-1}`, so it is reachable by script but not by Tab) and
 * receives focus once, on mount, via the empty-dependency `useEffect`
 * below. Mounting is deliberately what "new" means here: a page-level
 * result exists because the reader navigated to a fresh page (a form
 * submit, a redirect after an action), which is exactly when this
 * component's caller creates a new instance of it. It does NOT re-focus on
 * every re-render of an already-mounted banner, which is what "not steal
 * focus on every render" requires: a parent re-rendering for an unrelated
 * reason (a theme toggle, a language switch on the same result) leaves an
 * already-focused reader wherever they moved their focus to next. If a
 * single page ever needs to show a second, different result without a full
 * navigation, mount a new `NotificationBanner` under a fresh `key` rather
 * than mutating this one's props, so the new instance's own mount fires the
 * effect again. `autoFocus` exists to opt out entirely (default `true`)
 * for the rare case a banner is not the newest thing on the page.
 *
 * ROLE: `role="status"` for `success`, `info` and `warning`, a polite live
 * region appropriate for a result the reader benefits from hearing but that
 * does not need to interrupt whatever their assistive technology is doing.
 * `role="alert"` ONLY for `variant="error"`: an assertive interruption,
 * used here deliberately because a failed submission is the one page-level
 * result where missing the announcement costs the reader a repeated
 * attempt or a lost draft, and BUILD-BRIEF-2.0 §7 asks for `alert` to be
 * reserved for exactly that kind of case, not used by default.
 *
 * COLOUR: text colour is the semantic foreground on its own tint,
 * matching `components/bds/tokens.ts`'s `contrastPairs` exactly as
 * `Notice` does (success on success-tint, warning on warning-tint, and so
 * on). Colour never carries the result alone: `title` and `children` are
 * always real, visible text, and every variant carries its own
 * `aria-hidden` icon on top of that, never instead of it.
 */

export type NotificationBannerVariant = "success" | "info" | "warning" | "error";

const iconByVariant: Record<NotificationBannerVariant, IconName> = {
  success: "check",
  info: "info-circle",
  warning: "warning-triangle",
  error: "circle-alert",
};

const toneByVariant: Record<NotificationBannerVariant, string> = {
  success: "border-success bg-success-tint text-success",
  info: "border-info bg-info-tint text-info",
  warning: "border-warning bg-warning-tint text-warning",
  error: "border-error bg-error-tint text-error",
};

export type NotificationBannerProps = {
  variant?: NotificationBannerVariant;
  /** The result, in a few words, e.g. "Application submitted". Caller-supplied: this component owns no dictionary namespace. */
  title: string;
  /** Heading level for `title`. Defaults to 2: the page's own `h1` stays the main heading. */
  headingLevel?: HeadingLevel;
  children: React.ReactNode;
  /** Focus the banner once, on mount. Default `true`; see the file TSDoc. */
  autoFocus?: boolean;
  className?: string;
};

export default function NotificationBanner({
  variant = "success",
  title,
  headingLevel = 2,
  children,
  autoFocus = true,
  className,
}: NotificationBannerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
    // Deliberately empty deps: focus once on mount, never on a later
    // re-render of the same instance. See the file TSDoc.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role={variant === "error" ? "alert" : "status"}
      className={clsx("flex gap-3 rounded-md border-l-4 p-4", toneByVariant[variant], className)}
    >
      <Icon name={iconByVariant[variant]} className="text-heading-2 shrink-0" />
      <div className="min-w-0 flex-1">
        <Heading level={headingLevel} step="heading-3">
          {title}
        </Heading>
        <Text step="body" className="mt-1">
          {children}
        </Text>
      </div>
    </div>
  );
}
