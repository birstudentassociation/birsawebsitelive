import Link from "next/link";
import clsx from "clsx";

import Icon, { type IconName } from "@/components/bds/Icon";
import { Text } from "@/components/bds/Type";
import type { EmergencySeverity } from "@/content/emergency/types";

/**
 * BIRSA Design System: `EmergencyBanner` (REDESIGN-2.0
 * `components/bds/manifest.ts`, status cluster, kept from
 * `components/EmergencyBanner.tsx`).
 *
 * THE RULE THIS COMPONENT ENFORCES (manifest `usage`, REDESIGN-2.0 §6.6):
 * site-wide, driven by Vercel Edge Config, deliberately independent of the
 * CMS and the database (`lib/emergency.ts`), because the one thing that
 * must keep working during an incident must not depend on the thing most
 * likely to be part of one. This component takes NO position on that
 * mechanism: it is pure presentation over the same props 1.0's version
 * took (`href`, `message`, `cta`, `severity`), so `lib/emergency.ts` and its
 * three refresh paths (background revalidation, on-demand revalidation, the
 * client poll in `components/EmergencyBannerClient.tsx`, none of them owned
 * by this wave) are unchanged by this file existing. Never render this for
 * anything short of an actual emergency: it is the one banner site-wide
 * that a reader cannot dismiss, on purpose, and that only works if it is
 * rare.
 *
 * FIX CARRIED OVER FROM `Notice`'s DRAFT: 1.0's `EmergencyBanner.tsx` used
 * `text-ink` on every severity's tint (`border-error bg-error-tint
 * text-ink`, and the `warning` equivalent), which is not a pairing
 * `components/bds/tokens.ts`'s `contrastPairs` asserts. This version uses
 * the semantic foreground instead (`text-error` on `error-tint`,
 * `text-warning` on `warning-tint`), exactly the fix the status cluster's
 * `Notice` draft already made for the same bug, so the same defect is not
 * shipped twice under two different component names.
 *
 * ROLE: the live-region role sits on a wrapping `div`, not on the `Link`
 * itself, so the anchor keeps its native link semantics (a screen reader
 * still announces "link", not just "alert"). `critical` uses
 * `role="alert"`, an assertive interruption, deliberately: a critical
 * scenario (fire, an active threat) is the one case site-wide where BUILD-
 * BRIEF-2.0 §7's "used sparingly and deliberately" is met. `warning` and
 * `info` use `role="status"`, polite, appropriate for an advisory a reader
 * benefits from hearing without cutting off whatever they were already
 * doing.
 *
 * MEANING NEVER TRAVELS ON COLOUR ALONE: `message` and `cta` are always
 * real, visible text (this was already true in 1.0), and this version adds
 * a severity icon, `aria-hidden` per `Icon`'s default, as reinforcement
 * rather than a replacement for the text.
 *
 * TARGET SIZE: `min-h-11` (44px) on the link, since the banner's own text
 * at `body-sm` would otherwise sit under the 44px minimum target
 * (BUILD-BRIEF-2.0 §7) at the smallest supported zoom despite spanning the
 * full page width.
 */

export type EmergencyBannerProps = {
  href: string;
  message: string;
  cta: string;
  severity: EmergencySeverity;
};

const toneBySeverity: Record<EmergencySeverity, string> = {
  critical: "border-error bg-error-tint text-error",
  warning: "border-warning bg-warning-tint text-warning",
  info: "border-line bg-cream text-ink",
};

const iconBySeverity: Record<EmergencySeverity, IconName> = {
  critical: "circle-alert",
  warning: "warning-triangle",
  info: "info-circle",
};

export default function EmergencyBanner({ href, message, cta, severity }: EmergencyBannerProps) {
  return (
    <div role={severity === "critical" ? "alert" : "status"}>
      <Link
        href={href}
        className={clsx(
          "flex min-h-11 items-center justify-center gap-2 border-b px-4 py-2 text-center hover:opacity-90",
          toneBySeverity[severity]
        )}
      >
        <Icon name={iconBySeverity[severity]} className="shrink-0" />
        {/* Accessible name is the visible text (message + cta): no aria-label needed. */}
        <Text as="span" step="body-sm" className="font-semibold">
          {message} <span className="underline">{cta}</span>
        </Text>
      </Link>
    </div>
  );
}
