/**
 * Shape of the emergency guidance. Everything here is committed content: the
 * guides are researched, written and reviewed in advance so nobody has to write
 * public safety copy under pressure, and an alert goes live by editing
 * `content/emergency/active.ts` and deploying.
 */
import type { Locale } from "@/lib/i18n";

export type LocalizedText = Record<Locale, string>;

/** Drives banner and badge colour. info reads calm, warning amber, critical red. */
export type EmergencySeverity = "info" | "warning" | "critical";

/** Background of the scenario hero band. Each tone keeps white text above 4.5:1. */
export type HeroTone = "red" | "black" | "purple" | "blue" | "green" | "brown" | "slate";

/** How the index page groups the guides. */
export type ScenarioGroup = "life" | "hazard" | "disruption" | "unrest" | "other";

export type EmergencySection = {
  /** Fragment id for the on-this-page links. Identical in both languages. */
  id: string;
  heading: string;
  /** Short paragraphs. */
  body?: string[];
  /** Steps where order matters, rendered as a numbered list. */
  steps?: string[];
  /** Points where order does not matter, rendered as bullets. */
  items?: string[];
};

/** All copy for one guide, in one language. */
export type EmergencyContent = {
  /** Sentence case, no colon. */
  title: string;
  /** One or two sentences saying who the guide is for and when to use it. */
  summary: string;
  /** Default site-wide banner line while this guide is the live alert. */
  banner: string;
  /** The few actions that matter most, in order. Shown first, in a box. */
  now: string[];
  sections: EmergencySection[];
};

export type EmergencySource = {
  /** Publisher and document, e.g. "DDPM, earthquake safety advice". */
  label: LocalizedText;
  href: string;
};

export type EmergencyScenario = {
  /** Kebab-case id; also the URL segment, e.g. `/emergency/flooding`. */
  id: string;
  severity: EmergencySeverity;
  hero: HeroTone;
  group: ScenarioGroup;
  /** Shown as large call buttons near the top. Ids from `contacts.ts`. */
  keyContacts: string[];
  /** Listed in full under "Contacts" after the key ones. */
  moreContacts: string[];
  /** Where the advice comes from, shown at the foot of the page. */
  sources: EmergencySource[];
  /** ISO date the guide was last checked against its sources. */
  reviewed: string;
  en: EmergencyContent;
  th: EmergencyContent;
};

/**
 * A live alert, set in `content/emergency/active.ts`. Times are ISO 8601 with
 * the Bangkok offset, e.g. `2026-09-25T14:05:00+07:00`.
 */
export type ActiveEmergency<Id extends string = string> = {
  scenario: Id;
  issuedAt: string;
  /** Replaces the guide's default banner line, e.g. to name a building. */
  banner?: LocalizedText;
  /** Newest first. The first entry's time is shown as "last updated". */
  updates?: {
    at: string;
    /** One or two sentences saying what changed. */
    text: LocalizedText;
    /** Optional detail, shown as bullets under the text. Same count in both languages. */
    points?: Record<Locale, string[]>;
  }[];
};
