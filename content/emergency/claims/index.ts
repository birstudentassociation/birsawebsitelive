/**
 * Claims guides linked from emergency guides, keyed by scenario id. Each one is
 * served at `/emergency/<scenario>/claims`, one part per page, with a checker
 * at `/emergency/<scenario>/claims/check` when `checkers` has an entry.
 */
import type { Locale } from "@/lib/i18n";
import type { ScenarioId } from "@/content/emergency/scenarios";
import type { EmergencyGuide } from "@/content/emergency/types";
import flooding from "@/content/emergency/claims/flooding";

export const claimsGuides: Partial<Record<ScenarioId, EmergencyGuide>> = { flooding };

export function getClaimsGuide(scenario: string): EmergencyGuide | null {
  return Object.prototype.hasOwnProperty.call(claimsGuides, scenario)
    ? (claimsGuides[scenario as ScenarioId] ?? null)
    : null;
}

/** Site path of one part. The first part is served at the guide's own path. */
export function guidePartPath(scenario: string, guide: EmergencyGuide, index: number): string {
  const base = `/emergency/${scenario}/${guide.slug}`;
  return index === 0 ? base : `${base}/${guide.en.parts[index]!.slug}`;
}

export type GuideUiCopy = {
  contents: string;
  previous: string;
  next: string;
  /** "Part 3 of 12". */
  partOf: (current: number, total: number) => string;
};

export const guideUiCopy: Record<Locale, GuideUiCopy> = {
  en: {
    contents: "Contents",
    previous: "Previous",
    next: "Next",
    partOf: (current, total) => `Part ${current} of ${total}`,
  },
  th: {
    contents: "สารบัญ",
    previous: "ก่อนหน้า",
    next: "ถัดไป",
    partOf: (current, total) => `ส่วนที่ ${current} จาก ${total}`,
  },
};
