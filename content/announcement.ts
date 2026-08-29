/**
 * Site-wide announcement banner.
 *
 * This is the committed, editorial sibling of the runtime emergency system in
 * `lib/emergency.ts`. The emergency banner is toggled in Edge Config during a
 * live campus incident and links to a pre-prepared `/emergency/*` scenario.
 * This banner is different: it is a planned advisory that ships in the repo,
 * points at an ordinary news article, and goes live on deploy. Use it for a
 * nearby event students should know about that is not a campus life-safety
 * emergency (an area to avoid, a travel disruption, a public warning).
 *
 * To take it down early, set `active: false` and deploy. It also expires on its
 * own at `expiresAt`: from that moment `SiteAnnouncement` renders nothing and a
 * client-side timer removes it from any page a visitor already has open, so it
 * disappears without a redeploy. Only one advisory lives here at a time;
 * replace the whole object when the next one comes along.
 */
import type { Locale } from "@/lib/i18n";

/** Amber (warning) reads more urgent than blue (info); neither reads as a red emergency. */
export type AnnouncementSeverity = "info" | "warning";

export type SiteAnnouncement = {
  active: boolean;
  severity: AnnouncementSeverity;
  /** Internal destination without the locale prefix, e.g. `/news/<slug>`. */
  href: string;
  /** Short banner line per locale, written natively (no trailing call to action). */
  message: Record<Locale, string>;
  /** The link label appended after the message, per locale. */
  cta: Record<Locale, string>;
  /**
   * ISO 8601 instant after which the banner stops showing, without a redeploy.
   * The server stops rendering it once the build/revalidation passes this time,
   * and an open page removes it on a client timer at exactly this moment.
   */
  expiresAt: string;
};

export const announcement: SiteAnnouncement = {
  active: true,
  severity: "warning",
  href: "/news/khlong-thom-center-fire-advisory",
  // 24 hours from when this advisory went up (2026-08-29 09:52 UTC).
  expiresAt: "2026-08-30T09:52:00Z",
  message: {
    en: "A fire has badly damaged Khlong Thom Center near campus. Avoid the area and allow extra time to travel.",
    th: "เพลิงไหม้คลองถมเซ็นเตอร์ใกล้มหาวิทยาลัยเสียหายหนัก เลี่ยงพื้นที่ และเผื่อเวลาเดินทาง",
  },
  cta: {
    en: "Read the safety advice",
    th: "อ่านคำแนะนำด้านความปลอดภัย",
  },
};

/** The banner's expiry as epoch milliseconds, or null when unset or unparseable. */
export function announcementExpiry(): number | null {
  const parsed = Date.parse(announcement.expiresAt);
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * Whether the banner should show at time `now` (epoch ms): it must be active
 * and not past its expiry. Kept here, out of the component render path, so the
 * one impure read of the clock lives in a plain, testable function.
 */
export function isAnnouncementLive(now: number = Date.now()): boolean {
  if (!announcement.active) return false;
  const expiresAt = announcementExpiry();
  return expiresAt === null || now < expiresAt;
}
