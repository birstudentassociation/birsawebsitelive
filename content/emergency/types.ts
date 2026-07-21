/**
 * Shape of a pre-prepared emergency scenario. The content lives in the repo
 * (reviewed, translated, ready) so that during a real incident no one has to
 * write public safety copy under pressure. Edge Config only selects which
 * scenario is live (see `lib/emergency.ts`).
 */
import type { Locale } from "@/lib/i18n";

/** Drives the banner colour: info (calm), warning (amber), critical (red). */
export type EmergencySeverity = "info" | "warning" | "critical";

export type EmergencySection = {
  heading: string;
  /** Short paragraphs. At least one of `body`/`items` should be present. */
  body?: string[];
  /** Bulleted points. */
  items?: string[];
};

export type EmergencyContact = {
  label: string;
  value: string;
  /** Optional link target, e.g. `tel:191`. */
  href?: string;
};

/** All copy for one scenario, in one language. */
export type EmergencyContent = {
  /** Short, urgent one-liner for the site-wide banner (no call to action). */
  bannerMessage: string;
  title: string;
  lede: string;
  /** The most important immediate steps, shown first as an ordered list. */
  immediateActions: string[];
  /** Further guidance, grouped into headed sections. */
  sections: EmergencySection[];
  /** Scenario-specific contacts, shown in addition to the global BIRSA ones. */
  extraContacts?: EmergencyContact[];
};

export type EmergencyScenario = {
  /** Kebab-case id; also the URL segment, e.g. `/emergency/flooding`. */
  id: string;
  severity: EmergencySeverity;
  en: EmergencyContent;
  th: EmergencyContent;
};

/** Pick the content block for a locale. */
export function scenarioContent(scenario: EmergencyScenario, locale: Locale): EmergencyContent {
  return scenario[locale];
}
