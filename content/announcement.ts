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
 * To take it down, set `active: false` and deploy. Only one advisory lives here
 * at a time; replace the whole object when the next one comes along.
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
};

export const announcement: SiteAnnouncement = {
  active: true,
  severity: "warning",
  href: "/news/khlong-thom-center-fire-advisory",
  message: {
    en: "A fire has badly damaged Khlong Thom Center near campus. Avoid the area and allow extra time to travel.",
    th: "เพลิงไหม้คลองถมเซ็นเตอร์ใกล้มหาวิทยาลัยเสียหายหนัก เลี่ยงพื้นที่ และเผื่อเวลาเดินทาง",
  },
  cta: {
    en: "Read the safety advice",
    th: "อ่านคำแนะนำด้านความปลอดภัย",
  },
};
