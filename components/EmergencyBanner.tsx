import Link from "next/link";
import type { EmergencySeverity } from "@/content/emergency/types";

export type EmergencyBannerProps = {
  href: string;
  message: string;
  cta: string;
  severity: EmergencySeverity;
};

/**
 * Site-wide emergency notice, shown above everything when emergency mode is
 * switched on via Edge Config (see `lib/emergency.ts`). Colour follows the
 * scenario severity so a critical alert reads red and a calmer advisory reads
 * amber. Not dismissible: every visitor on every page should see it while it
 * is active.
 *
 * The whole banner is a single link to the active scenario page for more
 * detail. Its accessible name is the visible text (message + cta), so no
 * `aria-label` is needed.
 */
const severityClasses: Record<EmergencySeverity, string> = {
  critical: "border-error bg-error-tint text-ink",
  warning: "border-warning bg-warning-tint text-ink",
  info: "border-line bg-cream text-ink",
};

export default function EmergencyBanner({ href, message, cta, severity }: EmergencyBannerProps) {
  return (
    <Link
      href={href}
      className={`${severityClasses[severity]} block border-b px-4 py-2 text-center text-sm font-semibold hover:opacity-90`}
    >
      <span>{message}</span> <span className="underline">{cta}</span>
    </Link>
  );
}
