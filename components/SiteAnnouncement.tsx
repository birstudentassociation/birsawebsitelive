import { announcement, announcementExpiry, isAnnouncementLive } from "@/content/announcement";
import { localeHref, type Locale } from "@/lib/i18n";
import SiteAnnouncementLink from "@/components/SiteAnnouncementLink";

/**
 * Site-wide advisory notice, shown above the header on every page while
 * `content/announcement.ts` is active and its `expiresAt` is still in the
 * future. Unlike the runtime emergency banner it is committed content that goes
 * live on deploy, and it links to an ordinary news article rather than an
 * `/emergency/*` scenario.
 *
 * This server component decides whether the banner should appear at render time
 * and picks the locale copy. The link itself is a small client component so it
 * can drop off an already-open page the instant `expiresAt` passes, without
 * waiting for the next background revalidation.
 */
export default function SiteAnnouncement({ locale }: { locale: Locale }) {
  if (!isAnnouncementLive()) return null;

  return (
    <SiteAnnouncementLink
      href={localeHref(locale, announcement.href)}
      message={announcement.message[locale]}
      cta={announcement.cta[locale]}
      severity={announcement.severity}
      expiresAt={announcementExpiry()}
    />
  );
}
