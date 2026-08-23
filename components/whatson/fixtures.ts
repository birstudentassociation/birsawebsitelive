import type { Locale } from "@/lib/i18n";

/**
 * `/whats-on/sport` (Wave 5, `components/whatson/`).
 *
 * A confirmed sport fixture. Nobody at BIRSA has confirmed a fixture yet
 * (BUILD-BRIEF-2.0 §3: "anything about BIRSA's internal committee, activity
 * or clubs not covered above is unknown"), so `sportFixtures` below is
 * genuinely empty rather than a placeholder waiting to be filled with
 * invented dates or opponents. `/whats-on/sport` reads this list and, when
 * it is empty, shows an honest "no fixtures published yet" state instead.
 *
 * `club` is a slug into `content/clubs/{en,th}/*.mdx` (`lib/content.ts`
 * `getClubEntry`), so a fixture always links back to its BIR club's own
 * page rather than repeating the club's name as plain text.
 */
export type SportFixture = {
  id: string;
  /** Inclusive date, `YYYY-MM-DD`. */
  date: string;
  /** Slug of the BIR club fielding the fixture. */
  club: string;
  opponent: Record<Locale, string>;
  venue?: Record<Locale, string>;
};

export const sportFixtures: SportFixture[] = [];
