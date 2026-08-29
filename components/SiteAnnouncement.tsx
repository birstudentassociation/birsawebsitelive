import Link from "next/link";
import { announcement } from "@/content/announcement";
import { localeHref, type Locale } from "@/lib/i18n";

/**
 * Site-wide advisory notice, shown above the header on every page while
 * `content/announcement.ts` has `active: true`. Unlike the runtime emergency
 * banner it is committed content that goes live on deploy, and it links to an
 * ordinary news article rather than an `/emergency/*` scenario.
 *
 * Server-rendered with no client JavaScript: the copy is fixed at build time,
 * so there is nothing to poll. The whole banner is one link whose accessible
 * name is its visible text (message + cta).
 */
const severityClasses: Record<"info" | "warning", string> = {
  warning: "border-warning bg-warning-tint text-ink",
  info: "border-info bg-info-tint text-ink",
};

export default function SiteAnnouncement({ locale }: { locale: Locale }) {
  if (!announcement.active) return null;

  return (
    <Link
      href={localeHref(locale, announcement.href)}
      className={`${severityClasses[announcement.severity]} block border-b px-4 py-2 text-center text-sm font-semibold hover:opacity-90`}
    >
      <span>{announcement.message[locale]}</span>{" "}
      <span className="underline">{announcement.cta[locale]}</span>
    </Link>
  );
}
