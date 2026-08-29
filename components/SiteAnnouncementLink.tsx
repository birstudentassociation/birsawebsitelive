"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AnnouncementSeverity } from "@/content/announcement";

type Props = {
  href: string;
  message: string;
  cta: string;
  severity: AnnouncementSeverity;
  /** Epoch milliseconds after which the banner hides itself, or null for no expiry. */
  expiresAt: number | null;
};

/**
 * The advisory banner link. The server only renders this while the notice is
 * live, so it starts visible on both server and client (no hydration
 * mismatch). The effect then hides it the moment `expiresAt` passes, so a tab
 * left open across the 24-hour mark drops the banner on its own rather than
 * carrying a stale notice until the next navigation.
 *
 * The whole banner is one link whose accessible name is its visible text
 * (message + cta).
 */
const severityClasses: Record<AnnouncementSeverity, string> = {
  warning: "border-warning bg-warning-tint text-ink",
  info: "border-info bg-info-tint text-ink",
};

export default function SiteAnnouncementLink({ href, message, cta, severity, expiresAt }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (expiresAt === null) return;
    // Clamp to 0 so an already-expired notice hides on the next tick, and keep
    // the state update inside the async callback rather than the effect body.
    const timer = setTimeout(() => setVisible(false), Math.max(0, expiresAt - Date.now()));
    return () => clearTimeout(timer);
  }, [expiresAt]);

  if (!visible) return null;

  return (
    <Link
      href={href}
      className={`${severityClasses[severity]} block border-b px-4 py-2 text-center text-sm font-semibold hover:opacity-90`}
    >
      <span>{message}</span> <span className="underline">{cta}</span>
    </Link>
  );
}
